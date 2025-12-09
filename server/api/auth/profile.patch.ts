import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        data: { errors: [{ field: "token", message: "Missing or invalid token" }] },
      });
    }

    const token = authHeader.substring(7);

    // Verify token (mock implementation)
    let userId: string;
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      if (decoded.exp < Date.now()) {
        throw new Error("Token expired");
      }
      userId = decoded.userId;
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
        data: { errors: [{ field: "token", message: "Invalid or expired token" }] },
      });
    }

    const body = await readBody(event);
    const data = profileSchema.parse(body);

    // Mock update (in real app, update database)
    const updatedUser = {
      id: userId,
      email: data.email || "demo@example.com",
      name: data.name || "Demo User",
      emailVerified: true,
      createdAt: "2024-01-01T00:00:00Z",
    };

    return {
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
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
