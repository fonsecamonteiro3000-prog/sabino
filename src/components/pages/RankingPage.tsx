import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { useRanking } from '../../hooks/useRanking';
import { useAuth } from '../../hooks/useAuth';

interface RankingPageProps {
  onNavigate: (page: 'home' | 'pontos' | 'ranking' | 'recompensas') => void;
}

export default function RankingPage({ onNavigate }: RankingPageProps) {
  const { rankings, loading } = useRanking();
  const { user } = useAuth();

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-yellow-600 hover:text-yellow-800 mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <div className="text-center">
            <div className="inline-block bg-yellow-100 p-4 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Ranking EcoPoints
            </h1>
            <p className="text-gray-600">
              Veja quem está liderando a revolução da reciclagem!
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && rankings.length >= 3 && (
          <div className="mb-8 flex items-end justify-center gap-4">
            {/* 2º Lugar */}
            <div className="text-center flex-1 max-w-[150px]">
              <div className="bg-white rounded-t-2xl p-4 shadow-lg border-4 border-gray-300 mb-2">
                <Medal className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="font-bold text-gray-800 text-sm truncate">
                  {rankings[1]?.full_name}
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {rankings[1]?.total_points}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
              <div className="bg-gray-300 h-20 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-white">2°</span>
              </div>
            </div>

            {/* 1º Lugar */}
            <div className="text-center flex-1 max-w-[180px]">
              <div className="bg-white rounded-t-2xl p-6 shadow-xl border-4 border-yellow-400 mb-2">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="font-bold text-gray-800 truncate">
                  {rankings[0]?.full_name}
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {rankings[0]?.total_points}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
              <div className="bg-yellow-400 h-32 rounded-t-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-white">1°</span>
              </div>
            </div>

            {/* 3º Lugar */}
            <div className="text-center flex-1 max-w-[150px]">
              <div className="bg-white rounded-t-2xl p-4 shadow-lg border-4 border-orange-400 mb-2">
                <Medal className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <p className="font-bold text-gray-800 text-sm truncate">
                  {rankings[2]?.full_name}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {rankings[2]?.total_points}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
              <div className="bg-orange-400 h-16 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-white">3°</span>
              </div>
            </div>
          </div>
        )}

        {/* Lista Completa */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ranking Completo
          </h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-pulse" />
              <p>Carregando ranking...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum usuário no ranking ainda.</p>
              <p className="text-sm">Seja o primeiro! 🌱</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rankings.map((ranking) => {
                const isCurrentUser = user?.id === ranking.user_id;
                return (
                  <div
                    key={ranking.user_id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      getPositionBg(ranking.ranking_position)
                    } ${isCurrentUser ? 'ring-4 ring-green-400' : ''}`}
                  >
                    {/* Posição */}
                    <div className="flex-shrink-0 w-12 text-center">
                      {ranking.ranking_position <= 3 ? (
                        getMedalIcon(ranking.ranking_position)
                      ) : (
                        <span className="text-2xl font-bold text-gray-600">
                          {ranking.ranking_position}°
                        </span>
                      )}
                    </div>

                    {/* Nome */}
                    <div className="flex-1">
                      <p className={`font-bold ${isCurrentUser ? 'text-green-700' : 'text-gray-800'}`}>
                        {ranking.full_name} {isCurrentUser && '(Você)'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ranking.total_recycled_items} itens reciclados
                      </p>
                    </div>

                    {/* Pontos */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {ranking.total_points}
                      </p>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dica */}
        {user && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-800 font-semibold mb-2">
              💡 Dica: Recicle mais para subir no ranking!
            </p>
            <button
              onClick={() => onNavigate('pontos')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Registrar Reciclagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
