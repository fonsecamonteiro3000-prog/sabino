-- ========================================
-- MIGRATION: Add Rewards System
-- ========================================

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_required integer NOT NULL,
  icon text DEFAULT '🎁',
  category text NOT NULL,
  stock integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create redeemed_rewards table
CREATE TABLE IF NOT EXISTS redeemed_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id),
  reward_name text NOT NULL,
  points_spent integer NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'delivered'))
);

-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemed_rewards ENABLE ROW LEVEL SECURITY;

-- Policies for rewards
CREATE POLICY "Public can read active rewards"
  ON rewards FOR SELECT
  TO public
  USING (is_active = true);

-- Policies for redeemed_rewards
CREATE POLICY "Users can read own redeemed rewards"
  ON redeemed_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redeemed rewards"
  ON redeemed_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to redeem reward (atomic transaction)
CREATE OR REPLACE FUNCTION redeem_reward(
  p_user_id uuid,
  p_reward_id uuid,
  p_reward_name text,
  p_points_spent integer
)
RETURNS void AS $$
DECLARE
  v_user_points integer;
  v_reward_stock integer;
BEGIN
  -- Get user points
  SELECT total_points INTO v_user_points
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user has enough points
  IF v_user_points < p_points_spent THEN
    RAISE EXCEPTION 'Pontos insuficientes';
  END IF;

  -- Get reward stock
  SELECT stock INTO v_reward_stock
  FROM rewards
  WHERE id = p_reward_id
  FOR UPDATE;

  -- Check if reward has stock
  IF v_reward_stock <= 0 THEN
    RAISE EXCEPTION 'Recompensa sem estoque';
  END IF;

  -- Deduct points from user
  UPDATE users
  SET total_points = total_points - p_points_spent,
      updated_at = now()
  WHERE id = p_user_id;

  -- Decrease reward stock
  UPDATE rewards
  SET stock = stock - 1
  WHERE id = p_reward_id;

  -- Insert redeemed reward
  INSERT INTO redeemed_rewards (user_id, reward_id, reward_name, points_spent)
  VALUES (p_user_id, p_reward_id, p_reward_name, p_points_spent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial rewards data
INSERT INTO rewards (name, description, points_required, icon, category, stock) VALUES
  ('Garrafa Térmica 500ml', 'Garrafa térmica de aço inoxidável, mantém bebidas quentes/frias por até 12h', 500, '🍶', 'metal', 50),
  ('Kit 3 Potes Plásticos', 'Conjunto de 3 potes herméticos para armazenar alimentos', 300, '🥡', 'plastico', 100),
  ('Canudo Reutilizável de Metal', 'Kit com 4 canudos de inox + escova de limpeza', 150, '🥤', 'metal', 200),
  ('Sacola Ecológica Premium', 'Sacola reutilizável de lona resistente, capacidade 15kg', 200, '🛍️', 'papel', 150),
  ('Copo Térmico 350ml', 'Copo térmico com tampa, ideal para café e chá', 400, '☕', 'plastico', 75),
  ('Porta Garrafas de Vidro', 'Suporte de bambu para organizar garrafas', 250, '🍾', 'vidro', 60),
  ('Marmita Térmica 1L', 'Marmita de aço inox com divisórias e talheres', 600, '🍱', 'metal', 40),
  ('Kit Lancheira Ecológica', 'Wrap reutilizável + saco de silicone + guardanapo de pano', 350, '🥪', 'papel', 80),
  ('Garrafa Squeeze 1L', 'Garrafa plástica BPA free com marcador de consumo', 180, '💧', 'plastico', 120),
  ('Organizador de Tampas', 'Organizador de plástico reciclado para tampas de potes', 220, '🔧', 'plastico', 90),
  ('Jarra de Vidro 2L', 'Jarra de vidro borosilicato com tampa de bambu', 450, '🏺', 'vidro', 50),
  ('Vale Desconto 50 Reais', 'Vale compras em lojas parceiras sustentáveis', 1000, '🎁', 'papel', 30)
ON CONFLICT DO NOTHING;
