<script setup lang="ts" generic="T extends Record<string, any>">
export interface PlaygroundControl {
  name: string;
  type: "select" | "boolean" | "text" | "number";
  label: string;
  options?: string[] | number[];
  default?: any;
  placeholder?: string;
}

export interface DpComponentPlaygroundProps {
  componentName: string;
  controls: PlaygroundControl[];
  defaultProps?: Record<string, any>;
  defaultSlot?: string;
}

const props = defineProps<DpComponentPlaygroundProps>();

// Initialize props state with defaults
const propsState = ref<Record<string, any>>({});

// Initialize props from controls and defaultProps
const initializeProps = () => {
  const initialProps: Record<string, any> = {};

  props.controls.forEach((control) => {
    // Priority: defaultProps > control.default > first option (for select) > empty
    if (props.defaultProps && control.name in props.defaultProps) {
      initialProps[control.name] = props.defaultProps[control.name];
    } else if (control.default !== undefined) {
      initialProps[control.name] = control.default;
    } else if (control.type === "select" && control.options && control.options.length > 0) {
      initialProps[control.name] = control.options[0];
    } else if (control.type === "boolean") {
      initialProps[control.name] = false;
    } else if (control.type === "number") {
      initialProps[control.name] = 0;
    } else {
      initialProps[control.name] = "";
    }
  });

  propsState.value = initialProps;
};

// Slot content
const slotContent = ref(props.defaultSlot || "Click me");

// Initialize on mount
onMounted(() => {
  initializeProps();
});

// Generate code snippet
const codeSnippet = computed(() => {
  const propsString = Object.entries(propsState.value)
    .filter(([_, value]) => {
      // Filter out default values to keep code clean
      if (value === false || value === "" || value === 0) return false;
      return true;
    })
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return `  ${key}`;
      } else if (typeof value === "string") {
        return `  ${key}="${value}"`;
      } else {
        return `  :${key}="${value}"`;
      }
    })
    .join("\n");

  const hasSlot = slotContent.value && slotContent.value.trim() !== "";

  if (hasSlot) {
    return `<${props.componentName}${propsString ? "\n" + propsString : ""}>\n  ${slotContent.value}\n</${props.componentName}>`;
  } else {
    return `<${props.componentName}${propsString ? "\n" + propsString + "\n" : " "}/>`;
  }
});

// Copy code to clipboard
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(codeSnippet.value);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
};
</script>

<template>
  <div class="bg-background border border-border rounded-lg shadow-sm overflow-hidden">
    <!-- Controls Section -->
    <div class="border-b border-border bg-muted/30 p-6">
      <h3 class="text-lg font-semibold text-foreground mb-4">Playground</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Render controls dynamically -->
        <div v-for="control in controls" :key="control.name" class="flex flex-col gap-2">
          <label :for="control.name" class="text-sm font-medium text-foreground">
            {{ control.label }}
          </label>

          <!-- Select control -->
          <select
            v-if="control.type === 'select'"
            :id="control.name"
            v-model="propsState[control.name]"
            class="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option v-for="option in control.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <!-- Boolean control -->
          <label
            v-else-if="control.type === 'boolean'"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              :id="control.name"
              v-model="propsState[control.name]"
              type="checkbox"
              class="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span class="text-sm text-muted-foreground">
              {{ propsState[control.name] ? "Enabled" : "Disabled" }}
            </span>
          </label>

          <!-- Text control -->
          <input
            v-else-if="control.type === 'text'"
            :id="control.name"
            v-model="propsState[control.name]"
            type="text"
            :placeholder="control.placeholder"
            class="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <!-- Number control -->
          <input
            v-else-if="control.type === 'number'"
            :id="control.name"
            v-model.number="propsState[control.name]"
            type="number"
            :placeholder="control.placeholder"
            class="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <!-- Slot content control (always present) -->
        <div class="flex flex-col gap-2 md:col-span-2">
          <label for="slot-content" class="text-sm font-medium text-foreground">
            Content (Slot)
          </label>
          <input
            id="slot-content"
            v-model="slotContent"
            type="text"
            placeholder="Button text or content"
            class="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="p-6 bg-background">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-semibold text-foreground">Preview</h4>
      </div>

      <div
        class="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/20"
      >
        <slot name="preview" :props="propsState" :slot-content="slotContent">
          <!-- Default preview (can be overridden) -->
          <div class="text-muted-foreground">Preview not available</div>
        </slot>
      </div>
    </div>

    <!-- Code Section -->
    <div class="border-t border-border bg-muted/30 p-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-semibold text-foreground">Code</h4>
        <button
          @click="copyCode"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        >
          <Icon name="lucide:copy" class="w-4 h-4" />
          Copy
        </button>
      </div>

      <pre
        class="p-4 bg-background border border-border rounded-md overflow-x-auto text-sm"
      ><code class="text-foreground font-mono">{{ codeSnippet }}</code></pre>
    </div>
  </div>
</template>
