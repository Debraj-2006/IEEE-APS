import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Calendar, MapPin, ArrowUpRight } from "lucide-react";

// Mock data for the specific events in each category
const CATEGORY_DATA: Record<string, { title: string, description: string, events: any[] }> = {
  webinar: {
    title: "Webinars",
    description: "Online technical sessions and expert talks on various topics in electromagnetics and antennas.",
    events: [
      { id: 1, title: "Eclypse Post", date: "Coming Soon", type: "Upcoming", image: "/event/eclypse.jpeg" }
    ]
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
      { id: 1, title: "PromptX Seminar", date: "June 25, 2024", type: "Completed", image: "/event/promptx.jpeg" }
    ]
  },
  industry: {
    title: "Industrial Visits",
    description: "Field trips to leading technology companies and research facilities.",
    events: [
      { id: 1, title: "Sytron Visit", date: "July 15, 2024", type: "Completed", image: "/event/sytron.jpeg" }
    ]
  },
  event: {
    title: "Special Events",
    description: "Conferences, symposiums, and other major chapter gatherings.",
    events: [
      { id: 1, title: "Annual Symposium", date: "August 10, 2024", type: "Upcoming", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" }
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
          {data.events.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${event.type === 'Upcoming' ? 'bg-primary text-on-primary' : 'bg-surface/80 text-on-surface backdrop-blur-md'}`}>
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-headline text-xl font-bold uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors mb-4">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-on-surface-variant/70 font-label text-[10px] uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>{event.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
          
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
