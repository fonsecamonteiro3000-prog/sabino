import React, { useState } from 'react';
import { Menu, X, Recycle } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-red-600 font-bold text-lg">SENAI</span>
              <span className="text-green-600 font-bold text-lg ml-2">EcoPoints</span>
              <p className="text-xs text-gray-600">Sistema de Reciclagem</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('materiais')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Materiais
            </button>
            <button 
              onClick={() => scrollToSection('ranking')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Ranking
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onRegisterClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Cadastrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-green-600 text-left"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('como-funciona')}
                className="text-gray-700 hover:text-green-600 text-left"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('materiais')}
                className="text-gray-700 hover:text-green-600 text-left"
              >
                Materiais
              </button>
              <button 
                onClick={() => scrollToSection('ranking')}
                className="text-gray-700 hover:text-green-600 text-left"
              >
                Ranking
              </button>
              <div className="flex space-x-4 pt-4 border-t">
                <button 
                  onClick={onLoginClick}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};