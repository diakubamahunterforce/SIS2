import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Shield, AlertCircle, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CadastroPolicial } from './CadastroPolicial';

export const LoginForm: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!matricula || !senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const success = await login(matricula, senha);
    
    if (!success) {
      setError('Matrícula ou senha inválidos. Verifique as credenciais ou contacte o administrador.');
    }
    
    setLoading(false);
  };

  const credenciaisDisponiveis = [
    { matricula: 'PN001234', nome: 'Comandante João Silva Muana', posto: 'Comandante' },
    { matricula: 'PN002345', nome: 'Subcomissário Maria Santos Capita', posto: 'Subcomissário' },
    { matricula: 'PN003456', nome: 'Aspirante Carlos Eduardo Miguel', posto: 'Aspirante' },
    { matricula: 'PN004567', nome: 'Agente Ana Paula Francisco', posto: 'Agente' },
    { matricula: 'PN005678', nome: 'Agente Principal António Sebastião', posto: 'Agente Principal' },
  ];

  const preencherCredenciais = (mat: string) => {
    setMatricula(mat);
    setSenha('pn2024');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Sistema B.O. Digital</CardTitle>
          <CardDescription>
            Polícia Nacional de Angola - Acesso Restrito
          </CardDescription>
          <div className="mt-2 text-xs text-gray-500">
            República de Angola - Ministério do Interior
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula do Agente</Label>
              <Input
                id="matricula"
                type="text"
                placeholder="PN000000"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                disabled={loading}
                maxLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Palavra-passe</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a sua palavra-passe"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'A entrar...' : 'Entrar no Sistema'}
            </Button>
          </form>

          {/* Credenciais disponíveis para teste */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Credenciais de Acesso</p>
              <p className="text-xs text-gray-500">Clique numa credencial para preencher automaticamente</p>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {credenciaisDisponiveis.map((cred, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => preencherCredenciais(cred.matricula)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{cred.nome}</div>
                      <div className="text-xs text-gray-600">{cred.posto}</div>
                    </div>
                    <div className="text-xs font-mono text-blue-600">{cred.matricula}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Senha: pn2024</div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão para cadastro */}
          <div className="mt-6 text-center space-y-3">
            <Dialog open={showCadastro} onOpenChange={setShowCadastro}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar Novo Policial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastro de Novo Policial</DialogTitle>
                  <DialogDescription>
                    Registre um novo agente no sistema B.O. Digital
                  </DialogDescription>
                </DialogHeader>
                <CadastroPolicial onSuccess={() => setShowCadastro(false)} />
              </DialogContent>
            </Dialog>
            
            <p className="text-xs text-gray-500">
              Sistema protegido por autenticação. <br />
              Uso exclusivo da Polícia Nacional de Angola
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};