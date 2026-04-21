import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        // We use axios but we need to dynamically import it or use fetch to avoid adding imports if possible. Let's use fetch to keep it simple.
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/users/check/${session.user.email}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setAuthenticated(true);
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          // If the backend fails, default to redirecting to onboarding or login.
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        navigate('/onboarding', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-purple-400 animate-pulse font-mono uppercase tracking-widest text-sm">
          Securing Connection...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
