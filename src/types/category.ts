import { z } from 'zod';

const CategorySchema = z.object({
    slug: z.string(),
    name: z.string(),
    url: z.string(),
})

export type Category = z.infer<typeof CategorySchema>;
