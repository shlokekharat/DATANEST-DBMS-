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
    <section id="learning-hub" className="py-24 relative bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-indigo-600 dark:text-indigo-400 font-bold">
            Interactive syllabus
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            DBMS Learning Hub
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-base font-sans">
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
              className="glass-panel p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-gray-150 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-950 flex-1 h-full h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-full text-indigo-600 dark:text-indigo-450 uppercase tracking-wider">
                    MODULE {index + 1}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                </div>

                <h3 className="text-base font-display font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">
                  {topic.title.replace(/^\d+\.\s*/, '')}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 font-sans line-clamp-3 mb-4 leading-relaxed">
                  {topic.shortDesc}
                </p>
              </div>

              <button
                id={`learn-more-btn-${topic.id}`}
                onClick={() => setSelectedTopic(topic)}
                className="mt-auto inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group cursor-pointer"
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
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                id="learning-detail-modal"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 z-10 flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">Interactive Study Guide</span>
                      <h2 className="text-lg font-display font-extrabold text-gray-900 dark:text-white">
                        {selectedTopic.title}
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    id="close-learning-modal-btn"
                    onClick={() => setSelectedTopic(null)}
                    className="p-1 px-1 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Subject Body */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-200 font-sans leading-relaxed whitespace-pre-line">
                      {selectedTopic.detailedDesc}
                    </div>
                  </div>

                  {/* Schema/Interactive Code Example Card */}
                  <div className="border border-gray-150 dark:border-slate-850 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-950 p-3.5 flex items-center justify-between border-b border-gray-150 dark:border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center space-x-1">
                        <Code className="w-3.5 h-3.5 text-blue-500" />
                        <span>Interactive Case Study & Code Example</span>
                      </span>
                      
                      <button
                        id="copy-module-example-btn"
                        onClick={() => handleCopy(selectedTopic.example)}
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-indigo-950/20 active:scale-95 transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        {copiedState ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <span>Copy Syntax</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950 overflow-x-auto text-left">
                      <pre className="text-xs font-mono text-cyan-400/90 leading-relaxed no-scrollbar">
                        <code>{selectedTopic.example}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Quick quiz tip box */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 flex space-x-3">
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-sans font-bold text-blue-700 dark:text-blue-400">Study Pointer for Academic Project Exams</h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        Refer to this concept to correctly answer queries in the <strong className="text-blue-600 dark:text-blue-450 hover:underline cursor-pointer" onClick={() => { setSelectedTopic(null); const el = document.getElementById('dbms-quiz'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>DATANEST DBMS Quiz</strong> below!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30 flex justify-end">
                  <button
                    id="close-learning-modal-footer-btn"
                    onClick={() => setSelectedTopic(null)}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-xs hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-98 transition cursor-pointer"
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
