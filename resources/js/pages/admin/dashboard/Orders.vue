<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';

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
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];
</script>

<template>
    <Head title="Orders" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <template #header>
            <Heading>Orders Management</Heading>
        </template>

        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <div class="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div><strong>Name:</strong> {{ user.name }}</div>
                            <div><strong>Email:</strong> {{ user.email }}</div>
                            <div><strong>Role:</strong> {{ user.role }}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="text-2xl font-bold text-green-600">0</div>
                            <div class="text-sm text-gray-600">Total Orders</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                Manage orders and customer data
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div class="relative min-h-[400px] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6">
                <h3 class="text-lg font-semibold mb-4">Orders List</h3>
                <p class="text-gray-600 dark:text-gray-400">No orders found. This is a placeholder for the orders management interface.</p>
            </div>
        </div>
    </AppLayout>
</template> 