import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Shield,
  Users,
  ChevronRight,
  X,
  Linkedin,
  Github,
  Mail,
  ExternalLink,
  Award,
  Cpu,
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  FlaskConical,
  FileText,
} from "lucide-react";

/* ─── Member Data ─── */
const MEMBERS = [
  /* ── Faculty Adviser ── */
  {
    name: "Srijita Chakraborty",
    role: "Faculty Adviser",
    committee: "Faculty Adviser",
    image: "/picture/adviser.jpeg",
    badge: "Faculty Adviser",
    about: "Faculty adviser guiding IEEE APS IEM Student Branch Chapter with expertise and strategic direction.",
    skills: [],
    projects: [],
    publications: [],
    experience: [],
    certifications: [],
    email: "",
    linkedin: "#",
  },
  /* ── Executive Committee ── */
  {
    name: "Soham Karak",
    role: "Chairperson",
    committee: "Executive Committee",
    image: "/picture/soham.jpeg",
    badge: "Chairperson",
    about: "Pre-final year ECE student specializing in RF & microwave engineering. IEEE Chairperson with a passion for antenna research and embedded systems.",
    skills: ["C", "Python", "CST Microwave Studio", "MATLAB", "RF Engineering"],
    projects: [
      "Edible Oil Adulteration Detection System",
      "Smart Fish Farming (ML-based)",
    ],
    publications: ["Multiple IEEE papers (WAMS, APSCON, Sensors Letters)"],
    experience: [
      "Research Intern — IIEST Shibpur",
      "Research Intern — IIT Varanasi",
      "Event Lead, SYTRON",
    ],
    certifications: [],
    email: "sohamkarak005@gmail.com",
    linkedin: "https://linkedin.com/in/soham-karak",
  },
  {
    name: "Satwik Khan",
    role: "Vice Chairperson",
    committee: "Executive Committee",
    image: "/picture/satwik.jpeg",
    badge: "Vice Chair",
    about: "Dedicated ECE student and active IEEE contributor. Focused on supporting chapter operations and strategic planning.",
    skills: [],
    projects: [],
    publications: [],
    experience: [],
    certifications: [],
    email: "",
    linkedin: "#",
  },
  {
    name: "Sumit Kumar Das",
    role: "Webmaster",
    committee: "Executive Committee",
    image: "/picture/sumit.jpeg",
    badge: "Webmaster",
    about: "Software Developer specializing in AI, cybersecurity, and scalable backend systems. Full-stack engineer with 1000+ GitHub contributions. Worked for more than 25 brands all over India.",
    skills: ["Java", "Python", "C++", "JS/TS", "React", "Spring Boot", "ASP.NET", "AWS", "Docker", "Kubernetes", "TensorFlow", "Apache Kafka", "n8n", "Crew CMS"],
    projects: [
      "VaultX (DevOps tool)",
      "EduMeet (WebRTC platform)",
      "MelomV (Emotion-based music player)",
      "Skeo-Trace (Blockchain traceability)",
    ],
    publications: [],
    experience: [
      "SDE Intern — Catchaxe",
      "Full Stack Intern — UrsDigitally",
      "SDE Intern — Agadhanimus",
      "AI Intern — Wipro",
      "Cybersecurity Intern — IIIT Delhi",
    ],
    certifications: [],
    email: "skdas5405@gmail.com",
    linkedin: "https://linkedin.com/in/sumitkumardas-ai",
    github: "skdas20",
  },
  {
    name: "Saniya Dey",
    role: "Treasurer",
    committee: "Executive Committee",
    image: "/picture/saniya.jpeg",
    badge: "Treasurer",
    about: "2nd-year ECE student with keen interest in electronics & communication systems. Manages chapter finances and event budgets as IEEE APS Treasurer.",
    skills: ["Python", "Java", "DSA", "CST Microwave Studio", "MATLAB", "Canva"],
    projects: [
      "Jetson EduTech Bot (NVIDIA Jetson)",
      "Antenna-Based Oil Sensor",
      "ESP32 WiFi Message Display",
    ],
    publications: [],
    experience: ["IEEE Member", "Event Organizing"],
    certifications: ["AI Courses", "NPTEL (Chemistry, Soft Skills)"],
    email: "Saniyadey2005@gmail.com",
    linkedin: "https://www.linkedin.com/in/saniya-dey",
  },
  {
    name: "Shrijita Lo",
    role: "Secretary",
    committee: "Executive Committee",
    image: "/picture/shrijita.jpeg",
    badge: "Secretary",
    about: "ECE student focused on RF engineering and electromagnetic systems. Published researcher with multiple IEEE papers at WAMS 2026.",
    skills: ["Python", "Java", "DSA", "CST Microwave Studio", "MATLAB"],
    projects: [
      "PillPall (Smart Medicine Dispenser)",
      "Microplastics Study",
      "ESP32 Face Recognition System",
      "ML-based Antenna Optimization",
    ],
    publications: ["Multiple accepted research papers — IEEE WAMS 2026 (antenna & sensing systems)"],
    experience: ["IEEE Member", "Event Organizing"],
    certifications: [],
    email: "shrijitalo5@gmail.com",
    linkedin: "https://www.linkedin.com/in/shrijita-lo",
  },

  /* ── Core Committee ── */
  {
    name: "Ayan Chatterjee",
    role: "Operations Lead",
    committee: "Core Committee",
    image: "/picture/ayan.jpeg",
    badge: "Ops Lead",
    about: "ECE student with a strong technical foundation and leadership skills. Operations Lead driving event logistics and chapter execution.",
    skills: ["C", "Python", "HTML", "MATLAB", "DSA (C, Java)", "SolidWorks"],
    projects: [
      "Footstep Power Generator",
      "Alcohol Detector",
      "Agricultural Drone",
      "Water Quality Checker & Fish Farming",
      "Voice Detector",
      "Plagiarism Checker",
      "Advanced Sign Language Website",
      "Robo Car (Robo Race)",
    ],
    publications: [],
    experience: [
      "IEEE Circuits and Systems Society (Student Member)",
      "IEEE Electron Devices Society",
      "Operations Lead — IEEE IEM AP-S",
    ],
    certifications: [
      "Google Prompting Essential",
      "Design Thinking for Innovators",
      "AI Ladder Framework",
      "Microsoft AI & ML Engineering",
      "Google AI Essentials",
    ],
    email: "achatterjee.work@gmail.com",
    linkedin: "#",
  },
  {
    name: "Souvik Chakraborty",
    role: "PR Lead",
    committee: "Core Committee",
    image: "/picture/souvik.jpeg",
    about: "Motivated ECE student with a strong foundation in C, Python, electronics circuits, and mathematics. Passionate about embedded systems and electronics design.",
    skills: ["C", "C++", "Python", "HTML", "Teamwork", "Leadership"],
    projects: [
      "Footstep Power Generator",
      "Alcohol Detector",
      "Agricultural Drone (Ongoing — AI & IoT)",
    ],
    publications: [],
    experience: [
      "IEEE Student Member — CASS, AP-S, EDS",
    ],
    certifications: [],
    email: "babanc2006@iem.edu.in",
    linkedin: "#",
  },
  {
    name: "Sarthak Mukherjee",
    role: "Graphics Lead",
    committee: "Core Committee",
    image: "/picture/sarthak.jpeg",
    about: "Creative design lead responsible for all visual communication and branding of the IEEE APS IEM chapter.",
    skills: [],
    projects: [],
    publications: [],
    experience: ["Graphics Lead — IEEE IEM AP-S"],
    certifications: [],
    email: "",
    linkedin: "#",
  },
  {
    name: "Debraj Debnath",
    role: "Content Lead",
    committee: "Core Committee",
    image: "/picture/debraj.jpeg",
    about: "ECE undergraduate at IEM Kolkata with expertise in software development, IoT, and embedded systems. Active IEEE leader and problem solver.",
    skills: ["Python", "C/C++", "Java", "JavaScript", "SQL", "MATLAB", "Git", "PCB Design", "EasyEDA"],
    projects: [
      "LokSetu (Citizen Grievance Platform)",
      "Women Safety Smart Route System",
      "Eco Wastewater Treatment System (IoT + Python)",
    ],
    publications: [],
    experience: [
      "Content Lead — IEEE IEM APS",
      "PR Lead — IEEE IEM WIE",
      "Python Developer — Codveda Technologies",
    ],
    certifications: [],
    email: "ddebraj496@gmail.com",
    linkedin: "https://www.linkedin.com/in/debraj-debnath-b28a3a30a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
];

/* ─── Member Detail Modal ─── */
const MemberModal = ({ member, onClose }: { member: typeof MEMBERS[0]; onClose: () => void }) => {
  const hasProjects = member.projects.length > 0;
  const hasPublications = member.publications.length > 0;
  const hasExperience = member.experience.length > 0;
  const hasCerts = member.certifications.length > 0;
  const hasSkills = member.skills.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col glass-card border-primary/20"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(12, 14, 16, 0.95) 30%, rgba(12, 14, 16, 0.98) 100%)",
        }}
      >
        {/* Top accent bar */}
        <div className="shrink-0 h-[3px] w-full bg-gradient-to-r from-primary via-primary/40 to-transparent sticky top-0 z-10" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-on-surface-variant/50 hover:text-primary border border-outline-variant/20 hover:border-primary/40 transition-all z-10 bg-surface-dim/80 backdrop-blur-sm"
        >
          <X size={14} />
        </button>

        <div
          className="p-8 md:p-10 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,212,255,0.2) transparent',
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            {/* Photo */}
            <div className="w-28 h-28 shrink-0 relative mx-auto sm:mx-0">
              <div className="absolute inset-0 border border-primary/20" />
              <div className="absolute inset-1 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />
            </div>

            {/* Name & role */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
                <span className="font-label text-[8px] text-primary uppercase tracking-[0.3em] font-bold">{member.committee}</span>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl font-black text-on-surface uppercase tracking-tight mb-1">{member.name}</h3>
              <p className="font-label text-sm text-primary uppercase tracking-widest mb-4">{member.role}</p>

              {/* Social links */}
              <div className="flex gap-3">
                {member.linkedin && (
                  <a href={member.linkedin} target={member.linkedin !== "#" ? "_blank" : "_self"} rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant/50 hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
                    <Linkedin size={14} />
                  </a>
                )}
                {(member as any).github && (
                  <a href={`https://github.com/${(member as any).github}`} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant/50 hover:text-primary hover:border-primary/40 transition-all">
                    <Github size={14} />
                  </a>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="w-8 h-8 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant/50 hover:text-primary hover:border-primary/40 transition-all">
                    <Mail size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <p className="text-on-surface-variant/80 font-body text-sm leading-relaxed mb-8">{member.about}</p>

          <div className="space-y-8">
            {/* Skills */}
            {hasSkills && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={14} className="text-primary" />
                  <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Skills & Technologies</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((s) => (
                    <span key={s} className="px-3 py-1 text-[10px] font-label uppercase tracking-widest border border-primary/20 text-primary/80 bg-primary/5 hover:bg-primary/10 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {hasProjects && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical size={14} className="text-primary" />
                  <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Projects</h4>
                </div>
                <div className="space-y-2">
                  {member.projects.map((p) => (
                    <div key={p} className="flex items-start gap-3 p-3 bg-surface-container-high/30 border border-outline-variant/10">
                      <ChevronRight size={12} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs font-body text-on-surface-variant/80">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {hasPublications && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={14} className="text-primary" />
                  <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Publications</h4>
                </div>
                <div className="space-y-2">
                  {member.publications.map((p) => (
                    <div key={p} className="flex items-start gap-3 p-3 bg-surface-container-high/30 border border-outline-variant/10">
                      <BookOpen size={12} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs font-body text-on-surface-variant/80">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {hasExperience && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={14} className="text-primary" />
                  <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Experience</h4>
                </div>
                <div className="space-y-2">
                  {member.experience.map((e) => (
                    <div key={e} className="flex items-start gap-3 p-3 bg-surface-container-high/30 border border-outline-variant/10">
                      <ChevronRight size={12} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs font-body text-on-surface-variant/80">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {hasCerts && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award size={14} className="text-primary" />
                  <h4 className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Certifications</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.certifications.map((c) => (
                    <span key={c} className="px-3 py-1 text-[10px] font-label uppercase tracking-wider border border-outline-variant/20 text-on-surface-variant/60 bg-surface-container-high/30">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Member Card (Grid Item) ─── */
const MemberCard = ({ member, index }: { member: typeof MEMBERS[0]; index: number }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="group cursor-pointer h-full"
        onClick={() => setShowModal(true)}
      >
        <div className="glass-card p-0 relative overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
          {/* Scan line */}
          <div className="card-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Photo area */}
          <div className="relative shrink-0 h-52 overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className={`w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100 ${member.name === "Sumit Kumar Das" ? "object-[center_28%] md:object-center" : ""
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/20 to-transparent" />

            {/* Badge */}
            {member.badge && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-primary/90 text-on-primary text-[8px] font-label uppercase font-black tracking-widest shadow-[0_0_12px_rgba(0,212,255,0.3)]">
                <Shield size={8} />
                {member.badge}
              </div>
            )}

            {/* LinkedIn icon */}
            <div className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-surface-dim/60 backdrop-blur-sm border border-outline-variant/20 text-on-surface-variant/50 group-hover:text-primary group-hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                if (member.linkedin && member.linkedin !== "#") window.open(member.linkedin, "_blank");
              }}
            >
              <Linkedin size={12} />
            </div>
          </div>

          {/* Info */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span className="font-label text-[8px] text-primary/50 uppercase tracking-[0.2em]">{member.committee}</span>
            </div>
            <h4 className="font-headline text-base font-black text-on-surface uppercase tracking-tight mb-1 group-hover:text-primary transition-colors duration-300">
              {member.name}
            </h4>
            <p className="font-label text-[10px] text-primary/60 uppercase tracking-[0.2em] mb-4">{member.role}</p>

            {/* Quick skill tags (show first 3) */}
            {member.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {member.skills.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 text-[8px] font-label uppercase tracking-wider border border-outline-variant/15 text-on-surface-variant/40">
                    {s}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className="px-2 py-0.5 text-[8px] font-label text-primary/40">
                    +{member.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* View profile prompt */}
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-1 text-[9px] font-label text-primary/40 uppercase tracking-widest group-hover:text-primary transition-colors">
                <span>View Dossier</span>
                <ExternalLink size={9} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <MemberModal member={member} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
};

/* ─── Main Team Section ─── */
export const TeamSection = () => {
  const facultyMembers = MEMBERS.filter((m) => m.committee === "Faculty Adviser");
  const execMembers = MEMBERS.filter((m) => m.committee === "Executive Committee");
  const coreMembers = MEMBERS.filter((m) => m.committee === "Core Committee");

  return (
    <section id="team" className="py-32 px-8 bg-surface-dim relative overflow-hidden">
      <div className="absolute inset-0 hex-grid-bg opacity-50" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
            <Users size={16} className="text-primary" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <h2 className="font-headline text-5xl font-black uppercase tracking-tighter mb-4">Tactical Command</h2>
          <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-[0.4em]">The operatives behind the mission</p>
          <div className="w-24 h-[2px] gradient-line-animated mx-auto mt-6" />
        </div>

        {/* Faculty Adviser */}
        {facultyMembers.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <Award size={14} className="text-primary" />
              <h3 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface">Faculty Adviser</h3>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
            </div>
            <div className="flex justify-center">
              {facultyMembers.map((member, i) => (
                <MemberCard key={member.name} member={member} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Executive Committee */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <Shield size={14} className="text-primary" />
            <h3 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface">Executive Committee</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {execMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>

        {/* Core Committee */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Cpu size={14} className="text-primary" />
            <h3 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface">Core Committee</h3>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
