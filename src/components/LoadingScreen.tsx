import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, animate } from 'motion/react';
import { Satellite, Radio, Wifi, Cpu, Activity } from 'lucide-react';

const phases = [
  'INITIALIZING ELECTROMAGNETIC FIELD...',
  'CALIBRATING ANTENNA ARRAY...',
  'ESTABLISHING UPLINK CONNECTION...',
  'SYNCING PROPAGATION DATA...',
  'ACCESS GRANTED',
];

// Static, deterministic particle field (fixed positions so they don't jump on re-render).
const PARTICLES = [
  { left: '8%', top: '18%', size: 3, dur: 5, delay: 0 },
  { left: '18%', top: '72%', size: 2, dur: 6, delay: 1.2 },
  { left: '27%', top: '38%', size: 4, dur: 7, delay: 0.5 },
  { left: '38%', top: '85%', size: 2, dur: 5.5, delay: 2 },
  { left: '46%', top: '12%', size: 3, dur: 6.5, delay: 0.8 },
  { left: '58%', top: '66%', size: 2, dur: 5, delay: 1.6 },
  { left: '67%', top: '28%', size: 4, dur: 7.5, delay: 0.3 },
  { left: '74%', top: '80%', size: 2, dur: 6, delay: 2.4 },
  { left: '82%', top: '44%', size: 3, dur: 5.5, delay: 1 },
  { left: '90%', top: '20%', size: 2, dur: 6.5, delay: 1.9 },
  { left: '92%', top: '70%', size: 3, dur: 7, delay: 0.6 },
  { left: '13%', top: '52%', size: 2, dur: 5, delay: 2.2 },
];

/* ─── Scramble / decode text reveal ─── */
const SCRAMBLE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>-_/[]=+*^?#';

