import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, Plus, X, Loader2 } from 'lucide-react';
import { tiposOcorrencia, pessoasCadastradas } from '../data/mockData';
import { Pessoa } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { toast } from "sonner"; // ✅ CERTO

export const NovaOcorrencia: React.FC = () => {
  const { user } = useAuth();
  const api = useApi();
  
  const [formData, setFormData] = useState({
    numeroBoletim: `BO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    dataHoraOcorrencia: new Date().toISOString().slice(0, 16),
    tipoOcorrencia: '',
    local: '',
    descricao: '',
    declaranteId: ''
  });

  const [envolvidos, setEnvolvidos] = useState<Array<{ pessoaId: string; papel: string }>>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar pessoas do backend
  useEffect(() => {
    const carregarPessoas = async () => {
      const response = await api.get('/pessoas');
      if (response.data && response.data.pessoas) {
        setPessoas(response.data.pessoas);
      } else if (response.error) {
        toast.error('Erro ao carregar pessoas: ' + response.error);
      }
    };

    carregarPessoas();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adicionarEnvolvido = (pessoaId: string, papel: string) => {
    if (!envolvidos.find(e => e.pessoaId === pessoaId)) {
      setEnvolvidos(prev => [...prev, { pessoaId, papel }]);
    }
  };

  const removerEnvolvido = (pessoaId: string) => {
    setEnvolvidos(prev => prev.filter(e => e.pessoaId !== pessoaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipoOcorrencia || !formData.local || !formData.descricao || !formData.declaranteId) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const boletimData = {
        ...formData,
        envolvidos,
        policialId: user?.id
      };

      const response = await api.post('/boletins', boletimData);

      if (response.data) {
        setShowSuccess(true);
        toast.success('Boletim de ocorrência registrado com sucesso!');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            numeroBoletim: `BO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
            dataHoraOcorrencia: new Date().toISOString().slice(0, 16),
            tipoOcorrencia: '',
            local: '',
            descricao: '',
            declaranteId: ''
          });
          setEnvolvidos([]);
        }, 3000);
      } else {
        toast.error('Erro ao registrar boletim: ' + response.error);
      }
    } catch (error) {
      console.error('Erro ao registrar boletim:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">B.O. Registrado!</h3>
            <p className="text-gray-600 mb-4">
              Boletim {formData.numeroBoletim} foi registrado com sucesso.
            </p>
            <Button onClick={() => setShowSuccess(false)}>
              Registrar Nova Ocorrência
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nova Ocorrência</h1>
        <p className="text-gray-600">Registro de boletim de ocorrência</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="numeroBoletim">Número do B.O. *</Label>
                <Input
                  id="numeroBoletim"
                  value={formData.numeroBoletim}
                  onChange={(e) => handleInputChange('numeroBoletim', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dataHora">Data e Hora da Ocorrência *</Label>
                <Input
                  id="dataHora"
                  type="datetime-local"
                  value={formData.dataHoraOcorrencia}
                  onChange={(e) => handleInputChange('dataHoraOcorrencia', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Ocorrência *</Label>
                <Select value={formData.tipoOcorrencia} onValueChange={(value) => handleInputChange('tipoOcorrencia', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposOcorrencia.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="local">Local da Ocorrência *</Label>
                <Input
                  id="local"
                  placeholder="Endereço completo"
                  value={formData.local}
                  onChange={(e) => handleInputChange('local', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Declarante</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="declarante">Declarante *</Label>
                <Select value={formData.declaranteId} onValueChange={(value) => handleInputChange('declaranteId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o declarante" />
                  </SelectTrigger>
                  <SelectContent>
                    {pessoas.map((pessoa) => (
                      <SelectItem key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome} {pessoa.codinome && `(${pessoa.codinome})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Descrição dos Fatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="descricao">Relato Detalhado *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente os fatos ocorridos..."
                className="min-h-[120px]"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pessoas Envolvidas</CardTitle>
            <CardDescription>Adicione vítimas, suspeitos e testemunhas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(pessoaId) => {
                const pessoa = pessoas.find(p => p.id === pessoaId);
                if (pessoa) adicionarEnvolvido(pessoaId, pessoa.tipo);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar pessoa" />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.filter(p => !envolvidos.find(e => e.pessoaId === p.id)).map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} - {pessoa.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {envolvidos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {envolvidos.map((envolvido) => {
                  const pessoa = pessoas.find(p => p.id === envolvido.pessoaId);
                  return (
                    <Badge key={envolvido.pessoaId} variant="secondary" className="flex items-center gap-2">
                      {pessoa?.nome} ({envolvido.papel})
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removerEnvolvido(envolvido.pessoaId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar B.O.'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};