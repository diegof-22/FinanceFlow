import { Timestamp } from 'firebase/firestore';


export interface Card {
  id: string;
  cardName: string;
  balance: number;
  cardType: 'credit' | 'debit';
  color: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Account {
  id: string;
  bankName: string;
  accountName: string;
  balance: number;
  accountType: 'checking';
  color: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  sourceId: string;
  sourceType: 'card' | 'account';
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CardInput = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>;
export type AccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type BudgetInput = Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>;

export interface OfflineCard extends Omit<Card, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
  isOffline?: boolean;
}

export interface OfflineAccount extends Omit<Account, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
  isOffline?: boolean;
}

export interface OfflineTransaction extends Omit<Transaction, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
  isOffline?: boolean;
}


export interface CardData {
  cardName: string;
  balance: string;
  cardType: 'credit' | 'debit';
  color: string;
}

export interface AccountData {
  bankName: string;
  accountName: string;
  balance: string;
  accountType: 'checking';
  color: string;
}

export interface TransactionData {
  title: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  sourceId: string;
  sourceType: 'card' | 'account';
}

export interface BudgetData {
  [category: string]: number;
}

//Non usato

export const convertCardData = (cardData: CardData): CardInput => ({
  cardName: cardData.cardName,
  balance: parseFloat(cardData.balance) || 0,
  cardType: cardData.cardType,
  color: cardData.color
});

export const convertAccountData = (accountData: AccountData): AccountInput => ({
  bankName: accountData.bankName,
  accountName: accountData.accountName,
  balance: parseFloat(accountData.balance) || 0,
  accountType: accountData.accountType,
  color: accountData.color
});

export const convertTransactionData = (transactionData: TransactionData): TransactionInput => ({
  title: transactionData.title,
  amount: parseFloat(transactionData.amount) || 0,
  type: transactionData.type,
  category: transactionData.category,
  date: transactionData.date,
  description: transactionData.description,
  sourceId: transactionData.sourceId,
  sourceType: transactionData.sourceType
});


export const convertFirestoreCard = (firestoreCard: any): Card => ({
  id: firestoreCard.id,
  cardName: firestoreCard.name,
  balance: parseFloat(firestoreCard.balance) || 0,
  cardType: firestoreCard.type as 'credit' | 'debit',
  color: firestoreCard.color || '#3B82F6',
  createdAt: firestoreCard.createdAt || null,
  updatedAt: firestoreCard.updatedAt || null
});

export const convertFirestoreAccount = (firestoreAccount: any): Account => ({
  id: firestoreAccount.id,
  bankName: firestoreAccount.bank,
  accountName: firestoreAccount.name,
  balance: parseFloat(firestoreAccount.balance) || 0,
  accountType: 'checking' as const,
  color: firestoreAccount.color || '#3B82F6',
  createdAt: firestoreAccount.createdAt || null,
  updatedAt: firestoreAccount.updatedAt || null
});

export const convertFirestoreTransaction = (firestoreTransaction: any): Transaction => ({
  id: firestoreTransaction.id,
  title: firestoreTransaction.description || 'Transazione',
  amount: parseFloat(firestoreTransaction.amount) || 0,
  type: firestoreTransaction.type,
  category: firestoreTransaction.category,
  date: firestoreTransaction.date,
  description: firestoreTransaction.description,
  sourceId: firestoreTransaction.sourceId,
  sourceType: firestoreTransaction.sourceType,
  createdAt: firestoreTransaction.createdAt || null,
  updatedAt: firestoreTransaction.updatedAt || null
});


export const convertToFirestoreCard = (card: CardInput): any => ({
  id: Date.now().toString(),
  name: card.cardName,
  balance: card.balance.toString(),
  type: card.cardType,
  color: card.color
});

export const convertToFirestoreAccount = (account: AccountInput): any => ({
  id: Date.now().toString(),
  name: account.accountName,
  balance: account.balance.toString(),
  bank: account.bankName,
  type: account.accountType,
  color: account.color
});

export const convertToFirestoreTransaction = (transaction: TransactionInput): any => ({
  id: Date.now().toString(),
  amount: transaction.amount.toString(),
  type: transaction.type,
  category: transaction.category,
  description: transaction.title,
  date: transaction.date,
  sourceId: transaction.sourceId,
  sourceType: transaction.sourceType
});