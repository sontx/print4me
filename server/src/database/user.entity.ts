import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  product: string;

  @PrimaryColumn()
  email: string;

  @Column()
  fullName: string;

  @Column()
  country: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  config: string;

  @CreateDateColumn()
  createdAt: Date;
}