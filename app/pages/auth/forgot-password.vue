<script setup lang="ts">
import DpAuthCard from "@ui/components/auth/DpAuthCard.vue";
import DpAuthInput from "@ui/components/auth/DpAuthInput.vue";
import DpAuthAlert from "@ui/components/auth/DpAuthAlert.vue";
import DpButton from "@ui/DpButton.vue";

const { t } = useI18n();
const { forgotPassword, isLoading } = useAuth();

useHead({
  title: t("auth.forgotPassword.title"),
  meta: [{ name: "robots", content: "noindex" }],
});

const email = ref("");
const error = ref("");
const success = ref(false);

const validateEmail = (emailValue: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailValue);
};

const handleSubmit = async () => {
  error.value = "";
  success.value = false;

  if (!email.value.trim()) {
    error.value = t("auth.validation.required");
    return;
  }

  if (!validateEmail(email.value)) {
    error.value = t("auth.validation.invalidEmail");
    return;
  }

  try {
    await forgotPassword(email.value);
    success.value = true;
    email.value = "";
  } catch (err: any) {
    console.error("Forgot password error:", err);
    error.value = err.data?.errors?.[0]?.message || t("form.error");
  }
};
</script>

<template>
  <DpAuthCard
    :title="$t('auth.forgotPassword.title')"
    :description="$t('auth.forgotPassword.subtitle')"
    :show-logo="true"
    max-width="sm"
  >
    <!-- Success message -->
    <DpAuthAlert
      v-if="success"
      type="success"
      :message="$t('auth.forgotPassword.success')"
      class="mb-6"
    />

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <DpAuthInput
        v-model="email"
        type="email"
        :label="$t('auth.forgotPassword.email')"
        :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
        :error="error"
        :required="true"
        :disabled="isLoading"
        autocomplete="email"
        icon="lucide:mail"
      />

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
          {{ isLoading ? $t("auth.forgotPassword.submitting") : $t("auth.forgotPassword.submit") }}
        </span>
      </DpButton>
    </form>

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
