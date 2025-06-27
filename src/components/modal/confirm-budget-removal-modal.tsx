import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion } from "framer-motion";

interface ConfirmBudgetRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  budgetAmount: number;
}

export const ConfirmBudgetRemovalModal: React.FC<ConfirmBudgetRemovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  budgetAmount
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚠️ Rimuovi Budget" size="sm">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Conferma Rimozione</h3>
          <p className="text-white/70 text-sm mb-4">
            Sei sicuro di voler rimuovere il budget per la categoria <strong className="text-white">"{categoryName}"</strong>?
          </p>
          
          <motion.div
            className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-lg p-4 border border-red-400/20 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Budget attuale:</span>
              <span className="text-red-400 font-bold text-lg">€{budgetAmount.toFixed(2)}</span>
            </div>
          </motion.div>

          <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-400/20">
            <p className="text-yellow-300 text-xs">
              <strong>Attenzione:</strong> Questa azione non può essere annullata. 
              Potrai sempre impostare un nuovo budget in seguito.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            Annulla
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            Rimuovi Budget
          </Button>
        </div>
      </div>
    </Modal>
  );
};