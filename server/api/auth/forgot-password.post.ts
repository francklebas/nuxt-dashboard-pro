import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = forgotPasswordSchema.parse(body);

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // In development, log the reset link
    if (process.env.NODE_ENV === "development") {
      const host = getRequestHeader(event, "host") || "localhost:3000";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      console.log(
        "\n🔐 Password Reset Link:",
        `${protocol}://${host}/auth/reset-password?token=${resetToken}`,
        "\n",
      );
    }

    // Always return success (don't reveal if email exists)
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
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
