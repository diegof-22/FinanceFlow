import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface FeatureSectionProps {
  label: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  themeColor: 'blue' | 'purple';
  backgroundColor: string;
  floatingWidgets?: React.ReactNode[];
}

export const FeatureSection = ({
  label,
  icon,
  title,
  description,
  features,
  imageSrc,
  imageAlt,
  imagePosition,
  themeColor,
  backgroundColor,
  floatingWidgets = []
}: FeatureSectionProps) => {

  const colorStyles = {
    blue: {
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600',
      checkBg: 'bg-green-100',
      checkIcon: 'text-green-600',
      blurBg: 'bg-blue-400/20'
    },
    purple: {
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-600',
      checkBg: 'bg-purple-100',
      checkIcon: 'text-purple-600',
      blurBg: 'bg-purple-400/20'
    }
  }[themeColor];

  const contentCol = (
    <motion.div 
      initial={{ opacity: 0, x: imagePosition === 'right' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`order-2 ${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
    >
      <div className={`inline-flex items-center space-x-2 ${colorStyles.badgeBg} ${colorStyles.badgeText} px-4 py-2 rounded-full mb-6 font-bold text-sm shadow-sm border border-white/50`}>
        {icon}
        <span>{label}</span>
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#080808] mb-6 leading-[1.1] tracking-tight">
        {title}
      </h2>
      <p className="text-lg text-slate-500 mb-8 leading-relaxed font-medium">
        {description}
      </p>
      
      <ul className="space-y-5">
        {features.map((feature, i) => (
          <motion.li 
            key={i}
            whileHover={{ x: 5 }}
            className="flex items-center space-x-4 text-slate-700 font-semibold"
          >
            <div className={`${colorStyles.checkBg} p-1.5 rounded-full shadow-sm`}>
              <CheckCircle2 className={`w-5 h-5 ${colorStyles.checkIcon}`} />
            </div>
            <span className="text-lg">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  const imageCol = (
    <motion.div 
      initial={{ opacity: 0, x: imagePosition === 'right' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`order-1 ${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'} relative flex justify-center`}
    >
       <div className={`absolute inset-0 ${colorStyles.blurBg} blur-[80px] rounded-full scale-90 -z-10 translate-y-10`}></div>
       
       <div className="relative w-full max-w-[460px]">
         <motion.img 
           whileHover={{ scale: 1.02, rotate: imagePosition === 'right' ? -1 : 1, y: -5 }}
           transition={{ type: "spring", stiffness: 400, damping: 30 }}
           src={imageSrc} 
           alt={imageAlt} 
           className="rounded-[2rem] shadow-2xl border-[6px] border-white/90 w-full relative z-10"
         />
         
         
         {floatingWidgets.map((widget, i) => (
           <React.Fragment key={i}>
             {widget}
           </React.Fragment>
         ))}
       </div>
    </motion.div>
  );

  return (
    <section className={`py-28 md:py-40 ${backgroundColor} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {imagePosition === 'right' ? (
            <>
              {contentCol}
              {imageCol}
            </>
          ) : (
            <>
              {imageCol}
              {contentCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
