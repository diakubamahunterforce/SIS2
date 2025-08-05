import { 
  Pessoa, 
  Policial, 
  BoletimOcorrencia, 
  EstatisticasDiarias, 
  Distrito, 
  Bairro, 
  CorrelacaoCriminal, 
  AlertaDistrito 
} from '../types';

// Distritos de Luanda
export const distritosLuanda: Distrito[] = [
  {
    id: '1',
    nome: 'Ingombota',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8118, longitude: 13.2441 },
    populacao: 130000,
    esquadras: ['Esquadra Central', 'Esquadra da Marginal']
  },
  {
    id: '2', 
    nome: 'Maianga',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8200, longitude: 13.2300 },
    populacao: 195000,
    esquadras: ['Esquadra de Maianga', 'Esquadra do Kinaxixi']
  },
  {
    id: '3',
    nome: 'Rangel',
    municipio: 'Luanda', 
    coordenadas: { latitude: -8.8350, longitude: 13.2600 },
    populacao: 230000,
    esquadras: ['Esquadra do Rangel', 'Esquadra dos Coqueiros']
  },
  {
    id: '4',
    nome: 'Sambizanga',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8100, longitude: 13.2100 },
    populacao: 280000,
    esquadras: ['Esquadra de Sambizanga', 'Esquadra do Operário']
  },
  {
    id: '5',
    nome: 'Kilamba Kiaxi',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.9200, longitude: 13.1800 },
    populacao: 670000,
    esquadras: ['Esquadra de Kilamba', 'Esquadra do Golf']
  }
];

// Bairros principais
export const bairrosLuanda: Bairro[] = [
  { id: '1', nome: 'Baixa', distrito: 'Ingombota', coordenadas: { latitude: -8.8118, longitude: 13.2441 }, nivelCriminalidade: 'medio' },
  { id: '2', nome: 'Alvalade', distrito: 'Maianga', coordenadas: { latitude: -8.8200, longitude: 13.2300 }, nivelCriminalidade: 'baixo' },
  { id: '3', nome: 'Maculusso', distrito: 'Ingombota', coordenadas: { latitude: -8.8050, longitude: 13.2380 }, nivelCriminalidade: 'baixo' },
  { id: '4', nome: 'Kinaxixi', distrito: 'Maianga', coordenadas: { latitude: -8.8150, longitude: 13.2250 }, nivelCriminalidade: 'medio' },
  { id: '5', nome: 'Coqueiros', distrito: 'Rangel', coordenadas: { latitude: -8.8350, longitude: 13.2600 }, nivelCriminalidade: 'alto' },
  { id: '6', nome: 'Operário', distrito: 'Sambizanga', coordenadas: { latitude: -8.8100, longitude: 13.2100 }, nivelCriminalidade: 'alto' },
  { id: '7', nome: 'Kilamba', distrito: 'Kilamba Kiaxi', coordenadas: { latitude: -8.9200, longitude: 13.1800 }, nivelCriminalidade: 'medio' }
];

// Dados de agentes da Polícia Nacional de Angola com distritos
export const policiaisRegistrados: Policial[] = [
  { 
    id: '1', 
    nome: 'Comandante João Silva Muana', 
    posto: 'Comandante', 
    matricula: 'PN001234',
    distrito: 'Ingombota',
    esquadra: 'Esquadra Central'
  },
  { 
    id: '2', 
    nome: 'Subcomissário Maria Santos Capita', 
    posto: 'Subcomissário', 
    matricula: 'PN002345',
    distrito: 'Maianga',
    esquadra: 'Esquadra de Maianga'
  },
  { 
    id: '3', 
    nome: 'Aspirante Carlos Eduardo Miguel', 
    posto: 'Aspirante', 
    matricula: 'PN003456',
    distrito: 'Rangel',
    esquadra: 'Esquadra do Rangel'
  },
  { 
    id: '4', 
    nome: 'Agente Ana Paula Francisco', 
    posto: 'Agente', 
    matricula: 'PN004567',
    distrito: 'Sambizanga',
    esquadra: 'Esquadra de Sambizanga'
  },
  { 
    id: '5', 
    nome: 'Agente Principal António Sebastião', 
    posto: 'Agente Principal', 
    matricula: 'PN005678',
    distrito: 'Kilamba Kiaxi',
    esquadra: 'Esquadra de Kilamba'
  },
];

