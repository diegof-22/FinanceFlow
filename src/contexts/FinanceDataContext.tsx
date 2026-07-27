import React, { createContext, useContext } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Card, Account, Transaction, Budget, CardInput, AccountInput, TransactionInput, BudgetInput } from '@/types/finance';

interface FinanceDataContextType {
  cards: Card[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  investments: any[];
  isLoading: boolean;
  dataLoaded: boolean;

  addCard: (card: CardInput) => Promise<boolean>;
  updateCard: (id: string, updates: Partial<CardInput>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;

  addAccount: (account: AccountInput) => Promise<boolean>;
  updateAccount: (id: string, updates: Partial<AccountInput>) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;

  addTransaction: (transaction: TransactionInput) => Promise<boolean>;
  updateTransaction: (id: string, updates: Partial<TransactionInput>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;

  addBudget: (budget: BudgetInput) => Promise<boolean>;
  updateBudget: (id: string, updates: Partial<BudgetInput>) => Promise<boolean>;
  deleteBudget: (id: string) => Promise<boolean>;

  addInvestment: (investment: any) => Promise<boolean>;
  deleteInvestment: (id: string) => Promise<boolean>;

  setBudgetForCategory: (category: string, limit: number) => Promise<boolean>;
  removeBudget: (category: string) => Promise<boolean>;

  getExpensesByCategory: () => { [category: string]: number };
  getMonthlyExpenses: () => number;
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
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


  return (
    <FinanceDataContext.Provider value={financeData}>
      {children}
    </FinanceDataContext.Provider>
  );
}; 