import React from 'react';
import { UserPlus, LogIn, Package, Trophy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Criar Conta Gratuita',
      description: 'Cadastre-se com seu nome, email e CPF. É rápido e totalmente gratuito.',
      color: 'bg-blue-500'
    },
    {
      icon: LogIn,
      title: 'Fazer Login no Sistema',
      description: 'Acesse sua conta usando seu CPF ou email e senha cadastrados.',
      color: 'bg-green-500'
    },
    {
      icon: Package,
      title: 'Cadastrar Materiais',
      description: 'Registre os materiais reciclados e ganhe pontos automaticamente.',
      color: 'bg-orange-500'
    },
    {
      icon: Trophy,
      title: 'Acumular Pontos',
      description: 'Veja seus pontos crescerem e sua posição no ranking de recicladores.',
      color: 'bg-purple-500'
    }
  ];

  return (
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
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-300 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                )}

                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`${step.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 mx-auto`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Começar Agora Mesmo
          </button>
        </div>
      </div>
    </section>
  );
};