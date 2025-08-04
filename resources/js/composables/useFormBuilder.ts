import { ref, reactive, computed } from 'vue'

export interface FormBlock {
  id: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'rating' | 'scale' | 'slider' | 'file' | 'text-block' | 'image' | 'divider' | 'rich-text' | 'date' | 'url' | 'phone' | 'email' | 'multi-select' | 'matrix' | 'number' | 'signature' | 'barcode' | 'qr-code' | 'payment' | 'page-break' | 'code'
  label: string
  placeholder?: string
  required: boolean
  validation?: ValidationRule[]
  options?: string[]
  min?: number
  max?: number
  step?: number
  defaultValue?: any
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: 'sm' | 'md' | 'lg'
  fontWeight?: 'normal' | 'medium' | 'bold'
  imageUrl?: string
  imageSize?: 'sm' | 'md' | 'lg'
  code?: string
  language?: string
  signatureData?: string
  paymentAmount?: number
  paymentCurrency?: string
  matrixRows?: string[]
  matrixColumns?: string[]
  matrixType?: 'radio' | 'checkbox' | 'text'
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  message: string
  value?: any
}

export interface FormTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: string
  fontFamily: string
  fontSize: string
}

export interface FormSettings {
  title: string
  description: string
  theme: FormTheme
  rtl: boolean
  showProgress: boolean
  allowMultipleSubmissions: boolean
  redirectUrl?: string
  emailNotifications?: string[]
}

