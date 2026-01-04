
import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center">
        <div className="inline-block w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/40 mb-6 mx-auto">S</div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">About SmartTask AI</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto font-medium">
          A cutting-edge productivity platform bridging the gap between local simplicity and cloud intelligence.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="glass p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI-Powered Workflow</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Powered by <strong className="text-indigo-600 dark:text-indigo-400">Gemini 3 Flash</strong>, the Real Backend mode automatically analyzes your tasks to determine priority and categorize them instantly. No more manual tagging—just type and go.
          </p>
        </section>

        <section className="glass p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Dual-Backend System</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Switch between <strong className="text-slate-700 dark:text-slate-200">Mock Mode</strong> for lighting-fast local storage and <strong className="text-slate-700 dark:text-slate-200">Real Mode</strong> for cloud-enhanced intelligence. Your data, your choice of speed or smarts.
          </p>
        </section>
      </div>

      <section className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/50 dark:border-slate-800">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">Core Principles</h3>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="text-indigo-600 dark:text-indigo-400 font-black text-4xl">01</div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Simplicity</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Clean, focused interface designed to stay out of your way.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-indigo-600 dark:text-indigo-400 font-black text-4xl">02</div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Privacy</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your data stays local unless you explicitly use the AI cloud mode.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-indigo-600 dark:text-indigo-400 font-black text-4xl">03</div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Intelligence</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Leveraging the world's most capable models to reduce cognitive load.</p>
          </div>
        </div>
      </section>

      <footer className="text-center pt-8">
        <button 
          onClick={onBack}
          className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          Return to Workspace
        </button>
      </footer>
    </div>
  );
};

export default About;
