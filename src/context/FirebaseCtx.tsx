import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

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
  dogPhoto?: string;
  dogAvatar?: string;
  createdAt: any;
  updatedAt: any;
}
interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  profileError: string;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (
    name: string,
    dogName: string,
    breed: string,
    age: string,
  ) => Promise<void>;
  updateXpAndProgress: (xp: number, progress: number) => Promise<void>;
}
const FirebaseCtx = createContext<FirebaseContextType | undefined>(undefined);
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  useEffect(() => {
    let stopProfile: undefined | (() => void);
    setPersistence(auth, browserLocalPersistence).catch(() => undefined);
    const stopAuth = onAuthStateChanged(auth, (current) => {
      stopProfile?.();
      setUser(current);
      setUserProfile(null);
      setProfileError("");
      if (!current) {
        setIsAuthLoading(false);
        return;
      }
      setIsAuthLoading(true);
      stopProfile = onSnapshot(
        doc(db, "users", current.uid),
        (snapshot) => {
          setUserProfile(
            snapshot.exists() ? (snapshot.data() as UserProfile) : null,
          );
          setIsAuthLoading(false);
        },
        () => {
          setProfileError(
            "Não foi possível carregar seu perfil. Tente novamente.",
          );
          setIsAuthLoading(false);
        },
      );
    });
    return () => {
      stopAuth();
      stopProfile?.();
    };
  }, []);
  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };
  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
  };
  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
  const logout = async () => {
    await signOut(auth);
  };
  const createProfile = async (
    name: string,
    dogName: string,
    dogBreed: string,
    dogAge: string,
  ) => {
    if (!user) throw new Error("Entre para continuar.");
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name.trim(),
      dogName: dogName.trim(),
      dogBreed: dogBreed.trim() || "Não informado",
      dogAge: dogAge.trim() || "Não informado",
      focusArea: "",
      nextConsult: "",
      consultProgress: 0,
      xpPoints: 0,
      streakCount: 0,
      unlockedBadges: [],
      isAuthorized: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };
  const updateXpAndProgress = async (xp: number, progress: number) => {
    if (!user || !userProfile) return;
    await updateDoc(doc(db, "users", user.uid), {
      xpPoints: Math.max(0, userProfile.xpPoints + xp),
      consultProgress: Math.max(
        0,
        Math.min(100, userProfile.consultProgress + progress),
      ),
      updatedAt: serverTimestamp(),
    });
  };
  return (
    <FirebaseCtx.Provider
      value={{
        user,
        userProfile,
        isAuthLoading,
        profileError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        createProfile,
        updateXpAndProgress,
      }}
    >
      {children}
    </FirebaseCtx.Provider>
  );
};
export const useFirebase = () => {
  const ctx = useContext(FirebaseCtx);
  if (!ctx) throw new Error("FirebaseProvider necessário.");
  return ctx;
};
