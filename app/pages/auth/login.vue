<script setup lang="ts">
import DpAuthCard from "@ui/components/auth/DpAuthCard.vue";
import DpAuthInput from "@ui/components/auth/DpAuthInput.vue";
import DpPasswordInput from "@ui/components/auth/DpPasswordInput.vue";
import DpAuthAlert from "@ui/components/auth/DpAuthAlert.vue";
import DpAuthDivider from "@ui/components/auth/DpAuthDivider.vue";
import DpOAuthButton from "@ui/components/auth/DpOAuthButton.vue";
import DpButton from "@ui/DpButton.vue";

const { t } = useI18n();
const { login, isLoading } = useAuth();

useHead({
  title: t("auth.login.title"),
  meta: [
    {
      name: "description",
      content:
        "Sign in to your account to access your dashboard and manage your projects.",
    },
    { name: "robots", content: "noindex" },
  ],
});

// Form state
const formData = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const errors = ref<Record<string, string>>({});
const loginError = ref("");
const loginSuccess = ref(false);

// Validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.email.trim()) {
    errors.value.email = t("auth.validation.required");
    isValid = false;
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = t("auth.validation.invalidEmail");
    isValid = false;
  }

  if (!formData.value.password.trim()) {
    errors.value.password = t("auth.validation.required");
    isValid = false;
  } else if (formData.value.password.length < 8) {
    errors.value.password = t("auth.validation.passwordTooShort");
    isValid = false;
  }

  return isValid;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loginError.value = "";
  loginSuccess.value = false;

  try {
    await login(formData.value);

    loginSuccess.value = true;

    // Redirect to home after successful login
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle different error types
    if (error.statusCode === 401) {
      loginError.value = t("auth.login.errors.invalidCredentials");
      errors.value.email = t("auth.login.errors.invalidCredentials");
    } else if (error.statusCode === 403) {
      loginError.value = t("auth.login.errors.emailNotVerified");
      errors.value.email = t("auth.login.errors.emailNotVerified");
    } else if (error.data?.errors) {
      // Handle validation errors from API
      error.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
      loginError.value = error.data.errors[0]?.message || t("form.error");
    } else {
      loginError.value = t("form.error");
    }
  }
};

// OAuth handlers (mock)
const handleOAuthLogin = (provider: string) => {
  console.log(`OAuth login with ${provider} - Not implemented (mock only)`);
};
</script>

<template>
  <DpAuthCard
    :title="$t('auth.login.title')"
    :description="$t('auth.login.subtitle')"
    :show-logo="true"
  >
    <!-- Success message -->
    <DpAuthAlert
      v-if="loginSuccess"
      type="success"
      :message="$t('auth.login.success')"
      class="mb-6"
    />

    <!-- Error message -->
    <DpAuthAlert
      v-if="loginError"
      type="error"
      :message="loginError"
      :dismissible="true"
      class="mb-6"
      @dismiss="loginError = ''"
    />

    <!-- Login form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email -->
      <DpAuthInput
        v-model="formData.email"
        type="email"
        :label="$t('auth.login.email')"
        :placeholder="$t('auth.login.emailPlaceholder')"
        :error="errors.email"
        :required="true"
        :disabled="isLoading"
        autocomplete="email"
        icon="lucide:mail"
      />

      <!-- Password -->
      <DpPasswordInput
        v-model="formData.password"
        :label="$t('auth.login.password')"
        :placeholder="$t('auth.login.passwordPlaceholder')"
        :error="errors.password"
        :required="true"
        :disabled="isLoading"
        autocomplete="current-password"
      />

      <!-- Remember me & Forgot password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="formData.rememberMe"
            type="checkbox"
            :disabled="isLoading"
            class="w-4 h-4 border-border rounded bg-background text-primary-600 focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-colors disabled:opacity-50"
          />
          <span class="text-sm text-foreground">
            {{ $t("auth.login.rememberMe") }}
          </span>
        </label>

        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          {{ $t("auth.login.forgotPassword") }}
        </NuxtLink>
      </div>

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
          {{ isLoading ? $t("auth.login.submitting") : $t("auth.login.submit") }}
        </span>
      </DpButton>
    </form>

    <!-- Divider -->
    <DpAuthDivider :text="$t('auth.login.orContinueWith')" />

    <!-- OAuth buttons -->
    <div class="space-y-3">
      <DpOAuthButton
        provider="google"
        @click="handleOAuthLogin('google')"
      >
        {{ $t("auth.oauth.google") }}
      </DpOAuthButton>
      <DpOAuthButton
        provider="github"
        @click="handleOAuthLogin('github')"
      >
        {{ $t("auth.oauth.github") }}
      </DpOAuthButton>
    </div>

    <!-- Sign up link -->
    <template #footer>
      <p class="text-sm text-muted-foreground">
        {{ $t("auth.login.noAccount") }}
        <NuxtLink
          to="/auth/register"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
        >
          {{ $t("auth.login.register") }}
        </NuxtLink>
      </p>
    </template>
  </DpAuthCard>
</template>
