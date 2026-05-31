import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  name: string;
  dogName: string;
  dogBreed: string;
  dogAge: string;
  focusArea: string;
  nextConsult: string;
  consultProgress: number;
  xpPoints: number;
  streakCount: number;
  unlockedBadges: string[];
  isAuthorized: boolean;
  createdAt: any;
  updatedAt: any;
}

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (name: string, dogName: string, dogBreed: string, dogAge: string) => Promise<void>;
  updateXpAndProgress: (xpToAdd: number, progressChg: number) => Promise<void>;
}

const FirebaseCtx = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Set persistence and watch auth state change
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const runInit = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.error("Local persistence config error: ", err);
      }
    };
    runInit();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch Profile from Firestore
        const profileRef = doc(db, "users", currentUser.uid);
        try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error loading profile snap", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const loginWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      
      // Look up profile instantly
      const profileRef = doc(db, "users", loggedUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setUserProfile(profileSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error("Popup Sign in Error: ", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error("Sign out error", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Helper inside clinical space to create a brand new tutor/dog card
  const createProfile = async (
    name: string,
    dogName: string,
    dogBreed: string,
    dogAge: string
  ) => {
    if (!user) return;
    setIsAuthLoading(true);
    
    const profileRef = doc(db, "users", user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      name,
      dogName,
      dogBreed,
      dogAge,
      focusArea: "Engajamento Relacional & Tolerância a Frustração",
      nextConsult: "A agendar pelo WhatsApp com Érico",
      consultProgress: 65,
      xpPoints: 380,
      streakCount: 5,
      unlockedBadges: ["foco-absoluto", "passeio-nobre", "tutor-guardiao"],
      isAuthorized: user.email === "ericocavalheiro.psico@gmail.com",
      createdAt: new Date().toISOString(), // Static representation readable on client, matches rules validations
      updatedAt: new Date().toISOString()
    };

    try {
      // Create document
      await setDoc(profileRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setUserProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Quick rewards connector
  const updateXpAndProgress = async (xpToAdd: number, progressChg: number) => {
    if (!user || !userProfile) return;
    const profileRef = doc(db, "users", user.uid);
    
    const nextProg = Math.max(65, Math.min(100, userProfile.consultProgress + progressChg));
    const nextXp = userProfile.xpPoints + xpToAdd;
    
    // Optimistic UI updates
    setUserProfile(prev => prev ? { ...prev, xpPoints: nextXp, consultProgress: nextProg } : null);

    try {
      await updateDoc(profileRef, {
        xpPoints: nextXp,
        consultProgress: nextProg,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <FirebaseCtx.Provider value={{
      user,
      userProfile,
      isAuthLoading,
      loginWithGoogle,
      logout,
      createProfile,
      updateXpAndProgress,
    }}>
      {children}
    </FirebaseCtx.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseCtx);
  if (!context) {
    throw new Error("useFirebase must be used inside a FirebaseProvider");
  }
  return context;
};
