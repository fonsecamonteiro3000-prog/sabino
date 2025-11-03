import React from 'react';
import { Recycle, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-600 p-2 rounded-lg">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-red-500 font-bold text-lg">SENAI</span>
                <span className="text-green-500 font-bold text-lg ml-2">EcoPoints</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transformando a reciclagem em uma experiência gamificada e recompensadora. 
              Juntos construímos um futuro mais sustentável.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#hero" className="text-gray-300 hover:text-green-500 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-gray-300 hover:text-green-500 transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#materiais" className="text-gray-300 hover:text-green-500 transition-colors">
                  Materiais
                </a>
              </li>
              <li>
                <a href="#ranking" className="text-gray-300 hover:text-green-500 transition-colors">
                  Ranking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Suporte</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Guia de Reciclagem
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Pontos de Coleta
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-500 transition-colors">
                  Reportar Problema
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">contato@ecopoints.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">São Paulo, SP - Brasil</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-500"
                />
                <button className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SENAI EcoPoints. Todos os direitos reservados.
          </p>
          <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              Desenvolvido com 💚 para um mundo mais sustentável
            </p>
            <p className="text-gray-600 text-xs mt-1">
              created by: @danielmontsz
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};