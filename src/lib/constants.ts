export const CLIENT="Client"
export const ADMIN = "Admin"
export const INPUT_TYPES=[
    { value: 'text', label: 'Text' },            // Single-line text input
    { value: 'password', label: 'Password' },    // Password input (hidden text)
    { value: 'email', label: 'Email' },          // Email input (with email validation)
    { value: 'number', label: 'Number' },        // Numeric input
    { value: 'tel', label: 'Phone Number' },     // Telephone input
    { value: 'date', label: 'Date' },            // Date picker
    { value: 'time', label: 'Time' },            // Time picker
    { value: 'url', label: 'URL' },              // URL input (with URL validation)
    { value: 'textarea', label: 'Textarea' },    // Multi-line text area
    { value: 'select', label: 'Select (Dropdown)' }, // Dropdown select list
    { value: 'file', label: 'File Upload' },     // File input
    { value: 'range', label: 'Range (Slider)' }, // Range input (slider)
    { value: 'hidden', label: 'Hidden' },        // Hidden input (not visible to users)
    { value: 'color', label: 'Color Picker' },   // Color picker input
  ];
export const MONGODB_MAX_RETRIES=3;
export const MONGODB_RETRY_INTERVAL=5000;
export const CLOUDINARY_MAX_RETRIES=3;
export const CLOUDINARY_RETRY_INTERVAL=2000;
export const ADMIN_TOPIC='admin_notification'