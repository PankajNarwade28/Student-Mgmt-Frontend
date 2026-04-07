import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  HiOutlineCurrencyRupee, 
  HiOutlineClipboardList, 
  HiOutlineShieldCheck,
  HiOutlineChartBar 
} from "react-icons/hi";

const Fees: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Logic: Highlights 'structure' if path is exactly /fees or /fees/structure
  const isActive = (path: string) => {
    if (path === "structure") {
      return (
        location.pathname.endsWith("/fees") ||
        location.pathname.endsWith("/fees/") ||
        location.pathname.includes("/structure")
      );
    }
    return location.pathname.includes(path);
  };

  // const getTabStyle = (path: string) => `
  //   flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-[1px]
  //   ${
  //     isActive(path)
  //       ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 font-semibold"
  //       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
  //   }
  // `;

  const tabs = [
    { id: "structure", label: "Fee Structure", icon: <HiOutlineCurrencyRupee /> },
    { id: "transactions", label: "Transactions", icon: <HiOutlineClipboardList /> },
    { id: "discounts", label: "Scholarships/Discounts", icon: <HiOutlineShieldCheck /> },
    { id: "reports", label: "Revenue Reports", icon: <HiOutlineChartBar /> },
  ];

  return (
   <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 border border-slate-100 overflow-hidden animate-in fade-in duration-500">
  {/* 1. TOP NAVIGATION TABS (Teal / Operational Style) */}
  <div className="border-b border-slate-100 bg-white">
    <div className="flex flex-col min-[786px]:flex-row min-[786px]:items-center px-2 min-[786px]:px-4">
      <div className="grid grid-cols-2 gap-2 w-full py-1 min-[786px]:flex min-[786px]:flex-row min-[786px]:overflow-x-auto min-[786px]:gap-1 min-[786px]:py-0 scrollbar-hide">
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id === "structure" ? "" : tab.id)}
              className={`
                flex items-center justify-center min-[786px]:justify-start transition-all whitespace-nowrap
                gap-2 px-4 py-4 text-xs font-bold uppercase tracking-widest hover:cursor-pointer
                min-[786px]:border-b-2 -mb-[1px]
                ${
                  active
                    ? "border-[#00796b] text-[#00796b] bg-teal-50/50 shadow-inner rounded-xl min-[786px]:rounded-none"
                    : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl min-[786px]:rounded-none"
                }
              `}
            >
              <span className={`text-lg shrink-0 ${active ? "text-[#00796b]" : "text-slate-300"}`}>
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>

  {/* 2. DYNAMIC CONTENT AREA */}
  <div className="p-4 md:p-8 bg-gray-50/20 min-h-[400px]">
    <Outlet />
  </div>
</div>
  );
};

export default Fees;