import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Search, 
  Camera, 
  Upload, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  MapPin,
  Calendar,
  FileText,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { pessoasCadastradas, boletinsRegistrados, distritosLuanda } from '../data/mockData';
import { Pessoa, BoletimOcorrencia } from '../types';

interface MatchFacial {
  pessoa: Pessoa;
  confianca: number;
  ultimaOcorrencia?: BoletimOcorrencia;
}

export const BuscaAvancada: React.FC = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [codinomeBusca, setCodinomeBusca] = useState('');
  const [biBusca, setBiBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Pessoa[]>([]);
  const [imagemUpload, setImagemUpload] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string>('');
  const [processandoReconhecimento, setProcessandoReconhecimento] = useState(false);
  const [progressoReconhecimento, setProgressoReconhecimento] = useState(0);
  const [matchesFaciais, setMatchesFaciais] = useState<MatchFacial[]>([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
  const [dialogDetalhesAberto, setDialogDetalhesAberto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buscarPorTexto = () => {
    if (!termoBusca && !codinomeBusca && !biBusca) {
      toast.error('Digite pelo menos um critério de busca');
      return;
    }

    let resultados = pessoasCadastradas.filter(pessoa => {
      const matchNome = termoBusca ? pessoa.nome.toLowerCase().includes(termoBusca.toLowerCase()) : true;
      const matchCodinome = codinomeBusca ? pessoa.codinome?.toLowerCase().includes(codinomeBusca.toLowerCase()) : true;
      const matchBI = biBusca ? pessoa.bilheteIdentidade.includes(biBusca.toUpperCase()) : true;
      
      return matchNome && matchCodinome && matchBI;
    });

    setResultadosBusca(resultados);
    
    if (resultados.length === 0) {
      toast.error('Nenhum resultado encontrado');
    } else {
      toast.success(`${resultados.length} pessoa(s) encontrada(s)`);
    }
  };

  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      // Validar tipo de arquivo
      if (!arquivo.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (max 10MB)
      if (arquivo.size > 10 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 10MB');
        return;
      }

      setImagemUpload(arquivo);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImagem(e.target?.result as string);
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const iniciarReconhecimentoFacial = async () => {
    if (!imagemUpload) {
      toast.error('Por favor, selecione uma imagem primeiro');
      return;
    }

    setProcessandoReconhecimento(true);
    setProgressoReconhecimento(0);
    setMatchesFaciais([]);

    try {
      // Simular processamento de reconhecimento facial
      const etapas = [
        'Analisando características faciais...',
        'Comparando com banco de dados...',
        'Calculando similaridades...',
        'Gerando resultados...'
      ];

      for (let i = 0; i < etapas.length; i++) {
        toast.info(etapas[i]);
        setProgressoReconhecimento((i + 1) * 25);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simular matches (em produção, seria uma API de reconhecimento facial)
      const pessoasComFoto = pessoasCadastradas.filter(p => p.foto);
      const matches: MatchFacial[] = [];

      // Simular alguns matches com diferentes níveis de confiança
      if (pessoasComFoto.length > 0) {
        // Match alto (suspeito conhecido)
        if (Math.random() > 0.3) {
          const pessoaMatch = pessoasComFoto.find(p => p.tipo === 'suspeito');
          if (pessoaMatch) {
            const ultimaOcorrencia = boletinsRegistrados
              .filter(b => b.envolvidos.some(e => e.pessoaId === pessoaMatch.id))
              .sort((a, b) => new Date(b.dataHoraOcorrencia).getTime() - new Date(a.dataHoraOcorrencia).getTime())[0];
            
            matches.push({
              pessoa: pessoaMatch,
              confianca: 85 + Math.random() * 10, // 85-95%
              ultimaOcorrencia
            });
          }
        }

        // Matches médios
        const outrasMatch = pessoasComFoto.filter(p => p.tipo !== 'suspeito').slice(0, 2);
        outrasMatch.forEach(pessoa => {
          if (Math.random() > 0.5) {
            matches.push({
              pessoa,
              confianca: 60 + Math.random() * 20, // 60-80%
            });
          }
        });
      }

      setMatchesFaciais(matches.sort((a, b) => b.confianca - a.confianca));
      
      if (matches.length === 0) {
        toast.warning('Nenhum match facial encontrado no banco de dados');
      } else {
        toast.success(`${matches.length} match(es) facial(ais) encontrado(s)`);
      }

    } catch (error) {
      console.error('Erro no reconhecimento facial:', error);
      toast.error('Erro no processamento. Tente novamente.');
    } finally {
      setProcessandoReconhecimento(false);
      setProgressoReconhecimento(100);
    }
  };

  const abrirDetalhes = (pessoa: Pessoa) => {
    setPessoaSelecionada(pessoa);
    setDialogDetalhesAberto(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'procurado': return 'bg-red-100 text-red-800';
      case 'detido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPericulosidadeColor = (nivel?: string) => {
    switch (nivel) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 85) return 'bg-green-100 text-green-800';
    if (confianca >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Busca Avançada de Criminosos</h1>
        <p className="text-gray-600">Sistema integrado de identificação e reconhecimento facial</p>
      </div>

      <Tabs defaultValue="texto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="texto" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Busca por Texto
          </TabsTrigger>
          <TabsTrigger value="facial" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Reconhecimento Facial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="texto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Busca por Dados Pessoais
              </CardTitle>
              <CardDescription>
                Pesquise por nome, codinome ou número do B.I
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="codinome">Codinome/Alcunha</Label>
                  <Input
                    id="codinome"
                    value={codinomeBusca}
                    onChange={(e) => setCodinomeBusca(e.target.value)}
                    placeholder="Ex: Zé do Mercado"
                  />
                </div>
                <div>
                  <Label htmlFor="bi">Número do B.I</Label>
                  <Input
                    id="bi"
                    value={biBusca}
                    onChange={(e) => setBiBusca(e.target.value)}
                    placeholder="Ex: 007123456LA044"
                  />
                </div>
              </div>
              
              <Button onClick={buscarPorTexto} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </CardContent>
          </Card>

          {/* Resultados da busca por texto */}
          {resultadosBusca.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados da Busca ({resultadosBusca.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resultadosBusca.map(pessoa => (
                    <div key={pessoa.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      {pessoa.foto ? (
                        <img 
                          src={pessoa.foto} 
                          alt={pessoa.nome}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{pessoa.nome}</span>
                          {pessoa.codinome && (
                            <Badge variant="outline">"{pessoa.codinome}"</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          B.I: {pessoa.bilheteIdentidade}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(pessoa.status)}>
                            {pessoa.status || 'ativo'}
                          </Badge>
                          <Badge variant="secondary">{pessoa.tipo}</Badge>
                          {pessoa.nivelPericulosidade && (
                            <Badge className={getPericulosidadeColor(pessoa.nivelPericulosidade)}>
                              Periculosidade: {pessoa.nivelPericulosidade}
                            </Badge>
                          )}
                        </div>
                        {pessoa.distrito && (
                          <div className="text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {pessoa.distrito}, {pessoa.bairro}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => abrirDetalhes(pessoa)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Reconhecimento Facial
              </CardTitle>
              <CardDescription>
                Carregue uma foto para identificar o indivíduo no banco de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload de imagem */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewImagem ? (
                  <div className="space-y-4">
                    <img 
                      src={previewImagem} 
                      alt="Preview" 
                      className="w-48 h-48 object-cover rounded-lg mx-auto"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Trocar Imagem
                      </Button>
                      <Button 
                        onClick={iniciarReconhecimentoFacial}
                        disabled={processandoReconhecimento}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {processandoReconhecimento ? 'Processando...' : 'Iniciar Reconhecimento'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg">Carregue uma imagem para análise</p>
                      <p className="text-sm text-gray-500">
                        Formatos aceites: JPG, PNG, GIF. Tamanho máximo: 10MB
                      </p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Imagem
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagemUpload}
                  className="hidden"
                />
              </div>

              {/* Progresso do reconhecimento */}
              {processandoReconhecimento && (
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Processando reconhecimento facial...</span>
                      </div>
                      <Progress value={progressoReconhecimento} className="w-full" />
                      <p className="text-sm text-blue-600">
                        {progressoReconhecimento}% concluído
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resultados do reconhecimento facial */}
              {matchesFaciais.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Matches Encontrados ({matchesFaciais.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {matchesFaciais.map((match, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="relative">
                            {match.pessoa.foto ? (
                              <img 
                                src={match.pessoa.foto} 
                                alt={match.pessoa.nome}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-500" />
                              </div>
                            )}
                            <Badge 
                              className={`absolute -top-2 -right-2 ${getConfiancaColor(match.confianca)}`}
                            >
                              {match.confianca.toFixed(0)}%
                            </Badge>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{match.pessoa.nome}</span>
                              {match.pessoa.codinome && (
                                <Badge variant="outline">"{match.pessoa.codinome}"</Badge>
                              )}
                              {match.pessoa.status === 'procurado' && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              B.I: {match.pessoa.bilheteIdentidade}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getStatusColor(match.pessoa.status)}>
                                {match.pessoa.status || 'ativo'}
                              </Badge>
                              {match.pessoa.nivelPericulosidade && (
                                <Badge className={getPericulosidadeColor(match.pessoa.nivelPericulosidade)}>
                                  {match.pessoa.nivelPericulosidade}
                                </Badge>
                              )}
                            </div>
                            {match.ultimaOcorrencia && (
                              <div className="text-sm text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Última ocorrência: {new Date(match.ultimaOcorrencia.dataHoraOcorrencia).toLocaleDateString('pt-AO')}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => abrirDetalhes(match.pessoa)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogDetalhesAberto} onOpenChange={setDialogDetalhesAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Indivíduo</DialogTitle>
            <DialogDescription>
              Informações completas e histórico criminal
            </DialogDescription>
          </DialogHeader>
          
          {pessoaSelecionada && (
            <div className="space-y-6">
              {/* Informações pessoais */}
              <div className="flex items-start gap-4">
                {pessoaSelecionada.foto ? (
                  <img 
                    src={pessoaSelecionada.foto} 
                    alt={pessoaSelecionada.nome}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{pessoaSelecionada.nome}</h3>
                  {pessoaSelecionada.codinome && (
                    <p className="text-gray-600">Codinome: "{pessoaSelecionada.codinome}"</p>
                  )}
                  <p className="text-sm text-gray-500">B.I: {pessoaSelecionada.bilheteIdentidade}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(pessoaSelecionada.status)}>
                      {pessoaSelecionada.status || 'ativo'}
                    </Badge>
                    <Badge variant="secondary">{pessoaSelecionada.tipo}</Badge>
                    {pessoaSelecionada.nivelPericulosidade && (
                      <Badge className={getPericulosidadeColor(pessoaSelecionada.nivelPericulosidade)}>
                        Periculosidade: {pessoaSelecionada.nivelPericulosidade}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Telefone</Label>
                  <p>{pessoaSelecionada.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-medium">Data de Nascimento</Label>
                  <p>{pessoaSelecionada.dataNascimento ? new Date(pessoaSelecionada.dataNascimento).toLocaleDateString('pt-AO') : 'Não informado'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="font-medium">Endereço</Label>
                  <p>{pessoaSelecionada.endereco || 'Não informado'}</p>
                </div>
                {pessoaSelecionada.distrito && (
                  <>
                    <div>
                      <Label className="font-medium">Distrito</Label>
                      <p>{pessoaSelecionada.distrito}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Bairro</Label>
                      <p>{pessoaSelecionada.bairro}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Histórico criminal */}
              {pessoaSelecionada.crimesRelacionados && pessoaSelecionada.crimesRelacionados.length > 0 && (
                <div>
                  <Label className="font-medium">Histórico Criminal</Label>
                  <div className="mt-2 space-y-2">
                    {pessoaSelecionada.crimesRelacionados.map(crimeId => {
                      const boletim = boletinsRegistrados.find(b => b.id === crimeId);
                      if (!boletim) return null;
                      
                      return (
                        <div key={crimeId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant="secondary" className="mb-1">
                                {boletim.tipoOcorrencia}
                              </Badge>
                              <p className="text-sm">{boletim.local}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(boletim.dataHoraOcorrencia).toLocaleDateString('pt-AO')} • {boletim.numeroBoletim}
                              </p>
                            </div>
                            <FileText className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alerta se pessoa está procurada */}
              {pessoaSelecionada.status === 'procurado' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    <strong>ALERTA:</strong> Esta pessoa está atualmente procurada pelas autoridades. 
                    Contacte imediatamente a esquadra mais próxima se avistada.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};