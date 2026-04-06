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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        
        <div className="mb-6 relative text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Your Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500/10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            autoFocus
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {showPassword ? <HiOutlineEyeOff size={18}/> : <HiOutlineEye size={18}/>}
          </button>
        </div>

        <div className="modal-actions flex justify-end space-x-3">
          <button 
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition" 
            onClick={handleClose}
            disabled={isVerifying}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all text-white ${
              !password || isVerifying ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:brightness-110 shadow-lg shadow-indigo-100'
            }`} 
            onClick={handleVerify}
            disabled={!password || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordVerificationModal;