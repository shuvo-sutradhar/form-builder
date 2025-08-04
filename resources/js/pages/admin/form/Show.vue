<template>
  <Head title="Form Preview" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <template #header>
      <div class="flex items-center justify-between">
        <Heading>Form Preview</Heading>
        <div class="flex items-center gap-2">
          <Button @click="goBack" variant="outline" size="sm">
            <ArrowLeftIcon class="w-4 h-4 mr-1" />
            Back to Forms
          </Button>
          <Button @click="editForm" class="flex items-center gap-2">
            <EditIcon class="w-4 h-4" />
            Edit Form
          </Button>
        </div>
      </div>
    </template>

    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Preview Controls -->
      <div class="bg-card border rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Preview Mode:</span>
              <Badge variant="secondary">Client View</Badge>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Form Status:</span>
              <Badge :variant="getStatusVariant(formData.status)">
                {{ formData.status }}
              </Badge>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button @click="copyFormUrl" variant="outline" size="sm">
              <CopyIcon class="w-4 h-4 mr-1" />
              Copy URL
            </Button>
            <Button @click="openInNewTab" variant="outline" size="sm">
              <ExternalLinkIcon class="w-4 h-4 mr-1" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>

      <!-- Form Preview Container -->
      <div class="flex justify-center">
        <div class="w-full max-w-2xl">
          <!-- Form Card -->
          <Card 
            class="p-8 shadow-lg"
            :style="{
              backgroundColor: formData.theme?.backgroundColor || '#ffffff',
              color: formData.theme?.textColor || '#1f2937',
              borderRadius: formData.theme?.borderRadius || '0.5rem',
              fontFamily: formData.theme?.fontFamily || 'Inter',
              fontSize: formData.theme?.fontSize || '1rem'
            }"
          >
            <!-- Form Header -->
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold mb-2">{{ formData.title }}</h1>
              <p v-if="formData.description" class="text-lg text-muted-foreground">
                {{ formData.description }}
              </p>
            </div>

            <!-- Progress Bar (if enabled) -->
            <div v-if="formData.showProgressBar" class="mb-6">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <p class="text-sm text-muted-foreground mt-2">
                Step {{ currentStep }} of {{ totalSteps }}
              </p>
            </div>

            <!-- Form Fields -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div 
                v-for="(block, index) in formData.blocks" 
                :key="block.id"
                class="form-field"
              >
                <component 
                  :is="getBlockComponent(block.type)"
                  v-bind="block"
                  :required="block.required"
                  :label="block.label"
                  :placeholder="block.placeholder"
                  :model-value="formValues[block.id]"
                  @update:value="updateFormValue(block.id, $event)"
                />
              </div>

              <!-- Submit Button -->
              <div class="pt-6">
                <Button 
                  type="submit"
                  class="w-full"
                  size="lg"
                  :style="{ backgroundColor: formData.theme?.primaryColor || '#3b82f6' }"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else>{{ formData.submitButtonText || 'Submit Form' }}</span>
                </Button>
              </div>
            </form>

            <!-- Form Footer -->
            <div v-if="formData.footerText" class="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              {{ formData.footerText }}
            </div>
          </Card>
        </div>
      </div>

      <!-- Preview Info -->
      <div class="bg-card border rounded-lg p-4 mt-6">
        <h3 class="text-lg font-semibold mb-3">Preview Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="font-medium">Form ID:</span>
            <span class="ml-2 text-muted-foreground">{{ formId }}</span>
          </div>
          <div>
            <span class="font-medium">Total Fields:</span>
            <span class="ml-2 text-muted-foreground">{{ formData.blocks?.length || 0 }}</span>
          </div>
          <div>
            <span class="font-medium">Created:</span>
            <span class="ml-2 text-muted-foreground">{{ formatDate(formData.created_at) }}</span>
          </div>
        </div>
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
  ArrowLeftIcon,
  EditIcon,
  CopyIcon,
  ExternalLinkIcon
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  last_login?: string
  slug?: string
}

interface Props {
  user: User
  formId: string
}

const props = defineProps<Props>()

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
    title: 'Preview Form',
    href: `/admin/form/${props.formId}/show`,
  },
]

// Mock form data - replace with actual API call
const formData = ref({
  id: props.formId,
  title: 'Customer Feedback Form',
  description: 'We value your feedback! Please take a moment to share your thoughts about our products and services.',
  status: 'published',
  created_at: '2024-01-15T10:30:00Z',
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '0.5rem',
    fontFamily: 'Inter',
    fontSize: '1rem'
  },
  showProgressBar: true,
  submitButtonText: 'Submit Feedback',
  footerText: 'Your feedback helps us improve our services.',
  blocks: [
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      size: 'md'
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      size: 'md'
    },
    {
      id: '3',
      type: 'select',
      label: 'How did you hear about us?',
      placeholder: 'Select an option',
      required: false,
      options: [
        { value: 'social', label: 'Social Media' },
        { value: 'search', label: 'Search Engine' },
        { value: 'friend', label: 'Friend/Colleague' },
        { value: 'advertisement', label: 'Advertisement' },
        { value: 'other', label: 'Other' }
      ],
      size: 'md'
    },
    {
      id: '4',
      type: 'rating',
      label: 'Overall Satisfaction',
      required: true,
      maxRating: 5,
      size: 'md'
    },
    {
      id: '5',
      type: 'textarea',
      label: 'Additional Comments',
      placeholder: 'Please share any additional thoughts or suggestions...',
      required: false,
      rows: 4,
      size: 'md'
    }
  ]
})

const formValues = ref({})
const isSubmitting = ref(false)
const currentStep = ref(1)
const totalSteps = ref(1)

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps.value) * 100
})

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published': return 'default'
    case 'draft': return 'secondary'
    case 'archived': return 'destructive'
    default: return 'outline'
  }
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

const updateFormValue = (fieldId: string, value: any) => {
  formValues.value[fieldId] = value
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('Form submitted:', formValues.value)
  
  // Show success message
  alert('Form submitted successfully! (This is a preview)')
  
  isSubmitting.value = false
}

const goBack = () => {
  router.visit('/admin/form')
}

const editForm = () => {
  router.visit(`/admin/form/${props.formId}/edit`)
}

const copyFormUrl = () => {
  const url = `${window.location.origin}/forms/${props.formId}`
  navigator.clipboard.writeText(url).then(() => {
    alert('Form URL copied to clipboard!')
  })
}

const openInNewTab = () => {
  const url = `${window.location.origin}/forms/${props.formId}`
  window.open(url, '_blank')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  // Initialize form values
  formData.value.blocks?.forEach(block => {
    formValues.value[block.id] = ''
  })
  
  // Calculate total steps (for progress bar)
  totalSteps.value = formData.value.blocks?.length || 1
})
</script>

<style scoped>
.form-field {
  transition: all 0.2s ease;
}

.form-field:hover {
  transform: translateY(-1px);
}
</style> 