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
  DollarSign
} from 'lucide-react';
import { motion } from "framer-motion";

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
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-blue-400' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'text-green-400' },
    { value: 'home', label: 'Casa', icon: Home, color: 'text-red-400' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'text-yellow-400' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'text-purple-400' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'text-pink-400' }
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

  const totalBudget = Object.values(budgets).length > 0 
    ? Object.values(budgets).reduce((sum, budget) => sum + budget, 0)
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Imposta Budget" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={allBudgetValue}
            onChange={e => setAllBudgetValue(e.target.value)}
            placeholder="Imposta budget per tutte le categorie"
            className="md:w-64 bg-white/10 border-white/20 text-white placeholder-white/40 h-10 focus:border-white/40 focus:ring-1 focus:ring-white/20"
          />
          <Button
            type="button"
            onClick={handleSetAllBudgets}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/20"
          >
            Imposta per Tutti
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = budgets[category.value] > 0;
            return (
              <motion.div
                key={category.value}
                className={`bg-white/5 rounded-lg p-4 border transition-all duration-200 ${isActive ? 'border-blue-400/40 shadow-lg' : 'border-white/10 hover:border-white/20'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-400/20' : 'bg-white/10'}`}> 
                    <Icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div>
                    <Label className="text-white font-medium text-sm">
                      {category.label}
                    </Label>
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgets[category.value] || ''}
                    onChange={(e) => handleBudgetChange(category.value, e.target.value)}
                    placeholder="0.00"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/40 h-10 focus:border-white/40 focus:ring-1 focus:ring-white/20"
                  />
                </div>
                {budgets[category.value] > 0 && (
                  <motion.div
                    className="mt-2 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-white/60 text-xs">Budget: €{budgets[category.value].toFixed(2)}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <Button
            type="button"
            onClick={handleClearAll}
            className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-400/20"
          >
             Pulisci Tutti
          </Button>
          {onRemoveAll && Object.keys(currentBudgets).length > 0 && (
            <Button
              type="button"
              onClick={() => setShowRemoveConfirm(true)}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/20"
            >
               Rimuovi Tutti
            </Button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Salva Budget
          </Button>
        </div>

        
        {showRemoveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRemoveConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-red-400/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30">
                    <Target className="h-8 w-8 text-red-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rimuovi Tutti i Budget</h3>
                <p className="text-white/70 text-sm mb-6">
                  Sei sicuro di voler rimuovere tutti i budget? Questa azione non può essere annullata.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowRemoveConfirm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Annulla
                  </Button>
                  <Button
                    onClick={handleRemoveAll}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    Rimuovi Tutti
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </form>
    </Modal>
  );
};