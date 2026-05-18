import { Shield, Edit, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

interface PermissionInfoProps {
  resourceType: 'liquidation' | 'accomplishment' | 'budget' | 'event';
  compact?: boolean;
}

export function PermissionInfo({ resourceType, compact = false }: PermissionInfoProps) {
  const { user, canEdit } = useAuth();
  const hasEditPermission = canEdit(resourceType);

  if (!user) return null;

  const getResourceLabel = () => {
    switch (resourceType) {
      case 'liquidation':
        return 'Liquidation Reports';
      case 'accomplishment':
        return 'Accomplishment Reports';
      case 'budget':
        return 'Budget Management';
      case 'event':
        return 'Events Management';
      default:
        return 'This Resource';
    }
  };

  if (compact) {
    return (
      <Badge variant={hasEditPermission ? 'default' : 'secondary'} className={hasEditPermission ? 'bg-green-600' : ''}>
        {hasEditPermission ? (
          <>
            <Edit className="w-3 h-3 mr-1" />
            Can Edit
          </>
        ) : (
          <>
            <Eye className="w-3 h-3 mr-1" />
            View Only
          </>
        )}
      </Badge>
    );
  }

  return (
    <Card className={`p-4 ${hasEditPermission ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${hasEditPermission ? 'bg-green-100' : 'bg-gray-100'}`}>
          {hasEditPermission ? (
            <Edit className="w-4 h-4 text-green-700" />
          ) : (
            <Eye className="w-4 h-4 text-gray-700" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {hasEditPermission ? 'Edit Permission' : 'View-Only Access'}
            </span>
            <Badge variant="outline" className="text-xs">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">
            {hasEditPermission
              ? `You can create, edit, and manage ${getResourceLabel().toLowerCase()}.`
              : `You have read-only access to ${getResourceLabel().toLowerCase()}.`}
          </p>
        </div>
      </div>
    </Card>
  );
}
