export default defineEventHandler(async (event) => {
  const authHeader = getRequestHeader(event, "Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        errors: [{ field: "token", message: "Authentication required" }],
      },
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Decode mock JWT token
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    // Check token expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      throw createError({
        statusCode: 401,
        statusMessage: "Token expired",
        data: {
          errors: [{ field: "token", message: "Token has expired" }],
        },
      });
    }

    // Mock user lookup
    const mockUsers = [
      {
        id: "1",
        email: "demo@example.com",
        name: "Demo User",
        emailVerified: true,
        avatar: null,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        email: "test@example.com",
        name: "Test User",
        emailVerified: false,
        avatar: null,
        createdAt: "2024-01-02T00:00:00Z",
      },
    ];

    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
        data: {
          errors: [{ field: "user", message: "User not found" }],
        },
      });
    }

    return {
      success: true,
      user,
    };
  } catch (error: any) {
    // Invalid token format
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
      data: {
        errors: [{ field: "token", message: "Invalid authentication token" }],
      },
    });
  }
});
