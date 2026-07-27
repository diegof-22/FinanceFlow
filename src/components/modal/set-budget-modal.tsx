import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
  Heart,
  Target,
  DollarSign,
  Trash2,
  Eraser,
  X,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export interface BudgetData {
  [key: string]: number;
}

export interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budgetData: BudgetData) => void;
  onRemoveAll?: () => void;
  currentBudgets: BudgetData;
}

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onRemoveAll,
  currentBudgets
}) => {
  const [budgets, setBudgets] = useState<BudgetData>(currentBudgets);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [allBudgetValue, setAllBudgetValue] = useState<string>("");

  useEffect(() => {
    setBudgets(currentBudgets);
  }, [currentBudgets, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(budgets);
    onClose();
  };

  const handleRemoveAll = () => {
    if (onRemoveAll) {
      onRemoveAll();
      setShowRemoveConfirm(false);
      onClose();
    }
  };

  const handleClearAll = () => {
    setBudgets({});
  };

  const categories = [
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'home', label: 'Casa', icon: Home, color: 'text-rose-500', bg: 'bg-rose-50' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' }
  ];

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleSetAllBudgets = () => {
    const value = parseFloat(allBudgetValue) || 0;
    const newBudgets: BudgetData = {};
    categories.forEach(cat => {
      newBudgets[cat.value] = value;
    });
    setBudgets(newBudgets);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Imposta Budget" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#f9f9f9] p-4 rounded-[24px] border border-[#f0f0f0]">
          <div className="relative flex-1 w-full">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#080808]/40" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={allBudgetValue}
              onChange={e => setAllBudgetValue(e.target.value)}
              placeholder="Imposta per tutte le categorie"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 shadow-sm transition-all"
            />
          </div>
          <Button
            type="button"
            onClick={handleSetAllBudgets}
            className="w-full sm:w-auto px-6 h-11 rounded-xl bg-white border border-[#e5e5e5] text-[#080808] font-semibold hover:bg-[#f5f5f5] shadow-sm transition-all whitespace-nowrap"
          >
            Applica a tutti
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = budgets[category.value] > 0;
            return (
              <motion.div
                key={category.value}
                className={`bg-white rounded-[20px] p-4 border transition-all duration-300 ${isActive ? 'border-[#080808]/20 shadow-md ring-1 ring-[#080808]/5' : 'border-[#f0f0f0] shadow-sm hover:border-[#080808]/10'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${isActive ? category.bg : 'bg-[#f5f5f5]'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? category.color : 'text-[#080808]/40'}`} />
                  </div>
                  <div>
                    <Label className="text-[#080808] font-bold text-sm">
                      {category.label}
                    </Label>
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isActive ? 'text-[#080808]' : 'text-[#080808]/40'}`} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgets[category.value] || ''}
                    onChange={(e) => handleBudgetChange(category.value, e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl font-medium focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 transition-all shadow-inner-sm"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#f0f0f0]">
          <Button
            type="button"
            onClick={handleClearAll}
            variant="ghost"
            className="flex-1 h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5]"
          >
            <Eraser className="mr-2 h-4 w-4" />
            Azzera Valori
          </Button>
          {onRemoveAll && Object.keys(currentBudgets).length > 0 && (
            <Button
              type="button"
              onClick={() => setShowRemoveConfirm(true)}
              variant="ghost"
              className="flex-1 h-11 rounded-full text-red-500 border border-red-100 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Elimina Budget
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            className="flex-1 h-12 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5]"
          >
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 rounded-full bg-[#080808] text-white font-bold hover:bg-[#080808]/80 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
          >
            <Save className="mr-2 h-4 w-4" />
            Salva Budget
          </Button>
        </div>

        <AnimatePresence>
          {showRemoveConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={() => setShowRemoveConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-[#f0f0f0] rounded-[32px] p-6 sm:p-8 w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-red-50 border border-red-100">
                      <Target className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#080808] mb-3">Rimuovi Tutti i Budget</h3>
                  <p className="text-[#080808]/60 text-sm mb-8 leading-relaxed">
                    Sei sicuro di voler eliminare tutti i budget impostati? Questa azione non può essere annullata.
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Button
                      type="button"
                      onClick={handleRemoveAll}
                      className="w-full h-12 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                    >
                      Conferma Eliminazione
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowRemoveConfirm(false)}
                      variant="ghost"
                      className="w-full h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5]"
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Modal>
  );
};