import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthBarProps {
  password: string;
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const result = useMemo(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  if (!result || !password) {
    return (
      <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden transition-all" />
    );
  }

  const score = result.score; // 0, 1, 2, 3, 4
  const feedback = result.feedback;

  const getStrengthData = () => {
    switch (score) {
      case 0:
      case 1:
        return { color: 'bg-red-500', textColor: 'text-red-400', badgeBg: 'bg-red-500/10', label: 'Weak', width: '25%' };
      case 2:
        return { color: 'bg-yellow-500', textColor: 'text-yellow-400', badgeBg: 'bg-yellow-500/10', label: 'Fair', width: '50%' };
      case 3:
        return { color: 'bg-blue-500', textColor: 'text-blue-400', badgeBg: 'bg-blue-500/10', label: 'Good', width: '75%' };
      case 4:
        return { color: 'bg-green-500', textColor: 'text-emerald-400', badgeBg: 'bg-emerald-500/10', label: 'Strong', width: '100%' };
      default:
        return { color: 'bg-slate-700', textColor: 'text-slate-400', badgeBg: 'bg-white/5', label: '', width: '0%' };
    }
  };

  const { color, textColor, badgeBg, label, width } = getStrengthData();

  return (
    <div className="absolute lg:left-full lg:ml-4 lg:top-0 left-0 top-full mt-4 w-full lg:w-64 bg-[#0F0F12]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 lg:slide-in-from-left-4 slide-in-from-top-4 duration-300">
      <div className="hidden lg:block absolute right-full top-6 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white/10" />
      <div className="lg:hidden absolute bottom-full left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white/10" />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Security Analysis</span>
          <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-lg ${badgeBg} ${textColor} border border-white/5`}>
            {label}
          </span>
        </div>
        
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]`} 
            style={{ width }}
          />
        </div>

        {(feedback.warning || feedback.suggestions.length > 0) && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            {feedback.warning && (
              <div className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-[11px] text-red-300 font-medium leading-relaxed">
                  {feedback.warning}
                </p>
              </div>
            )}
            {feedback.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p key={idx} className="text-[11px] text-slate-400 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthBar;
