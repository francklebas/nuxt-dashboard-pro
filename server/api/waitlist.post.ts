import { z } from "zod";
import { useTurso, initWaitlistTable } from "../utils/turso";

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  plan: z.enum(["current", "v1", "v2"]).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event);
    const data = waitlistSchema.parse(body);

    const db = useTurso();

    // Ensure table exists
    await initWaitlistTable();

    // Check if email already exists
    const existing = await db.execute({
      sql: "SELECT id FROM waitlist_entries WHERE email = ?",
      args: [data.email],
    });

    if (existing.rows.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Cet email est déjà sur la liste d'attente",
      });
    }

    // Insert new entry
    await db.execute({
      sql: "INSERT INTO waitlist_entries (email, plan) VALUES (?, ?)",
      args: [data.email, data.plan || null],
    });

    // Return success response
    return {
      success: true,
      message: "Inscription réussie",
      data: {
        email: data.email,
      },
    };
  } catch (error) {
    // Re-throw HTTP errors
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email invalide",
        data: {
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
      });
    }

    // Handle other errors
    console.error("Waitlist API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur serveur",
    });
  }
});
