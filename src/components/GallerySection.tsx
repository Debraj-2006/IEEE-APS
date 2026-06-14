import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Calendar, MapPin, X, ChevronLeft, ChevronRight, Maximize2, ShieldAlert } from "lucide-react";

/* ─── Gallery Data ─── */
const GALLERY_ITEMS: any[] = [];


const CATEGORIES = ["ALL ARCHIVES", "OPERATIONS", "ACADEMICS", "FIELD & LAB"];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("ALL ARCHIVES");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === "ALL ARCHIVES"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const openLightbox = (id: string) => {
    const idx = GALLERY_ITEMS.findIndex(item => item.id === id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "next" | "prev") => {
    if (lightboxIndex === null) return;
    let newIndex = lightboxIndex;
    if (direction === "next") {
      newIndex = (lightboxIndex + 1) % GALLERY_ITEMS.length;
    } else {
      newIndex = (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    }
    setLightboxIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="gallery" className="py-32 px-8 bg-surface relative overflow-hidden">
      {/* Hex grid background */}
      <div className="absolute inset-0 hex-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
            <Camera size={16} className="text-primary" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl font-black uppercase mb-4 tracking-tighter">
            MISSION ARCHIVES
          </h2>
          <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-[0.4em]">
            Visual record of deployments, telemetry, and operations
          </p>
          <div className="w-24 h-[2px] gradient-line-animated mx-auto mt-6" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest transition-all duration-300 relative border ${
                selectedCategory === category
                  ? "border-primary text-on-primary bg-primary shadow-[0_0_15px_rgba(0,212,255,0.25)]"
                  : "border-outline-variant/30 text-on-surface-variant/70 hover:border-primary/40 hover:text-primary bg-surface-container-low/40 backdrop-blur-sm"
              }`}
            >
              {/* Corner accents for selected categories */}
              {selectedCategory === category && (
                <>
                  <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                </>
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {filteredItems.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-lg mx-auto border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-primary/40" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-primary/40" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-primary/40" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-primary/40" />
            <div className="card-scan-line opacity-20" />
            
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6 relative">
              <span className="absolute inset-0 border border-primary/20 animate-ping opacity-75" />
              <Camera size={24} />
            </div>
            
            <h3 className="font-headline text-lg font-black uppercase text-on-surface tracking-wider mb-3">
              SYSTEM STATUS: STANDBY
            </h3>
            <p className="font-body text-sm text-on-surface-variant/70 leading-relaxed mb-4">
              The Mission Archives are currently offline. Local media logs and chapter telemetry will be loaded during the next operational phase.
            </p>
            <div className="inline-block px-3 py-1 bg-surface-dim border border-outline-variant/30 text-[9px] font-label tracking-widest text-primary/60 uppercase">
              NO FILES DETECTED
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => openLightbox(item.id)}
                  className="group relative glass-card p-0 overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-500 flex flex-col"
                >
                  {/* Tactical Corner Accents */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-primary/20 group-hover:border-primary transition-colors" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-primary/20 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-primary/20 group-hover:border-primary transition-colors" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-primary/20 group-hover:border-primary transition-colors" />

                  {/* Scanline Sweep */}
                  <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden bg-surface-dim">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/20 to-transparent" />

                    {/* Top Overlay Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-surface-dim/75 border border-outline-variant/30 backdrop-blur-sm">
                      <span className="font-label text-[8px] text-primary font-black uppercase tracking-widest">
                        {item.code}
                      </span>
                    </div>

                    {/* Classification Badge */}
                    <div className={`absolute top-4 right-4 px-2.5 py-1 border text-[8px] font-label font-black uppercase tracking-widest backdrop-blur-sm ${
                      item.classification === "CONFIDENTIAL" 
                        ? "bg-secondary/15 border-secondary/40 text-secondary" 
                        : item.classification === "RESTRICTED" 
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                          : "bg-green-500/10 border-green-500/30 text-green-500"
                    }`}>
                      {item.classification}
                    </div>

                    {/* Center hover icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-primary/15 border border-primary/50 backdrop-blur-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between border-t border-outline-variant/10 bg-surface-container-low/20">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-label text-[8px] text-primary/60 uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-headline text-base font-black text-on-surface uppercase tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/10 text-on-surface-variant/40">
                      <span className="font-label text-[8px] uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} className="text-primary/60" />
                        {item.location}
                      </span>
                      <span className="font-label text-[8px] uppercase tracking-widest font-bold text-primary/60">
                        {item.coordinates}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Dark Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-surface-dim border border-primary/20 flex flex-col md:grid md:grid-cols-3 overflow-hidden shadow-2xl h-[90vh] md:h-auto md:max-h-[85vh]"
            >
              {/* Scanline Sweep in Lightbox */}
              <div className="card-scan-line opacity-10" />

              {/* Grid Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/40 to-transparent z-10" />

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center text-on-surface-variant/60 hover:text-primary border border-outline-variant/20 hover:border-primary/40 bg-surface-dim/80 backdrop-blur-sm transition-all"
              >
                <X size={14} />
              </button>

              {/* Left Side: Media Display (2 cols on md+) */}
              <div className="relative md:col-span-2 h-[50vh] md:h-full min-h-[300px] bg-black flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-outline-variant/10">
                <img
                  src={GALLERY_ITEMS[lightboxIndex].image}
                  alt={GALLERY_ITEMS[lightboxIndex].title}
                  className="w-full h-full object-contain max-h-full"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right Navigation inside image area */}
                <button
                  onClick={() => navigateLightbox("prev")}
                  className="absolute left-4 w-10 h-10 flex items-center justify-center text-on-surface-variant/80 hover:text-primary border border-outline-variant/20 hover:border-primary/40 bg-surface-dim/80 backdrop-blur-sm transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => navigateLightbox("next")}
                  className="absolute right-4 w-10 h-10 flex items-center justify-center text-on-surface-variant/80 hover:text-primary border border-outline-variant/20 hover:border-primary/40 bg-surface-dim/80 backdrop-blur-sm transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Right Side: Metadata Panel (1 col) */}
              <div className="p-8 flex flex-col justify-between overflow-y-auto h-full bg-surface-dim">
                <div>
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-label text-[9px] text-primary uppercase tracking-[0.25em] font-black">
                      {GALLERY_ITEMS[lightboxIndex].category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-headline text-xl font-black uppercase text-on-surface tracking-tight mb-4 border-b border-outline-variant/10 pb-4">
                    {GALLERY_ITEMS[lightboxIndex].title}
                  </h3>

                  {/* Details List */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar size={12} className="text-primary/70 shrink-0" />
                      <div>
                        <p className="font-label text-[8px] text-on-surface-variant/40 uppercase tracking-widest">Date Stamp</p>
                        <p className="font-body text-xs text-on-surface">{GALLERY_ITEMS[lightboxIndex].date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={12} className="text-primary/70 shrink-0" />
                      <div>
                        <p className="font-label text-[8px] text-on-surface-variant/40 uppercase tracking-widest">Location</p>
                        <p className="font-body text-xs text-on-surface">{GALLERY_ITEMS[lightboxIndex].location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ShieldAlert size={12} className="text-primary/70 shrink-0" />
                      <div>
                        <p className="font-label text-[8px] text-on-surface-variant/40 uppercase tracking-widest">Classification</p>
                        <span className={`text-[10px] font-label font-black tracking-widest ${
                          GALLERY_ITEMS[lightboxIndex].classification === "CONFIDENTIAL" 
                            ? "text-secondary" 
                            : GALLERY_ITEMS[lightboxIndex].classification === "RESTRICTED" 
                              ? "text-amber-500" 
                              : "text-green-500"
                        }`}>
                          {GALLERY_ITEMS[lightboxIndex].classification}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-on-surface-variant/70 leading-relaxed border-t border-outline-variant/10 pt-4">
                    {GALLERY_ITEMS[lightboxIndex].description}
                  </p>
                </div>

                {/* Footer of Modal */}
                <div className="mt-8 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant/40">
                  <div>
                    <span className="font-label text-[8px] uppercase tracking-widest block">Tele-Stamp</span>
                    <span className="font-label text-[9px] font-bold text-primary uppercase tracking-widest">
                      {GALLERY_ITEMS[lightboxIndex].coordinates}
                    </span>
                  </div>
                  <div>
                    <span className="font-label text-[8px] uppercase tracking-widest block text-right">Log Code</span>
                    <span className="font-label text-[9px] font-bold text-on-surface uppercase tracking-widest block text-right">
                      {GALLERY_ITEMS[lightboxIndex].code}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
