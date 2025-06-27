import { useFinanceData } from "@/hooks/useFinanceData";
import {motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export const BudgetTips = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl p-6 border border-green-400/20 mt-20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/20">
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Consigli per il Budget
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-green-300 font-medium text-sm">
              ✓ Regola 50/30/20
            </p>
            <p className="text-white/70 text-sm">
              50% necessità, 30% desideri, 20% risparmi
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-green-300 font-medium text-sm">
              ✓ Rivedi Mensilmente
            </p>
            <p className="text-white/70 text-sm">
              Aggiusta i budget in base alle tue abitudini
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-green-300 font-medium text-sm">
              ✓ Buffer di Sicurezza
            </p>
            <p className="text-white/70 text-sm">
              Lascia sempre un 10% per imprevisti
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-green-300 font-medium text-sm">
              ✓ Traccia Quotidianamente
            </p>
            <p className="text-white/70 text-sm">
              Registra le spese appena le fai
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
    }