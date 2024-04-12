import { Customer } from 'src/modules/customers/entities/customer.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
@Entity()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    transactionId: string;
  
    @Column()
    status: string;
  
    @Column()
    amount: number;
  
    @Column()
    currency: string;
  
    @Column()
    platform: string;
  
    @Column()
    duration: number;
  
    @ManyToOne(() => Customer, customer => customer.transaction)
    @JoinColumn()
    customer: Customer;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
    
  }
