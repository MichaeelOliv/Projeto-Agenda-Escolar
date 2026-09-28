# 🎓 EduAgenda - Colégio Horizontes do Saber

**EduAgenda** é uma plataforma moderna e intuitiva desenvolvida em **React** e **Vite** para conectar a comunidade escolar (Pais & Responsáveis, Professores e Direção) em tempo real. O sistema centraliza a comunicação, tarefas, avisos diários e integração com serviços REST em nuvem.

---

## 🚀 Funcionalidades Principais

- 👨‍👩‍👧‍👦 **Portal de Pais & Responsáveis**: Acompanhamento diário da rotina escolar, notificações, atividades e canal direto com a escola.
- 👩‍🏫 **Portal do Professor (Corpo Docente)**: Registro de frequência, diário de classe digital, postagem de tarefas e avisos para turmas.
- 🏫 **Portal da Direção & Coordenação**: Gestão institucional, visualização de métricas e envio de comunicados gerais.
- 🔒 **Autenticação Segura via `.env`**: Proteção estrita de dados de acesso e credenciais de API através de variáveis de ambiente.
- 🌐 **Integração REST API Online**: Comunicação com serviço de banco de dados REST em nuvem para validação de acesso.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 18](https://react.dev/) + [JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Iconografia**: [Lucide React](https://lucide.dev/)
- **Estilização**: CSS3 Moderno (Variáveis CSS, Flexbox, Grid Layout e Design Responsivo)

---

## 🔐 Configuração do Ambiente e Variáveis de Ambiente (`.env`)

Por motivos de segurança, o arquivo `.env` contendo dados sensíveis **não é versionado** no repositório GitHub.

### 📋 Passo a Passo para Configuração Local:

1. Clone o repositório:
   ```bash
   git clone https://github.com/MichaeelOliv/Projeto-Agenda-Escolar.git
   cd "Projeto Agenda Escolar"
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto com base no modelo `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Preencha o arquivo `.env` com as suas credenciais:
   ```env
   VITE_USER_PAI_EMAIL=seu_email_pai@dominio.com
   VITE_USER_PAI_PASSWORD=sua_senha_aqui
   VITE_USER_PAI_NAME=Nome do Responsavel

   VITE_USER_PROFESSOR_EMAIL=seu_email_prof@dominio.com
   VITE_USER_PROFESSOR_PASSWORD=sua_senha_aqui
   VITE_USER_PROFESSOR_NAME=Nome do Professor

   VITE_USER_DIRECAO_EMAIL=seu_email_direcao@dominio.com
   VITE_USER_DIRECAO_PASSWORD=sua_senha_aqui
   VITE_USER_DIRECAO_NAME=Nome do Diretor

   VITE_REST_API_ENDPOINT=https://66e3382dcf55d40d.mockapi.io/api/v1/users
   ```

---

## 🏃‍♂️ Como Executar o Projeto

- **Modo Desenvolvimento**:
  ```bash
  npm run dev
  ```
  Acesse a aplicação em `http://localhost:5173`.

- **Gerar Build de Produção**:
  ```bash
  npm run build
  ```

- **Visualizar Build de Produção**:
  ```bash
  npm run preview
  ```

---

## 📁 Estrutura de Pastas

```text
Projeto Agenda Escolar/
├── .env                # Variáveis de ambiente locais (Ignorado pelo Git)
├── .env.example        # Modelo de variáveis de ambiente para o repositório
├── .gitignore          # Arquivos e diretórios ignorados pelo Git
├── index.html          # HTML principal da aplicação
├── package.json        # Dependências e scripts do projeto
├── vite.config.js      # Configuração do Vite
└── src/
    ├── components/     # Componentes da interface (Login, Navbar, Calendar, etc.)
    ├── context/        # Contextos React (AuthContext, AgendaContext)
    ├── data/           # Dados mockados e modelos institucionais
    ├── services/       # Serviços de autenticação e comunicação com API (authService.js, onlineDatabase.js)
    ├── App.jsx         # Componente raiz da aplicação
    └── main.jsx        # Ponto de entrada React
```

---

## 📄 Licença

Este projeto é de uso privado para demonstração institucional.
