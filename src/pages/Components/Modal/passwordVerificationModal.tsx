import React, { useState } from 'react';
import './ConfirmationModal.css';
import api from '../../../api/axiosInstance'; // Adjust path
import axios from 'axios';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

interface PasswordVerificationModalProps {
  isOpen: boolean;
  onSuccess: () => void; // Called ONLY if password is correct
  onCancel: () => void;
  title?: string;
  message?: string;
}

const PasswordVerificationModal: React.FC<PasswordVerificationModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = "Verify Identity",
  message = "Please enter your password to confirm changes."
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    setIsVerifying(false);
    onCancel();
  };

  const handleVerify = async () => {
    if (!password.trim()) return;

    try {
      setIsVerifying(true);
      
      // Call the dedicated verification route
      const response = await api.post("/api/auth/verify-password", { password });

      if (response.status === 200) {
        setPassword(""); // Clear for security
        onSuccess();     // Proceed to original action (e.g., save profile)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid password.");
      } else {
        toast.error("An error occurred during verification.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
  className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#004d40]/30 backdrop-blur-md animate-in fade-in duration-300"
  onClick={handleClose}
>
  <div 
    className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden animate-in zoom-in-95 duration-200" 
    onClick={(e) => e.stopPropagation()}
  >
    {/* Top Decorative Security Bar */}
    <div className="absolute top-0 left-0 w-full h-2 bg-[#00796b]" />

    <div className="text-center sm:text-left space-y-2 mb-8">
      <nav className="text-[10px] font-black text-[#00796b] uppercase tracking-[0.3em] mb-2">
        Identity Verification
      </nav>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">
        {title || "Confirm Authorization"}
      </h3>
      <p className="text-sm text-slate-400 font-medium leading-relaxed">
        {message || "Please enter your administrative password to commit these changes to the registry."}
      </p>
    </div>
    
    <div className="mb-8 relative text-left group">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
        Access Credentials
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#00796b] focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          autoFocus
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#00796b] transition-colors"
        >
          {showPassword ? <HiOutlineEyeOff size={20}/> : <HiOutlineEye size={20}/>}
        </button>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button 
        className="flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all active:scale-95" 
        onClick={handleClose}
        disabled={isVerifying}
      >
        Discard
      </button>
      <button 
        className={`flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
          !password || isVerifying 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-[#00796b] hover:bg-[#004d40] shadow-teal-100'
        }`} 
        onClick={handleVerify}
        disabled={!password || isVerifying}
      >
        {isVerifying ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          "Authorize & Save"
        )}
      </button>
    </div>
 
  </div>
</div>
  );
};

export default PasswordVerificationModal;