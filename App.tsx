
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, BackendType, Todo, ITodoService } from './types';
import { MockTodoService } from './services/mockTodoService';
import { GeminiTodoService } from './services/geminiTodoService';
import { db } from './services/db';
import { userService } from './services/userService';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import BackendSelector from './components/BackendSelector';
import About from './components/About';

type View = 'tasks' | 'about';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('tasks');
  const [backendType, setBackendType] = useState<BackendType>(BackendType.MOCK);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('smarttask_theme') === 'dark' || 
           (!('smarttask_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Database Initialization
  useEffect(() => {
    const initApp = async () => {
      try {
        await db.init();
        await userService.seedDemoUser();
        
        const storedUser = localStorage.getItem('smarttask_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("DB Initialization failed", e);
      } finally {
        setIsInitializing(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smarttask_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smarttask_theme', 'light');
    }
  }, [isDarkMode]);

  const todoService = useMemo<ITodoService>(() => {
    return backendType === BackendType.MOCK 
      ? new MockTodoService() 
      : new GeminiTodoService();
  }, [backendType]);

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await todoService.getTodos(user.id);
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setIsLoading(false);
    }
  }, [todoService, user]);

  useEffect(() => {
    if (user && view === 'tasks') {
      fetchTodos();
    }
  }, [user, fetchTodos, backendType, view]);

  const handleLogin = (u: User) => {
    localStorage.setItem('smarttask_user', JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('smarttask_user');
    setUser(null);
    setTodos([]);
    setView('tasks');
  };

  const handleAddTodo = async (text: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const newTodo = await todoService.addTodo(user.id, text);
      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      alert("Error adding task. Check AI settings or connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updated = await todoService.toggleTodo(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) { console.error(e); }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) { console.error(e); }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-lg mb-4"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Booting SmartDB</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-500">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass shadow-2xl px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('tasks')}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-500/40 group-hover:scale-110 transition-transform">S</div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">SmartTask</h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
               <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">DB Persistent</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-6">
             <button 
               onClick={() => setView(view === 'tasks' ? 'about' : 'tasks')}
               className={`text-sm font-bold transition-colors ${view === 'about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
             >
               {view === 'tasks' ? 'About' : 'Back to Tasks'}
             </button>
             <BackendSelector current={backendType} onChange={setBackendType} />
          </div>
          
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center border border-white/20 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate max-w-[100px]">{user.email}</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all" title="Logout">
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        {view === 'tasks' ? (
          <>
            <div className="lg:hidden mb-10 flex flex-col items-center gap-4">
              <button 
                onClick={() => setView('about')}
                className="text-sm font-bold text-slate-500 hover:text-indigo-600"
              >
                Learn About SmartTask
              </button>
              <BackendSelector current={backendType} onChange={setBackendType} />
            </div>

            <header className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Your Focus</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {backendType === BackendType.REAL 
                  ? "✨ AI-Enhanced Workspace. Database storage active." 
                  : "🛠 Local Workspace. High-performance IndexedDB mode."}
              </p>
            </header>

            <TodoList 
              todos={todos} 
              onAdd={handleAddTodo} 
              onToggle={handleToggleTodo} 
              onDelete={handleDeleteTodo}
              isLoading={isLoading}
              backendType={backendType}
            />
          </>
        ) : (
          <About onBack={() => setView('tasks')} />
        )}
      </main>
    </div>
  );
};

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default App;
