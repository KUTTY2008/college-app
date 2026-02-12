import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { User, Mail, Hash, Layers, Shield } from 'lucide-react';

export const Profile: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">My Profile</h2>
        <p className="text-slate-400">View your personal information</p>
      </div>

      <GlassCard className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <User className="w-64 h-64 text-indigo-500" />
        </div>
        
        <div className="relative z-10 flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{userProfile.name}</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize mt-2">
              {userProfile.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <p className="text-lg text-slate-200">{userProfile.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Role
            </label>
            <p className="text-lg text-slate-200 capitalize">{userProfile.role}</p>
          </div>

          {userProfile.role === 'student' && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Roll Number
                </label>
                <p className="text-lg text-slate-200">{userProfile.rollNumber}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Batch
                </label>
                <p className="text-lg text-slate-200">{userProfile.batch}</p>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
