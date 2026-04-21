import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logo from '../components/Logo';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Camera, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  GraduationCap, 
  History,
  Filter,
  Compass
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [allInterests, setAllInterests] = useState<any[]>([]);
  const [allCareers, setAllCareers] = useState<any[]>([]);
  
  const [skillCategory, setSkillCategory] = useState('All');
  const [interestCategory, setInterestCategory] = useState('All');

  const [formData, setFormData] = useState({
    full_name: '',
    education: '',
    avatar_url: '',
    skills: [] as string[],
    interests: [] as string[],
    experiences: [] as { title: string, durationYears: number }[]
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    });

    const fetchMetadata = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/metadata`);
        setAllSkills(response.data.skills || []);
        setAllInterests(response.data.interests || []);
        setAllCareers(response.data.careers || []);
      } catch (err) {
        console.error('Failed to fetch metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  const skillCategories = ['All', ...Array.from(new Set(allSkills.map(s => s.category)))];
  const interestCategories = ['All', ...Array.from(new Set(allInterests.map(i => i.category)))];

  const fetchUserProfile = async (userId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/users/${userId}`);
      if (response.data) {
        setFormData({
          full_name: response.data.full_name || '',
          education: response.data.education || '',
          avatar_url: response.data.avatar_url || '',
          skills: response.data.skills?.map((s: any) => s.careerSkill?.skill_name || s.skill_name) || [],
          interests: response.data.interests?.map((i: any) => i.careerInterest?.interest_name || i.interest_name) || [],
          experiences: response.data.experiences?.map((exp: any) => ({
            title: exp.title,
            durationYears: exp.duration / 12
          })) || []
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!session?.user?.id) return;
      setUploadingAvatar(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('Profile Pictures').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('Profile Pictures').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (err: any) {
      console.error(err);
      setMessage({ text: 'Error uploading image.', type: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setSaving(true);
    setMessage(null);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const totalExp = formData.experiences.reduce((sum, exp) => sum + exp.durationYears, 0);
      await axios.put(`${apiUrl}/api/users/${session.user.id}`, { ...formData, experienceYears: totalExp });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      await axios.post(`${apiUrl}/api/recommendations/match`, { userId: session.user.id });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  const addExperience = () => setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { title: '', durationYears: 1 }] }));
  const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  const updateExperience = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newExps = [...prev.experiences];
      newExps[index] = { ...newExps[index], [field]: value };
      return { ...prev, experiences: newExps };
    });
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>;

  return (
    <div className="h-screen bg-[#0A0A0B] text-slate-200 flex flex-col pt-24 pb-8 px-4 sm:px-6 items-center relative overflow-hidden font-['Poppins']">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0A0B] to-[#0A0A0B] pointer-events-none" />
      
      <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center z-20">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <Logo size="sm" />
      </div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl z-10 shadow-2xl relative flex flex-col flex-1 min-h-0">
        
        {step === 1 && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="px-10 pt-10 pb-4 text-center shrink-0">
              <h2 className="text-3xl font-black text-white tracking-tight">Basic Profile</h2>
              <p className="text-slate-400 mt-1 text-sm">Update your public information and avatar.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
              <div className="flex flex-col items-center gap-8 mb-10">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-28 h-28 rounded-full bg-black/40 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-purple-500/50 shadow-2xl transition-all">
                    {formData.avatar_url ? <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-500 group-hover:text-purple-400" />}
                    {uploadingAvatar && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploadingAvatar} />
                </div>
                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                    <input type="text" className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all font-bold" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Education</label>
                    <select className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all font-bold appearance-none cursor-pointer" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})}>
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
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-6 font-black text-white bg-white/10 border border-white/10 rounded-[2rem] hover:bg-white/20 transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-xs">Next Step: Skills & Interests <Sparkles className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
            <div className="px-10 pt-10 pb-4 text-center shrink-0">
              <h2 className="text-3xl font-black text-white tracking-tight">Experience & Skills</h2>
              <p className="text-slate-400 mt-1 text-sm">Organize your expertise and drivers.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Compass className="w-4 h-4 text-blue-400" /> Skill Inventory</label>
                    <div className="flex items-center gap-2">
                      <Filter className="w-3 h-3 text-slate-500" />
                      <select className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-widest border-none outline-none cursor-pointer" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
                        {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-5 bg-black/40 rounded-[2rem] border border-white/5">
                    {formData.skills.map(s => (
                      <div key={s} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black">{s} <button onClick={() => toggleSkill(s)}><X className="w-3 h-3" /></button></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.filter(s => !formData.skills.includes(s.skill_name) && (skillCategory === 'All' || s.category === skillCategory)).slice(0, 50).map(s => (
                      <button key={s.skill_name} onClick={() => toggleSkill(s.skill_name)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-slate-400">+ {s.skill_name}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Career Drivers</label>
                    <div className="flex items-center gap-2">
                      <Filter className="w-3 h-3 text-slate-500" />
                      <select className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-widest border-none outline-none cursor-pointer" value={interestCategory} onChange={(e) => setInterestCategory(e.target.value)}>
                        {interestCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-5 bg-black/40 rounded-[2rem] border border-white/5">
                    {formData.interests.map(i => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-[10px] font-black">{i} <button onClick={() => toggleInterest(i)}><X className="w-3 h-3" /></button></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allInterests.filter(i => !formData.interests.includes(i.interest_name) && (interestCategory === 'All' || i.category === interestCategory)).slice(0, 50).map(i => (
                      <button key={i.interest_name} onClick={() => toggleInterest(i.interest_name)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-bold text-slate-400">+ {i.interest_name}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-12">
                <button onClick={() => setStep(1)} className="flex-1 py-6 font-black text-slate-500 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 text-xs uppercase tracking-widest">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-6 font-black text-white bg-white/10 border border-white/10 rounded-[2rem] hover:bg-white/20 flex justify-center items-center gap-3 uppercase tracking-widest text-xs">Work History <History className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
            <div className="px-10 pt-10 pb-4 text-center shrink-0">
              <h2 className="text-3xl font-black text-white tracking-tight">Work History</h2>
              <p className="text-slate-400 mt-1 text-sm">Manage your past professional roles.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
              {message && <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center border ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{message.text}</div>}
              <div className="space-y-6">
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="p-6 bg-black/40 border border-white/10 rounded-3xl relative group">
                    <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Role / Line of Work</label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500 font-bold appearance-none cursor-pointer" value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} required>
                          <option value="" disabled>Select a role...</option>
                          {Array.from(new Set(allCareers.map(c => c.category))).map(cat => (
                            <optgroup key={cat} label={cat} className="bg-[#0A0A0B] text-slate-500">
                              {allCareers.filter(c => c.category === cat).map(c => <option key={c.title} value={c.title} className="text-white">{c.title}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Duration: {exp.durationYears}y</label>
                        <input type="range" min="0.5" max="20" step="0.5" className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" value={exp.durationYears} onChange={(e) => updateExperience(index, 'durationYears', parseFloat(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-white/10 rounded-[1.5rem] text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"><Plus className="w-4 h-4" /> Add Experience</button>
              </div>
              <div className="flex gap-4 mt-12">
                <button onClick={() => setStep(2)} className="flex-1 py-6 font-black text-slate-500 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 text-xs uppercase tracking-widest">Back</button>
                <button onClick={handleSave} disabled={saving} className="flex-[2] py-6 font-black text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2rem] hover:brightness-110 flex justify-center items-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20">{saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}</button>
              </div>
            </div>
          </div>
        )}

        <div className="shrink-0 p-6 flex justify-center gap-3 border-t border-white/5">
          {[1, 2, 3].map(s => <button key={s} onClick={() => setStep(s)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === s ? 'bg-purple-500 scale-150 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} />)}
        </div>
      </div>
    </div>
  );
};

export default Settings;
