-- ========================================
-- ECOPOINTS - SETUP COMPLETO DO ZERO
-- Execute TUDO de uma vez no Supabase SQL Editor
-- ========================================

-- 1. LIMPAR TUDO
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS on_recycling_record_created ON recycling_records CASCADE;
  DROP TRIGGER IF EXISTS validate_recycling_before_insert ON recycling_records CASCADE;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;
DROP VIEW IF EXISTS user_rankings CASCADE;
DROP VIEW IF EXISTS user_daily_stats CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_user_points() CASCADE;
DROP FUNCTION IF EXISTS validate_recycling_limits() CASCADE;
DROP FUNCTION IF EXISTS redeem_reward(uuid, uuid) CASCADE;
DROP TABLE IF EXISTS redeemed_rewards CASCADE;
DROP TABLE IF EXISTS recycling_records CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CRIAR TABELA USERS (SEM RLS)
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  cpf text UNIQUE NOT NULL,
  full_name text NOT NULL,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. CRIAR TABELA MATERIALS (SEM RLS)
CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  points_per_unit integer NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '♻️',
  is_active boolean DEFAULT true,
  max_quantity_per_day integer,
  created_at timestamptz DEFAULT now()
);

-- 4. INSERIR OS 8 MATERIAIS ESCOLARES
INSERT INTO materials (name, points_per_unit, category, description, icon, max_quantity_per_day) VALUES
  ('Garrafa PET', 5, 'Plástico', 'Garrafas de refrigerante, água e sucos', '🍶', 3),
  ('Lata de Alumínio', 8, 'Metal', 'Latas de refrigerante e sucos', '🥤', 3),
  ('Papel Alumínio', 6, 'Metal', 'Papel alumínio usado em lanches e marmitas', '🌯', 3),
  ('Papel', 2, 'Papel', 'Folhas de caderno, papel sulfite, papel toalha', '📄', 3),
  ('Papelão', 3, 'Papel', 'Caixas de lanche, embalagens de pizza, caixas', '📦', 3),
  ('Copo Plástico', 4, 'Plástico', 'Copos descartáveis de água, suco e refrigerante', '🥤', 3),
  ('Embalagem Plástica', 3, 'Plástico', 'Saquinhos de salgadinho, biscoito, embalagens de lanche', '🥡', 3),
  ('Sacola Plástica', 2, 'Plástico', 'Sacolas de supermercado e sacolinhas', '🛍️', 3);

-- 5. CRIAR TABELA RECYCLING_RECORDS (SEM RLS)
CREATE TABLE recycling_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id),
  material_name text NOT NULL,
  quantity decimal(10,2) NOT NULL CHECK (quantity > 0),
  points_earned integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. CRIAR TABELA REWARDS (SEM RLS)
CREATE TABLE rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL CHECK (points_cost > 0),
  icon text DEFAULT '🎁',
  category text NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 7. INSERIR RECOMPENSAS (RECIPIENTES DE PLÁSTICO)
INSERT INTO rewards (name, description, points_cost, icon, category, stock_quantity) VALUES
  ('Garrafa Plástica 500ml', 'Garrafa squeeze de plástico resistente com tampa', 200, '🍶', 'plastico', 150),
  ('Garrafa Plástica 1L', 'Garrafa grande de plástico para água ou suco', 300, '🍶', 'plastico', 100),
  ('Copo Plástico Reutilizável', 'Copo de plástico resistente com tampa e canudo', 150, '🥤', 'plastico', 200),
  ('Kit 6 Copos Plásticos', 'Conjunto com 6 copos coloridos de plástico resistente', 400, '🥤', 'plastico', 80),
  ('Porta Copos Plástico', 'Porta copos de plástico com 4 unidades', 180, '�', 'plastico', 120),
  ('Prato Plástico Reutilizável', 'Prato fundo de plástico resistente', 120, '🍽️', 'plastico', 150),
  ('Kit 6 Pratos Plásticos', 'Conjunto com 6 pratos de plástico coloridos', 350, '�️', 'plastico', 90),
  ('Pote Plástico 500ml', 'Pote hermético de plástico para alimentos', 180, '�', 'plastico', 140),
  ('Kit 3 Potes Plásticos', 'Conjunto com 3 potes de tamanhos diferentes', 400, '�', 'plastico', 100),
  ('Tigela Plástica', 'Tigela grande de plástico para saladas e frutas', 220, '🥗', 'plastico', 110);

-- 8. CRIAR TABELA REDEEMED_REWARDS (SEM RLS)
CREATE TABLE redeemed_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id),
  reward_name text NOT NULL,
  points_spent integer NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'cancelled'))
);

-- 9. TRIGGER: Criar usuário automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, cpf, total_points)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'cpf', '000.000.000-00'),
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 10. TRIGGER: Atualizar pontos do usuário
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET total_points = total_points + NEW.points_earned,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_recycling_record_created
  AFTER INSERT ON recycling_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();

-- 11. VIEW: Ranking de usuários
CREATE OR REPLACE VIEW user_rankings AS
SELECT 
  u.id as user_id,
  u.full_name,
  u.total_points,
  COALESCE(SUM(r.quantity), 0) as total_recycled_items,
  ROW_NUMBER() OVER (ORDER BY u.total_points DESC, u.created_at ASC) as ranking_position,
  MAX(r.created_at) as last_activity
FROM users u
LEFT JOIN recycling_records r ON u.id = r.user_id
GROUP BY u.id, u.full_name, u.total_points, u.created_at
ORDER BY u.total_points DESC, u.created_at ASC;

-- 12. ATIVAR RLS E CRIAR POLICIES
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can read users for ranking"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

-- Materials table
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read materials"
  ON materials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Recycling records table
ALTER TABLE recycling_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own records"
  ON recycling_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON recycling_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Rewards table
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rewards"
  ON rewards FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND stock_quantity > 0);

-- Redeemed rewards table
ALTER TABLE redeemed_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own redeemed rewards"
  ON redeemed_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 13. MENSAGEM FINAL
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ECOPOINTS CONFIGURADO COM SUCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 Tabelas criadas:';
  RAISE NOTICE '   - users';
  RAISE NOTICE '   - materials (8 itens)';
  RAISE NOTICE '   - recycling_records';
  RAISE NOTICE '   - rewards (10 itens)';
  RAISE NOTICE '   - redeemed_rewards';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Triggers configurados:';
  RAISE NOTICE '   - Cadastro automático de usuários';
  RAISE NOTICE '   - Atualização automática de pontos';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 RLS ATIVADO com policies corretas!';
  RAISE NOTICE '========================================';
END $$;
