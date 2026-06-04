import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserCheck, FolderPlus, Database, AlertCircle, FileSpreadsheet, 
  TrendingUp, Activity, PieChart, ShieldCheck, ArrowRight, RefreshCw,
  Camera, User as UserIcon, Cpu, CheckCircle
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

  // Dynamic statistics calculations
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
    <section id="dashboard" className="py-24 relative bg-gray-50/50 dark:bg-slate-950/20">
      <div className="container mx-auto px-6">
        
        {/* Module Header and action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
              Operations Control
            </h2>
            <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
              DATANEST Live Metrics
            </h1>
            <p className="text-sm text-gray-505 dark:text-gray-400 font-sans mt-1">
              Real-time synchronization dashboard showing transactional volumes and connection states.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              id="dashboard-backup-btn"
              onClick={onTriggerBackup}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-mono text-xs font-bold hover:opacity-90 active:scale-97 transition flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Database className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
              <span>Snapshot Backup</span>
            </button>
            
            <button
              id="dashboard-registers-btn"
              onClick={() => onNavigate('student-database')}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl font-sans text-xs font-semibold border border-blue-100 dark:border-blue-900/40 hover:opacity-90 active:scale-97 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Explore Students Database</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Six Animated Statistic Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
          
          {/* Card 1: Total Records */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-blue-500/20 duration-200">
            <div>
              <div className="p-2 bg-blue-50 dark:bg-slate-950 rounded-xl text-blue-600 dark:text-blue-450 w-fit mb-3">
                <Database className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">Total Records</p>
            </div>
            <p className="text-2xl font-display font-black text-gray-900 dark:text-white mt-1">{totalRecords}</p>
          </div>

          {/* Card 2: Active Users */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-emerald-500/20 duration-200">
            <div>
              <div className="p-2 bg-emerald-50 dark:bg-slate-950 rounded-xl text-emerald-600 dark:text-emerald-450 w-fit mb-3">
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">Active Users</p>
            </div>
            <p className="text-2xl font-display font-black text-emerald-500 mt-1">{activeUsers}</p>
          </div>

          {/* Card 3: Students Registered */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-indigo-500/20 duration-200">
            <div>
              <div className="p-2 bg-indigo-50 dark:bg-slate-950 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit mb-3">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">Registered</p>
            </div>
            <p className="text-2xl font-display font-black text-gray-900 dark:text-white mt-1">{studentsRegistered}</p>
          </div>

          {/* Card 4: New Entries Today */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-cyan-500/20 duration-200">
            <div>
              <div className="p-2 bg-cyan-50 dark:bg-slate-950 rounded-xl text-cyan-600 dark:text-cyan-450 w-fit mb-3">
                <FolderPlus className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">New Today</p>
            </div>
            <p className="text-2xl font-display font-black text-cyan-500 mt-1">+{newEntriesToday}</p>
          </div>

          {/* Card 5: Updated Records */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-yellow-500/20 duration-200">
            <div>
              <div className="p-2 bg-yellow-50 dark:bg-slate-950 rounded-xl text-yellow-600 dark:text-yellow-400 w-fit mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">Updated</p>
            </div>
            <p className="text-2xl font-display font-black text-yellow-600 mt-1">{updatedRecords}</p>
          </div>

          {/* Card 6: Deleted Records */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:ring-2 hover:ring-red-500/20 duration-200">
            <div>
              <div className="p-2 bg-red-50 dark:bg-slate-950 rounded-xl text-red-650 dark:text-red-400 w-fit mb-3">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-450 uppercase tracking-widest">Deleted Logs</p>
            </div>
            <p className="text-2xl font-display font-black text-red-550 mt-1">{deletedRecords}</p>
          </div>

        </div>

        {/* Dynamic High-Fidelity SVG Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Monthly Growth Area Spline Graph */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm flex flex-col bg-white dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-slate-400 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Integrated Monthly Record Growth</span>
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Relational record storage escalation across the visual term.</p>
              </div>
              <div className="text-[10px] font-mono text-gray-450 bg-gray-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg">
                Term: Jan - Jun 2026
              </div>
            </div>

            {/* Custom SVG Area Spline Representation */}
            <div className="relative w-full h-[220px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                
                {/* Horizontal Guide Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" className="stroke-gray-100 dark:stroke-slate-850 stroke-1" strokeDasharray="3" />
                <line x1="0" y1="100" x2="500" y2="100" className="stroke-gray-100 dark:stroke-slate-850 stroke-1" strokeDasharray="3" />
                <line x1="0" y1="150" x2="500" y2="150" className="stroke-gray-100 dark:stroke-slate-850 stroke-1" strokeDasharray="3" />
                
                {/* Visual Area Gradient definition */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
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
                  className="stroke-blue-600 dark:stroke-blue-450 stroke-[3] stroke-linecap-round" 
                />

                {/* Plot coordinate dots */}
                <circle cx="10" cy="170" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Jan: 10 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="100" cy="138" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Feb: 24 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="190" cy="144" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Mar: 34 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="280" cy="105" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("Apr: 60 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="370" cy="74" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint("May: 85 Rows")} onMouseLeave={() => setHoveredChartPoint(null)} />
                <circle cx="480" cy="30" r="5" className="fill-blue-600 hover:scale-125 duration-150 cursor-pointer" onMouseEnter={() => setHoveredChartPoint(`Jun: ${students.length} Records (Real-Time)`)} onMouseLeave={() => setHoveredChartPoint(null)} />
              </svg>

              {/* Hover coordinate label */}
              {hoveredChartPoint && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 p-2 bg-slate-900 border border-slate-800 text-[10px] font-mono rounded-lg text-emerald-400">
                  {hoveredChartPoint}
                </div>
              )}

              {/* Bottom Months Labels */}
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-2.5">
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
            <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 text-left relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl group-hover:scale-125 duration-300" />
              
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center space-x-1.5 mb-4">
                <UserIcon className="w-4 h-4 text-blue-500" />
                <span>Workspace Controller</span>
              </h3>

              <div className="flex items-center space-x-4">
                {/* Profile Photo Avatar with Hover Trigger Overlay */}
                <div 
                  onClick={() => setIsWebcamOpen(true)}
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/35 group/avatar cursor-pointer shrink-0 shadow bg-slate-100 dark:bg-slate-950 flex items-center justify-center transition-all duration-200 hover:border-blue-500"
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
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                      <span className="text-base font-display font-black uppercase">
                        {(user?.displayName || user?.email || "AD")?.substring(0, 2)}
                      </span>
                    </div>
                  )}

                  {/* Circle Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-[7px] uppercase font-mono font-bold mt-1 text-gray-250">Camera</span>
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h4 className="text-sm font-display font-extrabold text-gray-950 dark:text-white truncate leading-snug">
                    {user?.displayName || user?.email?.split('@')[0] || "Academic Administrator"}
                  </h4>
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-100 dark:border-blue-900/40 w-fit">
                      System administrator
                    </span>
                    <span className="text-[9px] font-sans text-gray-450 dark:text-gray-500 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Online & Connected</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Snapshot Button wrapper */}
              <button
                id="update-badge-photo-btn"
                onClick={() => setIsWebcamOpen(true)}
                className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900/80 border border-gray-150 dark:border-slate-850 rounded-xl text-[10px] font-mono font-bold text-gray-600 dark:text-gray-300 transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                <span>Webcam Profile Capture</span>
              </button>
            </div>
            
            {/* Database Usage Donut Card */}
            <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 text-left">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center space-x-1.5 mb-4">
                <PieChart className="w-4 h-4 text-indigo-500" />
                <span>Sector Storage Usage</span>
              </h3>
              
              <div className="flex items-center space-x-6">
                {/* SVG Circular Donut representation */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="38" className="stroke-slate-100 dark:stroke-slate-800 stroke-8" fill="transparent" />
                    {/* Active sector */}
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="38" 
                      className="stroke-indigo-600 dark:stroke-indigo-400 stroke-8" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - activeUsers / (students.length || 1))}
                    />
                  </svg>
                  <div className="absolute text-[11px] font-mono font-extrabold text-indigo-500">
                    {students.length > 0 ? Math.round((activeUsers / students.length) * 100) : 0}%
                  </div>
                </div>

                {/* Relational details index labels */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                    <span className="text-gray-800 dark:text-slate-300">Active Records ({activeUsers})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-gray-200 dark:bg-slate-800 rounded-full" />
                    <span className="text-gray-400">Reserved Buffer ({students.length - activeUsers})</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1">
                    Quota: 100 MB free sandbox cloud block allocation.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick backup status card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-850 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/60 flex items-center space-x-1 w-fit uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>State Core Secured</span>
                </span>
                <h4 className="text-sm font-display font-bold">Relational Backup Auto WAL</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans max-w-[220px]">
                  Storage snapshots are committed automatically to browser keys.
                </p>
              </div>
              
              <button 
                id="dashboard-backup-trigger-circle"
                onClick={onTriggerBackup} 
                className="p-3 bg-slate-800 hover:bg-slate-700 hover:scale-105 active:scale-95 duration-150 rounded-full border border-slate-700 text-white shadow-xl cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
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
