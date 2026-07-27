 import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/firebase";
import { SidebarProvider } from "./contexts/SidebarContext";
import { FinanceDataProvider } from "./contexts/FinanceDataContext";
import { ErrorProvider } from './contexts/ErrorContext';

import { Sidebar } from "./components/complex/SideBar";
import { Dashboard } from "./pages/Dashboard";
import Budgets  from "./pages/Budgets";
import Transazioni  from "./pages/Transazioni";


import NotFound from "./pages/NotFound";
import LoginForm from "./pages/Login";
import { Landing } from "./pages/Landing";
import { DashboardSkeleton } from './components/ui/skeleton';

import { Trading } from "./pages/Trading";
import Profile from "./pages/Profile";
import React, { useEffect, useState } from "react";



const AppRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="h-screen bg-[#ffffff] overflow-hidden flex">
          <Sidebar />
          <div className="flex-1 h-full overflow-hidden z-10 mt-8 sm:mt-0">
            <main className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
              <DashboardSkeleton />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
        <Routes>
          
          <Route element={
            
            <div className="h-screen bg-[#ffffff] overflow-hidden flex">
              <Sidebar />
              <div className="flex-1 h-full overflow-hidden z-10 mt-8 sm:mt-0">
                <FinanceDataProvider>
                <main className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                  <Outlet />
                </main>
                </FinanceDataProvider>
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

    </SidebarProvider>
  );
};

const App = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;