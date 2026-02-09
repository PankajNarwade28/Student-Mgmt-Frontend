import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineAcademicCap, 
  HiOutlineChartBar,  
  HiOutlineStar,
  HiOutlineMenu,
  HiOutlineX
} from "react-icons/hi";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">M</div>
          <span className="font-bold text-xl text-slate-900 hidden sm:block tracking-tight">Modern ERP</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "About", "Reviews", "Support"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              {item}
            </a>
          ))}
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Portal Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
          <a href="#features" className="font-bold text-slate-700 p-2" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#reviews" className="font-bold text-slate-700 p-2" onClick={() => setIsOpen(false)}>Reviews</a>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100"
          >
            <LayoutDashboard size={18} /> Go to Dashboard
          </button>
        </div>
      )}
    </nav>
  );
};

const HeroCarousel = () => {
  const navigate = useNavigate();
  const slides = [
    { title: "Smart Academic Management", desc: "Digitalizing the student lifecycle at Modern College of Engineering." },
    { title: "Empowering Faculty", desc: "Advanced tools for SQA, DMBI, and curriculum management." },
    { title: "Centralized Data Hub", desc: "Real-time analytics for institutional growth and excellence." }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-100/50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest border border-indigo-100">
            Institutional ERP Solutions
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight min-h-[3.2em]">
            {slides[current].title}
          </h1>
          <p className="text-lg text-slate-500 max-w-lg transition-opacity duration-500">
            {slides[current].desc}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              <LayoutDashboard size={20} />
              Go to Dashboard
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative h-[400px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center">
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] mx-auto flex items-center justify-center text-indigo-600 shadow-inner">
               <HiOutlineAcademicCap size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-mono text-xs uppercase tracking-tighter">system_status: operational</p>
              <div className="flex justify-center gap-2">
                 {slides.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? "w-10 bg-indigo-600" : "w-2 bg-slate-200"}`} />
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const feats = [
    { title: "Course Management", desc: "Detailed tracking of Unit-wise syllabi including AngularJS and DMBI.", icon: <HiOutlineAcademicCap /> },
    { title: "Real-time Analytics", desc: "Performance reports and data visualization for academic trainees.", icon: <HiOutlineChartBar /> },
    { title: "Member Directory", desc: "Centralized database for students, faculty, and administrative staff.", icon: <HiOutlineStar /> }
  ];
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Purpose of Modern ERP</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base">Our platform streamlines complex academic processes, from curriculum design to exam scheduling.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {feats.map((f, i) => (
          <div key={i} className="p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all group">
            <div className="w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
               {f.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Reviews = () => (
  <section id="reviews" className="py-24 bg-slate-900 text-white overflow-hidden relative">
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
    </div>
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
      <div>
         <h2 className="text-4xl font-bold mb-6 leading-tight">Trusted by Modern College Faculty</h2>
         <p className="text-slate-400 text-lg leading-relaxed mb-8">Hear from the academic leaders who use our ERP to manage their daily schedules and student interactions.</p>
         <div className="flex gap-1 text-amber-400">
           {[...Array(5)].map((_, i) => <HiOutlineStar key={i} size={28} className="fill-current" />)}
         </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white/10 italic text-xl md:text-2xl leading-relaxed shadow-2xl">
        "The integration of our Unit IV AngularJS syllabus and DMBI practical tracking has revolutionized how we monitor student progress."
        <div className="mt-10 not-italic flex items-center gap-4">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">AS</div>
           <div>
              <p className="text-base font-bold text-white">Dr. A. K. Sharma</p>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">HOD, MCA Department</p>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="space-y-6">
        <div className="font-bold text-2xl text-slate-900 tracking-tight">Modern ERP</div>
        <p className="text-sm text-slate-500 leading-relaxed">Official ERP Solution for Modern College of Engineering. Streamlining excellence since 2024.</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-[0.2em]">Portal</h4>
        <ul className="text-sm text-slate-500 space-y-4">
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">Student Login</li>
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">Teacher Roster</li>
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">Academic Calendar</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-[0.2em]">Support</h4>
        <ul className="text-sm text-slate-500 space-y-4">
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">Help Center</li>
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">System Status</li>
          <li className="hover:text-indigo-600 transition-colors cursor-pointer font-medium">Feedback</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-[0.2em]">Follow Us</h4>
        <div className="flex gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center text-slate-400 group">
              <div className="w-2 h-2 bg-current rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-12 mt-20 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
      © 2026 Modern College of Engineering | Built for MCA Academic Excellence
    </div>
  </footer>
);

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />
      <HeroCarousel />
      <Features />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Main;