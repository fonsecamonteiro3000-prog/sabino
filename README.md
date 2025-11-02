# EcoPoints - Sistema de Reciclagem

Sistema gamificado de reciclagem desenvolvido para o SENAI, onde usuários podem cadastrar materiais reciclados e acumular pontos.

## 🌟 Funcionalidades

### Frontend Implementado
- ✅ Landing page responsiva com design moderno
- ✅ Header com navegação e botões de autenticação
- ✅ Hero section com estatísticas
- ✅ Seção "Como Funciona" (4 etapas)
- ✅ Catálogo de materiais recicláveis
- ✅ Ranking de usuários (mock data)
- ✅ Footer completo
- ✅ Modal de autenticação (login/cadastro)

### Backend (Supabase) - A Implementar
- 🔄 Autenticação de usuários
- 🔄 Sistema de pontos
- 🔄 Ranking em tempo real
- 🔄 Dashboard do usuário
- 🔄 Histórico de reciclagem

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm run dev`

## 🔧 Configuração do Supabase

Para ativar as funcionalidades de backend:

1. **Clique no botão "Supabase" no canto superior direito**
2. Conecte ou crie um projeto Supabase
3. As tabelas serão criadas automaticamente
4. Configure as variáveis de ambiente

### Estrutura do Banco de Dados

#### Tabela: users
```sql
- id (UUID, primary key)
- email (text, unique)
- cpf (text, unique) 
- full_name (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tabela: materials
```sql
- id (UUID, primary key)
- name (text)
- points_per_unit (integer)
- category (text)
- description (text)
```

#### Tabela: recycling_records
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- material_type (text)
- quantity (integer)
- points_earned (integer)
- created_at (timestamp)
```

## 📱 Páginas Planejadas

- [x] Landing Page
- [ ] Página de Login
- [ ] Página de Cadastro
- [ ] Dashboard do Usuário
- [ ] Página de Ranking
- [ ] Perfil do Usuário

## 🎯 Materiais Aceitos

| Material | Pontos | Categoria |
|----------|--------|-----------|
| Garrafa PET | 5 | Plástico |
| Lata de Alumínio | 8 | Metal |
| Papel/Papelão | 3 | Papel |
| Vidro | 6 | Vidro |
| Plástico Rígido | 4 | Plástico |
| Metal | 7 | Metal |
| Eletrônicos | 15 | Eletrônico |
| Óleo de Cozinha | 10 | Óleo |

## 🛡️ Segurança

- Row Level Security (RLS) habilitado
- Políticas de acesso por usuário
- Validação de CPF
- Senhas criptografadas

## 🎨 Design

- Design responsivo
- Paleta de cores verde (sustentabilidade)
- Animações e micro-interações
- UX otimizada para mobile

## 📊 Estatísticas Atuais

- 500+ materiais cadastrados
- 2.5T de plástico reciclado
- 1.2M pontos distribuídos
- 150+ usuários ativos

---

Desenvolvido com 💚 para um mundo mais sustentável