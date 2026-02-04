import React, { useEffect, useState, useCallback } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineColorSwatch,
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
    email: "",
  });

  // Visibility toggles
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "saveSettings" | "forgotPassword" | null
  >(null);

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

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/user/profile");
      if (res.data.profile) {
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
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to save profile changes.",
        );
      } else toast.error("Failed to save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try { 
      const response = await api.patch("/api/auth/change-password", {
        oldPassword: securityData.oldPassword,
        newPassword: securityData.newPassword,
      });
      toast.success(response.data.message);
      setSecurityData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerSaveConfirmation = () => {
    if (activeSection === "Security") {
      if (securityData.oldPassword.length === 0)
        return toast.error("Enter current password");
      if (securityData.newPassword.length < 6)
        return toast.error("Password too short");
      if (securityData.newPassword !== securityData.confirmPassword)
        return toast.error("Passwords do not match");
    }
    setPendingAction("saveSettings");
    setIsConfirmModalOpen(true);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      return toast.error("Please Complete Profile for Password Reset.");
    }
    setPendingAction("forgotPassword");
    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    setIsConfirmModalOpen(false);

    // 1. Handle regular Save Settings (Profile or Security form)
    if (pendingAction === "saveSettings") {
      if (activeSection === "Profile") await handleSave();
      else if (activeSection === "Security") await handlePasswordUpdate();
    }
    // 2. Handle Forgot Password Request
    else if (pendingAction === "forgotPassword") {
      try {
        setLoading(true);
        const response = await api.post("/api/email/forgot-password", {
          email: formData.email,
        });
        if (response.status === 200) toast.success("Reset link sent!");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }
    setPendingAction(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Global Full-Screen Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/30 backdrop-blur-md transition-all duration-300">
          <div className="relative flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>

            {/* Inner Pulsing Circle */}
            <div className="absolute h-8 w-8 rounded-full bg-indigo-600/20 animate-pulse"></div>
          </div>
          <p className="mt-4 text-sm font-bold text-slate-700 tracking-widest uppercase animate-pulse">
            Waiting for Response...
          </p>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">
          Manage your profile information and preferences
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
                  <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {formData.first_name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      Profile details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update your personal identification information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                      <HiOutlineCalendar /> DOB
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
                      <HiOutlinePhone /> Phone
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

            {activeSection === "Security" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-3 max-w-md">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">
                    Change Password
                  </h3>
                  <div className="relative">
                    <input
                      type={showOldPass ? "text" : "password"}
                      placeholder="Current Password"
                      value={securityData.oldPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                    <button
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showOldPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      placeholder="New Password"
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
                    />
                    <button
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPass ? (
                        <HiOutlineEyeOff size={18} />
                      ) : (
                        <HiOutlineEye size={18} />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Forgot your current password?
                  </button>
                </div>
              </div>
            )}

            {/* Notification and Appearance UI... */}

            <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button
                onClick={triggerSaveConfirmation}
                disabled={loading}
                className={`relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all ${loading ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white shadow-lg hover:brightness-110 active:scale-95"}`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <HiOutlineSave size={20} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {isConfirmModalOpen && (
            <ConfirmationModal
              isOpen={isConfirmModalOpen}
              title={
                pendingAction === "forgotPassword"
                  ? "Send Reset Email"
                  : "Confirm Changes"
              }
              message={
                pendingAction === "forgotPassword"
                  ? "Are you sure you want to send a password reset link?"
                  : `Confirm update to ${activeSection}?`
              }
              type="warning"
              confirmText={
                pendingAction === "forgotPassword" ? "Send Link" : "Yes, Update"
              }
              onConfirm={handleFinalConfirm}
              onCancel={() => {
                setIsConfirmModalOpen(false);
                setPendingAction(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
