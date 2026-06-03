import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, FileText, ChevronRight, Linkedin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const NavItem = ({ href, label, active = false }: { href: string; label: string; active?: boolean }) => (
  <Link 
    to={href} 
    className={`font-label uppercase tracking-[0.2em] text-[10px] font-bold transition-colors duration-300 pb-1 border-b-2 ${
      active ? "text-primary border-primary" : "text-on-surface-variant hover:text-primary border-transparent"
    }`}
  >
    {label}
  </Link>
);

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/ieee-iem-aps-student-branch-chapter/",
  instagram: "https://www.instagram.com/ieeeiemaps.official?igsh=MWh2dTY5bjU2aHNrdA==",
  facebook: ""
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-primary selection:text-on-primary">
      {/* HUD Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <div className="scanline" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[90] transition-all duration-500 border-b ${
        isScrolled ? "bg-surface-dim/95 backdrop-blur-md border-primary/20 py-4" : "bg-transparent border-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary glow-text-primary font-headline cursor-pointer">
            IEEE APS <span className="text-white">IEM</span>
          </Link>

          <div className="hidden md:flex gap-10 items-center">
            <NavItem href="/#" label="Home" active />
            <NavItem href="/#about" label="About" />
            <NavItem href="/#initiatives" label="Initiatives" />
            <NavItem href="/#benefits" label="Benefits" />
            <NavItem href="/#team" label="Team" />
            <NavItem href="/#social" label="Social" />
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/how-to-join-aps.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary font-label uppercase tracking-widest text-[10px] px-6 py-2.5 font-black hover:bg-white transition-all active:scale-95 glow-primary"
            >
              <FileText size={12} />
              Join Chapter
            </a>
            <button 
              className="md:hidden text-primary hover:text-white transition-colors p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[95]"
              />
              
              {/* Sidebar content */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed top-0 right-0 w-[80%] max-w-sm h-screen bg-surface border-l border-primary/20 p-8 flex flex-col gap-8 z-[100] shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-black tracking-tighter text-primary font-headline">
                    APS <span className="text-white">IEM</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-2 -mr-2"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-6">
                  <Link to="/#" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-primary border-b border-primary/20 pb-4">Home</Link>
                  <Link to="/#about" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-on-surface hover:text-primary transition-colors border-b border-outline-variant/10 pb-4">About</Link>
                  <Link to="/#initiatives" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-on-surface hover:text-primary transition-colors border-b border-outline-variant/10 pb-4">Initiatives</Link>
                  <Link to="/#benefits" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-on-surface hover:text-primary transition-colors border-b border-outline-variant/10 pb-4">Benefits</Link>
                  <Link to="/#team" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-on-surface hover:text-primary transition-colors border-b border-outline-variant/10 pb-4">Team</Link>
                  <Link to="/#social" onClick={() => setMobileMenuOpen(false)} className="font-label uppercase text-xs tracking-widest text-on-surface hover:text-primary transition-colors border-b border-outline-variant/10 pb-4">Social</Link>
                </div>

                <div className="mt-auto pb-4">
                  <a href="/how-to-join-aps.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full bg-primary text-on-primary font-label uppercase tracking-widest text-[10px] px-6 py-4 font-black hover:bg-white transition-all active:scale-[0.98] glow-primary">
                    Join Chapter
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {children}
      </main>

      {/* Footer */}
      <footer id="social" className="relative py-20 px-8 bg-surface-dim border-t border-outline-variant/10 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,212,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Branding Column */}
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-3xl font-black tracking-tighter text-primary font-headline mb-6 block">
                IEEE APS <span className="text-white">IEM</span>
              </Link>
              <p className="text-on-surface-variant/70 font-body text-sm leading-relaxed max-w-sm mb-8">
                Advancing the tactical applications of antennas, electromagnetics, and wave propagation through student-led innovation and research excellence.
              </p>
              <div className="flex gap-4">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all group">
                  <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all group">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold mb-8">Navigation</h4>
              <div className="space-y-4">
                {[{label: 'About', href: '/#about'}, {label: 'Initiatives', href: '/#initiatives'}, {label: 'Benefits', href: '/#benefits'}, {label: 'Team', href: '/#team'}].map(link => (
                  <Link key={link.label} to={link.href} className="flex items-center gap-2 font-label text-xs uppercase tracking-widest text-on-surface-variant/50 hover:text-primary transition-colors group">
                    <ChevronRight size={12} className="text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold mb-8">System Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                  <span className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">Initiatives Scheduled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-xs font-label text-on-surface-variant/60 uppercase tracking-wider">All Systems Nominal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-label text-on-surface-variant/40 uppercase tracking-widest">
              © {new Date().getFullYear()} IEEE APS IEM Student Branch Chapter.
            </p>
            <p className="text-[10px] font-label text-on-surface-variant/30 uppercase tracking-widest">
              DESIGNED FOR THE FUTURE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
