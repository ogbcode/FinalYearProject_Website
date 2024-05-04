import { Bot } from 'src/modules/bot/entities/bot.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany, Int32 } from 'typeorm';
@Entity()
export class Subscriber{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column( )
  firstName: string;

  @Column()
  telegramId: string;

  @Column({ nullable: true })
  joinDate: string;


  @Column({ nullable: true })
  expiryDate: string;

  
  @Column()
  active: string;

  
  @Column()
  duration: string;


  
  @ManyToOne(() => Bot, (bot) => bot.subscriber ,{ onDelete: 'CASCADE'})
  @JoinColumn()
  bot: Bot;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; 

  
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
