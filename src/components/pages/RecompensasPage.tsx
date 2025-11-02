import { useState } from 'react';
import { Gift, ShoppingBag, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRewards } from '../../hooks/useRewards';

interface RecompensasPageProps {
  onNavigate: (page: 'home' | 'pontos' | 'ranking' | 'recompensas') => void;
}

export default function RecompensasPage({ onNavigate }: RecompensasPageProps) {
  const { user } = useAuth();
  const { rewards, redeemedRewards, loading, redeemReward } = useRewards(user?.id);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'redeemed'>('all');

  const handleRedeem = async (rewardId: string) => {
    if (!user) return;
    
    setRedeeming(true);
    setMessage(null);

    const result = await redeemReward(rewardId, user.total_points);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Recompensa resgatada com sucesso! 🎉' });
      setSelectedReward(null);
      // Atualizar pontos do usuário (reload)
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao resgatar recompensa' });
    }
    
    setRedeeming(false);
  };

  const canRedeem = (pointsRequired: number) => {
    return user && user.total_points >= pointsRequired;
  };

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'available') return canRedeem(reward.points_required);
    if (filter === 'redeemed') return redeemedRewards.some(r => r.reward_id === reward.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-purple-600 hover:text-purple-800 mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Loja de Recompensas
              </h1>
              <p className="text-gray-600">
                Troque seus pontos por prêmios sustentáveis!
              </p>
            </div>
            {user && (
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-300">
                <p className="text-sm text-gray-600 mb-1">Seus pontos:</p>
                <p className="text-3xl font-bold text-purple-600">
                  {user.total_points}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'available'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Disponíveis para você
          </button>
          <button
            onClick={() => setFilter('redeemed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'redeemed'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Já resgatadas
          </button>
        </div>

        {/* Mensagem */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-2 border-green-200'
              : 'bg-red-50 text-red-800 border-2 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Grid de Recompensas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const available = canRedeem(reward.points_required);
            const alreadyRedeemed = redeemedRewards.some(r => r.reward_id === reward.id);

            return (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  available ? 'border-2 border-green-300' : 'border-2 border-gray-200'
                }`}
              >
                {/* Badge */}
                {available && !alreadyRedeemed && (
                  <div className="bg-green-500 text-white text-center py-1 text-sm font-semibold">
                    ✨ Você pode resgatar!
                  </div>
                )}
                {alreadyRedeemed && (
                  <div className="bg-purple-500 text-white text-center py-1 text-sm font-semibold">
                    ✅ Já resgatada
                  </div>
                )}

                <div className="p-6">
                  {/* Ícone */}
                  <div className="text-6xl mb-4 text-center">{reward.icon}</div>

                  {/* Nome */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    {reward.name}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    {reward.description}
                  </p>

                  {/* Pontos */}
                  <div className="bg-purple-50 rounded-lg p-3 mb-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Custo</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {reward.points_required} pontos
                    </p>
                  </div>

                  {/* Estoque */}
                  <p className="text-xs text-gray-500 text-center mb-4">
                    {reward.stock > 0 ? `${reward.stock} em estoque` : 'Sem estoque'}
                  </p>

                  {/* Botão */}
                  {user ? (
                    <button
                      onClick={() => {
                        if (available && reward.stock > 0) {
                          setSelectedReward(reward.id);
                        }
                      }}
                      disabled={!available || reward.stock === 0 || alreadyRedeemed}
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${
                        available && reward.stock > 0 && !alreadyRedeemed
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {alreadyRedeemed
                        ? 'Já Resgatada'
                        : reward.stock === 0
                        ? 'Sem Estoque'
                        : available
                        ? 'Resgatar'
                        : `Faltam ${reward.points_required - (user.total_points || 0)} pontos`}
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('home')}
                      className="w-full py-3 rounded-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Faça login para resgatar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de Confirmação */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Confirmar Resgate?
                </h3>
                <p className="text-gray-600 mb-6">
                  Você está prestes a resgatar{' '}
                  <span className="font-bold">
                    {rewards.find(r => r.id === selectedReward)?.name}
                  </span>
                  {' '}por{' '}
                  <span className="font-bold text-purple-600">
                    {rewards.find(r => r.id === selectedReward)?.points_required} pontos
                  </span>.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedReward(null)}
                    disabled={redeeming}
                    className="flex-1 py-3 rounded-lg font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleRedeem(selectedReward)}
                    disabled={redeeming}
                    className="flex-1 py-3 rounded-lg font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-300"
                  >
                    <Check className="w-5 h-5 inline mr-2" />
                    {redeeming ? 'Resgatando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Histórico de Resgates */}
        {redeemedRewards.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Seus Resgates
              </h2>
            </div>
            <div className="space-y-3">
              {redeemedRewards.map((redeemed) => (
                <div
                  key={redeemed.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200"
                >
                  <div>
                    <p className="font-bold text-gray-800">{redeemed.reward_name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(redeemed.redeemed_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">-{redeemed.points_spent}</p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