const ScrambleText: React.FC<{ text: string; className?: string; style?: React.CSSProperties; disabled?: boolean }> = ({ text, className, style, disabled }) => {
  const [display, setDisplay] = useState(disabled ? text : '');

  useEffect(() => {
    if (disabled) { setDisplay(text); return; }
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      // Reveal ~1 locked character every 4 frames; unrevealed chars scramble.
      const revealed = Math.floor(frame / 4);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { out += ' '; continue; }
        out += i < revealed ? text[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
      if (revealed <= text.length) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, disabled]);

  return <span className={className} style={style}>{display || ' '}</span>;
};

export const LoadingScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [step, setStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Smooth 0 → 100 percentage counter.
  const count = useMotionValue(0);
  const percent = useTransform(count, (v) => Math.round(v));
  const barWidth = useTransform(count, (v) => `${v}%`);

  useEffect(() => {
    if (prefersReducedMotion) { count.set(100); return; }
    const controls = animate(count, 100, { duration: 4.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [count, prefersReducedMotion]);

  useEffect(() => {
    const stepDelay = prefersReducedMotion ? 0 : 1000;
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep(step + 1);
      } else {
        setTimeout(onFinished, prefersReducedMotion ? 0 : 1200);
      }
    }, stepDelay);

    return () => clearTimeout(timer);
  }, [step, onFinished, prefersReducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[#0C0E10]"
    >
      {/* Radial vignette glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.08)_0%,transparent_60%)]" />

      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(200px)] animate-[grid-move_20s_linear_infinite]" />
      </div>

      {/* Vertical scan-line sweep */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.12) 50%, transparent)' }}
          initial={{ top: '-10%' }}
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Digital glitch slices — horizontal bands that jump & flicker */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden">
          {[
            { top: '22%', h: 10, dur: 3.1, delay: 0.4, x: 18, c: 'rgba(0,212,255,0.35)' },
            { top: '41%', h: 6, dur: 2.3, delay: 1.5, x: -26, c: 'rgba(255,0,80,0.30)' },
            { top: '58%', h: 14, dur: 3.6, delay: 0.9, x: 12, c: 'rgba(0,212,255,0.30)' },
            { top: '73%', h: 5, dur: 2.7, delay: 2.1, x: -16, c: 'rgba(125,194,66,0.30)' },
            { top: '88%', h: 8, dur: 3.0, delay: 1.1, x: 22, c: 'rgba(0,212,255,0.25)' },
          ].map((g, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0"
              style={{ top: g.top, height: g.h, background: g.c }}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: [0, 0, 0.9, 0, 0.7, 0], x: [0, 0, g.x, -g.x, g.x, 0] }}
              transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, repeatDelay: 1.6, times: [0, 0.7, 0.78, 0.85, 0.92, 1], ease: 'linear' }}
            />
          ))}
        </div>
      )}

      {/* Full-screen RGB-split flash bursts */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ background: 'linear-gradient(90deg, rgba(255,0,80,0.06), transparent 20%, transparent 80%, rgba(0,212,255,0.06))' }}
          animate={{ opacity: [0, 0, 1, 0, 1, 0], x: [0, 0, -4, 4, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 0.96, 1] }}
        />
      )}

      {/* Floating particle field */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-primary"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, boxShadow: '0 0 8px rgba(0,212,255,0.8)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -24, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* Corner HUD brackets */}
      {[
        'top-6 left-6 border-t-2 border-l-2',
        'top-6 right-6 border-t-2 border-r-2',
        'bottom-6 left-6 border-b-2 border-l-2',
        'bottom-6 right-6 border-b-2 border-r-2',
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-10 h-10 md:w-14 md:h-14 border-primary/50 ${pos}`}
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
        />
      ))}

      {/* Code / Status Text Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-14 space-y-1 font-mono text-[10px] text-primary">
          <p className="animate-pulse">SYS.BOOT_SEQ // INIT</p>
          <p>FREQ: 2.4GHz - 5GHz</p>
          <p>POLARIZATION: CIRCULAR</p>
          <p>VSWR: &lt; 1.5:1</p>
        </div>
        <div className="absolute right-14 bottom-10 space-y-1 text-right font-mono text-[10px] text-primary">
          <p>LAT: 22.5726 N</p>
          <p>LNG: 88.3639 E</p>
          <p>ALT: 12.4 KM</p>
          <p className="text-secondary animate-pulse">STATUS: ONLINE</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Core Antenna Animation */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">

          {/* Rotating HUD tick-ring (outer) */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute -inset-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" strokeDasharray="2 6" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  const x1 = 100 + Math.cos(a) * 88;
                  const y1 = 100 + Math.sin(a) * 88;
                  const x2 = 100 + Math.cos(a) * 96;
                  const y2 = 100 + Math.sin(a) * 96;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.5)" strokeWidth={i % 3 === 0 ? 2 : 1} />;
                })}
              </svg>
            </motion.div>
          )}

          {/* Counter-rotating inner dashed ring */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-dashed border-primary/20"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            />
          )}

          {/* Orbiting satellite blip riding the tick-ring */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute -inset-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_12px_3px_rgba(125,194,66,0.9)]" />
              </div>
            </motion.div>
          )}

          {/* Completion shockwave burst */}
          <AnimatePresence>
            {step === 4 && !prefersReducedMotion && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  initial={{ scale: 0.4, opacity: 0.7 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Radar Sweep Background */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* The sweeping radar beam */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 212, 255, 0.1) 80%, rgba(0, 212, 255, 0.6) 100%)',
              }}
            >
              {/* The bright leading edge of the radar beam */}
              <div className="absolute top-0 bottom-1/2 left-1/2 w-[2px] -ml-[1px] bg-primary shadow-[0_0_15px_rgba(0,212,255,1)] origin-bottom" />
            </motion.div>

            {/* Radar Grid Circles */}
            <div className="absolute inset-4 rounded-full border border-primary/20" />
            <div className="absolute inset-12 rounded-full border border-primary/20" />
            <div className="absolute inset-20 rounded-full border border-primary/30" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-primary/20" />
              <div className="absolute h-full w-[1px] bg-primary/20" />
            </div>

            {/* Radar targets (blips) */}
            <motion.div
              className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(0,212,255,1)] top-1/4 left-1/3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_8px_rgba(125,194,66,1)] bottom-1/3 right-1/4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
            />
          </motion.div>

          {/* Radiating Waves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-full h-full rounded-full border-[1.5px] border-primary"
                initial={{ scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: 'easeOut',
                }}
                style={{ boxShadow: 'inset 0 0 20px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.1)' }}
              />
            ))}
          </div>

          {/* Center Icon */}
          <motion.div
            className="relative z-10 p-5 bg-[#0C0E10] rounded-full border border-primary/50 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {step === 0 && <motion.span key="0" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Cpu className="w-10 h-10 text-primary" /></motion.span>}
              {step === 1 && <motion.span key="1" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Radio className="w-10 h-10 text-primary" /></motion.span>}
              {step === 2 && <motion.span key="2" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Satellite className="w-10 h-10 text-primary" /></motion.span>}
              {step === 3 && <motion.span key="3" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Activity className="w-10 h-10 text-primary" /></motion.span>}
              {step === 4 && <motion.span key="4" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><Wifi className="w-10 h-10 text-primary animate-pulse" /></motion.span>}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Brand Text */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.h2
            className="font-headline text-3xl md:text-5xl font-black text-white tracking-widest uppercase"
            style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.4)' }}
            animate={prefersReducedMotion ? {} : {
              x: [0, 0, -2, 2, -1, 0],
              textShadow: [
                '0 0 20px rgba(0,212,255,0.4)',
                '0 0 20px rgba(0,212,255,0.4)',
                '2px 0 rgba(255,0,80,0.7), -2px 0 rgba(0,212,255,0.7)',
                '-2px 0 rgba(255,0,80,0.7), 2px 0 rgba(0,212,255,0.7)',
                '0 0 20px rgba(0,212,255,0.4)',
                '0 0 20px rgba(0,212,255,0.4)',
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, times: [0, 0.85, 0.88, 0.92, 0.96, 1] }}
          >
            <ScrambleText text="IEEE AP-S" disabled={!!prefersReducedMotion} />
          </motion.h2>
          <p className="font-label text-xs md:text-sm text-primary uppercase tracking-[0.5em] mt-2">
            IEM Student Branch
          </p>
        </motion.div>

        {/* Progress Bar + live percentage */}
        <div className="mt-8 w-64">
          <div className="flex items-center justify-between font-mono text-[10px] text-primary/70 mb-2 uppercase tracking-[0.2em]">
            <span>Loading</span>
            <span className="flex items-baseline">
              <motion.span className="text-primary tabular-nums">{percent}</motion.span>%
            </span>
          </div>
          <div className="relative h-[3px] w-full overflow-hidden bg-surface-container-highest rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(0,212,255,0.8)] rounded-full"
              style={{ width: barWidth }}
            />
            {/* moving shimmer on the bar */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-y-0 w-16"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                initial={{ x: '-4rem' }}
                animate={{ x: '16rem' }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-4 text-center font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary/80 h-4 relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${step === 4 ? 'text-secondary' : ''}`}
            >
              {step === 4 && <span className="mr-1">&gt;</span>}{phases[step]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Styles for grid animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(0px) translateZ(200px); }
        }
      `}} />
    </motion.div>
  );
};
