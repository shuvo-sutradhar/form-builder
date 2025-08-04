<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div 
      class="border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors hover:border-primary/50"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="hidden"
      />
      <div class="space-y-2">
        <div class="text-4xl text-muted-foreground">📁</div>
        <div class="text-sm text-muted-foreground">
          <span class="font-medium text-primary">Click to upload</span> or drag and drop
        </div>
        <div class="text-xs text-muted-foreground">
          {{ accept === '*' ? 'Any file type' : accept }}
        </div>
      </div>
    </div>
    
    <div v-if="selectedFiles.length > 0" class="space-y-2">
      <div class="text-sm font-medium text-foreground">Selected Files:</div>
      <div class="space-y-1">
        <div 
          v-for="(file, index) in selectedFiles" 
          :key="index"
          class="flex items-center justify-between p-2 bg-muted rounded-md"
        >
          <span class="text-sm text-foreground">{{ file.name }}</span>
          <Button 
            @click="removeFile(index)"
            variant="ghost" 
            size="icon" 
            class="h-6 w-6 text-destructive"
          >
            <XIcon class="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'

interface Props {
  label?: string
  required?: boolean
  accept?: string
  multiple?: boolean
  modelValue?: File[]
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  accept: '*',
  multiple: false
})

const emit = defineEmits<{
  'update:value': [value: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>(props.modelValue || [])

const handleFileSelect = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...files]
  } else {
    selectedFiles.value = files
  }
  emit('update:value', selectedFiles.value)
}

const handleDrop = (event: DragEvent) => {
  const files = Array.from(event.dataTransfer?.files || [])
  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...files]
  } else {
    selectedFiles.value = files
  }
  emit('update:value', selectedFiles.value)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  emit('update:value', selectedFiles.value)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 