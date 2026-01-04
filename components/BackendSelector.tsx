
import React from 'react';
import { BackendType } from '../types';

interface BackendSelectorProps {
  current: BackendType;
  onChange: (type: BackendType) => void;
}

const BackendSelector: React.FC<BackendSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl transition-colors">
      <button
        onClick={() => onChange(BackendType.MOCK)}
        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
          current === BackendType.MOCK 
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        Mock
      </button>
      <button
        onClick={() => onChange(BackendType.REAL)}
        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
          current === BackendType.REAL 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        Real (AI)
      </button>
    </div>
  );
};

export default BackendSelector;
