import { z } from 'zod';

const RefreshTokenSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
