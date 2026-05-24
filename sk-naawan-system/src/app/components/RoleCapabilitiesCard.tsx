import { Check, X, User, Wallet2, FileEdit, Calendar, FileText, Upload, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function RoleCapabilitiesCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getCapabilities = () => {
    switch (user.role) {
      case 'secretary':
        return {
          title: 'Your Capabilities as SK Secretary',
          color: 'bg-orange-600',
          icon: FileEdit,
          canDo: [
            { icon: Calendar, text: 'Manage Events' },
            { icon: User, text: 'Track Attendance' },
            { icon: Upload, text: 'Upload Documentation' },
            { icon: FileText, text: 'Generate Accomplishment Reports' },
            { icon: CheckCircle, text: 'View Budget (view only)' },
            { icon: CheckCircle, text: 'View Liquidation Reports (view only)' },
          ],
          cannotDo: [
            { text: 'Manage Budget or Track Expenses' },
            { text: 'Upload Financial Documents' },
            { text: 'Generate Liquidation Reports' },
            { text: 'Approve Reports or Generate Documentation Packet' },
          ],
        };
      case 'treasurer':
        return {
          title: 'Your Capabilities as SK Treasurer',
          color: 'bg-green-600',
          icon: Wallet2,
          canDo: [
            { icon: Wallet2, text: 'Manage Budget' },
            { icon: FileText, text: 'Track Expenses' },
            { icon: Upload, text: 'Upload Financial Documents' },
            { icon: FileText, text: 'Generate Liquidation Reports' },
            { icon: CheckCircle, text: 'View Events (view only)' },
            { icon: CheckCircle, text: 'View Accomplishment Reports (view only)' },
          ],
          cannotDo: [
            { text: 'Manage Events or Track Attendance' },
            { text: 'Upload Documentation (non-financial)' },
            { text: 'Generate Accomplishment Reports' },
            { text: 'Approve Reports or Generate Documentation Packet' },
          ],
        };
      case 'chairperson':
        return {
          title: 'Your Capabilities as SK Chairperson',
          color: 'bg-purple-600',
          icon: User,
          canDo: [
            { icon: CheckCircle, text: 'Approve Reports' },
            { icon: FileText, text: 'Generate Documentation Packet' },
            { icon: Calendar, text: 'Full access to all use cases' },
            { icon: Wallet2, text: 'Manage Budget & Track Expenses' },
            { icon: Calendar, text: 'Manage Events & Track Attendance' },
            { icon: FileText, text: 'Generate all report types' },
          ],
          cannotDo: [],
        };
      default:
        return null;
    }
  };

  const capabilities = getCapabilities();
  if (!capabilities) return null;

  const CapIcon = capabilities.icon;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${capabilities.color} p-2.5 rounded-lg`}>
          <CapIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg">{capabilities.title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2.5">What You Can Do:</h4>
          <div className="space-y-2">
            {capabilities.canDo.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {capabilities.cannotDo.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2.5">Restricted Actions:</h4>
            <div className="space-y-2">
              {capabilities.cannotDo.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <span className="text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.role !== 'chairperson' && (
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500">
              Reports you create will be submitted to the SK Chairperson for approval.
            </p>
          </div>
        )}

        {user.role === 'secretary' && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/staff/events/proposal/create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
              <Button
                onClick={() => navigate('/staff/my-proposals')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                My Proposals
              </Button>
            </div>
          </div>
        )}

        {user.role === 'treasurer' && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate('/staff/budget/proposal/create')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Wallet2 className="w-4 h-4 mr-2" />
              Create Budget Proposal
            </Button>
          </div>
        )}

        {user.role === 'chairperson' && (
          <div className="pt-3 border-t">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Full System Access & Approval Authority
            </Badge>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
}