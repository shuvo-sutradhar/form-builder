<template>
  <div v-if="block" class="flex flex-col h-full">
    <div class="p-4 border-b border-border flex-shrink-0">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-foreground">{{ getBlockTitle() }}</h3>
        <Button @click="$emit('close')" variant="ghost" size="icon" class="h-6 w-6">
          <XIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-border">
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
          :class="[
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 min-h-0">
      <!-- Options Tab -->
      <div v-if="activeTab === 'options'" class="space-y-6">
        <!-- Field Name Section -->
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs font-medium cursor-pointer" @click="focusFieldName">Field Name *</Label>
            <Input
              ref="fieldNameInput"
              v-model="block.label"
              type="text"
              class="w-full"
              placeholder="Enter field name"
            />
          </div>
          
          <div class="flex gap-2">
            <Button
              @click="setFieldState('required')"
              :variant="block.fieldState === 'required' ? 'default' : 'outline'"
              size="sm"
              class="flex-1"
            >
              <AsteriskIcon class="w-4 h-4 mr-1" />
              Required
            </Button>
            <Button
              @click="setFieldState('hidden')"
              :variant="block.fieldState === 'hidden' ? 'default' : 'outline'"
              size="sm"
              class="flex-1"
            >
              <EyeIcon class="w-4 h-4 mr-1" />
              Hidden
            </Button>
            <Button
              @click="setFieldState('disabled')"
              :variant="block.fieldState === 'disabled' ? 'default' : 'outline'"
              size="sm"
              class="flex-1"
            >
              <LockIcon class="w-4 h-4 mr-1" />
              Disabled
            </Button>
          </div>
        </div>

        <!-- Text Options Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Text Options</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :checked="block.multiLine"
                  @update:checked="block.multiLine = $event"
                  id="multiLine"
                />
                <Label for="multiLine" class="text-sm cursor-pointer">Multi-lines input</Label>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :checked="block.secretInput"
                  @update:checked="block.secretInput = $event"
                  id="secretInput"
                />
                <Label for="secretInput" class="text-sm cursor-pointer">Secret input</Label>
                <Badge variant="secondary" class="text-xs">PRO</Badge>
              </div>
            </div>
            <p class="text-xs text-muted-foreground ml-6">Hide input content with * for privacy</p>
          </div>
        </div>

        <!-- Customization Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Customization</h4>
          <div class="flex items-center space-x-2">
            <Checkbox
              :checked="block.hideFieldName"
              @update:checked="block.hideFieldName = $event"
              id="hideFieldName"
            />
            <Label for="hideFieldName" class="text-sm cursor-pointer">Hide field name</Label>
          </div>
        </div>

        <!-- Pre-filled value Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Pre-filled value</h4>
          <Input
            ref="prefilledValueInput"
            v-model="block.defaultValue"
            type="text"
            class="w-full"
            placeholder="Enter pre-filled value"
          />
        </div>

        <!-- Placeholder Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Empty Input Text - Placeholder</h4>
          <Input
            ref="placeholderInput"
            v-model="block.placeholder"
            type="text"
            class="w-full"
            placeholder="Enter placeholder text"
          />
        </div>

        <!-- Block Width Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Block Width</h4>
          <div class="grid grid-cols-6 gap-2">
            <Button
              v-for="width in blockWidths"
              :key="width.value"
              @click="block.width = width.value"
              :variant="block.width === width.value ? 'default' : 'outline'"
              size="sm"
              class="text-xs"
            >
              {{ width.label }}
            </Button>
          </div>
        </div>

        <!-- Help Text Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Help Text</h4>
          <div class="border border-border rounded-lg">
            <!-- Rich Text Editor Toolbar -->
            <div class="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <Heading1Icon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <Heading2Icon class="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" class="h-4" />
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <BoldIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <ItalicIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <UnderlineIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <StrikethroughIcon class="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" class="h-4" />
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <AlignLeftIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <AlignCenterIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <AlignRightIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <AlignJustifyIcon class="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" class="h-4" />
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <ListIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <ListOrderedIcon class="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" class="h-4" />
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <LinkIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <ImageIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <TableIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <CodeIcon class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <EraserIcon class="w-4 h-4" />
              </Button>
            </div>
            
            <!-- Rich Text Editor Content -->
            <div class="p-3">
              <textarea
                ref="helpTextInput"
                v-model="block.helpText"
                class="w-full min-h-[100px] border-0 resize-none focus:outline-none focus:ring-0"
                placeholder="Enter help text here..."
              ></textarea>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Displayed below/above the field, like this text</p>
        </div>

        <!-- Help Text Position Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Help Text Position</h4>
          <div class="flex gap-2">
            <Button
              @click="block.helpTextPosition = 'below'"
              :variant="block.helpTextPosition === 'below' ? 'default' : 'outline'"
              size="sm"
              class="flex-1"
            >
              Below input
            </Button>
            <Button
              @click="block.helpTextPosition = 'above'"
              :variant="block.helpTextPosition === 'above' ? 'default' : 'outline'"
              size="sm"
              class="flex-1"
            >
              Above input
            </Button>
          </div>
        </div>

        <!-- Max character limit Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Max character limit</h4>
          <Input
            ref="maxLengthInput"
            v-model.number="block.maxLength"
            type="number"
            class="w-full"
            placeholder="2000"
          />
          <div class="flex items-center space-x-2">
            <Checkbox
              :checked="block.showCharacterLimit"
              @update:checked="block.showCharacterLimit = $event"
              id="showCharacterLimit"
            />
            <Label for="showCharacterLimit" class="text-sm cursor-pointer">Always show character limit</Label>
          </div>
        </div>

        <!-- Advanced Options Section -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-muted-foreground">Advanced Options</h4>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :checked="!block.generateUniqueId && !block.generateAutoIncrementId"
                  @update:checked="setAdvancedOption(null)"
                  id="advancedOptionNone"
                  class="rounded-full"
                />
                <Label for="advancedOptionNone" class="text-sm cursor-pointer">None</Label>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :checked="block.generateUniqueId"
                  @update:checked="setAdvancedOption('generateUniqueId')"
                  id="advancedOptionUniqueId"
                  class="rounded-full"
                />
                <Label for="advancedOptionUniqueId" class="text-sm cursor-pointer">Generates a unique id</Label>
              </div>
              <p class="text-xs text-muted-foreground ml-6">If you enable this, we will hide this field and fill it with a unique id (UUID format) on each new form submission</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  :checked="block.generateAutoIncrementId"
                  @update:checked="setAdvancedOption('generateAutoIncrementId')"
                  id="advancedOptionAutoIncrementId"
                  class="rounded-full"
                />
                <Label for="advancedOptionAutoIncrementId" class="text-sm cursor-pointer">Generates an auto-incremented id</Label>
              </div>
              <p class="text-xs text-muted-foreground ml-6">If you enable this, we will hide this field and fill it a unique incrementing number on each new form submission</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Logic Tab -->
      <div v-if="activeTab === 'logic'" class="space-y-6">
        <p class="text-sm text-muted-foreground">Select a field, add some conditions, and finally add some actions.</p>
        
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <Button variant="outline" size="sm" class="flex-1">
            <DownloadIcon class="w-4 h-4 mr-2" />
            Copy from
          </Button>
          <Button variant="outline" size="sm" class="flex-1">
            <UploadIcon class="w-4 h-4 mr-2" />
            Copy to
          </Button>
          <Button variant="outline" size="sm" class="flex-1">
            <XIcon class="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <!-- Conditions Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-foreground">1. Conditions</h4>
          
          <!-- Operator -->
          <div class="space-y-2">
            <Label class="text-xs font-medium">Operator</Label>
            <select 
              v-model="block.logicOperator" 
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="and">And</option>
              <option value="or">Or</option>
            </select>
          </div>

          <!-- Conditions List -->
          <div class="space-y-3">
            <div v-if="availableFields.length === 0" class="p-3 border border-border rounded-md bg-muted/50">
              <p class="text-xs text-muted-foreground">No other fields available on canvas. Add more fields to create conditions.</p>
            </div>
            <div 
              v-for="(condition, index) in block.conditions" 
              :key="index"
              class="flex items-center gap-2 p-3 border border-border rounded-md"
            >
              <select 
                v-model="condition.field"
                class="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{{ availableFields.length > 0 ? `Select a field from canvas (${availableFields.length} available)` : 'No fields available' }}</option>
                <option v-for="field in availableFields" :key="field.id" :value="field.id">
                  {{ typeof field.label === 'string' ? field.label : 'Unknown field' }}
                </option>
              </select>
              
              <select 
                v-model="condition.operator"
                class="w-32 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="contains">contains</option>
                <option value="not_contains">not contains</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
              </select>
              
              <Input
                v-model="condition.value"
                placeholder="Value"
                class="w-32"
                v-if="!['is_empty', 'is_not_empty'].includes(condition.operator)"
              />
              
              <Button 
                @click="removeCondition(index)"
                variant="ghost" 
                size="sm"
                class="h-8 w-8 p-0"
              >
                <TrashIcon class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Add Condition/Group Buttons -->
          <div class="flex gap-2">
            <Button @click="addCondition" variant="outline" size="sm">
              Add Condition
            </Button>
            <Button @click="addConditionGroup" variant="outline" size="sm">
              Add Group
            </Button>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-foreground">2. Actions</h4>
          <p class="text-xs text-muted-foreground">Action(s) triggered when above conditions are true.</p>
          
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <Checkbox
                :checked="block.logicActions.hideBlock"
                @update:checked="block.logicActions.hideBlock = $event"
                id="hideBlock"
              />
              <Label for="hideBlock" class="text-sm cursor-pointer">Hide Block</Label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox
                :checked="block.logicActions.disableBlock"
                @update:checked="block.logicActions.disableBlock = $event"
                id="disableBlock"
              />
              <Label for="disableBlock" class="text-sm cursor-pointer">Disable Block</Label>
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox
                :checked="block.logicActions.requireAnswer"
                @update:checked="block.logicActions.requireAnswer = $event"
                id="requireAnswer"
              />
              <Label for="requireAnswer" class="text-sm cursor-pointer">Require answer</Label>
            </div>
          </div>
          
          <p class="text-xs text-muted-foreground">Note that hidden fields can never be required.</p>
        </div>
      </div>

      <!-- Validation Tab -->
      <div v-if="activeTab === 'validation'" class="space-y-6">
        <!-- Step 1: Set Validation Rules -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-foreground">Step 1: Set Validation Rules</h4>
          <p class="text-xs text-muted-foreground">Add validation rules. The field is valid if these conditions are met.</p>
          
          <!-- Operator -->
          <div class="space-y-2">
            <Label class="text-xs font-medium">Operator</Label>
            <select 
              v-model="block.validationOperator" 
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="and">And</option>
              <option value="or">Or</option>
            </select>
          </div>

          <!-- Validation Conditions List -->
          <div class="space-y-3">
            <div v-if="availableFields.length === 0" class="p-3 border border-border rounded-md bg-muted/50">
              <p class="text-xs text-muted-foreground">No other fields available on canvas. Add more fields to create validation rules.</p>
            </div>
            <div 
              v-for="(condition, index) in block.validationConditions" 
              :key="index"
              class="flex items-center gap-2 p-3 border border-border rounded-md"
            >
              <select 
                v-model="condition.field"
                class="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{{ availableFields.length > 0 ? `Select a field from canvas (${availableFields.length} available)` : 'No fields available' }}</option>
                <option v-for="field in availableFields" :key="field.id" :value="field.id">
                  {{ typeof field.label === 'string' ? field.label : 'Unknown field' }}
                </option>
              </select>
              
              <select 
                v-model="condition.operator"
                class="w-32 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="contains">contains</option>
                <option value="not_contains">not contains</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
                <option value="greater_than_or_equal">greater than or equal</option>
                <option value="less_than_or_equal">less than or equal</option>
              </select>
              
              <Input
                v-model="condition.value"
                placeholder="Value"
                class="w-32"
                v-if="!['is_empty', 'is_not_empty'].includes(condition.operator)"
              />
              
              <Button 
                @click="removeValidationCondition(index)"
                variant="ghost" 
                size="sm"
                class="h-8 w-8 p-0"
              >
                <TrashIcon class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Add Validation Condition/Group Buttons -->
          <div class="flex gap-2">
            <Button @click="addValidationCondition" variant="outline" size="sm">
              Add Condition
            </Button>
            <Button @click="addValidationConditionGroup" variant="outline" size="sm">
              Add Group
            </Button>
          </div>
        </div>

        <!-- Step 2: Set Error Message -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-foreground">Step 2: Set Error Message</h4>
          <p class="text-xs text-muted-foreground">The error message to show when validation fails.</p>
          
          <div class="space-y-2">
            <Label class="text-xs font-medium">Error message</Label>
            <Input
              v-model="block.validationErrorMessage"
              placeholder="Enter error message"
              class="w-full"
            />
          </div>
        </div>

        <!-- Informational Message -->
        <div class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <InfoIcon class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p class="text-xs text-yellow-800">Remember to save your form to apply these validation rules.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  XIcon, 
  TrashIcon,
  AsteriskIcon,
  EyeIcon,
  LockIcon,
  Heading1Icon,
  Heading2Icon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ListIcon,
  ListOrderedIcon,
  LinkIcon,
  ImageIcon,
  TableIcon,
  CodeIcon,
  EraserIcon,
  DownloadIcon,
  UploadIcon,
  InfoIcon
} from 'lucide-vue-next'

