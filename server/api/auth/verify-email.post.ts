import { z } from "zod";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = verifyEmailSchema.parse(body);

    // Mock token validation
    // In real app, validate token against database and check expiration
    if (data.token.length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or expired verification token",
        data: {
          errors: [
            {
              field: "token",
              message: "The verification link is invalid or has expired.",
            },
          ],
        },
      });
    }

    return {
      success: true,
      message: "Email verified successfully! You can now log in.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation error",
        data: {
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
      });
    }
    throw error;
  }
});
