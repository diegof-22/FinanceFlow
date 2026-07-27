import { useCallback } from 'react';
import { useAuth } from '@/lib/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || ''; 

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: number;
  volume: number;
  change24h: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  price: string;
  priceChange24h: number;
}

export function useMarketApi() {
  const { user } = useAuth();
  
  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!user || !user.firebaseUser) return {};
    try {
      const token = await user.firebaseUser.getIdToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return {};
  }, [user]);

  const getTrending = useCallback(async (): Promise<TrendingCoin[]> => {
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return [];
      
      const response = await fetch(`${API_BASE_URL}/api/market/trending`, { headers });
      if (!response.ok) throw new Error('Failed to fetch trending');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [getAuthHeaders]);

  const getMarketCoins = useCallback(async (): Promise<MarketCoin[]> => {
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization) return [];
      
      const response = await fetch(`${API_BASE_URL}/api/market/coins`, { headers });
      if (!response.ok) throw new Error('Failed to fetch coins');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [getAuthHeaders]);

  return { getTrending, getMarketCoins };
}
