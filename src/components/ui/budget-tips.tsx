import { motion } from "framer-motion"
import { Lightbulb, Target, RefreshCw, ShieldCheck, PenTool } from "lucide-react"

export const BudgetTips = () => {
  const tips = [
    {
      icon: Target,
      title: "Regola 50/30/20",
      desc: "50% necessità, 30% desideri, 20% risparmi",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: RefreshCw,
      title: "Rivedi Mensilmente",
      desc: "Aggiusta i budget in base alle tue abitudini",
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      icon: ShieldCheck,
      title: "Buffer di Sicurezza",
      desc: "Lascia sempre un 10% per spese impreviste",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: PenTool,
      title: "Traccia Sempre",
      desc: "Registra le spese nel momento in cui le fai",
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12 mb-8 px-2 sm:px-0"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-yellow-50 border border-yellow-100">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#080808]">
            Consigli per il Budget
          </h3>
          <p className="text-sm text-[#080808]/50">Piccole dritte per risparmiare di più</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              className="bg-white border border-[#f0f0f0] p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className={`w-10 h-10 rounded-2xl ${tip.bg} flex items-center justify-center mb-4`}>
                <Icon className={`h-5 w-5 ${tip.color}`} />
              </div>
              <div>
                <h4 className="text-[#080808] font-bold text-sm mb-1.5">{tip.title}</h4>
                <p className="text-[#080808]/60 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}