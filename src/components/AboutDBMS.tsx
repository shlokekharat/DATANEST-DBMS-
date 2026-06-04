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
    <section id="about-dbms" className="py-24 relative bg-[#0B1020]">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
            Foundations
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#F8FAFC] mt-1">
            Understanding DBMS Core Concepts
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-[#4F8CFF] to-[#6C63FF] mx-auto mt-4 rounded-full shadow-lg shadow-[#4F8CFF]/25" />
          <p className="text-[#94A3B8] mt-4 text-base font-sans">
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
              className="glass-card hover:bg-[#151C33]/65 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-white/10 hover:border-[#4F8CFF]/50 flex-1 h-full"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center space-x-3.5 mb-4">
                  <div className="p-2.5 bg-[#151C33] border border-white/10 rounded-xl">
                    {cardIcons[idx] || <Database className="w-5 h-5 text-[#4F8CFF]" />}
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#F8FAFC]">
                    {card.title}
                  </h3>
                </div>

                {/* Main Desc */}
                <p className="text-sm text-[#94A3B8] font-sans leading-relaxed mb-4">
                  {card.desc}
                </p>

                {/* Sub Details inside an elegant accordion accent */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#0B1020]/60 border border-white/5">
                  <div className="text-[11px] font-mono font-semibold uppercase text-[#00D9FF] tracking-wider mb-1.5 flex items-center space-x-1">
                    <Layout className="w-3 h-3" />
                    <span>In-Depth Academic Perspective</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-mono leading-relaxed whitespace-pre-line">
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
          className="mt-14 glass-panel rounded-2xl p-6 lg:p-8 shadow-md border border-white/15"
        >
          <div className="flex items-center space-x-3.5 mb-6">
            <div className="p-2.5 bg-[#151C33] border border-white/10 rounded-xl text-[#00D9FF]">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#F8FAFC]">
                Detailed Comparison Matrix: File System vs DBMS
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">Quick study guide comparing storage topologies</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#151C33]/85 text-[#F8FAFC] font-mono text-xs border-b border-white/10">
                <tr>
                  <th className="p-4">Feature Comparison</th>
                  <th className="p-4">Traditional File Systems</th>
                  <th className="p-4">Modern DBMS Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-sans text-[#94A3B8]">
                <tr className="hover:bg-[#4F8CFF]/5 transition">
                  <td className="p-4 font-semibold text-[#F8FAFC]">Redundancy & Inconsistency</td>
                  <td className="p-4 text-[#EF4444] font-medium">High (duplicate scattered folders)</td>
                  <td className="p-4 text-[#22C55E] font-medium">Minimal (normalized foreign-key references)</td>
                </tr>
                <tr className="hover:bg-[#4F8CFF]/5 transition">
                  <td className="p-4 font-semibold text-[#F8FAFC]">Search and Retrieval Speed</td>
                  <td className="p-4 text-[#94A3B8]">Slow manual file-parsing</td>
                  <td className="p-4 text-[#F8FAFC] font-semibold">Extremely fast Indexes (B-Trees / Hash Indices)</td>
                </tr>
                <tr className="hover:bg-[#4F8CFF]/5 transition">
                  <td className="p-4 font-semibold text-[#F8FAFC]">Concurrency Conflict Control</td>
                  <td className="p-4 text-[#EF4444]">Unsupported (file locks or lost edits)</td>
                  <td className="p-4 text-[#00D9FF]">Robust (Atomic commits, 2PL lock protocols)</td>
                </tr>
                <tr className="hover:bg-[#4F8CFF]/5 transition">
                  <td className="p-4 font-semibold text-[#F8FAFC]">Security Controls</td>
                  <td className="p-4 text-[#94A3B8]">Weak operating system directory permissions</td>
                  <td className="p-4 text-[#F8FAFC]">Strong role mapping and table filter triggers</td>
                </tr>
                <tr className="hover:bg-[#4F8CFF]/5 transition">
                  <td className="p-4 font-semibold text-[#F8FAFC]">Data Backups & Recovery</td>
                  <td className="p-4 text-[#EF4444]">Manual file copies (at risk of corrupt state)</td>
                  <td className="p-4 font-mono text-[11px] text-[#22C55E]">Automated write-ahead logs (WAL) & recovery tools</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
