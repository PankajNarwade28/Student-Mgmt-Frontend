export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string; 
  cancelText?: string; 
  type?: "danger" | "warning" | "info" | "success"; // Add "success" here
}
 