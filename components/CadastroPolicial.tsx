import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { postosPolicia } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface CadastroPolicialProps {
  onSuccess: () => void;
}

export const CadastroPolicial: React.FC<CadastroPolicialProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    posto: '',
    matricula: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { adicionarPolicial } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Limpar erro ao digitar
  };

  const gerarMatricula = () => {
    // Gerar matrícula automática no formato PN + 6 dígitos
    const numero = Math.floor(100000 + Math.random() * 900000);
    const novaMatricula = `PN${numero}`;
    setFormData(prev => ({ ...prev, matricula: novaMatricula }));
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setError('Nome completo é obrigatório');
      return false;
    }

    if (!formData.posto) {
      setError('Posto/Patente é obrigatório');
      return false;
    }

    if (!formData.matricula.trim()) {
      setError('Matrícula é obrigatória');
      return false;
    }

    if (!formData.matricula.match(/^PN\d{6}$/)) {
      setError('Matrícula deve ter o formato PN000000');
      return false;
    }

    if (!formData.senha.trim()) {
      setError('Palavra-passe é obrigatória');
      return false;
    }

    if (formData.senha.length < 4) {
      setError('Palavra-passe deve ter pelo menos 4 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As palavras-passe não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar novo policial
      const novoPolicial = {
        id: Date.now().toString(),
        nome: formData.nome,
        posto: formData.posto,
        matricula: formData.matricula,
        senha: formData.senha
      };

      // Adicionar ao sistema
      adicionarPolicial(novoPolicial);
      
      toast.success(`Policial ${formData.nome} cadastrado com sucesso! Matrícula: ${formData.matricula}`);
      
      // Limpar formulário
      setFormData({
        nome: '',
        posto: '',
        matricula: '',
        senha: '',
        confirmarSenha: ''
      });
      
      onSuccess();
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError('Erro interno do sistema. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          placeholder="Ex: João Silva Muana"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="posto">Posto/Patente *</Label>
        <Select 
          value={formData.posto} 
          onValueChange={(value) => handleInputChange('posto', value)}
          disabled={loading}
        >
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

      <div className="space-y-2">
        <Label htmlFor="matricula">Matrícula *</Label>
        <div className="flex gap-2">
          <Input
            id="matricula"
            value={formData.matricula}
            onChange={(e) => handleInputChange('matricula', e.target.value.toUpperCase())}
            placeholder="PN000000"
            maxLength={8}
            disabled={loading}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={gerarMatricula}
            disabled={loading}
          >
            Gerar
          </Button>
        </div>
        <p className="text-xs text-gray-500">Formato: PN + 6 dígitos</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Palavra-passe *</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => handleInputChange('senha', e.target.value)}
          placeholder="Mínimo 4 caracteres"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Palavra-passe *</Label>
        <Input
          id="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
          placeholder="Digite novamente a palavra-passe"
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Informação</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Após o cadastro, o policial poderá fazer login imediatamente com a matrícula e palavra-passe definidas.
        </p>
      </div>
    </form>
  );
};