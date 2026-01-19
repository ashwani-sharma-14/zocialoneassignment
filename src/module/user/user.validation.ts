import * as z from "zod";

export const userRegisterSchema = z.object({
  body: z.object({
    email: z.email("Valid Email is required"),
    name: z.string("Name is required"),
    password: z.string("Password is required"),
  }),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

export const userLoginSchema = z.object({
  body: z.object({
    email: z.email("email is required"),
    password: z.string("Password is required"),
  }),
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;
