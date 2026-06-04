import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, Code, Check, HelpCircle, ArrowRight, BookMarked } from 'lucide-react';
import { LEARNING_HUB_CONTENT } from '../data/dbmsContent';
import { DbmsContentItem } from '../types';

export default function LearningHub() {
  const [selectedTopic, setSelectedTopic] = useState<DbmsContentItem | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <section id="learning-hub" className="py-24 relative bg-[#0B1020]">
      {/* Dynamic ambient orb overlay */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#4F8CFF]/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[#6C63FF]/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse pointer-events-none delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
            Interactive syllabus
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#F8FAFC] mt-1">
            DBMS Learning Hub
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-[#4F8CFF] to-[#6C63FF] mx-auto mt-4 rounded-full shadow-lg shadow-[#4F8CFF]/20" />
          <p className="text-[#94A3B8] mt-4 text-base font-sans">
            Explore 13 essential database engineering modules complete with real-world schemas, relational constraints, concurrency models, and security principles.
          </p>
        </div>

        {/* 13 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {LEARNING_HUB_CONTENT.map((topic, index) => (
            <motion.div
              key={topic.id}
              id={`learning-card-${topic.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-panel hover:bg-[#151C33]/60 p-5 rounded-2xl shadow-sm hover:shadow-[#4F8CFF]/10 hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-white/10 flex-1 min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-[#151C33] border border-white/10 rounded-full text-[#00D9FF] uppercase tracking-wider">
                    MODULE {index + 1}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-[#4F8CFF]" />
                </div>

                <h3 className="text-base font-display font-bold text-[#F8FAFC] line-clamp-1 mb-2">
                  {topic.title.replace(/^\d+\.\s*/, '')}
                </h3>

                <p className="text-xs text-[#94A3B8] font-sans line-clamp-3 mb-4 leading-relaxed">
                  {topic.shortDesc}
                </p>
              </div>

              <button
                id={`learn-more-btn-${topic.id}`}
                onClick={() => setSelectedTopic(topic)}
                className="mt-auto inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-[#00D9FF] hover:text-[#4F8CFF] group cursor-pointer"
              >
                <span>Read Full Module</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition duration-200" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Learning Hub Detailed Modal Overlay */}
        <AnimatePresence>
          {selectedTopic && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backing Shade */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTopic(null)}
                className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                id="learning-detail-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-[#151C33]/95 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-white/15 z-10 flex flex-col max-h-[85vh] backdrop-blur-xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#0B1020]/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#151C33] border border-white/10 rounded-xl text-[#00D9FF]">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#00D9FF] uppercase tracking-wider">Interactive Study Guide</span>
                      <h2 className="text-lg font-display font-extrabold text-[#F8FAFC]">
                        {selectedTopic.title}
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    id="close-learning-modal-btn"
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Subject Body */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 text-sm text-[#CBD5E1] font-sans leading-relaxed whitespace-pre-line">
                      {selectedTopic.detailedDesc}
                    </div>
                  </div>

                  {/* Schema/Interactive Code Example Card */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden">
                    <div className="bg-[#0B1020]/80 p-3.5 flex items-center justify-between border-b border-white/10">
                      <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase flex items-center space-x-1">
                        <Code className="w-3.5 h-3.5 text-[#4F8CFF]" />
                        <span>Interactive Case Study & Code Example</span>
                      </span>
                      
                      <button
                        id="copy-module-example-btn"
                        onClick={() => handleCopy(selectedTopic.example)}
                        className="px-2.5 py-1.5 bg-[#151C33] rounded-lg text-[10px] font-mono font-bold text-[#94A3B8] border border-white/10 hover:bg-[#151C33]/80 active:scale-95 transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        {copiedState ? (
                          <>
                            <Check className="w-3 h-3 text-[#22C55E]" />
                            <span className="text-[#22C55E]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <span>Copy Syntax</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-[#0B1020]/90 overflow-x-auto text-left">
                      <pre className="text-xs font-mono text-[#00D9FF]/90 leading-relaxed no-scrollbar">
                        <code>{selectedTopic.example}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Quick quiz tip box */}
                  <div className="p-4 rounded-2xl bg-[#151C33]/80 border border-white/10 flex space-x-3">
                    <HelpCircle className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-sans font-bold text-[#00D9FF]">Study Pointer for Academic Project Exams</h4>
                      <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                        Refer to this concept to correctly answer queries in the <strong className="text-[#4F8CFF] hover:text-[#00D9FF] hover:underline cursor-pointer" onClick={() => { setSelectedTopic(null); const el = document.getElementById('quiz'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>DATANEST DBMS Quiz</strong> below!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#0B1020]/60 flex justify-end">
                  <button
                    id="close-learning-modal-footer-btn"
                    onClick={() => setSelectedTopic(null)}
                    className="px-5 py-2.5 bg-[#151C33] text-[#F8FAFC] border border-white/10 rounded-xl font-medium text-xs hover:bg-white/5 active:scale-98 transition cursor-pointer"
                  >
                    Close Module
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
