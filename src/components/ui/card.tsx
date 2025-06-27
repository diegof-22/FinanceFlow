export const Card = ({ title, cost, children, costColor = "text-green-400" }: { title: string; cost: string; children: string; costColor?: string }) => {
    return(
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${costColor}`}>{cost}</p>
            <p className="text-white/60 text-sm mt-2">{children}</p>
          </div>
    )
}