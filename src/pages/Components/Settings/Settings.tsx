import React, { useEffect, useState, useCallback } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineColorSwatch,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineSave,
  HiOutlineCheck,
  HiOutlinePhone,
  HiOutlineCalendar,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";
import axios from "axios";
import ConfirmationModal from "../../Components/Modal/confirmationModal";
import {
  profileSchema,
  securitySchema,
} from "../../../validations/settingSchema"; // Adjust path as needed
import PasswordVerificationModal from "../Modal/passwordVerificationModal";

interface ProfileData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  email?: string;
}

interface SecurityData {
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "Profile" | "Security" | "Notifications" | "Appearance"
  >("Profile");
  const [loading, setLoading] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityData>({
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
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

  const handlePasswordUpdate = async () => {
    // to match your original flow, but you can also re-validate here if needed.
    try {
      const response = await api.patch("/api/auth/change-password", {
        newPassword: securityData.newPassword,
      });
      toast.success(response.data.message);
      setSecurityData({
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

  const handleForgotPassword = () => {
    if (!formData.email) {
      return toast.error("Please Complete Profile for Password Reset.");
    }
    setPendingAction("forgotPassword");
    setIsConfirmModalOpen(true);
  };

  const handleSave = async (confirmPassword?: string) => {
    try {
      setLoading(true);
      // Send both profile data and the password for verification
      const response = await api.post("/api/user/profile", {
        ...formData,
        confirmPassword,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!");
        fetchProfile(); // Refresh profile data after update
        // reload page to reflect changes in Navbar and other components relying on profile data
        setTimeout(() => {
          globalThis.location.reload();
        }, 1000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to save profile.");
      } else {
        toast.error("Failed to save profile changes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerSaveConfirmation = () => {
    // Existing Profile logic...
    if (activeSection === "Profile") {
      const validation = profileSchema.safeParse(formData);
      if (!validation.success) {
        return toast.error(validation.error.issues[0].message);
      }
      setPendingAction("saveSettings");
      setIsPasswordModalOpen(true);
    }

    // New Security logic using the same modal
    if (activeSection === "Security") {
      const validation = securitySchema.safeParse(securityData);
      if (!validation.success) {
        return toast.error(validation.error.issues[0].message);
      }
      // We use the modal to "Verify & Finalize"
      setPendingAction("saveSettings");
      setIsPasswordModalOpen(true);
    }
  };
  const handlePasswordVerifiedSuccess = async () => {
    setIsPasswordModalOpen(false);

    if (pendingAction === "saveSettings") {
      if (activeSection === "Profile") {
        await handleSave();
      } else if (activeSection === "Security") {
        // The modal already verified the password,
        // so we can now safely call the update API.
        await handlePasswordUpdate();
      }
    }
  };

  const handleFinalConfirm = async () => {
    setIsConfirmModalOpen(false);

    if (pendingAction === "saveSettings" && activeSection === "Security") {
      await handlePasswordUpdate();
    } else if (pendingAction === "forgotPassword") {
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
    <div className="p-4 md:p-6   mx-auto  ">
      {/* Global System Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#004d40]/20 backdrop-blur-md transition-all duration-300">
          <div className="relative flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="h-16 w-16 rounded-full border-4 border-teal-100 border-t-[#00796b] animate-spin"></div>
            {/* Inner Pulsing Circle */}
            <div className="absolute h-8 w-8 rounded-full bg-[#00796b]/30 animate-pulse"></div>
          </div>
          <p className="mt-4 text-[10px] font-black text-[#004d40] tracking-[0.3em] uppercase animate-pulse">
            Synchronizing Registry...
          </p>
        </div>
      )}
      <div className="mb-10">
        <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.2em] mb-2">
          Identity Management
        </nav>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          System Settings
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Configure your authorized identity and operational preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() =>
                setActiveSection(section.id as unknown as typeof activeSection)
              }
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group ${
                activeSection === section.id
                  ? "bg-[#00796b] text-white shadow-xl shadow-teal-100"
                  : "text-slate-400 hover:bg-teal-50 hover:text-[#00796b]"
              }`}
            >
              <span
                className={`text-xl transition-transform group-hover:scale-110 ${activeSection === section.id ? "text-teal-300" : "text-slate-300"}`}
              >
                {section.icon}
              </span>
              {section.label}
            </button>
          ))}
        </aside>

        {/* Main Configuration Surface */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-teal-900/5 overflow-hidden">
          <div className="p-8 md:p-10 space-y-8">
            {/* PROFILE SECTION */}
            {activeSection === "Profile" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                  <div className="h-24 w-24 rounded-[2rem] bg-teal-50 border-2 border-teal-100 flex items-center justify-center text-4xl font-black text-[#00796b] shadow-inner">
                    {formData.first_name?.[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">
                      Identity Details
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                      Personal identification registered within the central hub.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                      Legal First Name
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                      Legal Last Name
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-1">
                      <HiOutlineCalendar className="text-[#00796b]" />{" "}
                      Chronological DOB
                    </label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-1">
                      <HiOutlinePhone className="text-[#00796b]" /> Verified
                      Contact
                    </label>
                    <input
                      name="phone_number"
                      type="text"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeSection === "Security" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="max-w-md space-y-6">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg tracking-tight mb-2">
                      Access Credentials
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                      Update your encrypted system password.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: "newPassword",
                        placeholder: "Enter New Password",
                        show: showNewPass,
                        toggle: setShowNewPass,
                      },
                      {
                        name: "confirmPassword",
                        placeholder: "Confirm New Password",
                        show: showConfirmPass,
                        toggle: setShowConfirmPass,
                      },
                    ].map((field) => (
                      <div key={field.name} className="relative group">
                        <input
                          type={field.show ? "text" : "password"}
                          placeholder={field.placeholder}
                          value={
                            field.name === "newPassword"
                              ? securityData.newPassword
                              : securityData.confirmPassword
                          }
                          onChange={(e) =>
                            setSecurityData({
                              ...securityData,
                              [field.name]: e.target.value,
                            })
                          }
                          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700"
                        />
                        <button
                          onClick={() => field.toggle(!field.show)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#00796b] transition-colors"
                        >
                          {field.show ? (
                            <HiOutlineEyeOff size={20} />
                          ) : (
                            <HiOutlineEye size={20} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black uppercase tracking-widest text-[#00796b] hover:text-[#004d40] transition-colors"
                  >
                    Request Automated Password Recovery?
                  </button>
                </div>
              </div>
            )}
            {/* Notification and Appearance UI... */}
            {activeSection === "Notifications" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight mb-2">
                    Communication Preferences
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Manage how the system broadcasts operational updates to you.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "email_alerts",
                      label: "Email Notifications",
                      desc: "Receive daily audit summaries and payment receipts.",
                    },
                    {
                      id: "push_notif",
                      label: "Push Authorizations",
                      desc: "Real-time alerts for enrollment requests and system logs.",
                    },
                    {
                      id: "sms_alerts",
                      label: "SMS Security Alerts",
                      desc: "Critical alerts regarding unauthorized access attempts.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-teal-100 hover:bg-white transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wide group-hover:text-[#00796b] transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium mt-1">
                          {item.desc}
                        </span>
                      </div>

                      {/* Custom Teal Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={item.id !== "sms_alerts"}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00796b]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSection === "Appearance" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight mb-2">
                    Interface Configuration
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Customize the visual density and mode of your operational
                    dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: "light",
                      label: "Light Mode",
                      icon: "☀️",
                      colors: "bg-white border-slate-200",
                    },
                    {
                      id: "dark",
                      label: "Dark Mode",
                      icon: "🌙",
                      colors: "bg-slate-900 border-slate-800",
                    },
                    {
                      id: "system",
                      label: "System",
                      icon: "💻",
                      colors:
                        "bg-gradient-to-br from-white to-slate-900 border-slate-200",
                    },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`relative p-1 rounded-[1.5rem] border-2 transition-all active:scale-95 ${
                        // Replace 'light' with your actual theme state variable
                        "light" === theme.id
                          ? "border-[#00796b] shadow-lg shadow-teal-100"
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      <div
                        className={`h-24 rounded-[1.25rem] ${theme.colors} flex flex-col items-center justify-center gap-2 border`}
                      >
                        <span className="text-2xl">{theme.icon}</span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.id === "dark" ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {theme.label}
                        </span>
                      </div>

                      {"light" === theme.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00796b] text-white rounded-full flex items-center justify-center shadow-md">
                          <HiOutlineCheck size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Density Selection Sample */}
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    UI Density Settings
                  </p>
                  <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit">
                    {["Compact", "Default", "Comfortable"].map((mode) => (
                      <button
                        key={mode}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          mode === "Compact"
                            ? "bg-white text-[#00796b] shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* PERSISTENT SAVE ACTION */}
            <div className="pt-10 border-t border-slate-50 flex justify-end">
              <button
                onClick={triggerSaveConfirmation}
                disabled={loading}
                className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl ${
                  loading
                    ? "bg-slate-100 text-slate-400"
                    : "bg-[#00796b] hover:bg-[#004d40] text-white shadow-teal-100 active:scale-95"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <HiOutlineSave size={20} className="text-teal-300" /> Commit
                    Updates
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Basic confirmation for Forgot Password and Security changes */}
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            title={
              pendingAction === "forgotPassword"
                ? "Send Reset Email"
                : "Confirm Changes"
            }
            message={
              pendingAction === "forgotPassword"
                ? "Are you sure you want to send a reset link?"
                : "Update security settings?"
            }
            type="warning"
            onConfirm={handleFinalConfirm}
            onCancel={() => {
              setIsConfirmModalOpen(false);
              setPendingAction(null);
            }}
          />

          {/* Password input for Profile updates */}
          <PasswordVerificationModal
            isOpen={isPasswordModalOpen}
            onSuccess={handlePasswordVerifiedSuccess}
            onCancel={() => setIsPasswordModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
};

export default Settings;
