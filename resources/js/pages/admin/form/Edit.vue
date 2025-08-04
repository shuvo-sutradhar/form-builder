<template>
  <Head title="Edit Form" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <template #header>
      <div class="flex items-center justify-between">
        <Heading>Edit Form</Heading>
        <Button @click="goBack" variant="outline" size="sm">
          <ArrowLeftIcon class="w-4 h-4 mr-1" />
          Back to Forms
        </Button>
      </div>
    </template>

    <div class="flex bg-background" :dir="formSettings.rtl ? 'rtl' : 'ltr'">
    <!-- Left Sidebar - Form Structure -->
    <div class="w-80 bg-card border-r border-border flex flex-col">
      <div class="p-4 border-b border-border flex-shrink-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-foreground">Form Structure</h2>
          <Button @click="goBack" variant="ghost" size="sm">
            <ArrowLeftIcon class="w-4 h-4" />
          </Button>
        </div>
        <div class="space-y-2">
          <Button 
            @click="addBlock"
            class="w-full"
            size="sm"
          >
            <PlusIcon class="w-4 h-4" />
            Add Block
          </Button>
          <Button 
            @click="showSettings = true"
            variant="outline"
            class="w-full"
            size="sm"
          >
            <SettingsIcon class="w-4 h-4" />
            Form Settings
          </Button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 min-h-0">
        <div class="space-y-3">
          <Card 
            v-for="(block, index) in formBlocks" 
            :key="block.id"
            class="cursor-move transition-all"
            :class="[
              selectedBlock?.id === block.id ? 'ring-2 ring-primary ring-offset-2' : '',
              draggedBlockIndex === index ? 'opacity-50 scale-95' : '',
              dropTargetIndex === index && draggedBlockIndex !== index ? 'border-blue-300 bg-blue-50' : ''
            ]"
            @click="selectBlock(block)"
            draggable="true"
            @dragstart="handleBlockDragStart($event, index)"
            @dragover="handleBlockDragOver($event, index)"
            @drop="handleBlockDrop($event, index)"
            @dragenter="handleBlockDragEnter($event, index)"
            @dragleave="handleBlockDragLeave($event)"
          >
            <CardContent class="p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <GripVerticalIcon class="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <div class="flex items-center gap-1">
                    <span class="text-sm font-medium text-foreground">
                      {{ block.label || `${block.type} field` }}
                    </span>
                    <Badge v-if="block.required" variant="destructive" class="text-xs">Required</Badge>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <Button 
                    @click.stop="openBlockSettings(block)"
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6"
                    title="Settings"
                  >
                    <SettingsIcon class="w-3 h-3" />
                  </Button>
                  <Button 
                    @click.stop="duplicateBlock(index)"
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6"
                    title="Duplicate"
                  >
                    <CopyIcon class="w-3 h-3" />
                  </Button>
                  <Button 
                    @click.stop="removeBlock(index)"
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6 text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <TrashIcon class="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Center - Form Preview -->
    <div class="flex-1 flex flex-col">
      <div class="bg-card border-b border-border p-4 flex-shrink-0">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-foreground">Form Preview</h1>
          <div class="flex items-center gap-2">
            <Button 
              @click="saveForm"
              variant="outline"
              size="sm"
            >
              <SaveIcon class="w-4 h-4 mr-1" />
              Save Draft
            </Button>
            <Button 
              @click="publishForm"
              size="sm"
            >
              <GlobeIcon class="w-4 h-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>
      
      <div 
        class="flex-1 overflow-y-auto p-8 min-h-0"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        :class="{ 'bg-blue-50 border-2 border-dashed border-blue-300': isDragOver }"
      >
        <div class="max-w-2xl mx-auto">
          <Card 
            class="p-8"
            :style="{
              backgroundColor: formSettings.theme.backgroundColor,
              color: formSettings.theme.textColor,
              borderRadius: formSettings.theme.borderRadius,
              fontFamily: formSettings.theme.fontFamily,
              fontSize: formSettings.theme.fontSize
            }"
          >
            <CardHeader class="pb-4">
              <CardTitle class="text-2xl font-bold">{{ formSettings.title }}</CardTitle>
              <CardDescription v-if="formSettings.description" class="text-muted-foreground">
                {{ formSettings.description }}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="flex flex-wrap gap-4">
                  <div 
                    v-for="block in formBlocks" 
                    :key="block.id"
                    class="form-block relative"
                    :class="[getWidthClass(block.width), { 'ring-2 ring-primary ring-offset-2': selectedBlock?.id === block.id }]"
                  >
                    <component 
                      :is="getBlockComponent(block.type)"
                      v-bind="block"
                      :required="block.required"
                      :disabled="block.disabled"
                      :hidden="block.hidden"
                      :field-state="block.fieldState"
                      :hide-field-name="block.hideFieldName"
                      :width="block.width"
                      :label="block.label"
                      :placeholder="block.placeholder"
                      :help-text="block.helpText"
                      :help-text-position="block.helpTextPosition"
                      :max-length="block.maxLength"
                      :show-character-limit="block.showCharacterLimit"
                      :generate-unique-id="block.generateUniqueId"
                      :generate-auto-increment-id="block.generateAutoIncrementId"
                      :multi-line="block.multiLine"
                      :secret-input="block.secretInput"
                      :logic-actions="block.logicActions"
                      :validation-conditions="block.validationConditions"
                      :validation-error-message="block.validationErrorMessage"
                      :model-value="block.defaultValue"
                      @update:value="updateBlockValue(block.id, $event)"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  class="w-full"
                  :style="{ backgroundColor: formSettings.theme.primaryColor }"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Right Sidebar - Input Blocks or Settings -->
    <div v-if="!selectedBlock && !showSettings" class="w-80 bg-card border-l border-border flex flex-col">
      <div class="p-4 border-b border-border flex-shrink-0">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-foreground">Form Blocks</h2>
          <Button @click="closeBlockPanel" variant="ghost" size="icon" class="h-6 w-6">
            <XIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 min-h-0">
        <div class="space-y-4">
          <div class="mb-4">
            <h3 class="text-sm font-medium text-muted-foreground mb-2">Input Blocks</h3>
            <div class="grid grid-cols-2 gap-2">
              <Button 
                v-for="blockType in inputBlockTypes" 
                :key="blockType.type"
                @click="addBlockByType(blockType.type)"
                @dragstart="handleDragStart($event, blockType.type)"
                draggable="true"
                variant="outline"
                class="h-auto p-3 flex-col items-start gap-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                size="sm"
              >
                <component :is="iconMap[blockType.icon]" class="w-4 h-4 text-muted-foreground" />
                <div class="text-xs font-medium text-foreground">{{ blockType.label }}</div>
              </Button>
            </div>
          </div>
          
          <div class="mb-4">
            <h3 class="text-sm font-medium text-muted-foreground mb-2">Layout Blocks</h3>
            <div class="grid grid-cols-2 gap-2">
              <Button 
                v-for="blockType in layoutBlockTypes" 
                :key="blockType.type"
                @click="addBlockByType(blockType.type)"
                @dragstart="handleDragStart($event, blockType.type)"
                draggable="true"
                variant="outline"
                class="h-auto p-3 flex-col items-start gap-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                size="sm"
              >
                <component :is="iconMap[blockType.icon]" class="w-4 h-4 text-muted-foreground" />
                <div class="text-xs font-medium text-foreground">{{ blockType.label }}</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Block Settings Panel -->
    <div v-if="selectedBlock && !showSettings" class="w-80 bg-card border-l border-border flex flex-col">
      <BlockSettings 
        :block="selectedBlock"
        :form-blocks="formBlocks"
        @close="selectedBlock = null"
      />
    </div>

    <!-- Form Settings Panel -->
    <div v-if="showSettings" class="w-80 bg-card border-l border-border flex flex-col">
      <FormSettings 
        :settings="formSettings"
        @close="showSettings = false"
      />
    </div>
  </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { router, Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types'
import Heading from '@/components/Heading.vue'
import { 
  PlusIcon, 
  GripVerticalIcon, 
  TrashIcon, 
  XIcon,
  SettingsIcon,
  CopyIcon,
  TypeIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  LinkIcon,
  FileTextIcon,
  CheckSquareIcon,
  ListIcon,
  HashIcon,
  StarIcon,
  ScaleIcon,
  SlidersIcon,
  ImageIcon,
  CodeIcon,
  SeparatorHorizontalIcon,
  RadioIcon,
  FileIcon,
  ScanIcon,
  QrCodeIcon,
  CreditCardIcon,
  PenToolIcon,
  GridIcon,
  MinusIcon,
  ArrowLeftIcon,
  SaveIcon,
  GlobeIcon
} from 'lucide-vue-next'
import {
  TextInput,
  TextArea,
  RichTextInput,
  DateInput,
  UrlInput,
  PhoneInput,
  EmailInput,
  SelectInput,
  MultiSelectInput,
  CheckboxInput,
  RadioInput,
  MatrixInput,
  NumberInput,
  RatingInput,
  ScaleInput,
  SliderInput,
  FileInput,
  SignatureInput,
  BarcodeInput,
  QrCodeInput,
  PaymentInput,
  TextBlock,
  ImageBlock,
  DividerBlock,
  PageBreakBlock,
  CodeBlock
} from '@/components/form-blocks'
import BlockSettings from '@/components/BlockSettings.vue'
import FormSettings from '@/components/FormSettings.vue'
import { useFormBuilder } from '@/composables/useFormBuilder'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const {
  formBlocks,
  selectedBlock,
  formSettings,
  addBlock,
  removeBlock,
  selectBlock,
  updateBlock,
  duplicateBlock,
  exportForm,
  validateForm,
  blockTypes,
  importForm
} = useFormBuilder()

const showSettings = ref(false)
const isDragOver = ref(false)
const draggedBlockIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Forms',
    href: '/admin/form',
  },
  {
    title: 'Edit Form',
    href: '/admin/form/edit',
  },
]

