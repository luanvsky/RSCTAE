export type NivelRSC = 'RSC-I' | 'RSC-II' | 'RSC-III' | 'RSC-IV' | 'RSC-V' | 'RSC-VI';

export type EixoRequisito =
  | 'I - Comissões e Grupos de Trabalho'
  | 'II - Projetos, Pesquisa e Extensão'
  | 'III - Premiações e Reconhecimento'
  | 'IV - Responsabilidades e Contratos'
  | 'V - Cargos e Funções de Direção/Chefia'
  | 'VI - Produção Científica e Tecnológica';

export interface ServidorInfo {
  nome: string;
  matriculaSiape: string;
  cargo: string;
  nivelCargo: string; // Ex: Classe D ou Classe E
  campus: string;
  lotacao: string;
  email: string;
  telefone?: string;
  tempoServicoPublico?: string;
  titulacaoAtual?: string;
  dataIngressoIFE?: string;
  funcaoOuEncargoAtual?: string;
  nivelRscSolicitado: NivelRSC;
  equivalenciaTitulacao?: string; // Ex: RSC-V = Especialização (52%), RSC-VI = Mestrado (75%)
  saldoConcessaoAnterior?: number;
  processoConcessaoAnterior?: string;
  tramitacaoPrioritaria?: boolean;
}

export interface ComprovanteItem {
  id: string;
  itemCriterio: string; // Ex: Anexo I, Item 3 ou Anexo IV, Item 3
  eixo: EixoRequisito;
  itemNumero?: number;
  descricaoAtividade: string;
  documentoCorrespondente: string;
  unidadeMedida?: string; // Ex: Por designação, Por ano, Por projeto, Por produto
  pontosPorUnidade?: number;
  quantidadeInformada?: number;
  periodoHoras?: string;
  pontuacaoAtribuida: number;
  pontuacaoMaximaPermitida?: number;
  statusValidacao: 'Validade Confirmada' | 'Pendente de Conferência' | 'Em Conformidade' | 'Indeferido / Não Cabível' | 'Cabível com Ressalva';
  veredito?: 'CABIVEL' | 'NAO_CABIVEL' | 'CABIVEL_PARCIAL';
  justificativaLegal?: string;
  artigoDecreto?: string;
  observacao?: string;
  incluidoNoDossie?: boolean;
}

export interface DocumentoAvaliado {
  id: string;
  nomeArquivo: string;
  tipoDocumento: string;
  veredito: 'CABIVEL' | 'NAO_CABIVEL' | 'CABIVEL_PARCIAL';
  eixoSugerido: EixoRequisito;
  artigoDecreto: string;
  descricaoIdentificada: string;
  cargaHorariaOuPeriodo: string;
  pontosCalculados: number;
  pontosMaximosCriterio: number;
  justificativa: string;
  orientacaoAoServidor?: string;
  incluirNoProcesso: boolean;
}

export interface MemorialDescritivo {
  apresentacaoTrajetoria: string;
  desenvolvimentoSaberes: string;
  impactoInstitucional: string;
  conclusao?: string;
}

export interface DeclaracoesConformidade {
  declaracaoVeracidade: string;
  declaracaoConformidade: string;
  declaracaoNaoAcumulo?: string;
  declaracaoCienciaRegulamento?: string;
}

export interface ProcessoRSC {
  id: string;
  tituloDossie: string;
  dataCriacao: string;
  numeroProcessoSei?: string;
  servidor: ServidorInfo;
  declaracoes: DeclaracoesConformidade;
  memorial: MemorialDescritivo;
  indexacaoComprovantes: ComprovanteItem[];
  resumoPontuacao: {
    totalPontos: number;
    minimoExigido: number;
    minimoCriteriosExigidos?: number;
    criteriosUtilizados?: number;
    bancoPontosExcedente?: number;
    aptoParaConcessao: boolean;
    porEixo: {
      eixoI: number;
      eixoII: number;
      eixoIII: number;
      eixoIV: number;
      eixoV: number;
      eixoVI: number;
    };
  };
  parecerPreliminarIA?: string;
}

export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
  contentBase64?: string;
  textContent?: string;
  status: 'enviado' | 'processando' | 'processado' | 'erro';
}
