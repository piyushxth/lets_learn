import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is requried").trim(),
});

export type categorySchema = z.infer<typeof categorySchema>;
