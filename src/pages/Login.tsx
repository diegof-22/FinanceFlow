import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Icons } from '../components/ui/icons';
import { useAuth } from '../lib/firebase';
import { Eye, EyeOff, Chrome, Github, Mail, Lock, Wallet } from 'lucide-react';
import { useError } from '../contexts/ErrorContext';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { error, setError, clearError } = useError();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, register, loginWithGoogle, loginWithGithub, user, checkEmailExists, sendPasswordReset } = useAuth();

  useEffect(() => {
    if (user && !localStorage.getItem('pushPermissionAsked')) {
      localStorage.setItem('pushPermissionAsked', 'true');
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError(); 
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Compila tutti i campi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    clearError();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const exists = await checkEmailExists(formData.email);
        if (exists) {
          setError(
            <div className="flex flex-col space-y-1">
              <span>Email già in uso.</span>
              <div>
                <button type="button" className="underline text-[#080808] font-semibold" onClick={() => setIsLogin(true)}>
                  Vuoi accedere?
                </button>
                <span className="mx-2">oppure</span>
                <button
                  type="button"
                  className="underline text-[#080808] font-semibold"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await sendPasswordReset(formData.email);
                      setError('Email per il recupero password inviata!');
                    } catch (err: any) {
                      setError('Errore nell\'invio della mail di recupero: ' + (err?.message || '')); 
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Recupera password
                </button>
              </div>
            </div>
          );
          setIsLoading(false);
          return;
        }
        await register(formData.email, formData.password);
      }
    } catch (error: any) {
      console.log('Errore login:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError(
          <div className="flex flex-col space-y-1">
            <span>Credenziali non valide.</span>
            <button
              type="button"
              className="underline text-[#080808] font-semibold text-left"
              onClick={async () => {
                setIsLoading(true);
                try {
                  await sendPasswordReset(formData.email);
                  setError('Email per il recupero password inviata!');
                } catch (err: any) {
                  setError('Errore nell\'invio della mail di recupero: ' + (err?.message || ''));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Recupera password
            </button>
          </div>
        );
      } else if (error.code === 'auth/user-not-found') {
        setError(
          <div className="flex flex-col space-y-1">
            <span>Nessun account trovato.</span>
            <button
              type="button"
              className="underline text-[#080808] font-semibold text-left"
              onClick={() => {
                setIsLogin(false);
                setFormData(prev => ({ ...prev, email: formData.email }));
              }}
            >
              Registrati
            </button>
          </div>
        );
      } else if (error.code === 'auth/email-already-in-use' || error.code === 'Email già in uso') {
        setError(
          <div className="flex flex-col space-y-1">
            <span>Email già in uso.</span>
            <button type="button" className="underline text-[#080808] font-semibold text-left" onClick={() => setIsLogin(true)}>
              Vuoi accedere?
            </button>
          </div>
        );
      } else if (error.code === 'auth/user-disabled') {
        setError('Questo account è stato disabilitato.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Troppi tentativi falliti. Riprova più tardi.');
      } else {
        setError(error.message || 'Si è verificato un errore');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setFormData({ email: '', password: '' });
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    clearError();
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }
    } catch (error: any) {
      setError(error.message || 'Si è verificato un errore');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f9f9f9] text-[#080808] font-sans p-4 relative overflow-hidden">
      
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-200/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-200/50 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <motion.div
          className="bg-white border border-[#f0f0f0] rounded-[32px] p-8 sm:p-10 shadow-xl shadow-slate-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-[#080808] rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="text-white w-8 h-8" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.h1
                key={isLogin ? "login" : "register"}
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#080808] mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? "Bentornato" : "Crea Account"}
              </motion.h1>
            </AnimatePresence>
            <p className="text-[#080808]/60 text-sm font-medium">
              {isLogin
                ? "Inserisci i tuoi dati per accedere."
                : "Inizia a gestire le tue finanze."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#080808] uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#080808]/40" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] text-sm placeholder:text-[#080808]/40 focus:ring-2 focus:ring-[#080808]/5 focus:border-[#080808]/20 transition-all font-medium"
                  placeholder="nome@esempio.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#080808] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#080808]/40" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-[#080808] text-sm placeholder:text-[#080808]/40 focus:ring-2 focus:ring-[#080808]/5 focus:border-[#080808]/20 transition-all font-medium"
                  placeholder="La tua password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#080808]/40 hover:text-[#080808] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-50 border border-red-100 rounded-xl p-4"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-red-600 text-sm font-medium">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#080808] hover:bg-[#080808]/80 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                    <span>Attendi...</span>
                  </div>
                ) : (
                  <span>{isLogin ? "Accedi" : "Crea Account"}</span>
                )}
              </Button>
            </div>

            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#f0f0f0]"></div>
              <span className="flex-shrink-0 mx-4 text-[#080808]/40 text-xs font-bold uppercase tracking-widest">
                oppure
              </span>
              <div className="flex-grow border-t border-[#f0f0f0]"></div>
            </div>

            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 bg-white hover:bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center"
              >
                <Chrome className="w-5 h-5 mr-2 text-[#080808]" />
                Google
              </Button>
              <Button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 bg-white hover:bg-[#f9f9f9] border border-[#e5e5e5] text-[#080808] rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center"
              >
                <Github className="w-5 h-5 mr-2 text-[#080808]" />
                GitHub
              </Button>
            </div>

            
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#080808]/60 hover:text-[#080808] text-sm font-semibold transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLogin
                  ? "Non hai un account? Registrati qui"
                  : "Hai già un account? Accedi qui"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}