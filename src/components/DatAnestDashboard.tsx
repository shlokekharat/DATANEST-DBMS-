import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserCheck, FolderPlus, Database, AlertCircle, FileSpreadsheet, 
  TrendingUp, Activity, PieChart, ShieldCheck, ArrowRight, RefreshCw,
  Camera, User as UserIcon, Cpu, CheckCircle, Server, HardDrive, Clock, BarChart3
} from 'lucide-react';
import { Student, ActivityLog } from '../types';
import { useAuth } from '../context/AuthContext';
import WebcamCapture from './WebcamCapture';

interface DashboardProps {
  students: Student[];
  logs: ActivityLog[];
  onNavigate: (sectionId: string) => void;
  onTriggerBackup: () => void;
}

export default function DatAnestDashboard({ students, logs, onNavigate, onTriggerBackup }: DashboardProps) {
  const [hoveredChartPoint, setHoveredChartPoint] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const { user, localPhoto, updateProfilePhoto } = useAuth();

  // Premium counting up values states
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalCrudCount, setTotalCrudCount] = useState(0);
  const [recordsManagedCount, setRecordsManagedCount] = useState(0);
  const [activeUsersEnterprise, setActiveUsersEnterprise] = useState(0);
  const [systemReliability, setSystemReliability] = useState(0);
  const [averageQueryTime, setAverageQueryTime] = useState(0);

  // Mount animation trigger
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400; // 1.4 seconds animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Eased OutQuad function
      const eased = progress * (2 - progress);

      setTotalUsersCount(Math.floor(eased * 1250));
      setTotalCrudCount(Math.floor(eased * 8542));
      setRecordsManagedCount(Math.floor(eased * 12540));
      setActiveUsersEnterprise(Math.floor(eased * 1247));
      setSystemReliability(parseFloat((eased * 99.9).toFixed(1)));
      setAverageQueryTime(parseFloat((eased * 2.4).toFixed(1)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  // Dynamic statistics calculations based on live local/synced state
  const totalRecords = students.length;
  const activeUsers = students.filter(s => s.status === 'Active').length;
  const studentsRegistered = students.length; 
  
  // Calculate logs metadata
  const totalAdds = logs.filter(l => l.type === 'add').length;
  const totalUpdates = logs.filter(l => l.type === 'update').length;
  const totalDeletes = logs.filter(l => l.type === 'delete').length;

  // Render dummy metrics that fit our state nicely
  const newEntriesToday = totalAdds > 0 ? totalAdds : 1; 
  const updatedRecords = totalUpdates > 0 ? totalUpdates : 2;
  const deletedRecords = totalDeletes;

  // Department ratios
  const deptMap: Record<string, number> = {};
  students.forEach(s => {
    deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  });

  return (
    <section id="dashboard" className="py-24 relative bg-[#0B1020]">
      <div className="container mx-auto px-6">
        
        {/* Module Header and action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
              Operations Control
            </h2>
            <h1 className="text-3xl font-display font-extrabold text-[#F8FAFC] mt-1">
              DATANEST Live Metrics
            </h1>
            <p className="text-sm text-[#94A3B8] font-sans mt-1">
              Real-time synchronization dashboard showing transactional volumes and connection states.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
               id="dashboard-backup-btn"
               onClick={onTriggerBackup}
               className="px-4 py-2 bg-[#151C33] text-white hover:bg-[#151C33]/85 rounded-xl font-mono text-xs font-bold active:scale-97 transition flex items-center space-x-2 border border-white/15 cursor-pointer shadow-md neon-glow-primary"
            >
              <Database className="w-4 h-4 text-[#22C55E] fill-[#22C55E]/10" />
              <span>Snapshot Backup</span>
            </button>
            
            <button
               id="dashboard-registers-btn"
               onClick={() => onNavigate('student-database')}
               className="px-4 py-2 bg-[#4F8CFF] hover:bg-[#4F8CFF]/85 text-white rounded-xl font-sans text-xs font-semibold border border-[#4F8CFF]/20 hover:opacity-90 active:scale-97 transition flex items-center space-x-1.5 cursor-pointer neon-glow-primary"
            >
              <span>Explore Students Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Six Animated Statistic Cards + Counter Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
          
          {/* Card 1: Total Records */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#00D9FF] w-fit mb-3">
                <Database className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Total Records</p>
            </div>
            <p className="text-2xl font-display font-black text-[#00D9FF] mt-1">{totalRecords}</p>
          </div>

          {/* Card 2: Active Users */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#4F8CFF] w-fit mb-3">
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Active Users</p>
            </div>
            <p className="text-2xl font-display font-black text-[#4F8CFF] mt-1">{activeUsers}</p>
          </div>

          {/* Card 3: Total Users Counting Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#6C63FF] w-fit mb-3">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Total Users</p>
            </div>
            <motion.p className="text-2xl font-display font-black text-[#6C63FF] mt-1">
              {totalUsersCount.toLocaleString()}
            </motion.p>
          </div>

          {/* Card 4: Total CRUD Counting Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#00D9FF] w-fit mb-3">
                <FolderPlus className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Total CRUD</p>
            </div>
            <motion.p className="text-2xl font-display font-black text-[#00D9FF] mt-1">
              {totalCrudCount.toLocaleString()}
            </motion.p>
          </div>

          {/* Card 5: Updated Records */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#4F8CFF] w-fit mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Updated</p>
            </div>
            <p className="text-2xl font-display font-black text-[#4F8CFF] mt-1">{updatedRecords}</p>
          </div>

          {/* Card 6: Deleted Records */}
          <div className="glass-panel p-5 rounded-2xl border border-white/15 flex flex-col justify-between shadow-sm hover:scale-105 duration-200">
            <div>
              <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#EF4444] w-fit mb-3">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Deleted Logs</p>
            </div>
            <p className="text-2xl font-display font-black text-[#EF4444] mt-1">{deletedRecords}</p>
          </div>

        </div>

        {/* Dynamic High-Fidelity SVG Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Chart 1: Monthly Growth Area Spline Graph */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/15 shadow-sm flex flex-col bg-[#151C33]/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-[#F8FAFC] flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                  <span>Integrated Monthly Record Growth</span>
                </h3>
                <p className="text-xs text-[#94A3B8]">Relational record storage escalation across the visual term.</p>
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8] bg-[#0B1020] px-2.5 py-1 rounded-lg border border-white/5">
                Term: Jan - Jun 2026
              </div>
            </div>

            {/* Custom SVG Area Spline Representation */}
            <div className="relative w-full h-[220px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                
                {/* Horizontal Guide Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" className="stroke-white/5 stroke-1" strokeDasharray="3" />
                <line x1="0" y1="100" x2="500" y2="100" className="stroke-white/5 stroke-1" strokeDasharray="3" />
                <line x1="0" y1="150" x2="500" y2="150" className="stroke-white/5 stroke-1" strokeDasharray="3" />
                
                {/* Visual Area Gradient definition */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Shaded Area spline (Points: Jan(10,170) -> Feb(100,140) -> Mar(190,150) -> Apr(280,100) -> May(370,80) -> Jun(480,40) */}
                <path 
                  d="M 10 170 Q 100 130, 190 145 T 370 70 Q 430 40, 480 30 L 480 180 L 10 180 Z" 
                  fill="url(#areaGradient)" 
                />

                {/* Thick Line Path */}
                <path 
                  d="M 10 170 Q 100 130, 190 145 T 370 70 Q 430 40, 480 30" 
                  fill="none" 
                  className="stroke-[#4F8CFF] stroke-[3] stroke-linecap-round shadow-inner" 
                />

                {/* Plot coordinate dots */}
                <circle cx="10" cy="170" r="5" className="fill-[#4F8CFF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Jan: 10 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="100" cy="138" r="5" className="fill-[#00D9FF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Feb: 24 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="190" cy="144" r="5" className="fill-[#6C63FF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Mar: 34 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="280" cy="105" r="5" className="fill-[#4F8CFF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Apr: 60 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="370" cy="74" r="5" className="fill-[#00D9FF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("May: 85 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="480" cy="30" r="5" className="fill-[#4F8CFF] hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint(`Jun: ${students.length} Records (Real-Time)`)} onMouseLeave={() => setHoveredChartPoint(null)} />
              </svg>

              {/* Hover coordinate label */}
              {hoveredChartPoint && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 p-2 bg-[#151C33] border border-white/10 text-[10px] font-mono rounded-lg text-[#00D9FF] shadow-md z-25">
                  {hoveredChartPoint}
                </div>
              )}

              {/* Bottom Months Labels */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8] mt-2.5">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun (Active)</span>
              </div>
            </div>
          </div>

          {/* Chart 2 + 3 Stacked Column: Database Usage Donut & User Activity Bars */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Workspace Admin Profile Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 shadow-sm bg-[#151C33]/40 text-left relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-[#4F8CFF]/5 rounded-full filter blur-xl group-hover:scale-125 duration-300" />
              
              <h3 className="text-xs font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-4">
                <UserIcon className="w-4 h-4 text-[#4F8CFF]" />
                <span>Workspace Controller</span>
              </h3>

              <div className="flex items-center space-x-4">
                <div 
                  onClick={() => setIsWebcamOpen(true)}
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group/avatar cursor-pointer shrink-0 shadow bg-[#0B1020] flex items-center justify-center transition-all duration-200 hover:border-[#4F8CFF]"
                  title="Click to capture photo from webcam"
                >
                  {user?.photoURL || localPhoto ? (
                    <img
                      src={user?.photoURL || localPhoto || ''}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#4F8CFF] to-[#6C63FF] flex items-center justify-center text-white">
                      <span className="text-base font-display font-black uppercase">
                        {(user?.displayName || user?.email || "AD")?.substring(0, 2)}
                      </span>
                    </div>
                  )}

                  {/* Circle Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0B1020]/80 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera className="w-4 h-4 text-[#00D9FF] animate-pulse" />
                    <span className="text-[7px] uppercase font-mono font-bold mt-1 text-white">Camera</span>
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-sm font-display font-extrabold text-[#F8FAFC] truncate leading-snug">
                    {user?.displayName || user?.email?.split('@')[0] || "Academic Administrator"}
                  </h4>
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#00D9FF] px-1.5 py-0.5 bg-[#151C33]/90 rounded border border-white/10 w-fit">
                      System administrator
                    </span>
                    <span className="text-[9px] font-sans text-[#94A3B8] flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                      <span>Online & Connected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Snapshot Button wrapper */}
              <button
                id="update-badge-photo-btn"
                onClick={() => setIsWebcamOpen(true)}
                className="w-full mt-4 py-2.5 bg-[#151C33] hover:bg-[#151C33]/80 border border-white/10 rounded-xl text-[10px] font-mono font-bold text-[#94A3B8] transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-[#4F8CFF]" />
                <span>Webcam Profile Capture</span>
              </button>
            </div>
            
            {/* Database Usage Donut Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 shadow-sm bg-[#151C33]/40 text-left">
              <h3 className="text-xs font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-4">
                <PieChart className="w-4 h-4 text-[#6C63FF]" />
                <span>Sector Storage Usage</span>
              </h3>
              
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="38" className="stroke-white/5 stroke-8" fill="transparent" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="38" 
                      className="stroke-[#6C63FF] stroke-8" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - activeUsers / (students.length || 1))}
                    />
                  </svg>
                  <div className="absolute text-[11px] font-mono font-extrabold text-[#00D9FF]">
                    {students.length > 0 ? Math.round((activeUsers / students.length) * 100) : 0}%
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-[#6C63FF] rounded-full" />
                    <span className="text-[#F8FAFC]">Active Records ({activeUsers})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-white/10 rounded-full" />
                    <span className="text-[#94A3B8]">Reserved Buffer ({students.length - activeUsers})</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#94A3B8]/60 mt-1">
                    Quota: 100 MB free sandbox cloud block allocation.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Lower row: Beautiful Statistics Panel (L) & Database Status Panel (R) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Beautiful Statistics Panel (Left) */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/15 bg-[#151C33]/40 text-left">
            <h3 className="text-sm font-mono font-bold uppercase text-[#F8FAFC] flex items-center space-x-2 mb-6">
              <BarChart3 className="w-4 h-4 text-[#00D9FF]" />
              <span>Enterprise Scale Statistics</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              
              <div className="p-4 bg-[#0B1020]/60 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">Records Managed</p>
                  <h4 className="text-2xl font-display font-black text-white mt-2">
                    {recordsManagedCount.toLocaleString()}+
                  </h4>
                </div>
                <span className="text-[9px] font-sans text-[#00D9FF] mt-3">High capacity storage scale</span>
              </div>

              <div className="p-4 bg-[#0B1020]/60 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">Active Users</p>
                  <h4 className="text-2xl font-display font-black text-[#4F8CFF] mt-2">
                    {activeUsersEnterprise.toLocaleString()}
                  </h4>
                </div>
                <span className="text-[9px] font-sans text-[#4F8CFF] mt-3">Active concurrent sessions</span>
              </div>

              <div className="p-4 bg-[#0B1020]/60 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">System Reliability</p>
                  <h4 className="text-2xl font-display font-black text-[#22C55E] mt-2">
                    {systemReliability}%
                  </h4>
                </div>
                <span className="text-[9px] font-sans text-[#22C55E] mt-3">Standard SLA commitment</span>
              </div>

              <div className="p-4 bg-[#0B1020]/60 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">Avg Query Time</p>
                  <h4 className="text-2xl font-display font-black text-[#6C63FF] mt-2">
                    {averageQueryTime}ms
                  </h4>
                </div>
                <span className="text-[9px] font-sans text-[#6C63FF] mt-3">Index response speeds</span>
              </div>

            </div>
          </div>

          {/* Database Status Panel (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Database Status Panel Box */}
            <div className="glass-panel p-5 rounded-2xl border border-white/15 shadow-sm bg-[#151C33]/40 text-left">
              <h3 className="text-xs font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-4">
                <Database className="w-4 h-4 text-[#22C55E]" />
                <span>Database Status</span>
              </h3>
              
              <div className="space-y-4">
                
                {/* 🟢 Connected state indicator */}
                <div className="flex items-center justify-between p-3 bg-[#0B1020]/60 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-slate-300">Status</span>
                  <span className="text-xs font-mono font-bold text-[#22C55E] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse inline-block" />
                    <span>🟢 Connected</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#0B1020]/40 rounded-xl border border-white/5">
                    <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Version</p>
                    <p className="font-mono font-bold text-slate-200 mt-1">SQLite 3.46</p>
                  </div>
                  <div className="p-3 bg-[#0B1020]/40 rounded-xl border border-white/5">
                    <p className="text-[10px] font-mono text-[#94A3B8] uppercase">Last Backup</p>
                    <p className="font-mono font-bold text-[#4F8CFF] mt-1 text-[11px]">2 mins ago</p>
                  </div>
                </div>

                <div className="p-3 bg-[#0B1020]/40 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#94A3B8] uppercase mb-1.5">
                    <span>Storage Used</span>
                    <span className="text-[#00D9FF]">65%</span>
                  </div>
                  <div className="w-full bg-[#0B1020] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-[#00D9FF] to-[#6C63FF] h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick snapshot indicator backup bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#151C33] to-[#0B1020] border border-white/15 text-white flex justify-between items-center relative overflow-hidden shadow-lg shadow-[#6C63FF]/5">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#4F8CFF]/10 rounded-full filter blur-xl" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20 flex items-center space-x-1 w-fit uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>State Core Secured</span>
                </span>
                <h4 className="text-sm font-display font-bold text-[#F8FAFC]">Relational Backup Auto WAL</h4>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans max-w-[220px]">
                  Storage snapshots are committed automatically to browser keys.
                </p>
              </div>
              
              <button 
                id="dashboard-backup-trigger-circle"
                onClick={onTriggerBackup} 
                className="p-3 bg-[#151C33] hover:bg-[#151C33]/80 hover:scale-105 active:scale-95 duration-150 rounded-full border border-white/10 text-white shadow-xl cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#22C55E]" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Webcam Snapshot Capture Portal Overlay */}
      <AnimatePresence>
        {isWebcamOpen && (
          <WebcamCapture
            onClose={() => setIsWebcamOpen(false)}
            onSave={async (photoDataUrl) => {
              await updateProfilePhoto(photoDataUrl);
            }}
            currentPhoto={user?.photoURL || localPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
