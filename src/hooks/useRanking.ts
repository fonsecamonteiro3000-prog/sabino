import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive } from '../lib/config';
import { UserRanking } from '../types';

// Mock data for demonstration
const mockRankings: UserRanking[] = [
  {
    user_id: '1',
    full_name: 'Ana Silva',
    total_points: 1250,
    total_recycled_items: 89,
    ranking_position: 1
  },
  {
    user_id: '2',
    full_name: 'Carlos Santos',
    total_points: 1180,
    total_recycled_items: 76,
    ranking_position: 2
  },
  {
    user_id: '3',
    full_name: 'Marina Costa',
    total_points: 1050,
    total_recycled_items: 68,
    ranking_position: 3
  },
  {
    user_id: '4',
    full_name: 'Bruno Oliveira',
    total_points: 890,
    total_recycled_items: 52,
    ranking_position: 4
  },
  {
    user_id: '5',
    full_name: 'Juliana Pereira',
    total_points: 750,
    total_recycled_items: 45,
    ranking_position: 5
  }
];

export const useRanking = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      if (isSupabaseActive() && supabase) {
        // Fetch real data from Supabase
        try {
          const { data, error: fetchError } = await supabase
            .from('user_rankings')
            .select('*')
            .order('ranking_position', { ascending: true })
            .limit(10);

          if (fetchError) {
            console.error('Erro ao buscar rankings:', fetchError);
            setError(fetchError.message);
            setRankings(mockRankings); // Fallback to mock data
          } else {
            setRankings(data || []);
          }
          setLoading(false);
        } catch (err) {
          console.error('Erro inesperado:', err);
          setError('Erro ao carregar ranking');
          setRankings(mockRankings);
          setLoading(false);
        }
      } else {
        // Demo mode - use mock data
        const timer = setTimeout(() => {
          setRankings(mockRankings);
          setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    };

    fetchRankings();

    // Subscribe to real-time updates if Supabase is active
    if (isSupabaseActive() && supabase) {
      const subscription = supabase
        .channel('user_rankings_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users'
        }, () => {
          fetchRankings(); // Refetch on any user update
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return {
    rankings,
    loading,
    error,
    isDemo: !isSupabaseActive()
  };
};