import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Terminal, Shield, Award, ArrowRight, Play, Cpu, 
  Network, Activity, ShieldAlert, BadgeInfo, Zap, RefreshCw, HardDrive
} from 'lucide-react';

interface HomeProps {
  onNavigate: (sectionId: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // Mock live metrics state for premium count-up and wave effects
  const [recordsCount, setRecordsCount] = useState(12430);
  const [activeUsersCount, setActiveUsersCount] = useState(1015);
  const [dbHealth, setDbHealth] = useState(99.9);
  const [queryTime, setQueryTime] = useState(2.4);
  const [waveSeed, setWaveSeed] = useState(0);

  // Simulated live event feed state
  const [recentEvents, setRecentEvents] = useState([
    { time: '10:02 AM', text: 'Analytics Generated', type: 'analytics' },
    { time: '09:51 AM', text: 'Database Backup Completed', type: 'backup' },
    { time: '09:47 AM', text: 'Record Updated', type: 'update' },
    { time: '09:45 AM', text: 'Student Added', type: 'add' },
  ]);

  useEffect(() => {
    // Stat count increments
    const statsInterval = setInterval(() => {
      setRecordsCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      if (Math.random() > 0.7) {
        setActiveUsersCount(prev => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const next = prev + delta;
          return next >= 1024 ? 1024 : next <= 1010 ? 1010 : next;
        });
      }
      setWaveSeed(prev => prev + 1);
      // Small query time fluctuation
      setQueryTime(parseFloat((2.2 + Math.random() * 0.4).toFixed(2)));
    }, 4500);

    // Event addition loop
    const eventInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getSeconds() % 2 === 0 ? 'AM' : 'PM');
      
      const eventPool = [
        { text: 'Student Roll ID 108 Verified Safe', type: 'add' },
        { text: 'Index optimization executed', type: 'backup' },
        { text: 'RDBMS relational schema evaluated', type: 'analytics' },
        { text: 'Student Record Mutated', type: 'update' },
        { text: 'Query cache memory flushed', type: 'backup' },
      ];

      const chosen = eventPool[Math.floor(Math.random() * eventPool.length)];
      setRecentEvents(prev => [
        { time: timeStr, text: chosen.text, type: chosen.type },
        ...prev.slice(0, 3)
      ]);
    }, 7000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(eventInterval);
    };
  }, []);

  // Compute smooth coordinates for an animated mini line chart based on seed state
  const getLinePath = () => {
    const points = [
      { x: 10, y: 70 + Math.sin(waveSeed + 1) * 10 },
      { x: 80, y: 55 + Math.cos(waveSeed + 2) * 12 },
      { x: 150, y: 78 + Math.sin(waveSeed + 3) * 8 },
      { x: 220, y: 40 + Math.sin(waveSeed + 4) * 15 },
      { x: 290, y: 62 + Math.cos(waveSeed + 5) * 10 },
      { x: 360, y: 35 + Math.sin(waveSeed + 6) * 12 },
      { x: 440, y: 50 + Math.cos(waveSeed + 7) * 8 },
    ];
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  return (
    <section id="home" className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center relative overflow-hidden bg-[#0B1020]">
      {/* Decorative Floating Glass/Neon Orbs (Cyan, Blue, Purple drifting circles) */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-[#00D9FF]/10 rounded-full mix-blend-screen filter blur-3xl pointer-events-none animate-drift-one" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#4F8CFF]/10 rounded-full mix-blend-screen filter blur-3xl pointer-events-none animate-drift-two" />
      <div className="absolute top-1/3 right-1/2 w-72 h-72 bg-[#6C63FF]/10 rounded-full mix-blend-screen filter blur-3xl pointer-events-none animate-drift-three" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Brand Value Proposition */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          
          {/* Badge Cluster (Including the Version Badge) */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-[#151C33] text-[#00D9FF] border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono w-fit shadow-md shadow-[#00D9FF]/5"
            >
              <Database className="w-3.5 h-3.5 animate-bounce text-[#00D9FF]" />
              <span>Academic Mini Project 2026</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center space-x-1.5 bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 px-3 py-1.5 rounded-full text-xs font-mono font-bold"
            >
              <span className="w-1.5 h-1.5 bg-[#4F8CFF] rounded-full animate-ping" />
              <span>DATANEST v2.0</span>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-[#F8FAFC]"
          >
            Database Management System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8CFF] via-[#00D9FF] to-[#6C63FF] font-extrabold">(DBMS)</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#94A3B8] font-sans max-w-xl leading-relaxed"
          >
            Learn fundamental relational theories, practice SQL schemas in real time, inspect schemas visually, and master CRUD record setups dynamically inside <strong className="text-[#F8FAFC]">DATANEST</strong>.
          </motion.p>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-4 bg-[#151C33]/60 backdrop-blur-md border border-white/10 rounded-2xl max-w-xl text-left"
          >
            <h4 className="text-xs font-mono font-extrabold text-[#00D9FF] uppercase tracking-wider flex items-center space-x-1.5 mb-1">
              <BadgeInfo className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </h4>
            <p className="text-xs text-[#CBD5E1] leading-relaxed select-none">
              To simplify database management and make learning DBMS concepts more interactive through a modern, intelligent, and visually engaging platform.
            </p>
          </motion.div>

          {/* Interactive Feature list */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium"
          >
            <div className="flex items-center space-x-3 p-3.5 bg-[#151C33] border border-white/15 text-[#F8FAFC] rounded-xl shadow-lg shadow-black/20 hover:scale-102 transition duration-200">
              <div className="p-2 bg-white/5 rounded-lg text-[#00D9FF] border border-white/5">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">SQL Sandbox Compiler</span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 bg-white text-[#0B1020] rounded-xl shadow-lg border border-[#4F8CFF]/20 hover:scale-102 transition duration-200">
              <div className="p-2 bg-[#151C33]/10 rounded-lg text-[#4F8CFF]">
                <Network className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Interactive ER Diagrams</span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 bg-[#151C33] border border-white/15 text-[#F8FAFC] rounded-xl shadow-lg shadow-black/20 hover:scale-102 transition duration-200">
              <div className="p-2 bg-white/5 rounded-lg text-[#6C63FF] border border-white/5">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">ACID Learning modules</span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 bg-white text-[#0B1020] rounded-xl shadow-lg border border-[#4F8CFF]/20 hover:scale-102 transition duration-200">
              <div className="p-2 bg-[#151C33]/10 rounded-lg text-[#00D9FF]">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Interactive DBMS Quiz</span>
            </div>
          </motion.div>

          {/* Call-to-actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button 
              id="hero-get-started-btn"
              onClick={() => onNavigate('learning-hub')}
              className="btn-primary px-6 py-3.5 text-white rounded-xl font-medium active:scale-98 transition flex items-center space-x-2 cursor-pointer neon-glow-primary font-bold"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              id="hero-sandbox-btn"
              onClick={() => onNavigate('sql-playground')}
              className="px-6 py-3.5 bg-[#151C33]/90 text-[#F8FAFC] rounded-xl font-medium border border-white/10 hover:bg-[#151C33]/60 active:scale-98 transition flex items-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#00D9FF] fill-[#00D9FF]/10" />
              <span>SQL Playground</span>
            </button>
          </motion.div>

          {/* Clean human repo label */}
          <p className="text-[11px] font-sans text-slate-500 uppercase tracking-widest pt-2">
            smart database management made simple
          </p>
          
        </div>

        {/* Right Side: PREMIUM LIVE DASHBOARD PREVIEW MOCKUP */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full max-w-md flex flex-col"
          >
            {/* Visual Glass Base Card */}
            <div className="w-full glass-panel rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden border border-white/15 bg-[#151C33]/70">
              
              {/* Header Bar */}
              <div className="flex justify-between items-center bg-[#0B1020]/90 p-3 rounded-2xl border border-white/10 mb-4 shadow-inner">
                <div className="flex space-x-1.5 items-center">
                  <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full" />
                  <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full" />
                  <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full" />
                  <span className="text-[10px] font-mono text-[#4F8CFF] ml-2 font-bold uppercase tracking-wider">DATANEST Console</span>
                </div>
                <div className="text-[9px] font-mono text-[#22C55E] flex items-center space-x-1 bg-[#151C33] px-2.5 py-1 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-ping mr-1" />
                  <span>ONLINE_PROD</span>
                </div>
              </div>

              {/* Dynamic Live Spark Statistics Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
                
                {/* Total Records Block */}
                <div className="bg-[#0B1020]/75 p-3 rounded-2xl border border-white/5 shadow-sm">
                  <p className="text-[9px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">Records</p>
                  <p className="text-sm font-display font-black text-[#00D9FF] mt-1">
                    {recordsCount.toLocaleString()}
                  </p>
                </div>

                {/* Active Users Block */}
                <div className="bg-[#0B1020]/75 p-3 rounded-2xl border border-white/5 shadow-sm">
                  <p className="text-[9px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">Users</p>
                  <p className="text-sm font-display font-black text-[#4F8CFF] mt-1">
                    {activeUsersCount.toLocaleString()}
                  </p>
                </div>

                {/* DB Health Block */}
                <div className="bg-[#0B1020]/75 p-3 rounded-2xl border border-white/5 shadow-sm">
                  <p className="text-[9px] font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">Health</p>
                  <p className="text-sm font-display font-black text-[#22C55E] mt-1">
                    {dbHealth}%
                  </p>
                </div>

              </div>

              {/* Custom SVG Spline Wave Chart - Feels Alive */}
              <div className="bg-[#0b1020]/40 p-4 rounded-2xl border border-white/5 mb-4 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#00D9FF] animate-pulse" />
                    Query Volatility Index
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 bg-[#0B1020] px-1.5 py-0.5 rounded border border-white/5">
                    Avg SQL: {queryTime}ms
                  </span>
                </div>

                <div className="relative w-full h-18 text-[#00D9FF]">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 450 100" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="450" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3" />
                    {/* Glow Filter */}
                    <defs>
                      <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00D9FF" />
                        <stop offset="50%" stopColor="#4F8CFF" />
                        <stop offset="100%" stopColor="#6C63FF" />
                      </linearGradient>
                    </defs>
                    {/* Oscillating Path */}
                    <path
                      d={getLinePath()}
                      fill="none"
                      stroke="url(#waveGlow)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out"
                    />
                  </svg>
                </div>
              </div>

              {/* Recent Activity Timeline Stream */}
              <div className="bg-[#0B1020]/90 p-4.5 rounded-2xl border border-white/10 text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-3 font-semibold">
                  Recent Activity Stream
                </span>
                
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {recentEvents.map((evt, i) => (
                      <motion.div
                        key={evt.time + evt.text}
                        initial={{ opacity: 0, x: -10, y: -5 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center space-x-2 text-[#CBD5E1] truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            evt.type === 'add' ? 'bg-[#22C55E]' :
                            evt.type === 'update' ? 'bg-[#F59E0B]' :
                            evt.type === 'backup' ? 'bg-[#4F8CFF]' : 'bg-[#6C63FF]'
                          }`} />
                          <span className="truncate text-slate-300 text-[11px]">{evt.text}</span>
                        </div>
                        <span className="text-[#94A3B8]/60 text-[10px] shrink-0 font-bold ml-2">{evt.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Glowing background shadows */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#4F8CFF]/15 rounded-full filter blur-xl pointer-events-none" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#00D9FF]/15 rounded-full filter blur-xl pointer-events-none" />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
