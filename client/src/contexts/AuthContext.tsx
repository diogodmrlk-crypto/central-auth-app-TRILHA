import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (key: string, hwid: string) => Promise<boolean>;
  logout: () => void;
  getHWID: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    loggedIn: false,
    activeKey: '',
    keyLevel: 'BASIC',
    keyLimit: 5000,
  });

  // Gera ou recupera HWID do localStorage
  const getHWID = (): string => {
    let hwid = localStorage.getItem('device_hwid');
    if (!hwid) {
      hwid = 'WEB-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('device_hwid', hwid);
    }
    return hwid;
  };

  // Carrega dados de autenticação do localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setAuth(parsed);
      } catch (e) {
        console.error('Erro ao carregar autenticação:', e);
      }
    }
  }, []);

  // Função de login
  const login = async (key: string, hwid: string): Promise<boolean> => {
    try {
      // Simula validação (em produção, seria uma chamada à API)
      // Para esta versão, apenas armazena localmente
      const newAuth: AuthState = {
        loggedIn: true,
        activeKey: key.toUpperCase(),
        keyLevel: 'BASIC', // Seria determinado pela API
        keyLimit: 5000,
      };

      setAuth(newAuth);
      localStorage.setItem('auth_state', JSON.stringify(newAuth));
      localStorage.setItem('key_hwid_' + key, hwid);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = (): void => {
    setAuth({
      loggedIn: false,
      activeKey: '',
      keyLevel: 'BASIC',
      keyLimit: 5000,
    });
    localStorage.removeItem('auth_state');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, getHWID }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
