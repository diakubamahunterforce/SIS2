import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Eye, Edit, FileText, Loader2, RefreshCw } from 'lucide-react';
import { tiposOcorrencia, pessoasCadastradas, policiaisRegistrados } from '../data/mockData';
import { BoletimOcorrencia, Pessoa, Policial } from '../types';
import { useApi } from '../hooks/useApi';
import { toast } from 'sonner@2.0.3';

export const ConsultarBoletins: React.FC = () => {
  const api = useApi();
  
  const [filtros, setFiltros] = useState({
    numeroBoletim: '',
    nomePessoa: '',
    codinome: '',
    tipoOcorrencia: 'todos',
    dataInicio: '',
    dataFim: ''
  });

  const [resultados, setResultados] = useState<BoletimOcorrencia[]>([]);
  const [boletimSelecionado, setBoletimSelecionado] = useState<BoletimOcorrencia | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [policiais, setPoliciais] = useState<Policial[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [boletinsRes, pessoasRes, policiaisRes] = await Promise.all([
        api.get('/boletins'),
        api.get('/pessoas'),
        api.get('/policiais')
      ]);

      if (boletinsRes.data?.boletins) {
        setResultados(boletinsRes.data.boletins);
      }
      if (pessoasRes.data?.pessoas) {
        setPessoas(pessoasRes.data.pessoas);
      }
      if (policiaisRes.data?.policiais) {
        setPoliciais(policiaisRes.data.policiais);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const buscar = async () => {
    setLoading(true);
    try {
      const response = await api.post('/boletins/buscar', filtros);
      
      if (response.data?.boletins) {
        setResultados(response.data.boletins);
        toast.success(`${response.data.total} boletins encontrados`);
      } else if (response.error) {
        toast.error('Erro na busca: ' + response.error);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({
      numeroBoletim: '',
      nomePessoa: '',
      codinome: '',
      tipoOcorrencia: 'todos',
      dataInicio: '',
      dataFim: ''
    });
    carregarDados(); // Recarregar todos os boletins
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registrado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPessoaNome = (id: string) => {
    const pessoa = pessoas.find(p => p.id === id);
    return pessoa ? `${pessoa.nome}${pessoa.codinome ? ` (${pessoa.codinome})` : ''}` : 'N/A';
  };

  const getPolicialNome = (id: string) => {
    const policial = policiais.find(p => p.id === id);
    return policial ? `${policial.posto} ${policial.nome}` : 'N/A';
  };

  if (boletimSelecionado) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do B.O.</h1>
            <p className="text-gray-600">{boletimSelecionado.numeroBoletim}</p>
          </div>
          <Button variant="outline" onClick={() => setBoletimSelecionado(null)}>
            Voltar à Consulta
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Número:</span> {boletimSelecionado.numeroBoletim}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {boletimSelecionado.tipoOcorrencia}
              </div>
              <div>
                <span className="font-medium">Data/Hora:</span> {new Date(boletimSelecionado.dataHoraOcorrencia).toLocaleString('pt-BR')}
              </div>
              <div>
                <span className="font-medium">Local:</span> {boletimSelecionado.local}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <Badge className={`ml-2 ${getStatusColor(boletimSelecionado.status)}`}>
                  {boletimSelecionado.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Policial Responsável:</span> {getPolicialNome(boletimSelecionado.policialId)}
              </div>
              <div>
                <span className="font-medium">Criado em:</span> {new Date(boletimSelecionado.criadoEm).toLocaleString('pt-BR')}
              </div>
              <div>
                <span className="font-medium">Última atualização:</span> {new Date(boletimSelecionado.atualizadoEm).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pessoas Envolvidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Declarante:</span> {getPessoaNome(boletimSelecionado.declaranteId)}
              </div>
              {boletimSelecionado.envolvidos && boletimSelecionado.envolvidos.length > 0 && (
                <div>
                  <span className="font-medium">Outros Envolvidos:</span>
                  <ul className="mt-2 space-y-1">
                    {boletimSelecionado.envolvidos.map((envolvido, index) => (
                      <li key={index} className="text-sm">
                        • {getPessoaNome(envolvido.pessoaId)} ({envolvido.papel})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Descrição dos Fatos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{boletimSelecionado.descricao}</p>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar B.O.
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultar Boletins</h1>
          <p className="text-gray-600">Busque e consulte boletins de ocorrência registrados</p>
        </div>
        <Button variant="outline" onClick={carregarDados} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
          <CardDescription>Use os filtros abaixo para encontrar boletins específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numeroBoletim">Número do B.O.</Label>
              <Input
                id="numeroBoletim"
                placeholder="Ex: BO-2025-001"
                value={filtros.numeroBoletim}
                onChange={(e) => handleFiltroChange('numeroBoletim', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nomePessoa">Nome da Pessoa</Label>
              <Input
                id="nomePessoa"
                placeholder="Digite o nome"
                value={filtros.nomePessoa}
                onChange={(e) => handleFiltroChange('nomePessoa', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="codinome">Codinome</Label>
              <Input
                id="codinome"
                placeholder="Digite o codinome"
                value={filtros.codinome}
                onChange={(e) => handleFiltroChange('codinome', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tipoOcorrencia">Tipo de Ocorrência</Label>
              <Select value={filtros.tipoOcorrencia || undefined} onValueChange={(value) => handleFiltroChange('tipoOcorrencia', value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tiposOcorrencia.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={limparFiltros} disabled={loading}>
              Limpar Filtros
            </Button>
            <Button onClick={buscar} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados ({resultados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando boletins...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número B.O.</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((boletim) => (
                  <TableRow key={boletim.id}>
                    <TableCell className="font-medium">{boletim.numeroBoletim}</TableCell>
                    <TableCell>{boletim.tipoOcorrencia}</TableCell>
                    <TableCell>{new Date(boletim.dataHoraOcorrencia).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{boletim.local}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(boletim.status)}>
                        {boletim.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBoletimSelecionado(boletim)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};