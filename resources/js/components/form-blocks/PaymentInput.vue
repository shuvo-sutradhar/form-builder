<template>
  <div class="space-y-4">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="required" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    
    <div class="border border-border rounded-md p-4 space-y-4">
      <!-- Amount -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Amount</Label>
        <div class="flex items-center gap-2">
          <Input
            type="number"
            :value="paymentAmount"
            @input="handleAmountChange"
            placeholder="0.00"
            class="flex-1"
          />
          <select
            :value="paymentCurrency"
            @change="handleCurrencyChange"
            class="border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>
      
      <!-- Card Details -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Card Number</Label>
        <Input
          type="text"
          :value="cardNumber"
          @input="handleCardNumberChange"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          class="w-full"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label class="text-sm font-medium">Expiry Date</Label>
          <Input
            type="text"
            :value="expiryDate"
            @input="handleExpiryChange"
            placeholder="MM/YY"
            maxlength="5"
            class="w-full"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-sm font-medium">CVV</Label>
          <Input
            type="text"
            :value="cvv"
            @input="handleCvvChange"
            placeholder="123"
            maxlength="4"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Payment Button -->
      <Button
        @click="processPayment"
        :disabled="!isPaymentValid"
        class="w-full"
      >
        <CreditCard class="h-4 w-4 mr-2" />
        Pay {{ paymentCurrency }} {{ paymentAmount }}
      </Button>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-vue-next'

interface Props {
  id: string
  label?: string
  required?: boolean
  helpText?: string
  modelValue?: { amount: number; currency: string }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ amount: 0, currency: 'USD' }),
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: { amount: number; currency: string }]
}>()

const paymentAmount = ref(props.modelValue.amount)
const paymentCurrency = ref(props.modelValue.currency)
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')

const isPaymentValid = computed(() => {
  return paymentAmount.value > 0 && 
         cardNumber.value.replace(/\s/g, '').length === 16 &&
         expiryDate.value.length === 5 &&
         cvv.value.length >= 3
})

const handleAmountChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  paymentAmount.value = parseFloat(target.value) || 0
  updateModelValue()
}

const handleCurrencyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  paymentCurrency.value = target.value
  updateModelValue()
}

const handleCardNumberChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\s/g, '')
  value = value.replace(/(\d{4})/g, '$1 ').trim()
  cardNumber.value = value
}

const handleExpiryChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  expiryDate.value = value
}

const handleCvvChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  cvv.value = target.value.replace(/\D/g, '')
}

const updateModelValue = () => {
  emit('update:modelValue', {
    amount: paymentAmount.value,
    currency: paymentCurrency.value
  })
}

const processPayment = () => {
  // Simulate payment processing
  alert(`Payment processed: ${paymentCurrency.value} ${paymentAmount.value}`)
}
</script> 