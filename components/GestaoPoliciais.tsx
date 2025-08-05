import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { policiaisRegistrados, postosPolicia } from '../data/mockData';
import { Policial } from '../types';
import { toast } from "sonner"; // ✅ CERTO


export const GestaoPoliciais: React.FC = () => {
  const [policiais, setPoliciais] = useState<Policial[]>(policiaisRegistrados);
  const [policialEditando, setPolicialEditando] = useState<Policial | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    posto: '',
    matricula: ''
  });

  const handleInputChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      posto: '',
      matricula: ''
    });
    setPolicialEditando(null);
  };

  const abrirDialog = (policial?: Policial) => {
    if (policial) {
      setPolicialEditando(policial);
      setFormData({
        nome: policial.nome,
        posto: policial.posto,
        matricula: policial.matricula
      });
    } else {
      resetForm();
    }
    setDialogAberto(true);
  };

  const salvarPolicial = () => {
    if (!formData.nome || !formData.posto || !formData.matricula) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    // Verificar se a matrícula já existe (apenas para novos cadastros)
    if (!policialEditando && policiais.some(p => p.matricula === formData.matricula)) {
      toast.error('Matrícula já existe no sistema');
      return;
    }

    if (policialEditando) {
      // Editar policial existente
      setPoliciais(prev => prev.map(p => 
        p.id === policialEditando.id 
          ? { ...p, ...formData }
          : p
      ));
      toast.success('Policial atualizado com sucesso');
    } else {
      // Criar novo policial
      const novoPolicial: Policial = {
        id: String(policiais.length + 1),
        ...formData
      };
      setPoliciais(prev => [...prev, novoPolicial]);
      toast.success('Policial cadastrado com sucesso');
    }

    setDialogAberto(false);
    resetForm();
  };

  const excluirPolicial = (id: string) => {
    setPoliciais(prev => prev.filter(p => p.id !== id));
    toast.success('Policial excluído com sucesso');
  };

  const getPostoColor = (posto: string) => {
    const hierarchy = ['Agente', 'Agente Principal', 'Aspirante', 'Subcomissário', 'Comissário', 'Comandante', 'Subintendente', 'Intendente', 'Superintendente'];
    const index = hierarchy.indexOf(posto);
    
    if (index <= 1) return 'bg-blue-100 text-blue-800';        // Agentes
    if (index <= 3) return 'bg-green-100 text-green-800';      // Aspirante e Subcomissário  
    if (index <= 5) return 'bg-yellow-100 text-yellow-800';    // Comissário e Comandante
    return 'bg-purple-100 text-purple-800';                    // Altos comandos
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Policiais</h1>
          <p className="text-gray-600">Cadastro e gerenciamento de agentes policiais</p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Policial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {policialEditando ? 'Editar Policial' : 'Novo Policial'}
              </DialogTitle>
              <DialogDescription>
                {policialEditando ? 'Edite os dados do policial selecionado' : 'Cadastre um novo policial no sistema'}
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
                <Label htmlFor="posto">Posto/Patente *</Label>
                <Select value={formData.posto} onValueChange={(value) => handleInputChange('posto', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o posto" />
                  </SelectTrigger>
                  <SelectContent>
                    {postosPolicia.map((posto) => (
                      <SelectItem key={posto} value={posto}>{posto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => handleInputChange('matricula', e.target.value)}
                  placeholder="Digite a matrícula"
                  disabled={!!policialEditando} // Não permite editar matrícula
                />
                {policialEditando && (
                  <p className="text-xs text-gray-500 mt-1">A matrícula não pode ser alterada</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarPolicial}>
                  {policialEditando ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Policiais</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policiais.length}</div>
            <p className="text-xs text-muted-foreground">
              Agentes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comandos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policiais.filter(p => ['Comandante', 'Subintendente', 'Intendente', 'Superintendente'].includes(p.posto)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Postos de comando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policiais.filter(p => ['Agente', 'Agente Principal', 'Aspirante', 'Subcomissário', 'Comissário'].includes(p.posto)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Postos operacionais
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policiais Cadastrados ({policiais.length})</CardTitle>
          <CardDescription>Lista de todos os agentes registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Posto/Patente</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policiais.map((policial) => (
                <TableRow key={policial.id}>
                  <TableCell className="font-medium">{policial.nome}</TableCell>
                  <TableCell>
                    <Badge className={getPostoColor(policial.posto)}>
                      {policial.posto}
                    </Badge>
                  </TableCell>
                  <TableCell>{policial.matricula}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirDialog(policial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => excluirPolicial(policial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};