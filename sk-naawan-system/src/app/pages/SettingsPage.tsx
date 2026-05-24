import { useState } from 'react';
import { User, Building2, Bell, Shield, Database, Download, Upload } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner@2.0.3';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';

export function SettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.fullName || 'SK Official',
    email: 'sk.official@barangay.gov.ph',
    position: user?.role ? `SK ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Administrator',
    barangay: 'Barangay Sample',
    municipality: 'Sample Municipality',
    province: 'Sample Province',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    eventReminders: true,
    budgetAlerts: true,
    reportDeadlines: true,
  });

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      position: formData.get('position') as string,
      barangay: formData.get('barangay') as string,
      municipality: formData.get('municipality') as string,
      province: formData.get('province') as string,
    });
    toast.success('Profile updated successfully');
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification preferences updated');
  };

  const handleExportData = () => {
    // Export actual system data using storage utility
    const allData = storage.exportAllData();
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sk-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('System data exported successfully');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          // Import actual system data using storage utility
          storage.importAllData(data);
          
          // Also update local profile and notification settings if present
          if (data.profile) setProfile(data.profile);
          if (data.notifications) setNotifications(data.notifications);
          
          toast.success('System data imported successfully. Please refresh the page to see changes.');
        } catch (error) {
          toast.error('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all system data? This action cannot be undone.')) {
      // Clear all SK data but preserve authentication
      storage.clearAllData();
      toast.success('System data cleared. Please refresh the page.');
      
      // Optionally refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your profile, preferences, and system configuration</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="w-4 h-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      defaultValue={profile.position}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Input
                      id="barangay"
                      name="barangay"
                      defaultValue={profile.barangay}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality">Municipality</Label>
                    <Input
                      id="municipality"
                      name="municipality"
                      defaultValue={profile.municipality}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      name="province"
                      defaultValue={profile.province}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg mb-4">Logo & Branding</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Barangay Logo</Label>
                    <Input id="logo" type="file" accept="image/*" />
                    <p className="text-sm text-gray-500">Upload your barangay logo for use in reports and documents</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates about system activities</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="event-reminders">Event Reminders</Label>
                      <p className="text-sm text-gray-500">Get notified about upcoming events</p>
                    </div>
                    <Switch
                      id="event-reminders"
                      checked={notifications.eventReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, eventReminders: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="budget-alerts">Budget Alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts when budget thresholds are reached</p>
                    </div>
                    <Switch
                      id="budget-alerts"
                      checked={notifications.budgetAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, budgetAlerts: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="report-deadlines">Report Deadlines</Label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming report submission deadlines</p>
                    </div>
                    <Switch
                      id="report-deadlines"
                      checked={notifications.reportDeadlines}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, reportDeadlines: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg mb-2">Export Data</h3>
                  <p className="text-sm text-gray-600 mb-4">Download a backup of all your system data</p>
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export System Data
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg mb-2">Import Data</h3>
                  <p className="text-sm text-gray-600 mb-4">Restore system data from a backup file</p>
                  <div className="flex items-center gap-4">
                    <Input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="max-w-xs"
                    />
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Card>

            {user?.role === 'chairperson' && (
              <Card className="p-6 border-red-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-600 mb-4">Permanently delete all system data</p>
                    <Button onClick={handleClearData} variant="destructive">
                      <Shield className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}