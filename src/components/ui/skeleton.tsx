import React from 'react';
import { motion } from 'framer-motion';


export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <motion.div
    className={`bg-white/10 rounded-lg animate-pulse ${className}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);


export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32 mb-2" />
    <Skeleton className="h-4 w-20" />
  </div>
);


export const CardItemSkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  </div>
);


export const TransactionItemSkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-5 w-16 mb-1" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);


export const BudgetCategoryCardSkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);


export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 lg:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-80" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <CardItemSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <CardItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const BudgetsSkeleton: React.FC = () => (
  <div className="p-6 lg:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-80" />
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BudgetCategoryCardSkeleton key={i} />
        ))}
      </div>

      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded-full mt-1" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


export const TransactionsSkeleton: React.FC = () => (
  <div className="p-6 lg:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-80" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);