import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Icons } from '../components/ui/icons';
import { useAuth } from '../lib/firebase';
import { Eye, EyeOff, Chrome, Github, Mail, Lock } from 'lucide-react';
import { formAnimations} from '../animations/ui';
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
            <>
              <span>Email già in uso.</span>
              <button
                type="button"
                className="underline text-blue-300 ml-2"
                onClick={() => setIsLogin(true)}
              >
                Vuoi accedere?
              </button>
              <button
                type="button"
                className="underline text-blue-300 ml-2"
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
            </>
          );
          setIsLoading(false);
          return;
        }
        await register(formData.email, formData.password);
      }
    } catch (error: any) {
      console.log('Errore login:', error);
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        setError(
          <>
            <span>Email già registrata. Vuoi recuperare la password?</span>
            <button
              type="button"
              className="underline text-blue-300 ml-2"
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
          </>
        );
      } else if (error.code === 'auth/user-not-found') {
        setError(
          <>
            <span>Nessun account trovato con questa email. Vuoi registrarti?</span>
            <button
              type="button"
              className="underline text-blue-300 ml-2"
              onClick={() => {
                setIsLogin(false);
                setFormData(prev => ({ ...prev, email: formData.email }));
              }}
            >
              Registrati
            </button>
          </>
        );
      } else if (error.code === 'auth/email-already-in-use' || error.code === 'Email già in uso') {
        setError(
          <>
            <span>Email già in uso.</span>
            <button
              type="button"
              className="underline text-blue-300 ml-2"
              onClick={() => setIsLogin(true)}
            >
              Vuoi accedere?
            </button>
          </>
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
    setFormData({
      email: '',
      password: ''
    });
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 font-sf overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>
      <div className="w-full max-w-md mx-auto px-6 relative z-10">
        <motion.div
          className="bg-white/8 backdrop-blur-3xl border border-blue-200/30 rounded-2xl p-8 shadow-2xl shadow-blue-900/20"
          {...formAnimations.container}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-white font-bold text-3xl tracking-tight">
                F
              </span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.h1
                key={isLogin ? "login" : "register"}
                className="text-3xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {isLogin ? "Bentornato" : "Inizia ora"}
              </motion.h1>
            </AnimatePresence>
            <motion.p
              className="text-blue-200/80 font-medium text-base max-w-xs mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {isLogin
                ? "Accedi al tuo account FinanceLow"
                : "Crea il tuo account FinanceLow"}
            </motion.p>
          </motion.div>

          
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <motion.div className="space-y-3" {...formAnimations.field}>
              <label className="flex items-center text-sm font-semibold text-blue-200/90">
                <Mail className="w-4 h-4 mr-3" />
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-blue-900/30 border-2 border-blue-300/50 rounded-xl text-white text-sm placeholder-blue-200/50 focus:ring-3 focus:ring-blue-400/30 focus:border-blue-400/70 backdrop-blur-sm transition-all duration-300 font-medium"
                placeholder="nome@esempio.com"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div className="space-y-3" {...formAnimations.field}>
              <label className="flex items-center text-sm font-semibold text-blue-200/90">
                <Lock className="w-4 h-4 mr-3" />
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 bg-blue-900/30 border-2 border-blue-300/50 rounded-xl text-white text-sm placeholder-blue-200/50 focus:ring-3 focus:ring-blue-400/30 focus:border-blue-400/70 backdrop-blur-sm transition-all duration-300 font-medium"
                  placeholder="Inserisci la password"
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200/60 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
                  disabled={isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </motion.div>

           
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-500/20 border-2 border-red-400/40 rounded-xl p-3 backdrop-blur-sm mb-2"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-red-200 text-sm text-center font-semibold">
                    {typeof error === 'string' ? error : error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
            <motion.div {...formAnimations.submit}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-blue-600/30 disabled:opacity-50 tracking-tight transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Icons.spinner className="h-4 w-4 animate-spin mr-3" />
                    <span>
                      {isLogin
                        ? "Accesso in corso..."
                        : "Registrazione in corso..."}
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    {isLogin ? "Accedi" : "Crea il tuo Account"}
                  </span>
                )}
              </Button>
            </motion.div>

          
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-blue-200/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-4 py-1 text-blue-200/70 font-bold tracking-wider bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-md">
                  oppure
                </span>
              </div>
            </div>

          
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                  className="w-full bg-white/10 hover:bg-white/20 border border-blue-200/40 hover:border-blue-300/60 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center backdrop-blur-sm disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                  className="w-full bg-white/10 hover:bg-white/20 border border-blue-200/40 hover:border-blue-300/60 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center backdrop-blur-sm disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </motion.div>
            </div>

            
            <div className="text-center pt-6">
              <motion.button
                type="button"
                onClick={toggleMode}
                className="text-blue-200/80 hover:text-white text-sm transition-all duration-300 font-semibold tracking-tight disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                disabled={isLoading}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isLogin
                  ? "Non hai un account? Registrati qui"
                  : "Hai già un account? Accedi qui"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}