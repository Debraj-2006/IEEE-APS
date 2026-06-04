import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, AlertCircle, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');

    try {
      await emailjs.sendForm(
        'service_ieeeaps',    // replace with your EmailJS service ID
        'template_ieeeaps',   // replace with your EmailJS template ID
        formRef.current!,
        'YOUR_PUBLIC_KEY'     // replace with your EmailJS public key
      );
      setStatus('success');
      setFormData({ from_name: '', from_email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputBase =
    'w-full bg-surface-container-low/50 border border-outline-variant/20 text-on-surface font-body text-sm px-5 py-4 ' +
    'placeholder:text-on-surface-variant/30 placeholder:font-label placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest ' +
    'focus:outline-none focus:border-primary/50 focus:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300';

  return (
    <section id="contact" className="relative py-28 px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hex-grid-bg opacity-40" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-primary/15" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-primary/15" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-primary/15" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-primary/15" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-primary/50" />
            <span className="font-label text-[9px] text-primary uppercase tracking-[0.4em] font-bold">
              Communication Protocol
            </span>
            <div className="w-8 h-[1px] bg-primary/50" />
          </div>

          <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Establish <span className="text-primary glow-text-primary">Contact</span>
          </h2>

          <p className="text-on-surface-variant/60 font-body text-sm max-w-lg mx-auto leading-relaxed">
            Ready to join the network? Send us a transmission — whether it's about membership, collaborations, or events.
          </p>
        </motion.div>

        {/* Form + Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form — 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-0 relative group">
              <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-[3px] w-full bg-gradient-to-r from-primary via-primary/40 to-transparent" />

              <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                {/* Name field */}
                <div className="relative">
                  <label className="block font-label text-[9px] text-primary/70 uppercase tracking-[0.3em] mb-2 font-bold">
                    Callsign
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className={`${inputBase} pl-11`}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="relative">
                  <label className="block font-label text-[9px] text-primary/70 uppercase tracking-[0.3em] mb-2 font-bold">
                    Frequency // Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30" />
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className={`${inputBase} pl-11`}
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="relative">
                  <label className="block font-label text-[9px] text-primary/70 uppercase tracking-[0.3em] mb-2 font-bold">
                    Transmission Data
                  </label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-4 top-5 text-on-surface-variant/30" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message..."
                      required
                      rows={5}
                      className={`${inputBase} pl-11 resize-none`}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative w-full flex items-center justify-center gap-3
                      font-label uppercase tracking-[0.25em] text-[11px] font-black
                      px-8 py-4 border-2 transition-all duration-300
                      ${status === 'sending'
                        ? 'bg-primary/10 border-primary/30 text-primary/60'
                        : 'bg-primary/5 border-primary/40 text-primary hover:bg-primary hover:text-on-primary hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]'
                      }
                    `}
                  >
                    {/* Corner accents */}
                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
                    <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
                    <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />

                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Transmit Signal
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Status messages */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30"
                    >
                      <CheckCircle size={18} className="text-green-500 shrink-0" />
                      <div>
                        <p className="font-label text-[10px] text-green-500 uppercase tracking-widest font-bold">Signal Received</p>
                        <p className="font-body text-xs text-green-500/70 mt-0.5">We'll respond to your transmission shortly.</p>
                      </div>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle size={18} className="text-red-500 shrink-0" />
                      <div>
                        <p className="font-label text-[10px] text-red-500 uppercase tracking-widest font-bold">Transmission Failed</p>
                        <p className="font-body text-xs text-red-500/70 mt-0.5">Signal interference detected. Try again or email us directly.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Info panel — 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Direct Contact Info */}
            <div className="glass-card p-0 relative group flex-1">
              <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />

              <div className="p-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                    <span className="font-label text-[8px] text-green-500/70 uppercase tracking-widest font-bold">Channel Open</span>
                  </div>
                  <h3 className="font-headline text-xl font-black uppercase tracking-tight mb-2">
                    Direct <span className="text-primary">Channels</span>
                  </h3>
                  <p className="text-on-surface-variant/50 font-body text-sm leading-relaxed">
                    Prefer a direct line? Use these secure channels to reach our command center.
                  </p>
                </div>

                {/* Email */}
                <a
                  href="mailto:ieeeiemaps.sbc@gmail.com"
                  className="flex items-start gap-4 p-4 bg-surface-container-high/20 border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 group/link"
                >
                  <div className="w-10 h-10 shrink-0 bg-primary/5 flex items-center justify-center border border-primary/15 text-primary group-hover/link:bg-primary/15 transition-all">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">Email</p>
                    <p className="font-body text-xs text-on-surface-variant/50 mt-0.5">ieeeiemaps.sbc@gmail.com</p>
                  </div>
                </a>

                {/* Response time */}
                <div className="pt-4 border-t border-outline-variant/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-widest">Avg Response Time</span>
                    <span className="font-label text-[10px] text-primary font-bold">~24 HRS</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-high/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary/60 to-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info card */}
            <div className="glass-card p-0 relative group">
              <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />

              <div className="p-8">
                <h4 className="font-headline text-sm font-black uppercase tracking-tight mb-4">
                  Transmission <span className="text-primary">Guidelines</span>
                </h4>
                <div className="space-y-3">
                  {[
                    'Include your IEEE membership ID if applicable',
                    'Specify event or initiative of interest',
                    'For partnerships, describe your organization',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-primary/50 mt-2 shrink-0" />
                      <p className="font-body text-xs text-on-surface-variant/50 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
