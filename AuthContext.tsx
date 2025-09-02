import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function register(email: string, password: string, displayName: string) {
    try {
      console.log('Attempting registration with:', { email, displayName });
      console.log('Supabase URL:', supabase.supabaseUrl);
      
      // First attempt normal registration
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName
          },
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`
        }
      });

      // If user already exists, throw appropriate error
      if (signUpError && signUpError.message === 'User already registered') {
        throw new Error('Cet e-mail est déjà utilisé. Connecte-toi ou utilise un autre e-mail.');
      } else if (signUpError) {
        console.error('Registration error:', signUpError);
        throw signUpError;
      }
      
      // Registration successful
      if (signUpData.user) {
        console.log('Registration successful:', signUpData.user);
        await updateProfileTable(signUpData.user.id, displayName);
        setCurrentUser(signUpData.user);
      }
      
      return;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      console.log('Attempting login for:', email);
      console.log('Supabase URL:', supabase.supabaseUrl);
      
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Login response:', { 
        user: user ? { id: user.id, email: user.email } : null, 
        error: error ? { message: error.message, code: error.code } : null 
      });
      
      if (error) throw error;
      
      if (!user) {
        throw new Error('Aucun utilisateur retourné après la connexion');
      }
      
      console.log('Login successful for user:', user?.email);
      
      return;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async function updateUserProfile(displayName: string) {
    if (!currentUser) throw new Error("No user logged in");
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });
      if (error) throw error;
      if (user) setCurrentUser(user);
      return;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async function resendConfirmationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
      return;
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      throw error;
    }
  }

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error checking session:', error);
      }
      console.log('Current session:', session?.user?.email || 'No session');
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'No user');
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    resendConfirmationEmail,
  };

  const updateProfileTable = async (userId: string, displayName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: displayName,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('❌ Profile update error:', error);
      } else {
        console.log('✅ Profile updated successfully');
      }
    } catch (error) {
      console.error('❌ Profile update failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}