import { Role } from '../../common/enums/role.enum';
import { Sideload } from '../../common/enums/sideload.enum';
import { LocusEntity } from '../entities/locus.entity';

export function serializeLocus(
  locus: LocusEntity,
  role: Role,
  sideload?: Sideload,
) {
  const base = {
    id: locus.id,
    assemblyId: locus.assemblyId,
    locusName: locus.locusName,
    publicLocusName: locus.publicLocusName,
    chromosome: locus.chromosome,
    strand: locus.strand,
    locusStart: locus.locusStart,
    locusStop: locus.locusStop,
    memberCount: locus.memberCount,
  };

  if (role !== Role.ADMIN) {
    return base;
  }

  if (sideload === Sideload.LOCUS_MEMBERS) {
    const locusMembers = (locus.locusMembers ?? []).map(member => ({
      id: member.id,
      ursTaxId: member.ursTaxId,
      regionId: member.regionId,
      locusId: member.locusId,
      membershipStatus: member.membershipStatus,
    }));

    return {
      ...base,
      ursTaxId: locusMembers[0]?.ursTaxId ?? null,
      locusMembers,
    };
  }

  return base;
}
