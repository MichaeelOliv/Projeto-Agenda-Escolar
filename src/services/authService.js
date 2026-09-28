// Serviço de validação de autenticação simulando banco de dados online em nuvem

const ONLINE_DATABASE_USERS = [
  {
    email: "michaeel00@gmail.com",
    password: "Agenda@2026",
    role: "PAI",
    name: "Michaeel Oliveira"
  },
  {
    email: "mariana.costa@horizontesdosaber.edu.br",
    password: "Agenda@2026",
    role: "PROFESSOR",
    name: "Prof.ª Mariana Costa"
  },
  {
    email: "direcao@horizontesdosaber.edu.br",
    password: "Agenda@2026",
    role: "DIRECAO",
    name: "Dra. Beatriz Santos"
  }
];

export const authenticateOnlineUser = async (email, password, targetRole) => {
  // Simula latência de consulta HTTP/REST ao Banco de Dados Online (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  // Procura usuário correspondente no Banco de Dados
  const foundUser = ONLINE_DATABASE_USERS.find(
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
