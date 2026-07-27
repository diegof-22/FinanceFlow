import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useMarketApi, MarketCoin, TrendingCoin } from '@/hooks/useMarketApi';
import { useFinanceDataContext } from '@/contexts/FinanceDataContext';
import { DashboardSkeleton } from '../components/ui/skeleton';
import { AddInvestmentModal } from '../components/modal/add-investment-modal';

export const Trading = () => {
  const { getTrending, getMarketCoins } = useMarketApi();
  const { investments } = useFinanceDataContext();
  
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [market, setMarket] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAsset, setSelectedAsset] = useState<MarketCoin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [trendData, marketData] = await Promise.all([
          getTrending(),
          getMarketCoins()
        ]);
        if (mounted) {
          setTrending(trendData);
          setMarket(marketData);
        }
      } catch (err) {
        if (mounted) setError('Errore nel caricamento dei dati di mercato.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [getTrending, getMarketCoins]);

  const handleBuy = (coin: MarketCoin) => {
    setSelectedAsset(coin);
    setIsModalOpen(true);
  };

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };


  const portfolio = investments.map(inv => {
    const liveCoin = market.find(m => m.id === inv.assetId);
    const livePrice = liveCoin ? liveCoin.price : inv.entryPrice;
    const currentTotal = inv.amount * livePrice;
    const investedTotal = inv.amount * inv.entryPrice;
    const profitLoss = currentTotal - investedTotal;
    const profitLossPct = (profitLoss / investedTotal) * 100;
    
    return {
      ...inv,
      livePrice,
      currentTotal,
      investedTotal,
      profitLoss,
      profitLossPct,
      image: liveCoin?.image || ''
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#080808] mb-1">Trading & Investimenti</h1>
          <p className="text-[#080808]/70 text-sm sm:text-base">Esplora il mercato e traccia il tuo portafoglio in tempo reale.</p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm flex items-center space-x-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            
            {trending.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-[#080808] mb-4 flex items-center">
                  🔥 Trending in Hype
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trending.map(coin => (
                    <motion.div 
                      key={coin.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center space-y-2"
                    >
                      <img src={coin.thumb} alt={coin.name} className="w-12 h-12 rounded-full" />
                      <div className="text-center">
                        <p className="font-bold text-[#080808]">{coin.symbol}</p>
                        <div className={`flex items-center justify-center space-x-1 text-sm ${coin.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                          <span>{Math.abs(coin.priceChange24h).toFixed(2)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            
            <section>
              <h2 className="text-lg font-bold text-[#080808] mb-4 flex items-center">
                💼 Il mio Portafoglio
              </h2>
              {portfolio.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-100">
                  {portfolio.map(inv => {
                    const isPositive = inv.profitLoss >= 0;
                    return (
                      <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group">
                        
                        <div className="flex items-center space-x-3 w-1/3">
                          {inv.image ? (
                            <img src={inv.image} alt={inv.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-500">{inv.symbol.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[#080808] text-sm sm:text-base truncate">{inv.name}</span>
                            <span className="text-xs text-gray-500 font-medium uppercase">{inv.amount} {inv.symbol}</span>
                          </div>
                        </div>

                        
                        <div className="hidden sm:flex flex-col items-center justify-center w-1/3 text-center">
                          <span className="text-xs text-gray-500 uppercase font-medium">Acquistato a</span>
                          <span className="font-medium text-[#080808] text-sm">{formatPrice(inv.entryPrice)}</span>
                        </div>

                        
                        <div className="flex flex-col items-end w-1/3 text-right">
                          <span className="font-bold text-[#080808] text-sm sm:text-base">{formatPrice(inv.currentTotal)}</span>
                          <span className={`text-xs sm:text-sm font-semibold flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{isPositive ? '+' : ''}{formatPrice(inv.profitLoss)}</span>
                            <span className="text-[10px] sm:text-xs bg-gray-100/50 rounded-full px-1.5 py-0.5">
                              {Math.abs(inv.profitLossPct).toFixed(2)}%
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 border-dashed rounded-3xl p-8 text-center">
                  <p className="text-gray-500 mb-2">Non hai ancora investimenti attivi.</p>
                  <p className="text-sm text-gray-400">Clicca su "Compra" in un asset qui sotto per aggiungerlo al tuo portafoglio.</p>
                </div>
              )}
            </section>

            
            <section>
              <h2 className="text-lg font-bold text-[#080808] mb-4">📈 Mercato Live (Top 50)</h2>
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm divide-y divide-gray-100">
                {market.map(coin => {
                  const isPositive = coin.change24h >= 0;
                  return (
                    <div 
                      key={coin.id} 
                      onClick={() => handleBuy(coin)}
                      className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    >
                      
                      <div className="flex items-center space-x-3 w-1/3">
                        <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col">
                          <span className="font-bold text-[#080808] text-sm sm:text-base truncate">{coin.name}</span>
                          <span className="text-xs text-gray-500 font-medium uppercase">{coin.symbol}</span>
                        </div>
                      </div>

                      
                      <div className="hidden sm:flex items-center justify-center w-1/3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d={isPositive 
                              ? "M0 15 Q5 10, 10 12 T20 8 T30 14 T40 5 T50 10 T60 2" 
                              : "M0 5 Q5 10, 10 8 T20 12 T30 6 T40 15 T50 10 T60 18"}
                            stroke={isPositive ? "#16a34a" : "#dc2626"} 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            fill="none"
                          />
                        </svg>
                      </div>

                      
                      <div className="flex flex-col items-end w-1/3 text-right">
                        <span className="font-bold text-[#080808] text-sm sm:text-base">{formatPrice(coin.price)}</span>
                        <span className={`text-xs sm:text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      <AddInvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
};