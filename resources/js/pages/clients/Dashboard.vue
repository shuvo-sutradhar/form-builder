<template>
  <AppLayout title="Client Dashboard">
    <template #header>
      <Heading>Client Dashboard</Heading>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6 text-gray-900 dark:text-gray-100">
            <h2 class="text-2xl font-bold mb-4">Welcome to Your Client Dashboard</h2>
            <p class="mb-4">This is your dedicated client panel where you can manage your account and view your information.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <div><strong>Name:</strong> {{ user.name }}</div>
                    <div><strong>Email:</strong> {{ user.email }}</div>
                    <div><strong>Phone:</strong> {{ user.phone || 'Not provided' }}</div>
                    <div><strong>Role:</strong> {{ user.role }}</div>
                    <div><strong>Last Login:</strong> {{ formatDate(user.last_login) }}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <Button variant="outline" class="w-full" @click="navigateToProfile">
                      Update Profile
                    </Button>
                    <Button variant="outline" class="w-full" @click="navigateToPassword">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Account Active</span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Client Access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import Heading from '@/components/Heading.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Button from '@/components/ui/button/Button.vue'

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

const props = defineProps<Props>()

const formatDate = (date: string | null) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString()
}

const navigateToProfile = () => {
  window.location.href = '/settings/profile'
}

const navigateToPassword = () => {
  window.location.href = '/settings/password'
}
</script> 