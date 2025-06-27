import { Card, Account, Transaction, Budget, OfflineCard, OfflineAccount, OfflineTransaction } from '@/types/finance';

export interface OfflineData {
  cards: (Card | OfflineCard)[];
  accounts: (Account | OfflineAccount)[];
  transactions: (Transaction | OfflineTransaction)[];
  budgets: Budget[];
  lastSync: Date | null;
  pendingSync: boolean;
}

export type SyncOperation = {
  id?: number;
  type: 'ADD_CARD' | 'ADD_ACCOUNT' | 'ADD_TRANSACTION' | 'UPDATE_CARD' | 'UPDATE_ACCOUNT' | 'DELETE_CARD' | 'DELETE_ACCOUNT' | 'DELETE_TRANSACTION' | 'UPDATE_TRANSACTION' |'ADD_BUDGET' | 'UPDATE_BUDGET' | 'DELETE_BUDGET';
  data: any;
  userEmail: string;
  timestamp: Date;
};

class IndexedDBService {
  private dbName = 'FinanceLowDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Errore apertura IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB inizializzato');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        
        
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'userEmail' });
          console.log('Store offlineData creato');
        }

        
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
          console.log('Store syncQueue creato');
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }


  

  async saveOfflineData(userEmail: string, data: OfflineData): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      const dataToSave = {
        userEmail,
        ...data,
        lastUpdated: new Date()
      };

      const request = store.put(dataToSave);

      request.onsuccess = () => {
        console.log('Dati offline salvati per:', userEmail);
        resolve();
      };

      request.onerror = () => {
        console.error('Errore salvataggio dati offline:', request.error);
        reject(request.error);
      };
    });
  }

  async getOfflineData(userEmail: string): Promise<OfflineData | null> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const request = store.get(userEmail);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log('Dati offline caricati per:', userEmail);
          resolve({
            cards: result.cards || [],
            accounts: result.accounts || [],
            transactions: result.transactions || [],
            budgets: result.budgets || [],
            lastSync: result.lastSync || null,
            pendingSync: result.pendingSync || false
          });
        } else {
          console.log('Nessun dato offline trovato per:', userEmail);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Errore caricamento dati offline:', request.error);
        reject(request.error);
      };
    });
  }

  async clearUserData(userEmail: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      const request = store.delete(userEmail);
      
      request.onsuccess = () => {
        console.log('Dati offline cancellati per:', userEmail);
        resolve();
      };
      
      request.onerror = () => {
        console.error('Errore cancellazione dati offline:', request.error);
        reject(request.error);
      };
    });
  }


  

  async addToSyncQueue(operation: SyncOperation): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const request = store.add(operation);

      request.onsuccess = () => {
        console.log('Operazione aggiunta alla coda di sync:', operation.type);
        resolve();
      };

      request.onerror = () => {
        console.error(' Errore aggiunta alla coda di sync:', request.error);
        reject(request.error);
      };
    });
  }

  async getSyncQueue(userEmail: string): Promise<SyncOperation[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => {
        const allOperations = request.result || [];
        const userOperations = allOperations.filter(op => op.userEmail === userEmail);
        console.log(` ${userOperations.length} operazioni in coda per:`, userEmail);
        resolve(userOperations);
      };

      request.onerror = () => {
        console.error('Errore caricamento coda di sync:', request.error);
        reject(request.error);
      };
    });
  }

  async clearSyncQueue(userEmail: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => {
        const allOperations = request.result || [];
        const userOperations = allOperations.filter(op => op.userEmail === userEmail);
        
        
        
        const deletePromises = userOperations.map(op => {
          return new Promise<void>((deleteResolve, deleteReject) => {
            const deleteRequest = store.delete(op.id!);
            deleteRequest.onsuccess = () => deleteResolve();
            deleteRequest.onerror = () => deleteReject(deleteRequest.error);
          });
        });

        Promise.all(deletePromises)
          .then(() => {
            console.log('Coda di sync pulita per:', userEmail);
            resolve();
          })
          .catch(reject);
      };

      request.onerror = () => {
        console.error('Errore pulizia coda di sync:', request.error);
        reject(request.error);
      };
    });
  }


  

  async clearOfflineData(userEmail: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.delete(userEmail);

      request.onsuccess = () => {
        console.log('Dati offline eliminati per:', userEmail);
        resolve();
      };

      request.onerror = () => {
        console.error('Errore eliminazione dati offline:', request.error);
        reject(request.error);
      };
    });
  }

  async clearAllData(userEmail: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['offlineData', 'syncQueue'], 'readwrite');
      
      
      
      const offlineStore = transaction.objectStore('offlineData');
      const deleteOfflineRequest = offlineStore.delete(userEmail);
      
    
      
      this.clearSyncQueue(userEmail);

      deleteOfflineRequest.onsuccess = () => {
        console.log('Tutti i dati offline eliminati per:', userEmail);
        resolve();
      };

      deleteOfflineRequest.onerror = () => {
        console.error('Errore eliminazione dati offline:', deleteOfflineRequest.error);
        reject(deleteOfflineRequest.error);
      };
    });
  }

  async setPendingSync(userEmail: string, pending: boolean): Promise<void> {
    const currentData = await this.getOfflineData(userEmail);
    if (currentData) {
      currentData.pendingSync = pending;
      await this.saveOfflineData(userEmail, currentData);
    }
  }
}



export const indexedDBService = new IndexedDBService();



indexedDBService.init().catch(console.error);

export default indexedDBService;