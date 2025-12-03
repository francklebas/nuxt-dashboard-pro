<script setup lang="ts">
export interface DpTab {
  id: string;
  label: string;
  icon?: string;
}

export interface DpTabsProps {
  tabs: DpTab[];
  defaultTab?: string;
  modelValue?: string;
}

export interface DpTabsEmits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<DpTabsProps>(), {
  defaultTab: undefined,
});

const emit = defineEmits<DpTabsEmits>();

// Active tab state
const activeTab = ref(props.modelValue || props.defaultTab || props.tabs[0]?.id || "");

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== activeTab.value) {
      activeTab.value = newValue;
    }
  }
);

// Update active tab
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
  emit("update:modelValue", tabId);
};
</script>

<template>
  <div class="w-full">
    <!-- Tab Headers -->
    <div class="border-b border-border">
      <nav class="flex gap-2" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :id="`tab-${tab.id}`"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :aria-controls="`panel-${tab.id}`"
          :tabindex="activeTab === tab.id ? 0 : -1"
          @click="setActiveTab(tab.id)"
          :class="[
            'px-4 py-3 font-medium text-sm transition-colors relative',
            'hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            activeTab === tab.id
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:border-b-2 hover:border-muted',
          ]"
        >
          <div class="flex items-center gap-2">
            <Icon v-if="tab.icon" :name="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Panels -->
    <div class="mt-6">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :id="`panel-${tab.id}`"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.id}`"
        :hidden="activeTab !== tab.id"
        :tabindex="activeTab === tab.id ? 0 : -1"
      >
        <slot :name="tab.id" v-if="activeTab === tab.id">
          <!-- Default content if no slot provided -->
          <div class="text-muted-foreground">No content for {{ tab.label }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>
