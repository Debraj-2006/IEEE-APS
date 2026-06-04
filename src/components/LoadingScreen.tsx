import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Satellite, Radio, Wifi, Cpu, Activity } from 'lucide-react';

const phases = [
  'INITIALIZING ELECTROMAGNETIC FIELD...',
  'CALIBRATING ANTENNA ARRAY...',
  'ESTABLISHING UPLINK CONNECTION...',
  'SYNCING PROPAGATION DATA...',
  'ACCESS GRANTED',
];

export const LoadingScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep(step + 1);
      } else {
        setTimeout(onFinished, 1200);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[#0C0E10]"
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(200px)] animate-[grid-move_20s_linear_infinite]" />
      </div>

      {/* Code / Status Text Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 space-y-1 font-mono text-[10px] text-primary">
          <p className="animate-pulse">SYS.BOOT_SEQ // INIT</p>
          <p>FREQ: 2.4GHz - 5GHz</p>
          <p>POLARIZATION: CIRCULAR</p>
          <p>VSWR: &lt; 1.5:1</p>
        </div>
        <div className="absolute right-10 bottom-10 space-y-1 text-right font-mono text-[10px] text-primary">
          <p>LAT: 22.5726 N</p>
          <p>LNG: 88.3639 E</p>
          <p>ALT: 12.4 KM</p>
          <p className="text-secondary animate-pulse">STATUS: ONLINE</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Core Antenna Animation */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          
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
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
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
                  ease: "easeOut",
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
            transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {step === 0 && <Cpu key="0" className="w-10 h-10 text-primary" />}
              {step === 1 && <Radio key="1" className="w-10 h-10 text-primary" />}
              {step === 2 && <Satellite key="2" className="w-10 h-10 text-primary" />}
              {step === 3 && <Activity key="3" className="w-10 h-10 text-primary" />}
              {step === 4 && <Wifi key="4" className="w-10 h-10 text-primary animate-pulse" />}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Brand Text */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="font-headline text-3xl md:text-5xl font-black text-white tracking-widest uppercase" style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.4)" }}>
            IEEE AP-S
          </h2>
          <p className="font-label text-xs md:text-sm text-primary uppercase tracking-[0.5em] mt-2">
            IEM Student Branch
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="relative mt-8 h-[2px] w-64 overflow-hidden bg-surface-container-highest rounded-full">
          <motion.div
            className="absolute inset-0 bg-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]"
            initial={{ x: '-100%' }}
            animate={{ x: `${(step / 4) * 100 - 100}%` }}
            transition={{ duration: 0.5 }}
          />
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
              className="absolute"
            >
              {phases[step]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Styles for grid animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(0px) translateZ(200px); }
        }
      `}} />
    </motion.div>
  );
};

