import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/firebase";
import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import { StatsCard } from "@/components/ui/stats-card";
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { AddCardModal, CardData } from "@/components/modal/add-card-modal";
import {
  AddAccountModal,
  AccountData,
} from "@/components/modal/add-account-modal";
import {
  AddTransactionModal,
  TransactionData,
} from "@/components/modal/add-transaction-modal";
import { ConfirmBudgetRemovalModal } from "@/components/modal/confirm-budget-removal-modal";
import { CardItem } from "@/components/ui/card-item";
import { AccountItem } from "@/components/ui/account-item";
import { TransactionItem } from "@/components/ui/transaction-item";
import { ExpenseCategoryCard } from "@/components/ui/expense-category-card";
import { BudgetCategoryCard } from "@/components/ui/budget-category-card";
import { FilterBar, FilterOption } from "@/components/ui/filter-bar";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { OfflineDataBanner } from "@/components/ui/offline-data-banner";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { NoCardorAccounts } from "@/components/complex/NoCardorAccounts";

import {
  Wallet,
  CreditCard,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Target,
  Eye,
  EyeOff,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
  Heart,
  Settings,
  PlusIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RecentTransactions } from "@/components/complex/Transactions";
import {
  createFilters,
  getFilteredItems,
  hasCardsOrAccounts as checkHasCardsOrAccounts,
  type ConfirmRemovalModalState,
  getActiveBudgets,
  createModalCloseHandlers,
} from "@/utils/dashboardUtils";
import { createDashboardHandlers, type ConfirmModalState } from "@/utils/dashboardHandlers";

import { DashboardSkeleton } from '@/components/ui/skeleton';
import {Card, Transaction, Account, Budget} from '@/types/finance'
import { SetBudgetModal } from "@/components/modal/set-budget-modal";

