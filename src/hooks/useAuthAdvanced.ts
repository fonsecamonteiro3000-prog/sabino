import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive } from '../lib/config';

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  avatar_url?: string;
  total_points: number;
  level: number;
  badges: string[];
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuthAdvanced = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Mock user para modo demo
  const mockUser: User = {
    id: 'demo-user-123',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    avatar_url: undefined,
    total_points: 245,
    level: 2,
    badges: ['Eco-Iniciante', 'Eco-Amigo'],
    created_at: new Date().toISOString()
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (isSupabaseActive() && supabase) {
        // Modo Supabase Real
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Buscar dados completos do usuário
            const { data: userData } = await supabase!
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userData) {
              setAuthState({
                user: userData,
                isLoading: false,
                isAuthenticated: true
              });
            }
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false
            });
          }

          // Listener para mudanças de auth
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const { data: userData } = await supabase!
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              setAuthState({
                user: userData,
                isLoading: false,
                isAuthenticated: true
              });
            } else {
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false
              });
            }
          });

        } catch (error) {
          console.error('Erro na inicialização do auth:', error);
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
      } else {
        // Modo Demo
        console.log('🎭 Usando autenticação em modo demo');
        setTimeout(() => {
          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true
          });
        }, 1000); // Simular loading
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive() && supabase) {
      // Login real via Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Erro inesperado no login' };
      }
    } else {
      // Login demo (sempre sucesso)
      return new Promise((resolve) => {
        setTimeout(() => {
          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true
          });
          resolve({ success: true });
        }, 1500); // Simular delay de rede
      });
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    name: string;
    cpf: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive() && supabase) {
      // Registro real via Supabase
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              cpf: userData.cpf
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (error) {
        return { success: false, error: 'Erro inesperado no registro' };
      }
    } else {
      // Registro demo (sempre sucesso)
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            ...mockUser,
            name: userData.name,
            email: userData.email,
            cpf: userData.cpf,
            total_points: 0,
            level: 1,
            badges: []
          };
          
          setAuthState({
            user: newUser,
            isLoading: false,
            isAuthenticated: true
          });
          resolve({ success: true });
        }, 1500);
      });
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseActive() && supabase) {
      // Logout real
      await supabase.auth.signOut();
    } else {
      // Logout demo
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  const updateUserPoints = async (pointsToAdd: number): Promise<void> => {
    if (!authState.user) return;

    if (isSupabaseActive() && supabase) {
      // Atualizar pontos reais no banco
      const newTotal = authState.user.total_points + pointsToAdd;
      
      await supabase
        .from('users')
        .update({ total_points: newTotal })
        .eq('id', authState.user.id);

      // Atualizar estado local
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          total_points: newTotal
        } : null
      }));
    } else {
      // Atualizar pontos demo (apenas local)
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          total_points: prev.user.total_points + pointsToAdd
        } : null
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateUserPoints,
    isDemo: !isSupabaseActive()
  };
};