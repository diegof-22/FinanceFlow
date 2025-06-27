export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      volume_24h: number;
      market_cap: number;
    };
  };
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export const mockCryptoData: CryptoData[] = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    quote: {
      USD: {
        price: 43250.75,
        percent_change_24h: 2.45,
        volume_24h: 15600000000,
        market_cap: 847000000000,
      }
    }
  },
  {
    id: 1027,
    name: 'Ethereum',
    symbol: 'ETH',
    quote: {
      USD: {
        price: 2350.12,
        percent_change_24h: 1.12,
        volume_24h: 8000000000,
        market_cap: 280000000000,
      }
    }
  },
  {
    id: 52,
    name: 'XRP',
    symbol: 'XRP',
    quote: {
      USD: {
        price: 0.6234,
        percent_change_24h: 4.12,
        volume_24h: 1200000000,
        market_cap: 34000000000,
      }
    }
  }
];

export const mockStockData: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    changePercent: 1.24,
    volume: 45678900,
    marketCap: 2800000000000
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    changePercent: -1.33,
    volume: 23456789,
    marketCap: 1750000000000
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    changePercent: 1.15,
    volume: 34567890,
    marketCap: 2900000000000
  }
];