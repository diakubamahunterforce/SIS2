export interface Pessoa {
  id: string;
  nome: string;
  codinome?: string;
  tipo: 'declarante' | 'vitima' | 'suspeito' | 'testemunha';
  bilheteIdentidade: string;
  telefone?: string;
  foto?: string;
  endereco?: string;
  dataNascimento?: string;
  // Novos campos para correlação
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  distrito?: string;
  bairro?: string;
  municipio?: string;
  status?: 'ativo' | 'procurado' | 'detido';
  nivelPericulosidade?: 'baixo' | 'medio' | 'alto';
  crimesRelacionados?: string[]; // IDs de boletins relacionados
}

export interface Policial {
  id: string;
  nome: string;
  posto: string;
  matricula: string;
  distrito?: string;
  esquadra?: string;
}

export interface BoletimOcorrencia {
  id: string;
  numeroBoletim: string;
  dataHoraOcorrencia: string;
  tipoOcorrencia: string;
  local: string;
  descricao: string;
  declaranteId: string;
  policialId: string;
  envolvidos: { pessoaId: string; papel: string }[];
  status: 'registrado' | 'em_andamento' | 'resolvido' | 'arquivado';
  criadoEm: string;
  atualizadoEm: string;
  // Novos campos geográficos
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  distrito: string;
  bairro: string;
  municipio: string;
  evidencias?: string[]; // URLs de fotos/vídeos
  correlacionado?: boolean; // Se está correlacionado com outros crimes
  crimesRelacionados?: string[]; // IDs de outros boletins relacionados
}

export interface EstatisticasDiarias {
  data: string;
  roubo: number;
  agressao: number;
  furto: number;
  outros: number;
  total: number;
  distrito?: string;
}

// Novos tipos para funcionalidades avançadas
export interface Distrito {
  id: string;
  nome: string;
  municipio: string;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  populacao: number;
  esquadras: string[];
}

export interface Bairro {
  id: string;
  nome: string;
  distrito: string;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  nivelCriminalidade: 'baixo' | 'medio' | 'alto';
}

export interface CorrelacaoCriminal {
  id: string;
  suspeitos: string[]; // IDs de pessoas
  boletins: string[]; // IDs de boletins relacionados
  padraoIdentificado: string;
  confianca: number; // 0-100%
  criadoEm: string;
  status: 'ativo' | 'resolvido';
}

export interface ReconhecimentoFacial {
  id: string;
  imagemOriginal: string;
  imagensComparadas: string[];
  matches: {
    pessoaId: string;
    confianca: number;
    foto: string;
  }[];
  resultado: 'match_encontrado' | 'nenhum_match' | 'multiplos_matches';
  processadoEm: string;
}

export interface AlertaDistrito {
  id: string;
  tipo: 'suspeito_procurado' | 'crime_grave' | 'padrao_detectado';
  titulo: string;
  descricao: string;
  distrito: string;
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  criadoEm: string;
  status: 'ativo' | 'resolvido';
  dadosRelacionados?: any;
}