import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoggingIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/staff/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!username || !password) {
      setError('Please enter both username and password');
      toast.error('Please enter both username and password');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      // Attempt login with loading state
      const success = await login(username, password);
      
      if (success) {
        toast.success('Login successful! Welcome to SK Naawan IMS');
        navigate('/staff/dashboard');
      } else {
        setError('Invalid username or password');
        toast.error('Invalid username or password. Please try again.');
      }
    } catch (error: any) {
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen ph-pattern-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <img src={logoImage} alt="SK Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl mb-2">Information Management System</h1>
          <p className="text-gray-600 text-sm">for the Sangguniang Kabataan of Naawan</p>
          <p className="text-gray-600 text-sm">Activities, Budget Transparency, and Reporting</p>
        </div>

        {/* Public Portal Link */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-2">
            Looking for public information?
          </p>
          <Button 
            variant="link" 
            onClick={() => navigate('/public')}
            className="text-[#1BA160] hover:text-[#0E6B3D]"
          >
            Visit Public Transparency Portal →
          </Button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-11">
            {isLoggingIn ? <Loader2 className="animate-spin" /> : 'Log In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}