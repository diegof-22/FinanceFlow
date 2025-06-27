import React from 'react';

export interface ActivityItemProps {
  title: string;
  date: string;
  amount: string;
  amountColor?: string;
  showBorder?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  title, 
  date, 
  amount, 
  amountColor = "text-green-400",
  showBorder = true 
}) => {
  return (
    <div className={`flex items-center justify-between py-3 ${showBorder ? 'border-b border-white/10' : ''}`}>
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-white/60 text-sm">{date}</p>
      </div>
      <p className={`font-semibold ${amountColor}`}>{amount}</p>
    </div>
  );
};