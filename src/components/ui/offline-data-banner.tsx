import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Clock, RefreshCw, Database } from 'lucide-react';

interface OfflineDataBannerProps {
  isOffline: boolean;
  lastSync: Date | null;
  hasOfflineData: boolean;
  onRefresh?: () => void;
  onReloadSnapshot?: () => void;
  className?: string;
}

export const OfflineDataBanner: React.FC<OfflineDataBannerProps> = ({
  isOffline,
  lastSync,
  hasOfflineData,
  onRefresh,
  onReloadSnapshot,
  className = ""
}) => {
  if (!isOffline || !hasOfflineData) return null;

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Appena sincronizzato';
    if (diffMins < 60) return `${diffMins} minuti fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;
    return `${diffDays} giorni fa`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <WifiOff className="w-5 h-5 text-amber-500 mt-0.5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-amber-200">
              Modalità Offline - Dati Locali
            </h3>
          </div>
          
          <p className="text-sm text-amber-100/80 mb-2">
            Stai visualizzando i dati salvati localmente. Alcune funzionalità potrebbero non essere disponibili.
          </p>
          
          {lastSync && (
            <div className="flex items-center gap-2 text-xs text-amber-200/70">
              <Clock className="w-3 h-3" />
              <span>Ultima sincronizzazione: {formatLastSync(lastSync)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex gap-2">
          {onReloadSnapshot && (
            <button
              onClick={onReloadSnapshot}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors"
              title="Ricarica snapshot dati"
            >
              <Database className="w-4 h-4 text-amber-400" />
            </button>
          )}
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors"
              title="Riprova sincronizzazione"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


export const OfflineDataIndicator: React.FC<{
  isOffline: boolean;
  className?: string;
}> = ({ isOffline, className = "" }) => {
  if (!isOffline) return null;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-200 text-xs rounded-full ${className}`}>
      <WifiOff className="w-3 h-3" />
      <span>Offline</span>
    </div>
  );
};