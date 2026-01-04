
import React, { useState } from 'react';
import { Todo, BackendType, Priority } from '../types';

interface TodoListProps {
  todos: Todo[];
  onAdd: (text: string) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  backendType: BackendType;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAdd, onToggle, onDelete, isLoading, backendType }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim() || isLoading) return;
    
    const text = newTodoText;
    setNewTodoText('');
    await onAdd(text);
  };

  const priorityStyles: Record<Priority, string> = {
    low: 'bg-green-100/50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50',
    medium: 'bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50',
    high: 'bg-red-100/50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 transition-colors">
        <form onSubmit={handleAddSubmit} className="flex gap-4">
          <input 
            type="text" 
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder={backendType === BackendType.REAL ? "Describe your task... AI will handle details" : "What needs to be done?"}
            className="flex-1 bg-transparent border-b-2 border-slate-200 dark:border-slate-800 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !newTodoText.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {backendType === BackendType.REAL ? 'Thinking...' : 'Saving...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        {todos.length === 0 && !isLoading ? (
          <div className="text-center py-24 bg-white/30 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
               </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Your task list is empty.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Ready for high-productivity?</p>
          </div>
        ) : (
          todos.sort((a, b) => b.createdAt - a.createdAt).map(todo => (
            <div 
              key={todo.id}
              className={`group flex items-center gap-4 glass p-4 rounded-2xl border transition-all hover:shadow-lg ${todo.completed ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'}`}
            >
              <button 
                onClick={() => onToggle(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  todo.completed 
                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/20' 
                    : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'
                }`}
              >
                {todo.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border transition-colors ${priorityStyles[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full transition-colors">
                    {todo.category}
                  </span>
                </div>
                <h3 className={`text-slate-800 dark:text-slate-200 font-semibold truncate transition-all ${todo.completed ? 'line-through text-slate-400 dark:text-slate-600' : ''}`}>
                  {todo.text}
                </h3>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onDelete(todo.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title="Delete task"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
