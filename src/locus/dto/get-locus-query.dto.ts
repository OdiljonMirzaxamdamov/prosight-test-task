import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Sideload } from '../../common/enums/sideload.enum';

export class GetLocusQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @ApiPropertyOptional({
    description: 'Implemented according to actual DB schema type',
  })
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  regionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({
    enum: Sideload,
  })
  @IsOptional()
  @IsEnum(Sideload)
  sideload?: Sideload;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 1000, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 1000;

  @ApiPropertyOptional({
    enum: ['id', 'assemblyId', 'locusStart', 'locusStop', 'memberCount'],
    default: 'id',
  })
  @IsOptional()
  @IsIn(['id', 'assemblyId', 'locusStart', 'locusStop', 'memberCount'])
  sortBy: 'id' | 'assemblyId' | 'locusStart' | 'locusStop' | 'memberCount' =
    'id';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
