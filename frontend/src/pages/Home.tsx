import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Compass, LogOut, CheckCircle, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CareerMatch {
  careerId: string;
  careerTitle: string;
  score: number;
  level: string;
  explanation: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [profile, setProfile] = useState<any>(location.state?.profile || null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // If logged in, attempt to fetch recommendations
        fetchRecommendations(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRecommendations(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRecommendations = async (userId: string) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/recommendations/match`, { userId });
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Backend offline, using fallback data.");
      // Fallback
      setMatches([
        {
          careerId: '1',
          careerTitle: 'Software Engineer',
          level: 'Junior',
          score: 15,
          explanation: 'Your profile is a strong fit. You matched required skills directly related to technical logic.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  if (!session) {
    // Landing View
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-sm font-medium tracking-wide text-purple-300 shadow-[0_0_20px_-5px_rgba(147,51,234,0.4)]">
            <Sparkles className="w-4 h-4" /> Determine Your Optimal Career Path
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Navigate your future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">PathPilot</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The intelligent web-based decision support system designed to match your unique skills, education, and interests to the perfect career trajectory.
          </p>

          <div className="pt-8 flex flex-col items-center">
            <button 
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] hover:shadow-[0_0_40px_-5px_rgba(147,51,234,0.8)] shadow-lg"
            >
              <span className="mr-2 text-lg">Get Started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            {!isSupabaseConfigured && (
              <p className="mt-4 text-sm text-yellow-500/80 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Preview Mode
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-purple-400">
        <Loader2 className="w-12 h-12 animate-spin mb-6 text-blue-500" />
        <p className="font-mono text-sm tracking-widest uppercase">Processing Trajectories...</p>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col items-center py-12 px-4 sm:px-6 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

      <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
        <span className="text-sm text-slate-400">{session?.user?.email}</span>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="w-full max-w-5xl z-10 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Career Trajectories</h1>
            <p className="text-slate-400 mt-2">Based on your unique profile details.</p>
          </div>
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-lg"
          >
            Refine Profile
          </button>
        </header>

        <div className="space-y-6">
          {matches.map((match, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/[0.05] p-6 sm:p-8 rounded-3xl hover:bg-white/[0.05] transition-all duration-300 group hover:border-purple-500/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{match.careerTitle}</h3>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                      {match.level}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Match Accuracy Score: <span className="text-green-400 font-mono font-bold">+{match.score}</span></p>
                </div>
                
                <a 
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(match.careerTitle)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all"
                >
                  View Market <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-2xl" />
                <p className="text-slate-300 leading-relaxed pl-3 text-sm sm:text-base">
                  <span className="font-semibold text-purple-300 block mb-1">Suitability Analysis:</span> 
                  {match.explanation}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-4 border-t border-white/5 pt-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Helpful?</span>
                <button className="text-slate-400 hover:text-green-400 p-2 rounded-full transition-all">
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10">
              <Compass className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No trajectories found. Please update your onboarding profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
