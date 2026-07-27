import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/firebase";

const API_BASE_URL = "";
const INITIAL_FETCH_TIMEOUT_MS = 10000;

export function useFinanceData() {
  const [cards, setCards] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgetsState] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      setCards([]);
      setAccounts([]);
      setTransactions([]);
      setBudgetsState([]);
      setInvestments([]);
      setDataLoaded(false);
      setIsLoading(false);
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

  const deduplicateTransactions = (transactions: any[]): any[] => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });
  };

  useEffect(() => {
    if (authLoading || !user || dataLoaded) return;

    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const headers = await getAuthHeaders();
        if (Object.keys(headers).length === 0) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const [c, a, t, b, i] = await Promise.all([
          fetchWithTimeout(`${API_BASE_URL}/api/cards`, { headers }).then(r => r.ok ? r.json() : []),
          fetchWithTimeout(`${API_BASE_URL}/api/accounts`, { headers }).then(r => r.ok ? r.json() : []),
          fetchWithTimeout(`${API_BASE_URL}/api/transactions`, { headers }).then(r => r.ok ? r.json() : []),
          fetchWithTimeout(`${API_BASE_URL}/api/budgets`, { headers }).then(r => r.ok ? r.json() : []),
          fetchWithTimeout(`${API_BASE_URL}/api/investments`, { headers }).then(r => r.ok ? r.json() : []),
        ]);

        if (!isMounted) return;

        setCards(Array.isArray(c) ? c : []);
        setAccounts(Array.isArray(a) ? a : []);
        setTransactions(deduplicateTransactions(Array.isArray(t) ? t : []));
        setBudgetsState(Array.isArray(b) ? b : []);
        setInvestments(Array.isArray(i) ? i : []);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);

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
      setCards(prev => [...prev, saved]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateCard = async (id: string, updates: any) => {
    try {
      setCards(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      const saved = await apiRequest(`${API_BASE_URL}/api/cards/${id}`, "PATCH", updates);
      setCards(prev => prev.map(e => e.id === id ? saved : e));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setCards(prev => prev.filter(e => e.id !== id));
      await apiRequest(`${API_BASE_URL}/api/cards/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addAccount = async (account: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/accounts`, "POST", account);
      setAccounts(prev => [...prev, saved]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateAccount = async (id: string, updates: any) => {
    try {
      setAccounts(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      const saved = await apiRequest(`${API_BASE_URL}/api/accounts/${id}`, "PATCH", updates);
      setAccounts(prev => prev.map(e => e.id === id ? saved : e));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      setAccounts(prev => prev.filter(e => e.id !== id));
      await apiRequest(`${API_BASE_URL}/api/accounts/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error(e);
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
      setTransactions(prev => deduplicateTransactions([saved, ...prev]));
      return true;
    } catch (e) {
      console.error(e);
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

      setTransactions(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      const saved = await apiRequest(`${API_BASE_URL}/api/transactions/${id}`, "PATCH", updates);
      setTransactions(prev => prev.map(e => e.id === id ? saved : e));
      return true;
    } catch (e) {
      console.error(e);
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
      setTransactions(prev => prev.filter(e => e.id !== id));
      await apiRequest(`${API_BASE_URL}/api/transactions/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addBudget = async (budget: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/budgets`, "POST", budget);
      setBudgetsState(prev => [...prev, saved]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateBudget = async (id: string, updates: any) => {
    try {
      setBudgetsState(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      const saved = await apiRequest(`${API_BASE_URL}/api/budgets/${id}`, "PATCH", updates);
      setBudgetsState(prev => prev.map(e => e.id === id ? saved : e));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      setBudgetsState(prev => prev.filter(e => e.id !== id));
      await apiRequest(`${API_BASE_URL}/api/budgets/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addInvestment = async (investment: any) => {
    try {
      const saved = await apiRequest(`${API_BASE_URL}/api/investments`, "POST", investment);
      setInvestments(prev => [...prev, saved]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      setInvestments(prev => prev.filter(e => e.id !== id));
      await apiRequest(`${API_BASE_URL}/api/investments/${id}`, "DELETE");
      return true;
    } catch (e) {
      console.error(e);
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
