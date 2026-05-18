import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { simulateDelay } from '../utils/backendSimulator';

export type UserRole = 'chairperson' | 'treasurer' | 'secretary';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  canEdit: (resourceType: 'liquidation' | 'accomplishment' | 'budget' | 'event') => boolean;
  canApprove: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for the three roles
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'president': {
    password: 'president',
    user: {
      id: '1',
      username: 'president',
      fullName: 'SK Chairperson',
      role: 'chairperson',
    },
  },
  'treasurer': {
    password: 'treasurer',
    user: {
      id: '2',
      username: 'treasurer',
      fullName: 'SK Treasurer',
      role: 'treasurer',
    },
  },
  'secretary': {
    password: 'secretary',
    user: {
      id: '3',
      username: 'secretary',
      fullName: 'SK Secretary',
      role: 'secretary',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      
      // Simulate API call delay
      await simulateDelay(800, 1500);
      
      const userCredentials = DEMO_USERS[username.toLowerCase()];
      
      if (userCredentials && userCredentials.password === password) {
        setUser(userCredentials.user);
        localStorage.setItem('currentUser', JSON.stringify(userCredentials.user));
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
      
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      
      // Simulate API call delay
      await simulateDelay(500, 1000);
      
      setUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const canEdit = (resourceType: 'liquidation' | 'accomplishment' | 'budget' | 'event'): boolean => {
    if (!user) return false;

    // SK Chairperson has oversight but proposals need approval (view all, approve all)
    if (user.role === 'chairperson') return true;

    // Treasurer can prepare budget proposals and track expenses (after approval)
    if (user.role === 'treasurer') {
      return resourceType === 'liquidation' || resourceType === 'budget';
    }

    // Secretary can create activity proposals and track events (after approval)
    if (user.role === 'secretary') {
      return resourceType === 'accomplishment' || resourceType === 'event';
    }

    return false;
  };

  const canApprove = (): boolean => {
    // Only SK Chairperson can approve proposals
    return user?.role === 'chairperson';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoggingIn,
        isLoggingOut,
        canEdit,
        canApprove,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}