export const Dashboard = () => {
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    cards = [],
    accounts = [],
    transactions = [],
    budgets = [],
    addCard,
    addAccount,
    addTransaction,
    deleteCard: removeCard,
    deleteAccount: removeAccount,
    deleteTransaction: removeTransaction,
    getTotalBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    updateCard,
    updateAccount,
    setBudgetForCategory,
    removeBudget,
    getExpensesByCategory,
    isLoading,
    isOffline,
    lastSync,
    hasOfflineData,
    reloadOfflineData,
  } = useFinanceDataContext() || {};
  const [showBalance, setShowBalance] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [confirmRemovalModal, setConfirmRemovalModal] = useState<ConfirmRemovalModalState>({
    isOpen: false,
    category: '',
    categoryName: '',
    budgetAmount: 0
  });
  const [isSetBudgetModalOpen, setIsSetBudgetModalOpen] = useState(false);
  
  // Stato per il carosello delle stats card
  const [currentStatsIndex, setCurrentStatsIndex] = useState(0);
  const [showStatsNavigation, setShowStatsNavigation] = useState(false);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Controlla se le stats card necessitano di navigazione
  useEffect(() => {
    const checkStatsContainer = () => {
      if (statsContainerRef.current) {
        const containerWidth = statsContainerRef.current.offsetWidth;
        const contentWidth = statsContainerRef.current.scrollWidth;
        setShowStatsNavigation(contentWidth > containerWidth);
      }
    };

    checkStatsContainer();
    window.addEventListener('resize', checkStatsContainer);
    
    return () => {
      window.removeEventListener('resize', checkStatsContainer);
    };
  }, [cards, accounts]);

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setIsAddCardModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsAddAccountModalOpen(true);
  };
  
  const hasCardsOrAccounts = checkHasCardsOrAccounts(cards, accounts);

  const {
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
  } = createDashboardHandlers(
    setIsAddAccountModalOpen,
    setIsAddCardModalOpen,
    setIsAddTransactionModalOpen,
    setConfirmRemovalModal,
    setConfirmModal,
    selectedCard,
    selectedAccount,
    setSelectedCard,
    setSelectedAccount,
    addCard,
    addAccount,
    addTransaction,
    updateCard,
    updateAccount,
    removeCard,
    removeAccount,
    removeTransaction,
    setBudgetForCategory,
    removeBudget,
    cards,
    accounts,
    transactions,
    budgets,
    confirmRemovalModal
  );

  const totalBalance = getTotalBalance();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();

  const filters = createFilters(cards, accounts);
  const { filteredCards, filteredAccounts } = getFilteredItems(cards, accounts, activeFilter);

  const totalAccounts = cards.length + accounts.length;
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const incomeTransactions = transactions.filter((t) => t.type === "income");
  const hasExpenses = transactions.some(t => t.type === 'expense');

  const modalCloseHandlers = createModalCloseHandlers(
    setIsAddCardModalOpen,
    setIsAddAccountModalOpen,
    setIsAddTransactionModalOpen,
    setSelectedCard,
    setSelectedAccount
  );

  const handleSetAllBudgets = async (budgetData: { [key: string]: number }) => {
    try {
      for (const [category, amount] of Object.entries(budgetData)) {
        if (amount > 0) {
          await setBudgetForCategory(category, amount);
        }
      }
    } catch (error) {
      console.error('Error setting budgets:', error);
    }
  };

  const handleRemoveAllBudgets = async () => {
    try {
      for (const budget of budgets) {
        if (budget.limit > 0) {
          await removeBudget(budget.category);
        }
      }
    } catch (error) {
      console.error('Error removing all budgets:', error);
    }
  };

  // Funzioni per navigare le stats card
  const nextStats = () => {
    if (statsContainerRef.current) {
      const containerWidth = statsContainerRef.current.offsetWidth;
      const scrollPosition = statsContainerRef.current.scrollLeft;
      const newPosition = scrollPosition + containerWidth * 0.8;
      
      statsContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setCurrentStatsIndex(prev => Math.min(prev + 2, 3));
    }
  };

  const prevStats = () => {
    if (statsContainerRef.current) {
      const containerWidth = statsContainerRef.current.offsetWidth;
      const scrollPosition = statsContainerRef.current.scrollLeft;
      const newPosition = scrollPosition - containerWidth * 0.8;
      
      statsContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setCurrentStatsIndex(prev => Math.max(prev - 2, 0));
    }
  };

  // Calcola gli indicatori di navigazione
  const statsIndicators = Array.from({ length: 2 }, (_, i) => i);
  const isFirstStatsPage = currentStatsIndex === 0;
  const isLastStatsPage = currentStatsIndex >= 2;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!hasCardsOrAccounts) {
    return <NoCardorAccounts />;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Benvenuto, {user?.name}! 
              </h1>
              <p className="text-white/70 text-lg">
                Ecco una panoramica delle tue finanze di oggi
              </p>
            </div>
            <div className="flex items-center space-x-3">
              
              <motion.button
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showBalance ? (
                  <Eye className="h-5 w-5 text-white" />
                ) : (
                  <EyeOff className="h-5 w-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <OfflineDataBanner
          isOffline={isOffline}
          lastSync={lastSync}
          hasOfflineData={hasOfflineData}
          onRefresh={reloadOfflineData}
        />

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Navigazione stats card */}
          {showStatsNavigation && (
            <>
              <button
                onClick={prevStats}
                disabled={isFirstStatsPage}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full transition-opacity ${
                  isFirstStatsPage ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/30'
                }`}
                style={{ transform: 'translateY(-50%) translateX(-50%)' }}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              
              <button
                onClick={nextStats}
                disabled={isLastStatsPage}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full transition-opacity ${
                  isLastStatsPage ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white/30'
                }`}
                style={{ transform: 'translateY(-50%) translateX(50%)' }}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </>
          )}

          {/* Container scrollabile per stats card */}
          <div 
            ref={statsContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex-none w-full sm:w-auto snap-center">
              <StatsCard
                title="Saldo Totale"
                value={showBalance ? `€${totalBalance.toFixed(2)}` : "€••••••"}
                change={`${totalAccounts} conti collegati`}
                changeType="increase"
                icon={Wallet}
                color="blue"
                className="min-w-[280px]"
              />
            </div>
            <div className="flex-none w-full sm:w-auto snap-center">
              <StatsCard
                title="Spese Mensili"
                value={showBalance ? `€${monthlyExpenses.toFixed(2)}` : "€••••••"}
                change={`${expenseTransactions.length} transazioni`}
                changeType="decrease"
                icon={TrendingDown}
                color="red"
                className="min-w-[280px]"
              />
            </div>
            <div className="flex-none w-full sm:w-auto snap-center">
              <StatsCard
                title="Entrate Mensili"
                value={showBalance ? `€${monthlyIncome.toFixed(2)}` : "€••••••"}
                change={`${incomeTransactions.length} entrate`}
                changeType="increase"
                icon={PiggyBank}
                color="green"
                className="min-w-[280px]"
              />
            </div>
            <div className="flex-none w-full sm:w-auto snap-center">
              <StatsCard
                title="Transazioni"
                value={transactions.length.toString()}
                change="Totali registrate"
                changeType="increase"
                icon={Target}
                color="yellow"
                className="min-w-[280px]"
              />
            </div>
          </div>

          {/* Indicatori di navigazione */}
          {showStatsNavigation && (
            <div className="flex justify-center space-x-2 mt-4">
              {statsIndicators.map((index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === Math.floor(currentStatsIndex / 2)
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/30'
                  }`}
                  onClick={() => {
                    if (statsContainerRef.current) {
                      const containerWidth = statsContainerRef.current.offsetWidth;
                      statsContainerRef.current.scrollTo({
                        left: index * containerWidth * 1.6,
                        behavior: 'smooth'
                      });
                      setCurrentStatsIndex(index * 2);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Azioni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Collega Conto"
              description="Aggiungi un nuovo conto bancario"
              icon={Wallet}
              onClick={handleAddAccount}
              color="blue"
            />
            <QuickActionCard
              title="Aggiungi Carta"
              description="Collega una nuova carta di credito"
              icon={CreditCard}
              onClick={handleAddCard}
              color="green"
            />
            <QuickActionCard
              title="Nuova Transazione"
              description="Registra una spesa o entrata"
              icon={Plus}
              onClick={handleAddTransaction}
              color="purple"
            />
          </div>
        </motion.div>

        {(cards.length > 0 || accounts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              I Tuoi Conti e Carte
            </h2>

            <FilterBar
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {filteredCards.length > 0 || filteredAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onDelete={handleDeleteCard}
                    onEdit={handleEditCard}
                  />
                ))}
                {filteredAccounts.map((account) => (
                  <AccountItem
                    key={account.id}
                    account={account}
                    onDelete={handleDeleteAccount}
                    onEdit={handleEditAccount}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-white/40 mb-4">
                  <Wallet className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg">Nessun elemento trovato</p>
                  <p className="text-sm">
                    Prova a cambiare il filtro o aggiungi nuovi conti/carte
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}


        {budgets.length > 0 && budgets.some(budget => budget.limit > 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">I Tuoi Budget</h2>
              <Button
                onClick={() => navigate('/budgets')}
                variant="secondary"
                size="md"
                className="flex items-center space-x-2 bg-white/10 border border-blue-400 text-blue-400 px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium shadow-sm hover:bg-white/20 hover:border-blue-500 w-full sm:w-auto text-sm sm:text-base"
              >
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Gestisci Budget</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const expensesByCategory = getExpensesByCategory();
                const activeBudgets = getActiveBudgets(budgets, expensesByCategory);
                const iconMap = { ShoppingCart, Car, Home, Coffee, Gamepad2, Heart };

                return activeBudgets.map((category, index) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                  return (
                    <motion.div
                      key={category.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <BudgetCategoryCard
                        title={category.label}
                        amount={category.amount}
                        budget={category.budget}
                        icon={IconComponent}
                        color={category.color}
                        categoryKey={category.value}
                        onSetBudget={(cat, amount) => setBudgetForCategory(cat, amount)}
                        onRemoveBudget={handleRemoveBudget}
                      />
                    </motion.div>
                  );
                });
              })()}
            </div>
          </motion.div>
        ) : (
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-sm border-2 border-dashed border-white/20 hover:border-white/30 rounded-xl p-8 text-center transition-all duration-300">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="h-8 w-8 text-green-400" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                Inizia a gestire i tuoi budget
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                {hasExpenses 
                  ? "Hai delle spese registrate! Imposta dei limiti di spesa per le tue categorie e tieni sotto controllo le tue finanze"
                  : "Imposta dei limiti di spesa per le tue categorie e preparati a tenere sotto controllo le tue finanze"
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <motion.button
                  onClick={() => setIsSetBudgetModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target className="h-5 w-5" />
                  <span>Imposta tutti i budget</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        
        
        <RecentTransactions 
                    handleDeleteTransaction={handleDeleteTransaction}
                    handleAddTransaction={handleAddTransaction}
                    transactions={transactions}
                  />
      </div>

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={modalCloseHandlers.closeCardModal}
        onSubmit={handleCardSubmit}
        initialData={selectedCard}
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={modalCloseHandlers.closeAccountModal}
        onSubmit={handleAccountSubmit}
        initialData={selectedAccount}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={modalCloseHandlers.closeTransactionModal}
        onSubmit={handleTransactionSubmit}
        cards={cards}
        accounts={accounts}
      />

      <ConfirmBudgetRemovalModal
        isOpen={confirmRemovalModal.isOpen}
        onClose={() => setConfirmRemovalModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmRemoveBudget}
        categoryName={confirmRemovalModal.categoryName}
        budgetAmount={confirmRemovalModal.budgetAmount}
      />



      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Elimina"
        cancelText="Annulla"
        type="danger"
      />

      
      <SetBudgetModal
        isOpen={isSetBudgetModalOpen}
        onClose={() => setIsSetBudgetModalOpen(false)}
        onSubmit={handleSetAllBudgets}
        onRemoveAll={handleRemoveAllBudgets}
        currentBudgets={{}}
      />
    </div>
  );
};
