<template>
  <div v-if="block" class="flex flex-col h-full">
    <div class="p-4 border-b border-border flex-shrink-0">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-foreground">Block Settings</h3>
        <Button @click="$emit('close')" variant="ghost" size="icon" class="h-6 w-6">
          <XIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 min-h-0 space-y-4">
      <!-- Basic Settings -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Basic Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Field Label</Label>
            <Input
              v-model="block.label"
              type="text"
              class="w-full"
            />
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              v-model="block.required"
              type="checkbox"
              class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <Label class="text-sm">Required field</Label>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Help Text</Label>
            <Input
              v-model="block.helpText"
              type="text"
              placeholder="Optional help text"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Input Settings -->
      <div v-if="isInputField">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Input Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Placeholder</Label>
            <Input
              v-model="block.placeholder"
              type="text"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Options for select, radio, checkbox, multi-select -->
      <div v-if="hasOptions">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Options</h4>
        <div class="space-y-2">
          <div 
            v-for="(option, index) in block.options" 
            :key="index"
            class="flex items-center gap-2"
          >
            <Input
              v-model="block.options[index]"
              type="text"
              class="flex-1"
            />
            <Button 
              @click="removeOption(index)"
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-destructive"
            >
              <TrashIcon class="w-4 h-4" />
            </Button>
          </div>
          <Button 
            @click="addOption"
            variant="outline"
            size="sm"
            class="w-full"
          >
            + Add Option
          </Button>
        </div>
      </div>

      <!-- Number Settings -->
      <div v-if="block.type === 'number'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Number Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Minimum Value</Label>
            <Input
              v-model.number="block.min"
              type="number"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Maximum Value</Label>
            <Input
              v-model.number="block.max"
              type="number"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Step</Label>
            <Input
              v-model.number="block.step"
              type="number"
              min="0.1"
              step="0.1"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Rating Settings -->
      <div v-if="block.type === 'rating'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Rating Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Maximum Rating</Label>
            <Input
              v-model.number="block.max"
              type="number"
              min="1"
              max="10"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Scale Settings -->
      <div v-if="block.type === 'scale'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Scale Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Minimum Value</Label>
            <Input
              v-model.number="block.min"
              type="number"
              min="0"
              max="100"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Maximum Value</Label>
            <Input
              v-model.number="block.max"
              type="number"
              min="1"
              max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Slider Settings -->
      <div v-if="block.type === 'slider'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Slider Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Minimum Value</Label>
            <Input
              v-model.number="block.min"
              type="number"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Maximum Value</Label>
            <Input
              v-model.number="block.max"
              type="number"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Step</Label>
            <Input
              v-model.number="block.step"
              type="number"
              min="0.1"
              step="0.1"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Matrix Settings -->
      <div v-if="block.type === 'matrix'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Matrix Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Matrix Type</Label>
            <select
              v-model="block.matrixType"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkboxes</option>
              <option value="text">Text Input</option>
            </select>
          </div>
          
          <div class="space-y-1">
            <Label class="text-xs">Rows (one per line)</Label>
            <textarea
              v-model="matrixRowsText"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows="3"
              placeholder="Row 1&#10;Row 2&#10;Row 3"
            ></textarea>
          </div>
          
          <div class="space-y-1">
            <Label class="text-xs">Columns (one per line)</Label>
            <textarea
              v-model="matrixColumnsText"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows="3"
              placeholder="Column 1&#10;Column 2&#10;Column 3"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div v-if="block.type === 'payment'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Payment Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Default Amount</Label>
            <Input
              v-model.number="block.paymentAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Currency</Label>
            <select
              v-model="block.paymentCurrency"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Code Block Settings -->
      <div v-if="block.type === 'code'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Code Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Language</Label>
            <select
              v-model="block.language"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="php">PHP</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Code Content</Label>
            <textarea
              v-model="block.code"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              rows="6"
              placeholder="// Your code here"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Text Block Settings -->
      <div v-if="block.type === 'text-block'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Text Block Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Content</Label>
            <textarea
              v-model="block.defaultValue"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows="4"
              placeholder="Enter your text content here..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Image Block Settings -->
      <div v-if="block.type === 'image'">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Image Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Image URL</Label>
            <Input
              v-model="block.imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full"
            />
          </div>
          <div class="space-y-1">
            <Label class="text-xs">Image Size</Label>
            <select
              v-model="block.imageSize"
              class="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { XIcon, TrashIcon } from 'lucide-vue-next'

interface Props {
  block: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isInputField = computed(() => {
  return ['text', 'textarea', 'rich-text', 'date', 'url', 'phone', 'email', 'number'].includes(props.block.type)
})

const hasOptions = computed(() => {
  return ['select', 'radio', 'checkbox', 'multi-select'].includes(props.block.type)
})

const matrixRowsText = computed({
  get: () => props.block.matrixRows?.join('\n') || '',
  set: (value: string) => {
    props.block.matrixRows = value.split('\n').filter(row => row.trim())
  }
})

const matrixColumnsText = computed({
  get: () => props.block.matrixColumns?.join('\n') || '',
  set: (value: string) => {
    props.block.matrixColumns = value.split('\n').filter(col => col.trim())
  }
})

const addOption = () => {
  if (!props.block.options) {
    props.block.options = []
  }
  props.block.options.push('New Option')
}

const removeOption = (index: number) => {
  props.block.options.splice(index, 1)
}
</script> 