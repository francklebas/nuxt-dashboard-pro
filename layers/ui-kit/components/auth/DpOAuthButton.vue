<script setup lang="ts">
import DpButton from "@ui/DpButton.vue";

export interface DpOAuthButtonProps {
  provider: "google" | "github" | "gitlab" | "facebook" | "twitter";
  variant?: "default" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<DpOAuthButtonProps>(), {
  variant: "outline",
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [];
}>();

const providerConfig = computed(() => {
  const configs = {
    google: {
      label: "Google",
      icon: "logos:google-icon",
      colorClass: "hover:border-[#4285F4] dark:hover:border-[#4285F4]",
    },
    github: {
      label: "GitHub",
      icon: "mdi:github",
      colorClass: "hover:border-[#333] dark:hover:border-[#fff]",
    },
    gitlab: {
      label: "GitLab",
      icon: "mdi:gitlab",
      colorClass: "hover:border-[#FC6D26] dark:hover:border-[#FC6D26]",
    },
    facebook: {
      label: "Facebook",
      icon: "mdi:facebook",
      colorClass: "hover:border-[#1877F2] dark:hover:border-[#1877F2]",
    },
    twitter: {
      label: "Twitter",
      icon: "mdi:twitter",
      colorClass: "hover:border-[#1DA1F2] dark:hover:border-[#1DA1F2]",
    },
  };
  return configs[props.provider];
});

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit("click");
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    :class="[
      'w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-md font-medium transition-all',
      'border bg-background text-foreground',
      'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variant === 'outline' ? 'border-border' : 'border-transparent bg-muted',
      providerConfig.colorClass,
    ]"
    @click="handleClick"
  >
    <Icon
      v-if="!loading"
      :name="providerConfig.icon"
      class="w-5 h-5"
    />
    <Icon
      v-else
      name="lucide:loader-2"
      class="w-5 h-5 animate-spin"
    />
    <span>
      <slot>Continue with {{ providerConfig.label }}</slot>
    </span>
  </button>
</template>
