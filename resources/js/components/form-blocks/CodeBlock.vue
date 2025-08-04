<template>
  <div v-if="!isHidden" class="form-field">
    <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
      <code class="text-sm font-mono">{{ code }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  code?: string
  language?: string
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
}

const props = withDefaults(defineProps<Props>(), {
  code: '// Your code here',
  language: 'javascript',
  hidden: false
})

// Computed properties to handle the field states
const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 