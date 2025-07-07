import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/firebase";
import indexedDBService, {
  OfflineData,
  SyncOperation,
} from "@/services/indexedDBService";


const resourceMap = {
  card: { url: "/api/cards" },
  account: { url: "/api/accounts" },
  transaction: { url: "/api/transactions" },
  budget: { url: "/api/budgets" },
};

type ResourceType = "card" | "account" | "transaction" | "budget";
type ActionType = "add" | "update" | "delete";

type QueueOp = {
  resource: ResourceType;
  action: ActionType;
  data: any;
};

export function useFinanceData() {
  const [cards, setCards] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgetsState] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const userEmail = user?.email || "guest";
  const userId = user?.id || null;

  const snapshotTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userEmail === "guest") {
        setCards([]);
        setAccounts([]);
        setTransactions([]);
        setBudgetsState([]);
        setDataLoaded(false);
        setCurrentUserId(null);
        setLastSync(null);
        setHasOfflineData(false);
        setIsLoading(false);
      } else if (userId && userId !== currentUserId) {
        setCards([]);
        setAccounts([]);
        setTransactions([]);
        setBudgetsState([]);
        setDataLoaded(false);
        setCurrentUserId(userId);
        setLastSync(null);
        setHasOfflineData(false);
      }
    }
  }, [userId, authLoading, currentUserId]);

  
  useEffect(() => {
    if (authLoading) return;
    
    
    if (!user && !isOffline) {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log(' Ripristinato utente da localStorage:', userData.email);
          
          
          setCurrentUserId(userData.id);
          setDataLoaded(false);
        }
      } catch (error) {
        console.error('Errore nel ripristino utente da localStorage:', error);
      }
    }
  }, [authLoading, user, isOffline]);

  
  useEffect(() => {
    if (user && !authLoading) {
      const { firebaseUser, ...serializableUser } = user;
      localStorage.setItem('user', JSON.stringify(serializableUser));
      console.log('Utente salvato in localStorage:', user.email);
    }
  }, [user, authLoading]);

  const testApiConnection = async (
    headers: Record<string, string>
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        headers,
        timeout: 5000,
      } as any);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (!user) {
      return {};
    }

    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();

      if (!auth.currentUser) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        return {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      }
    } catch (error) {
    }
    return {};
  };

  const saveSnapshot = useCallback(
    async (
      cardsData: any[],
      accountsData: any[],
      transactionsData: any[],
      budgetsData: any[],
      syncTime?: Date,
      email?: string,
      isOnlineSync: boolean = false
    ) => {
      const processData = (items: any[]) => {
        if (!Array.isArray(items)) return [];
        
        if (isOnlineSync) {
          return items.filter(
              (item) =>
                item && item.id && !item.id.toString().startsWith("temp_")
          );
        } else {
          return items.filter(item => item && item.id);
        }
      };

      const data: OfflineData = {
        cards: processData(cardsData),
        accounts: processData(accountsData),
        transactions: processData(transactionsData),
        budgets: processData(budgetsData),
        lastSync: syncTime || new Date(),
        pendingSync: !isOnlineSync,
      };

      await indexedDBService.saveOfflineData(email || userEmail, data);
    },
    [userEmail]
  );

  function actionTypeToSyncType(
    resource: ResourceType,
    action: ActionType
  ): SyncOperation["type"] {
    const map: Record<
      ResourceType,
      Record<ActionType, SyncOperation["type"]>
    > = {
      card: { add: "ADD_CARD", update: "UPDATE_CARD", delete: "DELETE_CARD" },
      account: {
        add: "ADD_ACCOUNT",
        update: "UPDATE_ACCOUNT",
        delete: "DELETE_ACCOUNT",
      },
      transaction: {
        add: "ADD_TRANSACTION",
        update: "UPDATE_TRANSACTION",
        delete: "DELETE_TRANSACTION",
      },
      budget: {
        add: "ADD_BUDGET",
        update: "UPDATE_BUDGET",
        delete: "DELETE_BUDGET",
      },
    };
    return map[resource][action];
  }

  useEffect(() => {
    if (authLoading) {
      return;
    }

    
    if (!user) {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('Ripristinato utente da localStorage per caricamento dati:', userData.email);
          
          
          if (!navigator.onLine) {
            loadOfflineData(userData.email);
            return;
          }
        }
      } catch (error) {
        console.error('Errore nel ripristino utente da localStorage:', error);
      }
      return;
    }

    if (!userId || userEmail === "guest") {
      return;
    }

    if (userId !== currentUserId) {
      return;
    }

    if (dataLoaded) {
      return;
    }

    if (isLoading) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      try {
        if (navigator.onLine) {
            const headers = await getAuthHeaders();
            if (Object.keys(headers).length > 0) {
              const apiAvailable = await testApiConnection(headers);
            if (!apiAvailable) throw new Error("API not available");
            } else {
              throw new Error("No authentication");
            }

            const [c, a, t, b] = await Promise.all([
            fetch("/api/cards", { headers }).then((r) => (r.ok ? r.json() : [])),
            fetch("/api/accounts", { headers }).then((r) => (r.ok ? r.json() : [])),
            fetch("/api/transactions", { headers }).then((r) => (r.ok ? r.json() : [])),
            fetch("/api/budgets", { headers }).then((r) => (r.ok ? r.json() : [])),
          ]);

          const deduplicatedTransactions = deduplicateTransactions(Array.isArray(t) ? t : []);
          setCards(Array.isArray(c) ? c : []);
          setAccounts(Array.isArray(a) ? a : []);
          setTransactions(deduplicatedTransactions);
          setBudgetsState(Array.isArray(b) ? b : []);

          await saveSnapshot(
              Array.isArray(c) ? c : [],
              Array.isArray(a) ? a : [],
              deduplicatedTransactions,
              Array.isArray(b) ? b : [],
            new Date(),
            userEmail,
            true
          );

          setLastSync(new Date());
              setHasOfflineData(true);
              setDataLoaded(true);
        } else {
          await loadOfflineData(userEmail);
        }
      } catch (error) {
        console.error('Errore nel caricamento dati online, carico dati offline:', error);
        await loadOfflineData(userEmail);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, currentUserId, dataLoaded, isLoading, authLoading, user, userEmail]);

  const loadOfflineData = async (email: string) => {
    try {
      console.log('Caricamento dati offline per:', email);
      const data = await indexedDBService.getOfflineData(email);
      if (data) {
        const deduplicatedTransactions = deduplicateTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setCards(Array.isArray(data.cards) ? data.cards : []);
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
        setTransactions(deduplicatedTransactions);
        setBudgetsState(Array.isArray(data.budgets) ? data.budgets : []);
        setLastSync(data.lastSync);
        setHasOfflineData(true);
        setDataLoaded(true);
        console.log('Dati offline caricati con successo');
      } else {
        console.log('Nessun dato offline trovato per:', email);
        setCards([]);
        setAccounts([]);
        setTransactions([]);
        setBudgetsState([]);
        setLastSync(null);
        setHasOfflineData(false);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Errore nel caricamento dati offline:', error);
      setCards([]);
      setAccounts([]);
      setTransactions([]);
      setBudgetsState([]);
      setLastSync(null);
      setHasOfflineData(false);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOffline && dataLoaded && user) {
      
      console.log('Passaggio online rilevato, sincronizzazione in corso...');
      
      syncQueue();
    }
  }, [isOffline, dataLoaded]);

  const handleAction = useCallback(
    async (resource: ResourceType, action: ActionType, data: any) => {
      console.log(`handleAction: ${action} ${resource}`, { data });
      
      if (!user) return;

      const setState = {
        card: setCards,
        account: setAccounts,
        transaction: setTransactions,
        budget: setBudgetsState,
      }[resource];

      
      const getUpdatedData = (currentData: any[], operation: ActionType, item: any) => {
        switch (operation) {
          case "add":
            return [...currentData, item];
          case "delete":
            return currentData.filter((e) => e.id !== item.id);
          case "update":
            return currentData.map((e) => e.id === item.id ? { ...e, ...item.updates } : e);
          default:
            return currentData;
        }
      };

      if (isOffline) {
        
        setState((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          let updated;
          
          if (action === "add") {
            updated = [...prevArray, data];
          } else if (action === "delete") {
            updated = prevArray.filter((e) => e.id !== data.id);
          } else if (action === "update") {
            updated = prevArray.map((e) => e.id === data.id ? { ...e, ...data.updates } : e);
          } else {
            updated = prevArray;
          }
          
          return updated;
        });

        await indexedDBService.addToSyncQueue({
          type: actionTypeToSyncType(resource, action),
          data,
          userEmail,
          timestamp: new Date(),
        });
        
     
        const updatedCards = resource === "card" ? getUpdatedData(cards, action, data) : cards;
        const updatedAccounts = resource === "account" ? getUpdatedData(accounts, action, data) : accounts;
        const updatedTransactions = resource === "transaction" ? getUpdatedData(transactions, action, data) : transactions;
        const updatedBudgets = resource === "budget" ? getUpdatedData(budgets, action, data) : budgets;
        
        await saveSnapshot(
          updatedCards,
          updatedAccounts,
          updatedTransactions,
          updatedBudgets,
          new Date(),
          userEmail
        );
        return;
      }

      
      let newCards: any[] = [],
        newAccounts: any[] = [],
        newTransactions: any[] = [],
        newBudgets: any[] = [];
        
      if (action === "add") {
        setState((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const updated = [...prevArray, data];
          if (resource === "card") newCards = updated;
          else if (resource === "account") newAccounts = updated;
          else if (resource === "transaction") newTransactions = updated;
          else if (resource === "budget") newBudgets = updated;
          return updated;
        });
      }
      if (action === "delete") {
        setState((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const updated = prevArray.filter((e) => e.id !== data.id);
          if (resource === "card") newCards = updated;
          else if (resource === "account") newAccounts = updated;
          else if (resource === "transaction") newTransactions = updated;
          else if (resource === "budget") newBudgets = updated;
          return updated;
        });
      }
      if (action === "update") {
        setState((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const updated = prevArray.map((e) =>
            e.id === data.id ? { ...e, ...data.updates } : e
          );
          if (resource === "card") newCards = updated;
          else if (resource === "account") newAccounts = updated;
          else if (resource === "transaction") newTransactions = updated;
          else if (resource === "budget") newBudgets = updated;
          return updated;
        });
      }

      
      await saveSnapshot(
        newCards,
        newAccounts,
        newTransactions,
        newBudgets,
        new Date(),
        userEmail
      );

      const { url } = resourceMap[resource];
      try {
        const headers = await getAuthHeaders();
        if (action === "add") {
          const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
          }
          const saved = await res.json();
          setState((prev) => prev.map((e) => (e.id === data.id ? saved : e)));
          
          // Aggiorna snapshot con ID reale
          const updatedCards =
            resource === "card"
              ? [...newCards.filter((e) => e.id !== data.id), saved]
              : newCards;
          const updatedAccounts =
            resource === "account"
              ? [...newAccounts.filter((e) => e.id !== data.id), saved]
              : newAccounts;
          const updatedTransactions =
            resource === "transaction"
              ? [...newTransactions.filter((e) => e.id !== data.id), saved]
              : newTransactions;
          const updatedBudgets =
            resource === "budget"
              ? [...newBudgets.filter((e) => e.id !== data.id), saved]
              : newBudgets;

         
          await saveSnapshot(
            updatedCards,
            updatedAccounts,
            updatedTransactions,
            updatedBudgets,
            new Date(),
            userEmail,
            true 
          );
        }
        if (action === "delete") {
          if (data.id && !data.id.startsWith("temp_")) {
            try {
              const res = await fetch(`${url}/${data.id}`, {
                method: "DELETE",
                headers,
              });
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`);
              }
            } catch (error) {
              console.error('Error deleting from API:', error);
              throw error; 
            }
          }
        }
        if (action === "update") {
          const res = await fetch(`${url}/${data.id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data.updates),
          });
          if (!res.ok) {
            setState((prev) => prev.filter((e) => e.id !== data.id));
            throw new Error(`HTTP ${res.status}: ${await res.text()}`);
          }
        }
      } catch (error) {
        console.error('Errore API, aggiungendo alla syncQueue:', error);
        await indexedDBService.addToSyncQueue({
          type: actionTypeToSyncType(resource, action),
          data,
          userEmail,
          timestamp: new Date(),
        });
      }
    },
    [isOffline, userEmail, cards, accounts, transactions, budgets, saveSnapshot]
  );

  const deduplicateTransactions = (transactions: any[]): any[] => {
    
    console.log(`Transazioni ricevute: ${transactions.length}`);
    
    
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA; 
    });
    
    console.log(`Transazioni ordinate: ${sortedTransactions.length}`);
    return sortedTransactions;
  };

  const syncQueue = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);

    const queue = await indexedDBService.getSyncQueue(userEmail);

    if (queue.length === 0) {
      setIsLoading(false);
      return;
    }

    console.log(`Sincronizzazione di ${queue.length} operazioni`);

    
    for (const op of queue) {
      try {
        await handleAction(
          op.type.split("_")[1].toLowerCase() as ResourceType,
          op.type.split("_")[0].toLowerCase() as ActionType,
          op.data
        );
      } catch (error) {
        console.error('Errore nella sincronizzazione:', error);
      }
    }

    
    try {
      const headers = await getAuthHeaders();
      if (Object.keys(headers).length > 0) {
        const [c, a, t, b] = await Promise.all([
          fetch("/api/cards", { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/accounts", { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/transactions", { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/budgets", { headers }).then((r) => (r.ok ? r.json() : [])),
        ]);

        const filterTempIds = (arr: any[]) => (Array.isArray(arr) ? arr.filter(e => e && e.id && !e.id.toString().startsWith('temp_')) : []);
        const filteredCards = filterTempIds(c);
        const filteredAccounts = filterTempIds(a);
        const filteredTransactions = filterTempIds(t);
        const filteredBudgets = filterTempIds(b);

        setCards(filteredCards);
        setAccounts(filteredAccounts);
        setTransactions(filteredTransactions);
        setBudgetsState(filteredBudgets);
      }
    } catch (error) {
      console.error('Errore nel ricaricamento dati post-sync:', error);
    }

    await indexedDBService.clearSyncQueue(userEmail);
    setIsLoading(false);
    console.log('Sincronizzazione completata');
  }, [handleAction, user, userEmail, getAuthHeaders, saveSnapshot]);

  const addCard = async (card: any): Promise<boolean> => {
    if (isOffline) {
      setCards(prev => [...prev, card]);
      await indexedDBService.addToSyncQueue({
        type: "ADD_CARD",
        data: card,
        userEmail,
        timestamp: new Date(),
      });
      await saveSnapshot([...cards, card], accounts, transactions, budgets, new Date(), userEmail);
      return true;
    }
    await handleAction("card", "add", card);
    return true;
  };
  const updateCard = async (id: string, updates: any): Promise<boolean> => {
    if (!id) {
      console.error('updateCard: ID is required');
      return false;
    }
    await handleAction("card", "update", { id, updates });
    return true;
  };
  const deleteCard = async (id: string): Promise<boolean> => {
    console.log('deleteCard chiamata, isOffline:', isOffline, 'id:', id);
    if (!id) {
      console.error('deleteCard: ID is required');
      return false;
    }
    if (isOffline) {
      const updated = cards.filter(card => card.id !== id);
      setCards(updated);
      await indexedDBService.addToSyncQueue({
        type: "DELETE_CARD",
        data: { id },
        userEmail,
        timestamp: new Date(),
      });
      console.log('Azione DELETE_CARD aggiunta alla syncQueue');
      await saveSnapshot(
        updated,
        accounts,
        transactions,
        budgets,
        new Date(),
        userEmail
      );
      console.log('Snapshot salvato dopo eliminazione carta offline');
      return true;
    }
    await handleAction("card", "delete", { id });
    return true;
  };
  const addAccount = async (account: any): Promise<boolean> => {
    await handleAction("account", "add", {
      ...account,
      id: "temp_" + Date.now(),
    });
    return true;
  };
  const updateAccount = async (id: string, updates: any): Promise<boolean> => {
    if (!id) {
      console.error('updateAccount: ID is required');
      return false;
    }
    await handleAction("account", "update", { id, updates });
    return true;
  };
  const deleteAccount = async (id: string): Promise<boolean> => {
    console.log('deleteAccount chiamata, isOffline:', isOffline, 'id:', id);
    if (!id) {
      console.error('deleteAccount: ID is required');
      return false;
    }
    if (isOffline) {
      const updated = accounts.filter(account => account.id !== id);
      setAccounts(updated);
      await indexedDBService.addToSyncQueue({
        type: "DELETE_ACCOUNT",
        data: { id },
        userEmail,
        timestamp: new Date(),
      });
      console.log('Azione DELETE_ACCOUNT aggiunta alla syncQueue');
      await saveSnapshot(
        cards,
        updated,
        transactions,
        budgets,
        new Date(),
        userEmail
      );
      console.log('Snapshot salvato dopo eliminazione account offline');
      return true;
    }
    await handleAction("account", "delete", { id });
    return true;
  };

  const addTransaction = async (transaction: any): Promise<boolean> => {
    try {
      const source = [...cards, ...accounts].find(item => item.id === transaction.sourceId);
      
      if (!source) {
        console.error('Fonte non trovata per sourceId:', transaction.sourceId);
        return false;
      }

      const currentBalance = parseFloat(source.balance) || 0;
      const transactionAmount = parseFloat(transaction.amount) || 0;
      let newBalance = currentBalance;

      if (transaction.type === 'expense') {
        newBalance = currentBalance - transactionAmount;
      } else if (transaction.type === 'income') {
        newBalance = currentBalance + transactionAmount;
      }

      if ('cardType' in source) {
        await handleAction("card", "update", {
          id: source.id,
          updates: { balance: newBalance }
        });
      } else {
        await handleAction("account", "update", {
          id: source.id,
          updates: { balance: newBalance }
        });
      }

      const uniqueId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await handleAction("transaction", "add", {
        ...transaction,
        id: uniqueId,
      });

      return true;
    } catch (error) {
      console.error('Errore in addTransaction:', error);
      return false;
    }
  };
  const updateTransaction = async (
    id: string,
    updates: any
  ): Promise<boolean> => {
    if (!id) {
      console.error('updateTransaction: ID is required');
      return false;
    }

    try {
      const existingTransaction = transactions.find(t => t.id === id);
      
      if (existingTransaction) {
        const source = [...cards, ...accounts].find(item => item.id === existingTransaction.sourceId);
        
        if (source) {
          const currentBalance = parseFloat(source.balance) || 0;
          const oldAmount = parseFloat(existingTransaction.amount) || 0;
          const newAmount = parseFloat(updates.amount) || oldAmount;
          const oldType = existingTransaction.type;
          const newType = updates.type || oldType;
          
          let balanceAdjustment = 0;

          if (oldType === 'expense' && newType === 'expense') {
            balanceAdjustment = oldAmount - newAmount;
          } else if (oldType === 'income' && newType === 'income') {
            balanceAdjustment = newAmount - oldAmount;
          } else if (oldType === 'expense' && newType === 'income') {
            balanceAdjustment = oldAmount + newAmount;
          } else if (oldType === 'income' && newType === 'expense') {
            balanceAdjustment = -(oldAmount + newAmount);
          }

          const newBalance = currentBalance + balanceAdjustment;

          if ('cardType' in source) {
            await handleAction("card", "update", {
              id: source.id,
              updates: { balance: newBalance }
            });
          } else {
            await handleAction("account", "update", {
              id: source.id,
              updates: { balance: newBalance }
            });
          }
        }
      }

      await handleAction("transaction", "update", { id, updates });
      return true;
    } catch (error) {
      console.error('Errore in updateTransaction:', error);
      return false;
    }
  };
  const deleteTransaction = async (id: string): Promise<boolean> => {
    if (!id) {
      console.error('deleteTransaction: ID is required');
      return false;
    }

    try {
      const transactionToDelete = transactions.find(t => t.id === id);
      
      if (transactionToDelete) {
        const source = [...cards, ...accounts].find(item => item.id === transactionToDelete.sourceId);
        
        if (source) {
          const currentBalance = parseFloat(source.balance) || 0;
          const transactionAmount = parseFloat(transactionToDelete.amount) || 0;
          let newBalance = currentBalance;

          if (transactionToDelete.type === 'expense') {
            newBalance = currentBalance + transactionAmount;
          } else if (transactionToDelete.type === 'income') {
            newBalance = currentBalance - transactionAmount;
          }

          if ('cardType' in source) {
            await handleAction("card", "update", {
              id: source.id,
              updates: { balance: newBalance }
            });
          } else {
            await handleAction("account", "update", {
              id: source.id,
              updates: { balance: newBalance }
            });
          }
        }
      }

      await handleAction("transaction", "delete", { id });
      return true;
    } catch (error) {
      console.error('Errore in deleteTransaction:', error);
      return false;
    }
  };
  

  const addBudget = async (budget: any): Promise<boolean> => {
    await handleAction("budget", "add", {
      ...budget,
      id: "temp_" + Date.now(),
    });
    return true;
  };
  const updateBudget = async (id: string, updates: any): Promise<boolean> => {
    if (!id) {
      console.error('updateBudget: ID is required');
      return false;
    }
    await handleAction("budget", "update", { id, updates });
    return true;
  };
  const deleteBudget = async (id: string): Promise<boolean> => {
    if (!id) {
      console.error('deleteBudget: ID is required');
      return false;
    }
    await handleAction("budget", "delete", { id });
    return true;
  };

  const setBudgetForCategory = async (
    category: string,
    limit: number
  ): Promise<boolean> => {
    try {
      const existingBudget = Array.isArray(budgets)
        ? budgets.find((b: any) => b.category === category)
        : null;

      if (existingBudget && existingBudget.id) {
        await handleAction("budget", "update", {
          id: existingBudget.id,
          updates: { limit, updatedAt: new Date().toISOString() },
        });
      } else {
        await handleAction("budget", "add", {
          category,
          limit,
          id: "temp_" + Date.now() + "_" + category,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const removeBudget = async (category: string): Promise<boolean> => {
    try {
      const budgetToRemove = Array.isArray(budgets)
        ? budgets.find((b: any) => b.category === category)
        : null;
      if (budgetToRemove && budgetToRemove.id) {
        await handleAction("budget", "delete", { id: budgetToRemove.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const getExpensesByCategory = () => {
    const result: { [category: string]: number } = {};
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    safeTransactions.forEach((t: any) => {
      if (t.type === "expense" && t.category) {
        result[t.category] =
          (result[t.category] || 0) + (parseFloat(t.amount) || 0);
      }
    });
    return result;
  };

  const getMonthlyExpenses = () => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    if (safeTransactions.length === 0) return 0;
    const now = new Date();
    const filteredTransactions = safeTransactions.filter((t: any) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
    return filteredTransactions.length > 0
      ? filteredTransactions.reduce(
          (sum: number, t: any) => sum + (parseFloat(t.amount) || 0),
          0
        )
      : 0;
  };

  const getTotalBalance = () => {
    const safeCards = Array.isArray(cards) ? cards : [];
    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const cardsBalance =
      safeCards.length > 0
        ? safeCards.reduce(
            (sum: number, c: any) => sum + (parseFloat(c.balance) || 0),
            0
          )
        : 0;
    const accountsBalance =
      safeAccounts.length > 0
        ? safeAccounts.reduce(
            (sum: number, a: any) => sum + (parseFloat(a.balance) || 0),
            0
          )
        : 0;

    return cardsBalance + accountsBalance;
  };

  const getMonthlyIncome = () => {
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    if (safeTransactions.length === 0) return 0;
    const now = new Date();
    const filteredTransactions = safeTransactions.filter((t: any) => {
      const d = new Date(t.date);
      return (
        t.type === "income" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
    return filteredTransactions.length > 0
      ? filteredTransactions.reduce(
          (sum: number, t: any) => sum + (parseFloat(t.amount) || 0),
          0
        )
      : 0;
  };



  const clearAllData = async () => {
    setCards([]);
    setAccounts([]);
    setTransactions([]);
    setBudgetsState([]);
    setDataLoaded(false);
    setLastSync(null);
    setHasOfflineData(false);
    
    if (userEmail && userEmail !== "guest") {
      await indexedDBService.clearOfflineData(userEmail);
    }
  };

  const reloadOfflineData = useCallback(async () => {
    console.log('Ricaricamento forzato dati offline per:', userEmail);
    setDataLoaded(false);
    setIsLoading(true);
    
    try {
      await loadOfflineData(userEmail);
    } catch (error) {
      console.error('Errore nel ricaricamento dati offline:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);


  const reloadSnapshot = useCallback(async () => {
    if (!userEmail || userEmail === "guest") {
      console.log('Impossibile ricaricare snapshot: utente non valido');
      return;
    }

    console.log('Ricaricamento snapshot per:', userEmail);
    setIsLoading(true);
    
    try {
      const data = await indexedDBService.getOfflineData(userEmail);
      if (data) {
        const deduplicatedTransactions = deduplicateTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setCards(Array.isArray(data.cards) ? data.cards : []);
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
        setTransactions(deduplicatedTransactions);
        setBudgetsState(Array.isArray(data.budgets) ? data.budgets : []);
        setLastSync(data.lastSync);
        setHasOfflineData(true);
        setDataLoaded(true);
        console.log('Snapshot ricaricato con successo');
      } else {
        console.log('Nessun snapshot trovato per:', userEmail);
      }
    } catch (error) {
      console.error('Errore nel ricaricamento snapshot:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (isOffline) {
      if (snapshotTimeout.current) {
        clearTimeout(snapshotTimeout.current);
      }
      snapshotTimeout.current = setTimeout(() => {
        saveSnapshot(cards, accounts, transactions, budgets, new Date(), userEmail);
      }, 100);
    }
  }, [cards, accounts, transactions, budgets, isOffline]);

  return {
    cards,
    accounts,
    transactions,
    budgets,
    isOffline,
    isLoading,
    lastSync,
    hasOfflineData,
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
    setBudgetForCategory,
    removeBudget,
    getExpensesByCategory,
    getMonthlyExpenses,
    getTotalBalance,
    getMonthlyIncome,
    reloadOfflineData,
    clearAllData,
    reloadSnapshot,
  };
}
