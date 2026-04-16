import React, { useEffect, useState } from 'react';
import { Compass, AlertTriangle, ShieldCheck, Mail, Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import axios from 'axios';

import Logo from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/onboarding');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      navigate('/onboarding');
      return;
    }

    setLoading(true);
    setError(null);

    const { email, password, confirmPassword } = formData;

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        // 1. Check if user already exists in our database
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        try {
          const { data: checkData } = await axios.get(`${apiUrl}/api/users/check/${email}`);
          if (checkData.exists) {
            throw new Error("An account with this email already exists. Please sign in instead.");
          }
        } catch (err: any) {
          // If the backend check fails (e.g. backend down), we can still try Supabase 
          // or handle it. For now, we continue if it's just a 404 or similar, 
          // but throw if it's our custom error.
          if (err.message && err.message.includes("account with this email already exists")) {
            throw err;
          }
          console.error("Backend check failed", err);
        }
        
        // 2. Proceed with Supabase signUp
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/onboarding'
          }
        });

        if (signUpError) throw signUpError;
        
        setError("Account created! Please check your email for confirmation.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Poppins']">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl z-10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            {isSignUp 
              ? 'Join PathPilot and start charting your professional future.' 
              : 'Sign in securely to access your career dashboard.'}
          </p>
        </div>

        
        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
              error.includes("check your email") 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="email" 
                required 
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              {isSignUp && isPasswordFocused && <PasswordStrengthBar password={formData.password} />}
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Launch Journey' : 'Secure Sign In'} 
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            {isSignUp ? (
              <>Already registered? <span className="text-purple-400 font-bold flex items-center gap-1">Log In <LogIn className="w-3 h-3" /></span></>
            ) : (
              <>New to PathPilot? <span className="text-blue-400 font-bold flex items-center gap-1">Create Account <UserPlus className="w-3 h-3" /></span></>
            )}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors tracking-widest uppercase font-bold"
          >
            Back to Intro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

