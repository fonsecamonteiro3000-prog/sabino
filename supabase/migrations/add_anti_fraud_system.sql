-- ========================================
-- SISTEMA ANTI-FRAUDE - LIMITES DE RECICLAGEM
-- ========================================

-- Adicionar campo max_quantity_per_day na tabela materials
ALTER TABLE materials ADD COLUMN IF NOT EXISTS max_quantity_per_day integer;

-- Atualizar materiais existentes com limites
UPDATE materials SET max_quantity_per_day = 10 WHERE name = 'Garrafa PET';
UPDATE materials SET max_quantity_per_day = 10 WHERE name = 'Lata de Alumínio';
UPDATE materials SET max_quantity_per_day = 5 WHERE name = 'Papel Alumínio';
UPDATE materials SET max_quantity_per_day = 50 WHERE name = 'Papel';
UPDATE materials SET max_quantity_per_day = 5 WHERE name = 'Papelão';
UPDATE materials SET max_quantity_per_day = 15 WHERE name = 'Copo Plástico';
UPDATE materials SET max_quantity_per_day = 10 WHERE name = 'Embalagem Plástica';
UPDATE materials SET max_quantity_per_day = 20 WHERE name = 'Sacola Plástica';

-- Função para validar limites de reciclagem
CREATE OR REPLACE FUNCTION validate_recycling_limits()
RETURNS TRIGGER AS $$
DECLARE
  v_records_today integer;
  v_quantity_today_material decimal;
  v_points_today integer;
  v_max_quantity integer;
  v_max_records_per_day integer := 3;
  v_max_points_per_day integer := 50;
BEGIN
  -- VALIDAÇÃO 1: Verificar limite de registros por dia (3 por dia)
  SELECT COUNT(*) INTO v_records_today
  FROM recycling_records
  WHERE user_id = NEW.user_id
    AND DATE(created_at) = CURRENT_DATE;

  IF v_records_today >= v_max_records_per_day THEN
    RAISE EXCEPTION 'Você já fez % reciclagens hoje! Volte amanhã. 🌱', v_max_records_per_day;
  END IF;

  -- VALIDAÇÃO 2: Verificar limite de quantidade por material
  SELECT max_quantity_per_day INTO v_max_quantity
  FROM materials
  WHERE id = NEW.material_id;

  IF v_max_quantity IS NOT NULL AND NEW.quantity > v_max_quantity THEN
    RAISE EXCEPTION 'Quantidade máxima para este material é % por dia!', v_max_quantity;
  END IF;

  -- VALIDAÇÃO 3: Verificar quantidade acumulada deste material hoje
  IF v_max_quantity IS NOT NULL THEN
    SELECT COALESCE(SUM(quantity), 0) INTO v_quantity_today_material
    FROM recycling_records
    WHERE user_id = NEW.user_id
      AND material_id = NEW.material_id
      AND DATE(created_at) = CURRENT_DATE;

    IF v_quantity_today_material + NEW.quantity > v_max_quantity THEN
      RAISE EXCEPTION 'Você já reciclou % unidades deste material hoje. Limite: %', 
        v_quantity_today_material, v_max_quantity;
    END IF;
  END IF;

  -- VALIDAÇÃO 4: Verificar limite total de pontos por dia
  SELECT COALESCE(SUM(points_earned), 0) INTO v_points_today
  FROM recycling_records
  WHERE user_id = NEW.user_id
    AND DATE(created_at) = CURRENT_DATE;

  IF v_points_today + NEW.points_earned > v_max_points_per_day THEN
    RAISE EXCEPTION 'Você já ganhou % pontos hoje. Limite diário: % pontos', 
      v_points_today, v_max_points_per_day;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar antes de inserir
DROP TRIGGER IF EXISTS validate_recycling_before_insert ON recycling_records;
CREATE TRIGGER validate_recycling_before_insert
  BEFORE INSERT ON recycling_records
  FOR EACH ROW
  EXECUTE FUNCTION validate_recycling_limits();

-- View para mostrar estatísticas de uso diário do usuário
CREATE OR REPLACE VIEW user_daily_stats AS
SELECT 
  user_id,
  DATE(created_at) as date,
  COUNT(*) as records_count,
  SUM(points_earned) as points_earned_today,
  SUM(quantity) as total_quantity_today
FROM recycling_records
GROUP BY user_id, DATE(created_at);
