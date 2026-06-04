import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Sun, Moon, Sparkles, LogIn, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ currentSection, onNavigate }: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default to Elegant Dark out-of-the-box
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, localPhoto } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about-dbms', label: 'About DBMS' },
    { id: 'learning-hub', label: 'Learning Hub' },
    { id: 'sql-playground', label: 'SQL Playground' },
    { id: 'er-diagram', label: 'ER Diagram' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'student-database', label: 'Student Database' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity-log', label: 'Activity Log' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-gray-150 dark:border-slate-850">
      <div className="container mx-auto px-6">
        
        {/* Main upper line: logo & system controls */}
        <div className="flex items-center justify-between h-14">
          
          {/* Logo brand */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/10 group-hover:scale-105 duration-200">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-tight text-gray-950 dark:text-white uppercase">
                DATANEST
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold ml-2 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                Academic Pro v2.0
              </span>
            </div>
          </div>

          {/* Right end accessories */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle (Light/Dark mode) */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
              title="Toggle theme (Light / Dark)"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Dynamic User Profile / Workspace State */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold shadow-sm">
                  {user.photoURL || localPhoto ? (
                    <img
                      src={user.photoURL || localPhoto || ''}
                      alt="Profile"
                      className="w-5 h-5 rounded-full object-cover border border-blue-500 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                </div>
                <button
                  id="navbar-logout-btn"
                  onClick={() => logout()}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer"
                  title="Log out from session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Quick dashboard shortcut */
              <button
                id="header-nav-dashboard-shortcut"
                onClick={() => handleLinkClick('student-database')}
                className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 text-blue-600 dark:text-blue-450 border border-blue-100 dark:border-blue-900/60 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-97 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Hub</span>
              </button>
            )}

            {/* Mobile menu triggers */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-550 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Desktop Sticky scrollable tab-row sub-navigation bar */}
        <nav className="hidden lg:flex items-center space-x-1 py-1 overflow-x-auto no-scrollbar scroll-smooth">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-105/90 dark:hover:bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Mobile Drawer Slide-out container */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-950 border-t border-gray-150 dark:border-slate-850 overflow-hidden shadow-inner flex flex-col"
          >
            <div className="p-4 space-y-1.5 text-center flex flex-col">
              {menuItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-mobile-${item.id}`}
                    onClick={() => handleLinkClick(item.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-450 border-l-4 border-blue-600' 
                        : 'text-gray-650 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              {user && (
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left flex items-center space-x-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user.displayName || user.email})</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