// Create a mapping of icon names to actual icon components
const iconMap: Record<string, any> = {
  Type: TypeIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Calendar: CalendarIcon,
  Link: LinkIcon,
  FileText: FileTextIcon,
  CheckSquare: CheckSquareIcon,
  Radio: RadioIcon,
  List: ListIcon,
  Hash: HashIcon,
  Star: StarIcon,
  Scale: ScaleIcon,
  Sliders: SlidersIcon,
  File: FileIcon,
  Image: ImageIcon,
  SeparatorHorizontal: SeparatorHorizontalIcon,
  Code: CodeIcon,
  Scan: ScanIcon,
  QrCode: QrCodeIcon,
  CreditCard: CreditCardIcon,
  PenTool: PenToolIcon,
  Grid: GridIcon,
  Minus: MinusIcon
}

// Separate block types into input and layout blocks
const inputBlockTypes = computed(() => {
  return blockTypes.filter(block => !['text-block', 'image', 'divider', 'page-break', 'code'].includes(block.type))
})

const layoutBlockTypes = computed(() => {
  return blockTypes.filter(block => ['text-block', 'image', 'divider', 'page-break', 'code'].includes(block.type))
})



const addBlockByType = (type: string) => {
  addBlock(type as any)
}

const getWidthClass = (width?: string) => {
  switch (width) {
    case 'full': return 'w-full'
    case '1/2': return 'w-[calc(50%-0.5rem)]'
    case '1/3': return 'w-[calc(33.333%-0.67rem)]'
    case '2/3': return 'w-[calc(66.667%-0.33rem)]'
    case '1/4': return 'w-[calc(25%-0.75rem)]'
    case '3/4': return 'w-[calc(75%-0.25rem)]'
    default: return 'w-full'
  }
}

