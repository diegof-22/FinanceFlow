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

interface UserProfile {
  displayName: string;
  email: string;
  avatar: string;
}

const Profile = () => {
 
  

  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  
  


  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#080808] mb-1">
                Il Mio Profilo
              </h1>
              <p className="text-[#080808]/70 text-sm sm:text-base">
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
          <div className="bg-white border border-[#f0f0f0] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-[#080808]">Informazioni Profilo</h2>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleCancel}
                        className="bg-transparent border border-[#e5e5e5] text-[#080808] hover:bg-[#f5f5f5] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annulla
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 text-white border-0 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
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
                  <h3 className="text-xl font-semibold text-[#080808]">{userProfile.displayName}</h3>
                  <p className="text-[#080808]/70">{userProfile.email}</p>
                  
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-[#080808] mb-2 block font-medium">Nome Completo</Label>
                  <Input
                    value={userProfile.displayName}
                    onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                    disabled={!isEditing}
                    className="bg-[#f9f9f9] border-[#e5e5e5] text-[#080808] placeholder-[#080808]/40 disabled:opacity-60"
                    placeholder="Inserisci il tuo nome completo"
                  />
                </div>
                <div>
                  <Label className="text-[#080808] mb-2 block font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#080808]/50" />
                    <Input
                      value={userProfile.email}
                      disabled={true}
                      className="bg-[#f5f5f5] border-[#e5e5e5] text-[#080808]/70 pl-10 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[#080808]/50 text-xs mt-1">L'email non può essere modificata</p>
                </div>
              </div>

             
              


              
              <div className="pt-6 border-t border-[#f0f0f0]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#080808]">Esci dall'Account</h3>
                    <p className="text-[#080808]/70 text-sm">Disconnettiti dal tuo account</p>
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