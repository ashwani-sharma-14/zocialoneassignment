import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  type Relation,
} from "typeorm";
import { User } from "./user.model.js";
export enum ComplaintType {
  LIVE_DEMO = "liveDemo",
  BILLING_ISSUE = "billingIssue",
  TECHNICAL_ISSUE = "technicalIssue",
  FEEDBACK = "feedback",
}

export enum Status {
  RAISED = "raised",
  IN_PROGRESS = "inProgress",
  WAITING_ON_USER = "waitingOnUser",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "enum",
    enum: ComplaintType,
  })
  complaintType!: ComplaintType;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.RAISED,
  })
  status!: Status;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Column({ type: "timestamptz" })
  statusUpdatedAt!: Date;

  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  @Column()
  userId!: string;

  @BeforeInsert()
  setInitialStatusUpdatedAt() {
    this.statusUpdatedAt = new Date();
  }
}
