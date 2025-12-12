<script setup lang="ts">
import type { Product } from '~/layers/core/types/database';

interface Props {
  open: boolean;
  product?: Product | null;
  mode: 'create' | 'edit';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'save': [product: Partial<Product>];
}>();

// Form data
const formData = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  status: 'active' as 'active' | 'inactive' | 'discontinued',
});

// Watch for product changes
watch(() => props.product, (product) => {
  if (product && props.mode === 'edit') {
    formData.value = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
    };
  } else {
    // Reset form for create mode
    formData.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      status: 'active',
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', formData.value);
  emit('update:open', false);
};

const categories = ['Electronics', 'Accessories', 'Furniture', 'Storage'];
const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
];
</script>

<template>
  <DpModal
    :open="open"
    :title="mode === 'create' ? 'Add New Product' : 'Edit Product'"
    size="lg"
    @update:open="emit('update:open', $event)"
  >
    <form @submit.prevent="handleSave" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">
          Product Name *
        </label>
        <input
          v-model="formData.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product name"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter product description"
        />
      </div>

      <!-- Price and Stock (row) -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">
            Price * ($)
          </label>
          <input
            v-model.number="formData.price"
            type="number"
            step="0.01"
            required
            min="0"
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">
            Stock *
          </label>
          <input
            v-model.number="formData.stock"
            type="number"
            required
            min="0"
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <!-- Category and Status (row) -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">
            Category *
          </label>
          <select
            v-model="formData.category"
            required
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">
            Status *
          </label>
          <select
            v-model="formData.status"
            required
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <DpButton
          variant="ghost"
          @click="emit('update:open', false)"
        >
          Cancel
        </DpButton>
        <DpButton @click="handleSave">
          {{ mode === 'create' ? 'Create Product' : 'Save Changes' }}
        </DpButton>
      </div>
    </template>
  </DpModal>
</template>
