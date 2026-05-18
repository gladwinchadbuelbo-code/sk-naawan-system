import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Printer, Upload, Lock, Edit, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import type { AccomplishmentReport, ActivitySchedule } from '../types/reports';

export function AccomplishmentReportPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { canEdit, user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(!eventId);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivitySchedule | null>(null);
  const [newObjective, setNewObjective] = useState('');
  const [newOutput, setNewOutput] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const canEditReport = canEdit('accomplishment');

  const [report, setReport] = useState<AccomplishmentReport>({
    id: 0,
    eventId: eventId ? parseInt(eventId) : undefined,
    eventTitle: '',
    eventDate: '',
    eventType: '',
    venue: '',
    time: '',
    objectives: [],
    activities: [],
    participants: {
      total: 0,
      male: 0,
      female: 0,
      ageBreakdown: {},
    },
    outputs: [],
    outcomes: [],
    photos: [],
    preparedBy: user?.fullName || '',
    position: 'SK Secretary',
    approvedBy: '',
    approverPosition: 'SK Chairperson',
    dateCreated: new Date().toISOString(),
    status: 'Draft',
    createdBy: user?.username || '',
  });

  useEffect(() => {
    if (eventId) {
      const reports = storage.getReports() || [];
      const existingReport = reports.find((r: AccomplishmentReport) => 
        r.eventId === parseInt(eventId) && r.objectives !== undefined
      );
      if (existingReport) {
        setReport(existingReport);
        setIsEditing(false);
      } else {
        const events = storage.getEvents() || [];
        const event = events.find((e: any) => e.id === parseInt(eventId));
        if (event) {
          setReport(prev => ({
            ...prev,
            eventTitle: event.title,
            eventDate: event.date,
            venue: event.venue,
            time: event.time,
          }));
        }
      }
    }
  }, [eventId, user]);

  const handleSaveReport = () => {
    if (!canEditReport) {
      toast.error('You do not have permission to save accomplishment reports');
      return;
    }

    if (!report.eventTitle || !report.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const reports = storage.getReports() || [];
    let updatedReports;

    if (report.id) {
      updatedReports = reports.map((r: any) => 
        r.id === report.id ? { ...report } : r
      );
      toast.success('Accomplishment report updated successfully');
    } else {
      const newReport = {
        ...report,
        id: Date.now(),
        dateCreated: new Date().toISOString(),
      };
      updatedReports = [...reports, newReport];
      setReport(newReport);
      toast.success('Accomplishment report created successfully');
    }

    storage.setReports(updatedReports);
    storage.addActivity({
      type: 'report',
      action: report.id ? 'updated' : 'created',
      description: `${report.id ? 'Updated' : 'Created'} accomplishment report: ${report.eventTitle}`,
    });
    setIsEditing(false);
  };

  const handleAddActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const activity: ActivitySchedule = {
      time: formData.get('time') as string,
      activity: formData.get('activity') as string,
    };

    if (editingActivity) {
      setReport(prev => ({
        ...prev,
        activities: prev.activities.map((act, idx) => 
          act.time === editingActivity.time && act.activity === editingActivity.activity ? activity : act
        ),
      }));
      toast.success('Activity updated');
    } else {
      setReport(prev => ({
        ...prev,
        activities: [...prev.activities, activity],
      }));
      toast.success('Activity added');
    }

    setShowActivityModal(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activity: ActivitySchedule) => {
    setReport(prev => ({
      ...prev,
      activities: prev.activities.filter(act => 
        !(act.time === activity.time && act.activity === activity.activity)
      ),
    }));
    toast.success('Activity deleted');
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setReport(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective('');
      toast.success('Objective added');
    }
  };

  const handleAddOutput = () => {
    if (newOutput.trim()) {
      setReport(prev => ({
        ...prev,
        outputs: [...prev.outputs, newOutput.trim()],
      }));
      setNewOutput('');
      toast.success('Output added');
    }
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setReport(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, newOutcome.trim()],
      }));
      setNewOutcome('');
      toast.success('Outcome added');
    }
  };

  const handleGeneratePDF = () => {
    toast.success('PDF generation coming soon!');
  };

  if (!canEditReport && !report.id) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Only the SK Secretary can create accomplishment reports.
          </p>
          <Button onClick={() => navigate('/staff/reports?tab=events')}>
            Back to Reports
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/staff/reports?tab=events')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">Accomplishment Report</h1>
            {canEditReport ? (
              <Badge className="bg-green-600 hover:bg-green-700">
                <Edit className="w-3 h-3 mr-1" />
                Can Edit
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Lock className="w-3 h-3 mr-1" />
                View Only
              </Badge>
            )}
            <Badge variant={report.status === 'Approved' ? 'default' : 'secondary'}>
              {report.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">Event accomplishment report</p>
        </div>
        <div className="flex gap-3">
          {canEditReport && (
            <>
              {isEditing ? (
                <Button onClick={handleSaveReport} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Report
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Report
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          {report.id && (
            <>
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Event Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Title *</Label>
                <Input
                  value={report.eventTitle}
                  onChange={(e) => setReport(prev => ({ ...prev, eventTitle: e.target.value }))}
                  placeholder="Enter event title"
                  disabled={!canEditReport}
                />
              </div>
              <div>
                <Label>Event Type *</Label>
                <Input
                  value={report.eventType}
                  onChange={(e) => setReport(prev => ({ ...prev, eventType: e.target.value }))}
                  placeholder="e.g., Leadership Development"
                  disabled={!canEditReport}
                />
              </div>
              <div>
                <Label>Event Date *</Label>
                <Input
                  type="date"
                  value={report.eventDate}
                  onChange={(e) => setReport(prev => ({ ...prev, eventDate: e.target.value }))}
                  disabled={!canEditReport}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  value={report.time}
                  onChange={(e) => setReport(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  disabled={!canEditReport}
                />
              </div>
              <div className="col-span-2">
                <Label>Venue</Label>
                <Input
                  value={report.venue}
                  onChange={(e) => setReport(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Enter venue"
                  disabled={!canEditReport}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Objectives</h3>
            {canEditReport && (
              <div className="flex gap-2 mb-4">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Enter an objective"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                />
                <Button onClick={handleAddObjective}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <ul className="space-y-2">
              {report.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-600">{idx + 1}.</span>
                  <span className="flex-1">{obj}</span>
                  {canEditReport && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReport(prev => ({
                        ...prev,
                        objectives: prev.objectives.filter((_, i) => i !== idx)
                      }))}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </li>
              ))}
              {report.objectives.length === 0 && (
                <p className="text-gray-500 text-sm">No objectives added yet</p>
              )}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Activity Schedule</h3>
            {canEditReport && (
              <Button 
                onClick={() => {
                  setEditingActivity(null);
                  setShowActivityModal(true);
                }} 
                className="mb-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            )}
            <div className="space-y-2">
              {report.activities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-32 text-sm text-gray-600">{activity.time}</div>
                  <div className="flex-1">{activity.activity}</div>
                  {canEditReport && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingActivity(activity);
                          setShowActivityModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteActivity(activity)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {report.activities.length === 0 && (
                <p className="text-gray-500 text-sm">No activities added yet</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Participants</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Total</Label>
                <Input
                  type="number"
                  value={report.participants.total}
                  onChange={(e) => setReport(prev => ({
                    ...prev,
                    participants: { ...prev.participants, total: Number(e.target.value) }
                  }))}
                  disabled={!canEditReport}
                />
              </div>
              <div>
                <Label>Male</Label>
                <Input
                  type="number"
                  value={report.participants.male}
                  onChange={(e) => setReport(prev => ({
                    ...prev,
                    participants: { ...prev.participants, male: Number(e.target.value) }
                  }))}
                  disabled={!canEditReport}
                />
              </div>
              <div>
                <Label>Female</Label>
                <Input
                  type="number"
                  value={report.participants.female}
                  onChange={(e) => setReport(prev => ({
                    ...prev,
                    participants: { ...prev.participants, female: Number(e.target.value) }
                  }))}
                  disabled={!canEditReport}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Outputs</h3>
            {canEditReport && (
              <div className="flex gap-2 mb-4">
                <Input
                  value={newOutput}
                  onChange={(e) => setNewOutput(e.target.value)}
                  placeholder="Enter an output"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutput())}
                />
                <Button onClick={handleAddOutput}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <ul className="space-y-2">
              {report.outputs.map((output, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span className="flex-1">{output}</span>
                  {canEditReport && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReport(prev => ({
                        ...prev,
                        outputs: prev.outputs.filter((_, i) => i !== idx)
                      }))}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </li>
              ))}
              {report.outputs.length === 0 && (
                <p className="text-gray-500 text-sm">No outputs added yet</p>
              )}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg mb-4">Outcomes</h3>
            {canEditReport && (
              <div className="flex gap-2 mb-4">
                <Input
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="Enter an outcome"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                />
                <Button onClick={handleAddOutcome}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <ul className="space-y-2">
              {report.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span className="flex-1">{outcome}</span>
                  {canEditReport && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReport(prev => ({
                        ...prev,
                        outcomes: prev.outcomes.filter((_, i) => i !== idx)
                      }))}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </li>
              ))}
              {report.outcomes.length === 0 && (
                <p className="text-gray-500 text-sm">No outcomes added yet</p>
              )}
            </ul>
          </Card>
        </div>
      )}

      {/* Report Preview */}
      {showPreview && report.id && (
        <Card className="p-8 max-w-5xl mx-auto bg-white">
          <div className="text-center border-b pb-6 mb-6">
            <h2 className="text-2xl">ACCOMPLISHMENT REPORT</h2>
            <p className="text-gray-600 mt-2">Sangguniang Kabataan</p>
            <p className="text-gray-600">Barangay [Name]</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">I. EVENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Event Title:</p>
                <p>{report.eventTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Event Type:</p>
                <p>{report.eventType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date:</p>
                <p>{new Date(report.eventDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time:</p>
                <p>{report.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Venue:</p>
                <p>{report.venue}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">II. OBJECTIVES</h3>
            <ol className="list-decimal list-inside space-y-2">
              {report.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ol>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">III. ACTIVITY SCHEDULE</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3 w-1/4">Time</th>
                  <th className="text-left py-2 px-3">Activity</th>
                </tr>
              </thead>
              <tbody>
                {report.activities.map((activity, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-3">{activity.time}</td>
                    <td className="py-2 px-3">{activity.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">IV. PARTICIPANTS</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Participants:</span>
                <span>{report.participants.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Male:</span>
                <span>{report.participants.male}</span>
              </div>
              <div className="flex justify-between">
                <span>Female:</span>
                <span>{report.participants.female}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">V. OUTPUTS</h3>
            <ul className="list-disc list-inside space-y-2">
              {report.outputs.map((output, idx) => (
                <li key={idx}>{output}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg mb-4 border-b pb-2">VI. OUTCOMES</h3>
            <ul className="list-disc list-inside space-y-2">
              {report.outcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-b border-black inline-block min-w-[200px] pb-1 mb-2">
                {report.preparedBy}
              </div>
              <p className="text-sm">{report.position}</p>
              <p className="text-sm text-gray-600">Prepared By</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black inline-block min-w-[200px] pb-1 mb-2">
                {report.approvedBy || '_________________'}
              </div>
              <p className="text-sm">{report.approverPosition}</p>
              <p className="text-sm text-gray-600">Approved By</p>
            </div>
          </div>
        </Card>
      )}

      {/* Add/Edit Activity Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddActivity}>
            <div className="space-y-4">
              <div>
                <Label>Time *</Label>
                <Input
                  name="time"
                  defaultValue={editingActivity?.time || ''}
                  placeholder="e.g., 9:00 AM - 10:00 AM"
                  required
                />
              </div>
              <div>
                <Label>Activity *</Label>
                <Textarea
                  name="activity"
                  defaultValue={editingActivity?.activity || ''}
                  placeholder="Describe the activity"
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowActivityModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingActivity ? 'Update' : 'Add'} Activity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}