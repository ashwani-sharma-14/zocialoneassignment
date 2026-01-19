import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Complaint } from "./complaint.model.js";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export enum OnboardingStage {
  STAGE_0 = 0,
  STAGE_1 = 1,
  STAGE_2 = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ unique: true, type: "varchar" })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: string;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints?: Complaint[];

  @Column({ type: "int", default: OnboardingStage.STAGE_0 })
  onboardingStage!: OnboardingStage;

  @Column({ type: "boolean", default: false })
  onboardingComplete!: boolean;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  onboardingStageUpdatedAt!: Date;

  @Column({
    type: "jsonb",
    default: () =>
      `'{"instagram": null, "facebook": null, "linkedin": null, "googleBusiness": null}'`,
  })
  socialAccounts!: {
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    googleBusiness: string | null;
  };

  @Column({
    type: "jsonb",
    default: () => `'{}'`,
  })
  onboardingReminderSent!: Record<string, boolean>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
