<template>
  <AppLayout title="Form Preview">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Form Preview
      </h2>
    </template>

    <div class="py-12">
      <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <!-- Browser-like Window Frame -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Window Title Bar -->
          <div class="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div class="text-gray-600 text-sm font-medium">Form Preview</div>
            <div class="w-4 h-4">
              <svg class="w-full h-full text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </div>
          </div>

          <!-- Form Content Area -->
          <div class="p-8 bg-white">
            <!-- Form Title -->
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-gray-900">{{ formData.title || 'My Form' }}</h1>
            </div>

            <!-- Form Fields -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="flex flex-wrap gap-4">
                <div 
                  v-for="(block, index) in formData.blocks" 
                  :key="block.id"
                  class="form-block relative"
                  :class="getWidthClass(block.width)"
                  :data-width="block.width"
                  :data-width-class="getWidthClass(block.width)"
                >
                  <!-- Field Container with Border -->
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 relative"
                    :class="{ 'border-blue-400': selectedBlock?.id === block.id }"
                  >
                    <!-- Edit Controls -->
                    <div class="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                      <button 
                        class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        @click="addBlockAfter(index)"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                      <button 
                        class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        @click="editBlock(block)"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                      <button 
                        class="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                        @click="deleteBlock(block.id)"
                      >
                        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Drag Handle -->
                    <div class="absolute -left-6 top-1/2 transform -translate-y-1/2">
                      <div class="w-2 h-8 flex flex-col justify-center items-center">
                        <div class="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                        <div class="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
                        <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>

                    <!-- Form Component -->
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
                    :model-value="formValues[block.id]"
                      @update:value="updateFormValue(block.id, $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="text-center pt-6">
                <button 
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import { getBlockComponent } from '@/components/form-blocks'

interface FormBlock {
  id: string
  type: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  [key: string]: any
}

interface FormData {
  id?: string
  title: string
  blocks: FormBlock[]
}

const props = defineProps<{
  form: FormData
}>()

const formData = ref<FormData>(props.form)
const formValues = ref<Record<string, any>>({})
const selectedBlock = ref<FormBlock | null>(null)

// Initialize form values
onMounted(() => {
  console.log('Form data:', formData.value)
  console.log('Blocks:', formData.value.blocks)
  formData.value.blocks?.forEach((block) => {
    console.log('Block:', block.id, 'Width:', block.width)
    formValues.value[block.id] = block.defaultValue || ''
  })
})

const updateFormValue = (fieldId: string, value: any) => {
  formValues.value[fieldId] = value
}

const handleSubmit = () => {
  console.log('Form submitted:', formValues.value)
  // Handle form submission here
}

const editBlock = (block: FormBlock) => {
  selectedBlock.value = block
  // Emit event to parent or handle editing
}

const deleteBlock = (blockId: string) => {
  // Handle block deletion
  console.log('Delete block:', blockId)
}

const addBlockAfter = (index: number) => {
  // Handle adding new block after the specified index
  console.log('Add block after index:', index)
}

const getWidthClass = (width?: string) => {
  console.log('getWidthClass called with width:', width)
  const result = (() => {
    switch (width) {
      case 'full': return 'w-full'
      case '1/2': return 'w-[calc(50%-0.5rem)]'
      case '1/3': return 'w-[calc(33.333%-0.67rem)]'
      case '2/3': return 'w-[calc(66.667%-0.33rem)]'
      case '1/4': return 'w-[calc(25%-0.75rem)]'
      case '3/4': return 'w-[calc(75%-0.25rem)]'
      default: return 'w-full'
    }
  })()
  console.log('getWidthClass returning:', result)
  return result
}
</script>

<style scoped>
/* Custom styles for the preview window */
.border-dashed {
  border-style: dashed;
}

/* Hover effects for edit controls */
.form-field:hover .border-dashed {
  border-color: #3b82f6;
}

/* Debug styles - ensure flexbox works */
.form-block {
  display: block;
  min-width: 0;
}

/* Ensure the flex container works properly */
.flex.flex-wrap {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 1rem !important;
}
</style> 