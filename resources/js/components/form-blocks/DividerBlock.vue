<template>
  <div v-if="!isHidden" class="form-field">
    <hr class="border-border" />
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