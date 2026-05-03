import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfile, OutageSlot } from './types';
import { fetchRealtimeSchedule } from './geminiService';

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  isPowerOn: boolean;
  setIsPowerOn: (status: boolean) => void;
  todaySchedule: OutageSlot[];
  isLoadingSchedule: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('voltwatch_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState<OutageSlot[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  useEffect(() => {
    const loadSchedule = async () => {
      if (profile && profile.city && profile.area && profile.provider) {
        localStorage.setItem('voltwatch_profile', JSON.stringify(profile));
        
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('voltwatch_schedule_date');
        const savedSchedule = localStorage.getItem('voltwatch_schedule');

        // Use cached schedule for today to avoid hitting API limits on every refresh
        if (savedDate === today && savedSchedule) {
          setTodaySchedule(JSON.parse(savedSchedule));
        } else {
          setIsLoadingSchedule(true);
          const schedule = await fetchRealtimeSchedule(profile.city, profile.area, profile.provider);
          if (schedule && schedule.length > 0) {
            setTodaySchedule(schedule);
            localStorage.setItem('voltwatch_schedule', JSON.stringify(schedule));
            localStorage.setItem('voltwatch_schedule_date', today);
          }
          setIsLoadingSchedule(false);
        }
      }
    };

    loadSchedule();
  }, [profile]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState(prev => ({ ...(prev || {}), ...updates } as UserProfile));
  };

  const logout = () => {
    localStorage.removeItem('voltwatch_profile');
    localStorage.removeItem('voltwatch_schedule');
    localStorage.removeItem('voltwatch_schedule_date');
    setProfileState(null);
    setTodaySchedule([]);
  };

  return (
    <UserContext.Provider value={{ 
        profile, 
        setProfile, 
        isPowerOn, 
        setIsPowerOn, 
        todaySchedule, 
        isLoadingSchedule,
        updateProfile,
        logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
