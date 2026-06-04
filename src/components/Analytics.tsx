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
    "bg-[#00D9FF]",
    "bg-[#4F8CFF]",
    "bg-[#6C63FF]",
    "bg-[#00B4D8]"
  ];

  const strokeColors = [
    "#00D9FF",
    "#4F8CFF",
    "#6C63FF",
    "#00B4D8"
  ];

  return (
    <section id="analytics" className="py-24 relative bg-[#0B1020] border-b border-white/10">
      <div className="container mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
            Cloud Intelligence
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#F8FAFC] mt-1">
            Database Storage Analytics
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-[#00D9FF] to-[#4F8CFF] mx-auto mt-4 rounded-full" />
          <p className="text-[#94A3B8] mt-4 text-base font-sans">
            Inspect department cluster distributions, active performance indices, read/write I/O latencies, and storage density metrics.
          </p>
        </div>

        {/* Analytics bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Bento Box 1: Dynamic Radial Department Chart */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-2">
                <PieChart className="w-4 h-4 text-[#4F8CFF]" />
                <span>Department Clusters</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mb-6 font-sans">
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
                      <span className="text-base font-display font-black text-[#F8FAFC]">
                        {Math.round(deptCounts[activeSegmentIndex].ratio)}%
                      </span>
                      <span className="text-[9px] uppercase font-mono text-[#94A3B8] font-bold truncate max-w-[80px]">
                        {deptCounts[activeSegmentIndex].name.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-display font-black text-[#F8FAFC]">
                        {totalCount}
                      </span>
                      <span className="text-[9px] uppercase font-mono text-[#94A3B8] font-bold">Scholars</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Micro indicators rows */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
              {deptCounts.map((dept, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[10px]">
                  <div className={`w-2 h-2 rounded-full ${deptColors[idx]}`} />
                  <span className="font-mono text-[#94A3B8] truncate max-w-[100px]" title={dept.name}>
                    {dept.name}: <strong className="text-[#F8FAFC]">{dept.count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Box 2: Department-wise Progression Bars */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-2">
                <BarChart className="w-4 h-4 text-[#00D9FF]" />
                <span>Department Densities</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mb-6">
                Active percentages representing loaded database tuples.
              </p>
            </div>

            {/* Progress Bars columns */}
            <div className="space-y-4.5">
              {deptCounts.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-[#CBD5E1]">{dept.name}</span>
                    <span className="text-[#94A3B8]">{dept.count} Records ({Math.round(dept.ratio)}%)</span>
                  </div>
                  {/* Outer rail */}
                  <div className="w-full bg-[#0B1020] border border-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${deptColors[idx]} transition-all duration-1000`}
                      style={{ width: `${dept.ratio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-[10px] font-mono text-[#94A3B8] leading-relaxed pt-3 border-t border-white/10">
              💡 <strong className="text-[#00D9FF]">Query Optimizations:</strong> Primary indices are distributed across department segments to accelerate SELECT times during range query sweeps.
            </div>
          </div>

          {/* Bento Box 3: Database Storage Performance Index */}
          <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-[#94A3B8] flex items-center space-x-1.5 mb-4">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Sandbox DB Diagnostics</span>
              </h3>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-[#94A3B8]">QUERY LATENCY</span>
                    <span className="font-bold text-emerald-400">~1.2 ms</span>
                  </div>
                  <div className="w-full bg-[#0B1020] border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-1.5 w-1/5 rounded-full" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-[#94A3B8]">DISK THROUGHPUT</span>
                    <span className="font-bold text-[#00D9FF]">12.5k iops</span>
                  </div>
                  <div className="w-full bg-[#0B1020] border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00D9FF] h-1.5 w-2/5 rounded-full" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-[#94A3B8]">HEAP USAGE</span>
                    <span className="font-bold text-[#4F8CFF]">18.4 MB</span>
                  </div>
                  <div className="w-full bg-[#0B1020] border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4F8CFF] h-1.5 w-1/4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicator badge */}
            <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>ACTIVE STORAGE: EXCELLENT HEALTH</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
