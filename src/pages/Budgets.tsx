import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import { BudgetCategoryCard } from "@/components/ui/budget-category-card";
import { AddBudgetCard } from "@/components/ui/add-budget-card";
import { ConfirmBudgetRemovalModal } from "@/components/modal/confirm-budget-removal-modal";
import { SetBudgetModal } from "@/components/modal/set-budget-modal";
import { LoadingScreen } from '../components/ui/loadingscreen';
import { Button } from "@/components/ui/button";

import {
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
  Heart,
  Target,
  CheckCircle,
  Settings,
} from "lucide-react";
import { BudgetTips } from "@/components/ui/budget-tips";
import { BudgetsSkeleton } from '@/components/ui/skeleton';

export default function Budgets() {
  const {
    isOffline,
    reloadOfflineData,
    isLoading,
    transactions,
    budgets: budgetArray,
    setBudgetForCategory,
    removeBudget,
    getExpensesByCategory,
    getMonthlyExpenses,
  } = useFinanceDataContext();

  // La gestione offline è già centralizzata in FinanceDataContext

  const budgets = Array.isArray(budgetArray) && budgetArray.length > 0 
    ? budgetArray.reduce((acc, budget) => {
        acc[budget.category] = budget.limit;
        return acc;
      }, {} as { [category: string]: number })
    : {};

 

  const [confirmRemovalModal, setConfirmRemovalModal] = useState<{
    isOpen: boolean;
    category: string;
    categoryName: string;
    budgetAmount: number;
  }>({
    isOpen: false,
    category: '',
    categoryName: '',
    budgetAmount: 0
  });

  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);

  const handleSetBudget = async (category: string, amount: number) => {
    try {
      await setBudgetForCategory(category, amount);
      console.log(`Budget for ${category} set to €${amount}`);
    } catch (error) {
      console.error(`Error setting budget for ${category}:`, error);
    }
  };

  const handleSetAllBudgets = async (budgetData: { [key: string]: number }) => {
    try {
      
      for (const [category, amount] of Object.entries(budgetData)) {
        if (amount > 0) {
          await setBudgetForCategory(category, amount);
        }
      }
      console.log('All budgets updated successfully');
    } catch (error) {
      console.error('Error setting budgets:', error);
    }
  };

  const handleRemoveAllBudgets = async () => {
    try {
     
      for (const category of Object.keys(budgets)) {
        await removeBudget(category);
      }
      console.log('All budgets removed successfully');
    } catch (error) {
      console.error('Error removing all budgets:', error);
    }
  };

  const handleRemoveBudget = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    const budgetAmount = budgets[category] || 0;
    
    setConfirmRemovalModal({
      isOpen: true,
      category,
      categoryName: categoryData?.label || category,
      budgetAmount
    });
  };

  const confirmRemoveBudget = async () => {
    try {
      await removeBudget(confirmRemovalModal.category);
    } catch (error) {
      console.error(`Error removing budget for ${confirmRemovalModal.category}:`, error);
    }
    setConfirmRemovalModal({
      isOpen: false,
      category: '',
      categoryName: '',
      budgetAmount: 0
    });
  };

  const expensesByCategory = getExpensesByCategory();
  const totalBudget = Object.values(budgets).length > 0 
    ? Object.values(budgets).reduce((sum, budget) => Number(sum) + Number(budget), 0)
    : 0;
  const totalSpent = getMonthlyExpenses();
  const remainingBudget = Number(totalBudget) - totalSpent;

  const categories = [
    { value: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'blue' },
    { value: 'transport', label: 'Trasporti', icon: Car, color: 'green' },
    { value: 'home', label: 'Casa', icon: Home, color: 'red' },
    { value: 'food', label: 'Cibo & Bevande', icon: Coffee, color: 'yellow' },
    { value: 'entertainment', label: 'Intrattenimento', icon: Gamepad2, color: 'purple' },
    { value: 'health', label: 'Salute', icon: Heart, color: 'pink' }
  ];

  const budgetStats = categories.map(category => {
    const spent = expensesByCategory[category.value] || 0;
    const budget = budgets[category.value] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const isOverBudget = spent > budget && budget > 0;
    
    return {
      ...category,
      spent,
      budget,
      percentage,
      isOverBudget,
      remaining: Math.max(budget - spent, 0)
    };
  });

  if (isLoading) {
    return <BudgetsSkeleton />;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Gestione Budget
              </h1>
              <p className="text-white/70 text-lg">
                Imposta e monitora i tuoi budget mensili per ogni categoria
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                onClick={() => setIsSetBudgetModalOpen(true)}
                className="bg-white/10 border border-blue-400 text-blue-400 px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center space-x-2 shadow-sm hover:bg-white/20 hover:border-blue-500 w-full sm:w-auto text-sm sm:text-base hidden sm:flex"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Gestisci Tutti i Budget</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {categories
              .filter(category => {
                const hasBudget = budgets[category.value] > 0;
                return hasBudget;
              })
              .map((category, index) => {
                const spent = expensesByCategory[category.value] || 0;
                const budget = budgets[category.value];
                
                return (
                  <motion.div
                    key={category.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <BudgetCategoryCard
                      title={category.label}
                      amount={spent}
                      budget={budget}
                      icon={category.icon}
                      color={category.color}
                      categoryKey={category.value}
                      onSetBudget={handleSetBudget}
                      onRemoveBudget={handleRemoveBudget}
                    />
                  </motion.div>
                );
              })}

            {categories.filter(cat => !budgets[cat.value]).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <AddBudgetCard
                  categories={categories.filter(cat => !budgets[cat.value])}
                  onSetBudget={handleSetBudget}
                  existingBudgets={budgets}
                  expensesByCategory={expensesByCategory}
                  showManageAllBudgetButtonMobile={true}
                  onManageAllBudgetsMobile={() => setIsSetBudgetModalOpen(true)}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <BudgetTips />
        </motion.div>
      </div>

      <ConfirmBudgetRemovalModal
        isOpen={confirmRemovalModal.isOpen}
        onClose={() => setConfirmRemovalModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmRemoveBudget}
        categoryName={confirmRemovalModal.categoryName}
        budgetAmount={confirmRemovalModal.budgetAmount}
      />

      <SetBudgetModal
        isOpen={isSetBudgetModalOpen}
        onClose={() => setIsSetBudgetModalOpen(false)}
        onSubmit={handleSetAllBudgets}
        onRemoveAll={handleRemoveAllBudgets}
        currentBudgets={budgets}
      />
    </div>
  );
}