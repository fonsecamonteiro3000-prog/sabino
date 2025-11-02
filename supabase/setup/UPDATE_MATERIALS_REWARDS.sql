-- ========================================
-- ATUALIZAR MATERIAIS E RECOMPENSAS
-- Execute este script para atualizar dados existentes
-- SEM apagar nada!
-- ========================================

-- 1. ATUALIZAR LIMITE DE MATERIAIS PARA 3 UNIDADES
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Garrafa PET';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Lata de Alumínio';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Papel Alumínio';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Papel';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Papelão';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Copo Plástico';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Embalagem Plástica';
UPDATE materials SET max_quantity_per_day = 3 WHERE name = 'Sacola Plástica';

-- 2. DESATIVAR RECOMPENSAS ANTIGAS (mantém no banco mas não aparecem mais)
UPDATE rewards SET is_active = false;

-- 3. INSERIR NOVAS RECOMPENSAS DE PLÁSTICO
INSERT INTO rewards (name, description, points_cost, icon, category, stock_quantity) VALUES
  ('Garrafa Plástica 500ml', 'Garrafa squeeze de plástico resistente com tampa', 200, '🍶', 'plastico', 150),
  ('Garrafa Plástica 1L', 'Garrafa grande de plástico para água ou suco', 300, '🍶', 'plastico', 100),
  ('Copo Plástico Reutilizável', 'Copo de plástico resistente com tampa e canudo', 150, '🥤', 'plastico', 200),
  ('Kit 6 Copos Plásticos', 'Conjunto com 6 copos coloridos de plástico resistente', 400, '🥤', 'plastico', 80),
  ('Porta Copos Plástico', 'Porta copos de plástico com 4 unidades', 180, '🎯', 'plastico', 120),
  ('Prato Plástico Reutilizável', 'Prato fundo de plástico resistente', 120, '🍽️', 'plastico', 150),
  ('Kit 6 Pratos Plásticos', 'Conjunto com 6 pratos de plástico coloridos', 350, '🍽️', 'plastico', 90),
  ('Pote Plástico 500ml', 'Pote hermético de plástico para alimentos', 180, '🥡', 'plastico', 140),
  ('Kit 3 Potes Plásticos', 'Conjunto com 3 potes de tamanhos diferentes', 400, '🥡', 'plastico', 100),
  ('Tigela Plástica', 'Tigela grande de plástico para saladas e frutas', 220, '🥗', 'plastico', 110)
ON CONFLICT DO NOTHING;

-- 4. MENSAGEM FINAL
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ATUALIZAÇÃO CONCLUÍDA!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📦 Materiais: limites atualizados para 3/dia';
  RAISE NOTICE '🎁 Recompensas antigas: desativadas';
  RAISE NOTICE '🆕 Recompensas novas: 10 recipientes de plástico';
  RAISE NOTICE '========================================';
END $$;
