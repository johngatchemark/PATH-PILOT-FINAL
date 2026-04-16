import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Briefcase, GraduationCap, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import UserProfileForm from '../components/UserProfileForm';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [profile, setProfile] = useState({ 
    full_name: '',
    birthday: '',
    address: '',
    avatar_url: '',
    skills: '', 
    interests: '',
    education: '',
    experienceYears: 0 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Only redirect if not in mock mode or if supabase is actually configured
        if (isSupabaseConfigured) navigate('/login');
      }
      setSession(session);
    });
  }, [navigate]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    navigate('/');
  };

  const handleBasicInfoComplete = (basicData: any) => {
    setProfile({ ...profile, ...basicData });
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const skillList = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    const interestsList = profile.interests.split(',').map(s => s.trim()).filter(Boolean);
    
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/users/profile`, {
        id: session?.user?.id,
        email: session?.user?.email,
        full_name: profile.full_name,
        birthday: profile.birthday,
        address: profile.address,
        avatar_url: profile.avatar_url,
        skills: skillList,
        interests: interestsList,
        education: profile.education,
        experienceYears: profile.experienceYears
      });
      navigate('/home'); 
    } catch (error) {
      console.error("Backend error, proceeding with local state.", error);
      navigate('/home', { state: { profile } }); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col p-6 items-center justify-center relative overflow-hidden py-12 font-['Poppins']">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0A0B] to-[#0A0A0B] pointer-events-none" />
      
      {/* Navbar Decoration */}
      <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">PathPilot <span className="text-blue-500">ID</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs font-medium text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">{session?.user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/10 active:scale-[0.95]">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-4 md:p-10 rounded-[2.5rem] backdrop-blur-2xl z-10 shadow-2xl relative">
        <div className="absolute top-0 right-10 -translate-y-1/2 flex gap-2">
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 1 ? 'bg-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/20'}`} />
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 2 ? 'bg-purple-500 scale-125 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/20'}`} />
        </div>

        {step === 1 ? (
          <UserProfileForm userId={session?.user?.id} onComplete={handleBasicInfoComplete} />
        ) : (
          <div className="animate-in slide-in-from-right-8 duration-500">
            <button 
              onClick={() => setStep(1)}
              className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Profile
            </button>
            
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-xl shadow-purple-500/5">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Career Architecture</h2>
              <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">Detail your professional background for our AI-driven optimal career mapping.</p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <GraduationCap className="w-4 h-4 text-purple-400" /> Educational Level
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. BS Computer Science"
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                    value={profile.education}
                    onChange={(e) => setProfile({...profile, education: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Briefcase className="w-4 h-4 text-purple-400" /> Experience (Years)
                  </label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    step="0.5"
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                    value={profile.experienceYears}
                    onChange={(e) => setProfile({...profile, experienceYears: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Compass className="w-4 h-4 text-blue-400" /> Technical Skill Stack
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="React, Python, AWS, SQL..."
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                    value={profile.skills}
                    onChange={(e) => setProfile({...profile, skills: e.target.value})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Interests & Aspirations
                  </label>
                  <input 
                    type="text" 
                    placeholder="AI Safety, Fintech, Creative Direction..."
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                    value={profile.interests}
                    onChange={(e) => setProfile({...profile, interests: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 mt-6 font-black text-white bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700 rounded-2xl hover:brightness-110 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 group uppercase tracking-widest text-sm"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                ) : (
                  <>
                    Initialize Trajectory Analysis <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

