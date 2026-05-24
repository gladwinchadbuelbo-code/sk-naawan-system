// Backend simulation utility for realistic API behavior

/**
 * Simulates network delay with configurable min/max duration
 */
export const simulateDelay = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates random API failures (configurable failure rate)
 */
export const shouldSimulateError = (failureRate: number = 0.05): boolean => {
  return Math.random() < failureRate;
};

/**
 * Simulates a successful API response with delay
 */
export async function simulateSuccess<T>(
  data: T,
  delay?: { min: number; max: number }
): Promise<{ success: true; data: T }> {
  await simulateDelay(delay?.min, delay?.max);
  
  if (shouldSimulateError()) {
    throw new Error('Network request failed. Please try again.');
  }
  
  return { success: true, data };
}

/**
 * Simulates a failed API response
 */
export async function simulateFailure(
  errorMessage: string,
  delay?: { min: number; max: number }
): Promise<never> {
  await simulateDelay(delay?.min, delay?.max);
  throw new Error(errorMessage);
}

/**
 * Simulates file upload with progress
 */
export async function simulateFileUpload(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: true; url: string; fileName: string }> {
  // Simulate upload progress
  for (let progress = 0; progress <= 100; progress += 10) {
    await new Promise(resolve => setTimeout(resolve, 100));
    onProgress?.(progress);
  }
  
  if (shouldSimulateError(0.03)) { // 3% failure rate for uploads
    throw new Error('File upload failed. Please try again.');
  }
  
  // Return simulated URL
  const mockUrl = `data:${file.type};base64,${btoa(file.name)}`;
  return {
    success: true,
    url: mockUrl,
    fileName: file.name
  };
}

/**
 * Validates form data with common validation rules
 */
export interface ValidationRule {
  field: string;
  value: any;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  };
  messages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    min?: string;
    max?: string;
    pattern?: string;
    custom?: string;
  };
}

export function validateField(rule: ValidationRule): string | null {
  const { value, rules, messages = {} } = rule;
  
  // Required check
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return messages.required || `${rule.field} is required`;
  }
  
  // Skip other validations if value is empty and not required
  if (!value) return null;
  
  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return messages.minLength || `${rule.field} must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return messages.maxLength || `${rule.field} must not exceed ${rules.maxLength} characters`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return messages.pattern || `${rule.field} format is invalid`;
    }
  }
  
  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return messages.min || `${rule.field} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return messages.max || `${rule.field} must not exceed ${rules.max}`;
    }
  }
  
  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return messages.custom || `${rule.field} is invalid`;
  }
  
  return null;
}

export function validateForm(rules: ValidationRule[]): {
  valid: boolean;
  errors: Record<string, string>;
  errorList: string[];
} {
  const errors: Record<string, string> = {};
  const errorList: string[] = [];
  
  for (const rule of rules) {
    const error = validateField(rule);
    if (error) {
      errors[rule.field] = error;
      errorList.push(error);
    }
  }
  
  return {
    valid: errorList.length === 0,
    errors,
    errorList
  };
}

/**
 * Simulates batch operations (multiple items)
 */
export async function simulateBatchOperation<T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: true; results: any[] }> {
  const results: any[] = [];
  
  for (let i = 0; i < items.length; i++) {
    await simulateDelay(200, 400);
    const result = await operation(items[i]);
    results.push(result);
    onProgress?.(i + 1, items.length);
  }
  
  return { success: true, results };
}

/**
 * Simulates pagination
 */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(data.length / pageSize);
  
  return {
    data: paginatedData,
    page,
    pageSize,
    total: data.length,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * Simulates search/filtering with delay
 */
export async function simulateSearch<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): Promise<T[]> {
  await simulateDelay(200, 500);
  
  if (!searchTerm.trim()) return data;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return data.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    });
  });
}

/**
 * Simulates sorting with delay
 */
export async function simulateSort<T>(
  data: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): Promise<T[]> {
  await simulateDelay(100, 300);
  
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Generates a unique ID (timestamp-based)
 */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Simulates optimistic update pattern
 */
export async function optimisticUpdate<T>(
  optimisticData: T,
  actualOperation: () => Promise<T>
): Promise<{ optimistic: T; actual: T }> {
  // Return optimistic data immediately
  const optimistic = optimisticData;
  
  // Perform actual operation in background
  try {
    const actual = await actualOperation();
    return { optimistic, actual };
  } catch (error) {
    // If operation fails, throw error so caller can rollback
    throw error;
  }
}

/**
 * Retries failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Simulates rate limiting
 */
export class RateLimiter {
  private requests: number[] = [];
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  async checkLimit(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }
    
    this.requests.push(now);
  }
}

/**
 * Common error messages
 */
export const ErrorMessages = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Success messages
 */
export const SuccessMessages = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  UPLOADED: 'Uploaded successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully',
};
