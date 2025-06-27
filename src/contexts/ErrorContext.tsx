import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  error: React.ReactNode;
  setError: (err: React.ReactNode) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<React.ReactNode>('');
  const clearError = () => setError('');
  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used within ErrorProvider');
  return ctx;
}; 