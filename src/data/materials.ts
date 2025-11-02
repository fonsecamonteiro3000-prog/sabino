import { Material } from '../types';

export const materials: Material[] = [
  {
    id: '1',
    name: 'Garrafa PET',
    points_per_unit: 5,
    category: 'Plástico',
    description: 'Garrafas de refrigerante, água e sucos',
    icon: '🍶',
    max_quantity_per_day: 10
  },
  {
    id: '2',
    name: 'Lata de Alumínio',
    points_per_unit: 8,
    category: 'Metal',
    description: 'Latas de refrigerante e sucos',
    icon: '🥤',
    max_quantity_per_day: 10
  },
  {
    id: '3',
    name: 'Papel Alumínio',
    points_per_unit: 6,
    category: 'Metal',
    description: 'Papel alumínio usado em lanches e marmitas',
    icon: '🌯',
    max_quantity_per_day: 5
  },
  {
    id: '4',
    name: 'Papel',
    points_per_unit: 2,
    category: 'Papel',
    description: 'Folhas de caderno, papel sulfite, papel toalha',
    icon: '📄',
    max_quantity_per_day: 50
  },
  {
    id: '5',
    name: 'Papelão',
    points_per_unit: 3,
    category: 'Papel',
    description: 'Caixas de lanche, embalagens de pizza, caixas',
    icon: '📦',
    max_quantity_per_day: 5
  },
  {
    id: '6',
    name: 'Copo Plástico',
    points_per_unit: 4,
    category: 'Plástico',
    description: 'Copos descartáveis de água, suco e refrigerante',
    icon: '🥤',
    max_quantity_per_day: 15
  },
  {
    id: '7',
    name: 'Embalagem Plástica',
    points_per_unit: 3,
    category: 'Plástico',
    description: 'Saquinhos de salgadinho, biscoito, embalagens de lanche',
    icon: '🥡',
    max_quantity_per_day: 10
  },
  {
    id: '8',
    name: 'Sacola Plástica',
    points_per_unit: 2,
    category: 'Plástico',
    description: 'Sacolas de supermercado e sacolinhas',
    icon: '🛍️',
    max_quantity_per_day: 20 // Máximo 20 sacolas por dia
  }
];

// Configurações de limites do sistema
export const RECYCLING_LIMITS = {
  MAX_RECORDS_PER_DAY: 3, // Máximo 3 registros por dia
  MAX_POINTS_PER_DAY: 50, // Máximo 50 pontos por dia (proteção extra)
};