# CentralAuthapp TSX

Conversão completa do CentralAuthapp de PHP para React/TypeScript (TSX) com Tailwind CSS. Sistema de gerenciamento de chaves de autenticação com suporte a múltiplos idiomas e plataformas.

## 🎯 Características

- ✅ **Autenticação com Chaves** - Sistema de validação de chaves com HWID
- ✅ **Gerador de Keys** - Crie múltiplas chaves com diferentes tipos (weekly, monthly, lifetime)
- ✅ **Gerenciamento de Devices** - Rastreie e gerencie dispositivos conectados
- ✅ **Gerenciamento de Packages** - Crie e configure pacotes de API
- ✅ **Suporte Multilíngue** - Inglês, Português (BR) e Vietnamita
- ✅ **Gráficos de Estatísticas** - Visualize dados dos últimos 7 dias
- ✅ **Interface Mobile-First** - Design responsivo otimizado para mobile
- ✅ **Armazenamento Local** - Todos os dados salvos em localStorage
- ✅ **Compatível com Vercel** - Deploy sem servidor Express

## 📁 Estrutura do Projeto

```
client/
├── public/
│   ├── keys.json          # Dados de exemplo
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Chart.tsx              # Gráfico de estatísticas
│   │   ├── CreateKeyModal.tsx      # Modal para gerar keys
│   │   ├── Modal.tsx              # Componente modal genérico
│   │   └── ErrorBoundary.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Contexto de autenticação
│   │   ├── LanguageContext.tsx    # Contexto de idioma
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useKeyData.ts          # Hook para gerenciamento de dados
│   │   └── useStorage.ts          # Hook para localStorage
│   ├── lib/
│   │   └── utils.ts               # Funções utilitárias
│   ├── pages/
│   │   ├── Login.tsx              # Página de login
│   │   ├── Home.tsx               # Página inicial
│   │   ├── Keys.tsx               # Gerenciamento de keys
│   │   ├── Devices.tsx            # Gerenciamento de devices
│   │   ├── Packages.tsx           # Gerenciamento de packages
│   │   └── Profile.tsx            # Perfil do usuário
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript
│   ├── App.tsx                    # Componente raiz
│   ├── main.tsx                   # Entrada da aplicação
│   └── index.css                  # Estilos globais
├── index.html
└── package.json
```

## 🚀 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- pnpm ou npm

### Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview de produção
pnpm preview
```

## 📖 Como Usar

### Login
1. Use uma das chaves de exemplo para fazer login:
   - `FERRAOBASIC1` (BASIC)
   - `FERRAOPRO1` (PRO)
   - `FERRAODEV` (DEV)

### Gerar Keys
1. Clique no botão **+** na página Home
2. Configure:
   - **Quantidade**: 1-100 keys
   - **Tipo**: Weekly, Monthly ou Lifetime
   - **Duração**: Número de dias
   - **Package**: Selecione um package
3. Clique em **✦ Gerar Keys**
4. Copie as keys geradas

### Gerenciar Devices
1. Vá para a aba **Devices**
2. Visualize todos os dispositivos conectados
3. Resete ou revogue devices conforme necessário

### Criar Packages
1. Vá para a aba **Pacotes**
2. Clique em **+** para adicionar novo package
3. Configure:
   - **Nome**: Nome do package
   - **URL da API**: Endpoint para enviar keys
   - **Descrição**: Descrição opcional

### Integração
1. Vá para **Perfil** → **Integração**
2. Copie o código de exemplo (JavaScript ou Luau/Roblox)
3. Integre em sua aplicação

## 🔐 Autenticação

### Sistema de HWID
- Cada dispositivo recebe um HWID único armazenado em localStorage
- As chaves são vinculadas ao HWID para evitar compartilhamento
- Ao resetar um device, a chave fica disponível novamente

### Níveis de Acesso
- **BASIC**: Limite de 500 requests/dia
- **PRO**: Limite de 1000 requests/dia com suporte a múltiplos packages
- **DEV**: Limite de 5000 requests/dia com acesso total

## 💾 Armazenamento de Dados

Todos os dados são armazenados em localStorage:
- `ferrao_keys` - Keys geradas localmente
- `ferrao_packages` - Packages configurados
- `ferrao_limit` - Contador de limite
- `ferrao_chart` - Dados do gráfico
- `ferrao_api_keys` - Keys da API remota
- `ferrao_deleted` - IDs de keys deletadas
- `ferrao_lang` - Idioma selecionado
- `auth_state` - Estado de autenticação

## 🌐 Idiomas Suportados

- 🇺🇸 English
- 🇧🇷 Português (BR)
- 🇻🇳 Tiếng Việt

## 📱 Responsividade

- Otimizado para dispositivos móveis
- Suporta até 932px de altura (viewport mobile)
- Interface adaptável para tablets e desktops

## 🎨 Design

- **Fonte**: DM Sans
- **Cores**: Azul (#1a56e8), Verde (#22c55e), Vermelho (#ef4444)
- **Raio de borda**: 16px padrão
- **Sombras**: Sutis e consistentes

## 🔧 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilos utilitários
- **Vite** - Build tool
- **Wouter** - Roteamento leve
- **Lucide React** - Ícones

## 📦 Deploy na Vercel

Este projeto é totalmente compatível com Vercel:

```bash
# Deploy automático via GitHub
# Ou use Vercel CLI:
vercel deploy
```

**Nota**: Não há servidor Express ou `server.listen`. O projeto é 100% frontend estático.

## 🐛 Troubleshooting

### Keys não aparecem após gerar
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador
- Recarregue a página

### Login não funciona
- Certifique-se de usar uma chave válida
- Verifique o HWID no console
- Tente em uma aba privada

### Gráfico não renderiza
- Verifique se o canvas está suportado
- Recarregue a página
- Tente em outro navegador

## 📝 Licença

MIT

## 👨‍💻 Autor

Convertido de PHP para TSX em 2026

---

**Versão**: 1.0.0 (TSX)
**Última atualização**: Março 2026
