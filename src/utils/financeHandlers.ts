import { Transaction, TransactionInput, CardInput, AccountInput, OfflineCard, OfflineAccount, OfflineTransaction } from "@/types/finance";


export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}




export const sortTransactionsByDate = (transactions: (Transaction | OfflineTransaction)[]): (Transaction | OfflineTransaction)[] => {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;
   
    const getCreatedAt = (item: any) => {
      if (!item.createdAt) return 0;
      if (typeof item.createdAt === 'string' || typeof item.createdAt === 'number') {
        return new Date(item.createdAt).getTime();
      }
      if (item.createdAt.toDate) {
        
        return item.createdAt.toDate().getTime();
      }
      if (item.createdAt instanceof Date) {
        return item.createdAt.getTime();
      }
      return 0;
    };
    const createdA = getCreatedAt(a);
    const createdB = getCreatedAt(b);
    return createdB - createdA;
  });
};

export const formatBalance = (balance: number | string | undefined | null): string => {
  if (balance === null || balance === undefined) return '0.00';
  const numericBalance = typeof balance === 'number' ? balance : parseFloat(balance.toString());
  return isNaN(numericBalance) ? '0.00' : numericBalance.toFixed(2);
};

export const formatTimestamp = (timestamp: any): string => {
  try {
    if (!timestamp) return 'Data non disponibile';
   
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }
    
    if (timestamp instanceof Date) {
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(timestamp);
    }
   
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('it-IT', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(date);
      }
    }
    return 'Data non disponibile';
  } catch (error) {
    return 'Data non disponibile';
  }
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};