<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
    </Label>
    
    <div class="border border-border rounded-md bg-muted/30">
      <div class="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <span class="text-xs font-medium text-muted-foreground">
          {{ language || 'Code' }}
        </span>
        <Button
          variant="ghost"
          size="sm"
          @click="copyCode"
          class="h-6 w-6 p-0"
        >
          <Copy class="h-3 w-3" />
        </Button>
      </div>
      <pre class="p-4 overflow-x-auto text-sm"><code>{{ code || '// Your code here' }}</code></pre>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

interface Props {
  id: string
  label?: string
  code?: string
  language?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '// Your code here\nconsole.log("Hello World!");',
  language: 'javascript'
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<style scoped>
pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.5;
}
</style> 