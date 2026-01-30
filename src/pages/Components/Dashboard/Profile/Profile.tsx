import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axiosInstance";
import {
  FaUserCircle,
  FaTimes,
  FaCalendarAlt,
  FaPhone,
  FaCog,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProfileData {
  first_name: string;
  last_name: string;
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
    <div className="fixed top-16 left-2 right-2 w-auto sm:left-auto sm:right-4 sm:w-72 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaUserCircle size={22} className="text-white/80" />
            <span className="font-bold tracking-tight text-sm">
              Personal Identity
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {!profile ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 mb-4">
              No profile details found.
            </p>
            <button
              onClick={handleEditRedirect}
              className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100"
            >
              Create Profile Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Name Section */}
            <div className="pb-3 border-b border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Full Name
              </p>
              <p className="text-base font-bold text-slate-800">
                {profile.first_name} {profile.last_name}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <FaCalendarAlt className="text-indigo-500 shrink-0" size={14} />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    Birth Date
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {new Date(profile.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <FaPhone className="text-indigo-500 shrink-0" size={14} />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    Phone
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {profile.phone_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <button
              onClick={handleEditRedirect}
              className="w-full mt-1 py-3 flex items-center justify-center gap-2 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-indigo-600 transition-all group active:scale-95"
            >
              <FaCog className="group-hover:rotate-90 transition-transform duration-500" />
              Manage Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
