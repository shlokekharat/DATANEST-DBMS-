import { Database, Heart, Mail, Phone, ExternalLink } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0B1020] text-slate-400 border-t border-white/10 pt-16 pb-8 font-sans relative overflow-hidden">
      {/* Dynamic drifting background neon glow */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#6C63FF]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-48 h-48 bg-[#00D9FF]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-4 space-y-4 text-left">
            <Logo 
              onClick={() => onNavigate('home')} 
              size="md" 
            />
            <p className="text-xs font-mono font-semibold text-[#00D9FF] tracking-wider uppercase">
              Smart Data Management Made Simple
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              DATANEST is a modern database management platform that combines an intuitive CRUD interface, real-time analytics, and an interactive DBMS learning environment. Built with a premium glassmorphic theme.
            </p>
          </div>

          {/* Column 2: Features Navigation anchors */}
          <div className="md:col-span-4 space-y-4 text-left md:pl-10">
            <h4 className="text-xs font-mono font-extrabold uppercase text-white tracking-widest border-b border-white/10 pb-2 w-fit">
              Features
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs font-bold font-sans">
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="text-left text-slate-400 hover:text-[#00D9FF] transition duration-155 cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('analytics')} 
                className="text-left text-slate-400 hover:text-[#00D9FF] transition duration-155 cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Analytics
              </button>
              <button 
                onClick={() => onNavigate('student-database')} 
                className="text-left text-slate-400 hover:text-[#00D9FF] transition duration-155 cursor-pointer uppercase tracking-wider text-[11px]"
              >
                CRUD Records
              </button>
              <button 
                onClick={() => onNavigate('learning-hub')} 
                className="text-left text-slate-400 hover:text-[#00D9FF] transition duration-155 cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Learning Hub
              </button>
            </div>
          </div>

          {/* Column 3: Developed By Information */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-mono font-extrabold uppercase text-white tracking-widest border-b border-white/10 pb-2 w-fit">
              Developed by
            </h4>
            <div className="space-y-1.5 font-sans">
              <p className="text-sm font-black text-white hover:text-[#4F8CFF] transition-colors">
                Shloke Jagan Kharat
              </p>
              <p className="text-xs text-[#CBD5E1]">
                Department of Computer and IoT Engineering
              </p>
              <span className="inline-block px-2.5 py-1 bg-[#151C33] border border-white/10 rounded-lg text-[9px] font-mono font-bold text-[#00D9FF] tracking-wider uppercase">
                Academic Mini Project
              </span>
            </div>
          </div>

        </div>

        {/* Separator Line */}
        <div className="border-t border-white/10 my-8" />

        {/* Developer Contact detail bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-left">
          <div className="space-y-1">
            <p className="text-[11px] font-mono text-slate-500">
              Department of Computer and IoT Engineering • Academic Mini Project 2026
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5">
            <a 
              href="mailto:shlokekharat08@gmail.com"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#151C33] border border-white/10 rounded-xl hover:border-[#00D9FF] hover:text-[#00D9FF] transition text-[10px] font-mono font-bold"
            >
              <Mail className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>shlokekharat08@gmail.com</span>
            </a>
            <a 
              href="tel:+917620780541"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#151C33] border border-white/10 rounded-xl hover:border-emerald-400 hover:text-emerald-400 transition text-[10px] font-mono font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 7620780541</span>
            </a>
          </div>
        </div>

        {/* Final Copyright metadata tag */}
        <div className="text-center mt-12 pt-6 border-t border-white/5 text-[11px] font-mono text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 DATANEST. All Rights Reserved.</p>
          <p className="text-[10px] text-slate-550 flex items-center space-x-1 uppercase">
            <span>Optimized for security and instant transactional speed</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
