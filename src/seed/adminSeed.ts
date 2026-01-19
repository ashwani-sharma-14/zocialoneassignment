import bcrypt from "bcryptjs";
import { AppDataSource } from "@/config/data-source.js";
import { User, Role } from "@/model/user.model.js";
import { envConfig } from "@/config/env.config.js";
export const registerAdmin = async () => {
  const userRepo = AppDataSource.getRepository(User);
  const adminEmail = envConfig.adminEmail as string;
  const adminPassword = envConfig.adminPassword as string;
  const admin = await userRepo.findOneBy({ email: adminEmail });
  if (admin) {
    console.log("Admin already exist");
    return;
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const data = {
    email: adminEmail,
    password: hashedPassword,
    name: "admin",
    role: Role.ADMIN,
  };

  const createdAdmin = userRepo.create(data);
  await userRepo
    .save(createdAdmin)
    .then(() => console.log("Admin Created successFull"))
    .catch((err) => console.log(`Error in creating admin ${err}`));
};
