import { useState, useEffect } from 'react';
import { supabase, isSupabaseActive, appConfig } from '../lib/config';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'points' | 'materials' | 'streak' | 'special';
  unlocked: boolean;
  unlocked_at?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  target: number;
  current: number;
  reward_points: number;
  expires_at: string;
  completed: boolean;
  completed_at?: string;
}

interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  benefits: string[];
}

export const useGamification = (userId?: string) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    materialsRecycled: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  // Definir níveis do sistema
  const levels: Level[] = [
    {
      level: 1,
      name: 'Eco-Iniciante',
      minPoints: 0,
      maxPoints: 99,
      icon: '🌱',
      benefits: ['Acesso ao sistema básico']
    },
    {
      level: 2,
      name: 'Eco-Amigo',
      minPoints: 100,
      maxPoints: 299,
      icon: '🌿',
      benefits: ['Bônus +10% em pontos', 'Missões diárias']
    },
    {
      level: 3,
      name: 'Eco-Warrior',
      minPoints: 300,
      maxPoints: 799,
      icon: '🌳',
      benefits: ['Bônus +20% em pontos', 'Missões semanais', 'Badge personalizada']
    },
    {
      level: 4,
      name: 'Eco-Master',
      minPoints: 800,
      maxPoints: 1999,
      icon: '🏆',
      benefits: ['Bônus +30% em pontos', 'Missões especiais', 'Ranking destaque']
    },
    {
      level: 5,
      name: 'Eco-Legend',
      minPoints: 2000,
      maxPoints: Infinity,
      icon: '👑',
      benefits: ['Bônus +50% em pontos', 'Acesso VIP', 'Mentor de novatos']
    }
  ];

  // Mock badges para demonstração
  const mockBadges: Badge[] = [
    {
      id: 'first-recycle',
      name: 'Primeira Reciclagem',
      description: 'Recicle seu primeiro material',
      icon: '🏅',
      requirement: 1,
      type: 'materials',
      unlocked: true,
      unlocked_at: new Date().toISOString()
    },
    {
      id: 'eco-friendly',
      name: 'Eco-Friendly',
      description: 'Alcance 100 pontos',
      icon: '🌍',
      requirement: 100,
      type: 'points',
      unlocked: false
    },
    {
      id: 'streak-master',
      name: 'Sequência Master',
      description: 'Mantenha uma sequência de 7 dias',
      icon: '🔥',
      requirement: 7,
      type: 'streak',
      unlocked: false
    },
    {
      id: 'plastic-hero',
      name: 'Herói do Plástico',
      description: 'Recicle 50 materiais plásticos',
      icon: '♻️',
      requirement: 50,
      type: 'special',
      unlocked: false
    }
  ];

  // Mock missions para demonstração
  const mockMissions: Mission[] = [
    {
      id: 'daily-recycle',
      title: 'Reciclagem Diária',
      description: 'Recicle 3 materiais hoje',
      type: 'daily',
      target: 3,
      current: 1,
      reward_points: 20,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: 'weekly-goal',
      title: 'Meta Semanal',
      description: 'Acumule 150 pontos esta semana',
      type: 'weekly',
      target: 150,
      current: 85,
      reward_points: 50,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    },
    {
      id: 'aluminum-specialist',
      title: 'Especialista em Alumínio',
      description: 'Recicle 10 latas de alumínio',
      type: 'special',
      target: 10,
      current: 6,
      reward_points: 80,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }
  ];

  useEffect(() => {
    if (userId) {
      loadUserGamification();
    }
  }, [userId]);

  const loadUserGamification = async () => {
    if (isSupabaseActive() && supabase && userId) {
      try {
        // Carregar badges do usuário
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('*, badges(*)')
          .eq('user_id', userId);

        // Carregar missões do usuário
        const { data: userMissions } = await supabase
          .from('user_missions')
          .select('*, missions(*)')
          .eq('user_id', userId)
          .gte('expires_at', new Date().toISOString());

        // Carregar estatísticas do usuário
        const { data: stats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (userBadges) setBadges(userBadges.map((ub: any) => ({ ...ub.badges, unlocked: true })));
        if (userMissions) setMissions(userMissions.map((um: any) => ({ ...um.missions, current: um.progress })));
        if (stats) {
          setUserStats({
            totalPoints: stats.total_points,
            materialsRecycled: stats.materials_recycled,
            currentStreak: stats.current_streak,
            longestStreak: stats.longest_streak
          });
        }
      } catch (error) {
        console.error('Erro ao carregar gamificação:', error);
        // Fallback para dados mock
        loadMockData();
      }
    } else {
      // Modo demo
      loadMockData();
    }
  };

  const loadMockData = () => {
    setBadges(mockBadges);
    setMissions(mockMissions);
    setUserStats({
      totalPoints: 245,
      materialsRecycled: 18,
      currentStreak: 3,
      longestStreak: 7
    });
  };

  // Calcular nível atual baseado nos pontos
  useEffect(() => {
    const level = levels.find(l => 
      userStats.totalPoints >= l.minPoints && userStats.totalPoints <= l.maxPoints
    );
    setCurrentLevel(level || levels[0]);
  }, [userStats.totalPoints]);

  const addPoints = async (points: number, materialType?: string): Promise<{ levelUp: boolean; newBadges: Badge[] }> => {
    const newTotal = userStats.totalPoints + points;
    const oldLevel = currentLevel?.level || 1;
    
    // Calcular novo nível
    const newLevel = levels.find(l => newTotal >= l.minPoints && newTotal <= l.maxPoints);
    const levelUp = newLevel && newLevel.level > oldLevel;

    // Atualizar estatísticas
    setUserStats(prev => ({
      ...prev,
      totalPoints: newTotal,
      materialsRecycled: prev.materialsRecycled + 1
    }));

    // Verificar novas badges
    const newBadges: Badge[] = [];
    badges.forEach(badge => {
      if (!badge.unlocked) {
        let shouldUnlock = false;
        
        switch (badge.type) {
          case 'points':
            shouldUnlock = newTotal >= badge.requirement;
            break;
          case 'materials':
            shouldUnlock = userStats.materialsRecycled + 1 >= badge.requirement;
            break;
          case 'streak':
            shouldUnlock = userStats.currentStreak >= badge.requirement;
            break;
        }

        if (shouldUnlock) {
          badge.unlocked = true;
          badge.unlocked_at = new Date().toISOString();
          newBadges.push(badge);
        }
      }
    });

    // Atualizar progresso das missões
    setMissions(prev => prev.map(mission => {
      if (!mission.completed) {
        let newProgress = mission.current;
        
        if (mission.type === 'daily' || mission.type === 'weekly') {
          newProgress += 1;
        } else if (mission.id === 'weekly-goal') {
          newProgress = Math.min(mission.target, newProgress + points);
        }

        const completed = newProgress >= mission.target;
        
        return {
          ...mission,
          current: newProgress,
          completed,
          completed_at: completed ? new Date().toISOString() : undefined
        };
      }
      return mission;
    }));

    // Persistir no banco se estiver usando Supabase
    if (isSupabaseActive() && supabase && userId) {
      try {
        await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            total_points: newTotal,
            materials_recycled: userStats.materialsRecycled + 1,
            current_streak: userStats.currentStreak,
            longest_streak: userStats.longestStreak
          });

        // Salvar novas badges
        for (const badge of newBadges) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: userId,
              badge_id: badge.id,
              unlocked_at: badge.unlocked_at
            });
        }
      } catch (error) {
        console.error('Erro ao salvar gamificação:', error);
      }
    }

    return { levelUp: !!levelUp, newBadges };
  };

  const completeMission = async (missionId: string): Promise<number> => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return 0;

    // Marcar como completa e adicionar pontos de recompensa
    setMissions(prev => prev.map(m => 
      m.id === missionId 
        ? { ...m, completed: true, completed_at: new Date().toISOString() }
        : m
    ));

    // Adicionar pontos de recompensa
    await addPoints(mission.reward_points);

    return mission.reward_points;
  };

  const getNextLevelProgress = (): { current: number; needed: number; percentage: number } => {
    if (!currentLevel) return { current: 0, needed: 0, percentage: 0 };

    const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
    if (!nextLevel) return { current: userStats.totalPoints, needed: 0, percentage: 100 };

    const current = userStats.totalPoints - currentLevel.minPoints;
    const needed = nextLevel.minPoints - currentLevel.minPoints;
    const percentage = Math.round((current / needed) * 100);

    return { current, needed, percentage };
  };

  return {
    badges,
    missions,
    currentLevel,
    userStats,
    levels,
    addPoints,
    completeMission,
    getNextLevelProgress,
    isDemo: !isSupabaseActive()
  };
};