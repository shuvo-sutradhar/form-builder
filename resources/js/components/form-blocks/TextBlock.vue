<template>
  <div class="form-field">
    <div class="prose prose-sm max-w-none">
      <div v-html="content" class="text-foreground"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content?: string
}

withDefaults(defineProps<Props>(), {
  content: 'Enter your text here...'
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 