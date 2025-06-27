import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/firebase";
import { SidebarProvider } from "./contexts/SidebarContext";
import { FinanceDataProvider } from "./contexts/FinanceDataContext";
import { ErrorProvider } from './contexts/ErrorContext';
import PushSubscriptionManager from './components/PushSubscriptionManager';

import { Sidebar } from "./components/complex/SideBar";
import { Dashboard } from "./pages/Dashboard";
import Budgets  from "./pages/Budgets";
import Transazioni  from "./pages/Transazioni";


import NotFound from "./pages/NotFound";
import LoginForm from "./pages/Login";
import { LoadingScreen } from './components/ui/loadingscreen';


import { Trading } from "./pages/Trading";
import Profile from "./pages/Profile";
import { useFinanceDataContext } from "@/contexts/FinanceDataContext";
import React, { useEffect, useState } from "react";

function DataSyncer() {
  const location = useLocation();
  const { isOffline, reloadOfflineData } = useFinanceDataContext();
  useEffect(() => {
    if (isOffline) {
      reloadOfflineData();
    }
  }, [isOffline, location.pathname, reloadOfflineData]);
  return null;
}

function NotificationPermissionWatcher() {
  const [permission, setPermission] = useState(Notification.permission);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission !== permission) {
        setPermission(Notification.permission);
        setShowReload(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [permission]);

  if (!showReload) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-500 text-white p-4 text-center z-50">
      Le impostazioni delle notifiche sono cambiate. <b>Ricarica la pagina</b> per applicare le modifiche.
      <button
        className="ml-4 px-4 py-2 bg-white/20 rounded"
        onClick={() => window.location.reload()}
      >
        Ricarica ora
      </button>
    </div>
  );
}

const AppRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <FinanceDataProvider>
        <DataSyncer />
        <NotificationPermissionWatcher />
        <Routes>
          
          <Route element={
            <div className="h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 overflow-hidden flex">
              <Sidebar />
              <div className="flex-1 h-full overflow-hidden">
                <main className="h-full overflow-y-auto overflow-x-hidden">
                  <Outlet />
                </main>
              </div>
            </div>
          }>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/transazioni" element={<Transazioni />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FinanceDataProvider>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <PushSubscriptionManager />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;