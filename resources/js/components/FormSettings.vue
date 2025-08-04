<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border flex-shrink-0">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-foreground">Form Settings</h3>
        <Button @click="$emit('close')" variant="ghost" size="icon" class="h-6 w-6">
          <XIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 min-h-0 space-y-6">
      <!-- Basic Settings -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">Basic Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Form Title</Label>
            <Input
              v-model="settings.title"
              type="text"
              class="w-full"
            />
          </div>
          
          <div class="space-y-1">
            <Label class="text-xs">Description</Label>
            <textarea
              v-model="settings.description"
              rows="3"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Theme Settings -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">Theme Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Primary Color</Label>
            <div class="flex items-center gap-2">
              <input
                v-model="settings.theme.primaryColor"
                type="color"
                class="w-8 h-8 border border-border rounded cursor-pointer"
              />
              <Input
                v-model="settings.theme.primaryColor"
                type="text"
                class="flex-1"
              />
            </div>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Background Color</Label>
            <div class="flex items-center gap-2">
              <input
                v-model="settings.theme.backgroundColor"
                type="color"
                class="w-8 h-8 border border-border rounded cursor-pointer"
              />
              <Input
                v-model="settings.theme.backgroundColor"
                type="text"
                class="flex-1"
              />
            </div>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Text Color</Label>
            <div class="flex items-center gap-2">
              <input
                v-model="settings.theme.textColor"
                type="color"
                class="w-8 h-8 border border-border rounded cursor-pointer"
              />
              <Input
                v-model="settings.theme.textColor"
                type="text"
                class="flex-1"
              />
            </div>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Border Radius</Label>
            <select
              v-model="settings.theme.borderRadius"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0">None</option>
              <option value="0.25rem">Small</option>
              <option value="0.5rem">Medium</option>
              <option value="1rem">Large</option>
              <option value="1.5rem">Extra Large</option>
            </select>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Font Family</Label>
            <select
              v-model="settings.theme.fontFamily"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>

          <div class="space-y-1">
            <Label class="text-xs">Font Size</Label>
            <select
              v-model="settings.theme.fontSize"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0.875rem">Small</option>
              <option value="1rem">Medium</option>
              <option value="1.125rem">Large</option>
              <option value="1.25rem">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Layout Settings -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">Layout Settings</h4>
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <input
              v-model="settings.rtl"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label class="text-sm">Right-to-Left (RTL)</Label>
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="settings.showProgress"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label class="text-sm">Show Progress Bar</Label>
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="settings.allowMultipleSubmissions"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label class="text-sm">Allow Multiple Submissions</Label>
          </div>
        </div>
      </div>

      <!-- Redirect Settings -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">Redirect Settings</h4>
        <div class="space-y-3">
          <div class="space-y-1">
            <Label class="text-xs">Redirect URL (after submission)</Label>
            <Input
              v-model="settings.redirectUrl"
              type="url"
              placeholder="https://example.com/thank-you"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Email Notifications -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">Email Notifications</h4>
        <div class="space-y-2">
          <div 
            v-for="(email, index) in settings.emailNotifications" 
            :key="index"
            class="flex items-center gap-2"
          >
            <Input
              v-model="settings.emailNotifications[index]"
              type="email"
              placeholder="admin@example.com"
              class="flex-1"
            />
            <Button 
              @click="removeEmail(index)"
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-destructive"
            >
              <TrashIcon class="w-4 h-4" />
            </Button>
          </div>
          <Button 
            @click="addEmail"
            variant="outline"
            size="sm"
            class="w-full"
          >
            + Add Email
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon, TrashIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: string
  fontFamily: string
  fontSize: string
}

interface FormSettings {
  title: string
  description: string
  theme: FormTheme
  rtl: boolean
  showProgress: boolean
  allowMultipleSubmissions: boolean
  redirectUrl?: string
  emailNotifications?: string[]
}

interface Props {
  settings: FormSettings
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

const addEmail = () => {
  if (!props.settings.emailNotifications) {
    props.settings.emailNotifications = []
  }
  props.settings.emailNotifications.push('')
}

const removeEmail = (index: number) => {
  if (props.settings.emailNotifications) {
    props.settings.emailNotifications.splice(index, 1)
  }
}
</script> 