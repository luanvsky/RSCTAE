import { ComprovanteItem, MemorialDescritivo } from '../types';

export const LIMIAR_ALTA_PONTUACAO = 7.5;

export interface ResultadoChecagemMemorial {
  isAltaPontuacao: boolean;
  isDetalhadoNoMemorial: boolean;
  isCriticoSemMemorial: boolean;
  motivoAlerta?: string;
  trechoSugeridoMemorial: string;
  justificativaSugerida: string;
  termosDetectados: string[];
}

/**
 * Normaliza strings removendo acentos e convertendo para minúsculas
 */
function normalizarTexto(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Extrai palavras e expressões relevantes de um comprovante para busca no memorial
 */
function extrairTermosChave(comprovante: ComprovanteItem): string[] {
  const termos: string[] = [];
  const desc = comprovante.descricaoAtividade || '';
  const doc = comprovante.documentoCorrespondente || '';
  const itemNorma = comprovante.itemCriterio || '';

  // Termos compostos importantes
  const padroes = [
    /comiss[aã]o (?:especial |permanente )?de [a-z0-9\s]+/i,
    /fiscal(?:iza[cç][aã]o)? (?:de )?contrato/i,
    /contrato (?:n[ºo°]?\s*)?[0-9]+/i,
    /portaria (?:n[ºo°]?\s*)?[0-9]+/i,
    /fun[cç][aã]o gratificada|fg[-_\s]?[0-9]+/i,
    /cargo de dire[cç][aã]o|cd[-_\s]?[0-9]+/i,
    /coordena[cç][aã]o de [a-z0-9\s]+/i,
    /patente|software|inpi/i,
    /siafi|scdp|siasg/i,
    /manual|roteiro t[eé]cnico/i,
    /projeto de [a-z0-9\s]+/i,
  ];

  const combined = `${desc} ${doc} ${itemNorma}`;
  padroes.forEach((regex) => {
    const match = combined.match(regex);
    if (match) {
      termos.push(match[0].trim());
    }
  });

  // Termos isolados significativos (> 4 letras e não stopwords)
  const stopwords = new Set([
    'para', 'com', 'pelo', 'pela', 'pelos', 'pelas', 'como', 'sobre', 'entre',
    'desde', 'apos', 'durante', 'conforme', 'termo', 'anexo', 'item', 'pontos',
    'horas', 'servico', 'instituto', 'federal', 'sergipe', 'campus', 'resolucao'
  ]);

  const palavras = normalizarTexto(desc)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 5 && !stopwords.has(w));

  palavras.forEach((w) => {
    if (!termos.some((t) => normalizarTexto(t).includes(w))) {
      termos.push(w);
    }
  });

  return Array.from(new Set(termos));
}

/**
 * Avalia se um item de comprovante de alta pontuação está detalhado no memorial
 * ou se possui a justificativa obrigatória de submissão preenchida.
 */
export function avaliarComprovanteContraMemorial(
  comprovante: ComprovanteItem,
  memorial?: MemorialDescritivo
): ResultadoChecagemMemorial {
  const pontos = Number(comprovante.pontuacaoAtribuida) || 0;
  const isAltaPontuacao = pontos >= LIMIAR_ALTA_PONTUACAO;

  // Texto consolidado do memorial
  const textoMemorial = memorial
    ? `${memorial.apresentacaoTrajetoria || ''} ${memorial.desenvolvimentoSaberes || ''} ${memorial.impactoInstitucional || ''} ${memorial.conclusao || ''}`
    : '';
  const memorialNorm = normalizarTexto(textoMemorial);

  const termos = extrairTermosChave(comprovante);
  const termosEncontrados: string[] = [];

  if (memorialNorm.length > 30) {
    termos.forEach((termo) => {
      const termoNorm = normalizarTexto(termo);
      if (termoNorm.length >= 4 && memorialNorm.includes(termoNorm)) {
        termosEncontrados.push(termo);
      }
    });
  }

  // Verifica se o usuário preencheu a justificativa obrigatória específica no comprovante
  const temJustificativaPropria =
    !!comprovante.justificativaMemorial && comprovante.justificativaMemorial.trim().length >= 20;

  // Está detalhado se há termos encontrados substanciais no memorial OU justificativa própria preenchida
  const citadoNoMemorialTexto = termosEncontrados.length > 0;
  const isDetalhadoNoMemorial = citadoNoMemorialTexto || temJustificativaPropria;

  // É crítico se for de alta pontuação e NÃO possuir detalhamento nem justificativa
  const isCriticoSemMemorial = isAltaPontuacao && !isDetalhadoNoMemorial;

  let motivoAlerta: string | undefined = undefined;
  if (isCriticoSemMemorial) {
    motivoAlerta = `Item de alta pontuação (${pontos.toFixed(1).replace('.', ',')} pts) sem detalhamento circunstanciado no Memorial Descritivo nem justificativa obrigatória de submissão preenchida.`;
  }

  // Gera modelo de trecho para inserção no Memorial Descritivo
  const desc = comprovante.descricaoAtividade || 'Atividade relevante';
  const doc = comprovante.documentoCorrespondente || 'documentação comprobatória';
  const eixo = comprovante.eixo || 'Atividades Institucionais';
  
  const trechoSugeridoMemorial = `No âmbito do ${eixo}, destaco minha atuação em: ${desc}. Essa experiência técnica e institucional encontra-se formalmente registrada e atestada mediante ${doc}, tendo proporcionado aprimoramento contínuo dos processos de trabalho, conformidade legal e relevante impacto público para a instituição.`;

  // Gera modelo de justificativa técnica com IA / assistência
  const justificativaSugerida = `Atividade de alta complexidade e relevância técnica (${desc}), comprovada mediante ${doc}. Contribui decisivamente para a mobilização de saberes e impacto institucional nos termos do ${comprovante.itemCriterio || 'Decreto nº 13.048/2026'}.`;

  return {
    isAltaPontuacao,
    isDetalhadoNoMemorial,
    isCriticoSemMemorial,
    motivoAlerta,
    trechoSugeridoMemorial,
    justificativaSugerida,
    termosDetectados: termosEncontrados,
  };
}

/**
 * Audita a lista completa de comprovantes e retorna os itens críticos
 */
export function auditarComprovantesAltaPontuacao(
  comprovantes: ComprovanteItem[],
  memorial?: MemorialDescritivo
) {
  const avaliacoes = comprovantes.map((comp) => ({
    comprovante: comp,
    resultado: avaliarComprovanteContraMemorial(comp, memorial),
  }));

  const itensAltaPontuacao = avaliacoes.filter((a) => a.resultado.isAltaPontuacao);
  const itensCriticos = avaliacoes.filter((a) => a.resultado.isCriticoSemMemorial);
  const itensConformes = avaliacoes.filter((a) => a.resultado.isAltaPontuacao && a.resultado.isDetalhadoNoMemorial);

  return {
    totalComprovantes: comprovantes.length,
    totalAltaPontuacao: itensAltaPontuacao.length,
    totalCriticos: itensCriticos.length,
    totalConformes: itensConformes.length,
    avaliacoes,
    itensCriticos,
    itensConformes,
    temPendenciasCriticas: itensCriticos.length > 0,
  };
}
