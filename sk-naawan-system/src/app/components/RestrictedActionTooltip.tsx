import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RestrictedActionTooltipProps {
  requiredRole: 'secretary' | 'treasurer' | 'chairperson';
  action: string;
}

export function RestrictedActionTooltip({ requiredRole, action }: RestrictedActionTooltipProps) {
  const { user } = useAuth();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'secretary':
        return 'Secretary';
      case 'treasurer':
        return 'Treasurer';
      case 'chairperson':
        return 'Chairperson';
      default:
        return role;
    }
  };

  if (user?.role === requiredRole) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
      <AlertCircle className="w-3.5 h-3.5" />
      <span>
        Only <strong>SK {getRoleName(requiredRole)}</strong> can {action}
      </span>
    </div>
  );
}
