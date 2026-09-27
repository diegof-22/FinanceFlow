import React from 'react';
import { Wallet, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    Prodotto: ['Funzionalità', 'Integrazioni', 'Prezzi', 'Changelog'],
    Risorse: ['Centro Assistenza', 'Documentazione API', 'Blog', 'Community'],
    Azienda: ['Chi Siamo', 'Lavora con noi', 'Contatti', 'Brand Kit'],
    Legale: ['Privacy Policy', 'Termini di Servizio', 'Cookie Policy']
  };

  return (
    <footer className="bg-[#080808] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer">
              <div className="">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">FinanceFlow</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              La piattaforma definitiva per gestire il tuo patrimonio. Conti, carte, budget e investimenti centralizzati in un'unica dashboard intelligente.
            </p>
            
            
            <div className="flex items-center space-x-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-6 tracking-wide">{title}</h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>

        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} FinanceFlow Inc. Tutti i diritti riservati.
          </p>
          
          
        </div>
        
      </div>
    </footer>
  );
};
