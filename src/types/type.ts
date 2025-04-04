// Basic field definition
export interface FormField {
    id:  string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ label: string; value: string }>;  // For select, checkbox, radio
  }
  
  // Form schema definition
  export interface FormSchema {
    titel?: string;
    description?: string;
    fields: FormField[];
    submitLabel?: string;
  }