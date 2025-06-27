import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/firebase";
import { motion } from "framer-motion";
import {
  Mail,
  Edit3,
  Camera,
  Save,
  X,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pushNotificationService } from '../services/pushNotifications';

interface UserProfile {
  displayName: string;
  email: string;
  avatar: string;
}

const Profile = () => {
 
  

  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState<'active' | 'inactive' | 'error'>('inactive');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoadingPush, setIsLoadingPush] = useState(false);
  const [pushStatus, setPushStatus] = useState<'active' | 'inactive' | 'denied'>('inactive');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: user?.name || 'Utente',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updates: { name?: string; avatar?: string } = {};
      
      if (userProfile.displayName !== user.name) {
        updates.name = userProfile.displayName;
      }
      
      if (userProfile.avatar !== user.avatar) {
        updates.avatar = userProfile.avatar;
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Errore nel salvare il profilo:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    
    setUserProfile({
      displayName: user?.name || 'Utente',
      email: user?.email || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserProfile({...userProfile, avatar: result});
      };
      reader.readAsDataURL(file);
    }
  };

  
  useEffect(() => {
    if (user) {
      setUserProfile({
        displayName: user.name || 'Utente',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  
  

  
  const checkPushSubscription = async () => {
    try {
      if (Notification.permission !== 'granted') {
        setNotificationStatus('inactive');
        setNotificationMessage('Le notifiche push non sono attive.');
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!registration) {
        setNotificationStatus('inactive');
        setNotificationMessage('Service Worker non registrato.');
        return;
      }
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        setNotificationStatus('active');
        setNotificationMessage('Le notifiche push sono attive su questo dispositivo.');
      } else {
        setNotificationStatus('inactive');
        setNotificationMessage('Le notifiche push non sono attive.');
      }
    } catch (error) {
      setNotificationStatus('error');
      setNotificationMessage('Errore nel controllo delle notifiche push.');
    }
  };


  useEffect(() => {
    checkPushSubscription();
  }, [user]);


  useEffect(() => {
    async function checkPushStatus() {
      if (Notification.permission === 'denied') {
        setPushStatus('denied');
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setPushStatus(subscription ? 'active' : 'inactive');
      } else {
        setPushStatus('inactive');
      }
    }
    checkPushStatus();
    const interval = setInterval(checkPushStatus, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleTogglePush = async () => {
    setIsLoadingPush(true);
    if (pushEnabled) {
      
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
      setPushEnabled(false);
    } else {
      const subscription = await pushNotificationService.setupWebPushSubscription();
      setPushEnabled(!!subscription);
    }
    setIsLoadingPush(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Il Mio Profilo
              </h1>
              <p className="text-white/70 text-lg">
                Gestisci le tue informazioni personali
              </p>
            </div>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Informazioni Profilo</h2>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleCancel}
                        className="bg-transparent border border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annulla
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 hover:scale-105 active:scale-95 text-white border-0 disabled:opacity-50 shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salva
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Modifica
                    </Button>
                  )}
                </div>
              </div>

              
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (userProfile.displayName || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2 rounded-full transition-all cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{userProfile.displayName}</h3>
                  <p className="text-white/70">{userProfile.email}</p>
                  
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/90 mb-2 block">Nome Completo</Label>
                  <Input
                    value={userProfile.displayName}
                    onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                    disabled={!isEditing}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 disabled:opacity-60"
                    placeholder="Inserisci il tuo nome completo"
                  />
                </div>
                <div>
                  <Label className="text-white/90 mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      value={userProfile.email}
                      disabled={true}
                      className="bg-white/5 border-white/10 text-white/70 pl-10 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-white/50 text-xs mt-1">L'email non può essere modificata</p>
                </div>
              </div>

             
              

              
              <div className="mt-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 shadow-lg">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Notifiche Push</h3>
                    <p className="text-white/60 text-sm mb-1">
                      Ricevi aggiornamenti e promemoria direttamente dal browser. Puoi gestire i permessi dal lucchetto accanto all'URL.
                    </p>
                  </div>
                  <span className={
                    'px-3 py-1 rounded-full text-sm font-semibold ' +
                    (pushStatus === 'active'
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                      : pushStatus === 'denied'
                        ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                        : 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30')
                  }>
                    {pushStatus === 'active'
                      ? 'Attive'
                      : pushStatus === 'denied'
                        ? 'Bloccate dal browser'
                        : 'Non attive'}
                  </span>
                </div>
              </div>

              
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Esci dall'Account</h3>
                    <p className="text-white/70 text-sm">Disconnettiti dal tuo account</p>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200 focus:ring-red-500/30"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Esci
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;