// Dados de pessoas no sistema policial com localização
export const pessoasCadastradas: Pessoa[] = [
  { 
    id: '1', 
    nome: 'Roberto Silva Muana', 
    tipo: 'declarante', 
    bilheteIdentidade: '005485692LA042', 
    telefone: '+244 923 456 789',
    endereco: 'Bairro Maianga, Rua da Missão, nº 45, Luanda',
    dataNascimento: '1985-03-15',
    distrito: 'Maianga',
    bairro: 'Alvalade',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8200, longitude: 13.2300 },
    status: 'ativo'
  },
  { 
    id: '2', 
    nome: 'Maria dos Santos Capita', 
    tipo: 'vitima', 
    bilheteIdentidade: '006789123LA043', 
    telefone: '+244 924 567 890',
    endereco: 'Bairro Rangel, Rua da Paz, nº 123, Luanda',
    dataNascimento: '1992-07-22',
    distrito: 'Rangel',
    bairro: 'Coqueiros',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8350, longitude: 13.2600 },
    status: 'ativo'
  },
  { 
    id: '3', 
    nome: 'José Manuel Sebastião', 
    codinome: 'Zé do Mercado', 
    tipo: 'suspeito', 
    bilheteIdentidade: '007123456LA044',
    telefone: '+244 925 678 901',
    endereco: 'Bairro Sambizanga, Rua dos Enganos, nº 78',
    dataNascimento: '1988-11-03',
    distrito: 'Sambizanga',
    bairro: 'Operário',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8100, longitude: 13.2100 },
    foto: '/fotos/suspeito_jose_manuel.jpg',
    status: 'procurado',
    nivelPericulosidade: 'alto',
    crimesRelacionados: ['1', '3']
  },
  { 
    id: '4', 
    nome: 'Pedro António Oliveira', 
    tipo: 'testemunha', 
    bilheteIdentidade: '008456789LA045', 
    telefone: '+244 926 789 012',
    endereco: 'Bairro Ingombota, Rua da República, nº 234, Luanda',
    dataNascimento: '1979-05-18',
    distrito: 'Ingombota',
    bairro: 'Baixa',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8118, longitude: 13.2441 },
    status: 'ativo'
  },
  {
    id: '5',
    nome: 'Carlos Alberto Kicombo',
    codinome: 'Kikas',
    tipo: 'suspeito',
    bilheteIdentidade: '009876543LA046',
    distrito: 'Kilamba Kiaxi',
    bairro: 'Kilamba',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.9200, longitude: 13.1800 },
    foto: '/fotos/suspeito_carlos_kicombo.jpg',
    status: 'procurado',
    nivelPericulosidade: 'medio',
    crimesRelacionados: ['2', '4']
  }
];

// Boletins de ocorrência registrados com dados geográficos
export const boletinsRegistrados: BoletimOcorrencia[] = [
  {
    id: '1',
    numeroBoletim: 'BO-LDA-2025-001',
    dataHoraOcorrencia: '2025-08-03T14:30:00',
    tipoOcorrencia: 'Roubo à Mão Armada',
    local: 'Avenida 4 de Fevereiro, nº 123 - Ingombota, Luanda',
    descricao: 'Vítima foi abordada por dois indivíduos armados que subtraíram sua carteira contendo documentos e 50.000 Kz em dinheiro. Os suspeitos fugiram em motocicleta vermelha.',
    declaranteId: '1',
    policialId: '1',
    envolvidos: [
      { pessoaId: '2', papel: 'vitima' },
      { pessoaId: '3', papel: 'suspeito' }
    ],
    status: 'registrado',
    criadoEm: '2025-08-03T15:00:00',
    atualizadoEm: '2025-08-03T15:00:00',
    distrito: 'Ingombota',
    bairro: 'Baixa',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8118, longitude: 13.2441 },
    correlacionado: true,
    crimesRelacionados: ['3']
  },
  {
    id: '2',
    numeroBoletim: 'BO-LDA-2025-002',
    dataHoraOcorrencia: '2025-08-03T10:15:00',
    tipoOcorrencia: 'Furto de Veículo',
    local: 'Rua da Missão, Bairro Maianga - Luanda',
    descricao: 'Proprietário de viatura Toyota Corolla, matrícula LD-45-67-AB, constatou o desaparecimento do veículo que estava estacionado em frente à residência.',
    declaranteId: '1',
    policialId: '2',
    envolvidos: [
      { pessoaId: '1', papel: 'vitima' },
      { pessoaId: '5', papel: 'suspeito' }
    ],
    status: 'em_andamento',
    criadoEm: '2025-08-03T11:00:00',
    atualizadoEm: '2025-08-03T11:30:00',
    distrito: 'Maianga',
    bairro: 'Alvalade',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8200, longitude: 13.2300 },
    correlacionado: false
  },
  {
    id: '3',
    numeroBoletim: 'BO-LDA-2025-003',
    dataHoraOcorrencia: '2025-08-02T19:45:00',
    tipoOcorrencia: 'Roubo à Mão Armada',
    local: 'Rua dos Operários, Bairro Sambizanga - Luanda',
    descricao: 'Dois indivíduos armados assaltaram uma loja, subtraindo dinheiro do caixa e telemóveis. Modus operandi similar a outros casos.',
    declaranteId: '4',
    policialId: '4',
    envolvidos: [
      { pessoaId: '3', papel: 'suspeito' }
    ],
    status: 'em_andamento',
    criadoEm: '2025-08-02T20:00:00',
    atualizadoEm: '2025-08-03T09:00:00',
    distrito: 'Sambizanga',
    bairro: 'Operário',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.8100, longitude: 13.2100 },
    correlacionado: true,
    crimesRelacionados: ['1']
  },
  {
    id: '4',
    numeroBoletim: 'BO-LDA-2025-004',
    dataHoraOcorrencia: '2025-08-01T16:20:00',
    tipoOcorrencia: 'Furto Simples',
    local: 'Shopping Kilamba, Kilamba Kiaxi - Luanda',
    descricao: 'Furto de bolsa em centro comercial. Suspeito identificado pelas câmaras de segurança.',
    declaranteId: '2',
    policialId: '5',
    envolvidos: [
      { pessoaId: '5', papel: 'suspeito' }
    ],
    status: 'resolvido',
    criadoEm: '2025-08-01T17:00:00',
    atualizadoEm: '2025-08-02T10:00:00',
    distrito: 'Kilamba Kiaxi',
    bairro: 'Kilamba',
    municipio: 'Luanda',
    coordenadas: { latitude: -8.9200, longitude: 13.1800 },
    correlacionado: true,
    crimesRelacionados: ['2']
  }
];

