import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  fullScreen = false,
  overlay = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-40 rounded-lg">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Inline loading spinner for buttons
 */
export function ButtonSpinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`w-4 h-4 animate-spin ${className}`} />;
}

/**
 * Skeleton loader for content
 */
export function SkeletonLoader({ 
  type = 'text',
  count = 1 
}: { 
  type?: 'text' | 'card' | 'table' | 'avatar';
  count?: number;
}) {
  const skeletons = Array.from({ length: count });

  if (type === 'text') {
    return (
      <div className="space-y-2">
        {skeletons.map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        {skeletons.map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className="flex items-center gap-3">
        {skeletons.map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  return null;
}

/**
 * Progress bar component
 */
export function ProgressBar({ 
  progress, 
  showPercentage = true,
  size = 'md',
  color = 'blue'
}: { 
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow';
}) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div className="w-full space-y-1">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div 
          className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-600 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}

/**
 * Pulsing dot indicator
 */
export function PulsingDot({ color = 'blue' }: { color?: 'blue' | 'green' | 'red' | 'yellow' }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colorClasses[color]}`}></span>
    </span>
  );
}
