import { Trophy, Leaf, Recycle, Gift } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'pontos' | 'ranking' | 'recompensas') => void;
  userName?: string;
}

export default function HomePage({ onNavigate, userName }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {userName ? `Olá, ${userName}! 👋` : 'Bem-vindo ao EcoPoints! 🌱'}
          </h1>
          <p className="text-xl text-green-700 max-w-2xl mx-auto">
            Transforme sua reciclagem em recompensas! Ganhe pontos a cada material reciclado e troque por prêmios incríveis.
          </p>
        </div>

        {/* Cards de Navegação */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card Pontos */}
          <button
            onClick={() => onNavigate('pontos')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Recycle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registrar Reciclagem
            </h2>
            <p className="text-gray-600">
              Informe o que você reciclou e ganhe pontos instantaneamente!
            </p>
          </button>

          {/* Card Ranking */}
          <button
            onClick={() => onNavigate('ranking')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Ranking
            </h2>
            <p className="text-gray-600">
              Veja sua posição e compete com outros eco-cidadãos!
            </p>
          </button>

          {/* Card Recompensas */}
          <button
            onClick={() => onNavigate('recompensas')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Recompensas
            </h2>
            <p className="text-gray-600">
              Troque seus pontos por prêmios sustentáveis incríveis!
            </p>
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Por que reciclar com a gente?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">8</div>
              <p className="text-gray-600">Tipos de Materiais do Dia a Dia</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-gray-600">Recompensas Disponíveis</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-600">Sustentável e Educativo</p>
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Como Funciona?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-lg mb-2">Recicle</h4>
              <p className="text-gray-600">Separe seus materiais recicláveis</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-lg mb-2">Registre</h4>
              <p className="text-gray-600">Informe o que você reciclou</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-lg mb-2">Ganhe</h4>
              <p className="text-gray-600">Acumule pontos e troque por prêmios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
