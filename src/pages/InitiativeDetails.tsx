import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Calendar, MapPin, ArrowUpRight } from "lucide-react";

// Mock data for the specific events in each category
const CATEGORY_DATA: Record<string, { title: string, description: string, events: any[] }> = {
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
    events: []
  },
  event: {
    title: "Special Events",
    description: "Conferences, symposiums, and other major chapter gatherings.",
    events: [
      { id: 2, title: "PromptX", date: "June 25, 2024", type: "Completed", image: "/event/promptx.jpeg" },
      { id: 3, title: "Sytron", date: "July 15, 2024", type: "Completed", image: "/event/sytron.jpeg" },
      { id: 4, title: "Sytron - Game Day", date: "July 15, 2024", type: "Completed", image: "/event/game-day.jpeg" },
      { id: 5, title: "Sytron - FF Tournament", date: "July 15, 2024", type: "Completed", image: "/event/ff-tournament.jpeg" },
      { id: 6, title: "Sytron - Robotics", date: "July 15, 2024", type: "Completed", image: "/event/robotics.jpeg" },
      { id: 7, title: "Sytron - Robo Soccer", date: "July 15, 2024", type: "Completed", image: "/event/robo-soccer.jpeg" }
    ]
  },
  conference: {
    title: "Upcoming Conferences",
    description: "Major academic and industry conferences.",
    events: [
      { id: 8, title: "IEEE MAPCON", date: "Dec 14-18, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80", link: "https://ieeemapcon.org/", location: "Nagpur, Maharashtra, India", endDate: "2026-12-19" },
      { id: 9, title: "IEEE APSCON", date: "Mar 15-17, 2027", type: "Upcoming", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", link: "https://2027.ieee-apscon.org/", location: "Hyderabad, Telangana, India", endDate: "2027-03-18" },
      { id: 10, title: "IEEE AP-S/URSI", date: "Jul 12-17, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80", link: "https://2026.apsursi.org/", location: "Detroit, Michigan, USA", endDate: "2026-07-18" },
      { id: 11, title: "IEEE IMAS", date: "Oct 19-22, 2026", type: "Upcoming", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80", link: "https://imas-ieee.org/", location: "Jeddah, KSA", endDate: "2026-10-23" }
    ]
  }
};

export function InitiativeDetails() {
  const { type } = useParams<{ type: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fallback if category not found
  const data = type && CATEGORY_DATA[type] ? CATEGORY_DATA[type] : { title: "Initiative", description: "Details about this initiative.", events: [] };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.events.filter(event => !event.endDate || new Date(event.endDate) >= new Date()).map((event, i) => {
            const CardWrapper = event.link ? motion.a : motion.div;
            const linkProps = event.link ? { href: event.link, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <CardWrapper 
                {...linkProps}
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
      </div>
    </div>
  );
}
