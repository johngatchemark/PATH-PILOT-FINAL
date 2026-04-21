import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  ChevronRight,
  Bookmark,
  Loader2,
  X,
  Map as MapIcon,
  Compass
} from 'lucide-react';
import Logo from '../components/Logo';

const CareerResults: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [savedPathIds, setSavedPathIds] = useState<Set<string>>(new Set());
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (session?.user?.id) {
        fetchData(session.user.id);
      }
    });
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Fetch user profile to get trajectories
      const userRes = await axios.get(`${apiUrl}/api/users/${userId}`);
      if (userRes.data.trajectories && userRes.data.trajectories.length > 0) {
        setRecommendations(userRes.data.trajectories);
      } else {
        // Fallback: run match
        const matchRes = await axios.post(`${apiUrl}/api/recommendations/match`, { userId });
        setRecommendations(matchRes.data.matches || []);
      }

      // Fetch saved paths
      const savedRes = await axios.get(`${apiUrl}/api/users/${userId}/saved-paths`);
      const savedIds = new Set<string>(savedRes.data.map((s: any) => s.careerId));
      setSavedPathIds(savedIds);

    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (careerId: string) => {
    if (!session?.user?.id) return;
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    try {
      if (savedPathIds.has(careerId)) {
        await axios.delete(`${apiUrl}/api/users/${session.user.id}/saved-paths/${careerId}`);
        setSavedPathIds(prev => {
          const next = new Set<string>(prev);
          next.delete(careerId);
          return next;
        });
      } else {
        await axios.post(`${apiUrl}/api/users/${session.user.id}/saved-paths`, { careerId });
        setSavedPathIds(prev => new Set<string>([...prev, careerId]));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const viewPathMap = async (career: any) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      const res = await axios.get(`${apiUrl}/api/careers/${career.careerId}/milestones`);
      setSelectedCareer({ ...career, milestones: res.data });
      setShowMap(true);
    } catch (err) {
      console.error("Failed to fetch milestones", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Syncing Trajectories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-['Poppins']">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/analyzing')} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Sparkles className="w-4 h-4" /> Rescan
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4" /> Analysis Match Ready
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">AI-Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Trajections</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Your profile has been analyzed against the current global talent market.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col items-center">
              <Compass className="w-16 h-16 text-slate-700 mb-6 animate-pulse" />
              <h3 className="text-xl font-black text-white mb-2">No Clear Match Found</h3>
              <p className="text-slate-500 max-w-sm mb-8 italic">Your profile has unique qualities that don't perfectly align with current predefined paths. Try adding more skills or interests to refine the scan.</p>
              <button 
                onClick={() => navigate('/settings')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest"
              >
                Refine Profile
              </button>
            </div>
          ) : recommendations.map((item) => (
            <div key={item.id} className="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-purple-500/10 text-purple-400 shadow-2xl shadow-purple-500/5 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Match Pts</p>
                    <p className="text-2xl font-black text-white">{item.score}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight">{item.careerTitle}</h3>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-400 border border-white/10 uppercase tracking-widest">
                          {item.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleBookmark(item.careerId)}
                        className={`p-3 rounded-xl transition-all ${savedPathIds.has(item.careerId) ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <a 
                        href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(item.careerTitle)}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm"
                      >
                        Explore <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500" />
                    <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-2">Why this fits you?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> AI Validated</span>
                  <span className="flex items-center gap-1.5 font-black text-purple-400/70">{item.score > 40 ? 'High Potential' : 'Emerging Fit'}</span>
                </div>
                <button 
                  onClick={() => viewPathMap(item)}
                  className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                  View Path Map <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Path Map Modal */}
      {showMap && selectedCareer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowMap(false)} />
          <div className="relative w-full max-w-4xl bg-[#0F0F11] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-full">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <MapIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedCareer.careerTitle} Path Map</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recommended Milestones</p>
                </div>
              </div>
              <button onClick={() => setShowMap(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-blue-500/20">
                {selectedCareer.milestones?.map((m: any, idx: number) => (
                  <div key={m.id} className="relative pl-12 group">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                      <span className="text-xs font-black text-white">{idx + 1}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group-hover:border-purple-500/30 transition-all">
                      <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{m.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
              <button 
                onClick={() => {
                  toggleBookmark(selectedCareer.careerId);
                  setShowMap(false);
                }}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-500/20 uppercase tracking-widest text-xs"
              >
                {savedPathIds.has(selectedCareer.careerId) ? 'Saved to Profile' : 'Save this Path Map'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerResults;
