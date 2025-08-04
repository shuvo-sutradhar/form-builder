<template>
  <Head title="Forms" />

  <AppLayout :breadcrumbs="breadcrumbs">
    <template #header>
      <div class="flex items-center justify-between">
        <Heading>Forms</Heading>
        <Button @click="createNewForm" class="flex items-center gap-2">
          <PlusIcon class="w-4 h-4" />
          Create New Form
        </Button>
      </div>
    </template>

    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Search and Filters Bar -->
      <div class="bg-card border rounded-lg p-4 mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search Section -->
          <div class="flex-1">
            <label class="text-sm font-medium text-muted-foreground mb-2 block">Search Forms</label>
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                v-model="searchQuery" 
                placeholder="Search forms by title or description..." 
                class="pl-10 w-full"
              />
            </div>
          </div>

          <!-- Filters Section -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="min-w-[160px]">
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
              <Select v-model="statusFilter" class="w-full">
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            
            <div class="flex items-end">
              <Button 
                v-if="searchQuery || statusFilter" 
                @click="clearFilters" 
                variant="outline" 
                size="sm"
                class="flex items-center gap-2 h-10"
              >
                <XIcon class="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="searchQuery || statusFilter" class="mt-4 pt-4 border-t">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-muted-foreground">Active filters:</span>
            <div v-if="searchQuery" class="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              <SearchIcon class="w-3 h-3" />
              "{{ searchQuery }}"
              <button @click="searchQuery = ''" class="ml-1 hover:text-primary/80">
                <XIcon class="w-3 h-3" />
              </button>
            </div>
            <div v-if="statusFilter" class="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-md text-sm">
              <Badge :variant="getStatusVariant(statusFilter)" class="text-xs">
                {{ statusFilter }}
              </Badge>
              <button @click="statusFilter = ''" class="ml-1 hover:text-secondary-foreground/80">
                <XIcon class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Summary and Actions -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Forms</h3>
          <Badge variant="secondary" class="text-xs">
            {{ filteredForms.length }} {{ filteredForms.length === 1 ? 'form' : 'forms' }}
          </Badge>
        </div>
        <div class="flex items-center gap-3">
          <div v-if="searchQuery || statusFilter" class="text-sm text-muted-foreground">
            Showing {{ filteredForms.length }} of {{ forms.length }} forms
          </div>
          <Button @click="createNewForm" class="flex items-center gap-2">
            <PlusIcon class="w-4 h-4" />
            Create Form
          </Button>
        </div>
      </div>

      <!-- Forms Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="form in filteredForms" 
          :key="form.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="editForm(form.id)"
        >
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg">{{ form.title }}</CardTitle>
              <Badge :variant="getStatusVariant(form.status)">
                {{ form.status }}
              </Badge>
            </div>
            <CardDescription>{{ form.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-4 h-4" />
                <span>Created {{ formatDate(form.created_at) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UsersIcon class="w-4 h-4" />
                <span>{{ form.submissions_count }} submissions</span>
              </div>
              <div class="flex items-center gap-2">
                <ListIcon class="w-4 h-4" />
                <span>{{ form.blocks_count }} fields</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button variant="outline" size="sm" @click.stop="previewForm(form.id)">
              <EyeIcon class="w-4 h-4 mr-1" />
              Preview
            </Button>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click.stop="duplicateForm(form.id)">
                <CopyIcon class="w-4 h-4 mr-1" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" @click.stop="deleteForm(form.id)">
                <TrashIcon class="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="filteredForms.length === 0" class="text-center py-12">
        <div class="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileTextIcon class="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">No forms found</h3>
        <p class="text-muted-foreground mb-4">
          {{ searchQuery || statusFilter ? 'Try adjusting your search or filters.' : 'Create your first form to get started.' }}
        </p>
        <Button v-if="!searchQuery && !statusFilter" @click="createNewForm">
          Create Your First Form
        </Button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { router, Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types'
import Heading from '@/components/Heading.vue'
import { 
  PlusIcon, 
  CalendarIcon, 
  UsersIcon, 
  ListIcon, 
  EyeIcon, 
  CopyIcon, 
  TrashIcon,
  FileTextIcon,
  SearchIcon,
  XIcon
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'

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
}

defineProps<Props>()

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Forms',
    href: '/admin/form',
  },
]

interface Form {
  id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  submissions_count: number
  blocks_count: number
}

// Mock data - replace with actual API call
const forms = ref<Form[]>([
  {
    id: '1',
    title: 'Customer Feedback Form',
    description: 'Collect feedback from customers about our products and services',
    status: 'published',
    created_at: '2024-01-15T10:30:00Z',
    submissions_count: 45,
    blocks_count: 8
  },
  {
    id: '2',
    title: 'Employee Onboarding',
    description: 'New employee information collection form',
    status: 'draft',
    created_at: '2024-01-20T14:15:00Z',
    submissions_count: 0,
    blocks_count: 12
  },
  {
    id: '3',
    title: 'Event Registration',
    description: 'Conference and workshop registration form',
    status: 'published',
    created_at: '2024-01-10T09:00:00Z',
    submissions_count: 23,
    blocks_count: 6
  }
])

const searchQuery = ref('')
const statusFilter = ref('')

const filteredForms = computed(() => {
  return forms.value.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || form.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published': return 'default'
    case 'draft': return 'secondary'
    case 'archived': return 'destructive'
    default: return 'outline'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const createNewForm = () => {
  router.visit('/admin/form/create')
}

const editForm = (formId: string) => {
  router.visit(`/admin/form/${formId}/edit`)
}

const previewForm = (formId: string) => {
  router.visit(`/admin/form/${formId}/show`)
}

const duplicateForm = (formId: string) => {
  // Implementation for duplicating form
  console.log('Duplicate form:', formId)
}

const deleteForm = (formId: string) => {
  if (confirm('Are you sure you want to delete this form?')) {
    // Implementation for deleting form
    console.log('Delete form:', formId)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}
</script> 