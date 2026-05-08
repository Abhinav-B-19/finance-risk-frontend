import { z } from "zod";

export const predictionSchema =
  z.object({
    name: z
      .string()
      .min(
        2,
        "Name must be at least 2 characters"
      )
      .max(
        50,
        "Name cannot exceed 50 characters"
      ),

    email: z
      .string()
      .email(
        "Please enter a valid email address"
      )
      .max(
        100,
        "Email cannot exceed 100 characters"
      ),

    income: z
      .number()
      .min(
        100,
        "Income must be at least ₹100"
      )
      .max(
        100000000,
        "Income exceeds allowed limit"
      ),

    expenses: z
      .number()
      .min(
        0,
        "Expenses cannot be negative"
      )
      .max(
        100000000,
        "Expenses exceeds allowed limit"
      ),

    debt: z
      .number()
      .min(
        0,
        "Debt cannot be negative"
      )
      .max(
        1000000000,
        "Debt exceeds allowed limit"
      ),
  });

export type PredictionSchemaType =
  z.infer<
    typeof predictionSchema
  >;