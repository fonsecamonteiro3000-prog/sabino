import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase não configurado. Usando modo demo.');
  console.log('📝 Para ativar Supabase real:');
  console.log('1. Renomeie .env.example para .env');
  console.log('2. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  console.log('3. Execute as migrations SQL no Supabase');
}

// Cliente Supabase (será undefined se não configurado)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

// Helper para verificar se Supabase está ativo
export const isSupabaseActive = (): boolean => {
  return supabase !== null;
};

// Configurações da aplicação
export const appConfig = {
  // Modo de desenvolvimento
  isDevelopment: import.meta.env.DEV,
  
  // Supabase ativo?
  hasSupabase: isSupabaseActive(),
  
  // URLs da aplicação
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  
  // Configurações de gamificação
  gamification: {
    pointsPerMaterial: {
      'PET (Garrafas)': 5,
      'Alumínio (Latas)': 8,
      'Papel': 3,
      'Papelão': 4,
      'Vidro': 6,
      'Plástico Rígido': 7,
      'Metal': 9,
      'Eletrônicos': 15
    },
    badgeLevels: [
      { name: 'Eco-Iniciante', minPoints: 0, icon: '🌱' },
      { name: 'Eco-Amigo', minPoints: 100, icon: '🌿' },
      { name: 'Eco-Warrior', minPoints: 500, icon: '🌳' },
      { name: 'Eco-Master', minPoints: 1000, icon: '🏆' },
      { name: 'Eco-Legend', minPoints: 2500, icon: '👑' }
    ]
  },
  
  // Configurações de upload
  storage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    bucket: 'recycling-photos'
  }
};

// Log do status de configuração
if (appConfig.isDevelopment) {
  console.log('🔧 Configuração da Aplicação:');
  console.log(`📡 Supabase: ${appConfig.hasSupabase ? '✅ Ativo' : '❌ Demo Mode'}`);
  console.log(`🌐 Base URL: ${appConfig.baseUrl}`);
  console.log(`🎮 Gamificação: ${Object.keys(appConfig.gamification.pointsPerMaterial).length} materiais configurados`);
}