interface Props {
  block: any
  formBlocks?: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref('options')

// Template refs for input focus
const fieldNameInput = ref<HTMLInputElement>()
const prefilledValueInput = ref<HTMLInputElement>()
const placeholderInput = ref<HTMLInputElement>()
const helpTextInput = ref<HTMLTextAreaElement>()
const maxLengthInput = ref<HTMLInputElement>()

const tabs = [
  { id: 'options', label: 'Options' },
  { id: 'logic', label: 'Logic' },
  { id: 'validation', label: 'Validation' }
]

const blockWidths = [
  { label: 'Full', value: 'full' },
  { label: '1/2', value: '1/2' },
  { label: '1/3', value: '1/3' },
  { label: '2/3', value: '2/3' },
  { label: '1/4', value: '1/4' },
  { label: '3/4', value: '3/4' }
]

const getBlockTitle = () => {
  const blockType = props.block.type
  const typeMap: Record<string, string> = {
    'text': 'Text Input',
    'textarea': 'Text Area',
    'email': 'Email Input',
    'number': 'Number Input',
    'phone': 'Phone Input',
    'url': 'URL Input',
    'date': 'Date Input',
    'select': 'Select Input',
    'radio': 'Radio Input',
    'checkbox': 'Checkbox Input',
    'multi-select': 'Multi Select Input',
    'rating': 'Rating Input',
    'scale': 'Scale Input',
    'slider': 'Slider Input',
    'matrix': 'Matrix Input',
    'payment': 'Payment Input',
    'file': 'File Input',
    'signature': 'Signature Input',
    'barcode': 'Barcode Input',
    'qr-code': 'QR Code Input',
    'rich-text': 'Rich Text Input',
    'text-block': 'Text Block',
    'image': 'Image Block',
    'divider': 'Divider Block',
    'page-break': 'Page Break Block',
    'code': 'Code Block'
  }
  return typeMap[blockType] || 'Block Settings'
}

// Function to set field state (radio button behavior)
const setFieldState = (state: 'required' | 'hidden' | 'disabled' | null) => {
  if (props.block.fieldState === state) {
    // If clicking the same state, deselect it
    props.block.fieldState = null
  } else {
    // Set the new state (only one can be active)
    props.block.fieldState = state
  }
}

// Function to set advanced options (radio button behavior)
const setAdvancedOption = (option: 'generateUniqueId' | 'generateAutoIncrementId' | null) => {
  // Reset all advanced options first
  props.block.generateUniqueId = false
  props.block.generateAutoIncrementId = false
  
  // Set the selected option if not null
  if (option) {
    props.block[option] = true
  }
}

// Function to focus field name input
const focusFieldName = () => {
  nextTick(() => {
    fieldNameInput.value?.focus()
  })
}

// Logic functions
const addCondition = () => {
  if (!props.block.conditions) {
    props.block.conditions = []
  }
  props.block.conditions.push({
    field: '',
    operator: 'equals',
    value: ''
  })
}

const removeCondition = (index: number) => {
  props.block.conditions.splice(index, 1)
}

const addConditionGroup = () => {
  if (!props.block.conditions) {
    props.block.conditions = []
  }
  props.block.conditions.push({
    field: '',
    operator: 'equals',
    value: '',
    group: true
  })
}

// Available fields from the current form canvas
const availableFields = computed(() => {
  if (!props.formBlocks) return []
  
  // Debug: Log the formBlocks to understand the structure
  console.log('formBlocks:', props.formBlocks)
  
  const fields = props.formBlocks
    .filter(block => block.id !== props.block.id) // Exclude current block
    .map(block => {
      // Debug: Log each block to understand its structure
      console.log('block:', block)
      
      // Ensure we have a proper label
      let label = 'Unnamed field'
      if (block.label && typeof block.label === 'string') {
        label = block.label
      } else if (block.type && typeof block.type === 'string') {
        label = `${block.type} field`
      }
      
      return {
        id: block.id,
        label: label
      }
    })
  
  // Debug: Log the final fields array
  console.log('Available fields:', fields)
  
  return fields
})

// Validation functions
const addValidationCondition = () => {
  if (!props.block.validationConditions) {
    props.block.validationConditions = []
  }
  props.block.validationConditions.push({
    field: '',
    operator: 'equals',
    value: ''
  })
}

const removeValidationCondition = (index: number) => {
  props.block.validationConditions.splice(index, 1)
}

const addValidationConditionGroup = () => {
  if (!props.block.validationConditions) {
    props.block.validationConditions = []
  }
  props.block.validationConditions.push({
    field: '',
    operator: 'equals',
    value: '',
    group: true
  })
}

// Initialize default values for new blocks
if (!props.block.width) props.block.width = 'full'
if (!props.block.helpTextPosition) props.block.helpTextPosition = 'below'
if (!props.block.maxLength) props.block.maxLength = 2000
if (!props.block.fieldState === undefined) props.block.fieldState = null
if (!props.block.multiLine === undefined) props.block.multiLine = false
if (!props.block.secretInput === undefined) props.block.secretInput = false
if (!props.block.hideFieldName === undefined) props.block.hideFieldName = false
if (!props.block.showCharacterLimit === undefined) props.block.showCharacterLimit = false
if (!props.block.generateUniqueId === undefined) props.block.generateUniqueId = false
if (!props.block.generateAutoIncrementId === undefined) props.block.generateAutoIncrementId = false

// Initialize logic properties
if (!props.block.logicOperator) props.block.logicOperator = 'and'
if (!props.block.conditions) props.block.conditions = []
if (!props.block.logicActions) props.block.logicActions = {
  hideBlock: false,
  disableBlock: false,
  requireAnswer: false
}

// Initialize validation properties
if (!props.block.validationOperator) props.block.validationOperator = 'and'
if (!props.block.validationConditions) props.block.validationConditions = []
if (!props.block.validationErrorMessage) props.block.validationErrorMessage = ''
</script> 