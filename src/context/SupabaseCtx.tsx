import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  dog_name: string;
  dog_breed: string;
  dog_age: string;
  focus_area: string;
  next_consult: string;
  consult_progress: number;
  xp_points: number;
  streak_count: number;
  unlocked_badges: string[];
  is_authorized: boolean;
  created_at: string;
  updated_at: string;
}

interface SupabaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (name: string, dogName: string, dogBreed: string, dogAge: string) => Promise<void>;
  updateXpAndProgress: (xpToAdd: number, progressChg: number) => Promise<void>;
}

const SupabaseCtx = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsAuthLoading(false);
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
        setIsAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserProfile(data as UserProfile || null);
    } catch (err) {
      console.error("Error loading profile", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Login error", err);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const createProfile = async (
    name: string,
    dogName: string,
    dogBreed: string,
    dogAge: string
  ) => {
    if (!user) return;
    setIsAuthLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          dog_name: dogName,
          dog_breed: dogBreed,
          dog_age: dogAge,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data as UserProfile);
    } catch (err) {
      console.error("Error creating profile", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updateXpAndProgress = async (xpToAdd: number, progressChg: number) => {
    if (!user || !userProfile) return;

    const nextProg = Math.max(65, Math.min(100, userProfile.consult_progress + progressChg));
    const nextXp = userProfile.xp_points + xpToAdd;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          xp_points: nextXp,
          consult_progress: nextProg,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data as UserProfile);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <SupabaseCtx.Provider value={{
      user,
      userProfile,
      isAuthLoading,
      loginWithGoogle,
      logout,
      createProfile,
      updateXpAndProgress,
    }}>
      {children}
    </SupabaseCtx.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseCtx);
  if (!context) {
    throw new Error("useSupabase must be used inside a SupabaseProvider");
  }
  return context;
};