// Correlações criminais identificadas
export const correlacoesCriminais: CorrelacaoCriminal[] = [
  {
    id: '1',
    suspeitos: ['3'],
    boletins: ['1', '3'],
    padraoIdentificado: 'Roubos à mão armada com motocicleta, sempre em dupla, horário comercial',
    confianca: 95,
    criadoEm: '2025-08-03T16:00:00',
    status: 'ativo'
  },
  {
    id: '2',
    suspeitos: ['5'],
    boletins: ['2', '4'],
    padraoIdentificado: 'Furtos em locais movimentados, aproveitando multidões',
    confianca: 87,
    criadoEm: '2025-08-02T11:00:00',
    status: 'ativo'
  }
];

// Alertas ativos entre distritos
export const alertasDistrito: AlertaDistrito[] = [
  {
    id: '1',
    tipo: 'suspeito_procurado',
    titulo: 'Suspeito Procurado - José Manuel Sebastião',
    descricao: 'Suspeito de múltiplos roubos à mão armada. Considerado perigoso. Última localização: Sambizanga',
    distrito: 'Sambizanga',
    urgencia: 'alta',
    criadoEm: '2025-08-03T16:30:00',
    status: 'ativo',
    dadosRelacionados: { pessoaId: '3', boletins: ['1', '3'] }
  },
  {
    id: '2',
    tipo: 'padrao_detectado',
    titulo: 'Padrão Criminal Detectado',
    descricao: 'Sistema identificou padrão de roubos similares em Ingombota e Sambizanga',
    distrito: 'Ingombota',
    urgencia: 'media',
    criadoEm: '2025-08-03T15:45:00',
    status: 'ativo',
    dadosRelacionados: { correlacaoId: '1' }
  }
];

// Estatísticas das esquadras de Luanda por distrito
export const estatisticasEsquadra: EstatisticasDiarias[] = [
  // Ingombota
  { data: '2025-08-03', roubo: 2, agressao: 0, furto: 1, outros: 0, total: 3, distrito: 'Ingombota' },
  { data: '2025-08-02', roubo: 1, agressao: 1, furto: 0, outros: 1, total: 3, distrito: 'Ingombota' },
  // Maianga  
  { data: '2025-08-03', roubo: 0, agressao: 0, furto: 1, outros: 0, total: 1, distrito: 'Maianga' },
  { data: '2025-08-02', roubo: 1, agressao: 0, furto: 1, outros: 0, total: 2, distrito: 'Maianga' },
  // Sambizanga
  { data: '2025-08-03', roubo: 1, agressao: 1, furto: 0, outros: 1, total: 3, distrito: 'Sambizanga' },
  { data: '2025-08-02', roubo: 2, agressao: 0, furto: 1, outros: 0, total: 3, distrito: 'Sambizanga' },
  // Kilamba Kiaxi
  { data: '2025-08-03', roubo: 0, agressao: 0, furto: 0, outros: 0, total: 0, distrito: 'Kilamba Kiaxi' },
  { data: '2025-08-02', roubo: 0, agressao: 0, furto: 1, outros: 0, total: 1, distrito: 'Kilamba Kiaxi' },
];

// Tipos de ocorrência comum em Angola
export const tiposOcorrencia = [
  'Roubo à Mão Armada',
  'Roubo por Esticão',
  'Furto de Veículo',
  'Furto Simples',
  'Agressão Física',
  'Violência Doméstica',
  'Homicídio',
  'Tentativa de Homicídio',
  'Lesão Corporal',
  'Ameaça',
  'Tráfico de Drogas',
  'Vandalismo',
  'Burla',
  'Sequestro',
  'Perturbação da Ordem Pública',
  'Outros'
];

// Postos/Patentes da Polícia Nacional de Angola
export const postosPolicia = [
  'Agente',
  'Agente Principal',
  'Aspirante',
  'Subcomissário',
  'Comissário',
  'Comandante',
  'Subintendente',
  'Intendente',
  'Superintendente'
];

// Nomes alternativos para compatibilidade
export const mockPoliciais = policiaisRegistrados;
export const mockPessoas = pessoasCadastradas;
export const mockBoletins = boletinsRegistrados;
export const mockEstatisticas = estatisticasEsquadra;