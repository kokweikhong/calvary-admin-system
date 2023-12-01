import { z } from "zod";

export const AuthSchema = z.object({
  userId: z.number(),
  username: z.string(),
  role: z.string(),
  accessToken: z.string(),
  accessTokenExpiresAt: z.number(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.number(),
});

export type Auth = z.infer<typeof AuthSchema>;

