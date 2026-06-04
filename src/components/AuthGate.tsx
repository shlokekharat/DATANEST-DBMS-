import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, UserPlus, Mail, Lock, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';

interface AuthGateProps {
  title?: string;
  description?: string;
}

export default function AuthGate({ 
  title = "Unlock Academic DBMS Workspace", 
  description = "Access to the student database records, relational charts, write-ahead logs, and database schema mutations requires system authentication." 
}: AuthGateProps) {
  const { loginWithGoogle, registerWithEmail, loginWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError(null);
    setSuccess(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (activeTab === 'register' && !displayName) {
      setError("Please provide a display name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (activeTab === 'login') {
        await loginWithEmail(email, password);
        setSuccess("Logged in successfully!");
      } else {
        await registerWithEmail(email, password, displayName);
        setSuccess("Registration completed successfully!");
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "An unexpected authentication error occurred.";
      if (err.code === "auth/operation-not-allowed") {
        errorMsg = "Email/password authentication is not enabled in this Firebase project's console under Build > Authentication > Sign-in method. Please use Google Login instead!";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMsg = "Invalid email or password combination.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "This email address is already registered.";
      }
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    try {
      setSubmitting(true);
      await loginWithGoogle();
      setSuccess("Authenticated successfully with Google!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate with Google.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-gray-150 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-200">
      {/* Decorative colored bar */}
      <div className="h-2 bg-gradient-to-r from-blue-650 via-indigo-500 to-cyan-500" />
      
      <div className="p-8">
        {/* Header Icon Block */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100/50 dark:border-blue-900/40">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-950 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans max-w-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-50 dark:bg-slate-950 rounded-xl mb-6 border border-gray-200/50 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); resetFields(); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login Workspace</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('register'); resetFields(); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-150 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-xl text-xs flex items-start space-x-2.5 mb-5 font-sans leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-start space-x-2.5 mb-5 font-sans"
            >
              <Sparkles className="w-4 h-4 mt-0.5 shrink-0 animate-spin" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Details */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activeTab === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 pb-2">
                  <label className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-450 dark:text-gray-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Shloke Kharat"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-sm transition outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-450 dark:text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-sm transition outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-450 dark:text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-sm transition outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg active:scale-98 transition duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <span>{activeTab === 'login' ? 'Authenticate & Enter' : 'Register Academic Credentials'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">or continue with</span>
          <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
        </div>

        {/* Google SSO Button - fully configured out of direct layout flow */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={submitting}
          className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2.5 active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.77-.07-1.54-.19-2.29H12v4.35h6.6c-.28 1.51-1.14 2.78-2.4 3.66v3.04h3.86c2.27-2.1 3.58-5.18 3.58-8.76z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3.04c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.32v3.14C3.21 21.09 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.2c-.25-.72-.39-1.5-.39-2.2s.14-1.48.39-2.2V6.66H1.32C.48 8.34 0 10.11 0 12s.48 3.66 1.32 5.34l3.92-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.21 2.91 1.32 6.66l3.92 3.14c.95-2.88 3.61-5.05 6.76-5.05z"
            />
          </svg>
          <span>Sign In using Google Login</span>
        </button>

        {activeTab === 'register' && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-5 font-mono leading-normal">
            Note: Standard Firebase sandboxes limit mail delivery but fully support Google accounts out-of-the-box.
          </p>
        )}
      </div>
    </div>
  );
}
