import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = resetPasswordSchema.parse(body);

    // Mock token validation
    // In real app, validate token against database and check expiration
    if (data.token.length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or expired reset token",
        data: {
          errors: [
            {
              field: "token",
              message: "Invalid or expired reset link",
            },
          ],
        },
      });
    }

    return {
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
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
