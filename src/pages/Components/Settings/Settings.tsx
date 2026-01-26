import React, { useEffect, useState } from "react";
import { 
  HiOutlineUserCircle, 
  HiOutlineShieldCheck, 
  HiOutlineBell, 
  HiOutlineColorSwatch,
  HiOutlineSave
} from "react-icons/hi";
import { toast } from "react-hot-toast";

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"Profile" | "Security" | "Notifications" | "Appearance">("Profile");

  const sections = [
    { id: "Profile", icon: <HiOutlineUserCircle />, label: "Personal Profile" },
    { id: "Security", icon: <HiOutlineShieldCheck />, label: "Security & Password" },
    { id: "Notifications", icon: <HiOutlineBell />, label: "Notification Settings" },
    { id: "Appearance", icon: <HiOutlineColorSwatch />, label: "Theme & Display" },
  ];

  useEffect(() => { 
    toast.success("This is for demo purposes only. Settings changes won't be saved.");
  } , []);


  const handleSave = () => {
    toast.success("Settings updated successfully! (Demo)");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your profile information and system preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as "Profile" | "Security" | "Notifications" | "Appearance")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeSection === section.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            {activeSection === "Profile" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                  <div className="h-20 w-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                    P
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Profile Picture</h3>
                    <p className="text-xs text-slate-500 mb-3">PNG or JPG no larger than 5MB</p>
                    <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-all">
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10" defaultValue="Pankaj" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10" defaultValue="Narwade" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-400" defaultValue="pankaj@example.com" disabled />
                    <p className="text-[10px] text-slate-400 italic">Email is managed by the system administrator.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Security" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Change Password</h3>
                  <div className="space-y-3 max-w-md">
                    <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <h3 className="font-bold text-slate-800 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                  <button className="px-4 py-2 border border-indigo-200 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-all">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {activeSection === "Appearance" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-indigo-600 rounded-2xl bg-white flex flex-col items-center gap-2 cursor-pointer">
                    <div className="h-12 w-full bg-slate-100 rounded-md" />
                    <span className="text-xs font-bold text-slate-900">Light Mode</span>
                  </div>
                  <div className="p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 cursor-pointer opacity-60">
                    <div className="h-12 w-full bg-slate-800 rounded-md" />
                    <span className="text-xs font-bold text-slate-500">Dark Mode (Beta)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Common Save Button Footer */}
            <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all"
              >
                <HiOutlineSave size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;