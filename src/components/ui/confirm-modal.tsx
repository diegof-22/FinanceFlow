import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  type = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      default:
        return {
          iconColor: 'text-blue-400',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={`p-3 rounded-full bg-white/10 border border-white/20`}>
            <AlertTriangle className={`h-8 w-8 ${styles.iconColor}`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-white/70">{message}</p>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={type === 'danger' ? 'danger' : type === 'warning' ? 'primary' : 'primary'}
            size="md"
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};