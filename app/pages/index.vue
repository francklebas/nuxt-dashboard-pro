<script lang="ts" setup>
import DpButton from "@ui/DpButton.vue";
import DpModal from "@ui/components/DpModal.vue";

useHead({
  title: "Business Operations Framework",
  meta: [
    {
      name: "description",
      content:
        "Business Operations Platform for Modern Teams. Streamline your workflows with powerful features.",
    },
  ],
});

// Modal states
const simpleModalOpen = ref(false);
const formModalOpen = ref(false);
const formData = ref({
  name: "",
  email: "",
});

const handleFormSubmit = () => {
  console.log("Form submitted:", formData.value);
  formModalOpen.value = false;
  formData.value = { name: "", email: "" };
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="space-y-12">
      <!-- Hero Section -->
      <section class="text-center py-12 sm:py-16">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Welcome to Business Operations Framework
          </h1>
          <p class="text-lg sm:text-xl text-muted-foreground mb-8">
            Experience our complete authentication system with modern UI components,
            dark mode, and multi-language support.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/auth/register">
              <DpButton variant="primary" size="lg" class="w-full sm:w-auto">
                <Icon name="lucide:user-plus" class="w-5 h-5" />
                Create Account
              </DpButton>
            </NuxtLink>
            <NuxtLink to="/auth/login">
              <DpButton variant="outline" size="lg" class="w-full sm:w-auto">
                <Icon name="lucide:log-in" class="w-5 h-5" />
                Sign In
              </DpButton>
            </NuxtLink>
          </div>
          <div class="mt-8 p-4 bg-muted rounded-lg border border-border">
            <p class="text-sm text-muted-foreground mb-2">
              <strong>Demo credentials:</strong>
            </p>
            <p class="text-sm font-mono">
              Email: demo@example.com | Password: Password123
            </p>
          </div>
        </div>
      </section>

      <!-- Divider -->
      <div class="border-t border-border"></div>

      <!-- Components Demo Section -->
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-foreground mb-2">UI Components</h2>
          <p class="text-muted-foreground">Explore our component library</p>
        </div>

        <section>
          <h3 class="text-2xl font-bold mb-4">Button Variants</h3>
          <div class="flex flex-wrap gap-4">
            <DpButton variant="primary">Primary</DpButton>
            <DpButton variant="secondary">Secondary</DpButton>
            <DpButton variant="outline">Outline</DpButton>
            <DpButton variant="ghost">Ghost</DpButton>
            <DpButton variant="destructive">Destructive</DpButton>
          </div>
        </section>

        <section>
          <h3 class="text-2xl font-bold mb-4">Button Sizes</h3>
          <div class="flex flex-wrap items-center gap-4">
            <DpButton size="sm">Small</DpButton>
            <DpButton size="md">Medium</DpButton>
            <DpButton size="lg">Large</DpButton>
          </div>
        </section>

        <section>
          <h3 class="text-2xl font-bold mb-4">Disabled State</h3>
          <div class="flex flex-wrap gap-4">
            <DpButton disabled>Disabled Primary</DpButton>
            <DpButton variant="outline" disabled>Disabled Outline</DpButton>
          </div>
        </section>

        <section>
          <h3 class="text-2xl font-bold mb-4">Modal Examples</h3>
          <div class="flex flex-wrap gap-4">
            <!-- Simple Modal with Trigger Slot -->
            <DpModal v-model:open="simpleModalOpen" title="Simple Modal Title" description="This is a simple modal example with a title and description.">
              <template #trigger>
                <DpButton variant="primary">
                  <Icon name="lucide:eye" class="w-4 h-4" />
                  Open Simple Modal
                </DpButton>
              </template>

              <div class="space-y-4">
                <p class="text-foreground">
                  This is the content of the modal. You can add any content here.
                </p>
                <p class="text-muted-foreground text-sm">
                  Click the X button or press Escape to close the modal.
                </p>
              </div>
            </DpModal>

            <!-- Modal with Form and Footer -->
            <DpButton variant="secondary" @click="formModalOpen = true">
              <Icon name="lucide:edit" class="w-4 h-4" />
              Open Form Modal
            </DpButton>

            <DpModal v-model:open="formModalOpen" title="Edit Profile" description="Make changes to your profile here." size="lg">
              <form @submit.prevent="handleFormSubmit" class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your email"
                  />
                </div>
              </form>

              <template #footer>
                <div class="flex justify-end gap-3">
                  <DpButton variant="outline" @click="formModalOpen = false">
                    Cancel
                  </DpButton>
                  <DpButton variant="primary" @click="handleFormSubmit">
                    <Icon name="lucide:save" class="w-4 h-4" />
                    Save Changes
                  </DpButton>
                </div>
              </template>
            </DpModal>
          </div>
        </section>
      </div>
      <!-- End Components Demo Section -->
    </div>
  </main>
</template>
