import { ActionError, defineAction } from "astro:actions";
import { db, eq, Signator } from "astro:db";
import { intervalToDuration } from "date-fns";
import dni from "better-dni";
import { z } from "zod";

// Define the action within the server object
export const server = {
  signPetition: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2, "El nom és obligatori"),
      surname: z.string().min(2, "El cognom és obligatori"),
      dni: z
        .string()
        .min(1, "El document d'identitat és obligatori")
        .transform((value, ctx) => {
          const normalized = dni.normalize(value);
          if (!dni.isValid(normalized)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El document d'identitat no és vàlid",
            });

            return z.NEVER;
          }
          return normalized;
        }),
      birthDate: z.coerce
        .date({
          required_error: "La data de naixement és obligatòria",
          invalid_type_error: "La data de naixement no és vàlida",
        })
        .refine(
          (date) => {
            const interval = intervalToDuration({
              start: date,
              end: new Date(),
            });
            return interval?.years !== undefined && interval.years >= 16;
          },
          { message: "Has de tenir almenys 16 anys per signar la petició" }
        ),
      municipality: z.enum(["Begur", "Esclanyà"], {
        errorMap: () => ({ message: "Cal seleccionar un municipi vàlid" }),
      }),
      public: z.coerce.boolean().default(false),
      comment: z
        .string()
        .max(500, "El comentari no pot superar 1000 caracters")
        .refine(
          (value) => {
            if (!value) return true;
            // Check for URLs
            const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
            // Check for emails
            const emailRegex =
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            // Check for phone numbers (various formats)
            const phoneRegex =
              /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/g;

            return (
              !urlRegex.test(value) &&
              !emailRegex.test(value) &&
              !phoneRegex.test(value)
            );
          },
          {
            message:
              "El comentari no pot contenir enllaços, correus electrònics o números de telèfon",
          }
        )
        .nullable()
        .default(null),
      email: z.string().email("L'email no és vàlid"),
      subscribed: z.coerce.boolean().default(false),
    }),
    async handler(input, { cookies }) {
      const existingSignatory = await db
        .selectDistinct({ id: Signator.id })
        .from(Signator)
        .where(eq(Signator.identificationDocument, input.dni));

      if (existingSignatory.length > 0) {
        // Don't error to prevent exposing who has signed
        console.log(
          `Signatory with identificationDocument ${input.dni} already exists`
        );
      } else {
        await db.insert(Signator).values({
          name: input.name,
          surname: input.surname,
          identificationDocument: input.dni,
          birthDate: input.birthDate,
          municipality: input.municipality,
          public: input.public,
          comment: input.comment,
          email: input.email,
          subscribed: input.subscribed,
        });
      }

      // Set cookie to remember that the user has signed
      cookies.set("signed", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    },
  }),
};
