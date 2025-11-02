import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';

function App() {
  console.log('App carregando...');
  
  const { user, loading } = useAuth();
  console.log('Auth state:', { user, loading });

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #16a34a',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Simples */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        zIndex: 50,
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: '#16a34a', 
              padding: '8px', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '20px'
            }}>
              ♻️
            </div>
            <div>
              <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '18px' }}>SENAI</span>
              <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '18px', marginLeft: '8px' }}>EcoPoints</span>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Sistema de Reciclagem</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              color: '#16a34a',
              background: 'transparent',
              border: 'none',
              fontWeight: 'medium',
              cursor: 'pointer'
            }}>
              Login
            </button>
            <button style={{
              background: '#16a34a',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={{
          minHeight: '100vh',
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              Transforme Lixo em <span style={{ color: '#4ade80' }}>Pontos Verdes</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              marginBottom: '2rem',
              color: '#e5e7eb'
            }}>
              Recicle materiais, acumule pontos e ajude o meio ambiente. 
              Cada item reciclado conta para um futuro mais sustentável.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                background: '#16a34a',
                color: 'white',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                🚀 Começar Agora
              </button>
              
              <button style={{
                border: '2px solid white',
                color: 'white',
                background: 'transparent',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                ▶️ Como Funciona
              </button>
            </div>

            {/* Estatísticas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              marginTop: '3rem',
              maxWidth: '600px',
              margin: '3rem auto 0'
            }}>
              {[
                { value: '500+', label: 'Materiais Cadastrados' },
                { value: '2.5T', label: 'Plástico Reciclado' },
                { value: '1.2M', label: 'Pontos Distribuídos' },
                { value: '150+', label: 'Usuários Ativos' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'white' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section style={{ padding: '5rem 2rem', background: '#f9fafb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Como Funciona o EcoPoints
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem' }}>
              Em apenas 4 passos simples você já estará contribuindo para um mundo mais sustentável
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem'
            }}>
              {[
                { icon: '👤', title: 'Criar Conta Gratuita', desc: 'Cadastre-se com seu nome, email e CPF' },
                { icon: '🔐', title: 'Fazer Login no Sistema', desc: 'Acesse sua conta usando suas credenciais' },
                { icon: '📦', title: 'Cadastrar Materiais', desc: 'Registre os materiais reciclados' },
                { icon: '🏆', title: 'Acumular Pontos', desc: 'Veja seus pontos crescerem no ranking' }
              ].map((step, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '-1rem',
                    width: '2rem',
                    height: '2rem',
                    background: '#111827',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materiais */}
        <section style={{ padding: '5rem 2rem', background: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Materiais Aceitos
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem' }}>
              Conheça todos os materiais que você pode reciclar e quantos pontos cada um vale
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem'
            }}>
              {[
                { icon: '🍶', name: 'Garrafa PET', points: 5, category: 'Plástico' },
                { icon: '🥤', name: 'Lata de Alumínio', points: 8, category: 'Metal' },
                { icon: '📄', name: 'Papel/Papelão', points: 3, category: 'Papel' },
                { icon: '🍾', name: 'Vidro', points: 6, category: 'Vidro' },
                { icon: '🥡', name: 'Plástico Rígido', points: 4, category: 'Plástico' },
                { icon: '🔩', name: 'Metal', points: 7, category: 'Metal' },
                { icon: '📱', name: 'Eletrônicos', points: 15, category: 'Eletrônico' },
                { icon: '🛢️', name: 'Óleo de Cozinha', points: 10, category: 'Óleo' }
              ].map((material, index) => (
                <div key={index} style={{
                  background: 'white',
                  border: '2px solid #f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{material.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
                    {material.name}
                  </h3>
                  <div style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {material.points} pontos
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Categoria: {material.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#111827', color: 'white', padding: '3rem 2rem 1rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ background: '#16a34a', padding: '8px', borderRadius: '8px', fontSize: '20px' }}>
                ♻️
              </div>
              <div>
                <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '18px' }}>SENAI</span>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '18px', marginLeft: '8px' }}>EcoPoints</span>
              </div>
            </div>
            
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              Transformando a reciclagem em uma experiência gamificada e recompensadora.
            </p>
            
            <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                © 2024 SENAI EcoPoints. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;