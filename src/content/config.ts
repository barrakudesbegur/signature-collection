import { defineCollection, z } from "astro:content";

const iniciativeCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    recipient: z.string(),
    address: z.string(),
    email: z.string().optional(),
    featured: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("person"),
            name: z.string(),
            affiliation: z.string(),
            url: z.string().optional(),
          }),
          z.object({
            type: z.literal("organization"),
            name: z.string(),
            shortDescription: z.string(),
            url: z.string().optional(),
          }),
        ])
      )
      .default([]),
    updates: z
      .array(
        z.object({
          date: z.date(),
          message: z.string(),
          link: z.string().optional(),
          linkText: z.string().default("Llegeix més"),
        })
      )
      .default([]),
  }),
});

export const collections = {
  iniciatives: iniciativeCollection,
};
