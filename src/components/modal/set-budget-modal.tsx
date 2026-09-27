import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
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
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceDataContext } from '@/contexts/FinanceDataContext';

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
  const [showApplyAll, setShowApplyAll] = useState(false);

  const financeContext = useFinanceDataContext();
  const expensesByCategory = financeContext?.getExpensesByCategory ? financeContext.getExpensesByCategory() : {};

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
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { value: 'home', label: 'Casa', icon: Home, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' }
  ];

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleQuickSet = (category: string, amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
  };

  const handleQuickAdd = (category: string, addAmount: number) => {
    const current = budgets[category] || 0;
    setBudgets(prev => ({
      ...prev,
      [category]: current + addAmount
    }));
  };

  const handleSetAllBudgets = () => {
    const value = parseFloat(allBudgetValue) || 0;
    const newBudgets: BudgetData = {};
    categories.forEach(cat => {
      newBudgets[cat.value] = value;
    });
    setBudgets(newBudgets);
    setShowApplyAll(false);
  };

  const presetAmounts = [100, 250, 500, 1000];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Imposta Budget" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between bg-[#f5f5f7] p-3.5 sm:p-4 rounded-2xl border border-[#e5e5ea]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white shadow-sm">
              <Sparkles className="h-4 w-4 text-[#080808]" />
            </div>
            <div>
              <p className="text-[#080808] font-bold text-xs sm:text-sm">Suggerimento rapido</p>
              <p className="text-[#080808]/60 text-[11px] sm:text-xs">
                Tocca i chip per impostare il budget in un attimo senza scrivere
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowApplyAll(!showApplyAll)}
            className="text-xs font-semibold text-[#080808] hover:underline flex items-center space-x-1 whitespace-nowrap bg-white px-2.5 py-1.5 rounded-lg border border-[#e5e5ea] shadow-xs"
          >
            <span>Tutti</span>
            {showApplyAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {showApplyAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-[#f9f9f9] p-3.5 rounded-2xl border border-[#e5e5ea]">
                <div className="relative flex-1 w-full">
                  <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#080808]/40" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={allBudgetValue}
                    onChange={e => setAllBudgetValue(e.target.value)}
                    placeholder="Imposta uguale per tutte le categorie"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 shadow-sm text-base sm:text-sm"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSetAllBudgets}
                  className="w-full sm:w-auto px-5 h-11 rounded-xl bg-[#080808] text-white font-semibold shadow-sm text-xs sm:text-sm whitespace-nowrap"
                >
                  Applica a tutti
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3 scrollbar-hide">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = (budgets[category.value] || 0) > 0;
            const spentThisMonth = expensesByCategory[category.value] || 0;

            return (
              <motion.div
                key={category.value}
                className={`bg-white rounded-2xl p-4 border transition-all duration-300 ${
                  isActive 
                    ? 'border-[#080808]/20 shadow-md ring-1 ring-[#080808]/5' 
                    : 'border-[#f0f0f0] shadow-sm hover:border-[#e5e5ea]'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${isActive ? category.bg : 'bg-[#f5f5f7]'}`}>
                      <Icon className={`h-5 w-5 ${isActive ? category.color : 'text-[#080808]/40'}`} />
                    </div>
                    <div>
                      <Label className="text-[#080808] font-bold text-sm sm:text-base block">
                        {category.label}
                      </Label>
                      <span className="text-[11px] font-semibold text-[#080808]/50">
                        Spesi ora: <span className="text-[#080808]/80 font-bold">€{spentThisMonth.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full sm:w-44">
                    <DollarSign className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isActive ? 'text-[#080808]' : 'text-[#080808]/40'}`} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={budgets[category.value] || ''}
                      onChange={(e) => handleBudgetChange(category.value, e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-9 pr-3 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] placeholder:text-[#080808]/40 rounded-xl font-bold text-base sm:text-sm focus:outline-none focus:border-[#080808]/20 focus:ring-2 focus:ring-[#080808]/5 transition-all shadow-inner-sm text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f7] gap-1.5 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-1.5">
                    {presetAmounts.map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickSet(category.value, amount)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          budgets[category.value] === amount
                            ? 'bg-[#080808] text-white shadow-sm scale-105'
                            : 'bg-[#f5f5f7] text-[#080808]/70 hover:bg-[#ebebe8] hover:text-[#080808]'
                        }`}
                      >
                        {amount}€
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(category.value, 50)}
                      className="px-2.5 py-1 rounded-full bg-[#f0f9f4] text-emerald-700 border border-emerald-200/60 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-0.5 whitespace-nowrap"
                    >
                      <Plus className="h-3 w-3" />
                      50€
                    </button>
                    {(budgets[category.value] || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => handleQuickSet(category.value, 0)}
                        className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold hover:bg-rose-100 transition-all whitespace-nowrap"
                      >
                        Azzera
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-[#f0f0f0]">
          <div className="flex gap-2.5 flex-1">
            <Button
              type="button"
              onClick={handleClearAll}
              variant="ghost"
              className="flex-1 h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5] text-xs sm:text-sm font-semibold"
            >
              <Eraser className="mr-1.5 h-4 w-4" />
              Azzera Tutto
            </Button>
            {onRemoveAll && Object.keys(currentBudgets).length > 0 && (
              <Button
                type="button"
                onClick={() => setShowRemoveConfirm(true)}
                variant="ghost"
                className="flex-1 h-11 rounded-full text-red-500 border border-red-100 hover:bg-red-50 text-xs sm:text-sm font-semibold"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Elimina Budget
              </Button>
            )}
          </div>

          <div className="flex gap-2.5 flex-1">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="flex-1 sm:flex-none sm:w-28 h-11 rounded-full text-[#080808] border border-[#e5e5e5] hover:bg-[#f5f5f5] text-xs sm:text-sm font-semibold"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 rounded-full bg-[#080808] text-white font-bold hover:bg-[#080808]/80 hover:scale-[1.02] active:scale-95 transition-all shadow-md text-xs sm:text-sm"
            >
              <Save className="mr-1.5 h-4 w-4" />
              Salva
            </Button>
          </div>
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