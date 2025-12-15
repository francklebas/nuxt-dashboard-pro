<script setup lang="ts">
interface Filter {
  key: string;
  label: string;
  type: 'select' | 'date-range' | 'number-range' | 'checkbox';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface Props {
  filters?: Filter[];
  searchPlaceholder?: string;
  showSearch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  searchPlaceholder: 'Search...',
  showSearch: true,
});

const emit = defineEmits<{
  search: [query: string];
  filter: [filters: Record<string, any>];
  clear: [];
}>();

const searchQuery = ref('');
const filterValues = ref<Record<string, any>>({});
const showFilters = ref(false);
const debounceTimeout = ref<NodeJS.Timeout | null>(null);

const activeFiltersCount = computed(() => {
  return Object.values(filterValues.value).filter(
    (v) => v !== '' && v !== null && v !== undefined
  ).length;
});

const handleSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
  debounceTimeout.value = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 300);
};

const applyFilters = () => {
  emit('filter', filterValues.value);
};

const clearAll = () => {
  searchQuery.value = '';
  filterValues.value = {};
  emit('clear');
  emit('search', '');
  emit('filter', {});
};

watch(searchQuery, () => {
  handleSearch();
});

watch(filterValues, () => {
  applyFilters();
}, { deep: true });

onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
});
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Search and Filter Toggle -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search Input -->
      <div v-if="showSearch" class="relative flex-1">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <!-- Filter Toggle Button -->
      <div v-if="filters.length > 0" class="flex gap-2">
        <DpButton
          variant="outline"
          @click="showFilters = !showFilters"
          class="relative"
        >
          <Icon name="lucide:filter" class="w-4 h-4 mr-2" />
          Filters
          <span
            v-if="activeFiltersCount > 0"
            class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground"
          >
            {{ activeFiltersCount }}
          </span>
        </DpButton>

        <DpButton
          v-if="searchQuery || activeFiltersCount > 0"
          variant="ghost"
          size="sm"
          @click="clearAll"
        >
          <Icon name="lucide:x" class="w-4 h-4 mr-2" />
          Clear
        </DpButton>
      </div>

      <!-- Action Slot (e.g., Add New button) -->
      <slot name="actions" />
    </div>

    <!-- Filter Panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showFilters"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 border border-border rounded-lg bg-muted/30"
      >
        <div v-for="filter in filters" :key="filter.key" class="flex flex-col gap-2">
          <label class="text-sm font-medium text-foreground">{{ filter.label }}</label>

          <!-- Select Filter -->
          <select
            v-if="filter.type === 'select'"
            v-model="filterValues[filter.key]"
            class="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="">{{ filter.placeholder || 'All' }}</option>
            <option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Checkbox Filter -->
          <label v-else-if="filter.type === 'checkbox'" class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="filterValues[filter.key]"
              type="checkbox"
              class="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <span class="text-sm text-muted-foreground">{{ filter.placeholder }}</span>
          </label>

          <!-- Number Range Filter -->
          <div v-else-if="filter.type === 'number-range'" class="flex gap-2">
            <input
              v-model="filterValues[`${filter.key}_min`]"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <input
              v-model="filterValues[`${filter.key}_max`]"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <!-- Date Range Filter -->
          <div v-else-if="filter.type === 'date-range'" class="flex gap-2">
            <input
              v-model="filterValues[`${filter.key}_start`]"
              type="date"
              class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <input
              v-model="filterValues[`${filter.key}_end`]"
              type="date"
              class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
