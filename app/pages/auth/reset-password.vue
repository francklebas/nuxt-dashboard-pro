<script setup lang="ts">
import DpAuthCard from "@ui/components/auth/DpAuthCard.vue";
import DpPasswordInput from "@ui/components/auth/DpPasswordInput.vue";
import DpAuthAlert from "@ui/components/auth/DpAuthAlert.vue";
import DpButton from "@ui/DpButton.vue";

const { t } = useI18n();
const route = useRoute();
const { resetPassword, isLoading } = useAuth();

useHead({
  title: t("auth.resetPassword.title"),
  meta: [{ name: "robots", content: "noindex" }],
});

const token = ref("");
const formData = ref({
  password: "",
  confirmPassword: "",
});
const errors = ref<Record<string, string>>({});
const resetError = ref("");
const resetSuccess = ref(false);
const invalidToken = ref(false);

// Check token on mount
onMounted(() => {
  const tokenParam = route.query.token as string;
  if (!tokenParam || tokenParam.length < 10) {
    invalidToken.value = true;
  } else {
    token.value = tokenParam;
  }
});

const validatePassword = (password: string): string[] => {
  const validationErrors = [];
  if (password.length < 8) {
    validationErrors.push(t("auth.validation.passwordTooShort"));
  }
  if (!/[A-Z]/.test(password)) {
    validationErrors.push(t("auth.validation.passwordNoUppercase"));
  }
  if (!/[a-z]/.test(password)) {
    validationErrors.push(t("auth.validation.passwordNoLowercase"));
  }
  if (!/[0-9]/.test(password)) {
    validationErrors.push(t("auth.validation.passwordNoNumber"));
  }
  return validationErrors;
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.password.trim()) {
    errors.value.password = t("auth.validation.required");
    isValid = false;
  } else {
    const passwordErrors = validatePassword(formData.value.password);
    if (passwordErrors.length > 0) {
      errors.value.password = passwordErrors[0];
      isValid = false;
    }
  }

  if (!formData.value.confirmPassword.trim()) {
    errors.value.confirmPassword = t("auth.validation.required");
    isValid = false;
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = t("auth.validation.passwordMismatch");
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  resetError.value = "";
  resetSuccess.value = false;

  try {
    await resetPassword(token.value, formData.value.password);
    resetSuccess.value = true;

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigateTo("/auth/login");
    }, 2000);
  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error.statusCode === 400) {
      resetError.value = t("auth.resetPassword.errors.invalidToken");
      invalidToken.value = true;
    } else if (error.data?.errors) {
      error.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
      resetError.value = error.data.errors[0]?.message || t("form.error");
    } else {
      resetError.value = t("form.error");
    }
  }
};
</script>

<template>
  <DpAuthCard
    :title="$t('auth.resetPassword.title')"
    :description="invalidToken ? '' : $t('auth.resetPassword.subtitle')"
    :show-logo="true"
    max-width="sm"
  >
    <!-- Invalid token state -->
    <div v-if="invalidToken" class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <Icon
          name="lucide:x-circle"
          class="w-10 h-10 text-red-600 dark:text-red-400"
        />
      </div>
      <p class="text-muted-foreground mb-6">
        {{ $t("auth.resetPassword.errors.invalidToken") }}
      </p>
      <NuxtLink to="/auth/forgot-password">
        <DpButton variant="primary" class="w-full">
          {{ $t("auth.forgotPassword.submit") }}
        </DpButton>
      </NuxtLink>
    </div>

    <!-- Valid token - show form -->
    <div v-else>
      <!-- Success message -->
      <DpAuthAlert
        v-if="resetSuccess"
        type="success"
        :message="$t('auth.resetPassword.success')"
        class="mb-6"
      />

      <!-- Error message -->
      <DpAuthAlert
        v-if="resetError"
        type="error"
        :message="resetError"
        :dismissible="true"
        class="mb-6"
        @dismiss="resetError = ''"
      />

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- New Password -->
        <DpPasswordInput
          v-model="formData.password"
          :label="$t('auth.resetPassword.password')"
          :placeholder="$t('auth.resetPassword.passwordPlaceholder')"
          :error="errors.password"
          :required="true"
          :disabled="isLoading"
          :show-strength="true"
          autocomplete="new-password"
        />

        <!-- Confirm Password -->
        <DpPasswordInput
          v-model="formData.confirmPassword"
          :label="$t('auth.resetPassword.confirmPassword')"
          :placeholder="$t('auth.resetPassword.confirmPasswordPlaceholder')"
          :error="errors.confirmPassword"
          :required="true"
          :disabled="isLoading"
          autocomplete="new-password"
        />

        <!-- Submit button -->
        <DpButton
          type="submit"
          variant="primary"
          :disabled="isLoading"
          class="w-full"
        >
          <Icon
            v-if="isLoading"
            name="lucide:loader-2"
            class="w-4 h-4 animate-spin"
          />
          <span>
            {{ isLoading ? $t("auth.resetPassword.submitting") : $t("auth.resetPassword.submit") }}
          </span>
        </DpButton>
      </form>
    </div>

    <!-- Back to login -->
    <template #footer>
      <NuxtLink
        to="/auth/login"
        class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors inline-flex items-center gap-1"
      >
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        {{ $t("auth.forgotPassword.backToLogin") }}
      </NuxtLink>
    </template>
  </DpAuthCard>
</template>
