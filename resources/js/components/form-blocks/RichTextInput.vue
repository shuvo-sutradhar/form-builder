<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    
    <div class="border border-border rounded-md">
      <!-- Toolbar -->
      <div class="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
        <Button
          v-for="tool in toolbarTools"
          :key="tool.name"
          variant="ghost"
          size="sm"
          @click="tool.action"
          :class="{ 'bg-primary text-primary-foreground': tool.active }"
          class="h-8 w-8 p-0"
        >
          <component :is="tool.icon" class="h-4 w-4" />
        </Button>
      </div>
      
      <!-- Editor -->
      <div
        ref="editorRef"
        class="min-h-[120px] p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
        contenteditable="true"
        @input="handleInput"
        @paste="handlePaste"
        v-html="modelValue"
      ></div>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Unlink
} from 'lucide-vue-next'

interface Props {
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  helpText?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLElement>()

const toolbarTools = computed(() => [
  {
    name: 'bold',
    icon: Bold,
    action: () => document.execCommand('bold', false),
    active: false
  },
  {
    name: 'italic',
    icon: Italic,
    action: () => document.execCommand('italic', false),
    active: false
  },
  {
    name: 'underline',
    icon: Underline,
    action: () => document.execCommand('underline', false),
    active: false
  },
  { name: 'separator', icon: null, action: () => {}, active: false },
  {
    name: 'unordered-list',
    icon: List,
    action: () => document.execCommand('insertUnorderedList', false),
    active: false
  },
  {
    name: 'ordered-list',
    icon: ListOrdered,
    action: () => document.execCommand('insertOrderedList', false),
    active: false
  },
  { name: 'separator2', icon: null, action: () => {}, active: false },
  {
    name: 'align-left',
    icon: AlignLeft,
    action: () => document.execCommand('justifyLeft', false),
    active: false
  },
  {
    name: 'align-center',
    icon: AlignCenter,
    action: () => document.execCommand('justifyCenter', false),
    active: false
  },
  {
    name: 'align-right',
    icon: AlignRight,
    action: () => document.execCommand('justifyRight', false),
    active: false
  },
  { name: 'separator3', icon: null, action: () => {}, active: false },
  {
    name: 'link',
    icon: Link,
    action: () => {
      const url = prompt('Enter URL:')
      if (url) document.execCommand('createLink', false, url)
    },
    active: false
  },
  {
    name: 'unlink',
    icon: Unlink,
    action: () => document.execCommand('unlink', false),
    active: false
  }
])

const handleInput = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

onMounted(() => {
  if (editorRef.value && props.placeholder) {
    editorRef.value.setAttribute('data-placeholder', props.placeholder)
  }
})
</script>

<style scoped>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

[contenteditable]:focus {
  outline: none;
}
</style> 