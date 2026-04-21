import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session) navigate('/dashboard');
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6" />
        <p className="font-mono text-sm tracking-widest uppercase text-purple-400">Initializing Trajectories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col justify-center items-center p-6 relative overflow-hidden font-['Poppins']">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl text-center space-y-12 z-10">
        <div className="flex justify-center mb-4 transition-transform hover:scale-105 duration-500">
          <Logo size="xl" />
        </div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-xs font-bold tracking-[0.2em] text-purple-300 uppercase shadow-[0_0_20px_-5px_rgba(147,51,234,0.4)]">
            <Sparkles className="w-4 h-4" /> AI-Powered Career Intelligence
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            NAVIGATE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400 italic">DESTINY.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The intelligent decision support system designed to match your unique skills and interests to the perfect career trajectory.
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center justify-center px-12 py-6 font-black text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 hover:shadow-[0_0_50px_-5px_rgba(147,51,234,0.6)] shadow-xl uppercase tracking-widest text-lg"
          >
            <span className="mr-3">Get Started</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          {!isSupabaseConfigured && (
            <p className="text-xs text-yellow-500/60 flex items-center gap-2 font-bold uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4" /> Preview Mode Enabled
            </p>
          )}
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] opacity-50">
        PathPilot v1.0 • Global Talent Mapping
      </div>
    </div>
  );
};

export default Home;
