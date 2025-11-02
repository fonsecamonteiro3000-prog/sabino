# 🚀 Guia de Implementação - EcoPoints com Supabase + Prisma

## ✅ O que já foi feito:

1. **Configuração do ambiente**
   - ✅ Arquivo `.env` criado com suas credenciais do Supabase
   - ✅ Prisma instalado e configurado
   - ✅ Schema do Prisma criado com os modelos User, Material, RecyclingRecord
   - ✅ Prisma Client gerado

2. **Migrações SQL preparadas**
   - ✅ `supabase/migrations/consolidated_migration.sql` - arquivo único com todas as migrations
   - ✅ Cria tabelas: users, materials, recycling_records
   - ✅ Cria view: user_rankings
   - ✅ Cria triggers automáticos para criação de perfil e atualização de pontos

3. **Hooks atualizados**
   - ✅ `useAuth` - suporta login/cadastro real via Supabase
   - ✅ `useRanking` - busca dados reais do ranking com real-time
   - ✅ `useRecycling` - gerencia materiais e registros de reciclagem

---

## 📝 Próximo Passo: Aplicar Migrações no Supabase

### **IMPORTANTE: Faça isso AGORA! 👇**

1. **Abra o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/cjwyplgstyzracxlclfc

2. **Vá para SQL Editor:**
   - No menu lateral, clique em "SQL Editor"

3. **Cole e Execute a Migration:**
   - Abra o arquivo: `supabase/migrations/consolidated_migration.sql`
   - Copie TODO o conteúdo do arquivo
   - Cole no SQL Editor do Supabase
   - Clique no botão "Run" (ou pressione Ctrl+Enter)

4. **Verifique se funcionou:**
   - Vá em "Table Editor" no menu lateral
   - Você deve ver 3 tabelas: `users`, `materials`, `recycling_records`
   - A tabela `materials` deve ter 8 registros (os materiais recicláveis)

---

## 🧪 Testando o Sistema

Depois de aplicar as migrações, teste:

### 1. **Teste de Cadastro**
   - Abra o site: http://localhost:5174
   - Clique em "Entrar/Cadastrar"
   - Escolha "Cadastrar-se"
   - Preencha: nome completo, CPF, email, senha
   - Clique em "Cadastrar"
   - ✅ Deve criar conta e fazer login automático

### 2. **Teste de Login**
   - Faça logout (se estiver logado)
   - Clique em "Entrar/Cadastrar"
   - Use o email e senha que você cadastrou
   - ✅ Deve fazer login e mostrar seu nome no header

### 3. **Teste de Pontos (Dashboard)**
   - Após login, acesse o Dashboard
   - Registre uma reciclagem (escolha material e quantidade)
   - ✅ Seus pontos devem aumentar automaticamente
   - ✅ Verifique no ranking se você aparece

---

## 🔍 Verificando no Banco de Dados

Para ver os dados diretamente no Supabase:

1. **Tabela Users:**
   - Table Editor → `users`
   - Deve mostrar seu cadastro com total_points

2. **Tabela Materials:**
   - Table Editor → `materials`
   - Deve ter 8 materiais (PET, Alumínio, Papel, etc.)

3. **Tabela Recycling Records:**
   - Table Editor → `recycling_records`
   - Deve mostrar seus registros de reciclagem

4. **View User Rankings:**
   - SQL Editor → Execute: `SELECT * FROM user_rankings ORDER BY ranking_position;`
   - Deve mostrar o ranking completo

---

## ⚠️ Troubleshooting

### Problema: "Failed to create user profile"
**Solução:** Execute novamente a migration, especialmente a parte do trigger `on_auth_user_created`

### Problema: "Pontos não atualizam"
**Solução:** Verifique se o trigger `on_recycling_record_created` foi criado:
```sql
SELECT * FROM information_schema.triggers WHERE event_object_table = 'recycling_records';
```

### Problema: "Cannot read properties of null (supabase)"
**Solução:** 
- Verifique se o `.env` está correto
- Reinicie o servidor Vite: Ctrl+C e depois `npm run dev`
- Verifique se as variáveis aparecem no console do navegador (F12)

---

## 🎯 Próximos Passos (Depois dos Testes)

1. **Melhorar Dashboard** - Adicionar gráficos, badges, achievements
2. **Upload de Fotos** - Implementar o usePhotoUpload para provas de reciclagem
3. **Notificações** - Sistema de notificações em tempo real
4. **Gamificação Avançada** - Challenges, streaks, multiplicadores
5. **Admin Panel** - Interface para gerenciar materiais e usuários

---

## 📞 Precisa de Ajuda?

- Verifique os logs no console do navegador (F12)
- Verifique os logs do terminal onde roda `npm run dev`
- Verifique os logs no Supabase Dashboard → Logs

---

**Última atualização:** ${new Date().toLocaleString('pt-BR')}
