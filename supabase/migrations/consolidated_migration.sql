-- ========================================
-- MIGRATION 1: Create users table
-- ========================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  cpf text UNIQUE NOT NULL,
  full_name text NOT NULL,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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
  TO anon
  USING (true);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, cpf)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'cpf', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ========================================
-- MIGRATION 2: Create materials table
-- ========================================

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  points_per_unit integer NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '♻️',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active materials"
  ON materials FOR SELECT
  TO public
  USING (is_active = true);

INSERT INTO materials (name, points_per_unit, category, description, icon) VALUES
  ('Garrafa PET', 5, 'Plástico', 'Garrafas de refrigerante, água e sucos', '🍶'),
  ('Lata de Alumínio', 8, 'Metal', 'Latas de refrigerante e sucos', '🥤'),
  ('Papel Alumínio', 6, 'Metal', 'Papel alumínio usado em lanches e marmitas', '🌯'),
  ('Papel', 2, 'Papel', 'Folhas de caderno, papel sulfite, papel toalha', '📄'),
  ('Papelão', 3, 'Papel', 'Caixas de lanche, embalagens de pizza, caixas', '📦'),
  ('Copo Plástico', 4, 'Plástico', 'Copos descartáveis de água, suco e refrigerante', '🥤'),
  ('Embalagem Plástica', 3, 'Plástico', 'Saquinhos de salgadinho, biscoito, embalagens de lanche', '🥡'),
  ('Sacola Plástica', 2, 'Plástico', 'Sacolas de supermercado e sacolinhas', '�️')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- MIGRATION 3: Create recycling_records table
-- ========================================

CREATE TABLE IF NOT EXISTS recycling_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id),
  material_name text NOT NULL,
  quantity decimal(10,2) NOT NULL CHECK (quantity > 0),
  points_earned integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recycling_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recycling records"
  ON recycling_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recycling records"
  ON recycling_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET total_points = total_points + NEW.points_earned,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update points on new recycling record
DROP TRIGGER IF EXISTS on_recycling_record_created ON recycling_records;
CREATE TRIGGER on_recycling_record_created
  AFTER INSERT ON recycling_records
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();

-- ========================================
-- MIGRATION 4: Create user_rankings view
-- ========================================

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
