import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';

import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  User as FirebaseUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore
} from 'firebase/firestore';





const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const db = getFirestore(app);





export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();


googleProvider.addScope('email');
googleProvider.addScope('profile');
githubProvider.addScope('user:email');

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  firebaseUser?: FirebaseUser;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar?: string }) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
}


const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  } catch (error: any) {
    console.error('Error checking email:', error);
  
    return false;
  }
};

const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Utente non trovato';
    case 'auth/wrong-password':
      return 'Password non corretta';
    case 'auth/email-already-in-use':
      return 'Email già in uso. Prova ad effettuare il login o usa un\'altra email';
    case 'auth/weak-password':
      return 'Password troppo debole (minimo 6 caratteri)';
    case 'auth/invalid-email':
      return 'Email non valida';
    case 'auth/popup-closed-by-user':
      return 'Login annullato dall\'utente';
    case 'auth/cancelled-popup-request':
      return 'Richiesta di login annullata';
    case 'auth/popup-blocked':
      return 'Popup bloccato dal browser';
    case 'auth/too-many-requests':
      return 'Troppi tentativi falliti. Riprova più tardi';
    case 'auth/network-request-failed':
      return 'Errore di connessione. Controlla la tua connessione internet';
    case 'auth/invalid-credential':
      return 'Credenziali non valide o account non esistente';
    default:
      return 'Errore durante l\'autenticazione';
  }
};


const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pushNotificationsInitialized, setPushNotificationsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utente',
          avatar: firebaseUser.photoURL || undefined,
          firebaseUser
        };
        setUser(userData);
        
        const { firebaseUser: _, ...serializableUser } = userData;
        localStorage.setItem('user', JSON.stringify(serializableUser));
      } else {
        setUser(null);
        setPushNotificationsInitialized(false);
        localStorage.removeItem('user');
        console.log('🧹 Push notifications cleanup completato');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pushNotificationsInitialized]);

  
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      
      if (!email || !password) {
        throw { code: 'auth/invalid-input', message: 'Email e password sono obbligatori' };
      }
      if (!isValidEmail(email)) {
        throw { code: 'auth/invalid-email', message: 'Formato email non valido' };
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: firebaseUser.displayName || email.split('@')[0] || 'Utente',
        avatar: firebaseUser.photoURL || undefined,
        firebaseUser
      };
      setUser(userData);
      const { firebaseUser: _, ...serializableUser } = userData;
      localStorage.setItem('user', JSON.stringify(serializableUser));
    } catch (error: any) {
      
      const code = error.code || 'auth/unknown';
      const message = getFirebaseErrorMessage(code) || error.message || 'Errore sconosciuto';
      throw { code, message };
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (email: string, password: string, name?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: name || firebaseUser.displayName || email.split('@')[0] || 'Utente',
        avatar: firebaseUser.photoURL || undefined,
        firebaseUser
      };
      setUser(userData);
      
      const { firebaseUser: _, ...serializableUser } = userData;
      localStorage.setItem('user', JSON.stringify(serializableUser));
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        localStorage.setItem('registerError', 'Email già in uso');
        throw new Error('Email già in uso');
      }
      throw new Error(getFirebaseErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Utente Google',
        avatar: firebaseUser.photoURL || undefined,
        firebaseUser
      };
      
      setUser(userData);
      
      const { firebaseUser: _, ...serializableUser } = userData;
      localStorage.setItem('user', JSON.stringify(serializableUser));
      
    } catch (error: any) {
      
      throw new Error(getFirebaseErrorMessage(error.code) || 'Errore durante l\'accesso con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGithub = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;
      
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'Utente GitHub',
        avatar: firebaseUser.photoURL || undefined,
        firebaseUser
      };
      
      setUser(userData);
      
      const { firebaseUser: _, ...serializableUser } = userData;
      localStorage.setItem('user', JSON.stringify(serializableUser));
      console.log('Login GitHub completato per:', userData.email);
    } catch (error: any) {
      console.error('GitHub login error:', error);
      throw new Error(getFirebaseErrorMessage(error.code) || 'Errore durante l\'accesso con GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Errore durante il logout');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { name?: string; avatar?: string }): Promise<void> => {
    if (!auth.currentUser || !user) {
      throw new Error('Utente non autenticato');
    }

    try {
      
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.displayName = updates.name;
      if (updates.avatar) profileUpdates.photoURL = updates.avatar;

      if (Object.keys(profileUpdates).length > 0) {
        const { updateProfile: firebaseUpdateProfile } = await import('firebase/auth');
        await firebaseUpdateProfile(auth.currentUser, profileUpdates);
      }

      
      const updatedUser: User = {
        ...user,
        ...(updates.name && { name: updates.name }),
        ...(updates.avatar && { avatar: updates.avatar })
      };

      setUser(updatedUser);
      
      const { firebaseUser: _, ...serializableUser } = updatedUser;
      localStorage.setItem('user', JSON.stringify(serializableUser));
      
      console.log('Profilo aggiornato con successo');
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error('Errore durante l\'aggiornamento del profilo');
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw { code: error.code, message: getFirebaseErrorMessage(error.code) };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
    updateProfile,
    checkEmailExists,
    sendPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User, AuthContextType };

export default app;