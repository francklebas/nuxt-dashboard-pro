export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  // State (using useState for SSR compatibility)
  const user = useState<User | null>("auth:user", () => null);
  const token = useState<string | null>("auth:token", () => null);
  const isLoading = useState("auth:loading", () => false);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  /**
   * Login with email and password
   */
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{
        success: boolean;
        user: User;
        token: string;
      }>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;
      token.value = response.token;

      // Store token based on rememberMe preference
      if (credentials.rememberMe) {
        // Use cookie for persistent auth (30 days)
        const tokenCookie = useCookie("auth_token", {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        tokenCookie.value = response.token;
      } else {
        // Use sessionStorage for session-only auth
        if (process.client) {
          sessionStorage.setItem("auth_token", response.token);
        }
      }

      return response;
    } catch (error: any) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Register a new user
   */
  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: { email: string; verificationRequired: boolean };
      }>("/api/auth/register", {
        method: "POST",
        body: credentials,
      });

      // Don't auto-login after registration
      // User needs to verify email first
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    user.value = null;
    token.value = null;

    // Clear stored token
    const tokenCookie = useCookie("auth_token");
    tokenCookie.value = null;

    if (process.client) {
      sessionStorage.removeItem("auth_token");
    }

    // Redirect to login
    await navigateTo("/auth/login");
  };

  /**
   * Request password reset
   */
  const forgotPassword = async (email: string) => {
    return await $fetch<{ success: boolean; message: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: { email },
      },
    );
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (token: string, password: string) => {
    return await $fetch<{ success: boolean; message: string }>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: { token, password },
      },
    );
  };

  /**
   * Verify email with token
   */
  const verifyEmail = async (verificationToken: string) => {
    return await $fetch<{ success: boolean; message: string }>(
      "/api/auth/verify-email",
      {
        method: "POST",
        body: { token: verificationToken },
      },
    );
  };

  /**
   * Resend email verification
   */
  const resendVerification = async (email: string) => {
    return await $fetch<{ success: boolean; message: string }>(
      "/api/auth/resend-verification",
      {
        method: "POST",
        body: { email },
      },
    );
  };

  /**
   * Initialize auth state on app mount
   */
  const initAuth = async () => {
    if (process.client) {
      const tokenCookie = useCookie("auth_token");
      const sessionToken = sessionStorage.getItem("auth_token");
      const authToken = tokenCookie.value || sessionToken;

      if (authToken) {
        try {
          // Verify token and fetch user
          const response = await $fetch<{ success: boolean; user: User }>(
            "/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          user.value = response.user;
          token.value = authToken;
        } catch (error) {
          // Invalid token, clear it
          tokenCookie.value = null;
          sessionStorage.removeItem("auth_token");
          user.value = null;
          token.value = null;
        }
      }
    }
  };

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isLoading: readonly(isLoading),

    // Methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    initAuth,
  };
};
