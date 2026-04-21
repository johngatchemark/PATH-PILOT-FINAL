import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Trash2, 
  Map as MapIcon,
  X,
  Loader2,
  Bookmark,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Logo from '../components/Logo';

const SavedPaths: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedPaths, setSavedPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (session?.user?.id) {
        fetchSavedPaths(session.user.id);
      }
    });
  }, []);

  const fetchSavedPaths = async (userId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/users/${userId}/saved-paths`);
      setSavedPaths(res.data);
    } catch (err) {
      console.error("Failed to fetch saved paths", err);
    } finally {
      setLoading(false);
    }
  };

  const removePath = async (careerId: string) => {
    if (!session?.user?.id) return;
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${apiUrl}/api/users/${session.user.id}/saved-paths/${careerId}`);
      setSavedPaths(prev => prev.filter(p => p.careerId !== careerId));
    } catch (err) {
      console.error("Failed to remove path", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-['Poppins']">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0A0B] to-[#0A0A0B] pointer-events-none" />

      <header className="sticky top-0 z-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </button>
            <Logo size="sm" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] hidden sm:block">Personal Roadmaps</h2>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Saved <span className="text-purple-500">Trajections</span></h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Your curated collection of future professional paths</p>
        </div>

        {savedPaths.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col items-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-purple-500 opacity-30" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No Saved Paths Yet</h3>
            <p className="text-slate-500 max-w-sm mb-8">Start by exploring career recommendations and bookmark the ones that resonate with you.</p>
            <button 
              onClick={() => navigate('/career-paths')}
              className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-[1.02] transition-all text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Explore Paths
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedPaths.map((path) => (
              <div key={path.id} className="group bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                    <MapIcon className="w-7 h-7" />
                  </div>
                  <button 
                    onClick={() => removePath(path.careerId)}
                    className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{path.career.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {path.career.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setSelectedPath(path);
                      setShowMap(true);
                    }}
                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    View Map <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Path Map Modal (Shared with CareerResults) */}
      {showMap && selectedPath && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowMap(false)} />
          <div className="relative w-full max-w-4xl bg-[#0F0F11] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-full">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <MapIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedPath.career.title} Path Map</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Personal Roadmap</p>
                </div>
              </div>
              <button onClick={() => setShowMap(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-blue-500/20">
                {selectedPath.career.milestones?.map((m: any, idx: number) => (
                  <div key={m.id} className="relative pl-12 group">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center z-10">
                      <span className="text-xs font-black text-white">{idx + 1}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                      <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{m.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPaths;
