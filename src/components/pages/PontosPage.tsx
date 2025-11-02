import { useState, useMemo } from 'react';
import { Recycle, Plus, History, AlertCircle } from 'lucide-react';
import { useRecycling } from '../../hooks/useRecycling';
import { useAuth } from '../../hooks/useAuth';
import { RECYCLING_LIMITS } from '../../data/materials';

interface PontosPageProps {
  onNavigate: (page: 'home' | 'pontos' | 'ranking' | 'recompensas') => void;
}

export default function PontosPage({ onNavigate }: PontosPageProps) {
  const { user } = useAuth();
  const { materials, records, addRecyclingRecord, loading } = useRecycling(user?.id);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Calcular registros de hoje
  const todayRecordsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return records.filter(r => {
      const recordDate = new Date(r.created_at);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    }).length;
  }, [records]);

  const remainingRecords = RECYCLING_LIMITS.MAX_RECORDS_PER_DAY - todayRecordsCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !quantity) {
      setMessage({ type: 'error', text: 'Preencha todos os campos!' });
      return;
    }

    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await addRecyclingRecord(selectedMaterial, parseFloat(quantity));
      const pointsEarned = material.points_per_unit * parseFloat(quantity);
      setMessage({ 
        type: 'success', 
        text: `Parabéns! Você ganhou ${pointsEarned} pontos! 🎉` 
      });
      setSelectedMaterial('');
      setQuantity('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao registrar reciclagem' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Registrar Reciclagem
          </h1>
          <p className="text-gray-600">
            Informe o que você reciclou e ganhe pontos!
          </p>
        </div>

        {/* Aviso de Limite Diário */}
        <div className={`mb-6 p-4 rounded-xl border-2 flex items-start gap-3 ${
          remainingRecords === 0 
            ? 'bg-red-50 border-red-300' 
            : remainingRecords === 1
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-blue-50 border-blue-300'
        }`}>
          <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
            remainingRecords === 0 
              ? 'text-red-600' 
              : remainingRecords === 1
              ? 'text-yellow-600'
              : 'text-blue-600'
          }`} />
          <div>
            <p className={`font-bold ${
              remainingRecords === 0 
                ? 'text-red-800' 
                : remainingRecords === 1
                ? 'text-yellow-800'
                : 'text-blue-800'
            }`}>
              {remainingRecords === 0 
                ? '⚠️ Você atingiu o limite de hoje!' 
                : `🌱 Você pode fazer mais ${remainingRecords} reciclagem${remainingRecords > 1 ? 's' : ''} hoje`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Limite: {RECYCLING_LIMITS.MAX_RECORDS_PER_DAY} registros por dia para evitar fraudes e garantir justiça.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Reciclagem */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Novo Registro</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selecionar Material */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Material
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={submitting || remainingRecords === 0}
                >
                  <option value="">Selecione um material...</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.icon} {material.name} - {material.points_per_unit} pts/un (máx: {material.max_quantity_per_day || '∞'}/dia)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantidade
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={selectedMaterial ? materials.find(m => m.id === selectedMaterial)?.max_quantity_per_day : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex: 5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={submitting || remainingRecords === 0}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {selectedMaterial && materials.find(m => m.id === selectedMaterial)?.max_quantity_per_day 
                    ? `Máximo: ${materials.find(m => m.id === selectedMaterial)?.max_quantity_per_day} unidades por dia`
                    : 'Informe quantas unidades você está reciclando'
                  }
                </p>
              </div>

              {/* Preview de Pontos */}
              {selectedMaterial && quantity && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Você vai ganhar:</p>
                  <p className="text-3xl font-bold text-green-600">
                    {materials.find(m => m.id === selectedMaterial)?.points_per_unit! * parseFloat(quantity)} pontos
                  </p>
                </div>
              )}

              {/* Mensagem */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border-2 border-green-200' 
                    : 'bg-red-50 text-red-800 border-2 border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={submitting || !selectedMaterial || !quantity || remainingRecords === 0}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {remainingRecords === 0 
                  ? 'Limite diário atingido' 
                  : submitting 
                  ? 'Registrando...' 
                  : 'Registrar Reciclagem'
                }
              </button>
            </form>
          </div>

          {/* Histórico de Reciclagens */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Histórico</h2>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando histórico...
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Recycle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Você ainda não registrou nenhuma reciclagem.</p>
                <p className="text-sm">Comece agora e ganhe pontos! 🌱</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {record.material_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantidade: {record.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +{record.points_earned}
                        </p>
                        <p className="text-xs text-gray-500">pontos</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(record.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards de Materiais Aceitos */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Materiais Aceitos</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-lg p-4 shadow border-2 border-transparent hover:border-green-400 transition-all"
              >
                <div className="text-4xl mb-2">{material.icon}</div>
                <h4 className="font-bold text-gray-800 mb-1">{material.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                <p className="text-lg font-bold text-green-600">
                  {material.points_per_unit} pontos/un
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
