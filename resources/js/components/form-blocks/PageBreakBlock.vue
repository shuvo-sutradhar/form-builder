<template>
  <div class="my-8 border-t-2 border-dashed border-border">
    <div class="flex items-center justify-center py-4">
      <div class="flex items-center gap-2 text-muted-foreground">
        <FileText class="h-4 w-4" />
        <span class="text-sm font-medium">Page Break</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'

interface Props {
  id: string
}

defineProps<Props>()
</script> 