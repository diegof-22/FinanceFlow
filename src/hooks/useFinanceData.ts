import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/firebase";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";
// 45s to allow Render cold start to wake up without timing out prematurely
const INITIAL_FETCH_TIMEOUT_MS = 45000;

interface LocalFinanceCache {
  cards?: any[];
  accounts?: any[];
  transactions?: any[];
  budgets?: any[];
  investments?: any[];
  updatedAt?: number;
}

const getLocalFinanceCache = (email?: string): LocalFinanceCache | null => {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(`finance_flow_cache_${email.toLowerCase().trim()}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading finance cache from localStorage:", e);
  }
  return null;
};

const setLocalFinanceCache = (
  email: string,
  partialData: {
    cards?: any[];
    accounts?: any[];
    transactions?: any[];
    budgets?: any[];
    investments?: any[];
  }
) => {
  if (!email) return;
  try {
    const key = `finance_flow_cache_${email.toLowerCase().trim()}`;
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : {};
    const updated = {
      ...existing,
      ...Object.fromEntries(Object.entries(partialData).filter(([_, v]) => v !== undefined)),
      updatedAt: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving finance cache to localStorage:", e);
  }
};

export function useFinanceData() {
  const { user, isLoading: authLoading } = useAuth();
  const userEmail = user?.email ? user.email.toLowerCase().trim() : "";

  // Instant local cache initialization so data is available with 0ms delay on mount
  const initialCache = getLocalFinanceCache(userEmail);

  const [cards, setCards] = useState<any[]>(() => initialCache?.cards || []);
  const [accounts, setAccounts] = useState<any[]>(() => initialCache?.accounts || []);
  const [transactions, setTransactions] = useState<any[]>(() => initialCache?.transactions || []);
  const [budgets, setBudgetsState] = useState<any[]>(() => initialCache?.budgets || []);
  const [investments, setInvestments] = useState<any[]>(() => initialCache?.investments || []);

  const hasCachedData = Boolean(
    initialCache &&
    ((initialCache.cards && initialCache.cards.length > 0) ||
     (initialCache.accounts && initialCache.accounts.length > 0))
  );

  // If we already have cached data, we don't block the UI with a skeleton
  const [isLoading, setIsLoading] = useState<boolean>(!hasCachedData);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const deduplicateTransactions = (txs: any[]): any[] => {
    return [...txs].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  };

  // Synchronize state when user logs in or changes
  useEffect(() => {
    if (!authLoading && !user) {
      setCards([]);
      setAccounts([]);
      setTransactions([]);
      setBudgetsState([]);
      setInvestments([]);
      setDataLoaded(false);
      setIsLoading(false);
    } else if (user?.email) {
      const cached = getLocalFinanceCache(user.email);
      if (cached) {
        if (Array.isArray(cached.cards)) setCards(cached.cards);
        if (Array.isArray(cached.accounts)) setAccounts(cached.accounts);
        if (Array.isArray(cached.transactions)) setTransactions(deduplicateTransactions(cached.transactions));
        if (Array.isArray(cached.budgets)) setBudgetsState(cached.budgets);
        if (Array.isArray(cached.investments)) setInvestments(cached.investments);
        if ((cached.cards && cached.cards.length > 0) || (cached.accounts && cached.accounts.length > 0)) {
          setIsLoading(false);
        }
      }
    }
  }, [user, authLoading]);

  const fetchWithTimeout = async (
    input: RequestInfo | URL,
    init: RequestInit = {},
    timeoutMs: number = INITIAL_FETCH_TIMEOUT_MS
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!user || !user.firebaseUser) return {};
    try {
      const token = await user.firebaseUser.getIdToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return {};
  }, [user]);

  // Load fresh data from the server in the background (SWR pattern)
  useEffect(() => {
    if (authLoading || !user || dataLoaded) return;

    let isMounted = true;

    const loadData = async () => {
      const cached = getLocalFinanceCache(user.email);
      const hasExistingItems = cached && ((cached.cards && cached.cards.length > 0) || (cached.accounts && cached.accounts.length > 0));
      if (!hasExistingItems) {
        setIsLoading(true);
      }

      try {
        const headers = await getAuthHeaders();
        if (Object.keys(headers).length === 0) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const [c, a, t, b, i] = await Promise.all([
          fetchWithTimeout(`${API_BASE_URL}/api/cards`, { headers }).then(r => r.ok ? r.json() : null),
          fetchWithTimeout(`${API_BASE_URL}/api/accounts`, { headers }).then(r => r.ok ? r.json() : null),
          fetchWithTimeout(`${API_BASE_URL}/api/transactions`, { headers }).then(r => r.ok ? r.json() : null),
          fetchWithTimeout(`${API_BASE_URL}/api/budgets`, { headers }).then(r => r.ok ? r.json() : null),
          fetchWithTimeout(`${API_BASE_URL}/api/investments`, { headers }).then(r => r.ok ? r.json() : null),
        ]);

        if (!isMounted) return;

        if (Array.isArray(c)) setCards(c);
        if (Array.isArray(a)) setAccounts(a);
        if (Array.isArray(t)) setTransactions(deduplicateTransactions(t));
        if (Array.isArray(b)) setBudgetsState(b);
        if (Array.isArray(i)) setInvestments(i);

        if (user.email) {
          setLocalFinanceCache(user.email, {
            cards: Array.isArray(c) ? c : undefined,
            accounts: Array.isArray(a) ? a : undefined,
            transactions: Array.isArray(t) ? t : undefined,
            budgets: Array.isArray(b) ? b : undefined,
            investments: Array.isArray(i) ? i : undefined,
          });
        }
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading data from backend:", error);
        if (isMounted) setDataLoaded(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, dataLoaded, getAuthHeaders]);

  const apiRequest = async (url: string, method: string, body?: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    if (method !== "DELETE") {
      return await res.json();
    }
    return null;
  };

  const addCard = async (card: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/cards`, "POST", card);
      setCards(prev => {
        const next = [...prev, saved];
        if (userEmail) setLocalFinanceCache(userEmail, { cards: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error adding card:", e);
      return false;
    }
  };

  const updateCard = async (id: string, updates: any) => {
    try {
      setCards(prev => {
        const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
        if (userEmail) setLocalFinanceCache(userEmail, { cards: next });
        return next;
      });
      const saved = await apiRequest(`${API_BASE_URL}/api/cards/${id}`, "PATCH", updates);
      setCards(prev => {
        const next = prev.map(e => e.id === id ? saved : e);
        if (userEmail) setLocalFinanceCache(userEmail, { cards: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error updating card:", e);
      return false;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setCards(prev => {
        const next = prev.filter(e => e.id !== id);
        if (userEmail) setLocalFinanceCache(userEmail, { cards: next });
        return next;
      });
      await apiRequest(`${API_BASE_URL}/api/cards/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error("Error deleting card:", e);
      return false;
    }
  };

  const addAccount = async (account: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/accounts`, "POST", account);
      setAccounts(prev => {
        const next = [...prev, saved];
        if (userEmail) setLocalFinanceCache(userEmail, { accounts: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error adding account:", e);
      return false;
    }
  };

  const updateAccount = async (id: string, updates: any) => {
    try {
      setAccounts(prev => {
        const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
        if (userEmail) setLocalFinanceCache(userEmail, { accounts: next });
        return next;
      });
      const saved = await apiRequest(`${API_BASE_URL}/api/accounts/${id}`, "PATCH", updates);
      setAccounts(prev => {
        const next = prev.map(e => e.id === id ? saved : e);
        if (userEmail) setLocalFinanceCache(userEmail, { accounts: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error updating account:", e);
      return false;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      setAccounts(prev => {
        const next = prev.filter(e => e.id !== id);
        if (userEmail) setLocalFinanceCache(userEmail, { accounts: next });
        return next;
      });
      await apiRequest(`${API_BASE_URL}/api/accounts/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error("Error deleting account:", e);
      return false;
    }
  };

  const updateSourceBalance = async (source: any, newBalance: number) => {
    if ('cardType' in source) {
      await updateCard(source.id, { balance: newBalance });
    } else {
      await updateAccount(source.id, { balance: newBalance });
    }
  };

  const addTransaction = async (transaction: any) => {
    try {
      const source = [...cards, ...accounts].find(item => item.id === transaction.sourceId);
      if (source) {
        const currentBalance = parseFloat(source.balance) || 0;
        const amount = parseFloat(transaction.amount) || 0;
        let newBalance = currentBalance;
        if (transaction.type === 'expense') newBalance -= amount;
        else if (transaction.type === 'income') newBalance += amount;
        await updateSourceBalance(source, newBalance);
      }
      
      const saved = await apiRequest(`${API_BASE_URL}/api/transactions`, "POST", transaction);
      setTransactions(prev => {
        const next = deduplicateTransactions([saved, ...prev]);
        if (userEmail) setLocalFinanceCache(userEmail, { transactions: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error adding transaction:", e);
      return false;
    }
  };

  const updateTransaction = async (id: string, updates: any) => {
    try {
      const existing = transactions.find(t => t.id === id);
      if (existing) {
        const source = [...cards, ...accounts].find(item => item.id === existing.sourceId);
        if (source) {
          const currentBalance = parseFloat(source.balance) || 0;
          const oldAmount = parseFloat(existing.amount) || 0;
          const newAmount = parseFloat(updates.amount) || oldAmount;
          const oldType = existing.type;
          const newType = updates.type || oldType;
          
          let adjustment = 0;
          if (oldType === 'expense' && newType === 'expense') adjustment = oldAmount - newAmount;
          else if (oldType === 'income' && newType === 'income') adjustment = newAmount - oldAmount;
          else if (oldType === 'expense' && newType === 'income') adjustment = oldAmount + newAmount;
          else if (oldType === 'income' && newType === 'expense') adjustment = -(oldAmount + newAmount);
          
          await updateSourceBalance(source, currentBalance + adjustment);
        }
      }

      setTransactions(prev => {
        const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
        if (userEmail) setLocalFinanceCache(userEmail, { transactions: next });
        return next;
      });
      const saved = await apiRequest(`${API_BASE_URL}/api/transactions/${id}`, "PATCH", updates);
      setTransactions(prev => {
        const next = prev.map(e => e.id === id ? saved : e);
        if (userEmail) setLocalFinanceCache(userEmail, { transactions: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error updating transaction:", e);
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const existing = transactions.find(t => t.id === id);
      if (existing) {
        const source = [...cards, ...accounts].find(item => item.id === existing.sourceId);
        if (source) {
          const currentBalance = parseFloat(source.balance) || 0;
          const amount = parseFloat(existing.amount) || 0;
          let newBalance = currentBalance;
          if (existing.type === 'expense') newBalance += amount;
          else if (existing.type === 'income') newBalance -= amount;
          await updateSourceBalance(source, newBalance);
        }
      }
      setTransactions(prev => {
        const next = prev.filter(e => e.id !== id);
        if (userEmail) setLocalFinanceCache(userEmail, { transactions: next });
        return next;
      });
      await apiRequest(`${API_BASE_URL}/api/transactions/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error("Error deleting transaction:", e);
      return false;
    }
  };

  const addBudget = async (budget: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/budgets`, "POST", budget);
      setBudgetsState(prev => {
        const next = [...prev, saved];
        if (userEmail) setLocalFinanceCache(userEmail, { budgets: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error adding budget:", e);
      return false;
    }
  };

  const updateBudget = async (id: string, updates: any) => {
    try {
      setBudgetsState(prev => {
        const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
        if (userEmail) setLocalFinanceCache(userEmail, { budgets: next });
        return next;
      });
      const saved = await apiRequest(`${API_BASE_URL}/api/budgets/${id}`, "PATCH", updates);
      setBudgetsState(prev => {
        const next = prev.map(e => e.id === id ? saved : e);
        if (userEmail) setLocalFinanceCache(userEmail, { budgets: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error updating budget:", e);
      return false;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      setBudgetsState(prev => {
        const next = prev.filter(e => e.id !== id);
        if (userEmail) setLocalFinanceCache(userEmail, { budgets: next });
        return next;
      });
      await apiRequest(`${API_BASE_URL}/api/budgets/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error("Error deleting budget:", e);
      return false;
    }
  };

  const addInvestment = async (investment: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/investments`, "POST", investment);
      setInvestments(prev => {
        const next = [...prev, saved];
        if (userEmail) setLocalFinanceCache(userEmail, { investments: next });
        return next;
      });
      return true;
    } catch (e) {
      console.error("Error adding investment:", e);
      return false;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      setInvestments(prev => {
        const next = prev.filter(e => e.id !== id);
        if (userEmail) setLocalFinanceCache(userEmail, { investments: next });
        return next;
      });
      await apiRequest(`${API_BASE_URL}/api/investments/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error("Error deleting investment:", e);
      return false;
    }
  };

  const setBudgetForCategory = async (category: string, limit: number): Promise<boolean> => {
    const existing = budgets.find(b => b.category === category);
    if (existing) {
      return await updateBudget(existing.id, { limit });
    } else {
      return await addBudget({ category, limit, spent: 0 });
    }
  };

  const removeBudget = async (category: string): Promise<boolean> => {
    const existing = budgets.find(b => b.category === category);
    if (existing) {
      return await deleteBudget(existing.id);
    }
    return false;
  };

  const getExpensesByCategory = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const expenses: { [key: string]: number } = {};
    
    transactions.forEach(t => {
      const d = new Date(t.date || t.createdAt);
      if (t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        expenses[t.category] = (expenses[t.category] || 0) + (parseFloat(t.amount) || 0);
      }
    });
    return expenses;
  };

  const getMonthlyExpenses = () => {
    const exps = getExpensesByCategory();
    return Object.values(exps).reduce((a, b) => a + b, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.reduce((total, t) => {
      const d = new Date(t.date || t.createdAt);
      if (t.type === 'income' && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return total + (parseFloat(t.amount) || 0);
      }
      return total;
    }, 0);
  };

  const getTotalBalance = () => {
    const cardsBalance = cards.reduce((sum, c) => sum + (parseFloat(c.balance) || 0), 0);
    const accountsBalance = accounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0);
    return cardsBalance + accountsBalance;
  };

  return {
    cards,
    accounts,
    transactions,
    budgets,
    investments,
    isLoading,
    dataLoaded,
    addCard,
    updateCard,
    deleteCard,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addInvestment,
    deleteInvestment,
    setBudgetForCategory,
    removeBudget,
    getExpensesByCategory,
    getMonthlyExpenses,
    getMonthlyIncome,
    getTotalBalance,
  };
}
