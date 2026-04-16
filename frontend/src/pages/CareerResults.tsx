import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Layout, 
  ChevronRight,
  Bookmark
} from 'lucide-react';
import Logo from '../components/Logo';

const CareerResults: React.FC = () => {
  const navigate = useNavigate();

  const results = [
    {
      id: "1",
      title: "Full-Stack Developer",
      level: "Junior - Mid",
      score: 95,
      icon: <Briefcase className="w-6 h-6" />,
      color: "purple",
      reason: "Your strong foundation in React and Node.js perfectly aligns with current industry demands. Your Python skills add a competitive edge for backend optimization.",
      salary: "$85k - $120k",
      marketDemand: "Critical"
    },
    {
      id: "2",
      title: "Data Scientist",
      level: "Entry Level",
      score: 88,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "blue",
      reason: "Your background in Data Analysis and Python makes you an ideal candidate for data-driven roles. Focus on strengthening Machine Learning concepts.",
      salary: "$95k - $130k",
      marketDemand: "High"
    },
    {
      id: "3",
      title: "UI/UX Designer",
      level: "Junior",
      score: 82,
      icon: <Layout className="w-6 h-6" />,
      color: "emerald",
      reason: "Your combined technical knowledge and UI/UX skills allow you to bridge the gap between design and development effortlessly.",
      salary: "$75k - $110k",
      marketDemand: "Moderate"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-['Poppins']">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
             <span className="hidden sm:inline text-xs font-black text-slate-400 uppercase tracking-widest">New Scan Available</span>
             <button 
               onClick={() => navigate('/analyzing')}
               className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
             >
               <Sparkles className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4" /> Analysis Complete
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Trajections</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            We've synthesized 1,240+ data points from your profile against current market trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {results.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Icon & Score */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-${item.color}-500/20 text-${item.color}-400 shadow-2xl shadow-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Match Score</p>
                    <p className="text-2xl font-black text-white">{item.score}%</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight">{item.title}</h3>
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-400 border border-white/10 uppercase tracking-widest">
                          {item.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {item.salary}
                        </span>
                        <span className="text-xs text-blue-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                          Demand: {item.marketDemand}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <a 
                        href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(item.title)}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm"
                      >
                        Explore Jobs <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500" />
                    <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-2">Why this fits you?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Progress Bar */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Skills Aligned</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Education Match</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                  View Path Map <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-12 text-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              Back to Terminal
            </button>
        </div>
      </main>
    </div>
  );
};

export default CareerResults;
