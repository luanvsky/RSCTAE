import { ProcessoRSC } from '../types';

export function generateSeiFormattedText(processo: ProcessoRSC): string {
  const { servidor, declaracoes, memorial, indexacaoComprovantes, resumoPontuacao } = processo;
  const { totalPontos, minimoExigido, porEixo, bancoPontosExcedente = 0 } = resumoPontuacao;

  const totalFormatado = Number(totalPontos).toFixed(1).replace('.', ',');
  const saldoExcedente = Math.max(0, totalPontos - minimoExigido).toFixed(1).replace('.', ',');

  return `================================================================================
INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS
SISTEMA ELETRÔNICO DE INFORMAÇÕES - SEI/IFS
PROCESSO ADMINISTRATIVO: ${processo.numeroProcessoSei || '23060.002409/2026-07'}
REQUERIMENTO DE RECONHECIMENTO DE SABERES E COMPETÊNCIAS - RSC-PCCTAE
BASE LEGAL: RESOLUÇÃO CS/IFS Nº 394/2026 E DECRETO Nº 13.048/2026
================================================================================

--------------------------------------------------------------------------------
BLOCO 1: REQUERIMENTO PADRÃO DE RSC-PCCTAE (FORMULÁRIO OFICIAL)
--------------------------------------------------------------------------------
1. IDENTIFICAÇÃO DO(A) SERVIDOR(A):
- Nome Completo: ${servidor.nome}
- Matrícula SIAPE: ${servidor.matriculaSiape}
- Cargo Efetivo: ${servidor.cargo} (Nível/Classe: ${servidor.nivelCargo})
- Data de Ingresso em IFE: ${servidor.dataIngressoIFE || '28/02/2018'}
- Lotação / Setor: ${servidor.lotacao}
- Campus / Unidade: ${servidor.campus}
- Função / Encargo Atual: ${servidor.funcaoOuEncargoAtual || 'Não informado'}
- E-mail Institucional: ${servidor.email}
- Telefone / Contato: ${servidor.telefone || 'Não informado'}
- Tramitação Prioritária (Art. 69-A Lei 9.784/1999): ${servidor.tramitacaoPrioritaria ? 'Sim' : 'Não'}

2. NÍVEL DE RSC SOLICITADO E EQUIVALÊNCIA:
- Nível Pleiteado: ${servidor.nivelRscSolicitado}
- Enquadramento / Efeitos: ${servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'}
- Requisito de Pontuação Mínima: ${minimoExigido} pontos
- Pontuação Total Apurada no Dossiê: ${totalFormatado} pontos
- Saldo Excedente Cumulativo (Banco de Pontos - Art. 7º, § 1º): ${saldoExcedente} pontos

3. SOLICITAÇÃO FORMAL:
Requeiro à Comissão para Reconhecimento de Saberes e Competências aos Servidores do PCCTAE (CRSC-PCCTAE/IFS) a concessão do ${servidor.nivelRscSolicitado}, nos termos do Decreto nº 13.048/2026 e da Resolução CS/IFS nº 394/2026, instruindo o presente processo com as declarações de conformidade, memorial descritivo circunstanciado e pasta comprobatória devidamente indexada.


--------------------------------------------------------------------------------
BLOCO 2: TERMO DE DECLARAÇÕES E CONFORMIDADE LEGAL
--------------------------------------------------------------------------------
1. DECLARAÇÃO DE VERACIDADE DOCUMENTAL (Art. 299 Código Penal / Lei nº 8.112/1990):
"${declaracoes.declaracaoVeracidade}"

2. DECLARAÇÃO DE PLENA CONFORMIDADE COM A RESOLUÇÃO CS/IFS Nº 394/2026:
"${declaracoes.declaracaoConformidade}"

3. DECLARAÇÃO DE NÃO DUPLICIDADE (VEDAÇÃO DE BIS IN IDEM - ART. 7º, § 2º):
"${declaracoes.declaracaoNaoAcumulo || 'Declaro a não sobreposição de pontuação em duplicidade com Incentivo à Qualificação formal ou concessões anteriores.'}"

4. DECLARAÇÃO DE CIÊNCIA DOS EFEITOS FINANCEIROS E RITO PROCEDIMENTAL (ART. 19):
"${declaracoes.declaracaoCienciaRegulamento || 'Declaro plena ciência dos prazos, rito e vigência financeira fixada na data do deferimento pela CRSC-PCCTAE.'}"


--------------------------------------------------------------------------------
BLOCO 3: MEMORIAL DESCRITIVO CIRCUNSTANCIADO
--------------------------------------------------------------------------------
1. APRESENTAÇÃO E TRAJETÓRIA PROFISSIONAL:
${memorial.apresentacaoTrajetoria}

2. DESENVOLVIMENTO DE SABERES E ATIVIDADES NOS EIXOS NORMATIVOS (ANEXOS I A VI):
${memorial.desenvolvimentoSaberes}

3. IMPACTO E CONTRIBUIÇÃO INSTITUCIONAL NO ÂMBITO DO SERVIÇO PÚBLICO:
${memorial.impactoInstitucional}

4. CONCLUSÃO E PEDIDO FORMAL:
${memorial.conclusao || 'Submeto o presente Memorial à Comissão Especial de Avaliação do RSC-PCCTAE do IFS, pugnando pelo deferimento integral do pleito.'}


--------------------------------------------------------------------------------
BLOCO 4: TABELA DE INDEXAÇÃO E ADMISSIBILIDADE DE COMPROVANTES
--------------------------------------------------------------------------------
Total de Comprovantes Indexados: ${indexacaoComprovantes.length}

${indexacaoComprovantes
  .map(
    (item, idx) =>
      `ITEM ${idx + 1}:
• Requisito / Critério Normativo: ${item.eixo} (${item.itemCriterio})
• Atividade / Experiência Comprovada: ${item.descricaoAtividade}
• Documento Anexado ao Processo SEI: ${item.documentoCorrespondente}
• Quantidade / Unidade: ${item.quantidadeInformada || 1} ${item.unidadeMedida || ''}
• Pontuação Atribuída: ${Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pontos
• Status de Validação: ${item.statusValidacao}
${item.justificativaLegal ? `• Fundamento: ${item.justificativaLegal}` : ''}`
  )
  .join('\n\n')}


--------------------------------------------------------------------------------
QUADRO DEMONSTRATIVO DE PONTUAÇÃO POR REQUISITO LEGAL (ANEXOS I A VI)
--------------------------------------------------------------------------------
• Requisito I - Comissões e Grupos de Trabalho: ${Number(porEixo.eixoI || 0).toFixed(1).replace('.', ',')} pts
• Requisito II - Projetos Institucionais, Ensino e Extensão: ${Number(porEixo.eixoII || 0).toFixed(1).replace('.', ',')} pts
• Requisito III - Premiações e Reconhecimento Público: ${Number(porEixo.eixoIII || 0).toFixed(1).replace('.', ',')} pts
• Requisito IV - Responsabilidades Técnicas, Contratos e Sistemas: ${Number(porEixo.eixoIV || 0).toFixed(1).replace('.', ',')} pts
• Requisito V - Cargos e Funções de Direção/Chefia (CD/FG): ${Number(porEixo.eixoV || 0).toFixed(1).replace('.', ',')} pts
• Requisito VI - Produção Científica, Tecnológica e INPI: ${Number(porEixo.eixoVI || 0).toFixed(1).replace('.', ',')} pts
--------------------------------------------------------------------------------
PONTUAÇÃO TOTAL ATINGIDA: ${totalFormatado} PONTOS
PONTUAÇÃO MÍNIMA EXIGIDA (${servidor.nivelRscSolicitado}): ${minimoExigido} PONTOS
SALDO EXCEDENTE ACUMULADO (BANCO DE PONTOS): ${saldoExcedente} PONTOS
PARECER PRELIMINAR: ${resumoPontuacao.aptoParaConcessao ? 'DEFERIMENTO / REQUISITOS ATENDIDOS' : 'PONTUAÇÃO INSUFICIENTE'}
================================================================================`;
}

export async function copySeiBlockToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Erro ao copiar texto formatado para o SEI:', err);
    return false;
  }
}
