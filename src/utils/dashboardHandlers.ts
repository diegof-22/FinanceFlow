import { CardData, AccountData, TransactionData } from "@/types/finance";
import { convertAccountData, convertCardData } from "@/types/finance";
import { BUDGET_CATEGORIES, type ConfirmRemovalModalState } from "./dashboardUtils";

export interface DashboardHandlers {
  handleAddAccount: () => void;
  handleAddCard: () => void;
  handleAddTransaction: () => void;
  
  handleCardSubmit: (data: CardData) => Promise<void>;
  handleAccountSubmit: (data: AccountData) => Promise<void>;
  handleTransactionSubmit: (data: TransactionData) => Promise<boolean>;
  
  handleRemoveBudget: (category: string) => void;
  confirmRemoveBudget: () => Promise<void>;
  
  handleDeleteCard: (cardId: string) => void;
  handleDeleteAccount: (accountId: string) => void;
  handleDeleteTransaction: (transactionId: string) => void;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export const createDashboardHandlers = (
  setIsAddAccountModalOpen: (open: boolean) => void,
  setIsAddCardModalOpen: (open: boolean) => void,
  setIsAddTransactionModalOpen: (open: boolean) => void,
  setConfirmRemovalModal: (state: ConfirmRemovalModalState) => void,
  setConfirmModal: (state: ConfirmModalState) => void,
  
  selectedCard: any,
  selectedAccount: any,
  setSelectedCard: (card: any) => void,
  setSelectedAccount: (account: any) => void,
  
  addCard: (card: any) => Promise<boolean>,
  addAccount: (account: any) => Promise<boolean>,
  addTransaction: (transaction: any) => Promise<boolean>,
  updateCard: (id: string, updates: any) => Promise<boolean>,
  updateAccount: (id: string, updates: any) => Promise<boolean>,
  deleteCard: (id: string) => Promise<boolean>,
  deleteAccount: (id: string) => Promise<boolean>,
  deleteTransaction: (id: string) => Promise<boolean>,
  setBudgetForCategory: (category: string, amount: number) => Promise<boolean>,
  removeBudget: (category: string) => Promise<boolean>,
  
  cards: any[],
  accounts: any[],
  transactions: any[],
  budgets: any[],
  confirmRemovalModal: ConfirmRemovalModalState
): DashboardHandlers => {

  const handleAddAccount = () => setIsAddAccountModalOpen(true);
  const handleAddCard = () => setIsAddCardModalOpen(true);
  const handleAddTransaction = () => setIsAddTransactionModalOpen(true);

  const handleCardSubmit = async (data: CardData) => {
    try {
      let success = false;
      
      if (selectedCard) {
        success = await updateCard(selectedCard.id, {
          ...data,
          balance: parseFloat(data.balance)
        });
      } else {
        success = await addCard({
          ...data,
          balance: parseFloat(data.balance)
        });
      }
      
      if (success) {
        setIsAddCardModalOpen(false);
        setSelectedCard(null);
      }
    } catch (error) {
      console.error('Error in handleCardSubmit:', error);
    }
  };

  const handleAccountSubmit = async (data: AccountData) => {
    try {
      let success = false;
      
      if (selectedAccount) {
        
        success = await updateAccount(selectedAccount.id, {
          ...data,
          balance: parseFloat(data.balance)
        });
      } else {
        success = await addAccount({
          ...data,
          balance: parseFloat(data.balance)
        });
      }
      
      if (success) {
        setIsAddAccountModalOpen(false);
        setSelectedAccount(null);
      }
    } catch (error) {
      console.error('Error in handleAccountSubmit:', error);
    }
  };

  const handleTransactionSubmit = async (data: TransactionData): Promise<boolean> => {
    try {
      const success = await addTransaction(data);
      if (success) {
        setIsAddTransactionModalOpen(false);
      }
      return success;
    } catch (error) {
      console.error('Error in handleTransactionSubmit:', error);
      return false;
    }
  };

  const handleRemoveBudget = (category: string) => {
    const categoryData = BUDGET_CATEGORIES.find(cat => cat.value === category);
    const budget = budgets.find(b => b.category === category);
    const budgetAmount = budget?.limit || 0;
    
    setConfirmRemovalModal({
      isOpen: true,
      category,
      categoryName: categoryData?.label || category,
      budgetAmount
    });
  };

  const confirmRemoveBudget = async () => {
    try {
      const success = await removeBudget(confirmRemovalModal.category);
      if (success) {
        setConfirmRemovalModal({
          isOpen: false,
          category: '',
          categoryName: '',
          budgetAmount: 0
        });
      }
    } catch (error) {
      console.error('Error in confirmRemoveBudget:', error);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    setConfirmModal({
      isOpen: true,
      title: "Elimina Carta",
      message: `Sei sicuro di voler eliminare ${card?.cardName || 'questa carta'}?`,
      onConfirm: async () => {
        const success = await deleteCard(cardId);
        if (success) {
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
        }
      }
    });
  };

  const handleDeleteAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    setConfirmModal({
      isOpen: true,
      title: "Elimina Conto",
      message: `Sei sicuro di voler eliminare ${account?.accountName || 'questo conto'}?`,
      onConfirm: async () => {
        const success = await deleteAccount(accountId);
        if (success) {
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
        }
      }
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setConfirmModal({
      isOpen: true,
      title: "Elimina Transazione",
      message: `Sei sicuro di voler eliminare la transazione "${transaction?.title || 'questa transazione'}"?`,
      onConfirm: async () => {
        const success = await deleteTransaction(transactionId);
        if (success) {
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: () => {} });
        }
      }
    });
  };

  return {
    handleAddAccount,
    handleAddCard,
    handleAddTransaction,
    handleCardSubmit,
    handleAccountSubmit,
    handleTransactionSubmit,
    handleRemoveBudget,
    confirmRemoveBudget,
    handleDeleteCard,
    handleDeleteAccount,
    handleDeleteTransaction
  };
}; 