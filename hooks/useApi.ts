import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// For demo purposes, we'll use mock data when the real API isn't available
const DEMO_MODE = true;

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Mock responses for demo
const mockResponses: Record<string, any> = {
  '/auth/login': {
    access_token: 'demo-token-12345',
    policial: {
      id: '1',
      nome: 'João Silva Santos',
      posto: 'Soldado',
      matricula: '123456'
    }
  },
  '/boletins': {
    boletins: []
  },
  '/pessoas': {
    pessoas: [
      {
        id: '1',
        nome: 'Roberto da Silva',
        tipo: 'declarante',
        documento: '123.456.789-00',
        telefone: '(11) 99999-9999'
      },
      {
        id: '2',
        nome: 'Maria das Dores',
        tipo: 'vitima',
        documento: '987.654.321-00',
        telefone: '(11) 88888-8888'
      }
    ]
  },
  '/policiais': {
    policiais: [
      {
        id: '1',
        nome: 'João Silva Santos',
        posto: 'Soldado',
        matricula: '123456'
      }
    ]
  },
  '/relatorios/estatisticas': {
    estatisticas: {
      totalBoletins: 0,
      porTipo: {},
      porStatus: {},
      ultimosDias: {}
    }
  }
};

export const useApi = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const makeRequest = async <T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    
    // Demo mode - return mock data
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const mockData = mockResponses[endpoint];
      if (mockData) {
        setLoading(false);
        return {
          data: mockData,
          error: null,
          loading: false
        };
      }

      // For POST requests (creating data), return success
      if (options.method === 'POST') {
        setLoading(false);
        return {
          data: { message: 'Criado com sucesso (modo demo)' },
          error: null,
          loading: false
        };
      }

      // For PUT requests (updating data), return success
      if (options.method === 'PUT') {
        setLoading(false);
        return {
          data: { message: 'Atualizado com sucesso (modo demo)' },
          error: null,
          loading: false
        };
      }

      // For DELETE requests, return success
      if (options.method === 'DELETE') {
        setLoading(false);
        return {
          data: { message: 'Deletado com sucesso (modo demo)' },
          error: null,
          loading: false
        };
      }
    }

    try {
      // Try to make real API call first
      const response = await fetch(
        `https://demo-project.supabase.co/functions/v1/make-server-bec4bad8${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || 'demo-anon-key'}`,
            ...options.headers,
          },
          ...options,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error [${response.status}]:`, data);
        setLoading(false);
        return {
          data: null,
          error: data.error || `Erro ${response.status}`,
          loading: false
        };
      }

      setLoading(false);
      return {
        data,
        error: null,
        loading: false
      };

    } catch (error) {
      console.error('Network Error - falling back to demo mode:', error);
      
      // Fallback to mock data on network error
      const mockData = mockResponses[endpoint];
      if (mockData) {
        setLoading(false);
        return {
          data: mockData,
          error: null,
          loading: false
        };
      }

      setLoading(false);
      return {
        data: null,
        error: 'Sistema em modo demonstração - algumas funcionalidades podem estar limitadas',
        loading: false
      };
    }
  };

  // Métodos específicos para operações comuns
  const get = <T = any>(endpoint: string) => 
    makeRequest<T>(endpoint, { method: 'GET' });

  const post = <T = any>(endpoint: string, body: any) =>
    makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });

  const put = <T = any>(endpoint: string, body: any) =>
    makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });

  const del = <T = any>(endpoint: string) =>
    makeRequest<T>(endpoint, { method: 'DELETE' });

  return {
    get,
    post,
    put,
    del,
    loading,
    makeRequest
  };
};