import React from 'react';
import { CreditCard, BarChart3, TrendingUp, CheckCircle2, PieChart, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { RevealFeatures } from '../components/landing/RevealFeatures';
import { FeatureSection } from '../components/landing/FeatureSection';
import { MobileShowcase } from '../components/landing/MobileShowcase';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/landing/Footer';
import { FeatureGrid } from '../components/landing/FeatureGrid';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#4ade80] selection:text-[#080808]">
      <Header />
      
      <Hero />
      
      <RevealFeatures />
      <FeatureGrid />
      <CallToAction />
      
      <Footer />
    </div>
  );
};
