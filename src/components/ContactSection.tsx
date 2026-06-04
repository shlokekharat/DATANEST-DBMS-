import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, HelpCircle, Check, Landmark, GraduationCap } from 'lucide-react';

export default function ContactSection() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMsg.trim()) return;

    // Simulate sending message success
    setShowSuccess(true);
    setFormName('');
    setFormEmail('');
    setFormMsg('');
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#0B1020] scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-35 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Module Header and Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
            Project Support
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#F8FAFC] mt-1">
            Get in Touch
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-[#00D9FF] to-[#4F8CFF] mx-auto mt-4 rounded-full" />
          <p className="text-[#94A3B8] mt-4 text-base font-sans">
            Have questions about normal forms, SQL transactions, or the mini project requirements? Submit your inquiry directly below.
          </p>
        </div>

        {/* Form and Contact Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Column 1: Academic Contact Cards (Shloke Jagan Kharat) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Clickable Card 1: Main Creator details */}
            <div className="glass-panel p-5.5 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] relative overflow-hidden text-left flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="p-2.5 bg-[#0B1020] rounded-xl text-[#00D9FF] w-fit border border-white/5">
                  <GraduationCap className="w-5 h-5 animate-pulse" />
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold text-[#94A3B8] uppercase tracking-widest">Lead Designer</h4>
                  <p className="text-lg font-display font-black text-[#F8FAFC] mt-1">Shloke Jagan Kharat</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5 font-sans leading-relaxed">
                    Department of Computer and IoT Engineering • Academic Mini Project Coordinator
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-[#94A3B8] flex items-center space-x-1">
                <Landmark className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Modern Database Evaluation Labs.</span>
              </div>
            </div>

            {/* Clickable Card 2: Contact Numbers */}
            <a 
              href="tel:+917620780541"
              id="contact-phone-card"
              className="glass-panel p-4 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] hover:scale-[1.01] transition duration-200 flex items-center space-x-4 text-left cursor-pointer hover:border-[#00D9FF]/30"
              title="Call Project Lead"
            >
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-[#00D9FF] shrink-0 border border-emerald-500/10">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase font-bold text-[#94A3B8] tracking-wider">Direct Hotline</p>
                <p className="text-xs font-mono font-bold text-[#F8FAFC] mt-0.5 hover:underline">+91 7620780541</p>
              </div>
            </a>

            {/* Clickable Card 3: Academic mail inbox */}
            <a 
              href="mailto:shlokekharat08@gmail.com"
              id="contact-email-card"
              className="glass-panel p-4 rounded-2xl border border-white/10 shadow-sm bg-[#151C33]/65 text-[#F8FAFC] hover:scale-[1.01] transition duration-200 flex items-center space-x-4 text-left cursor-pointer hover:border-[#00D9FF]/30"
              title="Send an email dispatch"
            >
              <div className="p-2.5 bg-[#00D9FF]/10 rounded-xl text-[#00D9FF] shrink-0 border border-[#00D9FF]/10">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase font-bold text-[#94A3B8] tracking-wider">Academic Inbox</p>
                <p className="text-xs font-mono font-bold text-[#F8FAFC] mt-0.5 truncate hover:underline">shlokekharat08@gmail.com</p>
              </div>
            </a>

          </div>

          {/* Column 2: Modern Glass-panel Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm h-full bg-[#151C33]/65 text-[#F8FAFC] relative">
              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-4 text-left"
                  >
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#94A3B8] mb-1">Your Full Name *</label>
                      <input
                        id="contact-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Sameer Deshmukh"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-sans font-bold text-[#F8FAFC] placeholder-[#94A3B8]/30 focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#94A3B8] mb-1">Email Address *</label>
                      <input
                        id="contact-email-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. sameer@example.com"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-sans font-medium text-[#F8FAFC] placeholder-[#94A3B8]/30 focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#94A3B8] mb-1">Your Message Query *</label>
                      <textarea
                        id="contact-msg-input"
                        value={formMsg}
                        onChange={(e) => setFormMsg(e.target.value)}
                        placeholder="Write details about your normalisation block query here..."
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-sans font-medium text-[#F8FAFC] placeholder-[#94A3B8]/30 focus:outline-none focus:border-[#00D9FF] min-h-[90px] resize-none"
                        required
                      />
                    </div>

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      className="w-full p-3.5 bg-gradient-to-r from-[#00D9FF] to-[#4F8CFF] text-[#0B1020] font-sans text-xs font-black rounded-xl cursor-pointer hover:shadow-lg hover:shadow-[#00D9FF]/10 active:scale-98 transition flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5 fill-[#0B1020]/10" />
                      <span>Send Query Message</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center h-full py-8 text-xs font-sans leading-relaxed"
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-3 shadow-lg border border-white/10">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <p className="text-sm font-display font-black text-[#F8FAFC]">Query Received Successfully</p>
                    <p className="text-[#94A3B8] max-w-xs mt-1.5 leading-relaxed">
                      Thank you! Your message query was compiled and dispatched to <strong className="text-white font-bold">Shloke Jagan Kharat</strong> successfully. I'll get back to you soon.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
