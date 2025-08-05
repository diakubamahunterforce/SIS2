import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Network, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users,
  Zap,
  Eye,
  Calendar,
  Target
} from 'lucide-react';
import { 
  correlacoesCriminais, 
  boletinsRegistrados, 
  pessoasCadastradas,
  distritosLuanda 
} from '../data/mockData';
import { CorrelacaoCriminal, BoletimOcorrencia, Pessoa } from '../types';

interface PadraoDetectado {
  id: string;
  tipo: 'temporal' | 'geografico' | 'metodologico' | 'suspeito';
  descricao: string;
  confianca: number;
  dadosRelacionados: any;
  deteccaoEm: string;
}

export const CorrelacaoCrimes: React.FC = () => {
  const [correlacoes, setCorrelacoes] = useState<CorrelacaoCriminal[]>(correlacoesCriminais);
  const [padroesDetectados, setPadroesDetectados] = useState<PadraoDetectado[]>([]);
  const [analisandoPadroes, setAnalisandoPadroes] = useState(false);
  const [progressoAnalise, setProgressoAnalise] = useState(0);
  const [correlacaoSelecionada, setCorrelacaoSelecionada] = useState<CorrelacaoCriminal | null>(null);
  const [dialogDetalhesAberto, setDialogDetalhesAberto] = useState(false);

  useEffect(() => {
    // Simular detecção automática de padrões
    detectarPadroesAutomaticamente();
  }, []);

  const detectarPadroesAutomaticamente = async () => {
    const padroes: PadraoDetectado[] = [
      {
        id: '1',
        tipo: 'temporal',
        descricao: 'Aumento de 300% em roubos à mão armada entre 14h-18h nos últimos 3 dias',
        confianca: 92,
        dadosRelacionados: { horario: '14:00-18:00', periodo: '3 dias' },
        deteccaoEm: new Date().toISOString()
      },
      {
        id: '2',
        tipo: 'geografico',
        descricao: 'Cluster de crimes em raio de 2km entre Ingombota e Maianga',
        confianca: 88,
        dadosRelacionados: { distritos: ['Ingombota', 'Maianga'], raio: '2km' },
        deteccaoEm: new Date().toISOString()
      },
      {
        id: '3',
        tipo: 'metodologico',
        descricao: 'Padrão similar: dupla em motocicleta, mesmas rotas de fuga',
        confianca: 95,
        dadosRelacionados: { metodo: 'motocicleta', participantes: 2 },
        deteccaoEm: new Date().toISOString()
      },
      {
        id: '4',
        tipo: 'suspeito',
        descricao: 'Suspeito "José Manuel" presente em 80% dos crimes recentes da região',
        confianca: 85,
        dadosRelacionados: { suspeito: 'José Manuel Sebastião', presenca: '80%' },
        deteccaoEm: new Date().toISOString()
      }
    ];

    setPadroesDetectados(padroes);
  };

  const executarAnaliseCompleta = async () => {
    setAnalisandoPadroes(true);
    setProgressoAnalise(0);

    const etapas = [
      'Coletando dados de todas as esquadras...',
      'Analisando padrões temporais...',
      'Identificando correlações geográficas...',
      'Analisando métodos operacionais...',
      'Correlacionando suspeitos...',
      'Gerando relatório final...'
    ];

    try {
      for (let i = 0; i < etapas.length; i++) {
        setProgressoAnalise(((i + 1) / etapas.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simular criação de novas correlações
      const novaCorrelacao: CorrelacaoCriminal = {
        id: (correlacoes.length + 1).toString(),
        suspeitos: ['3', '5'], // José Manuel e Carlos Alberto
        boletins: ['1', '2', '3'],
        padraoIdentificado: 'Análise automatizada identificou padrão multi-distrital: Suspeitos trabalham em coordenação entre Ingombota, Maianga e Sambizanga. Modus operandi: roubos em horário comercial com veículos de fuga pré-posicionados.',
        confianca: 93,
        criadoEm: new Date().toISOString(),
        status: 'ativo'
      };

      setCorrelacoes(prev => [...prev, novaCorrelacao]);

      // Adicionar novos padrões detectados
      const novosPatroes: PadraoDetectado[] = [
        {
          id: '5',
          tipo: 'temporal',
          descricao: 'Nova análise: Pico de criminalidade às quartas-feiras (67% dos crimes)',
          confianca: 89,
          dadosRelacionados: { dia: 'quarta-feira', percentual: '67%' },
          deteccaoEm: new Date().toISOString()
        },
        {
          id: '6',
          tipo: 'geografico',
          descricao: 'Rota preferencial identificada: Fuga sempre em direção ao distrito de Sambizanga',
          confianca: 91,
          dadosRelacionados: { rotaFuga: 'Sambizanga', frequencia: '90%' },
          deteccaoEm: new Date().toISOString()
        }
      ];

      setPadroesDetectados(prev => [...prev, ...novosPatroes]);

    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setAnalisandoPadroes(false);
    }
  };

  const abrirDetalhesCorrelacao = (correlacao: CorrelacaoCriminal) => {
    setCorrelacaoSelecionada(correlacao);
    setDialogDetalhesAberto(true);
  };

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 90) return 'bg-green-100 text-green-800';
    if (confianca >= 80) return 'bg-yellow-100 text-yellow-800';
    if (confianca >= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'temporal': return Clock;
      case 'geografico': return MapPin;
      case 'metodologico': return Target;
      case 'suspeito': return Users;
      default: return AlertTriangle;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'temporal': return 'bg-blue-100 text-blue-800';
      case 'geografico': return 'bg-purple-100 text-purple-800';
      case 'metodologico': return 'bg-indigo-100 text-indigo-800';
      case 'suspeito': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Sistema de Correlação Criminal</h1>
          <p className="text-gray-600">Análise inteligente de padrões e conexões criminais</p>
        </div>
        <Button 
          onClick={executarAnaliseCompleta}
          disabled={analisandoPadroes}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          {analisandoPadroes ? 'Analisando...' : 'Análise Completa'}
        </Button>
      </div>

      {/* Progresso da análise */}
      {analisandoPadroes && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium">Executando análise de correlação avançada...</span>
              </div>
              <Progress value={progressoAnalise} className="w-full" />
              <p className="text-sm text-blue-600">
                {progressoAnalise.toFixed(0)}% concluído
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Correlações Ativas</span>
              <Badge className="bg-blue-100 text-blue-800">{correlacoes.filter(c => c.status === 'ativo').length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Padrões Detectados</span>
              <Badge className="bg-green-100 text-green-800">{padroesDetectados.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Crimes Correlacionados</span>
              <Badge className="bg-purple-100 text-purple-800">
                {boletinsRegistrados.filter(b => b.correlacionado).length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Taxa de Sucesso</span>
              <Badge className="bg-green-100 text-green-800">94%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Padrões Detectados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Padrões Detectados Automaticamente
            </CardTitle>
            <CardDescription>
              Sistema de IA identificou os seguintes padrões criminais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {padroesDetectados.slice(0, 4).map(padrao => {
                const IconComponent = getTipoIcon(padrao.tipo);
                return (
                  <div key={padrao.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <Badge className={getTipoColor(padrao.tipo)}>
                          {padrao.tipo}
                        </Badge>
                      </div>
                      <Badge className={getConfiancaColor(padrao.confianca)}>
                        {padrao.confianca}% confiança
                      </Badge>
                    </div>
                    <p className="text-sm">{padrao.descricao}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Detectado: {new Date(padrao.deteccaoEm).toLocaleDateString('pt-AO')} às{' '}
                      {new Date(padrao.deteccaoEm).toLocaleTimeString('pt-AO', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlações Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Correlações Criminais Ativas
          </CardTitle>
          <CardDescription>
            Crimes e suspeitos identificados como relacionados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlacoes.map(correlacao => {
              const boletinsCorrelacionados = boletinsRegistrados.filter(b => 
                correlacao.boletins.includes(b.id)
              );
              const suspeitosCorrelacionados = pessoasCadastradas.filter(p => 
                correlacao.suspeitos.includes(p.id)
              );

              return (
                <div key={correlacao.id} className="p-6 border rounded-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getConfiancaColor(correlacao.confianca)}>
                          {correlacao.confianca}% confiança
                        </Badge>
                        <Badge variant={correlacao.status === 'ativo' ? 'default' : 'secondary'}>
                          {correlacao.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{correlacao.padraoIdentificado}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Suspeitos */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Suspeitos Envolvidos</h4>
                          <div className="space-y-1">
                            {suspeitosCorrelacionados.map(suspeito => (
                              <div key={suspeito.id} className="flex items-center gap-2">
                                {suspeito.foto ? (
                                  <img 
                                    src={suspeito.foto} 
                                    alt={suspeito.nome}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                )}
                                <span className="text-sm">{suspeito.nome}</span>
                                {suspeito.status === 'procurado' && (
                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Crimes */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Crimes Relacionados</h4>
                          <div className="space-y-1">
                            {boletinsCorrelacionados.map(boletim => (
                              <div key={boletim.id} className="text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{boletim.numeroBoletim}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{boletim.tipoOcorrencia}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {boletim.distrito} • {new Date(boletim.dataHoraOcorrencia).toLocaleDateString('pt-AO')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Timeline</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs">Correlação identificada</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(correlacao.criadoEm).toLocaleDateString('pt-AO')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => abrirDetalhesCorrelacao(correlacao)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes da Correlação */}
      <Dialog open={dialogDetalhesAberto} onOpenChange={setDialogDetalhesAberto}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Correlação Criminal</DialogTitle>
            <DialogDescription>
              Análise completa dos padrões identificados
            </DialogDescription>
          </DialogHeader>
          
          {correlacaoSelecionada && (
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div className="flex items-center gap-4">
                <Badge className={getConfiancaColor(correlacaoSelecionada.confianca)}>
                  {correlacaoSelecionada.confianca}% de confiança
                </Badge>
                <Badge variant={correlacaoSelecionada.status === 'ativo' ? 'default' : 'secondary'}>
                  {correlacaoSelecionada.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Criado em {new Date(correlacaoSelecionada.criadoEm).toLocaleDateString('pt-AO')}
                </span>
              </div>

              {/* Padrão Identificado */}
              <Card>
                <CardHeader>
                  <CardTitle>Padrão Criminal Identificado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{correlacaoSelecionada.padraoIdentificado}</p>
                </CardContent>
              </Card>

              {/* Detalhes dos Suspeitos e Crimes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suspeitos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Suspeitos Correlacionados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pessoasCadastradas
                        .filter(p => correlacaoSelecionada.suspeitos.includes(p.id))
                        .map(suspeito => (
                          <div key={suspeito.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            {suspeito.foto ? (
                              <img 
                                src={suspeito.foto} 
                                alt={suspeito.nome}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{suspeito.nome}</div>
                              {suspeito.codinome && (
                                <div className="text-sm text-gray-600">"{suspeito.codinome}"</div>
                              )}
                              <div className="text-sm text-gray-500">
                                {suspeito.distrito} • B.I: {suspeito.bilheteIdentidade}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {suspeito.status === 'procurado' && (
                                  <Badge variant="destructive" className="text-xs">Procurado</Badge>
                                )}
                                {suspeito.nivelPericulosidade && (
                                  <Badge variant="outline" className="text-xs">
                                    {suspeito.nivelPericulosidade}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Crimes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Crimes Relacionados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {boletinsRegistrados
                        .filter(b => correlacaoSelecionada.boletins.includes(b.id))
                        .map(boletim => (
                          <div key={boletim.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="secondary">{boletim.tipoOcorrencia}</Badge>
                              <span className="text-xs text-gray-500">{boletim.numeroBoletim}</span>
                            </div>
                            <div className="text-sm mb-1">{boletim.local}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(boletim.dataHoraOcorrencia).toLocaleDateString('pt-AO')} às{' '}
                              {new Date(boletim.dataHoraOcorrencia).toLocaleTimeString('pt-AO', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {boletim.distrito}, {boletim.bairro}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recomendações */}
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendações do Sistema:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Aumentar patrulhamento nos distritos identificados</li>
                    <li>• Coordenar operações entre as esquadras envolvidas</li>
                    <li>• Intensificar busca pelos suspeitos correlacionados</li>
                    <li>• Monitorar padrões temporais identificados</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};