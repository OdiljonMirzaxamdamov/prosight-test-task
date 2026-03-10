import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LocusEntity } from './locus.entity';

@Entity({ name: 'rnc_locus_members' })
export class LocusMemberEntity {
  @PrimaryColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'urs_taxid', type: 'text' })
  ursTaxId: string;

  @PrimaryColumn({ name: 'locus_id', type: 'integer' })
  locusId: number;

  @PrimaryColumn({ name: 'region_id', type: 'integer' })
  regionId: number;

  @Column({ name: 'membership_status', type: 'varchar', nullable: true })
  membershipStatus: string | null;

  @ManyToOne(() => LocusEntity, locus => locus.locusMembers)
  @JoinColumn({ name: 'locus_id' })
  locus: LocusEntity;
}
