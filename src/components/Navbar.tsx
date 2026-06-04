import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Sun, Moon, Sparkles, LogIn, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B1020]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6">
        
        {/* Main upper line: logo & system controls */}
        <div className="flex items-center justify-between h-14">
          
          {/* Logo brand */}
          <Logo 
            onClick={() => handleLinkClick('home')}
            size="md"
          />

          {/* Right end accessories */}
          <div className="flex items-center space-x-4">
            
            {/* Elegant Segmented Theme Switcher */}
            <div id="theme-navigation-segmented" className="relative flex items-center bg-[#151C33]/90 border border-white/15 p-1 rounded-2xl shadow-inner select-none shrink-0 h-9">
              {/* Sliding glass bubble background */}
              {!isDark ? (
                <motion.div
                  layoutId="active-theme-bg"
                  className="absolute inset-y-1 left-1 bg-white/15 border border-white/20 rounded-xl shadow-sm"
                  style={{ right: '50%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              ) : (
                <motion.div
                  layoutId="active-theme-bg"
                  className="absolute inset-y-1 right-1 bg-slate-800 border border-slate-705/80 rounded-xl shadow-sm"
                  style={{ left: '50%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <button
                id="theme-selector-light-btn"
                onClick={() => setIsDark(false)}
                className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  !isDark 
                    ? 'text-[#4F8CFF]' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
                title="Switch to Light Theme"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xs:inline">Light</span>
              </button>
              <button
                id="theme-selector-dark-btn"
                onClick={() => setIsDark(true)}
                className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  isDark 
                    ? 'text-amber-400' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
                title="Switch to Dark Theme"
              >
                <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400 animate-pulse' : 'text-gray-405'}`} />
                <span className="hidden xs:inline">Dark</span>
              </button>
            </div>

            {/* Dynamic User Profile / Workspace State */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#151C33]/85 border border-white/15 text-[#F8FAFC] rounded-xl text-xs font-semibold shadow-sm">
                  {user.photoURL || localPhoto ? (
                    <img
                      src={user.photoURL || localPhoto || ''}
                      alt="Profile"
                      className="w-5 h-5 rounded-full object-cover border border-[#4F8CFF] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  )}
                  <span className="max-w-[124px] truncate text-[#F8FAFC]">{user.displayName || user.email}</span>
                </div>
                <button
                  id="navbar-logout-btn"
                  onClick={() => logout()}
                  className="p-2 text-red-400 hover:text-red-355 hover:bg-red-950/20 rounded-xl transition cursor-pointer"
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
                className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#151C33] text-[#4F8CFF] border border-white/15 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-97 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Register Hub</span>
              </button>
            )}

            {/* Mobile menu triggers */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:bg-[#151C33] transition cursor-pointer"
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
                    ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/20 neon-glow-primary' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
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
            className="lg:hidden bg-[#0B1020] border-t border-white/10 overflow-hidden shadow-inner flex flex-col"
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
                        ? 'bg-[#151C33] text-[#4F8CFF] border-l-4 border-[#4F8CFF]' 
                        : 'text-[#94A3B8] hover:bg-[#151C33]'
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
                  className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/20 text-left flex items-center space-x-2 transition cursor-pointer"
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
