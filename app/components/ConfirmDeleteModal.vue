<script setup lang="ts">
interface Props {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Deletion',
  message: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  'confirm': [];
}>();

const handleConfirm = () => {
  emit('confirm');
  emit('update:open', false);
};
</script>

<template>
  <DpModal
    :open="open"
    :title="title"
    size="sm"
    @update:open="emit('update:open', $event)"
  >
    <p class="text-sm text-muted-foreground">
      {{ message }}
    </p>

    <template #footer>
      <div class="flex justify-end gap-3">
        <DpButton
          variant="ghost"
          @click="emit('update:open', false)"
        >
          {{ cancelText }}
        </DpButton>
        <DpButton
          variant="danger"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </DpButton>
      </div>
    </template>
  </DpModal>
</template>
