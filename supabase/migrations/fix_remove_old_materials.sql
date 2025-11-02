-- ========================================
-- LIMPAR MATERIAIS ANTIGOS E MANTER APENAS ESCOLARES
-- ========================================

-- Deletar TODOS os materiais antigos
DELETE FROM materials WHERE name IN (
  'Eletrônicos',
  'Óleo de Cozinha', 
  'Metal',
  'Vidro',
  'Plástico Rígido'
);

-- Garantir que apenas os 8 materiais escolares existam
-- Primeiro limpa tudo
TRUNCATE materials CASCADE;

-- Reinserir apenas os 8 materiais corretos
INSERT INTO materials (name, points_per_unit, category, description, icon, max_quantity_per_day) VALUES
  ('Garrafa PET', 5, 'Plástico', 'Garrafas de refrigerante, água e sucos', '🍶', 10),
  ('Lata de Alumínio', 8, 'Metal', 'Latas de refrigerante e sucos', '🥤', 10),
  ('Papel Alumínio', 6, 'Metal', 'Papel alumínio usado em lanches e marmitas', '🌯', 5),
  ('Papel', 2, 'Papel', 'Folhas de caderno, papel sulfite, papel toalha', '📄', 50),
  ('Papelão', 3, 'Papel', 'Caixas de lanche, embalagens de pizza, caixas', '📦', 5),
  ('Copo Plástico', 4, 'Plástico', 'Copos descartáveis de água, suco e refrigerante', '🥤', 15),
  ('Embalagem Plástica', 3, 'Plástico', 'Saquinhos de salgadinho, biscoito, embalagens de lanche', '🥡', 10),
  ('Sacola Plástica', 2, 'Plástico', 'Sacolas de supermercado e sacolinhas', '🛍️', 20)
ON CONFLICT (name) DO UPDATE SET
  points_per_unit = EXCLUDED.points_per_unit,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  max_quantity_per_day = EXCLUDED.max_quantity_per_day;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Materiais atualizados! Apenas 8 materiais escolares (lixeiras coloridas)';
END $$;
