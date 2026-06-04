import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, CircleEllipsis, TrendingUp, Compass, Cpu, 
  Activity, Users, ClipboardCopy, PieChart, Check 
} from 'lucide-react';
import { Student } from '../types';

interface AnalyticsProps {
  students: Student[];
}

export default function Analytics({ students }: AnalyticsProps) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  // Dynamic calculations on active state
  const totalCount = students.length;

  const departments = [
    "Computer & IoT",
    "Information Technology",
    "Mechanical Engineering",
    "Electronics Engineering"
  ];

  // Calculate department frequencies
  const deptCounts = departments.map(dept => {
    const count = students.filter(s => s.department === dept).length;
    return {
      name: dept,
      count,
      ratio: totalCount > 0 ? (count / totalCount) * 100 : 0
    };
  });

  // Color mappings
  const deptColors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-cyan-500"
  ];

  const strokeColors = [
    "#3b82f6", // Blue
    "#6366f1", // Indigo
    "#a855f7", // Purple
    "#06b6d4"  // Cyan
  ];

  return (
    <section id="analytics" className="py-24 relative bg-gray-50/50 dark:bg-slate-950/20 balance border-b border-gray-100 dark:border-slate-950">
      <div className="container mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
            Cloud Intelligence
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            Database Storage Analytics
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-650 dark:text-gray-300 mt-4 text-base font-sans">
            Inspect department cluster distributions, active performance indices, read/write I/O latencies, and storage density metrics.
          </p>
        </div>

        {/* Analytics bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Bento Box 1: Dynamic Radial Department Chart */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-slate-400 flex items-center space-x-1.5 mb-2">
                <PieChart className="w-4 h-4 text-indigo-500" />
                <span>Department Clusters</span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 font-sans">
                Relative distributions of entries per engineering cluster.
              </p>
            </div>

            {/* Custom Interactive SVG Concentric Rings representation */}
            <div className="flex items-center justify-center py-6">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {deptCounts.map((dept, index) => {
                    const radius = 30 + index * 12;
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference * (1 - dept.ratio / 100);

                    return (
                      <circle
                        key={index}
                        cx="88"
                        cy="88"
                        r={radius}
                        className="transition-all duration-700"
                        stroke={strokeColors[index]}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        onMouseEnter={() => setActiveSegmentIndex(index)}
                        onMouseLeave={() => setActiveSegmentIndex(null)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </svg>

                {/* Inside details text block */}
                <div className="absolute flex flex-col items-center justify-center">
                  {activeSegmentIndex !== null ? (
                    <>
                      <span className="text-base font-display font-black text-slate-900 dark:text-white">
                        {Math.round(deptCounts[activeSegmentIndex].ratio)}%
                      </span>
                      <span className="text-[9px] uppercase font-mono text-gray-400 font-bold truncate max-w-[80px]">
                        {deptCounts[activeSegmentIndex].name.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-display font-black text-gray-900 dark:text-white">
                        {totalCount}
                      </span>
                      <span className="text-[9px] uppercase font-mono text-gray-400 font-bold">Scholars</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Micro indicators rows */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-105 dark:border-slate-850">
              {deptCounts.map((dept, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[10px]">
                  <div className={`w-2 h-2 rounded-full ${deptColors[idx]}`} />
                  <span className="font-mono text-gray-400 truncate max-w-[100px]" title={dept.name}>
                    {dept.name}: <strong className="text-gray-900 dark:text-white">{dept.count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Box 2: Department-wise Progression Bars */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-slate-400 flex items-center space-x-1.5 mb-2">
                <BarChart className="w-4 h-4 text-blue-500" />
                <span>Department Densities</span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                Active percentages representing loaded database tuples.
              </p>
            </div>

            {/* Progress Bars columns */}
            <div className="space-y-4.5">
              {deptCounts.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-gray-700 dark:text-slate-300">{dept.name}</span>
                    <span className="text-gray-500">{dept.count} Records ({Math.round(dept.ratio)}%)</span>
                  </div>
                  {/* Outer rail */}
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${deptColors[idx]} transition-all duration-1000`}
                      style={{ width: `${dept.ratio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-[10px] font-mono text-gray-400 leading-relaxed pt-3 border-t border-gray-100 dark:border-slate-850">
              💡 <strong className="text-blue-500">Query Optimizations:</strong> Primary indices are distributed across department segments to accelerate SELECT times during range query sweeps.
            </div>
          </div>

          {/* Bento Box 3: Database Storage Performance Index */}
          <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-slate-400 flex items-center space-x-1.5 mb-4">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>Sandbox DB Diagnostics</span>
              </h3>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-gray-400">QUERY LATENCY</span>
                    <span className="font-bold text-emerald-500">~1.2 ms</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 w-1/5 rounded-full" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-gray-400">DISK THROUGHPUT</span>
                    <span className="font-bold text-blue-500">12.5k iops</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-1.5 w-2/5 rounded-full" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-gray-400">HEAP USAGE</span>
                    <span className="font-bold text-indigo-500">18.4 MB</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 w-1/4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicator badge */}
            <div className="mt-5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>ACTIVE STORAGE: EXCELLENT HEALTH</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
