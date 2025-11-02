# 🎯 INSTRUÇÕES - APLICAR MIGRATIONS NO SUPABASE

## 📋 Passo a Passo:

### 1️⃣ Acesse o Supabase
- Vá em: https://supabase.com/dashboard
- Entre no seu projeto
- Clique em **SQL Editor** no menu lateral

---

### 2️⃣ Execute os arquivos SQL NESTA ORDEM:

#### **ARQUIVO 1: consolidated_migration.sql**
📁 Localização: `supabase/migrations/consolidated_migration.sql`

**O que faz:**
- Cria tabelas: users, materials, recycling_records
- Insere os 8 materiais escolares
- Cria triggers automáticos

**Como executar:**
1. Abra o arquivo no VS Code
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (ou F5)
5. ✅ Aguarde aparecer "Success"

---

#### **ARQUIVO 2: add_rewards_system.sql**
📁 Localização: `supabase/migrations/add_rewards_system.sql`

**O que faz:**
- Cria tabela de recompensas (rewards)
- Cria tabela de resgates (redeemed_rewards)
- Insere 12 prêmios
- Cria função redeem_reward()

**Como executar:**
1. Abra o arquivo no VS Code
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**
5. ✅ Aguarde "Success"

---

#### **ARQUIVO 3: add_anti_fraud_system.sql**
📁 Localização: `supabase/migrations/add_anti_fraud_system.sql`

**O que faz:**
- Adiciona coluna max_quantity_per_day aos materiais
- Cria validações de limite (3 registros/dia, 50 pontos/dia)
- Cria trigger para bloquear fraudes
- Cria view user_daily_stats

**Como executar:**
1. Abra o arquivo no VS Code
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**
5. ✅ Aguarde "Success"

---

#### **ARQUIVO 4: fix_remove_old_materials.sql** ⚠️ IMPORTANTE!
📁 Localização: `supabase/migrations/fix_remove_old_materials.sql`

**O que faz:**
- **DELETA** materiais antigos (Eletrônicos, Óleo, Vidro, Metal genérico)
- **MANTÉM** apenas os 8 materiais escolares
- **ADICIONA** os limites por material

**Como executar:**
1. Abra o arquivo no VS Code
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN**
5. ✅ Aguarde "Success - Materiais atualizados!"

---

## 🎉 Pronto! Depois disso:

1. **Recarregue o site** (F5)
2. **Verifique** se aparecem APENAS 8 materiais:
   - 🍶 Garrafa PET
   - 🥤 Lata de Alumínio
   - 🌯 Papel Alumínio
   - 📄 Papel
   - 📦 Papelão
   - 🥤 Copo Plástico
   - 🥡 Embalagem Plástica
   - 🛍️ Sacola Plástica

3. **NÃO DEVE** aparecer:
   - ❌ Eletrônicos
   - ❌ Óleo de Cozinha
   - ❌ Vidro
   - ❌ Metal genérico

---

## ⚠️ Problemas?

Se der erro ao executar, pode ser que você já tenha executado antes.

**Solução:** Delete o banco inteiro e recomece do ARQUIVO 1.

Ou no SQL Editor, execute antes:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Depois execute os 4 arquivos na ordem.
