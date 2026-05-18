import { AlertCircle, RefreshCw, X, AlertTriangle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ErrorDisplayProps {
  error: Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  title?: string;
  fullPage?: boolean;
  compact?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  type = 'error',
  title,
  fullPage = false,
  compact = false,
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  const config = {
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: title || 'Error',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: title || 'Warning',
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: title || 'Information',
    },
  };

  const { icon: Icon, color, bgColor, borderColor, title: defaultTitle } = config[type];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${bgColor} ${borderColor}`}>
        <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
        <p className="text-sm text-gray-700 flex-1">{errorMessage}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  const content = (
    <Card className={`p-6 ${bgColor} border ${borderColor}`}>
      <div className="flex items-start gap-4">
        <div className={`${color} flex-shrink-0`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg mb-2 ${color}`}>{defaultTitle}</h3>
          <p className="text-gray-700 mb-4">{errorMessage}</p>
          <div className="flex gap-3">
            {onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button onClick={onDismiss} variant="ghost" size="sm">
                Dismiss
              </Button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full">{content}</div>
      </div>
    );
  }

  return content;
}

/**
 * Validation errors display
 */
export function ValidationErrors({ errors }: { errors: string[] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline error message
 */
export function InlineError({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3" />
      {error}
    </p>
  );
}

/**
 * Success message display
 */
export function SuccessDisplay({
  message,
  onDismiss,
  compact = false,
}: {
  message: string;
  onDismiss?: () => void;
  compact?: boolean;
}) {
  if (!message) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg border bg-green-50 border-green-200">
        <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <p className="text-sm text-gray-700 flex-1">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <Card className="p-6 bg-green-50 border border-green-200">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-green-800 mb-1">Success</h3>
          <p className="text-gray-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </Card>
  );
}
