import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import {
  syncSession,
  type SessionProfile,
  type SyncOptions,
} from "./sync.ts";

export type AuthStatus = "loading" | "authed" | "anon";

export interface SignUpOptions {
  role?: string;
}

export interface AuthValue {
  user: User | null;
  profile: SessionProfile | null;
  status: AuthStatus;
  getIdToken: () => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    options?: SignUpOptions,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const pendingSyncRef = useRef<SyncOptions | null>(null);
  const bootstrappingRef = useRef(false);

  const bootstrap = useCallback(async (nextUser: User, opts?: SyncOptions) => {
    const token = await nextUser.getIdToken();
    const synced = await syncSession(token, {
      role: opts?.role,
      fullName: opts?.fullName ?? nextUser.displayName,
    });
    setUser(nextUser);
    setProfile(synced);
    setStatus("authed");
    return synced;
  }, []);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setProfile(null);
        setStatus("anon");
        pendingSyncRef.current = null;
        return;
      }

      if (bootstrappingRef.current) return;

      setStatus("loading");
      try {
        const pending = pendingSyncRef.current;
        pendingSyncRef.current = null;
        await bootstrap(nextUser, pending ?? undefined);
      } catch {
        setProfile(null);
        setStatus("anon");
      }
    });
  }, [bootstrap]);

  const withBootstrap = useCallback(
    async (run: () => Promise<User>, opts?: SyncOptions) => {
      bootstrappingRef.current = true;
      try {
        const nextUser = await run();
        await bootstrap(nextUser, opts);
      } finally {
        bootstrappingRef.current = false;
      }
    },
    [bootstrap],
  );

  const value = useMemo<AuthValue>(() => {
    return {
      user,
      profile,
      status,
      getIdToken: async () => (user ? user.getIdToken() : null),
      signIn: async (email, password) => {
        await withBootstrap(() =>
          signInWithEmailAndPassword(firebaseAuth, email, password).then(
            (c) => c.user,
          ),
        );
      },
      signUp: async (email, password, fullName, options) => {
        const syncOpts: SyncOptions = {
          role: options?.role ?? "curator",
          fullName: fullName ?? null,
        };
        await withBootstrap(async () => {
          const cred = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
          );
          if (fullName) await updateProfile(cred.user, { displayName: fullName });
          return cred.user;
        }, syncOpts);
      },
      signOut: async () => {
        await fbSignOut(firebaseAuth);
      },
      sendReset: async (email) => {
        await sendPasswordResetEmail(firebaseAuth, email);
      },
      signInWithGoogle: async () => {
        await withBootstrap(() =>
          signInWithPopup(firebaseAuth, new GoogleAuthProvider()).then(
            (c) => c.user,
          ),
        );
      },
      signInWithApple: async () => {
        await withBootstrap(() =>
          signInWithPopup(firebaseAuth, new OAuthProvider("apple.com")).then(
            (c) => c.user,
          ),
        );
      },
    };
  }, [user, profile, status, withBootstrap]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
