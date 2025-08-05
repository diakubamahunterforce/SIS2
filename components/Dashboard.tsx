import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { FileText, Users, TrendingUp, Clock, Loader2, Info } from 'lucide-react';
import { BoletimOcorrencia } from '../types';
import { useApi } from '../hooks/useApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demo
const mockEstatisticas = {
  totalBoletins: 5,
  porTipo: {
    'Roubo': 2,
    'Furto': 2,
    'Agressão': 1
  },
  porStatus: {
    'registrado': 3,
    'em_andamento': 2,
    'concluido': 0
  },
  ultimosDias: {
    '2025-07-26': 2,
    '2025-07-25': 1,
    '2025-07-24': 2,
    '2025-07-23': 0,
    '2025-07-22': 0,
    '2025-07-21': 0,
    '2025-07-20': 0
  }
};

const mockBoletins: BoletimOcorrencia[] = [
  {
    id: '1',
    numeroBoletim: 'BO-2025-001',
    dataHoraOcorrencia: '2025-07-26T14:30:00',
    tipoOcorrencia: 'Roubo',
    local: 'Rua das Flores, 123 - Centro',
    descricao: 'Vítima abordada por indivíduos em motocicleta',
    declaranteId: '1',
    policialId: '1',
    envolvidos: [],
    status: 'registrado',
    criadoEm: '2025-07-26T15:00:00',
    atualizadoEm: '2025-07-26T15:00:00'
  },
  {
    id: '2',
    numeroBoletim: 'BO-2025-002',
    dataHoraOcorrencia: '2025-07-26T10:15:00',
    tipoOcorrencia: 'Furto',
    local: 'Shopping Center Plaza - Estacionamento',
    descricao: 'Vidro quebrado e objetos subtraídos do veículo',
    declaranteId: '1',
    policialId: '2',
    envolvidos: [],
    status: 'em_andamento',
    criadoEm: '2025-07-26T11:00:00',
    atualizadoEm: '2025-07-26T11:30:00'
  }
];

export const Dashboard: React.FC = () => {
  const api = useApi();
  const [estatisticas, setEstatisticas] = useState<any>(mockEstatisticas);
  const [boletinsRecentes, setBoletinsRecentes] = useState<BoletimOcorrencia[]>(mockBoletins);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [estatisticasRes, boletinsRes] = await Promise.all([
        api.get('/relatorios/estatisticas'),
        api.get('/boletins')
      ]);

      // Check if we got real data or demo data
      if (estatisticasRes.data?.estatisticas && Object.keys(estatisticasRes.data.estatisticas.porTipo || {}).length > 0) {
        setEstatisticas(estatisticasRes.data.estatisticas);
        setDemoMode(false);
      }

      if (boletinsRes.data?.boletins && boletinsRes.data.boletins.length > 0) {
        const boletins = boletinsRes.data.boletins
          .sort((a: BoletimOcorrencia, b: BoletimOcorrencia) => 
            new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
          )
          .slice(0, 5);
        setBoletinsRecentes(boletins);
        setDemoMode(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Keep using mock data
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registrado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Preparar dados para gráfico
  const dadosGrafico = estatisticas ? Object.entries(estatisticas.ultimosDias || {})
    .map(([data, total]) => ({
      data,
      total: total as number,
      dataFormatada: new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(-7) // Últimos 7 dias
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de boletins de ocorrência</p>
      </div>

      {demoMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Modo Demonstração:</strong> Os dados exibidos são simulados para fins de demonstração. 
            Em ambiente de produção, estes seriam dados reais do banco de dados.
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">B.O.s Registrados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.totalBoletins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roubos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.porTipo?.Roubo || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.porStatus?.em_andamento || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.ultimosDias?.[new Date().toISOString().split('T')[0]] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ocorrências registradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ocorrências */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ocorrências por Dia</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dataFormatada" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? new Date(item.data).toLocaleDateString('pt-BR') : value;
                    }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" name="Ocorrências" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível para exibir
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boletins Recentes */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Boletins Recentes</CardTitle>
            <CardDescription>Últimas ocorrências registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {boletinsRecentes.length > 0 ? (
              <div className="space-y-4">
                {boletinsRecentes.map((boletim) => (
                  <div key={boletim.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{boletim.numeroBoletim}</span>
                        <Badge variant="secondary">{boletim.tipoOcorrencia}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{boletim.local}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(boletim.dataHoraOcorrencia).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(boletim.status)}>
                      {boletim.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-gray-500">
                Nenhum boletim registrado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Tipo */}
      {estatisticas?.porTipo && Object.keys(estatisticas.porTipo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Tipo de Ocorrência</CardTitle>
            <CardDescription>Distribuição dos tipos de crimes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(estatisticas.porTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{quantidade as number}</div>
                  <div className="text-sm text-gray-600">{tipo}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};