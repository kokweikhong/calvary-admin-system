import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  position: z.string(),
  department: z.string(),
  profileImage: z.string(),
  isExist: z.boolean(),
  isVerified: z.boolean(),
  verifyToken: z.string(),
  verifyTokenExpires: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const emptyUser: User = {
  id: 0,
  username: "",
  email: "",
  password: "",
  role: "user",
  position: "",
  department: "",
  profileImage: "",
  isExist: true,
  isVerified: false,
  verifyToken: "",
  verifyTokenExpires: "",
  createdAt: "",
  updatedAt: "",
};
