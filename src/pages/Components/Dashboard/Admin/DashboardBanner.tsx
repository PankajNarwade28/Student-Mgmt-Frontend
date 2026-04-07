import React from 'react';

interface BannerProps {
  title: string;
  subtitle: string;
  registryId: string;
  region: string;
}

const DashboardBanner: React.FC<BannerProps> = ({ title, subtitle, registryId, region }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#004d40] text-white shadow-lg mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00796b]/90 to-transparent z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1000" 
        alt="Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      <div className="relative z-20 p-2 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-teal-100/80 mb-3 tracking-wide">
            <span>DASHBOARD</span> / <span>{subtitle.toUpperCase()}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          <div className="flex gap-4 mt-4">
            <span className="bg-amber-100/90 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Operational</span>
            <span className="text-teal-50 text-xs font-medium">Uptime: 99.9%</span>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 flex gap-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-center px-4">
            <p className="text-[10px] text-teal-100 uppercase tracking-widest font-bold">Registry ID</p>
            <p className="font-mono text-sm">{registryId}</p>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center px-4">
            <p className="text-[10px] text-teal-100 uppercase tracking-widest font-bold">Region</p>
            <p className="text-sm font-semibold text-white">{region}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBanner;