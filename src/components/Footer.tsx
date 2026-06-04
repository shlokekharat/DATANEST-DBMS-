import { Database, Mail, Phone, BookMarked, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-6">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl">
                <Database className="w-4.5 h-4.5" />
              </div>
              <span className="text-xl font-display font-black tracking-tight text-white uppercase">
                DATANEST
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              DATANEST is a modern, responsive Database Management and CRUD Learning Platform designed and developed for educational academic purposes, combining academic learning content with dashboard analytics tools.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Study Guides
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button onClick={() => onNavigate('about-dbms')} className="text-left hover:text-white transition duration-150 cursor-pointer">About DBMS Theory</button>
              <button onClick={() => onNavigate('learning-hub')} className="text-left hover:text-white transition duration-150 cursor-pointer">13 Learning Modules</button>
              <button onClick={() => onNavigate('sql-playground')} className="text-left hover:text-white transition duration-150 cursor-pointer">SQL Query Playground</button>
              <button onClick={() => onNavigate('quiz')} className="text-left hover:text-white transition duration-150 cursor-pointer">MCQ Knowledge Quiz</button>
            </div>
          </div>

          {/* Column 3: Professional Tools */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Student Records Dashboard
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button onClick={() => onNavigate('dashboard')} className="text-left hover:text-white transition duration-150 cursor-pointer">Stats Dashboard Overview</button>
              <button onClick={() => onNavigate('student-database')} className="text-left hover:text-white transition duration-150 cursor-pointer">CRUD Core Record Database</button>
              <button onClick={() => onNavigate('analytics')} className="text-left hover:text-white transition duration-150 cursor-pointer">Interactive Metrics Analytics</button>
              <button onClick={() => onNavigate('activity-log')} className="text-left hover:text-white transition duration-150 cursor-pointer">System Activity Timelines</button>
            </div>
          </div>

        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-900 my-8" />

        {/* Designer information banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center text-xs">
          
          {/* Left crediting details */}
          <div className="space-y-2 text-left">
            <p className="text-[13px] text-white font-semibold">
              Designed and Developed with precision by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold font-display">
                Shloke Jagan Kharat
              </span>
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Department of Computer and IoT Engineering • Academic Mini Project 2026
            </p>
          </div>

          {/* Right contact icons row */}
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <a 
              href="mailto:shlokekharat08@gmail.com"
              className="inline-flex items-center space-x-1.5 p-2 bg-slate-900 border border-slate-850 rounded-xl hover:border-slate-700 hover:text-white transition text-[11px]"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>shlokekharat08@gmail.com</span>
            </a>
            <a 
              href="tel:+917620780541"
              className="inline-flex items-center space-x-1.5 p-2 bg-slate-900 border border-slate-850 rounded-xl hover:border-slate-700 hover:text-white transition text-[11px]"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 7620780541</span>
            </a>
          </div>

        </div>

        {/* Final copy claims */}
        <div className="text-center mt-12 pt-6 border-t border-slate-900/40 text-[10px] text-slate-600 font-mono">
          <p>© 2026 DATANEST. All Rights Reserved. Optimized for high performance and educational storage evaluations.</p>
        </div>

      </div>
    </footer>
  );
}
