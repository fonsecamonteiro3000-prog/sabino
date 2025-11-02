import React from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useRanking } from '../hooks/useRanking';

export const Ranking: React.FC = () => {
  const { rankings, loading } = useRanking();

  if (loading) {
    return (
      <section id="ranking" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando ranking...</p>
          </div>
        </div>
      </section>
    );
  }
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-300" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section id="ranking" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ranking de Recicladores
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja quem está liderando na missão de tornar o mundo mais sustentável
          </p>
        </div>

        {/* Top 3 Podium */}
        {rankings.length >= 3 && (
          <div className="flex justify-center items-end mb-16 space-x-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-300 to-gray-500 w-24 h-32 rounded-t-lg flex items-end justify-center pb-4">
              <Medal className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white p-4 rounded-b-lg shadow-lg">
              <h3 className="font-bold text-gray-900">{rankings[1]?.full_name}</h3>
              <p className="text-gray-600">{rankings[1]?.total_points} pts</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-28 h-40 rounded-t-lg flex items-end justify-center pb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="bg-white p-4 rounded-b-lg shadow-lg">
              <h3 className="font-bold text-gray-900">{rankings[0]?.full_name}</h3>
              <p className="text-gray-600">{rankings[0]?.total_points} pts</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-400 to-amber-600 w-24 h-28 rounded-t-lg flex items-end justify-center pb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white p-4 rounded-b-lg shadow-lg">
              <h3 className="font-bold text-gray-900">{rankings[2]?.full_name}</h3>
              <p className="text-gray-600">{rankings[2]?.total_points} pts</p>
            </div>
          </div>
          </div>
        )}

        {/* Full Ranking Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6">
            <h3 className="text-2xl font-bold text-center">Ranking Completo</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {rankings.slice(0, 20).map((user) => (
              <div 
                key={user.user_id}
                className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  user.ranking_position <= 3 ? 'bg-gradient-to-r from-green-50 to-transparent' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Position */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getPositionColor(user.ranking_position)}`}>
                    {user.ranking_position <= 3 ? getPositionIcon(user.ranking_position) : user.ranking_position}
                  </div>

                  {/* User Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{user.full_name}</h4>
                    <p className="text-gray-600">{user.total_recycled_items} itens reciclados</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{user.total_points}</div>
                  <div className="text-gray-500">pontos</div>
                </div>
              </div>
            ))}
            {rankings.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum usuário no ranking ainda.</p>
                <p className="text-sm">Seja o primeiro a reciclar!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Quer aparecer no ranking? Comece a reciclar hoje mesmo!</p>
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Cadastrar Reciclagem
          </button>
        </div>
      </div>
    </section>
  );
};