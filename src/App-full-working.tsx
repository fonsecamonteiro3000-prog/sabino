import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';

// Testando componentes um por um - versão básica primeiro
function App() {
  console.log('App iniciando...');
  
  const { user, loading, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  console.log('Estado auth:', { user, loading });

  if (loading) {
    console.log('Mostrando loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log('Renderizando app principal...');

  const handleLoginClick = () => {
    console.log('Login clicado');
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    console.log('Register clicado');
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    console.log('Get started clicado');
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header simples primeiro */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <span className="text-white text-lg">♻️</span>
              </div>
              <div>
                <span className="text-red-600 font-bold text-lg">SENAI</span>
                <span className="text-green-600 font-bold text-lg ml-2">EcoPoints</span>
                <p className="text-xs text-gray-600">Sistema de Reciclagem</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                // Usuário logado
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Olá, {user.name}!</p>
                    <p className="text-xs text-green-600">{user.total_points} pontos</p>
                  </div>
                  <button 
                    onClick={signOut}
                    className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                // Usuário não logado
                <>
                  <button 
                    onClick={handleLoginClick}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Entrar
                  </button>
                  <button 
                    onClick={handleRegisterClick}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Hero Section Simples */}
        <section 
          id="hero" 
          className="relative min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transforme Lixo em{' '}
              <span className="text-green-400">Pontos Verdes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Recicle materiais, acumule pontos e ajude o meio ambiente. 
              Cada item reciclado conta para um futuro mais sustentável.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={handleGetStarted}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300"
              >
                Começar Agora
              </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                <div className="text-white text-sm">Materiais Cadastrados</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">2.5T</div>
                <div className="text-white text-sm">Plástico Reciclado</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">1.2M</div>
                <div className="text-white text-sm">Pontos Distribuídos</div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">150+</div>
                <div className="text-white text-sm">Usuários Ativos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Como Funciona o EcoPoints
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Em apenas 4 passos simples você já estará contribuindo para um mundo mais sustentável
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '👤', title: 'Criar Conta Gratuita', desc: 'Cadastre-se com seu nome, email e CPF. É rápido e totalmente gratuito.' },
                { icon: '🔐', title: 'Fazer Login no Sistema', desc: 'Acesse sua conta usando seu CPF ou email e senha cadastrados.' },
                { icon: '📦', title: 'Cadastrar Materiais', desc: 'Registre os materiais reciclados e ganhe pontos automaticamente.' },
                { icon: '🏆', title: 'Acumular Pontos', desc: 'Veja seus pontos crescerem e sua posição no ranking de recicladores.' }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10">
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="text-4xl mb-6 text-center">
                      {step.icon}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materiais */}
        <section id="materiais" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Materiais Aceitos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Conheça todos os materiais que você pode reciclar e quantos pontos cada um vale
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: '1', name: 'Garrafa PET', points_per_unit: 5, category: 'Plástico', icon: '🍶' },
                { id: '2', name: 'Lata de Alumínio', points_per_unit: 8, category: 'Metal', icon: '🥤' },
                { id: '3', name: 'Papel/Papelão', points_per_unit: 3, category: 'Papel', icon: '📄' },
                { id: '4', name: 'Vidro', points_per_unit: 6, category: 'Vidro', icon: '🍾' },
                { id: '5', name: 'Plástico Rígido', points_per_unit: 4, category: 'Plástico', icon: '🥡' },
                { id: '6', name: 'Metal', points_per_unit: 7, category: 'Metal', icon: '🔩' },
                { id: '7', name: 'Eletrônicos', points_per_unit: 15, category: 'Eletrônico', icon: '📱' },
                { id: '8', name: 'Óleo de Cozinha', points_per_unit: 10, category: 'Óleo', icon: '🛢️' }
              ].map((material) => (
                <div 
                  key={material.id}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                    {material.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {material.name}
                  </h3>

                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-center font-semibold mb-4">
                    {material.points_per_unit} pontos
                  </div>

                  <div className="text-sm text-gray-500 mb-3 text-center">
                    Categoria: {material.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ranking Simples */}
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

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h3 className="text-2xl font-bold text-center">Top 10 Ranking</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {[
                  { user_id: '1', full_name: 'Ana Silva', total_points: 1250, total_recycled_items: 89, ranking_position: 1 },
                  { user_id: '2', full_name: 'Carlos Santos', total_points: 1180, total_recycled_items: 76, ranking_position: 2 },
                  { user_id: '3', full_name: 'Marina Costa', total_points: 1050, total_recycled_items: 68, ranking_position: 3 }
                ].map((user) => (
                  <div 
                    key={user.user_id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        user.ranking_position === 1 ? 'bg-yellow-500 text-white' :
                        user.ranking_position === 2 ? 'bg-gray-400 text-white' :
                        user.ranking_position === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.ranking_position === 1 ? '🏆' : 
                         user.ranking_position === 2 ? '🥈' :
                         user.ranking_position === 3 ? '🥉' : user.ranking_position}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{user.full_name}</h4>
                        <p className="text-gray-600">{user.total_recycled_items} itens reciclados</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{user.total_points}</div>
                      <div className="text-gray-500">pontos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-green-600 p-2 rounded-lg">
              <span className="text-white text-lg">♻️</span>
            </div>
            <div>
              <span className="text-red-500 font-bold text-lg">SENAI</span>
              <span className="text-green-500 font-bold text-lg ml-2">EcoPoints</span>
            </div>
          </div>
          <p className="text-gray-300 mb-6">
            Transformando a reciclagem em uma experiência gamificada e recompensadora.
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 SENAI EcoPoints. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Auth Funcional */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />
    </div>
  );
}

export default App;