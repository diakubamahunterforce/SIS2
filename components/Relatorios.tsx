import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileDown, Calendar, BarChart3, PieChart } from 'lucide-react';
import { mockEstatisticas } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Relatorios: React.FC = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('7');
  
  const getDadosPeriodo = (dias: number) => {
    return mockEstatisticas.slice(-dias);
  };

  const dadosGrafico = getDadosPeriodo(parseInt(periodoSelecionado));
  
  const dadosPizza = [
    { name: 'Roubo', value: dadosGrafico.reduce((acc, d) => acc + d.roubo, 0) },
    { name: 'Furto', value: dadosGrafico.reduce((acc, d) => acc + d.furto, 0) },
    { name: 'Agressão', value: dadosGrafico.reduce((acc, d) => acc + d.agressao, 0) },
    { name: 'Outros', value: dadosGrafico.reduce((acc, d) => acc + d.outros, 0) },
  ].filter(item => item.value > 0);

  const totalOcorrencias = dadosGrafico.reduce((acc, d) => acc + d.total, 0);
  const mediaOcorrencias = Math.round(totalOcorrencias / dadosGrafico.length);

  const exportarDados = (formato: 'pdf' | 'excel') => {
    // Simular exportação
    console.log(`Exportando dados em formato ${formato}:`, dadosGrafico);
    alert(`Dados exportados em formato ${formato.toUpperCase()}! (simulação)`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Estatísticas</h1>
          <p className="text-gray-600">Análise de dados das ocorrências registradas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportarDados('pdf')}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => exportarDados('excel')}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Controles de Filtro */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
          <CardDescription>Selecione o período para análise dos dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Período:</span>
            </div>
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOcorrencias}</div>
            <p className="text-xs text-muted-foreground">
              Nos últimos {periodoSelecionado} dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaOcorrencias}</div>
            <p className="text-xs text-muted-foreground">
              Ocorrências por dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipo Mais Comum</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosPizza.length > 0 ? dadosPizza.reduce((a, b) => a.value > b.value ? a : b).name : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ocorrência predominante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dia com Mais Ocorrências</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosGrafico.length > 0 ? dadosGrafico.reduce((a, b) => a.total > b.total ? a : b).total : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pico de ocorrências
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Barras - Tendência */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Ocorrências</CardTitle>
            <CardDescription>Evolução diária das ocorrências</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>Proporção de cada tipo de ocorrência</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras Detalhado */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhamento por Tipo e Data</CardTitle>
          <CardDescription>Análise detalhada das ocorrências por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              />
              <Bar dataKey="roubo" stackId="a" fill="#ef4444" name="Roubo" />
              <Bar dataKey="furto" stackId="a" fill="#f97316" name="Furto" />
              <Bar dataKey="agressao" stackId="a" fill="#eab308" name="Agressão" />
              <Bar dataKey="outros" stackId="a" fill="#6b7280" name="Outros" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Ranking Diário */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Diário de Ocorrências</CardTitle>
          <CardDescription>Dados tabulares para análise detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Roubo</TableHead>
                <TableHead className="text-center">Furto</TableHead>
                <TableHead className="text-center">Agressão</TableHead>
                <TableHead className="text-center">Outros</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosGrafico.slice().reverse().map((dia) => (
                <TableRow key={dia.data}>
                  <TableCell className="font-medium">
                    {new Date(dia.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">{dia.roubo}</TableCell>
                  <TableCell className="text-center">{dia.furto}</TableCell>
                  <TableCell className="text-center">{dia.agressao}</TableCell>
                  <TableCell className="text-center">{dia.outros}</TableCell>
                  <TableCell className="text-center font-semibold">{dia.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};