import { User, Wallet2, FileEdit, Info, Check, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

export function RoleGuideCard() {
  const { user } = useAuth();

  const roles = [
    {
      name: 'Chairperson',
      icon: User,
      color: 'bg-purple-600',
      permissions: [
        'Full system oversight',
        'View all modules and reports',
        'Approve all reports',
        'Generate all report types',
      ],
    },
    {
      name: 'Treasurer',
      icon: Wallet2,
      color: 'bg-green-600',
      permissions: [
        'Add income & record expenses',
        'Manage budget (full access)',
        'Generate liquidation reports',
        'Upload financial documents',
      ],
    },
    {
      name: 'Secretary',
      icon: FileEdit,
      color: 'bg-orange-600',
      permissions: [
        'Create and manage events',
        'Track attendance',
        'Generate accomplishment reports',
        'Upload event documentation',
      ],
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg">Role Permissions Guide</h3>
      </div>
      
      <div className="space-y-4">
        {roles.map((role) => {
          const RoleIcon = role.icon;
          const isCurrentRole = user?.role === role.name.toLowerCase();
          
          return (
            <div 
              key={role.name} 
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentRole 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${role.color} p-2 rounded-lg`}>
                  <RoleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">SK {role.name}</span>
                  {isCurrentRole && (
                    <Badge className="bg-blue-600 text-xs">Your Role</Badge>
                  )}
                </div>
              </div>
              
              <ul className="space-y-1.5 ml-11">
                {role.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    {perm.includes('view only') ? (
                      <Eye className="w-3.5 h-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <Check className="w-3.5 h-3.5 mt-0.5 text-green-600 flex-shrink-0" />
                    )}
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> All roles can view all data for transparency. 
          Edit restrictions ensure proper assignment of responsibilities.
        </p>
      </div>
    </Card>
  );
}
