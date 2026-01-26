import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for redirection
import { 
  HiOutlineAcademicCap, 
  HiOutlineChartBar,  
  HiOutlineStar,
  HiOutlineMenu,
  HiOutlineX
} from "react-icons/hi";
import { LayoutDashboard } from "lucide-react"; // Added for the button icon

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard"); // Redirects to your main ERP dashboard
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-xl text-slate-900 hidden sm:block">Modern ERP</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "About", "Reviews", "Support"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              {item}
            </a>
          ))}
          
          {/* Updated Dashboard Button in Navbar */}
          {/* <button
            onClick={handleRedirect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md active:scale-95"
          >
            <LayoutDashboard size={18} />
            Go to Dashboard
          </button> */}

           <button 
           onClick={handleRedirect}
           className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-all">

            Portal Login

          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <a href="#features" className="font-bold text-slate-700">Features</a>
          <a href="#reviews" className="font-bold text-slate-700">Reviews</a>
          <button 
            onClick={handleRedirect}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl"
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

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest">
            Institutional ERP Solutions
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            {slides[current].title}
          </h1>
          <p className="text-lg text-slate-500 max-w-lg transition-opacity duration-500">
            {slides[current].desc}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {/* Updated Hero Primary Button */}
            <button
              onClick={handleRedirect}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              <LayoutDashboard size={20} />
              Go to Dashboard
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Carousel Visual */}
        <div className="relative h-[400px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center transition-all duration-700">
             <div className="space-y-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-indigo-600">
                   <HiOutlineAcademicCap size={40} />
                </div>
                <p className="text-slate-400 font-mono text-xs">system_status: operational</p>
                <div className="flex justify-center gap-2">
                   {slides.map((_, i) => (
                     <div key={i} className={`h-1.5 rounded-full transition-all ${current === i ? "w-8 bg-indigo-600" : "w-2 bg-slate-200"}`} />
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
    { title: "Course Management", desc: "Detailed tracking of Unit-wise syllabi including AngularJS and DMBI." },
    { title: "Real-time Analytics", desc: "Performance reports and data visualization for academic trainees." },
    { title: "Member Directory", desc: "Centralized database for students, faculty, and administrative staff." }
  ];
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold text-slate-900">Purpose of Modern ERP</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm">Our platform streamlines complex academic processes, from curriculum design to exam scheduling, ensuring a seamless experience for the entire college community.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {feats.map((f, i) => (
          <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <HiOutlineChartBar />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-indigo-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
           <h2 className="text-4xl font-bold mb-6">Trusted by Modern College Faculty</h2>
           <p className="text-indigo-200 leading-relaxed mb-8">Hear from the academic leaders who use our ERP to manage their daily schedules and student interactions.</p>
           <div className="flex gap-1 text-amber-400">
             {[...Array(5)].map((_, i) => <HiOutlineStar key={i} size={24} />)}
           </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-[2.5rem] border border-white/10 italic text-xl leading-relaxed">
          "The integration of our Unit IV AngularJS syllabus and DMBI practical tracking has revolutionized how we monitor student progress."
          <div className="mt-8 not-italic flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-500 rounded-full" />
             <div>
                <p className="text-sm font-bold">Dr. A. K. Sharma</p>
                <p className="text-[10px] uppercase tracking-widest text-indigo-300">HOD, MCA Department</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-100 py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1 space-y-4">
        <div className="font-bold text-xl text-slate-900">Modern ERP</div>
        <p className="text-xs text-slate-400 leading-relaxed">Official ERP Solution for Modern College of Engineering. Streamlining excellence since 2024.</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Portal</h4>
        <ul className="text-sm text-slate-500 space-y-2 cursor-pointer">
          <li className="hover:text-indigo-600 transition-colors">Student Login</li>
          <li className="hover:text-indigo-600 transition-colors">Teacher Roster</li>
          <li className="hover:text-indigo-600 transition-colors">Academic Calendar</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Support</h4>
        <ul className="text-sm text-slate-500 space-y-2 cursor-pointer">
          <li className="hover:text-indigo-600 transition-colors">Help Center</li>
          <li className="hover:text-indigo-600 transition-colors">System Status</li>
          <li className="hover:text-indigo-600 transition-colors">Feedback</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-widest">Follow Us</h4>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-all" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-all" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-all" />
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
      © 2026 Modern College of Engineering | Built for MCA Academic Excellence
    </div>
  </footer>
);

// --- Main Page Assembly ---

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroCarousel />
      <Features />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Main;