<template>
  <div class="form-field">
    <div class="flex justify-center">
      <div v-if="src" class="max-w-full">
        <img 
          :src="src" 
          :alt="alt || 'Image'" 
          class="max-w-full h-auto rounded-lg shadow-sm"
        />
        <p v-if="alt" class="text-sm text-muted-foreground text-center mt-2">{{ alt }}</p>
      </div>
      <div v-else class="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
        <div class="text-center text-muted-foreground">
          <div class="text-4xl mb-2">🖼️</div>
          <div class="text-sm">No image selected</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
}

withDefaults(defineProps<Props>(), {
  src: '',
  alt: ''
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 