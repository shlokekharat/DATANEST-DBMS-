import { motion } from 'motion/react';
import { Database, Terminal, Shield, Award, ArrowRight, Play, Cpu, Network } from 'lucide-react';

interface HomeProps {
  onNavigate: (sectionId: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <section id="home" className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Floating Gradients */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 dark:opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 dark:opacity-20 animate-pulse pointer-events-none delay-1000" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Brand Value Proposition */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 px-4 py-1.5 rounded-full text-xs font-mono w-fit"
          >
            <Database className="w-3.5 h-3.5 animate-bounce" />
            <span>Academic Mini Project 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-gray-950 dark:text-white"
          >
            Database Management System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 font-extrabold">(DBMS)</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 font-sans max-w-xl leading-relaxed"
          >
            Learn fundamental relational theories, practice SQL schemas in real time, inspect schemas visually, and master CRUD record setups dynamically inside <strong className="text-gray-900 dark:text-white">DATANEST</strong>.
          </motion.p>

          {/* Interactive Feature list */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 text-sm font-medium"
          >
            <div className="flex items-center space-x-2.5 text-gray-700 dark:text-gray-300">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
                <Terminal className="w-4 h-4" />
              </div>
              <span>SQL Sandbox Compiler</span>
            </div>
            <div className="flex items-center space-x-2.5 text-gray-700 dark:text-gray-300">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Network className="w-4 h-4" />
              </div>
              <span>Interactive ER Diagrams</span>
            </div>
            <div className="flex items-center space-x-2.5 text-gray-700 dark:text-gray-300">
              <div className="p-1.5 bg-cyan-100 dark:bg-cyan-950/60 rounded-lg text-cyan-600 dark:text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span>ACID Learning modules</span>
            </div>
            <div className="flex items-center space-x-2.5 text-gray-700 dark:text-gray-300">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <span>Interactive DBMS Quiz</span>
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
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-98 transition flex items-center space-x-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              id="hero-sandbox-btn"
              onClick={() => onNavigate('sql-playground')}
              className="px-6 py-3.5 bg-white dark:bg-slate-900 text-gray-800 dark:text-white rounded-xl font-medium border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-98 transition flex items-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-blue-500 fill-blue-500/10" />
              <span>SQL Playground</span>
            </button>
          </motion.div>
          
        </div>

        {/* Right Side: Animated DBMS Graphics & Interactive Schema Illustration */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full max-w-md h-[400px] flex items-center justify-center"
          >
            {/* Visual Glass Base Card */}
            <div className="absolute inset-0 glass-panel rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 p-3 rounded-2xl border border-white/40 dark:border-white/5">
                <div className="flex space-x-2 items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center space-x-1.5 bg-white/60 dark:bg-slate-950 px-3 py-1 rounded-lg">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span>datanest_db_server</span>
                </div>
              </div>

              {/* Graphic Illustration of Database Stack */}
              <div className="flex-1 flex flex-col justify-center items-center relative py-6">
                
                {/* Floating Columns & Nodes */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute left-6 top-8 glass-card rounded-xl p-2.5 shadow-md flex items-center space-x-2 border border-blue-200/50 text-blue-600 dark:text-blue-400"
                >
                  <span className="text-[10px] font-mono font-bold">PRIMARY KEY</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
                  className="absolute right-6 bottom-10 glass-card rounded-xl p-2.5 shadow-md flex items-center space-x-2 border border-indigo-200/50 text-indigo-600 dark:text-indigo-400"
                >
                  <span className="text-[10px] font-mono font-bold">COMMIT EXECUTED</span>
                </motion.div>

                {/* Database Stack Illustration */}
                <div className="relative z-10 flex flex-col space-y-3 items-center">
                  {/* Cylinder Top Layer */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-44 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex flex-col items-center justify-center shadow-lg text-white border border-blue-400/30 relative"
                  >
                    <div className="absolute -top-1 w-44 h-14 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-xs font-mono font-bold tracking-wider flex items-center space-x-1">
                        <Database className="w-3.5 h-3.5 mr-1" /> EXER_VIEW
                      </span>
                    </div>
                  </motion.div>

                  {/* Connective Line */}
                  <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-400 dark:to-indigo-600" />

                  {/* Cylinder Mid Layer */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-18 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full flex flex-col items-center justify-center shadow-lg text-white border border-indigo-400/30 relative"
                  >
                    <div className="absolute -top-1 w-48 h-16 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-xs font-mono font-bold tracking-wider flex items-center space-x-1 text-slate-900">
                        CONCEPTUAL_SCHEMA
                      </span>
                    </div>
                  </motion.div>

                  {/* Connective Line */}
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-cyan-400 dark:to-cyan-600" />

                  {/* Cylinder Bottom Layer */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-52 h-20 bg-slate-800 dark:bg-slate-950 rounded-full flex flex-col items-center justify-center shadow-lg text-white border border-slate-700 relative"
                  >
                    <div className="absolute -top-1.5 w-52 h-18 bg-slate-700 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner border border-slate-650">
                      <span className="text-xs font-mono font-bold tracking-wider flex items-center space-x-1 text-cyan-400">
                        INTERNAL_STORAGE
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Minimalist Dashboard Stats Accent */}
              <div className="bg-white/40 dark:bg-slate-950/40 p-3 rounded-2xl border border-white/20 dark:border-white/5 flex justify-between text-center text-xs font-mono text-gray-500 dark:text-gray-400">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">I/O RATIO</p>
                  <p className="font-bold text-gray-800 dark:text-white">99.98%</p>
                </div>
                <div className="border-l border-gray-200 dark:border-slate-800 h-6 my-auto" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">ENGINE</p>
                  <p className="font-bold text-indigo-500">RDBMS-2.0</p>
                </div>
                <div className="border-l border-gray-200 dark:border-slate-800 h-6 my-auto" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">LATENCY</p>
                  <p className="font-bold text-emerald-500">~1.2ms</p>
                </div>
              </div>
            </div>
            
            {/* Ambient Background Glow of Server */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500/20 rounded-full filter blur-xl pointer-events-none" />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
