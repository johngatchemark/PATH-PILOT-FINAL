import React, { useState, useRef } from 'react';
import { User, Calendar, MapPin, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfileFormProps {
  userId: string;
  onComplete: (data: any) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ userId, onComplete }) => {
  const [profile, setProfile] = useState({
    full_name: '',
    birthday: '',
    address: '',
    avatar_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Profile Pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Profile Pictures')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.full_name || !profile.birthday || !profile.address) {
      setError('Please fill in all required fields');
      return;
    }
    onComplete(profile);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-6">
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50 group-hover:bg-blue-500/5">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full border-2 border-[#0A0A0B] shadow-lg">
            <CheckCircle2 className={`w-3 h-3 text-white ${profile.avatar_url ? 'opacity-100' : 'opacity-50'}`} />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Share Your Details</h3>
          <p className="text-slate-400 text-sm mt-1">Let's personalize your PathPilot experience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
            <User className="w-3 h-3" /> Full Name
          </label>
          <input 
            required
            type="text" 
            placeholder="John Doe"
            className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            value={profile.full_name}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <Calendar className="w-3 h-3" /> Birthday
            </label>
            <input 
              required
              type="date" 
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
              value={profile.birthday}
              onChange={(e) => setProfile({...profile, birthday: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <input 
              required
              type="text" 
              placeholder="City, Country"
              className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <button 
          type="submit"
          className="w-full py-4 mt-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 group active:scale-[0.98]"
        >
          Proceed to Experience Detail
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
