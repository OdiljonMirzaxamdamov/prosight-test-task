import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GetLocusQueryDto } from './dto/get-locus-query.dto';
import { LocusEntity } from './entities/locus.entity';
import { Role } from '../common/enums/role.enum';
import { Sideload } from '../common/enums/sideload.enum';
import { serializeLocus } from './serializers/locus.serializer';

type AuthUser = {
  id: number;
  username: string;
  role: Role;
};

@Injectable()
export class LocusService {
  private readonly limitedAllowedRegionIds: number[];

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(LocusEntity)
    private readonly locusRepository: Repository<LocusEntity>,
  ) {
    this.limitedAllowedRegionIds = this.getLimitedAllowedRegionIds();
  }

  async findAll(query: GetLocusQueryDto, user: AuthUser) {
    this.validatePermissions(query, user);

    const qb = this.locusRepository.createQueryBuilder('locus');

    const needsJoin =
      query.regionId !== undefined ||
      !!query.membershipStatus ||
      query.sideload === Sideload.LOCUS_MEMBERS ||
      user.role === Role.LIMITED;

    if (needsJoin) {
      if (user.role === Role.ADMIN && query.sideload === Sideload.LOCUS_MEMBERS) {
        qb.leftJoinAndSelect('locus.locusMembers', 'locusMembers');
      } else {
        qb.leftJoin('locus.locusMembers', 'locusMembers');
      }
    }

    this.applyFilters(qb, query, user);
    this.applySorting(qb, query);
    this.applyPagination(qb, query);

    const results = await qb.getMany();

    return results.map(item => serializeLocus(item, user.role, query.sideload));
  }

  private validatePermissions(query: GetLocusQueryDto, user: AuthUser) {
    if (user.role === Role.NORMAL && query.sideload) {
      throw new ForbiddenException('Normal user cannot use sideloading');
    }

    if (user.role === Role.LIMITED && query.sideload) {
      throw new ForbiddenException('Limited user cannot use sideloading');
    }

    if (
      user.role === Role.LIMITED &&
      query.regionId !== undefined &&
      !this.limitedAllowedRegionIds.includes(query.regionId)
    ) {
      throw new ForbiddenException('This regionId is not allowed');
    }
  }

  private applyFilters(
    qb: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
    user: AuthUser,
  ) {
    if (query.id !== undefined) {
      qb.andWhere('locus.id = :id', { id: query.id });
    }

    if (query.assemblyId) {
      qb.andWhere('locus.assembly_id = :assemblyId', {
        assemblyId: query.assemblyId,
      });
    }

    if (query.regionId !== undefined) {
      qb.andWhere('locusMembers.region_id = :regionId', {
        regionId: query.regionId,
      });
    }

    if (query.membershipStatus) {
      qb.andWhere('locusMembers.membership_status = :membershipStatus', {
        membershipStatus: query.membershipStatus,
      });
    }

    if (user.role === Role.LIMITED) {
      qb.andWhere('locusMembers.region_id IN (:...allowedRegionIds)', {
        allowedRegionIds: this.limitedAllowedRegionIds,
      });
    }
  }

  private applySorting(
    qb: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
  ) {
    const sortableFields: Record<string, string> = {
      id: 'locus.id',
      assemblyId: 'locus.assembly_id',
      locusStart: 'locus.locus_start',
      locusStop: 'locus.locus_stop',
      memberCount: 'locus.member_count',
    };

    qb.orderBy(sortableFields[query.sortBy], query.sortOrder);
  }

  private applyPagination(
    qb: SelectQueryBuilder<LocusEntity>,
    query: GetLocusQueryDto,
  ) {
    const skip = (query.page - 1) * query.limit;
    qb.skip(skip).take(query.limit);
  }

  private getLimitedAllowedRegionIds() {
    const rawValue =
      this.configService.get<string>('LIMITED_ALLOWED_REGION_IDS') ??
      '86118093,86696489,88186467';

    return rawValue
      .split(',')
      .map(value => Number(value.trim()))
      .filter(Number.isInteger);
  }
}
