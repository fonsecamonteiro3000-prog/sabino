import { useState } from 'react';
import { LogIn, LogOut, User, Home, Coins, Trophy, Gift } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';
import HomePage from './components/pages/HomePage';
import PontosPage from './components/pages/PontosPage';
import RankingPage from './components/pages/RankingPage';
import RecompensasPage from './components/pages/RecompensasPage';

type Page = 'home' | 'pontos' | 'ranking' | 'recompensas';

function App() {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    if (page !== 'home' && !user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Carregando EcoPoints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <span className="text-2xl">♻️</span>
              </div>
              <span className="text-2xl font-bold text-green-800">EcoPoints</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => handleNavigate('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'home'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Início
              </button>
              
              <button
                onClick={() => handleNavigate('pontos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'pontos'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Coins className="w-5 h-5" />
                Pontos
              </button>

              <button
                onClick={() => handleNavigate('ranking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'ranking'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-5 h-5" />
                Ranking
              </button>

              <button
                onClick={() => handleNavigate('recompensas')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === 'recompensas'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                Recompensas
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border-2 border-green-200">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-green-600 font-bold">{user.total_points} pontos</p>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">Sair</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  Entrar
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2 pb-3 overflow-x-auto">
            <button
              onClick={() => handleNavigate('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                currentPage === 'home'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
              Início
            </button>
            <button
              onClick={() => handleNavigate('pontos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                currentPage === 'pontos'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Coins className="w-4 h-4" />
              Pontos
            </button>
            <button
              onClick={() => handleNavigate('ranking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                currentPage === 'ranking'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Ranking
            </button>
            <button
              onClick={() => handleNavigate('recompensas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                currentPage === 'recompensas'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              Recompensas
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} userName={user?.name} />
        )}
        {currentPage === 'pontos' && (
          <PontosPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'ranking' && (
          <RankingPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'recompensas' && (
          <RecompensasPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              mode={authMode}
              onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2025 EcoPoints SENAI - Transformando reciclagem em recompensas 🌱
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
