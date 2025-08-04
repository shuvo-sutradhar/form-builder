<template>
  <div class="form-field">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-border"></span>
      </div>
      <div v-if="text" class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: ''
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 