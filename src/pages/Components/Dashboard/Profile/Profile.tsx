import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosInstance";
import { FaUserCircle, FaTimes, FaCalendarAlt, FaPhone } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

// Define the structure of a Profile based on your DB schema
interface ProfileData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
}

const Profile: React.FC = () => {
  // Allow the state to hold a ProfileData object or null
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: ""
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      if (res.data.profile) {
        setProfile(res.data.profile);
        // Pre-fill form data for editing mode
        setFormData(res.data.profile);

      }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status !== 404) {
            toast.error("Failed to fetch profile");
          }
        } else {
            toast.error("An unexpected error occurred");
        }
      console.error("No profile found or error fetching.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes to sync with state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // api instance automatically handles the Bearer token
      const response = await api.post("/api/user/profile", formData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile Updated successfully!");
        setProfile(response.data.profile);
        setIsEditing(false);
      }
    } catch (error: unknown) {
      let msg = "Failed to save profile";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

 if (loading) return null; // Keep background clear while loading

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Glass-morphism Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isEditing && profile && window.history.back()} 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <FaUserCircle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">User Profile</h2>
                <p className="text-blue-100 text-sm">Manage your personal information</p>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="hover:bg-white/20 p-2 rounded-full transition-colors hover:cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-8">
          {!profile || isEditing ? (
            /* --- FORM MODE --- */
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <FaCalendarAlt size={10} /> Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                  <FaPhone size={10} /> Phone Number
                </label>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl transition-all outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-300"
                >
                  {loading ? "Saving..." : profile ? "Update Profile" : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            /* --- VIEW MODE --- */
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Full Name</p>
                  <p className="text-xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 hover:cursor-pointer py-2 text-sm font-bold text-blue-600 hover:bg-white rounded-xl transition-all"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Birth Date</p>
                  <p className="text-gray-700 font-semibold">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-gray-700 font-semibold">{profile.phone_number}</p>
                </div>
              </div>

              <button
                onClick={() => window.history.back()}
                className=" hover:cursor-pointer w-full py-4 mt-4 font-bold text-gray-400 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all"
              >
                Close Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;