import { z } from "zod";
import { UserSchema } from "./user";

export const JWTPayloadSchema = z.object({
  username: z.string(),
  token: z.string(),
  issuer: z.string(),
  expiresAt: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const AuthSchema = z.object({
  user: UserSchema.omit({
    password: true,
    createdAt: true,
    updatedAt: true,
  }),
  accessToken: JWTPayloadSchema,
  refreshToken: JWTPayloadSchema,
});


// export const AuthSchema = i.object({
//   userId: z.number(),
//   username: z.string(),
//   role: z.string(),
//   accessToken: z.string(),
//   accessTokenExpiresAt: z.number(),
//   refreshToken: z.string(),
//   refreshTokenExpiresAt: z.number(),
// });

export type Auth = z.infer<typeof AuthSchema>;

export const AuthRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthRequest = z.infer<typeof AuthRequestSchema>;
