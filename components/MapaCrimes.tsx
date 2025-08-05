import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin, AlertTriangle, Users, Shield, Eye, Filter } from 'lucide-react';
import { 
  distritosLuanda, 
  bairrosLuanda, 
  boletinsRegistrados, 
  correlacoesCriminais, 
  alertasDistrito,
  pessoasCadastradas 
} from '../data/mockData';
import { BoletimOcorrencia, Distrito, AlertaDistrito } from '../types';

export const MapaCrimes: React.FC = () => {
  const [distritoSelecionado, setDistritoSelecionado] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('hoje');
  const [boletinsFiltrados, setBoletinsFiltrados] = useState<BoletimOcorrencia[]>(boletinsRegistrados);
  const [alertasAtivos, setAlertasAtivos] = useState<AlertaDistrito[]>(alertasDistrito.filter(a => a.status === 'ativo'));

  useEffect(() => {
    let filtrados = [...boletinsRegistrados];

    // Filtrar por distrito
    if (distritoSelecionado !== 'todos') {
      filtrados = filtrados.filter(b => b.distrito === distritoSelecionado);
    }

    // Filtrar por tipo
    if (tipoFiltro !== 'todos') {
      filtrados = filtrados.filter(b => b.tipoOcorrencia.includes(tipoFiltro));
    }

    // Filtrar por período
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (periodoFiltro === 'hoje') {
      filtrados = filtrados.filter(b => {
        const dataOcorrencia = new Date(b.dataHoraOcorrencia);
        return dataOcorrencia.toDateString() === hoje.toDateString();
      });
    } else if (periodoFiltro === 'ontem') {
      filtrados = filtrados.filter(b => {
        const dataOcorrencia = new Date(b.dataHoraOcorrencia);
        return dataOcorrencia.toDateString() === ontem.toDateString();
      });
    } else if (periodoFiltro === 'semana') {
      const semanaAtras = new Date(hoje);
      semanaAtras.setDate(hoje.getDate() - 7);
      filtrados = filtrados.filter(b => {
        const dataOcorrencia = new Date(b.dataHoraOcorrencia);
        return dataOcorrencia >= semanaAtras;
      });
    }

    setBoletinsFiltrados(filtrados);
  }, [distritoSelecionado, tipoFiltro, periodoFiltro]);

  const getCorDistrito = (distrito: string) => {
    const crimesDistrito = boletinsRegistrados.filter(b => b.distrito === distrito).length;
    if (crimesDistrito >= 3) return 'bg-red-500';
    if (crimesDistrito >= 2) return 'bg-yellow-500'; 
    if (crimesDistrito >= 1) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-300';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const sospeitosProcurados = pessoasCadastradas.filter(p => p.status === 'procurado');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Central de Comando Provincial</h1>
          <p className="text-gray-600">Monitorização em tempo real - Província de Luanda</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Sistema Online</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Distrito</label>
              <Select value={distritoSelecionado} onValueChange={setDistritoSelecionado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Distritos</SelectItem>
                  {distritosLuanda.map(d => (
                    <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Tipo de Crime</label>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="Roubo">Roubos</SelectItem>
                  <SelectItem value="Furto">Furtos</SelectItem>
                  <SelectItem value="Agressão">Agressões</SelectItem>
                  <SelectItem value="Homicídio">Homicídios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Período</label>
              <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ontem">Ontem</SelectItem>
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas Ativos */}
      {alertasAtivos.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas Ativos ({alertasAtivos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasAtivos.map(alerta => (
                <Alert key={alerta.id} className={getUrgenciaColor(alerta.urgencia)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{alerta.titulo}</div>
                        <div className="text-sm">{alerta.descricao}</div>
                        <div className="text-xs mt-1">
                          Distrito: {alerta.distrito} • Urgência: {alerta.urgencia.toUpperCase()}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {new Date(alerta.criadoEm).toLocaleTimeString('pt-AO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa dos Distritos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa de Criminalidade - Luanda
              </CardTitle>
              <CardDescription>
                Visualização em tempo real por distrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simulação de mapa simples */}
              <div className="bg-gray-100 rounded-lg p-6 min-h-[400px] relative">
                <div className="text-center text-gray-500 mb-4">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Mapa Interativo de Luanda</p>
                </div>
                
                {/* Distritos no mapa */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  {distritosLuanda.map((distrito, index) => {
                    const crimesDistrito = boletinsFiltrados.filter(b => b.distrito === distrito.nome).length;
                    return (
                      <div 
                        key={distrito.id}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${distritoSelecionado === distrito.nome ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
                          hover:border-blue-400 hover:shadow-md
                        `}
                        onClick={() => setDistritoSelecionado(distrito.nome)}
                      >
                        <div className={`w-4 h-4 rounded-full ${getCorDistrito(distrito.nome)} absolute top-2 right-2`}></div>
                        <div className="font-medium text-sm">{distrito.nome}</div>
                        <div className="text-xs text-gray-600">Pop: {distrito.populacao.toLocaleString()}</div>
                        <div className="text-lg font-bold mt-2">{crimesDistrito}</div>
                        <div className="text-xs">crimes hoje</div>
                        
                        {/* Suspeitos procurados no distrito */}
                        {sospeitosProcurados.filter(s => s.distrito === distrito.nome).length > 0 && (
                          <div className="mt-2">
                            <Badge variant="destructive" className="text-xs">
                              {sospeitosProcurados.filter(s => s.distrito === distrito.nome).length} procurados
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legenda */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg border">
                  <div className="text-xs font-medium mb-2">Nível de Criminalidade</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Baixo (0-1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs">Médio (1-2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Alto (2-3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Crítico (3+)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total de Crimes</span>
                <Badge className="bg-red-100 text-red-800">{boletinsFiltrados.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Suspeitos Procurados</span>
                <Badge className="bg-orange-100 text-orange-800">{sospeitosProcurados.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Correlações Ativas</span>
                <Badge className="bg-blue-100 text-blue-800">{correlacoesCriminais.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Distritos Conectados</span>
                <Badge className="bg-green-100 text-green-800">{distritosLuanda.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Suspeitos Procurados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Suspeitos Procurados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sospeitosProcurados.slice(0, 3).map(suspeito => (
                  <div key={suspeito.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    {suspeito.foto ? (
                      <img 
                        src={suspeito.foto} 
                        alt={suspeito.nome}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{suspeito.nome}</div>
                      {suspeito.codinome && (
                        <div className="text-xs text-gray-600">"{suspeito.codinome}"</div>
                      )}
                      <div className="text-xs">
                        {suspeito.distrito} • Nível: {suspeito.nivelPericulosidade}
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {suspeito.crimesRelacionados?.length || 0} crimes
                    </Badge>
                  </div>
                ))}
                
                {sospeitosProcurados.length > 3 && (
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Todos ({sospeitosProcurados.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crimes Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Crimes Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {boletinsFiltrados.slice(0, 3).map(boletim => (
                  <div key={boletim.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {boletim.tipoOcorrencia}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(boletim.dataHoraOcorrencia).toLocaleTimeString('pt-AO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="text-sm">{boletim.local}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {boletim.distrito} • {boletim.numeroBoletim}
                    </div>
                    {boletim.correlacionado && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Correlacionado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};