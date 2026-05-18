import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Camera, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { storage } from '../utils/storage';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function PublicCheckInPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState<any>(null);
  const [attendeeNumber, setAttendeeNumber] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    barangay: '',
    age: '',
    photo: '',
  });

  useEffect(() => {
    // Load event details
    const events = storage.getEvents() || [];
    const foundEvent = events.find((e: any) => e.id === parseInt(eventId || '0'));
    
    if (foundEvent) {
      setEvent(foundEvent);
      // Get current attendance count
      const attendance = storage.getEventAttendance(foundEvent.id);
      setAttendeeNumber(attendance.length + 1);
    } else {
      setError('Event not found. Please check the QR code or link.');
    }
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoCapture = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment' as any;
      
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setFormData({
              ...formData,
              photo: event.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } catch (err) {
      console.error('Photo capture error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.contactNumber.trim()) {
      setError('Please enter your contact number');
      return;
    }
    if (formData.contactNumber.length < 10) {
      setError('Please enter a valid contact number');
      return;
    }

    // Check for duplicate
    const isDuplicate = storage.isAlreadyCheckedIn(
      parseInt(eventId || '0'),
      formData.contactNumber
    );

    if (isDuplicate) {
      setError('This contact number has already checked in for this event.');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        // Save attendance record
        const record = storage.addAttendanceRecord(parseInt(eventId || '0'), {
          fullName: formData.fullName,
          contactNumber: formData.contactNumber,
          barangay: formData.barangay || 'Not specified',
          age: formData.age ? parseInt(formData.age) : null,
          photo: formData.photo || null,
          checkInMethod: 'qr',
        });

        setAttendeeNumber(storage.getEventAttendance(parseInt(eventId || '0')).length);
        setSubmitted(true);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to check in. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  if (!event && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#2f7d5f]" />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => navigate('/public')}
              className="w-full mt-4 bg-[#2f7d5f] hover:bg-[#25614a]"
            >
              Go to Public Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-[#1e3a5f]">
              Check-In Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Thank you,</p>
              <p className="text-xl text-[#1e3a5f] mt-1">{formData.fullName}</p>
            </div>

            <div className="border-t border-b py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium">{event.title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Check-in Time:</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Participant #:</span>
                <span className="font-medium text-[#2f7d5f] text-lg">
                  {attendeeNumber}
                </span>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please take a screenshot of this confirmation for your records.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => navigate('/public')}
              className="w-full bg-[#2f7d5f] hover:bg-[#25614a]"
            >
              Go to Public Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <img src={logoImage} alt="SK Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl text-[#1e3a5f] mb-2">SK Event Check-In</h1>
          <p className="text-gray-600">Sangguniang Kabataan</p>
        </div>

        {/* Event Info Card */}
        <Card className="bg-gradient-to-br from-[#2f7d5f] to-[#1e5a47] text-white">
          <CardContent className="pt-6">
            <h2 className="text-2xl mb-4">{event.title}</h2>
            <div className="space-y-2 text-green-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{attendeeNumber - 1} participants checked in</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Participant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Juan Dela Cruz"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <Input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="09171234567"
                  type="tel"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Barangay (Optional)
                </label>
                <Input
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  placeholder="Enter your barangay"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Age (Optional)
                </label>
                <Input
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="18"
                  type="number"
                  min="1"
                  max="120"
                  disabled={loading}
                />
              </div>

              {/* Photo Capture */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Photo Verification (Optional)
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePhotoCapture}
                    className="flex-1"
                    disabled={loading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {formData.photo ? 'Photo Captured ✓' : 'Take Photo'}
                  </Button>
                </div>
                {formData.photo && (
                  <div className="mt-2">
                    <img
                      src={formData.photo}
                      alt="Captured"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2f7d5f] hover:bg-[#25614a] text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Check In Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Powered by SK Integrated Digital Management System
        </p>
      </div>
    </div>
  );
}
