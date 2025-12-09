import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = loginSchema.parse(body);

    // Mock user database
    const mockUsers = [
      {
        id: "1",
        email: "demo@example.com",
        password: "Password123", // In real app, use bcrypt
        name: "Demo User",
        emailVerified: true,
        avatar: null,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        email: "test@example.com",
        password: "Test1234",
        name: "Test User",
        emailVerified: false,
        avatar: null,
        createdAt: "2024-01-02T00:00:00Z",
      },
    ];

    const user = mockUsers.find((u) => u.email === data.email);

    if (!user || user.password !== data.password) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
        data: {
          errors: [
            { field: "email", message: "Invalid email or password" },
          ],
        },
      });
    }

    if (!user.emailVerified) {
      throw createError({
        statusCode: 403,
        statusMessage: "Email not verified",
        data: {
          errors: [
            { field: "email", message: "Please verify your email address" },
          ],
        },
      });
    }

    // Generate mock JWT token
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp:
          Date.now() +
          (data.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
      }),
    ).toString("base64");

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
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
