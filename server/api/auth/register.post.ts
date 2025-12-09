import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = registerSchema.parse(body);

    // Mock: Check if email already exists
    const existingEmails = ["demo@example.com", "test@example.com"];
    if (existingEmails.includes(data.email)) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email already exists",
        data: {
          errors: [
            {
              field: "email",
              message: "This email is already registered",
            },
          ],
        },
      });
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // In development, log the verification link
    if (process.env.NODE_ENV === "development") {
      const host = getRequestHeader(event, "host") || "localhost:3000";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      console.log(
        "\n📧 Email Verification Link:",
        `${protocol}://${host}/auth/verify-email?token=${verificationToken}`,
        "\n",
      );
    }

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      data: {
        email: data.email,
        verificationRequired: true,
      },
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
