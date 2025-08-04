<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Heading from '@/components/Heading.vue';
import Button from '@/components/ui/button/Button.vue';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

const formatDate = (date: string | null) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString()
}

const navigateToFormBuilder = () => {
  window.location.href = '/admin/form'
}
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <template #header>
            <Heading>Admin/Staff Dashboard</Heading>
        </template>

        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div><strong>Name:</strong> {{ user.name }}</div>
                            <div><strong>Email:</strong> {{ user.email }}</div>
                            <div><strong>Role:</strong> {{ user.role }}</div>
                            <div><strong>Phone:</strong> {{ user.phone || 'Not provided' }}</div>
                            <div><strong>Last Login:</strong> {{ formatDate(user.last_login) }}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Access Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span>Admin/Staff Access</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span>Full System Access</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <Button 
                                variant="outline" 
                                class="w-full" 
                                @click="navigateToFormBuilder"
                            >
                                Manage Forms
                            </Button>
                            <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Manage system settings and user accounts
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div class="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern />
            </div>
        </div>
    </AppLayout>
</template>
