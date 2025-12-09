export const useUser = () => {
  const { user } = useAuth();

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<{
    name: string;
    email: string;
  }>) => {
    const response = await $fetch<{
      success: boolean;
      user: any;
    }>("/api/auth/profile", {
      method: "PATCH",
      body: data,
    });

    // Update local user state
    if (user.value) {
      user.value = { ...user.value, ...response.user };
    }

    return response;
  };

  /**
   * Upload user avatar
   */
  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await $fetch<{
      success: boolean;
      avatarUrl: string;
    }>("/api/auth/avatar", {
      method: "POST",
      body: formData,
    });

    if (user.value) {
      user.value.avatar = response.avatarUrl;
    }

    return response;
  };

  return {
    user,
    updateProfile,
    uploadAvatar,
  };
};
