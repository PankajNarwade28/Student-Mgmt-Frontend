import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineAcademicCap, 
  HiOutlineChartBar,  
  HiOutlineStar,
  HiOutlineMenu,
  HiOutlineX, 
  HiOutlineLightningBolt,
  HiOutlineShieldCheck
} from "react-icons/hi";
import { LayoutDashboard } from "lucide-react";
import { HiOutlinePlusCircle } from "react-icons/hi2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00796b] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-teal-200/50">M</div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-lg text-slate-800 tracking-tighter uppercase">Modern ERP</span>
            <span className="text-[8px] font-black text-teal-600 tracking-[0.2em] uppercase">Academic Hub</span>
          </div>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Features", "About", "Reviews", "Support"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00796b] transition-all">
              {item}
            </a>
          ))}
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#00796b] transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Portal Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-600 p-2 rounded-xl hover:bg-teal-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white border-b border-slate-100 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-700" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#reviews" className="text-xs font-black uppercase tracking-widest text-slate-700" onClick={() => setIsOpen(false)}>Reviews</a>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#00796b] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-100"
          >
            <LayoutDashboard size={18} /> Access Dashboard
          </button>
        </div>
      )}
    </nav>
  );
};

const HeroCarousel = () => {
  const navigate = useNavigate();
  const slides = [
    { title: "Smart Academic Management", desc: "Digitalizing the student lifecycle at Modern College of Engineering with high-density data protocols." },
    { title: "Empowering Faculty Systems", desc: "Advanced administrative tools for SQA, DMBI, and curriculum synchronization." },
    { title: "Centralized Ledger Hub", desc: "Real-time analytical visualizers for institutional growth and operational excellence." }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="pt-40 pb-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Visual Tech Decors */}
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/3">
        <svg width="800" height="800" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" stroke="#00796b" fill="none" strokeWidth="0.2" strokeDasharray="1 1" /></svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 text-[#00796b] text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Institutional ERP v4.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-[0.95] tracking-tighter min-h-[3em]">
            {slides[current].title}
          </h1>
          
          <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed transition-opacity duration-700 italic">
            "{slides[current].desc}"
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 bg-[#00796b] hover:bg-[#004d40] text-white px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-teal-200 active:scale-95"
            >
              <LayoutDashboard size={20} className="text-teal-300" />
              Go to Dashboard
            </button>
            <button className="px-10 py-5 bg-white border border-slate-200 text-slate-400 text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:text-[#00796b] hover:border-[#00796b] transition-all shadow-sm">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative h-[450px] bg-white rounded-[3rem] border border-slate-50 shadow-[0_40px_80px_-15px_rgba(0,121,107,0.1)] overflow-hidden flex items-center justify-center group">
          {/* Internal Dashboard Mockup Detail */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-white pointer-events-none" />
          <div className="space-y-8 text-center relative z-10">
            <div className="w-28 h-28 bg-teal-50 rounded-[2.5rem] mx-auto flex items-center justify-center text-[#00796b] shadow-inner group-hover:rotate-6 transition-transform duration-500">
               <HiOutlineAcademicCap size={56} />
            </div>
            <div className="space-y-4">
              <p className="text-[#00796b] font-mono text-[10px] font-black uppercase tracking-[0.4em]">system_status: operational</p>
              <div className="flex justify-center gap-3">
                 {slides.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${current === i ? "w-12 bg-[#00796b]" : "w-3 bg-slate-200"}`} />
                 ))}
              </div>
            </div>
          </div>
          {/* Floating UI Elements */}
          <div className="absolute top-10 right-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-teal-100 shadow-xl animate-bounce duration-[3000ms]">
            <HiOutlineLightningBolt className="text-amber-400 text-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const feats = [
    { title: "Course Management", desc: "Technical tracking of Unit-wise syllabi including AngularJS, React, and DMBI protocols.", icon: <HiOutlineAcademicCap /> },
    { title: "Real-time Analytics", desc: "Operational performance logs and data visualizers for academic lifecycle audits.", icon: <HiOutlineChartBar /> },
    { title: "Identity Registry", desc: "Encrypted centralized database for students, faculty, and administrative nodes.", icon: <HiOutlineShieldCheck /> }
  ];
  return (
    <section id="features" className="py-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
        <div className="space-y-2">
          <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.3em]">Core Modules</nav>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter leading-none">Purpose of Modern ERP</h2>
        </div>
        <p className="text-slate-400 font-medium max-w-md text-sm italic border-l-2 border-teal-100 pl-6">
          Streamlining complex institutional processes from curriculum initialization to audit-ready scheduling.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {feats.map((f, i) => (
          <div key={i} className="p-10 rounded-[3rem] border border-slate-50 bg-white hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* {React.cloneElement(f.icon as React.ReactElement, { size : 150 })}
                */}
                {f.icon}
            </div>
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-[#00796b] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
               {f.icon}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight uppercase group-hover:text-[#00796b] transition-colors">{f.title}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Reviews = () => (
  <section id="reviews" className="py-32 bg-slate-900 text-white overflow-hidden relative">
    {/* Decorative Tech Grid */}
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00796b 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
      <div>
         <nav className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-4">Faculty Feedback</nav>
         <h2 className="text-5xl font-black mb-8 leading-[1.1] tracking-tighter">Trusted by Academic Leaders</h2>
         <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">Hear from the department heads who use our ERP to manage daily operational synchronizations.</p>
         <div className="flex gap-2 text-teal-500">
           {[...Array(5)].map((_, i) => <HiOutlineStar key={i} size={24} className="fill-current" />)}
         </div>
      </div>
      <div className="bg-white/5 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white/10 italic text-2xl leading-relaxed shadow-2xl relative">
        <div className="absolute top-10 left-10 text-6xl text-teal-500/20 font-serif">“</div>
        <span className="relative z-10 font-medium text-slate-200">
          "The integration of our Unit IV AngularJS syllabus and DMBI practical tracking has revolutionized how we monitor student registry progress."
        </span>
        <div className="mt-12 not-italic flex items-center gap-5 border-t border-white/10 pt-10">
           <div className="w-16 h-16 bg-[#00796b] rounded-[1.5rem] flex items-center justify-center font-black text-white shadow-xl shadow-teal-900/50 text-xl">AS</div>
           <div>
              <p className="text-lg font-black text-white tracking-tight">Dr. A. K. Sharma</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400 font-black">HOD, MCA Department</p>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-24">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">M</div>
          <span className="font-black text-xl text-slate-800 tracking-tighter uppercase">Modern ERP</span>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
          Official Operational Registry Solution for Modern College of Engineering. Streamlining MCA Excellence since 2024.
        </p>
      </div>
      <div>
        <h4 className="font-black text-slate-800 mb-8 text-[10px] uppercase tracking-[0.3em]">Module Gateway</h4>
        <ul className="text-[11px] font-black uppercase tracking-widest text-slate-400 space-y-5">
          <li className="hover:text-[#00796b] transition-all cursor-pointer">Student Ledger</li>
          <li className="hover:text-[#00796b] transition-all cursor-pointer">Faculty Roster</li>
          <li className="hover:text-[#00796b] transition-all cursor-pointer">Academic Calendar</li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-slate-800 mb-8 text-[10px] uppercase tracking-[0.3em]">System Support</h4>
        <ul className="text-[11px] font-black uppercase tracking-widest text-slate-400 space-y-5">
          <li className="hover:text-[#00796b] transition-all cursor-pointer">Security Protocols</li>
          <li className="hover:text-[#00796b] transition-all cursor-pointer">System Status</li>
          <li className="hover:text-[#00796b] transition-all cursor-pointer">Operational Feedback</li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-slate-800 mb-8 text-[10px] uppercase tracking-[0.3em]">Operational Nodes</h4>
        <div className="flex gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-[#00796b] hover:text-white transition-all flex items-center justify-center text-slate-300">
              <HiOutlinePlusCircle size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-12 mt-24 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
        © 2026 Modern College of Engineering | Built for Academic Excellence
      </div>
      <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        <span className="hover:text-[#00796b] cursor-pointer">Privacy Protocol</span>
        <span className="hover:text-[#00796b] cursor-pointer">Security Policy</span>
      </div>
    </div>
  </footer>
);

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-teal-100 selection:text-[#00796b] antialiased">
      <Navbar />
      <HeroCarousel />
      <Features />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Main;