import { 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Timestamp,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '@/lib/firebase';


export interface FirestoreCard {
  id: string;
  name: string;
  balance: string;
  type: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreAccount {
  id: string;
  name: string;
  balance: string;
  bank: string;
  type: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreTransaction {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  sourceId: string;
  sourceType: 'card' | 'account';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreBudgets {
  [category: string]: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirestoreService {
  private static sanitizeEmail(email: string): string {
    return email.replace(/[.#$[\]]/g, '_');
  }

  private static getUserDocRef(userEmail: string) {
    return doc(db, 'users', this.sanitizeEmail(userEmail));
  }

  private static getUserCollectionRef(userEmail: string, collectionName: string) {
    return collection(db, 'users', this.sanitizeEmail(userEmail), collectionName);
  }

  
  static async createUserProfile(userEmail: string, profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const userRef = this.getUserDocRef(userEmail);
      const profileRef = doc(userRef, 'profile', 'data');
      
      await setDoc(profileRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Profilo utente creato con successo per:', userEmail);
    } catch (error) {
      console.error('Errore nella creazione del profilo:', error);
      throw error;
    }
  }

  static async getUserProfile(userEmail: string): Promise<UserProfile | null> {
    try {
      const profileRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Errore nel recupero del profilo:', error);
      throw error;
    }
  }

  
  static async saveCard(userEmail: string, card: Omit<FirestoreCard, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const cardRef = doc(this.getUserCollectionRef(userEmail, 'cards'), card.id);
      await setDoc(cardRef, {
        ...card,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Carta salvata su Firestore per', userEmail, ':', card.id);
    } catch (error) {
      console.error('Errore nel salvare la carta:', error);
      throw error;
    }
  }

  static async updateCard(userEmail: string, cardId: string, updates: Partial<Omit<FirestoreCard, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const cardRef = doc(this.getUserCollectionRef(userEmail, 'cards'), cardId);
      await updateDoc(cardRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Carta aggiornata su Firestore per', userEmail, ':', cardId);
    } catch (error) {
      console.error('Errore nell\'aggiornare la carta:', error);
      throw error;
    }
  }

  static async deleteCard(userEmail: string, cardId: string): Promise<void> {
    try {
      const cardRef = doc(this.getUserCollectionRef(userEmail, 'cards'), cardId);
      await deleteDoc(cardRef);
      
      console.log('Carta eliminata da Firestore per', userEmail, ':', cardId);
    } catch (error) {
      console.error('Errore nell\'eliminare la carta:', error);
      throw error;
    }
  }

  static async getUserCards(userEmail: string): Promise<FirestoreCard[]> {
    try {
      const cardsRef = this.getUserCollectionRef(userEmail, 'cards');
      const cardsSnap = await getDocs(query(cardsRef, orderBy('createdAt', 'desc')));
      
      return cardsSnap.docs.map(doc => doc.data() as FirestoreCard);
    } catch (error) {
      console.error('Errore nel recuperare le carte:', error);
      throw error;
    }
  }

  
  static async saveAccount(userEmail: string, account: Omit<FirestoreAccount, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const accountRef = doc(this.getUserCollectionRef(userEmail, 'accounts'), account.id);
      await setDoc(accountRef, {
        ...account,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Conto salvato su Firestore per', userEmail, ':', account.id);
    } catch (error) {
      console.error('Errore nel salvare il conto:', error);
      throw error;
    }
  }

  static async updateAccount(userEmail: string, accountId: string, updates: Partial<Omit<FirestoreAccount, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const accountRef = doc(this.getUserCollectionRef(userEmail, 'accounts'), accountId);
      await updateDoc(accountRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Conto aggiornato su Firestore per', userEmail, ':', accountId);
    } catch (error) {
      console.error('Errore nell\'aggiornare il conto:', error);
      throw error;
    }
  }

  static async deleteAccount(userEmail: string, accountId: string): Promise<void> {
    try {
      const accountRef = doc(this.getUserCollectionRef(userEmail, 'accounts'), accountId);
      await deleteDoc(accountRef);
      
      console.log('Conto eliminato da Firestore per', userEmail, ':', accountId);
    } catch (error) {
      console.error('Errore nell\'eliminare il conto:', error);
      throw error;
    }
  }

  static async getUserAccounts(userEmail: string): Promise<FirestoreAccount[]> {
    try {
      const accountsRef = this.getUserCollectionRef(userEmail, 'accounts');
      const accountsSnap = await getDocs(query(accountsRef, orderBy('createdAt', 'desc')));
      
      return accountsSnap.docs.map(doc => doc.data() as FirestoreAccount);
    } catch (error) {
      console.error('Errore nel recuperare i conti:', error);
      throw error;
    }
  }

  
  static async saveTransaction(userEmail: string, transaction: Omit<FirestoreTransaction, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const transactionRef = doc(this.getUserCollectionRef(userEmail, 'transactions'), transaction.id);
      await setDoc(transactionRef, {
        ...transaction,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Transazione salvata su Firestore per', userEmail, ':', transaction.id);
    } catch (error) {
      console.error('Errore nel salvare la transazione:', error);
      throw error;
    }
  }

  static async updateTransaction(userEmail: string, transactionId: string, updates: Partial<Omit<FirestoreTransaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const transactionRef = doc(this.getUserCollectionRef(userEmail, 'transactions'), transactionId);
      await updateDoc(transactionRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Transazione aggiornata su Firestore per', userEmail, ':', transactionId);
    } catch (error) {
      console.error('Errore nell\'aggiornare la transazione:', error);
      throw error;
    }
  }

  static async deleteTransaction(userEmail: string, transactionId: string): Promise<void> {
    try {
      console.log('FirestoreService: Eliminando transazione', transactionId, 'per utente', userEmail);
      const transactionRef = doc(this.getUserCollectionRef(userEmail, 'transactions'), transactionId);
      console.log('Riferimento documento:', transactionRef.path);
      
      await deleteDoc(transactionRef);
      
      console.log('Transazione eliminata da Firestore per', userEmail, ':', transactionId);
    } catch (error) {
      console.error('Errore nell\'eliminare la transazione:', error);
      throw error;
    }
  }

  static async getUserTransactions(userEmail: string): Promise<FirestoreTransaction[]> {
    try {
      const transactionsRef = this.getUserCollectionRef(userEmail, 'transactions');
      const transactionsSnap = await getDocs(query(transactionsRef, orderBy('date', 'desc')));
      
      return transactionsSnap.docs.map(doc => doc.data() as FirestoreTransaction);
    } catch (error) {
      console.error('Errore nel recuperare le transazioni:', error);
      throw error;
    }
  }

  
  static async saveBudgets(userEmail: string, budgets: FirestoreBudgets): Promise<void> {
    try {
      const budgetsRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'budgets', 'data');
      
      const existingBudgetsSnap = await getDoc(budgetsRef);
      const existingBudgets = existingBudgetsSnap.exists() ? existingBudgetsSnap.data() : {};
      
      const mergedBudgets = {
        ...existingBudgets,
        ...budgets,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(budgetsRef, mergedBudgets);
      
      console.log('Budget salvati su Firestore per', userEmail);
    } catch (error) {
      console.error('Errore nel salvare i budget:', error);
      throw error;
    }
  }

  static async getUserBudgets(userEmail: string): Promise<FirestoreBudgets> {
    try {
      const budgetsRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'budgets', 'data');
      const budgetsSnap = await getDoc(budgetsRef);
      
      if (budgetsSnap.exists()) {
        const data = budgetsSnap.data();
        const { updatedAt, ...budgets } = data;
        return budgets as FirestoreBudgets;
      }
      return {};
    } catch (error) {
      console.error('Errore nel recuperare i budget:', error);
      throw error;
    }
  }

  static async removeBudget(userEmail: string, category: string): Promise<void> {
    try {
      const budgetsRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'budgets', 'data');
      
      const existingBudgetsSnap = await getDoc(budgetsRef);
      if (!existingBudgetsSnap.exists()) {
        console.log('Nessun budget trovato per l\'utente');
        return;
      }
      
      const existingBudgets = existingBudgetsSnap.data();
      
      const { [category]: removed, updatedAt, ...remainingBudgets } = existingBudgets;
      
      await setDoc(budgetsRef, {
        ...remainingBudgets,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Budget per categoria '${category}' rimosso per`, userEmail);
    } catch (error) {
      console.error('Errore nella rimozione del budget:', error);
      throw error;
    }
  }

  
  static subscribeToUserCards(userEmail: string, callback: (cards: FirestoreCard[]) => void): () => void {
    const cardsRef = this.getUserCollectionRef(userEmail, 'cards');
    const q = query(cardsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map(doc => doc.data() as FirestoreCard);
      callback(cards);
    }, (error) => {
      console.error('Errore nel listener delle carte:', error);
    });
  }

  static subscribeToUserAccounts(userEmail: string, callback: (accounts: FirestoreAccount[]) => void): () => void {
    const accountsRef = this.getUserCollectionRef(userEmail, 'accounts');
    const q = query(accountsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const accounts = snapshot.docs.map(doc => doc.data() as FirestoreAccount);
      callback(accounts);
    }, (error) => {
      console.error('Errore nel listener dei conti:', error);
    });
  }

  static subscribeToUserTransactions(userEmail: string, callback: (transactions: FirestoreTransaction[]) => void): () => void {
    const transactionsRef = this.getUserCollectionRef(userEmail, 'transactions');
    const q = query(transactionsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => doc.data() as FirestoreTransaction);
      callback(transactions);
    }, (error) => {
      console.error('Errore nel listener delle transazioni:', error);
    });
  }

  static subscribeToUserBudgets(userEmail: string, callback: (budgets: FirestoreBudgets) => void): () => void {
    const budgetsRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'budgets', 'data');
    
    return onSnapshot(budgetsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const { updatedAt, ...budgets } = data;
        callback(budgets as FirestoreBudgets);
      } else {
        callback({});
      }
    }, (error) => {
      console.error('Errore nel listener dei budget:', error);
    });
  }

  
  static async clearAllUserData(userEmail: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      const collections = ['cards', 'accounts', 'transactions'];
      
      for (const collectionName of collections) {
        const collectionRef = this.getUserCollectionRef(userEmail, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
      }
      
      const budgetsRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'budgets', 'data');
      const profileRef = doc(db, 'users', this.sanitizeEmail(userEmail), 'profile', 'data');
      
      batch.delete(budgetsRef);
      batch.delete(profileRef);
      
      await batch.commit();
      console.log('Tutti i dati utente eliminati da Firestore per', userEmail);
    } catch (error) {
      console.error('Errore nell\'eliminare i dati utente:', error);
      throw error;
    }
  }

  
  static async enableOfflineSupport(): Promise<void> {
    try {
      await enableNetwork(db);
      console.log('Supporto offline abilitato');
    } catch (error) {
      console.error('Errore nell\'abilitare il supporto offline:', error);
    }
  }

  static async disableOfflineSupport(): Promise<void> {
    try {
      await disableNetwork(db);
      console.log('Supporto offline disabilitato');
    } catch (error) {
      console.error('Errore nel disabilitare il supporto offline:', error);
    }
  }
}

export const convertFirestoreTimestamp = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};


if (process.env.NODE_ENV === 'development') {
  (window as any).FirestoreService = FirestoreService;
}