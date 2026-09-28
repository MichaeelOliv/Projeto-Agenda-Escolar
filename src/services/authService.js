// Serviço de validação de autenticação utilizando variáveis de ambiente (.env) com fallbacks padrão de produção

const getOnlineDatabaseUsers = () => {
  return [
    {
      email: import.meta.env.VITE_USER_PAI_EMAIL || "michaeel00@gmail.com",
      password: import.meta.env.VITE_USER_PAI_PASSWORD || "Agenda@2026",
      role: "PAI",
      name: import.meta.env.VITE_USER_PAI_NAME || "Michaeel Oliveira"
    },
    {
      email: import.meta.env.VITE_USER_PROFESSOR_EMAIL || "mariana.costa@horizontesdosaber.edu.br",
      password: import.meta.env.VITE_USER_PROFESSOR_PASSWORD || "Agenda@2026",
      role: "PROFESSOR",
      name: import.meta.env.VITE_USER_PROFESSOR_NAME || "Prof.ª Mariana Costa"
    },
    {
      email: import.meta.env.VITE_USER_DIRECAO_EMAIL || "direcao@horizontesdosaber.edu.br",
      password: import.meta.env.VITE_USER_DIRECAO_PASSWORD || "Agenda@2026",
      role: "DIRECAO",
      name: import.meta.env.VITE_USER_DIRECAO_NAME || "Dra. Beatriz Santos"
    }
  ];
};

export const authenticateOnlineUser = async (email, password, targetRole) => {
  // Simula latência de consulta HTTP/REST ao Banco de Dados Online (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  const users = getOnlineDatabaseUsers();

  // Procura usuário correspondente no Banco de Dados
  const foundUser = users.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );

  if (!foundUser) {
    return {
      success: false,
      message: "Credenciais não encontradas no banco de dados online. Verifique o e-mail informado."
    };
  }

  // Validação estrita da senha
  if (foundUser.password !== cleanPassword) {
    return {
      success: false,
      message: "Senha incorreta para este e-mail no banco de dados online. Acesso negado."
    };
  }

  return {
    success: true,
    user: foundUser,
    role: targetRole || foundUser.role
  };
};
