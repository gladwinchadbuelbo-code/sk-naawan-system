import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAsyncOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UseAsyncOperationResult<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with loading/error states
 * Provides consistent error handling and toast notifications
 */
export function useAsyncOperation<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
): UseAsyncOperationResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        if (onError) {
          onError(error);
        }

        if (showErrorToast) {
          toast.error(errorMessage || error.message || 'An error occurred');
        }

        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, successMessage, errorMessage, showSuccessToast, showErrorToast]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

/**
 * Hook for managing multiple async operations
 */
export function useMultipleAsyncOperations() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});

  const executeOperation = useCallback(
    async <T,>(
      key: string,
      operation: () => Promise<T>,
      options: {
        successMessage?: string;
        errorMessage?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
      } = {}
    ): Promise<T | undefined> => {
      try {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));

        const result = await operation();

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setErrors(prev => ({ ...prev, [key]: error }));

        toast.error(options.errorMessage || error.message || 'An error occurred');

        if (options.onError) {
          options.onError(error);
        }

        return undefined;
      } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  const isAnyLoading = Object.values(loadingStates).some(loading => loading);

  const reset = useCallback((key?: string) => {
    if (key) {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
      setErrors(prev => ({ ...prev, [key]: null }));
    } else {
      setLoadingStates({});
      setErrors({});
    }
  }, []);

  return {
    executeOperation,
    loadingStates,
    errors,
    isAnyLoading,
    isLoading: (key: string) => loadingStates[key] || false,
    getError: (key: string) => errors[key] || null,
    reset,
  };
}

/**
 * Hook for form submission with validation
 */
export function useFormSubmission<T = any>(
  submitFunction: (data: any) => Promise<T>,
  options: {
    validate?: (data: any) => { valid: boolean; errors: string[] };
    onSuccess?: (result: T) => void;
    onValidationError?: (errors: string[]) => void;
    successMessage?: string;
  } = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const submit = useCallback(
    async (data: any): Promise<T | undefined> => {
      try {
        setValidationErrors([]);

        // Run validation if provided
        if (options.validate) {
          const validation = options.validate(data);
          if (!validation.valid) {
            setValidationErrors(validation.errors);
            if (options.onValidationError) {
              options.onValidationError(validation.errors);
            }
            toast.error('Please fix validation errors');
            return undefined;
          }
        }

        setIsSubmitting(true);
        const result = await submitFunction(data);

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error: any) {
        toast.error(error.message || 'Submission failed');
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFunction, options]
  );

  const clearErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    submit,
    isSubmitting,
    validationErrors,
    clearErrors,
  };
}

/**
 * Hook for data loading with retry capability
 */
export function useDataLoader<T>(
  loadFunction: () => Promise<T>,
  options: {
    autoLoad?: boolean;
    retryCount?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const { autoLoad = false, retryCount = 3, onSuccess, onError } = options;

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await loadFunction();
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      setRetryAttempt(0);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      if (onError) {
        onError(error);
      } else {
        toast.error(error.message || 'Failed to load data');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadFunction, onSuccess, onError]);

  const retry = useCallback(async () => {
    if (retryAttempt < retryCount) {
      setRetryAttempt(prev => prev + 1);
      return await load();
    } else {
      toast.error('Maximum retry attempts reached');
      return null;
    }
  }, [load, retryAttempt, retryCount]);

  const refresh = useCallback(() => {
    setRetryAttempt(0);
    return load();
  }, [load]);

  return {
    data,
    isLoading,
    error,
    load,
    retry,
    refresh,
    retryAttempt,
    canRetry: retryAttempt < retryCount,
  };
}
