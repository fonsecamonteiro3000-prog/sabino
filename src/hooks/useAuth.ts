import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive } from '../lib/config';

export interface AuthUser {
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
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Mock user para modo demo
  const mockUser: AuthUser = {
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
    let mounted = true;
    
    const initializeAuth = async () => {
      if (isSupabaseActive() && supabase) {
        // Modo Supabase Real
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!mounted) return;
          
          if (session?.user) {
            // Buscar dados completos do usuário
            const { data: userData } = await supabase!
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!mounted) return;

            if (userData) {
              setAuthState({
                user: {
                  id: userData.id,
                  name: userData.full_name,
                  email: userData.email,
                  cpf: userData.cpf,
                  total_points: userData.total_points,
                  level: 1,
                  badges: [],
                  created_at: userData.created_at
                },
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
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false
            });
          }

          // Listener para mudanças de auth
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state changed:', event);
            
            if (!mounted) return;
            
            if (session?.user) {
              const { data: userData } = await supabase!
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (!mounted) return;

              if (userData) {
                console.log('✅ User data loaded:', userData.full_name);
                setAuthState({
                  user: {
                    id: userData.id,
                    name: userData.full_name,
                    email: userData.email,
                    cpf: userData.cpf,
                    total_points: userData.total_points,
                    level: 1,
                    badges: [],
                    created_at: userData.created_at
                  },
                  isLoading: false,
                  isAuthenticated: true
                });
              }
            } else {
              console.log('❌ User logged out');
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false
              });
            }
          });

          // Cleanup
          return () => {
            subscription.unsubscribe();
          };

        } catch (error) {
          console.error('Erro na inicialização do auth:', error);
          if (mounted) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false
            });
          }
        }
      } else {
        // Modo Demo - não mostrar usuário logado inicialmente
        console.log('🎭 Usando autenticação em modo demo');
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
      }
    };

    // Timeout de segurança: forçar loading=false após 3 segundos
    const safetyTimeout = setTimeout(() => {
      console.warn('⏱️ Timeout de segurança ativado - forçando loading=false');
      if (mounted) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    }, 3000);

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
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

        // Buscar dados completos do usuário
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userData) {
            setAuthState({
              user: {
                id: userData.id,
                name: userData.full_name,
                email: userData.email,
                cpf: userData.cpf,
                total_points: userData.total_points,
                level: 1,
                badges: [],
                created_at: userData.created_at
              },
              isLoading: false,
              isAuthenticated: true
            });
          } else {
            console.warn('Usuário não encontrado na tabela users:', userError);
          }
        }

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Erro inesperado no login' };
      }
    } else {
      // Login demo (sempre sucesso)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('✅ Login demo bem-sucedido para:', email);
          setAuthState({
            user: { ...mockUser, email, name: email.split('@')[0] },
            isLoading: false,
            isAuthenticated: true
          });
          resolve({ success: true });
        }, 1500); // Simular delay de rede
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, cpf: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseActive() && supabase) {
      // Registro real via Supabase
      try {
        console.log('📝 Criando conta para:', fullName);
        
        // 1. Criar usuário no auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: fullName,
              cpf: cpf
            }
          }
        });

        if (authError) {
          console.error('❌ Erro no auth:', authError);
          return { success: false, error: authError.message };
        }

        console.log('✅ Auth criado, user ID:', authData.user?.id);

        // 2. Criar registro na tabela users manualmente (caso trigger falhe)
        if (authData.user) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: email,
              full_name: fullName,
              cpf: cpf,
              total_points: 0
            });

          if (insertError) {
            if (insertError.message.includes('duplicate')) {
              console.log('⚠️ Usuário já existe na tabela (trigger funcionou)');
            } else {
              console.error('❌ Erro ao inserir usuário:', insertError);
            }
          } else {
            console.log('✅ Usuário inserido na tabela users');
          }

          // 3. Atualizar estado local imediatamente
          const newUser = {
            id: authData.user.id,
            name: fullName,
            email: email,
            cpf: cpf,
            total_points: 0,
            level: 1,
            badges: [],
            created_at: new Date().toISOString()
          };
          
          console.log('🔄 Atualizando estado local:', newUser);
          
          setAuthState({
            user: newUser,
            isLoading: false,
            isAuthenticated: true
          });
        }

        return { success: true };
      } catch (error: any) {
        console.error('❌ Erro geral:', error);
        return { success: false, error: error.message || 'Erro inesperado no registro' };
      }
    } else {
      // Registro demo (sempre sucesso)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('✅ Cadastro demo bem-sucedido para:', fullName);
          const newUser = {
            ...mockUser,
            name: fullName,
            email: email,
            cpf: cpf,
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
      // Atualizar estado local após logout
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    } else {
      // Logout demo
      console.log('🚪 Logout realizado');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  // Manter compatibilidade com interface antiga
  return {
    user: authState.user,
    loading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    signIn,
    signUp,
    signOut,
    isDemo: !isSupabaseActive()
  };
};