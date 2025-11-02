import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive } from '../lib/config';
import { Reward, RedeemedReward } from '../types';
import { rewards as rewardsData } from '../data/rewards';

export const useRewards = (userId?: string) => {
  const [rewards, setRewards] = useState<Reward[]>(rewardsData);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchRedeemedRewards = async () => {
      if (isSupabaseActive() && supabase) {
        try {
          const { data, error } = await supabase
            .from('redeemed_rewards')
            .select('*')
            .eq('user_id', userId)
            .order('redeemed_at', { ascending: false });

          if (error) throw error;
          setRedeemedRewards(data || []);
        } catch (err) {
          console.error('Erro ao carregar recompensas resgatadas:', err);
        }
      }
    };

    fetchRedeemedRewards();
  }, [userId]);

  const redeemReward = async (rewardId: string, userPoints: number): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, error: 'Recompensa não encontrada' };
    }

    if (userPoints < reward.points_required) {
      return { success: false, error: `Você precisa de ${reward.points_required - userPoints} pontos a mais` };
    }

    if (reward.stock <= 0) {
      return { success: false, error: 'Recompensa sem estoque' };
    }

    setLoading(true);
    setError(null);

    try {
      if (isSupabaseActive() && supabase) {
        // Usar transaction via RPC function
        const { data, error: rpcError } = await supabase.rpc('redeem_reward', {
          p_user_id: userId,
          p_reward_id: rewardId,
          p_reward_name: reward.name,
          p_points_spent: reward.points_required
        });

        if (rpcError) throw rpcError;

        // Atualizar estado local
        const newRedemption: RedeemedReward = {
          id: String(Date.now()),
          user_id: userId,
          reward_id: rewardId,
          reward_name: reward.name,
          points_spent: reward.points_required,
          redeemed_at: new Date().toISOString(),
          status: 'pending'
        };
        setRedeemedRewards(prev => [newRedemption, ...prev]);
        
        setLoading(false);
        return { success: true };
      } else {
        // Demo mode - simular resgate
        const newRedemption: RedeemedReward = {
          id: String(Date.now()),
          user_id: userId,
          reward_id: rewardId,
          reward_name: reward.name,
          points_spent: reward.points_required,
          redeemed_at: new Date().toISOString(),
          status: 'pending'
        };
        
        setTimeout(() => {
          setRedeemedRewards(prev => [newRedemption, ...prev]);
          setLoading(false);
        }, 1000);
        
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err instanceof Error ? err.message : 'Erro ao resgatar recompensa';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return {
    rewards,
    redeemedRewards,
    loading,
    error,
    redeemReward,
    isDemo: !isSupabaseActive()
  };
};
