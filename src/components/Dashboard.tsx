import React, { useState } from 'react';
import { LogOut, Plus, Trophy, Recycle, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useRecycling } from '../hooks/useRecycling';
import { useRanking } from '../hooks/useRanking';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const { records, materials, addRecyclingRecord } = useRecycling(user?.id);
  const { rankings } = useRanking();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const userRanking = rankings.find(r => r.user_id === user?.id);

  const handleAddRecycling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    setLoading(true);
    try {
      await addRecyclingRecord(selectedMaterial, quantity);
      setShowAddForm(false);
      setSelectedMaterial('');
      setQuantity(1);
      alert('Reciclagem registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar reciclagem: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-red-600 font-bold text-lg">SENAI</span>
                <span className="text-green-600 font-bold text-lg ml-2">EcoPoints</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bem-vindo,</p>
                <p className="font-semibold text-gray-900">{profile.full_name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Pontos</p>
                <p className="text-2xl font-bold text-gray-900">{profile.total_points}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Recycle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Itens Reciclados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {records.reduce((sum, record) => sum + record.quantity, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Posição no Ranking</p>
                <p className="text-2xl font-bold text-gray-900">
                  #{userRanking?.ranking_position || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Registros</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Recycling Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Registrar Reciclagem</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddRecycling} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um material</option>
                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.icon} {material.name} - {material.points_per_unit} pontos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Recent Records */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico Recente</h2>
              <div className="space-y-4">
                {records.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{record.material_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(record.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{record.points_earned} pts</p>
                      <p className="text-sm text-gray-600">{record.quantity} unidades</p>
                    </div>
                  </div>
                ))}
                {records.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma reciclagem registrada ainda. Comece agora!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ranking Sidebar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top 10 Ranking</h2>
            <div className="space-y-4">
              {rankings.slice(0, 10).map((ranking) => (
                <div
                  key={ranking.user_id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    ranking.user_id === user?.id ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    ranking.ranking_position === 1 ? 'bg-yellow-500 text-white' :
                    ranking.ranking_position === 2 ? 'bg-gray-400 text-white' :
                    ranking.ranking_position === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {ranking.ranking_position}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{ranking.full_name}</p>
                    <p className="text-sm text-gray-600">{ranking.total_points} pontos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};