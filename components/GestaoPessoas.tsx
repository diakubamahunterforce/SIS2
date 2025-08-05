import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Pessoa } from '../types';
import { useApi } from '../hooks/useApi';
import { toast } from "sonner"; // ✅ CERTO


export const GestaoPessoas: React.FC = () => {
  const api = useApi();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAcao, setLoadingAcao] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    codinome: '',
    tipo: 'declarante' as Pessoa['tipo'],
    bilheteIdentidade: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    foto: ''
  });
  
  const [fotoSelecionada, setFotoSelecionada] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string>('');

  // Carregar pessoas do backend
  const carregarPessoas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pessoas');
      if (response.data && response.data.pessoas) {
        setPessoas(response.data.pessoas);
      } else if (response.error) {
        toast.error('Erro ao carregar pessoas: ' + response.error);
      }
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const handleInputChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      codinome: '',
      tipo: 'declarante',
      bilheteIdentidade: '',
      telefone: '',
      endereco: '',
      dataNascimento: '',
      foto: ''
    });
    setFotoSelecionada(null);
    setPreviewFoto('');
    setPessoaEditando(null);
  };

  const abrirDialog = (pessoa?: Pessoa) => {
    if (pessoa) {
      setPessoaEditando(pessoa);
      setFormData({
        nome: pessoa.nome,
        codinome: pessoa.codinome || '',
        tipo: pessoa.tipo,
        bilheteIdentidade: pessoa.bilheteIdentidade,
        telefone: pessoa.telefone || '',
        endereco: pessoa.endereco || '',
        dataNascimento: pessoa.dataNascimento || '',
        foto: pessoa.foto || ''
      });
      setPreviewFoto(pessoa.foto || '');
    } else {
      resetForm();
    }
    setDialogAberto(true);
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      // Validar tipo de arquivo
      if (!arquivo.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Validar tamanho (max 5MB)
      if (arquivo.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setFotoSelecionada(arquivo);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewFoto(e.target?.result as string);
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const salvarPessoa = async () => {
    if (!formData.nome || !formData.tipo || !formData.bilheteIdentidade) {
      toast.error('Nome, tipo e B.I são obrigatórios');
      return;
    }
    
    // Validar formato do B.I angolano (exemplo: 005485692LA042)
    const formatoBI = /^\d{9}[A-Z]{2}\d{3}$/;
    if (!formatoBI.test(formData.bilheteIdentidade)) {
      toast.error('Formato do B.I inválido. Use o formato: 000000000AA000');
      return;
    }

    setLoadingAcao('salvando');

    try {
      let urlFoto = formData.foto;
      
      // Se há uma nova foto selecionada, simular upload
      if (fotoSelecionada) {
        // Em produção, aqui seria feito o upload real para o servidor
        const nomeArquivo = `pessoa_${Date.now()}_${fotoSelecionada.name}`;
        urlFoto = `/fotos/${nomeArquivo}`;
        
        // Simular tempo de upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Foto carregada com sucesso');
      }

      const dadosPessoa = {
        ...formData,
        codinome: formData.codinome || undefined,
        foto: urlFoto
      };

      let response;

      if (pessoaEditando) {
        // Editar pessoa existente
        response = await api.put(`/pessoas/${pessoaEditando.id}`, dadosPessoa);
        if (response.data) {
          setPessoas(prev => prev.map(p => 
            p.id === pessoaEditando.id ? response.data.pessoa : p
          ));
          toast.success('Pessoa atualizada com sucesso');
        }
      } else {
        // Criar nova pessoa
        response = await api.post('/pessoas', dadosPessoa);
        if (response.data) {
          setPessoas(prev => [...prev, response.data.pessoa]);
          toast.success('Pessoa cadastrada com sucesso');
        }
      }

      if (response.error) {
        toast.error('Erro ao salvar pessoa: ' + response.error);
        return;
      }

      setDialogAberto(false);
      resetForm();

    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setLoadingAcao(null);
    }
  };

  const excluirPessoa = async (pessoa: Pessoa) => {
    if (!confirm(`Tem certeza que deseja excluir ${pessoa.nome}?`)) {
      return;
    }

    setLoadingAcao(`excluindo-${pessoa.id}`);

    try {
      const response = await api.del(`/pessoas/${pessoa.id}`);
      
      if (response.data || !response.error) {
        setPessoas(prev => prev.filter(p => p.id !== pessoa.id));
        toast.success('Pessoa excluída com sucesso');
      } else {
        toast.error('Erro ao excluir pessoa: ' + response.error);
      }
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setLoadingAcao(null);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'declarante': return 'bg-blue-100 text-blue-800';
      case 'vitima': return 'bg-red-100 text-red-800';
      case 'suspeito': return 'bg-orange-100 text-orange-800';
      case 'testemunha': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pessoas</h1>
          <p className="text-gray-600">Cadastro e gerenciamento de pessoas envolvidas em ocorrências</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={carregarPessoas} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Pessoa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {pessoaEditando ? 'Editar Pessoa' : 'Nova Pessoa'}
                </DialogTitle>
                <DialogDescription>
                  {pessoaEditando ? 'Edite os dados da pessoa selecionada' : 'Cadastre uma nova pessoa no sistema'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="codinome">Codinome</Label>
                  <Input
                    id="codinome"
                    value={formData.codinome}
                    onChange={(e) => handleInputChange('codinome', e.target.value)}
                    placeholder="Digite o codinome (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="declarante">Declarante</SelectItem>
                      <SelectItem value="vitima">Vítima</SelectItem>
                      <SelectItem value="suspeito">Suspeito</SelectItem>
                      <SelectItem value="testemunha">Testemunha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bilheteIdentidade">Bilhete de Identidade *</Label>
                  <Input
                    id="bilheteIdentidade"
                    value={formData.bilheteIdentidade}
                    onChange={(e) => handleInputChange('bilheteIdentidade', e.target.value.toUpperCase())}
                    placeholder="000000000AA000"
                    maxLength={14}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formato: 9 dígitos + 2 letras + 3 dígitos</p>
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Bairro, Rua, nº - Cidade"
                  />
                </div>

                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="+244 923 456 789"
                  />
                </div>

                {/* Campo de foto - especialmente importante para suspeitos */}
                {(formData.tipo === 'suspeito' || previewFoto || formData.foto) && (
                  <div>
                    <Label htmlFor="foto">
                      Fotografia {formData.tipo === 'suspeito' ? '(Recomendado)' : '(Opcional)'}
                    </Label>
                    <div className="space-y-3">
                      {previewFoto && (
                        <div className="flex justify-center">
                          <img 
                            src={previewFoto} 
                            alt="Preview" 
                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                        </div>
                      )}
                      <Input
                        id="foto"
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">
                        Formatos aceites: JPG, PNG, GIF. Tamanho máximo: 5MB
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogAberto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarPessoa} disabled={loadingAcao === 'salvando'}>
                    {loadingAcao === 'salvando' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      pessoaEditando ? 'Salvar' : 'Cadastrar'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pessoas Cadastradas ({pessoas.length})</CardTitle>
          <CardDescription>Lista de todas as pessoas registradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando pessoas...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Codinome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>B.I</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pessoas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell>
                      {pessoa.foto ? (
                        <img 
                          src={pessoa.foto} 
                          alt={pessoa.nome}
                          className="h-10 w-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {pessoa.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{pessoa.nome}</TableCell>
                    <TableCell>{pessoa.codinome || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(pessoa.tipo)}>
                        {pessoa.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{pessoa.bilheteIdentidade}</TableCell>
                    <TableCell>{pessoa.telefone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDialog(pessoa)}
                          disabled={!!loadingAcao}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => excluirPessoa(pessoa)}
                          disabled={!!loadingAcao}
                        >
                          {loadingAcao === `excluindo-${pessoa.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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