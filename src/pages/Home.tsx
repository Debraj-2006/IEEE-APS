/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Network, 
  Terminal, 
  Radar, 
  Satellite, 
  Users, 
  FlaskConical, 
  MapPin, 
  Mail, 
  Menu,
  X,
  Cpu,
  Zap,
  ChevronRight,
  ArrowUpRight,
  Signal,
  Shield,
  Award,
  BookOpen,
  FileText,
  Linkedin,
  Instagram,
  Facebook
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Antenna3D } from "../components/Antenna3D";
import { TeamSection } from "../components/TeamSection";
import { LoadingScreen } from "../components/LoadingScreen";

const TerminalText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 50);
    }, delay * 1000);
    
    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className="font-mono">
      {displayText}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
      />
    </span>
  );
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const NavItem = ({ href, label, active = false }: { href: string; label: string; active?: boolean }) => (
  <a 
    href={href} 
    className={`font-label uppercase tracking-[0.2em] text-[10px] font-bold transition-colors duration-300 pb-1 border-b-2 ${
      active ? "text-primary border-primary" : "text-on-surface-variant hover:text-primary border-transparent"
    }`}
  >
    {label}
  </a>
);

const Metric = ({ label, value, progress }: { label: string; value: string; progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-label uppercase tracking-wider">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-primary">{value}</span>
    </div>
    <div className="w-full h-[2px] bg-surface-container-highest">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="bg-primary h-full shadow-[0_0_8px_rgba(0,212,255,0.6)]"
      />
    </div>
  </div>
);

const EventCard = ({ status, code, title, subtitle, date, image, link, index = 0 }: any) => (
  <Link to={link || "#"} className="block group event-card-enhanced">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
    >
    <div className="glass-card relative overflow-hidden">
      {/* Scan line effect */}
      <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image area */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[50%] group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/30 to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Upcoming' ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'bg-secondary shadow-[0_0_8px_rgba(190,0,39,0.6)]'}`} />
          <span className={`font-label text-[9px] uppercase font-bold tracking-widest ${status === 'Upcoming' ? 'text-primary' : 'text-secondary'}`}>
            {status}
          </span>
        </div>

        {/* Code badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-surface-dim/60 backdrop-blur-sm border border-outline-variant/20">
          <span className="font-label text-[9px] text-primary uppercase tracking-widest font-bold">{code}</span>
        </div>
      </div>

      <div className="p-6">
        <h4 className={`font-headline text-lg font-black text-on-surface uppercase tracking-tight ${subtitle ? 'mb-1' : 'mb-3'} group-hover:text-primary transition-colors duration-300`}>{title}</h4>
        {subtitle && <p className="font-label text-xs text-primary uppercase tracking-widest mb-3 font-bold">{subtitle}</p>}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-label text-on-surface-variant/60 uppercase tracking-widest">{date}</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    </motion.div>
  </Link>
);

const BenefitCard = ({ icon: Icon, title, description, clearance, index = "01" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.4 }}
    className="glass-card p-10 group hover:border-primary/30 transition-all duration-500 relative"
  >
    {/* Scan line */}
    <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity" />
    
    {/* Index number */}
    <div className="absolute top-6 right-8 font-headline text-6xl font-black text-primary/[0.04] group-hover:text-primary/[0.08] transition-colors duration-500 select-none">
      {index}
    </div>

    {/* Icon */}
    <div className="mb-8 w-16 h-16 relative">
      <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full group-hover:bg-primary/20 transition-all duration-500" />
      <div className="relative w-full h-full bg-surface-container-high/80 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 text-primary">
        <Icon size={26} />
      </div>
    </div>

    <h3 className="font-headline text-xl font-black mb-4 uppercase text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-8 opacity-70 group-hover:opacity-90 transition-opacity">
      {description}
    </p>
    
    {/* Clearance tag */}
    <div className="flex items-center gap-2">
      <div className="w-4 h-[1px] bg-primary/40 group-hover:w-8 transition-all duration-300" />
      <div className="text-[9px] font-label text-primary uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">
        {clearance}
      </div>
    </div>

    {/* Bottom accent */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
);

const TeamMember = ({ name, role, image, badge, index = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="text-center group"
  >
    <div className="relative inline-block mb-8">
      {/* Glow effect behind photo */}
      <div className="absolute inset-4 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/15 transition-all duration-700" />
      
      <div className="relative w-44 h-44 md:w-56 md:h-56 mx-auto">
        {/* Outer frame */}
        <div className="absolute inset-0 border border-primary/10 group-hover:border-primary/40 transition-all duration-500" />
        
        {/* Inner photo container */}
        <div className="absolute inset-2 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Scan line on hover */}
          <div className="absolute left-0 w-full h-[2px] bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" style={{ top: '30%', filter: 'blur(1px)', boxShadow: '0 0 10px rgba(0,212,255,0.4)' }} />
        </div>
        
        {/* Corner Accents - animated */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-primary/40 group-hover:border-primary group-hover:w-6 group-hover:h-6 transition-all duration-300" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-primary/40 group-hover:border-primary group-hover:w-6 group-hover:h-6 transition-all duration-300" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-primary/40 group-hover:border-primary group-hover:w-6 group-hover:h-6 transition-all duration-300" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-primary/40 group-hover:border-primary group-hover:w-6 group-hover:h-6 transition-all duration-300" />
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-1 text-[8px] font-label uppercase font-black tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.3)] z-10">
          <div className="flex items-center gap-1">
            <Shield size={8} />
            {badge}
          </div>
        </div>
      )}
    </div>
    <h4 className="font-headline text-lg font-black text-on-surface uppercase mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">{name}</h4>
    <p className="font-label text-[10px] text-primary/70 uppercase tracking-[0.25em] group-hover:text-primary transition-colors">{role}</p>
  </motion.div>
);

