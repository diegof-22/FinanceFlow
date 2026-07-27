import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { Transaction } from '@/types/finance';

interface TransactionsChartProps {
  transactions: Transaction[];
}

const MONTHS_LONG = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

export const TransactionsChart: React.FC<TransactionsChartProps> = ({ transactions }) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); 
  
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const data = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
    
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      name: (i + 1).toString(),
      amount: 0
    }));

    if (Array.isArray(transactions)) {
      transactions.forEach(t => {
        if (t.type === type) {
          const date = new Date(t.date);
          if (date.getFullYear() === currentYear && date.getMonth() === selectedMonth) {
            const dayIndex = date.getDate() - 1;
            if (dailyData[dayIndex]) {
              dailyData[dayIndex].amount += parseFloat(t.amount.toString()) || 0;
            }
          }
        }
      });
    }

    return dailyData;
  }, [transactions, type, selectedMonth]);

  const currentTotal = useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, [data]);



  const lastMonthTotal = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    let total = 0;
    const currentYear = new Date().getFullYear();
    const lastMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const yearOfLastMonth = selectedMonth === 0 ? currentYear - 1 : currentYear;

    transactions.forEach(t => {
      if (t.type === type) {
        const date = new Date(t.date);
        if (date.getFullYear() === yearOfLastMonth && date.getMonth() === lastMonth) {
          total += parseFloat(t.amount.toString()) || 0;
        }
      }
    });
    return total;
  }, [transactions, type, selectedMonth]);

  let percentageChange = 0;
  if (lastMonthTotal > 0) {
    percentageChange = ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100;
  }
  const isPositive = percentageChange <= 0; 

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#080808] text-white px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center">
          <span className="text-[10px] text-white/70 mb-0.5">{label} {MONTHS_LONG[selectedMonth]}</span>
          <span className="text-sm font-bold">€{payload[0].value.toFixed(2)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#f0f0f0] rounded-[32px] p-6 lg:p-8 shadow-sm mb-8">
      
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#080808]">Activity</h2>
        
        
        <div className="flex items-center bg-[#f5f5f5] rounded-full p-1.5 cursor-pointer border border-[#f0f0f0]/50">
          <div 
            onClick={() => setType('expense')}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${type === 'expense' ? 'bg-white shadow-sm text-[#080808]' : 'text-[#080808]/50'}`}
          >
            Spese
          </div>
          <div 
            onClick={() => setType('income')}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${type === 'income' ? 'bg-white shadow-sm text-[#080808]' : 'text-[#080808]/50'}`}
          >
            Entrate
          </div>
        </div>
      </div>

      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#080808] tracking-tight">€{currentTotal.toFixed(2)}</h1>
          <p className={`text-sm mt-2 font-bold ${percentageChange === 0 ? 'text-[#080808]/40' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(0)}% <span className="text-[#080808]/40 font-medium">vs scorso mese</span>
          </p>
        </div>
        
        
        <div className="relative z-10 mt-2">
          <button 
            onClick={() => { setIsMonthDropdownOpen(!isMonthDropdownOpen); setIsTypeDropdownOpen(false); }}
            className="flex items-center space-x-2 text-sm text-[#080808] font-bold bg-[#f5f5f5] hover:bg-[#e5e5e5] px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            <span>{MONTHS_LONG[selectedMonth]}</span>
            <ChevronDown className="w-4 h-4 text-[#080808]/60" />
          </button>
          {isMonthDropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-[#f0f0f0] rounded-[24px] shadow-xl py-2 max-h-[250px] overflow-y-auto">
              {MONTHS_LONG.map((month, idx) => (
                <button 
                  key={month}
                  onClick={() => { setSelectedMonth(idx); setIsMonthDropdownOpen(false); }} 
                  className={`block w-full text-left px-5 py-2.5 text-sm hover:bg-[#f9f9f9] transition-colors ${selectedMonth === idx ? 'font-bold text-[#080808] bg-[#f5f5f5]' : 'text-[#080808]/70'}`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="h-[220px] w-full mt-6 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={type === 'income' ? '#22c55e' : '#080808'} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={type === 'income' ? '#22c55e' : '#080808'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f5f5f5" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#080808', opacity: 0.4, fontSize: 11, fontWeight: 500 }}
              interval="preserveStartEnd"
              minTickGap={20}
              dy={10}
            />
            <YAxis 
              hide={false} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#080808', opacity: 0.4, fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `€${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
              width={50}
              domain={[0, 'dataMax + 50']} 
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#080808', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} 
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke={type === 'income' ? '#22c55e' : '#080808'} 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAmount)"
              activeDot={{ r: 5, fill: type === 'income' ? '#22c55e' : '#080808', stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
