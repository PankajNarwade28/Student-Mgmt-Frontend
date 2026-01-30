import React, { useEffect, useState, useCallback } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineColorSwatch,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineSave,
  HiOutlinePhone,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";
import axios from "axios";
import ConfirmationModal from "../../Components/Modal/confirmationModal";

interface ProfileData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  email?: string;
}

interface SecurityData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "Profile" | "Security" | "Notifications" | "Appearance"
  >("Profile");
  const [loading, setLoading] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
  });
  // Visibility toggles
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const sections = [
    { id: "Profile", icon: <HiOutlineUserCircle />, label: "Personal Profile" },
    {
      id: "Security",
      icon: <HiOutlineShieldCheck />,
      label: "Security & Password",
    },
    {
      id: "Notifications",
      icon: <HiOutlineBell />,
      label: "Notification Settings",
    },
    {
      id: "Appearance",
      icon: <HiOutlineColorSwatch />,
      label: "Theme & Display",
    },
  ];

  // Fetch current profile data on mount
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/profile");
      if (res.data.profile) {
        // Format date for the input field (YYYY-MM-DD)
        const profile = res.data.profile;
        if (profile.date_of_birth) {
          profile.date_of_birth = new Date(profile.date_of_birth)
            .toISOString()
            .split("T")[0];
        }
        setFormData(profile);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch profile data:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/user/profile", formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!");
      }
    } catch (error: unknown) {
      console.error("Failed to save profile changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    try {
      setLoading(true);
      const response = await api.patch("/api/auth/change-password", {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword,
      });

      // Shows either "Password updated..." or "Account activated!" based on logic above
      toast.success(response.data.message);

      setSecurityData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update password.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerSaveConfirmation = () => {
    // Simple validation before showing modal
    if (activeSection === "Security") {
      if (securityData.oldPassword.length === 0) {
        return toast.error("Please enter your current password");
      }
      if (securityData.newPassword.length === 0) {
        return toast.error("Please enter your New password");
      }
      if (securityData.newPassword !== securityData.confirmPassword) {
        return toast.error("Passwords do not match");
      }
      if (securityData.newPassword.length < 6) {
        return toast.error("Password too short");
      }
      if (securityData.newPassword === securityData.oldPassword) {
        return toast.error(
          "New password cannot be the same as the old password",
        );
      }
    }
    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    setIsConfirmModalOpen(false);
    if (activeSection === "Profile") {
      await handleSave(); // Your existing API call
    } else if (activeSection === "Security") {
      await handlePasswordUpdate(); // Your existing API call
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">
          Manage your profile information and system preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() =>
                setActiveSection(
                  section.id as
                    | "Profile"
                    | "Security"
                    | "Notifications"
                    | "Appearance",
                )
              }
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

        <main className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            {activeSection === "Profile" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                  <div className="h-20 w-20 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {formData.first_name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      Profile details
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Update your personal identification information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="first_name"
                      className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      First Name
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="last_name"
                      className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <HiOutlineCalendar /> Date of Birth
                    </label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <HiOutlinePhone /> Phone Number
                    </label>
                    <input
                      name="phone_number"
                      type="text"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* --- SECURITY SECTION --- */}
            {activeSection === "Security" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-3 max-w-md">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">
                    Change Password
                  </h3>

                  {/* Old Password */}
                  <div className="relative">
                    <input
                      type={showOldPass ? "text" : "password"}
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                      value={securityData.oldPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showOldPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="New Password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showNewPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showConfirmPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* --- NOTIFICATIONS SECTION --- */}
            {activeSection === "Notifications" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Preferences</h3>
                  <p className="text-xs text-slate-500">
                    Choose how you want to receive system updates and alerts.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "email",
                      label: "Email Notifications",
                      desc: "Receive course updates and grade alerts via email.",
                    },
                    {
                      id: "sms",
                      label: "SMS Notifications",
                      desc: "Get critical security alerts sent to your phone.",
                    },
                    {
                      id: "push",
                      label: "Push Notifications",
                      desc: "Real-time alerts in your browser dashboard.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-700">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={item.id === "email"}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-2 text-sm text-slate-700">
                         {""}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- APPEARANCE SECTION --- */}
            {activeSection === "Appearance" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    Theme Selection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize the interface look and feel for your workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Mode Option */}
                  <div className="group relative p-4 border-2 border-indigo-600 rounded-3xl bg-white cursor-pointer transition-all">
                    <div className="aspect-video w-full bg-slate-50 rounded-xl mb-3 border border-slate-100 overflow-hidden flex flex-col p-2 gap-1">
                      <div className="h-2 w-1/2 bg-slate-200 rounded" />
                      <div className="h-2 w-full bg-slate-100 rounded" />
                      <div className="mt-auto h-4 w-full bg-indigo-500 rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-slate-900">
                        Light Theme
                      </span>
                      <HiOutlineCheckCircle
                        className="text-indigo-600"
                        size={18}
                      />
                    </div>
                  </div>
                  {/* Dark Mode Option (Coming Soon) */}
                  <div className="group relative p-4 border-2 border-slate-100 rounded-3xl bg-slate-50 cursor-not-allowed opacity-60">
                    <div className="aspect-video w-full bg-slate-800 rounded-xl mb-3 border border-slate-700 overflow-hidden flex flex-col p-2 gap-1">
                      <div className="h-2 w-1/2 bg-slate-700 rounded" />
                      <div className="h-2 w-full bg-slate-600 rounded" />
                      <div className="mt-auto h-4 w-full bg-slate-700 rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-slate-400">
                        Dark Theme
                      </span>
                      <span className="text-[8px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        COMING SOON
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Other sections remain (Security, Appearance) as UI placeholders or add logic later */}

            <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button
                onClick={triggerSaveConfirmation}
                disabled={loading}
                className={`
    relative group flex items-center justify-center gap-2 
    px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide
    transition-all duration-300 active:scale-95
    ${
      loading
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 hover:brightness-110"
    }
  `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-slate-400"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineSave
                      size={20}
                      className="transition-transform group-hover:rotate-12"
                    />
                    <span>Save Changes</span>
                  </>
                )}

                {/* Subtle glow effect on hover */}
                {!loading && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>
          {isConfirmModalOpen && (
            <ConfirmationModal
              isOpen={isConfirmModalOpen}
              title="Confirm Changes"
              message={`Are you sure you want to update your ${activeSection.toLowerCase()} settings?`}
              type="warning"
              confirmText="Yes, Update"
              onConfirm={handleFinalConfirm}
              onCancel={() => setIsConfirmModalOpen(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
