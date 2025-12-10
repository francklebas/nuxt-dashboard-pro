export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();

  // If authenticated, redirect to home
  if (isAuthenticated.value) {
    return navigateTo("/");
  }
});
