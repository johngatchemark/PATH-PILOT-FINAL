import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import UserProfileForm from '../components/UserProfileForm';
import Logo from '../components/Logo';
import { 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Loader2,
  Plus,
  X,
  History,
  Trash2
} from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [predefinedSkills, setPredefinedSkills] = useState<string[]>([]);
  const [predefinedInterests, setPredefinedInterests] = useState<string[]>([]);
  const [predefinedCareers, setPredefinedCareers] = useState<string[]>([]);
  
  const [profile, setProfile] = useState<any>({ 
    full_name: '',
    birthday: '',
    address: '',
    avatar_url: '',
    skills: [], 
    interests: [],
    education: '',
    experienceYears: 0,
    experiences: [] as { title: string, durationYears: number }[]
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
    });

    const fetchMetadata = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/metadata`);
        setPredefinedSkills(response.data.skills || []);
        setPredefinedInterests(response.data.interests || []);
        setPredefinedCareers(response.data.careers || []);
      } catch (err) {
        console.error('Failed to fetch metadata', err);
      }
    };
    fetchMetadata();
  }, [navigate]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    navigate('/');
  };

  const handleBasicInfoComplete = (basicData: any) => {
    setProfile({ ...profile, ...basicData });
    setStep(2);
  };

  const toggleSkill = (skill: string) => {
    setProfile((prev: any) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s: string) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev: any) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const addWorkExperience = () => {
    setProfile((prev: any) => ({
      ...prev,
      experiences: [...prev.experiences, { title: '', durationYears: 1 }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    setProfile((prev: any) => ({
      ...prev,
      experiences: prev.experiences.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: any) => {
    setProfile((prev: any) => {
      const newExps = [...prev.experiences];
      newExps[index] = { ...newExps[index], [field]: value };
      return { ...prev, experiences: newExps };
    });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Calculate total experience years for backward compatibility if needed
      const totalExp = profile.experiences.reduce((sum: number, exp: any) => sum + parseFloat(exp.durationYears || 0), 0);

      await axios.post(`${apiUrl}/api/users/profile`, {
        id: session?.user?.id,
        email: session?.user?.email,
        full_name: profile.full_name,
        birthday: profile.birthday,
        address: profile.address,
        avatar_url: profile.avatar_url,
        skills: profile.skills, 
        interests: profile.interests,
        education: profile.education,
        experienceYears: totalExp || profile.experienceYears,
        experiences: profile.experiences
      });
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error("Backend error during onboarding", error);
      const errorMessage = error.response?.data?.error || "Failed to save profile. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0B] text-slate-200 flex flex-col pt-24 pb-8 px-4 sm:px-6 items-center relative overflow-hidden font-['Poppins']">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0A0B] to-[#0A0A0B] pointer-events-none" />
      
      {/* Top Bar */}
      <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center z-20">
        <Logo size="sm" />
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs font-medium text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">{session?.user?.email || 'Guest Mode'}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/10 active:scale-[0.95]">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl z-10 shadow-2xl relative flex flex-col flex-1 min-h-0">
        
        {step === 1 && (
          <div className="overflow-y-auto p-4 md:p-10 flex-1">
            <UserProfileForm userId={session?.user?.id} onComplete={handleBasicInfoComplete} />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 duration-500 flex flex-col h-full">
            <div className="px-4 md:px-10 pt-6 md:pt-10 pb-4 shrink-0 border-b border-white/5">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Profile
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Skills & Interests</h2>
                <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">Define your core capabilities and what drives you professionally.</p>
              </div>

              <div className="space-y-8">
                {/* Education Section */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <GraduationCap className="w-4 h-4 text-purple-400" /> Educational Level
                  </label>
                  <select
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all shadow-inner font-bold appearance-none cursor-pointer"
                    value={profile.education}
                    onChange={(e) => setProfile({...profile, education: e.target.value})}
                  >
                    <option value="" disabled>Select your level...</option>
                    <option value="High School">High School</option>
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="BS Computer Science">BS Computer Science</option>
                    <option value="BA Business Administration">BA Business Administration</option>
                    <option value="BSc Data Science">BSc Data Science</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Ph.D">Ph.D</option>
                    <option value="Self Taught / Bootcamp">Self Taught / Bootcamp</option>
                  </select>
                </div>

                {/* Skill Badge Section */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Compass className="w-4 h-4 text-blue-400" /> Technical Skill Stack
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-black/20 rounded-3xl border border-white/5">
                    {profile.skills.length === 0 && <span className="text-slate-600 text-xs font-medium italic">No skills selected...</span>}
                    {profile.skills.map((skill: string) => (
                      <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-black group">
                        {skill}
                        <button type="button" onClick={() => toggleSkill(skill)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSkills.filter(s => !profile.skills.includes(s)).map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                        <Plus className="w-3 h-3" /> {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests Section */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Career Interests
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-black/20 rounded-3xl border border-white/5">
                    {profile.interests.length === 0 && <span className="text-slate-600 text-xs font-medium italic">No interests selected...</span>}
                    {profile.interests.map((interest: string) => (
                      <div key={interest} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-black group">
                        {interest}
                        <button type="button" onClick={() => toggleInterest(interest)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedInterests.filter(i => !profile.interests.includes(i)).map(interest => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                        <Plus className="w-3 h-3" /> {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full py-6 mt-12 font-black text-white bg-white/10 border border-white/10 rounded-[2rem] hover:bg-white/20 transition-all flex justify-center items-center gap-3 uppercase tracking-[0.2em] text-sm"
              >
                Next Step: Work History <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 duration-500 flex flex-col h-full">
            <div className="px-4 md:px-10 pt-6 md:pt-10 pb-4 shrink-0 border-b border-white/5">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Skills
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Work History</h2>
                <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">Help our traditional AI map your trajectory by detailing your past professional roles.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-in slide-in-from-top-2 flex items-center gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="space-y-4">
                  {profile.experiences.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
                      <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm font-medium">No work experience added yet.</p>
                    </div>
                  )}

                  {profile.experiences.map((exp: any, index: number) => (
                    <div key={index} className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-4 animate-in zoom-in-95 duration-300 relative group">
                      <button 
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Previous Role / Line of Work</label>
                        <input 
                          list="career-suggestions"
                          placeholder="e.g. Software Engineer, Sales, etc."
                          className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                          value={exp.title}
                          onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                          required
                        />
                        <datalist id="career-suggestions">
                          {predefinedCareers.map(c => <option key={c} value={c} />)}
                        </datalist>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Duration (Years)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range"
                            min="0.5"
                            max="20"
                            step="0.5"
                            className="flex-1 accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            value={exp.durationYears}
                            onChange={(e) => updateWorkExperience(index, 'durationYears', parseFloat(e.target.value))}
                          />
                          <span className="w-16 text-center py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-black">
                            {exp.durationYears}y
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={addWorkExperience}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-[1.5rem] text-slate-500 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" /> Add Past Experience
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-6 mt-12 font-black text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] hover:brightness-110 transition-all active:scale-[0.98] flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 uppercase tracking-[0.2em] text-sm"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize AI Analysis <Sparkles className="w-5 h-5" /></>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step Indicator Dots */}
        <div className="shrink-0 p-6 flex justify-center gap-3 border-t border-white/5">
          <button 
            onClick={() => setStep(1)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 1 ? 'bg-blue-500 scale-150 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
          />
          <button 
            onClick={() => profile.full_name && setStep(2)}
            disabled={!profile.full_name}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 2 ? 'bg-blue-400 scale-150 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
          />
          <button 
            onClick={() => profile.education && setStep(3)}
            disabled={!profile.education}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 3 ? 'bg-purple-500 scale-150 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/10 hover:bg-white/20'}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
