import React, { useState, useEffect } from 'react';
import { Download, Mail, MapPin, Phone, Briefcase, GraduationCap, Code, ChevronDown, ArrowRight, ExternalLink, Menu, X } from 'lucide-react';
import { personalInfo, education, experience, skills } from './data';
import { generatePDF } from './lib/pdfUtils';
import { PrintableCV } from './components/PrintableCV';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

// Custom easing for premium Apple-like feel
const customEase = [0.22, 1, 0.36, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const navItems = [
  { label: 'Tentang', id: 'about' },
  { label: 'Pengalaman', id: 'experience' },
  { label: 'Keahlian', id: 'skills' },
];

export default function App() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionIds = ['about', 'experience', 'skills'];
      const scrollPosition = window.scrollY + 250;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
    if (e) e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const handleDownloadCV = async () => {
    setIsGeneratingPDF(true);
    await generatePDF('printable-cv', 'CV_Sepia_Azhari.pdf');
    setIsGeneratingPDF(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-rose-200 selection:text-rose-900 relative overflow-hidden">
      <PrintableCV />

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      {/* Decorative Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <motion.div 
          style={{ y: yBg }}
          className="w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-[120px] opacity-50 absolute -top-[20%] -left-[10%]"
        />
        <motion.div 
          style={{ y: yBg }}
          className="w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[100px] opacity-50 absolute bottom-[0%] right-[0%]"
        />
      </div>

      {/* Floating Navbar (Desktop) */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl hidden md:block"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(225,29,72,0.06)] rounded-full px-3 py-2 flex items-center justify-between transition-all duration-500">
          <a 
            href="#about" 
            onClick={(e) => scrollToSection(e, 'about')}
            className="pl-5 font-serif text-xl font-bold tracking-tight text-zinc-900 cursor-pointer"
          >
            S<span className="text-rose-500">A.</span>
          </a>
          <div className="flex items-center gap-1 bg-zinc-100/70 rounded-full p-1 border border-zinc-200/50">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownloadCV}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Download size={16} className={isGeneratingPDF ? "animate-bounce" : ""} />
            <span>CV</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Navbar with interactive drawer */}
      <nav className="md:hidden fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/70 px-5 py-3.5 transition-all">
        <div className="flex justify-between items-center">
          <a 
            href="#about" 
            onClick={(e) => scrollToSection(e, 'about')}
            className="font-serif text-2xl font-bold tracking-tight text-zinc-900"
          >
            S<span className="text-rose-500">A.</span>
          </a>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCV}
              disabled={isGeneratingPDF}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm disabled:opacity-70"
            >
              <Download size={13} className={isGeneratingPDF ? "animate-bounce" : ""} /> CV
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-700 hover:text-rose-600 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: customEase }}
              className="overflow-hidden pt-3 pb-2 border-t border-zinc-100 mt-3"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-rose-50 text-rose-700 font-semibold'
                          : 'text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-32">
        
        {/* Bento Grid Hero */}
        <motion.section 
          id="about"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="scroll-mt-32 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[75vh]"
        >
          {/* Main Greeting Box */}
          <motion.div variants={fadeInUp} className="md:col-span-8 bg-white/60 backdrop-blur-sm border border-zinc-200/50 rounded-[2.5rem] p-10 md:p-16 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-100 text-rose-600 text-xs font-bold tracking-wide uppercase mb-8 shadow-sm self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Tersedia untuk bekerja
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Halo, saya <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-pink-500 pr-2">
                {personalInfo.name.split(' ')[0]}
              </span>
              <span className="text-zinc-400">{personalInfo.name.split(' ')[1]}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed mb-10 font-light">
              Lulusan Manajemen yang berfokus pada <span className="font-medium text-zinc-900">administrasi, analisis data,</span> dan <span className="font-medium text-zinc-900">efisiensi operasional</span>. Mengubah data kompleks menjadi solusi terstruktur.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-auto">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-zinc-900/20"
              >
                <Mail size={18} /> Hubungi Saya
              </motion.a>
              <div className="flex items-center gap-4 px-6 py-3.5 rounded-full bg-white/80 border border-zinc-200/50 shadow-sm text-sm font-medium text-zinc-700">
                <span className="flex items-center gap-2"><Phone size={16} className="text-rose-500"/> {personalInfo.phone}</span>
              </div>
            </div>
          </motion.div>

          {/* Side Bento Boxes */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Image Box */}
            <motion.div variants={fadeInUp} className="flex-1 rounded-[2.5rem] p-2 bg-white/60 backdrop-blur-sm border border-zinc-200/50 overflow-hidden relative group min-h-[300px]">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: customEase }}
                className="w-full h-full rounded-[2rem] overflow-hidden relative"
              >
                <img 
                  src={personalInfo.profileImage} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent"></div>
              </motion.div>
            </motion.div>

            {/* Stats Box */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-700"></div>
              <Briefcase size={28} className="mb-4 text-rose-100" />
              <h3 className="text-4xl font-bold mb-1">4+</h3>
              <p className="text-rose-100 font-medium text-sm">Tahun Pengalaman Kerja</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Experience Section - Sleek Cards */}
        <motion.section 
          id="experience"
          className="scroll-mt-32 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <span id="pengalaman" className="absolute -top-32 left-0 pointer-events-none"></span>
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">Jejak Karir</h2>
              <p className="text-zinc-500 text-lg">Pengalaman profesional dalam operasional & data.</p>
            </div>
            <div className="w-16 h-1 bg-rose-500 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {experience.map((exp, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.08)] transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors duration-500">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{exp.role}</h3>
                <p className="text-rose-600 font-medium mb-6">{exp.company}</p>
                <p className="text-zinc-600 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills & Education Bento */}
        <motion.section 
          id="skills"
          className="scroll-mt-32 grid grid-cols-1 md:grid-cols-12 gap-6 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          <span id="keahlian" className="absolute -top-32 left-0 pointer-events-none"></span>
          {/* Education Block */}
          <motion.div variants={fadeInUp} className="md:col-span-5 bg-zinc-900 text-white rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-[80px]"></div>
            <h2 className="text-3xl font-serif font-bold mb-10 relative z-10 flex items-center gap-3">
              <GraduationCap className="text-rose-400"/> Pendidikan
            </h2>
            <div className="space-y-8 relative z-10 flex-1">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l border-zinc-700/50">
                  <div className="absolute w-3 h-3 bg-zinc-900 border-2 border-rose-500 rounded-full -left-[6.5px] top-1.5"></div>
                  <h3 className="text-lg font-bold text-zinc-100">{edu.institution}</h3>
                  {edu.degree && <p className="text-rose-400 font-medium text-sm mt-1">{edu.degree}</p>}
                  <p className="text-sm text-zinc-500 mt-2">{edu.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills Block */}
          <motion.div variants={fadeInUp} className="md:col-span-7 bg-white/60 backdrop-blur-sm border border-zinc-200/50 rounded-[2.5rem] p-10 flex flex-col">
            <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-10 flex items-center gap-3">
              <Code className="text-rose-500"/> Keahlian Inti
            </h2>
            <div className="flex flex-wrap gap-4 mt-auto">
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white border border-zinc-200 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-700 shadow-sm hover:border-rose-200 hover:shadow-rose-100 transition-all flex items-center gap-3 group"
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-rose-500 transition-colors"></span>
                  {skill}
                </motion.div>
              ))}
              {/* Additional Skill Badges for design density */}
              {['Data Analysis', 'Reporting', 'Team Coordination'].map((skill, index) => (
                <motion.div 
                  key={skill}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl text-sm font-semibold text-zinc-500 shadow-sm transition-all flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-zinc-200"></span>
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-zinc-200/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-2xl font-bold tracking-tight text-zinc-900">
            S<span className="text-rose-500">A.</span>
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Sepia Azhari. Dirancang dengan kebanggaan.
          </p>
          <div className="flex gap-4">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-rose-100 hover:text-rose-600 transition-colors">
              <ChevronDown className="rotate-180" size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
