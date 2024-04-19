import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Deployment } from 'src/modules/deployments/entities/deployment.entity';
import { Subscriber } from 'src/modules/subscribers/entities/subscriber.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Bot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  telegram: string

  @Column({ nullable: true })
  paystack: string;

  @Column({ nullable: true })
  binance: string;

  @Column({ nullable: true })
  stripe:string
  
  @Column({ nullable: true })
  coinpayment: string;

  @Column({ nullable: true })
  nowpayment: string;

  @Column({ nullable: true })
  crypto_address: string;

  @Column()
  adminId: string;

  @Column()
  twoweeks_price: string;

  @Column()
  onemonth_price: string;

  @Column()
  lifetime_price: string;


  @Column()
  groupchatId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  customersupport_telegram: string;

  @Column()
  success_url: string;

  @Column()
  subscription_benefits:string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bot)
  @JoinColumn()
  user:User;

  @OneToMany(()=>Customer,(customer)=>customer.bot, { cascade: true, onDelete: 'CASCADE' })
  customer:Customer;

  @OneToMany(()=>Subscriber,(subscriber)=>subscriber.bot, { cascade: true, onDelete: 'CASCADE' })
  subscriber:Subscriber;
  
  @OneToOne(() => Deployment, (deployment) => deployment.bot, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  deployment: Deployment;

}
