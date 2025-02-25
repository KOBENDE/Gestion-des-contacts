import { create } from 'zustand';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    // Simulation d'authentification
    if (email && password) {
      set({ user: { id: '1', email } });
    } else {
      throw new Error('Email et mot de passe requis');
    }
  },
  signUp: async (email, password) => {
    // Simulation d'inscription
    if (email && password) {
      return;
    } else {
      throw new Error('Email et mot de passe requis');
    }
  },
  signOut: async () => {
    set({ user: null });
  },
}));