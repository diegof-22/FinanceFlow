import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity,
  AlertCircle,
  Filter
} from 'lucide-react';

import {mockCryptoData, mockStockData, type StockData, type CryptoData} from '../services/mockData';

import { LoadingScreen } from '../components/ui/loadingscreen';
import { FilterBar, FilterOption } from '../components/ui/filter-bar';



export const Trading = () => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'stocks' | 'all'>('crypto');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [stockData] = useState<StockData[]>(mockStockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    setCryptoData(mockCryptoData);
    setError('Dati di esempio: le quotazioni sono statiche e non aggiornate in tempo reale.');
  }, []);


  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  
  const filteredCryptoData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStockData = stockData.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const tradingFilters: FilterOption[] = [
    {
      id: 'all',
      label: 'Tutti',
      icon: Filter,
      count: cryptoData.length + stockData.length,
    },
    {
      id: 'crypto',
      label: 'Crypto',
      icon: TrendingUp,
      count: cryptoData.length,
    },
    {
      id: 'stocks',
      label: 'Azioni',
      icon: BarChart3,
      count: stockData.length,
    },
  ];


  const AssetCard = ({ asset, type }: { asset: CryptoData | StockData, type: 'crypto' | 'stock' }) => {
    const isCrypto = type === 'crypto';
    const data = isCrypto ? (asset as CryptoData) : (asset as StockData);
    
    const name = isCrypto ? data.name : (data as StockData).name;
    const symbol = isCrypto ? data.symbol : (data as StockData).symbol;
    const price = isCrypto ? (data as CryptoData).quote.USD.price : (data as StockData).price;
    const change24h = isCrypto ? (data as CryptoData).quote.USD.percent_change_24h : (data as StockData).changePercent;
    const volume = isCrypto ? (data as CryptoData).quote.USD.volume_24h : (data as StockData).volume;
    const marketCap = isCrypto ? (data as CryptoData).quote.USD.market_cap : (data as StockData).marketCap;
    
    const isPositive = change24h > 0;

  
    const getCardColor = (symbol: string) => {
      const colors = [
        'bg-blue-500/20 border-blue-400/30',
        'bg-purple-500/20 border-purple-400/30',
        'bg-pink-500/20 border-pink-400/30',
        'bg-red-500/20 border-red-400/30',
        'bg-orange-500/20 border-orange-400/30',
        'bg-yellow-500/20 border-yellow-400/30',
        'bg-green-500/20 border-green-400/30',
        'bg-teal-500/20 border-teal-400/30',
        'bg-cyan-500/20 border-cyan-400/30',
        'bg-indigo-500/20 border-indigo-400/30',
      ];
      
      const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    const getIconColor = (symbol: string) => {
      const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-indigo-500',
      ];
      
      const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    const cardColor = getCardColor(symbol);
    const iconColor = getIconColor(symbol);

    return (
      <motion.div
        className={`${cardColor} backdrop-blur-xl border rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-left space-x-3">
            
            <div className={`w-32 h-14 ${iconColor} rounded-xl flex flex-col items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <span className="text-white font-bold text-lg leading-tight">{symbol}</span>
              <span className="text-white/80 font-medium text-sm leading-tight -mt-1 text-center max-w-[90px] truncate">{name}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-200/70 text-sm">Prezzo</span>
            <span className="text-white font-bold text-lg">{formatPrice(price)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-200/70 text-sm">24h</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-semibold">{Math.abs(change24h).toFixed(2)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-200/70 text-sm">Volume</span>
            <span className="text-white font-medium">{formatVolume(volume)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-200/70 text-sm">Market Cap</span>
            <span className="text-white font-medium">{formatMarketCap(marketCap)}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  let assetsToShow: { asset: CryptoData | StockData, type: 'crypto' | 'stock' }[] = [];
  if (activeTab === 'all') {
    assetsToShow = [
      ...filteredCryptoData.map(asset => ({ asset, type: 'crypto' as const })),
      ...filteredStockData.map(asset => ({ asset, type: 'stock' as const })),
    ];
  } else if (activeTab === 'crypto') {
    assetsToShow = filteredCryptoData.map(asset => ({ asset, type: 'crypto' as const }));
  } else {
    assetsToShow = filteredStockData.map(asset => ({ asset, type: 'stock' as const }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Trading
              </h1>
              <p className="text-white/70 text-lg">
                Consulta quotazioni di criptovalute e azioni (dati di esempio)
              </p>
            </div>
          </div>
        </motion.div>

        
        <FilterBar
          filters={tradingFilters}
          activeFilter={activeTab}
          onFilterChange={id => setActiveTab(id as 'crypto' | 'stocks' | 'all')}
        />

        {error && (
          <motion.div
            className="mb-6 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-200 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {assetsToShow.length > 0 ? (
                assetsToShow.map((item, index) => (
                  <motion.div
                    key={item.type === 'crypto' ? (item.asset as CryptoData).id : (item.asset as StockData).symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AssetCard asset={item.asset} type={item.type} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <Activity className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                  <p className="text-blue-200/70 text-lg">Nessun asset trovato</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};