const updateBlockValue = (blockId: string, value: any) => {
  updateBlock(blockId, { value })
}

const getBlockComponent = (type: string) => {
  const components: Record<string, any> = {
    text: TextInput,
    textarea: TextArea,
    'rich-text': RichTextInput,
    date: DateInput,
    url: UrlInput,
    phone: PhoneInput,
    email: EmailInput,
    select: SelectInput,
    'multi-select': MultiSelectInput,
    checkbox: CheckboxInput,
    radio: RadioInput,
    matrix: MatrixInput,
    number: NumberInput,
    rating: RatingInput,
    scale: ScaleInput,
    slider: SliderInput,
    file: FileInput,
    signature: SignatureInput,
    barcode: BarcodeInput,
    'qr-code': QrCodeInput,
    payment: PaymentInput,
    'text-block': TextBlock,
    image: ImageBlock,
    divider: DividerBlock,
    'page-break': PageBreakBlock,
    code: CodeBlock
  }
  return components[type] || TextInput
}

const closeBlockPanel = () => {
  // Implementation for closing the block panel
}

const goBack = () => {
  router.visit('/admin/form')
}

const saveForm = () => {
  console.log('Saving form draft:', exportForm())
  // Implementation for saving form as draft
}

const publishForm = () => {
  console.log('Publishing form:', exportForm())
  // Implementation for publishing form
}

