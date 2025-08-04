<template>
  <div v-if="!isHidden" class="form-field space-y-2" :class="widthClass">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    
    <div class="border border-border rounded-md">
      <!-- Toolbar -->
      <div class="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
        <Button
          v-for="tool in toolbarTools"
          :key="tool.name"
          variant="ghost"
          size="sm"
          :disabled="isDisabled"
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
        :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
        @input="handleInput"
        @paste="handlePaste"
        v-html="modelValue"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full'
})

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const editorRef = ref<HTMLElement>()

// Computed properties to handle the field states
const isRequired = computed(() => {
  return props.fieldState === 'required' || props.required
})

const isDisabled = computed(() => {
  return props.fieldState === 'disabled' || props.disabled
})

const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden
})

// Computed property for width classes
const widthClass = computed(() => {
  switch (props.width) {
    case '1/2':
      return 'w-1/2'
    case '1/3':
      return 'w-1/3'
    case '2/3':
      return 'w-2/3'
    case '1/4':
      return 'w-1/4'
    case '3/4':
      return 'w-3/4'
    case 'full':
    default:
      return 'w-full'
  }
})

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
  }
])

const handleInput = () => {
  if (editorRef.value) {
    emit('update:value', editorRef.value.innerHTML)
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
.form-field {
  margin-bottom: 1rem;
}

[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
</style> 