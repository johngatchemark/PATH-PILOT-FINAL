import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Map, 
  Search, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Briefcase, 
  BookOpen, 
  Target
} from 'lucide-react';
import Logo from '../components/Logo';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded mock data
  const user = {
    name: "John Mark Gatche",
    email: "johnmark@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnMark", // Stylish avatar
    major: "BS Computer Science",
    institution: "PathPilot Institute",
    skills: ["React", "TypeScript", "Python", "Data Analysis", "UI/UX"]
  };

  const recommendations = [
    { title: "Full-Stack Developer", score: 95, icon: <Briefcase className="w-5 h-5" />, color: "purple" },
    { title: "Data Scientist", score: 88, icon: <TrendingUp className="w-5 h-5" />, color: "blue" },
    { title: "UI/UX Designer", score: 82, icon: <Map className="w-5 h-5" />, color: "emerald" }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-10 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="hidden lg:block" />
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.major}</p>
            </div>
            <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20 bg-white/5" />
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Welcome Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-transparent p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Ready to chart your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">future</span>, {user.name.split(' ')[0]}?
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
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Profile Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Education</p>
                      <p className="text-sm font-bold text-white leading-tight">{user.major}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {user.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300 border border-white/10 uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
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
                <button 
                  onClick={() => navigate('/career-paths')}
                  className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all cursor-pointer"
                    onClick={() => navigate('/career-paths')}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${rec.color}-500/20 text-${rec.color}-400 group-hover:scale-110 transition-transform shadow-lg shadow-${rec.color}-500/10`}>
                        {rec.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">{rec.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${rec.score}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-white/50">{rec.score}% Match</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
