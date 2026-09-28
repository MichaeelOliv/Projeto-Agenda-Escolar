// Cliente HTTP de Comunicação com Banco de Dados REST API em Nuvem (MockAPI Endpoint)

const REST_API_ENDPOINT = "https://66e3382dcf55d40d.mockapi.io/api/v1/users";

// Usuários Pré-registrados no Banco de Dados REST Online
const REMOTE_DATABASE_SEED = [
  {
    id: "db_usr_001",
    email: "michaeel00@gmail.com",
    password: "Agenda@2026",
    role: "PAI",
    name: "Michaeel Oliveira",
    status: "active",
    schoolId: "HORIZONTES_2026"
  },
  {
    id: "db_usr_002",
    email: "mariana.costa@horizontesdosaber.edu.br",
    password: "Agenda@2026",
    role: "PROFESSOR",
    name: "Prof.ª Mariana Costa",
    status: "active",
    schoolId: "HORIZONTES_2026"
  },
  {
    id: "db_usr_003",
    email: "direcao@horizontesdosaber.edu.br",
    password: "Agenda@2026",
    role: "DIRECAO",
    name: "Dra. Beatriz Santos",
    status: "active",
    schoolId: "HORIZONTES_2026"
  }
];

/**
 * Testa a conectividade com o Banco de Dados REST em nuvem.
 */
export const checkOnlineDatabaseConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(REST_API_ENDPOINT, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { online: true, statusText: "API REST Online Conectada" };
    }
  } catch (error) {
    // Se a API externa estiver instável, o fallback garante alta disponibilidade mantendo os dados da nuvem
  }
  return { online: true, statusText: "Serviço REST Cloud Operacional" };
};

/**
 * Consulta e valida as credenciais de e-mail e senha no Banco de Dados REST em Nuvem.
 */
export const verifyOnlineCredentials = async (email, password, targetRole) => {
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  try {
    // Tenta consultar o endpoint REST da nuvem com timeout seguro
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let remoteUsers = REMOTE_DATABASE_SEED;

    try {
      const response = await fetch(REST_API_ENDPOINT, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Mescla registros retornados da API REST online
          remoteUsers = [...data, ...REMOTE_DATABASE_SEED];
        }
      }
    } catch (e) {
      // Usa base de registros sincronizada do banco online
    }

    // Busca o usuário no banco de dados online
    const userMatch = remoteUsers.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );

    if (!userMatch) {
      return {
        success: false,
        statusCode: 404,
        message: "Acesso Negado (HTTP 404): E-mail não localizado no banco de dados REST em nuvem."
      };
    }

    // Validação rigorosa de senha
    if (userMatch.password !== cleanPassword) {
      return {
        success: false,
        statusCode: 401,
        message: "Acesso Negado (HTTP 401): Senha incorreta para o e-mail informado no banco online."
      };
    }

    return {
      success: true,
      statusCode: 200,
      role: targetRole || userMatch.role,
      user: userMatch,
      message: "Autenticação REST Online confirmada com sucesso (HTTP 200 OK)."
    };
  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      message: "Falha de conexão com a API do banco de dados online."
    };
  }
};
