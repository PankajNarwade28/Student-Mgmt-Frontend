import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axiosInstance";
import {
  FaUserCircle,
  FaTimes,
  FaCalendarAlt,
  FaPhone,
  FaUserEdit,
FaFingerprint,
  FaCog,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProfileData {
  first_name: string;
  last_name: string;
  role: string;
  date_of_birth: string;
  phone_number: string;
}

const Profile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      if (res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status !== 404) {
        toast.error("Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditRedirect = () => {
    onClose(); // Close the tab
    navigate("/dashboard/settings"); // Redirect to settings
  };

  if (loading) return null;

  return (
    <div className="fixed top-15 right-4 w-70 z-[100] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* Header: Teal Gradient matching the Dashboard Banner */}
      <div className="relative bg-gradient-to-br from-[#00796b] to-[#004d40] p-4 text-white">
        {/* Decorative Circle Background */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <FaFingerprint size={15} className="text-teal-50" />
            </div>
            <div>
              <span className="block font-bold tracking-tight text-sm">Identity Profile</span>
              <span className="text-[10px] text-teal-100/70 uppercase tracking-tighter">Verified Account</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all cursor-pointer group"
          >
            <FaTimes size={14} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <div className="p-3">
        {profile ? (
          <div className="space-y-0">
            {/* User Identity Section */}
            <div className="flex items-center gap-4 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-[#00796b] border-2 border-teal-100 shadow-inner">
                <FaUserCircle size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Primary Holder {profile.role}
                </p>
                <p className="text-[14px] font-bold text-slate-800 leading-tight">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-0">
              <div className="group flex items-center gap-4 p-3 bg-slate-50/80 hover:bg-teal-50/50 rounded-[1.25rem] transition-colors border border-transparent hover:border-teal-100">
                <div className="p-1 bg-white rounded-lg shadow-sm group-hover:text-teal-600 transition-colors">
                  <FaCalendarAlt size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Birth Date</p>
                  <p className="text-xs font-bold text-slate-700">
                    {new Date(profile.date_of_birth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-3 bg-slate-50/80 hover:bg-teal-50/50 rounded-[1.25rem] transition-colors border border-transparent hover:border-teal-100">
                <div className="p-1 bg-white rounded-lg shadow-sm group-hover:text-teal-600 transition-colors">
                  <FaPhone size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Contact Line</p>
                  <p className="text-xs font-bold text-slate-700">{profile.phone_number}</p>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <button
              onClick={handleEditRedirect}
              className="w-full py-3 flex items-center justify-center gap-3 bg-slate-900 text-white text-xs font-extrabold rounded-[1.25rem] hover:bg-[#00796b] transition-all shadow-lg hover:shadow-[#00796b]/20 active:scale-95 group"
            >
              <FaCog className="group-hover:rotate-180 transition-transform duration-700 ease-in-out text-teal-400" />
              Manage System Settings
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserEdit size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-2">
              Your profile is currently <br /><span className="font-bold text-slate-800">Incomplete</span>
            </p>
            <button
              onClick={handleEditRedirect}
              className="w-full py-3 bg-[#00796b] hover:bg-[#004d40] text-white text-xs font-bold rounded-2xl shadow-xl shadow-teal-100 transition-all active:scale-95"
            >
              Initialize Profile Now
            </button>
          </div>
        )}
      </div>
      
      {/* Bottom subtle bar */}
      <div className="h-1.5 w-full bg-slate-50"></div>
    </div>
  ); 
};

export default Profile;
