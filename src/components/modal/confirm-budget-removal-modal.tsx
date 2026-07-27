import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { AlertTriangle, Info } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Rimuovi Budget" size="sm">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#080808] mb-3">Conferma Rimozione</h3>
          <p className="text-[#080808]/70 text-sm mb-6 leading-relaxed">
            Sei sicuro di voler rimuovere il budget per la categoria <strong className="text-[#080808] font-bold">"{categoryName}"</strong>?
          </p>
          
          <motion.div
            className="bg-[#f9f9f9] rounded-2xl p-5 border border-[#f0f0f0] mb-5 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[#080808]/60 text-sm font-medium">Budget attuale:</span>
              <span className="text-[#080808] font-bold text-xl">€{budgetAmount.toFixed(2)}</span>
            </div>
          </motion.div>

          <div className="flex items-start gap-3 bg-amber-50 rounded-2xl p-4 border border-amber-100 text-left">
            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              <strong>Attenzione:</strong> Questa azione non può essere annullata. 
              Potrai comunque impostare un nuovo budget in seguito se lo desideri.
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-2">
          <Button
            onClick={handleConfirm}
            className="w-full h-12 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            Conferma Rimozione
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5]"
          >
            Annulla
          </Button>
        </div>
      </div>
    </Modal>
  );
};