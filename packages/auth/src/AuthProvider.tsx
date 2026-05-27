import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./firebase.ts";

export type AuthStatus = "loading" | "authed" | "anon";

export interface AuthValue {
  user: User | null;
  status: AuthStatus;
  /** Cached ID token; refreshes lazily through `getIdToken()`. */
  getIdToken: () => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setStatus(u ? "authed" : "anon");
    });
  }, []);

  const value = useMemo<AuthValue>(() => {
    return {
      user,
      status,
      getIdToken: async () => (user ? user.getIdToken() : null),
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      },
      signUp: async (email, password, fullName) => {
        const cred = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password,
        );
        if (fullName) await updateProfile(cred.user, { displayName: fullName });
      },
      signOut: async () => {
        await fbSignOut(firebaseAuth);
      },
      sendReset: async (email) => {
        await sendPasswordResetEmail(firebaseAuth, email);
      },
      signInWithGoogle: async () => {
        await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      },
      signInWithApple: async () => {
        await signInWithPopup(firebaseAuth, new OAuthProvider("apple.com"));
      },
    };
  }, [user, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