const handleSubmit = () => {
  const errors = validateForm()
  if (Object.keys(errors).length === 0) {
    console.log('Form submitted:', formBlocks.value)
    // Implementation for form submission
  } else {
    console.log('Validation errors:', errors)
  }
}

// Drag and Drop functionality
const handleDragStart = (event: DragEvent, blockType: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', blockType)
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only set isDragOver to false if we're leaving the drop zone entirely
  if (!event.currentTarget?.contains(event.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const blockType = event.dataTransfer?.getData('text/plain')
  if (blockType) {
    addBlock(blockType as any)
  }
}

// Block specific drag and drop handlers
const handleBlockDragStart = (event: DragEvent, index: number) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'block', index }))
    event.dataTransfer.effectAllowed = 'move'
    draggedBlockIndex.value = index
  }
}

const handleBlockDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dropTargetIndex.value = index
}

const handleBlockDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault()
  dropTargetIndex.value = index
}

const handleBlockDragLeave = (event: DragEvent) => {
  event.preventDefault()
  dropTargetIndex.value = null
}

const handleBlockDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  draggedBlockIndex.value = null
  dropTargetIndex.value = null
  try {
    const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}')
    if (data.type === 'block' && typeof data.index === 'number' && data.index !== index) {
      // Ensure we're working with valid indices
      if (data.index >= 0 && data.index < formBlocks.value.length && 
          index >= 0 && index < formBlocks.value.length) {
        const [draggedBlock] = formBlocks.value.splice(data.index, 1)
        formBlocks.value.splice(index, 0, draggedBlock)
        // Re-select the block to update its position in the UI
        selectBlock(draggedBlock)
      }
    }
  } catch (error) {
    console.error('Error during block drop:', error)
  }
}

const openBlockSettings = (block: any) => {
  selectBlock(block)
  showSettings.value = true
}

// Load existing form data on mount
onMounted(() => {
  // Mock data - replace with actual API call to load form data
  const mockFormData = {
    blocks: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        defaultValue: '',
        size: 'md',
        textAlign: 'left',
        fontSize: 'md',
        fontWeight: 'normal'
      },
      {
        id: '2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        defaultValue: '',
        size: 'md',
        textAlign: 'left',
        fontSize: 'md',
        fontWeight: 'normal'
      }
    ],
    settings: {
      title: 'Contact Form',
      description: 'Please fill out the form below to contact us',
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: 'md',
        fontFamily: 'Inter',
        fontSize: 'base'
      },
      rtl: false,
      showProgressBar: true,
      allowMultipleSubmissions: false,
      redirectUrl: '',
      emailNotifications: false,
      notificationEmail: ''
    }
  }
  
  importForm(mockFormData)
})
</script>

<style scoped>
.form-block {
  transition: all 0.2s ease;
}

.form-block:hover {
  border-color: #3b82f6;
}

/* Drag and drop styles */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}
</style> 