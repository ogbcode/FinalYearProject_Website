import { Bot } from 'src/modules/bot/entities/bot.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, ManyToMany, Int32 } from 'typeorm';
@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column( )
  firstName: string;

  // @Column({ nullable: true })
  // lastName: string;

  // @Column({ nullable: true })
  // username: string;

  @Column()
  telegramId: string;
  
  @ManyToOne(() => User, user => user.customer)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.customer,{ onDelete: 'CASCADE'})
  transaction:Transaction ;
  
  @ManyToOne(() => Bot, bot => bot.customer)
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
