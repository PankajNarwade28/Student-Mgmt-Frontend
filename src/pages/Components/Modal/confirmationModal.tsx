import React from 'react';
import './ConfirmationModal.css';
import type { ConfirmationModalProps } from '../../../models/confirmStatus';

// ConfirmationModal.tsx
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary'
}) => {
  if (!isOpen) return null;

  // Logic to determine color based on the 'type' prop
  const colorClass = type === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white' 
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      {/* stopPropagation prevents the modal from closing when clicking inside content */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="modal-actions flex justify-end space-x-3">
          <button className="btn-cancel px-4 py-2 rounded" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={`px-4 py-2 rounded transition ${colorClass}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;