import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Calendar, MapPin, ArrowUpRight, Folder, Images, X } from "lucide-react";

// Mock data for the specific events in each category
const CATEGORY_DATA: Record<string, { title: string, description: string, events?: any[], subCategories?: { title: string, events: any[] }[] }> = {
  webinar: {
    title: "Webinars",
    description: "Online technical sessions and expert talks on various topics in electromagnetics and antennas.",
    events: []
  },
  workshop: {
    title: "Workshops",
    description: "Hands-on training sessions and practical skill development programs.",
    events: [
      { id: 1, title: "MATLAB Workshop", date: "June 20, 2024", type: "Completed", image: "/event/matlab.jpeg" }
    ]
  },
  techtalk: {
    title: "Tech Talks",
    description: "Seminars and talks by industry leaders and academic experts.",
    events: [
      // PromptX removed as requested
    ]
  },
  industry: {
    title: "Industrial Visits",
    description: "Field trips to leading technology companies and research facilities.",
    events: [
      {
        id: 5,
        title: "CARE - IIT Delhi",
        date: "August 15, 2026",
        type: "Completed",
        image: "/industrial visit/CARE - IIT DELHI/WhatsApp Image 2026-08-15 at 00.51.10.jpeg",
        folder: [
          { title: "CARE - IIT Delhi", image: "/industrial visit/CARE - IIT DELHI/WhatsApp Image 2026-08-15 at 00.51.10.jpeg" },
          { title: "CARE - IIT Delhi", image: "/industrial visit/CARE - IIT DELHI/WhatsApp Image 2026-08-15 at 00.51.10 (1).jpeg" },
          { title: "CARE - IIT Delhi", image: "/industrial visit/CARE - IIT DELHI/WhatsApp Image 2026-08-15 at 00.51.10 (2).jpeg" }
        ]
      },
      {
        id: 6,
        title: "JV Micronics",
        date: "August 15, 2026",
        type: "Completed",
        image: "/industrial visit/JV Micronics/WhatsApp Image 2026-08-15 at 00.49.56.jpeg",
        folder: [
          { title: "JV Micronics", image: "/industrial visit/JV Micronics/WhatsApp Image 2026-08-15 at 00.49.56.jpeg" },
          { title: "JV Micronics", image: "/industrial visit/JV Micronics/WhatsApp Image 2026-08-15 at 00.49.56 (1).jpeg" }
        ]
      }
    ]
  },
  event: {
    title: "Special Events",
    description: "Conferences, symposiums, and other major chapter gatherings.",
    events: [
      { id: 2, title: "PromptX", date: "June 25, 2024", type: "Completed", image: "/event/promptx.jpeg" },
      {
        id: 3,
        title: "Sytron",
        date: "July 15, 2024",
        type: "Completed",
        image: "/event/SYTRON/sytron.jpeg",
        folder: [
          { title: "Sytron", image: "/event/SYTRON/sytron.jpeg" },
          { title: "Game Day", image: "/event/SYTRON/game-day.jpeg" },
          { title: "FF Tournament", image: "/event/SYTRON/ff-tournament.jpeg" },
          { title: "Robotics", image: "/event/SYTRON/robotics.jpeg" },
          { title: "Robo Soccer", image: "/event/SYTRON/robo-soccer.jpeg" }
        ]
      },
      {
        id: 4,
        title: "Eclypse",
        date: "August 7, 2026",
        type: "Completed",
        image: "/event/Eclypse/eclypse.jpeg",
        folder: [
          { title: "Eclypse", image: "/event/Eclypse/eclypse.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/eclypse-photo-1.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/eclypse-photo-2.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/eclypse-photo-3.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/eclypse-photo-4.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/eclypse-photo-5.jpeg" },
          { title: "Eclypse", image: "/event/Eclypse/WhatsApp Image 2026-08-15 at 13.32.34.jpeg" }
        ]
      }
    ]
  },
  conference: {
    title: "Conferences",
    description: "Major academic and industry conferences.",
    subCategories: [
      {
        title: "APS Domain Conferences",
        events: [
          { id: 8, title: "IEEE MAPCON", date: "Dec 14-18, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80", link: "https://ieeemapcon.org/", location: "Nagpur, Maharashtra, India", endDate: "2026-12-19" },
          { id: 9, title: "IEEE APSCON", date: "Mar 15-17, 2027", type: "Upcoming", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", link: "https://2027.ieee-apscon.org/", location: "Hyderabad, Telangana, India", endDate: "2027-03-18" },
          { id: 10, title: "IEEE AP-S/URSI", date: "Jul 12-17, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80", link: "https://2026.apsursi.org/", location: "Detroit, Michigan, USA", endDate: "2026-07-18" },
          { id: 11, title: "IEEE IMAS", date: "Oct 19-22, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80", link: "https://imas-ieee.org/", location: "Jeddah, KSA", endDate: "2026-10-23" }
        ]
      },
      {
        title: "Interdisciplinary Conferences",
        events: []
      }
    ]
  }
};

export function InitiativeDetails() {
  const { type } = useParams<{ type: string }>();

  // Folder currently opened in the gallery modal (null = closed)
  const [openFolder, setOpenFolder] = useState<{ title: string, items: { title: string, image: string }[] } | null>(null);
  // Index of the poster shown in the full-screen lightbox (-1 = none)
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll while an overlay is open
  useEffect(() => {
    const open = openFolder || lightboxIndex >= 0;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openFolder, lightboxIndex]);

  // Fallback if category not found
  const data = type && CATEGORY_DATA[type] ? CATEGORY_DATA[type] : { title: "Initiative", description: "Details about this initiative.", events: [] };

  const renderEventsGrid = (events: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.filter(event => !event.endDate || new Date(event.endDate) >= new Date()).map((event, i) => {
        const isFolder = Array.isArray(event.folder);
        const CardWrapper = event.link ? motion.a : motion.div;
        const linkProps = event.link ? { href: event.link, target: "_blank", rel: "noopener noreferrer" } : {};
        const folderProps = isFolder ? { onClick: () => { setOpenFolder({ title: event.title, items: event.folder }); setLightboxIndex(-1); } } : {};
        return (
          <CardWrapper
            {...linkProps}
            {...folderProps}
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group cursor-pointer flex flex-col"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${event.type === 'Upcoming' ? 'bg-primary text-on-primary' : 'bg-surface/80 text-on-surface backdrop-blur-md'}`}>
                  {event.type}
                </span>
              </div>
              {event.link && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-on-surface" />
                </div>
              )}
              {isFolder && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-md text-on-surface font-label text-[9px] font-bold uppercase tracking-widest">
                    <Images size={12} className="text-primary" />
                    {event.folder.length}
                  </div>
                  <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-white font-label text-[10px] uppercase tracking-widest drop-shadow">
                    <Folder size={13} className="text-primary" />
                    Folder
                  </div>
                </>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors mb-4 line-clamp-2">
                {event.title}
              </h3>
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center gap-2 text-on-surface-variant/70 font-label text-[10px] uppercase tracking-widest">
                  <Calendar size={12} className="shrink-0 text-primary/60" />
                  <span className="truncate">{event.date}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-on-surface-variant/70 font-label text-[10px] uppercase tracking-widest">
                    <MapPin size={12} className="shrink-0 text-primary/60" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {isFolder && (
                  <div className="flex items-center gap-2 text-primary font-label text-[10px] uppercase tracking-widest">
                    <Images size={12} className="shrink-0" />
                    <span className="truncate">View {event.folder.length} posters</span>
                  </div>
                )}
              </div>
            </div>
          </CardWrapper>
        );
      })}
      
      {/* Empty state / placeholder for adding more */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-12 text-center group hover:border-primary/50 transition-colors cursor-pointer min-h-[300px]"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
          <ArrowUpRight size={20} />
        </div>
        <h4 className="font-headline font-bold uppercase text-on-surface tracking-tight">More Coming Soon</h4>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-2">Stay Tuned</p>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-8 min-h-screen bg-surface-dim">
      <div className="max-w-7xl mx-auto">
        <Link to="/#initiatives" className="inline-flex items-center gap-2 text-primary hover:text-white font-label text-xs uppercase tracking-widest mb-12 transition-colors">
          <ChevronLeft size={16} />
          Back to Initiatives
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-label text-[10px] uppercase tracking-widest mb-6">
            Category
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface uppercase tracking-tighter mb-6">
            {data.title}
          </h1>
          <p className="font-body text-on-surface-variant max-w-2xl text-lg">
            {data.description}
          </p>
        </motion.div>

        <div className="h-[1px] w-full bg-outline-variant/20 mb-16" />

        {data.subCategories ? (
          <div className="flex flex-col gap-16">
            {data.subCategories.map((sub, idx) => (
              <div key={idx}>
                <h2 className="font-headline text-2xl md:text-3xl font-bold uppercase mb-8 text-on-surface border-l-4 border-primary pl-4">{sub.title}</h2>
                {renderEventsGrid(sub.events)}
              </div>
            ))}
          </div>
        ) : (
          renderEventsGrid(data.events || [])
        )}
      </div>

      {/* Folder gallery modal */}
      <AnimatePresence>
        {openFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setOpenFolder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 p-6 border-b border-outline-variant/20 shrink-0">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-primary" />
                  <h3 className="font-headline text-xl md:text-2xl font-black uppercase tracking-tight text-on-surface">{openFolder.title}</h3>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">{openFolder.items.length} posters</span>
                </div>
                <button
                  onClick={() => setOpenFolder(null)}
                  aria-label="Close gallery"
                  className="w-9 h-9 rounded-full bg-surface/60 hover:bg-surface flex items-center justify-center text-on-surface transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto" data-lenis-prevent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {openFolder.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="glass-card overflow-hidden group text-left flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-black/40 flex items-center justify-center">
                        {/* object-contain so landscape & portrait posters both show in full without cropping */}
                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3">
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors truncate">{item.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen poster lightbox */}
      <AnimatePresence>
        {openFolder && lightboxIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 sm:p-10"
            onClick={() => setLightboxIndex(-1)}
          >
            <button
              onClick={() => setLightboxIndex(-1)}
              aria-label="Close poster"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-surface/60 hover:bg-surface flex items-center justify-center text-on-surface transition-colors z-10"
            >
              <X size={18} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              src={openFolder.items[lightboxIndex].image}
              alt={openFolder.items[lightboxIndex].title}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