export function useFormBuilder() {
  const formBlocks = ref<FormBlock[]>([])
  const selectedBlock = ref<FormBlock | null>(null)
  const formSettings = ref<FormSettings>({
    title: 'My Form',
    description: 'A beautiful form built with our form builder',
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
  })

  const blockTypes = [
    // Input Blocks
    { type: 'text', label: 'Text Input', icon: 'Type' },
    { type: 'rich-text', label: 'Rich Text Input', icon: 'Type' },
    { type: 'date', label: 'Date Input', icon: 'Calendar' },
    { type: 'url', label: 'URL Input', icon: 'Link' },
    { type: 'phone', label: 'Phone Input', icon: 'Phone' },
    { type: 'email', label: 'Email Input', icon: 'Mail' },
    { type: 'checkbox', label: 'Checkbox Input', icon: 'CheckSquare' },
    { type: 'select', label: 'Select Input', icon: 'ChevronDown' },
    { type: 'multi-select', label: 'Multi-select Input', icon: 'List' },
    { type: 'matrix', label: 'Matrix Input', icon: 'Grid' },
    { type: 'number', label: 'Number Input', icon: 'Hash' },
    { type: 'rating', label: 'Rating Input', icon: 'Star' },
    { type: 'scale', label: 'Scale Input', icon: 'Scale' },
    { type: 'slider', label: 'Slider Input', icon: 'Sliders' },
    { type: 'file', label: 'File Input', icon: 'Paperclip' },
    { type: 'signature', label: 'Signature Input', icon: 'PenTool' },
    { type: 'barcode', label: 'Barcode Reader', icon: 'Scan' },
    { type: 'qr-code', label: 'QR Code Reader', icon: 'QrCode' },
    { type: 'payment', label: 'Payment', icon: 'CreditCard' },
    // Layout Blocks
    { type: 'text-block', label: 'Text', icon: 'Type' },
    { type: 'page-break', label: 'Page-break', icon: 'FileText' },
    { type: 'divider', label: 'Divider', icon: 'Minus' },
    { type: 'image', label: 'Image', icon: 'Image' },
    { type: 'code', label: 'Code', icon: 'Code' }
  ]

  const addBlock = (type: FormBlock['type']) => {
    const newBlock: FormBlock = {
      id: generateId(),
      type,
      label: getDefaultLabel(type),
      placeholder: getDefaultPlaceholder(type),
      required: false,
      options: getDefaultOptions(type),
      min: getDefaultMin(type),
      max: getDefaultMax(type),
      step: getDefaultStep(type),
      defaultValue: getDefaultValue(type),
      helpText: '',
      size: 'md',
      textAlign: 'left',
      fontSize: 'md',
      fontWeight: 'normal',
      imageUrl: '',
      imageSize: 'md',
      code: '',
      language: 'javascript',
      signatureData: '',
      paymentAmount: 0,
      paymentCurrency: 'USD',
      matrixRows: ['Row 1', 'Row 2'],
      matrixColumns: ['Column 1', 'Column 2'],
      matrixType: 'radio'
    }
    formBlocks.value.push(newBlock)
    selectBlock(newBlock)
  }

  const removeBlock = (index: number) => {
    formBlocks.value.splice(index, 1)
    if (selectedBlock.value === formBlocks.value[index]) {
      selectedBlock.value = null
    }
  }

  const selectBlock = (block: FormBlock) => {
    selectedBlock.value = block
  }

  const updateBlock = (blockId: string, updates: Partial<FormBlock>) => {
    const block = formBlocks.value.find(b => b.id === blockId)
    if (block) {
      Object.assign(block, updates)
    }
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const block = formBlocks.value.splice(fromIndex, 1)[0]
    formBlocks.value.splice(toIndex, 0, block)
  }

  const duplicateBlock = (index: number) => {
    const block = { ...formBlocks.value[index] }
    block.id = generateId()
    block.label = `${block.label} (Copy)`
    formBlocks.value.splice(index + 1, 0, block)
  }

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9)
  }

  const exportForm = () => {
    return {
      blocks: formBlocks.value,
      settings: formSettings.value
    }
  }

  const importForm = (data: { blocks: FormBlock[], settings: FormSettings }) => {
    formBlocks.value = data.blocks
    Object.assign(formSettings.value, data.settings)
  }

  const validateForm = () => {
    const errors: Record<string, string[]> = {}
    
    formBlocks.value.forEach(block => {
      if (block.validation) {
        const blockErrors: string[] = []
        
        block.validation.forEach(rule => {
          if (rule.type === 'required' && !block.value) {
            blockErrors.push(rule.message)
          }
          // Add more validation rules as needed
        })
        
        if (blockErrors.length > 0) {
          errors[block.id] = blockErrors
        }
      }
    })
    
    return errors
  }

  const getDefaultLabel = (type: FormBlock['type']): string => {
    const labels: Record<FormBlock['type'], string> = {
      text: 'Text Input',
      textarea: 'Text Area',
      select: 'Select Option',
      checkbox: 'Checkbox',
      radio: 'Radio Button',
      rating: 'Rating',
      scale: 'Scale',
      slider: 'Slider',
      file: 'File Upload',
      'text-block': 'Text Block',
      image: 'Image',
      divider: 'Divider',
      'rich-text': 'Rich Text Input',
      date: 'Date Input',
      url: 'URL Input',
      phone: 'Phone Input',
      email: 'Email Input',
      'multi-select': 'Multi-select Input',
      matrix: 'Matrix Input',
      number: 'Number Input',
      signature: 'Signature Input',
      barcode: 'Barcode Reader',
      'qr-code': 'QR Code Reader',
      payment: 'Payment',
      'page-break': 'Page Break',
      code: 'Code Block'
    }
    return labels[type]
  }

  const getDefaultPlaceholder = (type: FormBlock['type']): string => {
    const placeholders: Record<FormBlock['type'], string> = {
      text: 'Enter your text here',
      textarea: 'Enter your message here',
      select: 'Select an option',
      checkbox: '',
      radio: '',
      rating: '',
      scale: '',
      slider: '',
      file: 'Choose a file',
      'text-block': '',
      image: '',
      divider: '',
      'rich-text': 'Enter your rich text here',
      date: 'Select a date',
      url: 'https://example.com',
      phone: '+1 (555) 123-4567',
      email: 'example@email.com',
      'multi-select': 'Select multiple options',
      matrix: '',
      number: 'Enter a number',
      signature: 'Click to sign',
      barcode: 'Scan barcode',
      'qr-code': 'Scan QR code',
      payment: 'Enter payment details',
      'page-break': '',
      code: '// Your code here'
    }
    return placeholders[type]
  }

  const getDefaultOptions = (type: FormBlock['type']): string[] => {
    const options: Record<FormBlock['type'], string[]> = {
      text: [],
      textarea: [],
      select: ['Option 1', 'Option 2', 'Option 3'],
      checkbox: ['Option 1', 'Option 2', 'Option 3'],
      radio: ['Option 1', 'Option 2', 'Option 3'],
      rating: [],
      scale: [],
      slider: [],
      file: [],
      'text-block': [],
      image: [],
      divider: [],
      'rich-text': [],
      date: [],
      url: [],
      phone: [],
      email: [],
      'multi-select': ['Option 1', 'Option 2', 'Option 3'],
      matrix: [],
      number: [],
      signature: [],
      barcode: [],
      'qr-code': [],
      payment: [],
      'page-break': [],
      code: []
    }
    return options[type]
  }

  const getDefaultMin = (type: FormBlock['type']): number | undefined => {
    const mins: Record<FormBlock['type'], number | undefined> = {
      text: undefined,
      textarea: undefined,
      select: undefined,
      checkbox: undefined,
      radio: undefined,
      rating: 1,
      scale: 1,
      slider: 0,
      file: undefined,
      'text-block': undefined,
      image: undefined,
      divider: undefined,
      'rich-text': undefined,
      date: undefined,
      url: undefined,
      phone: undefined,
      email: undefined,
      'multi-select': undefined,
      matrix: undefined,
      number: undefined,
      signature: undefined,
      barcode: undefined,
      'qr-code': undefined,
      payment: undefined,
      'page-break': undefined,
      code: undefined
    }
    return mins[type]
  }

  const getDefaultMax = (type: FormBlock['type']): number | undefined => {
    const maxs: Record<FormBlock['type'], number | undefined> = {
      text: undefined,
      textarea: undefined,
      select: undefined,
      checkbox: undefined,
      radio: undefined,
      rating: 5,
      scale: 10,
      slider: 100,
      file: undefined,
      'text-block': undefined,
      image: undefined,
      divider: undefined,
      'rich-text': undefined,
      date: undefined,
      url: undefined,
      phone: undefined,
      email: undefined,
      'multi-select': undefined,
      matrix: undefined,
      number: undefined,
      signature: undefined,
      barcode: undefined,
      'qr-code': undefined,
      payment: undefined,
      'page-break': undefined,
      code: undefined
    }
    return maxs[type]
  }

  const getDefaultStep = (type: FormBlock['type']): number | undefined => {
    const steps: Record<FormBlock['type'], number | undefined> = {
      text: undefined,
      textarea: undefined,
      select: undefined,
      checkbox: undefined,
      radio: undefined,
      rating: 1,
      scale: 1,
      slider: 1,
      file: undefined,
      'text-block': undefined,
      image: undefined,
      divider: undefined,
      'rich-text': undefined,
      date: undefined,
      url: undefined,
      phone: undefined,
      email: undefined,
      'multi-select': undefined,
      matrix: undefined,
      number: 1,
      signature: undefined,
      barcode: undefined,
      'qr-code': undefined,
      payment: undefined,
      'page-break': undefined,
      code: undefined
    }
    return steps[type]
  }

  const getDefaultValue = (type: FormBlock['type']): any => {
    const values: Record<FormBlock['type'], any> = {
      text: '',
      textarea: '',
      select: '',
      checkbox: [],
      radio: '',
      rating: 0,
      scale: 5,
      slider: 50,
      file: null,
      'text-block': 'This is a text block. You can add static text content here.',
      image: '',
      divider: '',
      'rich-text': '',
      date: '',
      url: '',
      phone: '',
      email: '',
      'multi-select': [],
      matrix: {},
      number: 0,
      signature: '',
      barcode: '',
      'qr-code': '',
      payment: { amount: 0, currency: 'USD' },
      'page-break': '',
      code: '// Your code here\nconsole.log("Hello World!");'
    }
    return values[type]
  }

  return {
    formBlocks,
    selectedBlock,
    formSettings,
    addBlock,
    removeBlock,
    selectBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    generateId,
    exportForm,
    importForm,
    validateForm,
    blockTypes
  }
} 