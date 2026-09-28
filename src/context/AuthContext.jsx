import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { verifyOnlineCredentials } from '../services/onlineDatabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('eduagenda_session');
    return saved ? JSON.parse(saved).isAuthenticated : false;
  });

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('eduagenda_session');
    return saved ? JSON.parse(saved).role : 'PAI';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eduagenda_session');
    const savedRole = saved ? JSON.parse(saved).role : 'PAI';
    return MOCK_USERS[savedRole] || MOCK_USERS.PAI;
  });

  const [selectedStudentId, setSelectedStudentId] = useState(() => {
    const savedRole = role;
    if (savedRole === 'PAI' && MOCK_USERS.PAI.students?.length > 0) {
      return MOCK_USERS.PAI.students[0].id;
    }
    return null;
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(
        'eduagenda_session',
        JSON.stringify({ isAuthenticated: true, role })
      );
    } else {
      localStorage.removeItem('eduagenda_session');
    }
  }, [isAuthenticated, role]);

  const login = async (email, password, targetRole) => {
    // Consulta HTTP ao Banco de Dados REST API em Nuvem
    const res = await verifyOnlineCredentials(email, password, targetRole);

    if (!res.success) {
      return res; // Bloqueia e retorna erro caso HTTP 401 ou 404
    }

    const selectedRole = res.role || targetRole || 'PAI';
    const user = MOCK_USERS[selectedRole] || MOCK_USERS.PAI;

    setRole(selectedRole);
    setCurrentUser(user);
    if (selectedRole === 'PAI' && user.students?.length > 0) {
      setSelectedStudentId(user.students[0].id);
    }
    setIsAuthenticated(true);
    return { success: true, user, statusCode: res.statusCode };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('eduagenda_session');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setCurrentUser(MOCK_USERS[newRole]);
    if (newRole === 'PAI' && MOCK_USERS.PAI.students.length > 0) {
      setSelectedStudentId(MOCK_USERS.PAI.students[0].id);
    }
  };

  const selectedStudent =
    role === 'PAI'
      ? currentUser.students?.find((s) => s.id === selectedStudentId) || currentUser.students?.[0]
      : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        currentUser,
        selectedStudent,
        selectedStudentId,
        setSelectedStudentId,
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

