export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => to.path.startsWith(route));

  if (isPublicRoute) {
    // If already authenticated and trying to access auth pages, redirect to home
    if (isAuthenticated.value) {
      return navigateTo("/");
    }
    return;
  }

  // Protected routes - require authentication
  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }
});
