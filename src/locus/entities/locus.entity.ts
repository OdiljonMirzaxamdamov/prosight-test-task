import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LocusMemberEntity } from './locus-member.entity';

@Entity({ name: 'rnc_locus' })
export class LocusEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'assembly_id', type: 'varchar' })
  assemblyId: string;

  @Column({ name: 'locus_name', type: 'varchar' })
  locusName: string;

  @Column({ name: 'public_locus_name', type: 'varchar' })
  publicLocusName: string;

  @Column({ name: 'chromosome', type: 'varchar' })
  chromosome: string;

  @Column({ name: 'strand', type: 'varchar' })
  strand: string;

  @Column({ name: 'locus_start', type: 'integer' })
  locusStart: number;

  @Column({ name: 'locus_stop', type: 'integer' })
  locusStop: number;

  @Column({ name: 'member_count', type: 'integer' })
  memberCount: number;

  @OneToMany(() => LocusMemberEntity, locusMember => locusMember.locus)
  locusMembers: LocusMemberEntity[];
}
