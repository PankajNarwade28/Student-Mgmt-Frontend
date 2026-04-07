import React from 'react';
import { HiOutlineExclamationCircle, HiOutlineShieldCheck } from 'react-icons/hi';
import type { ConfirmationModalProps } from '../../../models/confirmStatus';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Authorize',
  cancelText = 'Discard',
  type = 'primary'
}) => {
  if (!isOpen) return null;

  // Logic to determine color and icon based on the 'type' prop
  const isDanger = type === 'danger';
  
  const colorClass = isDanger 
    ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
    : 'bg-[#00796b] hover:bg-[#004d40] shadow-teal-100';

  const iconBaseClass = isDanger 
    ? 'bg-red-50 text-red-600' 
    : 'bg-teal-50 text-[#00796b]';

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#004d40]/30 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onCancel}
    >
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Accent */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isDanger ? 'bg-red-600' : 'bg-[#00796b]'}`} />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Operational Icon */}
          <div className={`w-15 h-10 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner ${iconBaseClass}`}>
            {isDanger ? <HiOutlineExclamationCircle /> : <HiOutlineShieldCheck />}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed italic px-2">
              "{message}"
            </p>
          </div>

          {/* Action Registry */}
          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button 
              className="flex-1 order-2 sm:order-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all active:scale-95" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className={`flex-1 order-1 sm:order-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 ${colorClass}`} 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ConfirmationModal;