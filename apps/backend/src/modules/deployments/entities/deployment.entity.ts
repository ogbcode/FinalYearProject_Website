import { Bot } from 'src/modules/bot/entities/bot.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  projectId: string;

  @Column()
  serviceId: string;

  @Column()
  environmentId: string;

  @Column({ type: 'varchar' })
  domain: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;


  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Bot, (bot) => bot.deployment, {onDelete: 'CASCADE'})
  @JoinColumn()
  bot:Bot;

}
