export interface User {
  id: string;
  email: string;
  cpf: string;
  full_name: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  name: string;
  points_per_unit: number;
  category: string;
  description: string;
  icon: string;
  max_quantity_per_day?: number;
}

export interface RecyclingRecord {
  id: string;
  user_id: string;
  material_id: string;
  material_name: string;
  quantity: number;
  points_earned: number;
  created_at: string;
}

export interface UserRanking {
  user_id: string;
  full_name: string;
  total_points: number;
  total_recycled_items: number;
  ranking_position: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  icon: string;
  category: 'plastico' | 'vidro' | 'metal' | 'papel';
  stock: number;
  image_url?: string;
}

export interface RedeemedReward {
  id: string;
  user_id: string;
  reward_id: string;
  reward_name: string;
  points_spent: number;
  redeemed_at: string;
  status: 'pending' | 'claimed' | 'delivered';
}