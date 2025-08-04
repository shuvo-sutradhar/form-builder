<template>
  <div v-if="!isHidden" class="form-field">
    <div class="border-t border-border my-8">
      <div class="text-center text-sm text-muted-foreground mt-2">
        Page Break
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
}

const props = withDefaults(defineProps<Props>(), {
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