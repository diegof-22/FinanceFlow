import React, { createContext, useContext, useEffect } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';


interface FinanceDataContextType {
  
  cards: any[];
  accounts: any[];
  transactions: any[];
  budgets: any[];
  
  isOffline: boolean;
  isLoading: boolean;
  lastSync: Date | null;
  hasOfflineData: boolean;
  dataLoaded: boolean;
  

  addCard: (card: any) => Promise<boolean>;
  updateCard: (id: string, updates: any) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  
  addAccount: (account: any) => Promise<boolean>;
  updateAccount: (id: string, updates: any) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;
  
  addTransaction: (transaction: any) => Promise<boolean>;
  updateTransaction: (id: string, updates: any) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  
  addBudget: (budget: any) => Promise<boolean>;
  updateBudget: (id: string, updates: any) => Promise<boolean>;
  deleteBudget: (id: string) => Promise<boolean>;
  
 
  setBudgetForCategory: (category: string, limit: number) => Promise<boolean>;
  removeBudget: (category: string) => Promise<boolean>;
  
 
  getExpensesByCategory: () => { [category: string]: number };
  getMonthlyExpenses: () => number;
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  

  reloadOfflineData: () => Promise<void>;
  reloadSnapshot: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(undefined);

export const useFinanceDataContext = () => {
  const ctx = useContext(FinanceDataContext);
  if (!ctx) {
    throw new Error('useFinanceDataContext must be used within a FinanceDataProvider');
  }
  return ctx;
};

export const FinanceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const financeData = useFinanceData();
  
  
  useEffect(() => {
    if (financeData.isOffline) {
      console.log('Modalità offline rilevata, ricarico dati locali...');
      financeData.reloadOfflineData();
    }
  }, [financeData.isOffline, financeData.reloadOfflineData]);

  return (
    <FinanceDataContext.Provider value={financeData}>
      {children}
    </FinanceDataContext.Provider>
  );
}; 