import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickStatsWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function QuickStatsWidget({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
}: QuickStatsWidgetProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <h3 className="text-2xl mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
