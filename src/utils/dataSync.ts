import { indexedDBService } from '../services/indexedDBService';


export const resetAndSyncData = async (userEmail: string) => {
  try {
    await indexedDBService.clearUserData(userEmail);
    window.location.reload();
    
  } catch (error) {
    console.error('Error resetting data:', error);
  }
};


export const validateDataStructure = (data: any, type: 'card' | 'account' | 'transaction' | 'budget') => {
  if (!data || typeof data !== 'object') return false;
  
  switch (type) {
    case 'card':
      return data.cardName && typeof data.balance !== 'undefined';
    case 'account':
      return data.accountName && typeof data.balance !== 'undefined';
    case 'transaction':
      return data.amount && data.type && data.date;
    case 'budget':
      return data.category && typeof data.limit !== 'undefined';
    default:
      return false;
  }
};

export const normalizeData = (data: any[], type: 'card' | 'account' | 'transaction' | 'budget') => {
  if (!Array.isArray(data)) return [];
  
  return data.filter(item => validateDataStructure(item, type)).map(item => {
    if (type === 'card' || type === 'account') {
      return {
        ...item,
        balance: typeof item.balance === 'number' ? item.balance : parseFloat(item.balance) || 0
      };
    }
    
    if (type === 'transaction') {
      return {
        ...item,
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0
      };
    }
    
    if (type === 'budget') {
      return {
        ...item,
        limit: typeof item.limit === 'number' ? item.limit : parseFloat(item.limit) || 0
      };
    }
    
    return item;
  });
};


export const checkDataConsistency = async (userEmail: string) => {
  try {
    const offlineData = await indexedDBService.getOfflineData(userEmail);
    
    if (!offlineData) {
      console.log('No offline data found');
      return { consistent: true, issues: [] };
    }
    
    const issues: string[] = [];
    

    if (offlineData.cards && !Array.isArray(offlineData.cards)) {
      issues.push('Cards data is not an array');
    }
    

    if (offlineData.accounts && !Array.isArray(offlineData.accounts)) {
      issues.push('Accounts data is not an array');
    }
  
    if (offlineData.transactions && !Array.isArray(offlineData.transactions)) {
      issues.push('Transactions data is not an array');
    }
    
   
    if (offlineData.budgets && !Array.isArray(offlineData.budgets)) {
      issues.push('Budgets data is not an array');
    }
    
    
    if (offlineData.cards) {
      offlineData.cards.forEach((card: any, index: number) => {
        if (!validateDataStructure(card, 'card')) {
          issues.push(`Card at index ${index} has invalid structure`);
        }
      });
    }
    
    if (offlineData.accounts) {
      offlineData.accounts.forEach((account: any, index: number) => {
        if (!validateDataStructure(account, 'account')) {
          issues.push(`Account at index ${index} has invalid structure`);
        }
      });
    }
    
    return {
      consistent: issues.length === 0,
      issues
    };
    
  } catch (error) {
    console.error('Error checking data consistency:', error);
    return { consistent: false, issues: ['Error checking data consistency'] };
  }
};