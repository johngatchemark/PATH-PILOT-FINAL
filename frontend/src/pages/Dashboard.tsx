import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Map, 
  Search, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Briefcase, 
  Target,
  Loader2,
  Clock,
  Heart,
  BookOpen,
  History
} from 'lucide-react';
import Logo from '../components/Logo';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }: any) => {
      if (session?.user?.id) {
        try {
          const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
          
          const userRes = await axios.get(`${apiUrl}/api/users/${session.user.id}`);
          const profile = userRes.data;
          setUserProfile(profile);

          // If user already has saved trajectories, use them. 
          // Otherwise, trigger the analysis.
          if (profile.trajectories && profile.trajectories.length > 0) {
            setRecommendations(profile.trajectories);
          } else {
            const recRes = await axios.post(`${apiUrl}/api/recommendations/match`, { userId: session.user.id });
            setRecommendations(recRes.data.matches || []);
          }
        } catch (error) {
          console.error("Error fetching dashboard data", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Fallbacks if data is missing
  const userName = userProfile?.full_name || 'Explorer';
  const userMajor = userProfile?.education || 'Unknown Major';
  const userAvatar = userProfile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer';
  const userSkills = userProfile?.skills?.map((s: any) => s.careerSkill?.skill_name || s.skill_name) || [];
  const userInterests = userProfile?.interests?.map((i: any) => i.careerInterest?.interest_name || i.interest_name) || [];
  const userExperienceYears = userProfile?.experiences?.reduce((sum: number, exp: any) => sum + (exp.duration / 12), 0) || 0;
  const userExperiences = userProfile?.experiences || [];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-['Poppins']">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/5 border-r border-white/10 p-6 hidden lg:flex flex-col z-20">
        <Logo size="sm" className="mb-12" />
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600/10 text-purple-400 rounded-xl font-bold transition-all border border-purple-500/20">
            <Target className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/analyzing')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all"
          >
            <Search className="w-5 h-5" /> Analyze Career
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <Map className="w-5 h-5" /> Saved Paths
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="hidden lg:block" />
          
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{userMajor}</p>
            </div>
            <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20 bg-white/5 object-cover" />
          </button>
        </header>

        <div className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Welcome Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-transparent p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Ready to chart your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">future</span>, {userName.split(' ')[0]}?
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Your profile is 85% complete. Analyzing new trajectories based on your recent skill updates.
              </p>
              <button 
                onClick={() => navigate('/analyzing')}
                className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-white/10"
              >
                Scan My Potential <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 h-full flex flex-col">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Profile Summary</h3>
                <div className="space-y-6 flex-1">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Education</p>
                      <p className="text-sm font-bold text-white leading-tight">{userMajor}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Total Experience</p>
                      <p className="text-sm font-bold text-white leading-tight">{userExperienceYears.toFixed(1)} Years</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-blue-400" />
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Work History</p>
                    </div>
                    <div className="space-y-3">
                      {userExperiences.length > 0 ? userExperiences.map((exp: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-xs font-bold text-slate-200">{exp.title}</p>
                          <p className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">{(exp.duration / 12).toFixed(1)}y</p>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-500 italic">No work history recorded</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Technical Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {userSkills.length > 0 ? userSkills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300 border border-white/10 uppercase tracking-wider">
                          {skill}
                        </span>
                      )) : (
                        <span className="text-xs text-slate-500 italic">No skills added yet</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Interests</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userInterests.length > 0 ? userInterests.map((interest: string) => (
                        <span key={interest} className="px-3 py-1 bg-pink-500/10 rounded-lg text-[10px] font-bold text-pink-400 border border-pink-500/20 uppercase tracking-wider">
                          {interest}
                        </span>
                      )) : (
                        <span className="text-xs text-slate-500 italic">No interests added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Top Trajectories</h3>
                  <p className="text-sm text-slate-500">AI-powered matches for you</p>
                </div>
                {recommendations.length > 0 && (
                  <button 
                    onClick={() => navigate('/career-paths')}
                    className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all cursor-pointer"
                    onClick={() => navigate('/career-paths')}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">{rec.careerTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${Math.min(rec.score * 10, 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-white/50">{rec.score} Pts Match</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                )) : (
                  <div className="p-10 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
                      <Target className="w-10 h-10 text-purple-400 opacity-80" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-3 tracking-tight">No Trajectories Found</h4>
                    <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
                      Your profile data didn't produce immediate matches. Run our AI analysis to discover the optimal career path tailored specifically for you.
                    </p>
                    <button 
                      onClick={() => navigate('/analyzing')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20 uppercase tracking-widest text-xs flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" /> Find out your trajectory!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
