import React, { useState } from 'react';
import { Shield, User, Leaf, ArrowRight, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginScreen = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
    setLoading(role);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in user:", result.user.displayName);
      onLogin(role, result.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full" style={{ 
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      <div className="ambient-glow-blue top-[0%] left-[-10%] opacity-70"></div>
      <div className="ambient-glow-purple bottom-[-10%] right-[-10%] opacity-70"></div>
      
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-gradient-to-tr from-brand-green to-[#34d399] p-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] mb-6">
            <Leaf size={40} className="text-white fill-white/20" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">UrbanClean</h1>
          <p className="text-gray-400">AI-Powered Smart Resource Allocation</p>
        </div>

        <div className="glass-panel p-8 flex flex-col gap-4">
          <h2 className="text-white font-medium text-sm text-center mb-4 uppercase tracking-widest opacity-80">Select your portal</h2>
          
          <div className="btn-neon-container group w-full" onClick={() => handleLogin('admin')}>
            <button className="btn-neon-content w-full !justify-start !p-4 !rounded-lg" disabled={loading}>
              <div className="w-12 h-12 bg-dark-900 border border-white/10 text-brand-blue rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                {loading === 'admin' ? <Loader2 size={24} className="animate-spin" /> : <Shield size={24} />}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-lg">City Admin</h3>
                <p className="text-xs text-gray-400 font-normal">Access dashboard & analytics</p>
              </div>
              <ArrowRight size={20} className="text-gray-500 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="btn-neon-container group w-full mt-2" onClick={() => handleLogin('user')}>
            <button className="btn-neon-content w-full !justify-start !p-4 !rounded-lg" disabled={loading}>
              <div className="w-12 h-12 bg-dark-900 border border-white/10 text-brand-green rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                {loading === 'user' ? <Loader2 size={24} className="animate-spin" /> : <User size={24} />}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-lg">Citizen</h3>
                <p className="text-xs text-gray-400 font-normal">Report issues & track status</p>
              </div>
              <ArrowRight size={20} className="text-gray-500 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
