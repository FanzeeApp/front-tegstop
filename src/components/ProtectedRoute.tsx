import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/hooks/api';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token, user, setAuth } = useAuthStore();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/status');
        const data = response.data;

        setUserStatus(data.status);

        // Update user in store with latest data
        if (user) {
          setAuth({ ...user, status: data.status, onboardingComplete: data.onboardingComplete }, token);
        }
      } catch (error) {
        console.error('Status check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if onboarding is complete
  const onboardingComplete = user?.onboardingComplete ?? true;
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check user status
  const status = userStatus || user?.status;

  // If status is not approved, redirect to pending-approval
  if (status && status !== 'approved') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};
