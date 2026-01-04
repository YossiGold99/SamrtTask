
import React, { useState } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await userService.login(email, password);
        onLogin(user);
      } else {
        if (!name.trim()) throw new Error('Full name is required for registration');
        const user = await userService.register(name, email, password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full glass p-1 rounded-[3rem] shadow-2xl transition-all border border-white/50 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-900/40 rounded-[2.8rem] p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white text-3xl font-black rounded-2xl mb-6 shadow-2xl shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
              S
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              SmartTask AI
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Manage tasks with intelligence
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${
                isLogin 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${
                !isLogin 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/30 text-center animate-bounce">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-700 transform transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/30 mt-4 uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {isLogin ? 'Sign In Now' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400 dark:text-slate-600 font-bold">
               {isLogin 
                 ? "No account? Switch to Register above" 
                 : "Already registered? Switch to Sign In above"}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
