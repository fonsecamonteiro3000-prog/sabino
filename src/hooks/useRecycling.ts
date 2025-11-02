import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive } from '../lib/config';
import { RecyclingRecord, Material } from '../types';
import { materials as materialData, RECYCLING_LIMITS } from '../data/materials';

// Mock data for demo mode
const mockRecords: RecyclingRecord[] = [
  {
    id: '1',
    user_id: 'demo-user',
    material_id: '1',
    material_name: 'Garrafa PET',
    quantity: 5,
    points_earned: 25,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    material_id: '2',
    material_name: 'Lata de Alumínio',
    quantity: 10,
    points_earned: 80,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export const useRecycling = (userId?: string) => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (isSupabaseActive() && supabase) {
        // Real mode - fetch from database
        try {
          const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('is_active', true)
            .order('category', { ascending: true });

          if (error) {
            console.warn('⚠️ Erro ao buscar materiais do Supabase, usando dados locais:', error.message);
            setMaterials(materialData);
          } else {
            console.log('✅ Materiais carregados do Supabase:', data?.length);
            setMaterials(data || materialData);
          }
        } catch (err) {
          console.error('❌ Erro ao carregar materiais:', err);
          console.log('📦 Usando dados locais como fallback');
          setMaterials(materialData); // Fallback to local data
        }
      } else {
        // Demo mode - use local data
        console.log('📦 Modo demo: usando materiais locais');
        setMaterials(materialData);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRecords = async () => {
      if (isSupabaseActive() && supabase) {
        // Real mode - fetch from database
        try {
          const { data, error } = await supabase
            .from('recycling_records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setRecords(data || []);
        } catch (err) {
          console.error('Erro ao carregar histórico:', err);
          setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
          setRecords(mockRecords); // Fallback to mock data
        } finally {
          setLoading(false);
        }
      } else {
        // Demo mode - use mock data
        setTimeout(() => {
          setRecords(mockRecords);
          setLoading(false);
        }, 500);
      }
    };

    fetchRecords();
  }, [userId]);

  const addRecyclingRecord = async (materialId: string, quantity: number) => {
    if (!userId) throw new Error('Usuário não autenticado');

    try {
      // Get material info
      const material = materials.find(m => m.id === materialId);
      if (!material) throw new Error('Material não encontrado');

      // VALIDAÇÃO 1: Verificar limite de registros por dia (3 por dia)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRecords = records.filter(r => {
        const recordDate = new Date(r.created_at);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      if (todayRecords.length >= RECYCLING_LIMITS.MAX_RECORDS_PER_DAY) {
        throw new Error(`Você já fez ${RECYCLING_LIMITS.MAX_RECORDS_PER_DAY} reciclagens hoje! Volte amanhã. 🌱`);
      }

      // VALIDAÇÃO 2: Verificar limite de quantidade por material
      if (material.max_quantity_per_day && quantity > material.max_quantity_per_day) {
        throw new Error(`Quantidade máxima para ${material.name} é ${material.max_quantity_per_day} por dia!`);
      }

      // VALIDAÇÃO 3: Verificar se já atingiu o limite de quantidade deste material hoje
      if (material.max_quantity_per_day) {
        const todayQuantityThisMaterial = todayRecords
          .filter(r => r.material_id === materialId)
          .reduce((sum, r) => sum + r.quantity, 0);

        if (todayQuantityThisMaterial + quantity > material.max_quantity_per_day) {
          const remaining = material.max_quantity_per_day - todayQuantityThisMaterial;
          throw new Error(`Você já reciclou ${todayQuantityThisMaterial} ${material.name} hoje. Limite restante: ${remaining}`);
        }
      }

      // VALIDAÇÃO 4: Verificar limite total de pontos por dia
      const todayPoints = todayRecords.reduce((sum, r) => sum + r.points_earned, 0);
      const pointsEarned = material.points_per_unit * quantity;

      if (todayPoints + pointsEarned > RECYCLING_LIMITS.MAX_POINTS_PER_DAY) {
        throw new Error(`Você já ganhou ${todayPoints} pontos hoje. Limite diário: ${RECYCLING_LIMITS.MAX_POINTS_PER_DAY} pontos.`);
      }

      if (isSupabaseActive() && supabase) {
        // Real mode - insert into database (validação também será feita no backend)
        const { data, error } = await supabase
          .from('recycling_records')
          .insert({
            user_id: userId,
            material_id: materialId,
            material_name: material.name,
            quantity,
            points_earned: pointsEarned
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setRecords(prev => [data, ...prev]);
        return data;
      } else {
        // Demo mode - simulate insert
        const newRecord: RecyclingRecord = {
          id: String(Date.now()),
          user_id: userId,
          material_id: materialId,
          material_name: material.name,
          quantity,
          points_earned: pointsEarned,
          created_at: new Date().toISOString()
        };
        setRecords(prev => [newRecord, ...prev]);
        return newRecord;
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    records,
    materials,
    loading,
    error,
    addRecyclingRecord,
    isDemo: !isSupabaseActive()
  };
};