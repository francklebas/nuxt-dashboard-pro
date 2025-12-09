export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth();

  // Initialize auth state on client mount
  await initAuth();
});