// EDIT YOUR SOCIAL MEDIA LINKS HERE:
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/ieee-iem-aps-student-branch-chapter/",
  instagram: "https://www.instagram.com/ieeeiemaps.official?igsh=MWh2dTY5bjU2aHNrdA==",
  facebook: ""
};

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="selection:bg-primary selection:text-on-primary">
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dim pt-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-surface-dim z-10" />
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
            alt="hero-bg" 
            className="w-full h-full object-cover opacity-20 hero-earth-spin"
            referrerPolicy="no-referrer"
          />
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        </motion.div>

        <div className="relative z-20 w-full max-w-7xl px-8 flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center pt-8 lg:pt-0">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block border-l-4 border-primary bg-primary/5 px-6 py-2 mb-8 corner-accent relative mx-auto lg:mx-0"
            >
              <p className="font-label text-[10px] tracking-[0.5em] text-primary uppercase font-bold">
                <TerminalText text="SYSTEM STATUS: ONLINE // AUTH: OMEGA" delay={0.5} />
              </p>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-headline text-5xl sm:text-6xl md:text-8xl font-black text-on-surface mb-6 tracking-tighter leading-[0.85] uppercase"
            >
              IEEE APS <br />
              <span className="text-primary glow-text-primary flicker">IEM CHAPTER</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-base sm:text-lg text-on-surface-variant mb-12 tracking-[0.15em] max-w-xl uppercase font-light leading-relaxed"
            >
              Advancing the frontiers of <span className="text-primary font-bold">Electromagnetics</span>, <span className="text-primary font-bold">Antennas</span>, and <span className="text-primary font-bold">Wave Propagation</span> through tactical innovation.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center lg:items-start w-full sm:w-auto"
            >
              <a
                href="/how-to-join-aps.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-12 py-4 bg-primary text-on-primary font-label font-black uppercase tracking-[0.2em] text-xs glow-primary hover:bg-white transition-all glitch-hover flex items-center justify-center gap-2"
              >
                <FileText size={14} />
                Join the Mission
              </a>
              <button className="w-full sm:w-auto px-12 py-4 border border-primary/40 text-primary font-label font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/10 transition-all">
                View Dossier
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full relative"
            style={{ overflow: 'visible' }}
          >
            <Antenna3D />
          </motion.div>
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-4 left-6 hidden lg:block border-l-2 border-primary/40 pl-4 py-2">
          <p className="text-[9px] font-label text-primary/50 uppercase tracking-[0.3em] mb-2">Coordinates</p>
          <p className="text-xs font-label text-primary uppercase tracking-widest font-bold">22.5726° N, 88.3639° E</p>
        </div>
        <div className="absolute bottom-4 right-6 hidden lg:block border-r-2 border-primary/40 pr-4 py-2 text-right">
          <p className="text-[9px] font-label text-primary/50 uppercase tracking-[0.3em] mb-2">Scanning Frequency</p>
          <p className="text-xs font-label text-primary uppercase tracking-widest font-bold">2.4 GHz - 5.8 GHz Active</p>
        </div>
      </section>

      {/* About Section — CLASSIFIED BRIEFING */}
      <section id="about" className="py-32 px-8 bg-surface relative overflow-hidden">
        {/* Subtle hex grid background */}
        <div className="absolute inset-0 hex-grid-bg opacity-30" />
        
        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 w-full">
              <Shield size={16} className="text-primary" />
              <div className="w-12 h-[1px] gradient-line-animated" />
              <span className="font-label text-[9px] text-primary/50 uppercase tracking-[0.3em]">Section Alpha</span>
            </div>
            <div className="flex items-center lg:items-end justify-center lg:justify-start gap-4 lg:gap-6 flex-wrap w-full">
              <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase tracking-tighter">
                <TerminalText text="CLASSIFIED BRIEFING" delay={1} />
              </h2>
              <div className="hidden lg:block h-[1px] flex-grow bg-gradient-to-r from-primary/30 to-transparent mb-3" />
              <p className="font-label text-[10px] text-primary/40 tracking-[0.3em] uppercase font-bold mb-3">ID: APS-IEM-001</p>
            </div>
          </motion.div>

          {/* Stats Bar — Top */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Active Members", value: "150+", icon: Users },
              { label: "Initiatives Completed", value: "42", icon: Signal },
              { label: "Research Papers", value: "12", icon: BookOpen },
              { label: "Tech Readiness", value: "98%", icon: Cpu },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <stat.icon size={14} />
                  </div>
                  <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="font-headline text-3xl font-black text-primary glow-text-primary">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Core Directive — takes 3 cols */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 glass-card p-0 relative group"
            >
              {/* Card scan line */}
              <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Top bar accent */}
              <div className="h-[3px] w-full bg-gradient-to-r from-primary via-primary/40 to-transparent" />
              
              <div className="p-10 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                  <span className="font-label text-[9px] text-primary uppercase tracking-[0.3em] font-bold">Core Directive // Protocol A-1</span>
                </div>
                
                <h3 className="font-headline text-3xl font-black mb-6 text-on-surface uppercase tracking-tight">
                  Our <span className="text-primary">Mission</span>
                </h3>
                
                <p className="text-on-surface-variant leading-relaxed text-lg font-body font-light mb-10 opacity-80">
                  IEEE Antennas and Propagation Society (APS) at IEM Student Branch is an elite division focused on advancing the science of electromagnetics. We explore the boundaries of antenna technology and radio wave propagation through rigorous research and tactical deployment of knowledge.
                </p>

                {/* What We Do — 2 column list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Radar, label: "Wave Propagation", desc: "Analysis & Research" },
                    { icon: Satellite, label: "Antenna Design", desc: "Advanced Fabrication" },
                    { icon: Cpu, label: "EMC Testing", desc: "Compatibility Analysis" },
                    { icon: Zap, label: "RF Engineering", desc: "Signal Processing" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-surface-container-high/30 border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 group/item"
                    >
                      <div className="w-10 h-10 shrink-0 bg-primary/5 flex items-center justify-center border border-primary/15 text-primary group-hover/item:bg-primary/15 transition-all">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">{item.label}</p>
                        <p className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right column — Status & Vision — takes 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* System Status Panel */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-0 relative group flex-1"
              >
                <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-primary/40 to-primary" />
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-headline text-xl font-black uppercase tracking-tight">System Metrics</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                      <span className="font-label text-[8px] text-green-500/70 uppercase tracking-widest font-bold">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <Metric label="Active Agents" value="150+" progress={85} />
                    <Metric label="Ops Completed" value="42" progress={60} />
                    <Metric label="Tech Readiness" value="Optimal" progress={95} />
                    <Metric label="Network Uptime" value="99.9%" progress={99} />
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-outline-variant/15 flex items-center justify-between">
                    <span className="text-[9px] font-label text-on-surface-variant/30 tracking-widest uppercase">
                      Last Sync: <TerminalText text="29/03/26 09:21 UTC" delay={2} />
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-primary/40" />
                      <div className="w-1 h-3 bg-primary/60" />
                      <div className="w-1 h-3 bg-primary/80" />
                      <div className="w-1 h-3 bg-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Vision Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card p-0 relative group"
              >
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-secondary/40 to-secondary" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Award size={16} className="text-secondary" />
                    <span className="font-label text-[9px] text-secondary uppercase tracking-[0.3em] font-bold">Chapter Vision</span>
                  </div>
                  <p className="text-on-surface-variant/70 font-body text-sm leading-relaxed">
                    To be the premier student-led community driving innovation in antenna technology, electromagnetic research, and wireless communication across Eastern India.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-32 px-8 bg-surface-dim relative overflow-hidden">
        {/* Background hex grid */}
        <div className="absolute inset-0 hex-grid-bg opacity-50" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-20 gap-8 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start w-full">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 w-full">
                <Signal size={16} className="text-primary" />
                <div className="w-12 h-[1px] gradient-line-animated" />
              </div>
              <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4">
                <TerminalText text="INITIATIVES" delay={0.5} />
              </h2>
              <p className="font-label text-[10px] text-primary/60 tracking-[0.4em] uppercase font-bold">Programs & Operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <EventCard 
              status="Active"
              code="IN-WEBINAR"
              title="Webinar"
              date="ONGOING"
              image="/event/eclypse.jpeg"
              link="/initiatives/webinar"
              index={0}
            />
            <EventCard 
              status="Active"
              code="IN-WORKSHOP"
              title="Workshop"
              subtitle="MATLAB"
              date="ONGOING"
              image="/event/matlab.jpeg"
              link="/initiatives/workshop"
              index={1}
            />
            <EventCard 
              status="Active"
              code="IN-TECHTALK"
              title="Tech Talk"
              date="ONGOING"
              image="/event/promptx.jpeg"
              link="/initiatives/techtalk"
              index={2}
            />
            <EventCard 
              status="Active"
              code="IN-INDUSTRY"
              title="Industrial Visit"
              date="ONGOING"
              image="/event/sytron.jpeg"
              link="/initiatives/industry"
              index={3}
            />
            <EventCard 
              status="Active"
              code="IN-EVENT"
              title="Events"
              date="ONGOING"
              image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
              link="/initiatives/event"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 px-8 bg-surface relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 hex-grid-bg" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
              <Award size={16} className="text-primary" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase mb-4 tracking-tighter px-2">Personnel Benefits</h2>
            <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-[0.4em]">What you gain by joining the chapter</p>
            <div className="w-24 h-[2px] gradient-line-animated mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={Terminal}
              title="Skill Augmentation"
              description="Access specialized workshops and seminars on electromagnetic theory and practical antenna fabrication protocols."
              clearance="Level 1 Clearance Required"
              index="01"
            />
            <BenefitCard 
              icon={Users}
              title="Tactical Network"
              description="Connect with industry experts, IEEE Distinguished Lecturers, and a global network of A&P researchers."
              clearance="Global Uplink Established"
              index="02"
            />
            <BenefitCard 
              icon={FlaskConical}
              title="Innovation Labs"
              description="Get hands-on experience with simulation tools and hardware testing environments for microwave research."
              clearance="Experimental Protocol Active"
              index="03"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Social Hub Section */}
      <section id="social" className="py-32 px-8 bg-surface-dim relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 hex-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.03)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
              <Signal size={16} className="text-primary" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase mb-4 tracking-tighter px-2">Social Uplink</h2>
            <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-[0.4em]">Connect with us across all communication channels</p>
            <div className="w-24 h-[2px] gradient-line-animated mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* LinkedIn Card */}
            <motion.a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-panel border border-outline-variant/20 hover:border-[#0077B5]/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/0 to-[#0077B5]/0 group-hover:from-[#0077B5]/10 group-hover:to-[#00a0dc]/5 transition-all duration-500" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30 group-hover:border-[#0077B5] transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30 group-hover:border-[#0077B5] transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30 group-hover:border-[#0077B5] transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30 group-hover:border-[#0077B5] transition-colors duration-300" />

              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0077B5] rounded-full animate-pulse shadow-[0_0_6px_rgba(0,119,181,0.8)]" />
                  <span className="font-label text-[8px] text-[#0077B5]/60 uppercase tracking-widest">Active</span>
                </div>

                <div className="w-20 h-20 flex items-center justify-center bg-[#0077B5]/10 border border-[#0077B5]/20 group-hover:bg-[#0077B5]/20 group-hover:border-[#0077B5]/40 transition-all duration-500 mb-6 group-hover:shadow-[0_0_30px_rgba(0,119,181,0.3)]">
                  <Linkedin size={36} className="text-[#0077B5] group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="font-headline text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#0077B5] transition-colors">LinkedIn</h3>
                <p className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-[0.25em] mb-6">Professional Network</p>
                <p className="font-body text-sm text-on-surface-variant/60 leading-relaxed mb-8">Follow our chapter for updates on events, research breakthroughs, and professional development opportunities.</p>
                
                <div className="flex items-center gap-2 text-[#0077B5] font-label text-[10px] uppercase tracking-widest font-bold group-hover:gap-4 transition-all duration-300">
                  <span>Connect</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            {/* Instagram Card */}
            <motion.a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-panel border border-outline-variant/20 hover:border-[#E1306C]/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4]/0 via-[#FD1D1D]/0 to-[#F56040]/0 group-hover:from-[#833AB4]/10 group-hover:via-[#FD1D1D]/5 group-hover:to-[#F56040]/10 transition-all duration-500" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30 group-hover:border-[#E1306C] transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30 group-hover:border-[#E1306C] transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30 group-hover:border-[#E1306C] transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30 group-hover:border-[#E1306C] transition-colors duration-300" />

              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#E1306C] rounded-full animate-pulse shadow-[0_0_6px_rgba(225,48,108,0.8)]" />
                  <span className="font-label text-[8px] text-[#E1306C]/60 uppercase tracking-widest">Active</span>
                </div>

                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F56040]/10 border border-[#E1306C]/20 group-hover:from-[#833AB4]/20 group-hover:via-[#FD1D1D]/20 group-hover:to-[#F56040]/20 group-hover:border-[#E1306C]/40 transition-all duration-500 mb-6 group-hover:shadow-[0_0_30px_rgba(225,48,108,0.3)]">
                  <Instagram size={36} className="text-[#E1306C] group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="font-headline text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#E1306C] transition-colors">Instagram</h3>
                <p className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-[0.25em] mb-6">Visual Feed</p>
                <p className="font-body text-sm text-on-surface-variant/60 leading-relaxed mb-8">Explore behind-the-scenes moments, event highlights, and the creative side of our antenna research community.</p>
                
                <div className="flex items-center gap-2 text-[#E1306C] font-label text-[10px] uppercase tracking-widest font-bold group-hover:gap-4 transition-all duration-300">
                  <span>Follow</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            {/* Gmail Card */}
            <motion.a
              href="mailto:ieeeiemaps.sbc@gmail.com"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-panel border border-outline-variant/20 hover:border-[#EA4335]/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EA4335]/0 to-[#FBBC05]/0 group-hover:from-[#EA4335]/10 group-hover:to-[#FBBC05]/5 transition-all duration-500" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30 group-hover:border-[#EA4335] transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30 group-hover:border-[#EA4335] transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30 group-hover:border-[#EA4335] transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30 group-hover:border-[#EA4335] transition-colors duration-300" />

              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#34A853] rounded-full animate-pulse shadow-[0_0_6px_rgba(52,168,83,0.8)]" />
                  <span className="font-label text-[8px] text-[#34A853]/60 uppercase tracking-widest">Online</span>
                </div>

                <div className="w-20 h-20 flex items-center justify-center bg-[#EA4335]/10 border border-[#EA4335]/20 group-hover:bg-[#EA4335]/20 group-hover:border-[#EA4335]/40 transition-all duration-500 mb-6 group-hover:shadow-[0_0_30px_rgba(234,67,53,0.3)]">
                  <Mail size={36} className="text-[#EA4335] group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="font-headline text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#EA4335] transition-colors">Gmail</h3>
                <p className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-[0.25em] mb-6">Direct Channel</p>
                <p className="font-body text-sm text-on-surface-variant/60 leading-relaxed mb-4">Reach out directly for collaborations, membership inquiries, or event partnerships.</p>
                <p className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest mb-6">ieeeiemaps.sbc@gmail.com</p>
                
                <div className="flex items-center gap-2 text-[#EA4335] font-label text-[10px] uppercase tracking-widest font-bold group-hover:gap-4 transition-all duration-300">
                  <span>Send Mail</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </section>


      {/* Floating PDF Button */}
      <motion.a
        href="/how-to-join-aps.pdf"
        target="_blank"
        rel="noopener noreferrer"
        title="How to Join APS — Open Guide"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.12, boxShadow: "0 0 32px rgba(0,212,255,0.7)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[200] flex flex-col items-center gap-1 group"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-none animate-ping bg-primary/20 pointer-events-none" style={{ borderRadius: 0 }} />
        
        {/* Button body */}
        <span className="relative flex flex-col items-center justify-center w-16 h-16 bg-surface-dim border-2 border-primary/60 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 shadow-[0_0_24px_rgba(0,212,255,0.3)] group-hover:shadow-[0_0_36px_rgba(0,212,255,0.6)]">
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-primary" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-primary" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-primary" />

          <FileText size={26} className="text-primary group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
        </span>

        {/* Label tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-surface-dim border border-primary/30 text-primary font-label text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_12px_rgba(0,212,255,0.2)]">
          How to Join APS
        </span>
      </motion.a>

    </div>
  );
}


