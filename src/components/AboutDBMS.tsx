import { motion } from 'motion/react';
import { Database, Zap, Sparkles, Layout, Settings, FileText, ArrowUpDown, Layers, HelpCircle } from 'lucide-react';
import { ABOUT_DBMS_CARDS } from '../data/dbmsContent';

export default function AboutDBMS() {
  // Map icons to the corresponding cards index
  const cardIcons = [
    <HelpCircle className="w-5 h-5 text-blue-500" />,
    <Layers className="w-5 h-5 text-indigo-500" />,
    <Sparkles className="w-5 h-5 text-emerald-500" />,
    <Zap className="w-5 h-5 text-cyan-500" />,
    <Settings className="w-5 h-5 text-pink-500" />,
    <FileText className="w-5 h-5 text-purple-500" />,
  ];

  return (
    <section id="about-dbms" className="py-24 relative bg-gray-50/50 dark:bg-slate-950/30">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-45 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
            Foundations
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            Understanding DBMS Core Concepts
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-650 dark:text-gray-300 mt-4 text-base font-sans">
            A comprehensive look at why dedicated Database Management Systems are superior to classical file vaults for multi-user, mission-critical application workflows.
          </p>
        </div>

        {/* Six Animated Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ABOUT_DBMS_CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              id={`about-card-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-panel hover:bg-white/95 dark:hover:bg-slate-900/90 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100 hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-900 flex-1 h-full"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-blue-50 dark:bg-slate-800/80 rounded-xl">
                    {cardIcons[idx] || <Database className="w-5 h-5 text-blue-500" />}
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>

                {/* Main Desc */}
                <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed mb-4">
                  {card.desc}
                </p>

                {/* Sub Details inside an elegant accordion accent */}
                <div className="mt-4 p-3.5 rounded-xl bg-gray-50/80 dark:bg-slate-900/40 border border-gray-100/60 dark:border-slate-800/40">
                  <div className="text-[11px] font-mono font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-1.5 flex items-center space-x-1">
                    <Layout className="w-3 h-3" />
                    <span>In-Depth Academic Perspective</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono leading-relaxed whitespace-pre-line">
                    {card.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FS vs DBMS Comparison Table Visual Summary Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-14 glass-panel rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100 dark:border-slate-800"
        >
          <div className="flex items-center space-x-3.5 mb-6">
            <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                Detailed Comparison Matrix: File System vs DBMS
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">Quick study guide comparing storage topologies</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100/50 dark:bg-slate-900/50 text-gray-700 dark:text-gray-300 font-mono text-xs border-b border-gray-150 dark:border-slate-800">
                <tr>
                  <th className="p-4">Feature Comparison</th>
                  <th className="p-4">Traditional File Systems</th>
                  <th className="p-4">Modern DBMS Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs font-sans text-gray-600 dark:text-gray-300">
                <tr className="hover:bg-blue-50/20 dark:hover:bg-slate-900/20 transition">
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">Redundancy & Inconsistency</td>
                  <td className="p-4 text-red-500 dark:text-red-400 font-medium">High (duplicate information scattered across multiple folders)</td>
                  <td className="p-4 text-emerald-500 dark:text-emerald-400 font-medium">Minimal (normalized tables with foreign key referencing)</td>
                </tr>
                <tr className="hover:bg-blue-50/20 dark:hover:bg-slate-900/20 transition">
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">Search and Retrieval Speed</td>
                  <td className="p-4">Slow manual file-parsing in custom applications</td>
                  <td className="p-4 text-slate-800 dark:text-white font-semibold">Extremely fast through dynamic Indexes (B-Trees / Hash Indices)</td>
                </tr>
                <tr className="hover:bg-blue-50/20 dark:hover:bg-slate-900/20 transition">
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">Concurrency Conflict Control</td>
                  <td className="p-4">Unsupported (leads to file locks or lost edits)</td>
                  <td className="p-4 text-indigo-500 dark:text-indigo-400">Robust (Atomic commits, lock-based protocols, 2PL)</td>
                </tr>
                <tr className="hover:bg-blue-50/20 dark:hover:bg-slate-900/20 transition">
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">Security Controls</td>
                  <td className="p-4">Weak flat operating system directory permissions</td>
                  <td className="p-4">Strong role permissions and specific table row-filters</td>
                </tr>
                <tr className="hover:bg-blue-50/20 dark:hover:bg-slate-900/20 transition">
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">Data Backups & Recovery</td>
                  <td className="p-4">Manual file copy (at high risk of corrupt states)</td>
                  <td className="p-4 font-mono text-[11px] text-teal-600 dark:text-teal-400">Automated transaction write-ahead logs (WAL) & recovery tools</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
