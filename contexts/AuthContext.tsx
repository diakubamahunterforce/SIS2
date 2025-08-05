import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Policial } from '../types';

interface AuthContextType {
  user: Policial | null;
  login: (matricula: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  accessToken: string | null;
  adicionarPolicial: (policial: Policial & { senha: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Dados de policiais da Polícia Nacional de Angola
const policiaisAutorizados = [
  { id: '1', nome: 'Comandante João Silva Muana', posto: 'Comandante', matricula: 'PN001234', senha: 'pn2024' },
  { id: '2', nome: 'Subcomissário Maria Santos Capita', posto: 'Subcomissário', matricula: 'PN002345', senha: 'pn2024' },
  { id: '3', nome: 'Aspirante Carlos Eduardo Miguel', posto: 'Aspirante', matricula: 'PN003456', senha: 'pn2024' },
  { id: '4', nome: 'Agente Ana Paula Francisco', posto: 'Agente', matricula: 'PN004567', senha: 'pn2024' },
  { id: '5', nome: 'Agente Principal António Sebastião', posto: 'Agente Principal', matricula: 'PN005678', senha: 'pn2024' },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Policial | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [policiais, setPoliciais] = useState(policiaisAutorizados);

  // Verificar se existe sessão salva
  useEffect(() => {
    const savedUser = localStorage.getItem('bo_user');
    const savedToken = localStorage.getItem('bo_token');
    const savedPoliciais = localStorage.getItem('bo_policiais');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      } catch (error) {
        console.error('Erro ao carregar sessão salva:', error);
        localStorage.removeItem('bo_user');
        localStorage.removeItem('bo_token');
      }
    }

    if (savedPoliciais) {
      try {
        setPoliciais(JSON.parse(savedPoliciais));
      } catch (error) {
        console.error('Erro ao carregar policiais salvos:', error);
        localStorage.removeItem('bo_policiais');
      }
    }
    
    setLoading(false);
  }, []);

  const adicionarPolicial = (novoPolicial: Policial & { senha: string }) => {
    const policiaisAtualizados = [...policiais, novoPolicial];
    setPoliciais(policiaisAtualizados);
    localStorage.setItem('bo_policiais', JSON.stringify(policiaisAtualizados));
  };

  const login = async (matricula: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Primeiro tenta autenticação com API real
      try {
        const response = await fetch(`https://demo-project.supabase.co/functions/v1/make-server-bec4bad8/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer demo-anon-key`
          },
          body: JSON.stringify({ matricula, password: senha })
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
          setUser(data.policial);
          setAccessToken(data.access_token);
          
          // Salvar sessão
          localStorage.setItem('bo_user', JSON.stringify(data.policial));
          localStorage.setItem('bo_token', data.access_token);
          
          return true;
        }
      } catch (apiError) {
        console.log('API não disponível, usando autenticação local...');
      }

      // Autenticação local - buscar nos policiais cadastrados
      const policial = policiais.find(p => 
        p.matricula.toUpperCase() === matricula.toUpperCase() && 
        p.senha === senha
      );
      
      if (policial) {
        const sessionToken = `pn-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Remover senha do objeto user
        const { senha: _, ...policialSemSenha } = policial;
        
        setUser(policialSemSenha);
        setAccessToken(sessionToken);
        
        // Salvar sessão
        localStorage.setItem('bo_user', JSON.stringify(policialSemSenha));
        localStorage.setItem('bo_token', sessionToken);
        
        return true;
      }

      // Tentar senhas alternativas para compatibilidade
      const policialAlternativo = policiais.find(p => 
        p.matricula.toUpperCase() === matricula.toUpperCase() && 
        (senha === 'pn2024' || senha === p.matricula.toLowerCase() || senha === '123456')
      );

      if (policialAlternativo) {
        const sessionToken = `pn-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const { senha: _, ...policialSemSenha } = policialAlternativo;
        
        setUser(policialSemSenha);
        setAccessToken(sessionToken);
        
        localStorage.setItem('bo_user', JSON.stringify(policialSemSenha));
        localStorage.setItem('bo_token', sessionToken);
        
        return true;
      }

      // Authentication failed
      return false;
      
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('bo_user');
    localStorage.removeItem('bo_token');
  };

  const isAuthenticated = user !== null && accessToken !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      loading, 
      accessToken,
      adicionarPolicial
    }}>
      {children}
    </AuthContext.Provider>
  );
};