import React from 'react';
import { materials } from '../data/materials';

export const Materials: React.FC = () => {
  return (
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
          {materials.map((material) => (
            <div 
              key={material.id}
              className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                {material.icon}
              </div>

              {/* Material Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {material.name}
              </h3>

              {/* Points */}
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-center font-semibold mb-4">
                {material.points_per_unit} pontos
              </div>

              {/* Category */}
              <div className="text-sm text-gray-500 mb-3 text-center">
                Categoria: {material.category}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {material.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              💡 Dica Importante
            </h3>
            <p className="text-green-700 text-lg leading-relaxed max-w-4xl mx-auto">
              Certifique-se de que os materiais estejam limpos e separados corretamente. 
              Materiais sujos ou misturados podem ter seus pontos reduzidos ou não serem aceitos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};