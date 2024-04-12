import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Bot } from 'src/modules/bot/entities/bot.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Auth, (auth) => auth.user, { cascade: true, onDelete: 'CASCADE'})
  @JoinColumn()
  auth: Auth;

  @OneToMany(() => Customer, customer => customer.user,{ onDelete: 'CASCADE'})
  customer: Customer;

  @OneToMany(() => Bot, (bot) => bot.user, { cascade: true, onDelete: 'CASCADE' })
  bot: Bot;  

}
