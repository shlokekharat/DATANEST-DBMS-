import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  localPhoto: string | null;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfilePhoto: (photoDataUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [localPhoto, setLocalPhoto] = useState<string | null>(() => {
    return localStorage.getItem('datanest_local_photo');
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      // Force refresh auth state
      setUser({ ...userCredential.user, displayName: name });
    } catch (error) {
      console.error("Email registration error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email login error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePhoto = async (photoDataUrl: string) => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await updateProfile(auth.currentUser, {
          photoURL: photoDataUrl
        });
        const refreshedUser = auth.currentUser;
        setUser({ ...refreshedUser, photoURL: photoDataUrl } as any);
      } catch (error) {
        console.error("Failed to update profile photo: ", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.setItem('datanest_local_photo', photoDataUrl);
      setLocalPhoto(photoDataUrl);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    localPhoto,
    loginWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout,
    updateProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
