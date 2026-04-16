import React, { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { Cpu, Radio, Shield, Zap } from 'lucide-react';

const Analyzing: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Harvesting skill matrix...",
    "Correlating academic performance...",
    "Scanning market opportunities...",
    "Simulating professional trajectories...",
    "Finalizing career matches..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/career-paths'), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    const msgTimer = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Poppins']">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated Radar/Scanner UI */}
        <div className="relative mb-12 flex justify-center">
          <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping" />
            <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-pulse" />
            
            {/* Scanning line */}
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-[spin_2s_linear_infinite]" />

            {/* Core Logo */}
            <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
               <Logo size="md" showText={false} />
            </div>


            {/* Orbiting Icons */}
            <div className="absolute top-0 -left-4 w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center animate-bounce duration-3000">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute bottom-0 -right-4 w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center animate-bounce duration-[2.5s]">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="absolute top-1/2 -right-12 w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Analyzing Trajectories</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-widest bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
            <Radio className="w-4 h-4 animate-pulse" /> {messages[messageIndex]}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-4xl font-black text-white/20 font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Analyzing;
