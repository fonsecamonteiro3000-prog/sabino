import { Reward } from '../types';

export const rewards: Reward[] = [
  {
    id: '1',
    name: 'Garrafa Térmica 500ml',
    description: 'Garrafa térmica de aço inoxidável, mantém bebidas quentes/frias por até 12h',
    points_required: 500,
    icon: '🍶',
    category: 'metal',
    stock: 50
  },
  {
    id: '2',
    name: 'Kit 3 Potes Plásticos',
    description: 'Conjunto de 3 potes herméticos para armazenar alimentos',
    points_required: 300,
    icon: '🥡',
    category: 'plastico',
    stock: 100
  },
  {
    id: '3',
    name: 'Canudo Reutilizável de Metal',
    description: 'Kit com 4 canudos de inox + escova de limpeza',
    points_required: 150,
    icon: '🥤',
    category: 'metal',
    stock: 200
  },
  {
    id: '4',
    name: 'Sacola Ecológica Premium',
    description: 'Sacola reutilizável de lona resistente, capacidade 15kg',
    points_required: 200,
    icon: '🛍️',
    category: 'papel',
    stock: 150
  },
  {
    id: '5',
    name: 'Copo Térmico 350ml',
    description: 'Copo térmico com tampa, ideal para café e chá',
    points_required: 400,
    icon: '☕',
    category: 'plastico',
    stock: 75
  },
  {
    id: '6',
    name: 'Porta Garrafas de Vidro',
    description: 'Suporte de bambu para organizar garrafas',
    points_required: 250,
    icon: '🍾',
    category: 'vidro',
    stock: 60
  },
  {
    id: '7',
    name: 'Marmita Térmica 1L',
    description: 'Marmita de aço inox com divisórias e talheres',
    points_required: 600,
    icon: '🍱',
    category: 'metal',
    stock: 40
  },
  {
    id: '8',
    name: 'Kit Lancheira Ecológica',
    description: 'Wrap reutilizável + saco de silicone + guardanapo de pano',
    points_required: 350,
    icon: '🥪',
    category: 'papel',
    stock: 80
  },
  {
    id: '9',
    name: 'Garrafa Squeeze 1L',
    description: 'Garrafa plástica BPA free com marcador de consumo',
    points_required: 180,
    icon: '💧',
    category: 'plastico',
    stock: 120
  },
  {
    id: '10',
    name: 'Organizador de Tampas',
    description: 'Organizador de plástico reciclado para tampas de potes',
    points_required: 220,
    icon: '🔧',
    category: 'plastico',
    stock: 90
  },
  {
    id: '11',
    name: 'Jarra de Vidro 2L',
    description: 'Jarra de vidro borosilicato com tampa de bambu',
    points_required: 450,
    icon: '🏺',
    category: 'vidro',
    stock: 50
  },
  {
    id: '12',
    name: 'Vale Desconto 50 Reais',
    description: 'Vale compras em lojas parceiras sustentáveis',
    points_required: 1000,
    icon: '🎁',
    category: 'papel',
    stock: 30
  }
];
