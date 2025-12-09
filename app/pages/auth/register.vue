<script setup lang="ts">
import DpAuthCard from "@ui/components/auth/DpAuthCard.vue";
import DpAuthInput from "@ui/components/auth/DpAuthInput.vue";
import DpPasswordInput from "@ui/components/auth/DpPasswordInput.vue";
import DpAuthAlert from "@ui/components/auth/DpAuthAlert.vue";
import DpAuthDivider from "@ui/components/auth/DpAuthDivider.vue";
import DpOAuthButton from "@ui/components/auth/DpOAuthButton.vue";
import DpButton from "@ui/DpButton.vue";

const { t } = useI18n();
const { register, isLoading } = useAuth();

useHead({
  title: t("auth.register.title"),
  meta: [
    {
      name: "description",
      content:
        "Create your account to get started with our professional dashboard template.",
    },
    { name: "robots", content: "noindex" },
  ],
});

// Form state
const formData = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
});

const errors = ref<Record<string, string>>({});
const registerError = ref("");
const registerSuccess = ref(false);

// Validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string[] => {
  const errors = [];
  if (password.length < 8) {
    errors.push(t("auth.validation.passwordTooShort"));
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(t("auth.validation.passwordNoUppercase"));
  }
  if (!/[a-z]/.test(password)) {
    errors.push(t("auth.validation.passwordNoLowercase"));
  }
  if (!/[0-9]/.test(password)) {
    errors.push(t("auth.validation.passwordNoNumber"));
  }
  return errors;
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

  if (!formData.value.acceptedTerms) {
    errors.value.acceptedTerms = t("auth.register.errors.termsNotAccepted");
    isValid = false;
  }

  return isValid;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  registerError.value = "";
  registerSuccess.value = false;

  try {
    await register({
      email: formData.value.email,
      password: formData.value.password,
      name: formData.value.name || undefined,
    });

    registerSuccess.value = true;

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigateTo("/auth/login");
    }, 3000);
  } catch (error: any) {
    console.error("Register error:", error);

    if (error.statusCode === 409) {
      registerError.value = t("auth.register.errors.emailExists");
      errors.value.email = t("auth.register.errors.emailExists");
    } else if (error.data?.errors) {
      error.data.errors.forEach((err: any) => {
        errors.value[err.field] = err.message;
      });
      registerError.value = error.data.errors[0]?.message || t("form.error");
    } else {
      registerError.value = t("form.error");
    }
  }
};

// OAuth handlers (mock)
const handleOAuthRegister = (provider: string) => {
  console.log(`OAuth register with ${provider} - Not implemented (mock only)`);
};
</script>

<template>
  <DpAuthCard
    :title="$t('auth.register.title')"
    :description="$t('auth.register.subtitle')"
    :show-logo="true"
  >
    <!-- Success message -->
    <DpAuthAlert
      v-if="registerSuccess"
      type="success"
      :message="$t('auth.register.success')"
      class="mb-6"
    />

    <!-- Error message -->
    <DpAuthAlert
      v-if="registerError"
      type="error"
      :message="registerError"
      :dismissible="true"
      class="mb-6"
      @dismiss="registerError = ''"
    />

    <!-- Register form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name (optional) -->
      <DpAuthInput
        v-model="formData.name"
        type="text"
        :label="$t('auth.register.name')"
        :placeholder="$t('auth.register.namePlaceholder')"
        :error="errors.name"
        :disabled="isLoading"
        autocomplete="name"
        icon="lucide:user"
      />

      <!-- Email -->
      <DpAuthInput
        v-model="formData.email"
        type="email"
        :label="$t('auth.register.email')"
        :placeholder="$t('auth.register.emailPlaceholder')"
        :error="errors.email"
        :required="true"
        :disabled="isLoading"
        autocomplete="email"
        icon="lucide:mail"
      />

      <!-- Password -->
      <DpPasswordInput
        v-model="formData.password"
        :label="$t('auth.register.password')"
        :placeholder="$t('auth.register.passwordPlaceholder')"
        :error="errors.password"
        :required="true"
        :disabled="isLoading"
        :show-strength="true"
        autocomplete="new-password"
      />

      <!-- Confirm Password -->
      <DpPasswordInput
        v-model="formData.confirmPassword"
        :label="$t('auth.register.confirmPassword')"
        :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
        :error="errors.confirmPassword"
        :required="true"
        :disabled="isLoading"
        autocomplete="new-password"
      />

      <!-- Terms & Conditions -->
      <div>
        <label class="flex items-start gap-2 cursor-pointer">
          <input
            v-model="formData.acceptedTerms"
            type="checkbox"
            :disabled="isLoading"
            class="w-4 h-4 mt-0.5 border-border rounded bg-background text-primary-600 focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-colors disabled:opacity-50"
          />
          <span class="text-sm text-foreground">
            {{ $t("auth.register.terms", [
              $t("auth.register.termsOfService"),
              $t("auth.register.privacyPolicy")
            ]) }}
          </span>
        </label>
        <p v-if="errors.acceptedTerms" class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <Icon name="lucide:alert-circle" class="w-4 h-4" />
          {{ errors.acceptedTerms }}
        </p>
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
          {{ isLoading ? $t("auth.register.submitting") : $t("auth.register.submit") }}
        </span>
      </DpButton>
    </form>

    <!-- Divider -->
    <DpAuthDivider :text="$t('auth.register.orContinueWith')" />

    <!-- OAuth buttons -->
    <div class="space-y-3">
      <DpOAuthButton
        provider="google"
        @click="handleOAuthRegister('google')"
      >
        {{ $t("auth.oauth.google") }}
      </DpOAuthButton>
      <DpOAuthButton
        provider="github"
        @click="handleOAuthRegister('github')"
      >
        {{ $t("auth.oauth.github") }}
      </DpOAuthButton>
    </div>

    <!-- Login link -->
    <template #footer>
      <p class="text-sm text-muted-foreground">
        {{ $t("auth.register.hasAccount") }}
        <NuxtLink
          to="/auth/login"
          class="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
        >
          {{ $t("auth.register.login") }}
        </NuxtLink>
      </p>
    </template>
  </DpAuthCard>
</template>
