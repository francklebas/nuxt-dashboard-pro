<script setup lang="ts">
import DpAuthCard from "@ui/components/auth/DpAuthCard.vue";
import DpAuthAlert from "@ui/components/auth/DpAuthAlert.vue";
import DpAuthInput from "@ui/components/auth/DpAuthInput.vue";
import DpButton from "@ui/DpButton.vue";

const { t } = useI18n();
const route = useRoute();
const { verifyEmail, resendVerification, isLoading } = useAuth();

useHead({
  title: t("auth.verifyEmail.title"),
  meta: [{ name: "robots", content: "noindex" }],
});

type VerificationState = "verifying" | "success" | "error";

const state = ref<VerificationState>("verifying");
const errorMessage = ref("");
const countdown = ref(5);
const resendEmail = ref("");
const resendError = ref("");
const resendSuccess = ref(false);
const countdownInterval = ref<NodeJS.Timeout | null>(null);

// Auto-verify on mount
onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    state.value = "error";
    errorMessage.value = t("auth.verifyEmail.errorMessage");
    return;
  }

  try {
    await verifyEmail(token);
    state.value = "success";

    // Start countdown
    countdownInterval.value = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        if (countdownInterval.value) {
          clearInterval(countdownInterval.value);
          countdownInterval.value = null;
        }
        navigateTo("/auth/login");
      }
    }, 1000);
  } catch (error: any) {
    console.error("Verify email error:", error);
    state.value = "error";
    errorMessage.value = error.data?.errors?.[0]?.message ||
      t("auth.verifyEmail.errorMessage");
  }
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
});

// Resend verification
const handleResend = async () => {
  if (!resendEmail.value.trim()) {
    resendError.value = t("auth.validation.required");
    return;
  }

  resendError.value = "";
  resendSuccess.value = false;

  try {
    await resendVerification(resendEmail.value);
    resendSuccess.value = true;
    resendEmail.value = "";
  } catch (error: any) {
    console.error("Resend error:", error);
    resendError.value = error.data?.errors?.[0]?.message || t("form.error");
  }
};
</script>

<template>
  <DpAuthCard
    :title="$t('auth.verifyEmail.title')"
    :show-logo="true"
    max-width="sm"
  >
    <!-- Verifying state -->
    <div v-if="state === 'verifying'" class="text-center py-8">
      <Icon
        name="lucide:loader-2"
        class="w-16 h-16 mx-auto text-primary-600 animate-spin mb-4"
      />
      <p class="text-lg text-foreground font-medium">
        {{ $t("auth.verifyEmail.verifying") }}
      </p>
    </div>

    <!-- Success state -->
    <div v-else-if="state === 'success'" class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
        <Icon
          name="lucide:check-circle"
          class="w-10 h-10 text-green-600 dark:text-green-400"
        />
      </div>
      <h2 class="text-xl font-bold text-foreground mb-2">
        {{ $t("auth.verifyEmail.success") }}
      </h2>
      <p class="text-muted-foreground mb-4">
        {{ $t("auth.verifyEmail.successMessage") }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t("auth.verifyEmail.redirecting", [countdown]) }}
      </p>
    </div>

    <!-- Error state -->
    <div v-else-if="state === 'error'" class="space-y-6">
      <div class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Icon
            name="lucide:x-circle"
            class="w-10 h-10 text-red-600 dark:text-red-400"
          />
        </div>
        <h2 class="text-xl font-bold text-foreground mb-2">
          {{ $t("auth.verifyEmail.error") }}
        </h2>
        <p class="text-muted-foreground">
          {{ errorMessage }}
        </p>
      </div>

      <div class="border-t border-border pt-6">
        <h3 class="text-sm font-medium text-foreground mb-4">
          {{ $t("auth.verifyEmail.resend") }}
        </h3>

        <DpAuthAlert
          v-if="resendSuccess"
          type="success"
          :message="$t('auth.verifyEmail.resendSuccess')"
          class="mb-4"
        />

        <form @submit.prevent="handleResend" class="space-y-4">
          <DpAuthInput
            v-model="resendEmail"
            type="email"
            :label="$t('auth.login.email')"
            :placeholder="$t('auth.login.emailPlaceholder')"
            :error="resendError"
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
              {{ isLoading ? $t("auth.verifyEmail.resending") : $t("auth.verifyEmail.resend") }}
            </span>
          </DpButton>
        </form>
      </div>
    </div>

    <!-- Back to login link -->
    <template #footer>
      <NuxtLink
        to="/auth/login"
        class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
      >
        {{ $t("auth.login.title") }}
      </NuxtLink>
    </template>
  </DpAuthCard>
</template>
