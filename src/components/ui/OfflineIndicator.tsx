import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { isOnline, isOffline, wasOffline } = useOffline();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        >
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-red-400/30 flex items-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Modalità Offline</span>
          </div>
        </motion.div>
      )}
      
      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        >
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-green-400/30 flex items-center space-x-2">
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">Connessione Ripristinata</span>
            <RefreshCw className="h-3 w-3 animate-spin" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


interface OfflineWarningProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

export const OfflineWarning: React.FC<OfflineWarningProps> = ({ 
  show, 
  onClose, 
  message = "Questa funzionalità richiede una connessione internet." 
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-orange-400 mb-4">
              <WifiOff className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connessione Richiesta</h3>
            <p className="text-white/70 mb-6">{message}</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Ho Capito
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};