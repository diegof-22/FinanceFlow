import { 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  TrendingUp 
} from "lucide-react";
import { FilterOption } from "@/components/ui/filter-bar";


export interface ConfirmRemovalModalState {
  isOpen: boolean;
  category: string;
  categoryName: string;
  budgetAmount: number;
}

export const BUDGET_CATEGORIES = [
  { value: 'shopping', label: 'Shopping' },
  { value: 'transport', label: 'Trasporti' },
  { value: 'home', label: 'Casa' },
  { value: 'food', label: 'Cibo & Bevande' },
  { value: 'entertainment', label: 'Intrattenimento' },
  { value: 'health', label: 'Salute' }
];


export const hasCardsOrAccounts = (cards: any[], accounts: any[]): boolean => {
  return cards.length > 0 || accounts.length > 0;
};


export const createFilters = (cards: any[], accounts: any[]): FilterOption[] => {
  return [
    {
      id: "all",
      label: "Tutti",
      icon: Wallet,
      count: cards.length + accounts.length,
    },
    {
      id: "credit-cards",
      label: "Carte Credito",
      icon: CreditCard,
      count: cards.filter((card) => card.cardType === "credit").length,
    },
    {
      id: "debit-cards",
      label: "Carte Debito",
      icon: CreditCard,
      count: cards.filter((card) => card.cardType === "debit").length,
    },
    {
      id: "checking",
      label: "Conti Correnti",
      icon: Wallet,
      count: accounts.filter((account) => account.accountType === "checking").length,
    },
    {
      id: "savings",
      label: "Conti Risparmio",
      icon: PiggyBank,
      count: accounts.filter((account) => account.accountType === "savings").length,
    },
    {
      id: "investment",
      label: "Investimenti",
      icon: TrendingUp,
      count: accounts.filter((account) => account.accountType === "investment").length,
    },
  ].filter((filter) => filter.count > 0 || filter.id === "all");
};


export const getFilteredItems = (
  cards: any[], 
  accounts: any[], 
  activeFilter: string
) => {
  let filteredCards = cards;
  let filteredAccounts = accounts;

  switch (activeFilter) {
    case "credit-cards":
      filteredCards = cards.filter((card) => card.cardType === "credit");
      filteredAccounts = [];
      break;
    case "debit-cards":
      filteredCards = cards.filter((card) => card.cardType === "debit");
      filteredAccounts = [];
      break;
    case "checking":
      filteredCards = [];
      filteredAccounts = accounts.filter((account) => account.accountType === "checking");
      break;
    case "savings":
      filteredCards = [];
      filteredAccounts = accounts.filter((account) => account.accountType === "savings");
      break;
    case "investment":
      filteredCards = [];
      filteredAccounts = accounts.filter((account) => account.accountType === "investment");
      break;
    default:
      break;
  }

  return { filteredCards, filteredAccounts };
};


export const BUDGET_CATEGORIES_CONFIG = [
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingCart', color: 'blue' },
  { value: 'transport', label: 'Trasporti', icon: 'Car', color: 'green' },
  { value: 'home', label: 'Casa', icon: 'Home', color: 'red' },
  { value: 'food', label: 'Cibo & Bevande', icon: 'Coffee', color: 'yellow' },
  { value: 'entertainment', label: 'Intrattenimento', icon: 'Gamepad2', color: 'purple' },
  { value: 'health', label: 'Salute', icon: 'Heart', color: 'pink' }
];

export const getActiveBudgets = (budgets: any[], expensesByCategory: any) => {
  return BUDGET_CATEGORIES_CONFIG
    .filter(categoryConfig => {
      const budget = budgets.find(b => b.category === categoryConfig.value);
      return budget && budget.limit > 0;
    })
    .slice(0, 6) 
    .map(categoryConfig => {
      const budget = budgets.find(b => b.category === categoryConfig.value);
      return {
        ...categoryConfig,
        amount: expensesByCategory[categoryConfig.value] || 0,
        budget: budget?.limit || 0
      };
    });
};

export const createModalCloseHandlers = (
  setIsAddCardModalOpen: (open: boolean) => void,
  setIsAddAccountModalOpen: (open: boolean) => void,
  setIsAddTransactionModalOpen: (open: boolean) => void,
  setSelectedCard: (card: any) => void,
  setSelectedAccount: (account: any) => void
) => ({
  closeCardModal: () => {
    setIsAddCardModalOpen(false);
    setSelectedCard(null);
  },
  closeAccountModal: () => {
    setIsAddAccountModalOpen(false);
    setSelectedAccount(null);
  },
  closeTransactionModal: () => {
    setIsAddTransactionModalOpen(false);
  }
}); 