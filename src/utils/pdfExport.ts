import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProcessoRSC } from '../types';

/**
 * Gera e exporta o Dossiê e Memorial Descritivo de RSC-PCCTAE
 * rigorosamente formatado de acordo com as normas da ABNT (NBR 14724, NBR 10520, NBR 6023)
 * e os requisitos da Resolução CS/IFS nº 394/2026 e Decreto nº 13.048/2026.
 */
export function buildProcessoPdfDocument(processo: ProcessoRSC): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { servidor, declaracoes, memorial, indexacaoComprovantes, resumoPontuacao } = processo;
  const {
    totalPontos = 0,
    minimoExigido = 52,
    porEixo = { eixoI: 0, eixoII: 0, eixoIII: 0, eixoIV: 0, eixoV: 0, eixoVI: 0 },
    bancoPontosExcedente = 0,
    minimoCriteriosExigidos = 5,
  } = resumoPontuacao || {};

  // Margens ABNT: Superior 30mm (3cm), Esquerda 30mm (3cm), Inferior 20mm (2cm), Direita 20mm (2cm)
  const marginL = 30;
  const marginR = 20;
  const marginT = 30;
  const marginB = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - marginL - marginR; // 160mm

  let currentY = marginT;

  // Função auxiliar para verificar espaço na página e quebrar se necessário
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - marginB) {
      doc.addPage();
      currentY = marginT;
      renderHeaderInstitutional();
    }
  };

  // Cabeçalho Institucional Padrão ABNT / Governo Federal
  const renderHeaderInstitutional = () => {
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('REPÚBLICA FEDERATIVA DO BRASIL', pageWidth / 2, currentY - 14, { align: 'center' });
    doc.text('MINISTÉRIO DA EDUCAÇÃO', pageWidth / 2, currentY - 10, { align: 'center' });
    doc.text('INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS', pageWidth / 2, currentY - 6, {
      align: 'center',
    });
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      'COMISSÃO PERMANENTE DE RECONHECIMENTO DE SABERES E COMPETÊNCIAS - CRSC-PCCTAE',
      pageWidth / 2,
      currentY - 2,
      { align: 'center' }
    );
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(marginL, currentY, pageWidth - marginR, currentY);
    currentY += 6;
  };

  // Renderiza cabeçalho na primeira página
  renderHeaderInstitutional();

  // Título Principal do Documento (ABNT - Caixa Alta, Negrito, 13pt)
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('REQUERIMENTO, MEMORIAL DESCRITIVO E DOSSIÊ COMPROBATÓRIO', pageWidth / 2, currentY + 2, {
    align: 'center',
  });
  doc.setFontSize(10.5);
  doc.text('RECONHECIMENTO DE SABERES E COMPETÊNCIAS - RSC-PCCTAE', pageWidth / 2, currentY + 7, {
    align: 'center',
  });

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.text(
    `Base Normativa: Resolução CS/IFS nº 394/2026 • Decreto Federal nº 13.048/2026 • Processo SEI: ${
      processo.numeroProcessoSei || '23060.002409/2026-07'
    }`,
    pageWidth / 2,
    currentY + 12,
    { align: 'center' }
  );

  currentY += 18;

  // ==========================================
  // SEÇÃO 1: DADOS CADASTRAIS E REQUERIMENTO
  // ==========================================
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('1 IDENTIFICAÇÃO DO(A) SERVIDOR(A) E ENQUADRAMENTO', marginL, currentY);
  currentY += 3;

  const totalFormatado = Number(totalPontos).toFixed(1).replace('.', ',');
  const saldoFormatado = Math.max(0, totalPontos - minimoExigido).toFixed(1).replace('.', ',');

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    styles: { font: 'times', fontSize: 8.5, cellPadding: 2, textColor: [0, 0, 0], lineColor: [100, 100, 100], lineWidth: 0.2 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    body: [
      [
        { content: `Nome Completo: ${servidor.nome || 'Servidor(a) Requerente'}`, colSpan: 2 },
        { content: `SIAPE: ${servidor.matriculaSiape || 'Não informado'}` },
      ],
      [
        { content: `Cargo Efetivo: ${servidor.cargo || 'PCCTAE'} (${servidor.nivelCargo || 'Classe D'})` },
        { content: `Data de Ingresso no IFS/IFE: ${servidor.dataIngressoIFE || '28/02/2018'}` },
        { content: `Campus: ${servidor.campus || 'Campus Aracaju'}` },
      ],
      [
        { content: `Lotação / Setor: ${servidor.lotacao || 'Não informado'}` },
        { content: `Função/Chefia Atual: ${servidor.funcaoOuEncargoAtual || 'Não informado'}` },
        { content: `E-mail: ${servidor.email || 'servidor@ifs.edu.br'}` },
      ],
      [
        {
          content: `Nível Pleiteado: ${servidor.nivelRscSolicitado} (${servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'})`,
          colSpan: 2,
          styles: { fontStyle: 'bold' },
        },
        { content: `Prioridade Legal (Lei 9.784): ${servidor.tramitacaoPrioritaria ? 'Sim' : 'Não'}` },
      ],
      [
        {
          content: `Pontuação Apurada: ${totalFormatado} pts (Mínimo: ${minimoExigido} pts em ${minimoCriteriosExigidos} critérios) | Saldo Cumulativo: ${saldoFormatado} pts`,
          colSpan: 3,
          styles: { fontStyle: 'bold', fillColor: [245, 248, 250] },
        },
      ],
    ],
    margin: { left: marginL, right: marginR },
  });

  currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 35) + 6;

  // Texto formal de Requerimento (ABNT: Recuo de primeira linha 1.25cm, justificado)
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const textoRequerimento = `Requeiro à Comissão Permanente para Reconhecimento de Saberes e Competências aos Servidores do PCCTAE (CRSC-PCCTAE/IFS) a concessão do nível ${
    servidor.nivelRscSolicitado
  }, instruindo o presente processo com as declarações de conformidade, memorial descritivo circunstanciado e documentação comprobatória indexada nos termos da Resolução CS/IFS nº 394/2026 e do Decreto Federal nº 13.048/2026.`;

  const splitReq = doc.splitTextToSize(textoRequerimento, contentWidth - 12.5);
  doc.text(splitReq, marginL + 12.5, currentY);
  currentY += splitReq.length * 4.5 + 6;

  // ==========================================
  // SEÇÃO 2: TERMO DE DECLARAÇÕES E CONFORMIDADE
  // ==========================================
  checkPageBreak(35);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('2 DECLARAÇÕES DE CONFORMIDADE LEGAL E CIÊNCIA', marginL, currentY);
  currentY += 4;

  const renderDeclaracao = (titulo: string, texto: string) => {
    checkPageBreak(18);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.text(titulo, marginL, currentY);
    currentY += 3.5;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    const splitDec = doc.splitTextToSize(texto, contentWidth);
    doc.text(splitDec, marginL, currentY);
    currentY += splitDec.length * 3.8 + 3.5;
  };

  renderDeclaracao(
    '2.1 Declaração de Veracidade Documental (Art. 299 do Código Penal / Lei nº 8.112/1990):',
    declaracoes.declaracaoVeracidade ||
      'Declaro, sob as penas da lei, a autenticidade e veracidade de todos os documentos anexados ao processo.'
  );

  renderDeclaracao(
    '2.2 Declaração de Plena Conformidade com a Resolução CS/IFS nº 394/2026:',
    declaracoes.declaracaoConformidade ||
      'Declaro atendimento aos critérios, pontuações mínimas e limites percentuais do regulamento de RSC-PCCTAE.'
  );

  if (declaracoes.declaracaoNaoAcumulo) {
    renderDeclaracao(
      '2.3 Declaração de Não Duplicidade / Vedação a Bis in Idem (Art. 7º, § 2º):',
      declaracoes.declaracaoNaoAcumulo
    );
  }

  if (declaracoes.declaracaoCienciaRegulamento) {
    renderDeclaracao(
      '2.4 Declaração de Ciência dos Prazos e Efeitos Financeiros (Art. 19):',
      declaracoes.declaracaoCienciaRegulamento
    );
  }

  currentY += 2;

  // ==========================================
  // SEÇÃO 3: MEMORIAL DESCRITIVO CIRCUNSTANCIADO (ABNT NBR 14724)
  // ==========================================
  checkPageBreak(40);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('3 MEMORIAL DESCRITIVO CIRCUNSTANCIADO', marginL, currentY);
  currentY += 4;

  const renderSecaoMemorial = (num: string, titulo: string, conteudo: string) => {
    checkPageBreak(25);
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${num} ${titulo}`, marginL, currentY);
    currentY += 3.8;

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    const parágrafos = (conteudo || 'Não informado.').split('\n').filter((p) => p.trim().length > 0);

    parágrafos.forEach((paragrafo) => {
      const splitP = doc.splitTextToSize(paragrafo.trim(), contentWidth - 12.5);
      checkPageBreak(splitP.length * 4.2 + 2);
      // Recuo de primeira linha 12.5mm
      doc.text(splitP, marginL + 12.5, currentY);
      currentY += splitP.length * 4.2 + 2.5;
    });
    currentY += 2;
  };

  renderSecaoMemorial('3.1', 'Apresentação e Trajetória Profissional no IFS', memorial.apresentacaoTrajetoria);
  renderSecaoMemorial(
    '3.2',
    'Desenvolvimento de Saberes e Competências (Anexos I a VI da Resolução 394/2026)',
    memorial.desenvolvimentoSaberes
  );
  renderSecaoMemorial('3.3', 'Impacto Institucional e Relevância no Âmbito Público', memorial.impactoInstitucional);
  if (memorial.conclusao) {
    renderSecaoMemorial('3.4', 'Considerações Finais e Conclusão do Requerimento', memorial.conclusao);
  }

  currentY += 3;

  // ==========================================
  // SEÇÃO 4: QUADRO DE INDEXAÇÃO DE COMPROVANTES
  // ==========================================
  checkPageBreak(45);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('4 QUADRO ANALÍTICO DE COMPROVANTES E ENQUADRAMENTO (ANEXOS I A VI)', marginL, currentY);
  currentY += 3;

  const tableRows = (indexacaoComprovantes || []).map((item, idx) => [
    (idx + 1).toString(),
    `${item.eixo.split(' - ')[0]}\n(${item.itemCriterio})`,
    item.descricaoAtividade,
    item.documentoCorrespondente,
    `${item.quantidadeInformada || 1} ${item.unidadeMedida || ''}`,
    `${Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts`,
  ]);

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    styles: { font: 'times', fontSize: 7, cellPadding: 1.5, textColor: [0, 0, 0], lineColor: [150, 150, 150], lineWidth: 0.15 },
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 7.5 },
    head: [['#', 'Requisito Normativo', 'Atividade / Portarias Comprovadas', 'Doc. SEI / Fls.', 'Qtd/Unid', 'Pontos']],
    body: tableRows.length > 0 ? tableRows : [['-', 'Sem comprovantes', 'Nenhum comprovante adicionado', '-', '-', '0,0 pts']],
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 32 },
      2: { cellWidth: 63 },
      3: { cellWidth: 32 },
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 12, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: marginL, right: marginR },
  });

  currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 30) + 5;

  // ==========================================
  // SEÇÃO 5: DEMONSTRATIVO DE PONTUAÇÃO POR REQUISITO
  // ==========================================
  checkPageBreak(30);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('5 DEMONSTRATIVO DE PONTUAÇÃO POR REQUISITO LEGAL', marginL, currentY);
  currentY += 3;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    styles: { font: 'times', fontSize: 7.5, cellPadding: 1.8, textColor: [0, 0, 0], lineColor: [150, 150, 150], lineWidth: 0.15 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    body: [
      ['Req. I (Comissões)', `${Number(porEixo.eixoI || 0).toFixed(1).replace('.', ',')} pts`, 'Req. IV (Contratos e Sistemas)', `${Number(porEixo.eixoIV || 0).toFixed(1).replace('.', ',')} pts`],
      ['Req. II (Projetos e Ensino)', `${Number(porEixo.eixoII || 0).toFixed(1).replace('.', ',')} pts`, 'Req. V (CD/FG Chefia)', `${Number(porEixo.eixoV || 0).toFixed(1).replace('.', ',')} pts`],
      ['Req. III (Premiações)', `${Number(porEixo.eixoIII || 0).toFixed(1).replace('.', ',')} pts`, 'Req. VI (Produção e INPI)', `${Number(porEixo.eixoVI || 0).toFixed(1).replace('.', ',')} pts`],
      [
        {
          content: `TOTAL APURADO: ${totalFormatado} PONTOS (MÍNIMO EXIGIDO: ${minimoExigido} PTS EM ${minimoCriteriosExigidos} CRITÉRIOS) | BANCO EXCEDENTE (ART. 7º, § 1º): ${saldoFormatado} PTS`,
          colSpan: 4,
          styles: { fontStyle: 'bold', fillColor: [245, 248, 250], textColor: [0, 80, 50] },
        },
      ],
    ],
    margin: { left: marginL, right: marginR },
  });

  currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 25) + 8;

  // ==========================================
  // SEÇÃO 6: TERMO DE ENCERRAMENTO E ASSINATURA
  // ==========================================
  checkPageBreak(35);
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Aracaju/SE, ${dataHoje}.`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 12;

  // Linha de assinatura
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 45, currentY, pageWidth / 2 + 45, currentY);
  currentY += 4;

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text(servidor.nome || 'Servidor(a) Requerente', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `SIAPE ${servidor.matriculaSiape || '------'} • ${servidor.cargo || 'PCCTAE'} (${servidor.lotacao || 'IFS'})`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  // Rodapé de Paginação ABNT em todas as páginas
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Processo SEI nº ${processo.numeroProcessoSei || '23060.002409/2026-07'} • Folha ${i} de ${totalPages}`,
      pageWidth - marginR,
      pageHeight - 10,
      { align: 'right' }
    );
    doc.text('Dossiê RSC-PCCTAE • Resolução CS/IFS nº 394/2026', marginL, pageHeight - 10, { align: 'left' });
  }

  return doc;
}

/**
 * Faz o download direto e seguro do PDF no navegador do usuário
 */
export function exportProcessoToPdf(processo: ProcessoRSC): { success: boolean; filename: string } {
  try {
    const doc = buildProcessoPdfDocument(processo);
    const nomeSanitizado = (processo.servidor.nome || 'Servidor').replace(/\s+/g, '_');
    const filename = `Processo_RSC_${processo.servidor.nivelRscSolicitado || 'RSC-V'}_${nomeSanitizado}_ABNT.pdf`;

    // 1. Gera Blob para download 100% compatível com todos os navegadores e iframes
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = filename;
    downloadAnchor.style.display = 'none';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(blobUrl);
    }, 2000);

    return { success: true, filename };
  } catch (err) {
    console.error('Erro ao gerar PDF ABNT:', err);
    // Fallback nativo do jsPDF
    try {
      const doc = buildProcessoPdfDocument(processo);
      const filename = `Processo_RSC_ABNT.pdf`;
      doc.save(filename);
      return { success: true, filename };
    } catch (fallbackErr) {
      console.error('Falha no fallback de PDF:', fallbackErr);
      return { success: false, filename: '' };
    }
  }
}

/**
 * Abre o PDF gerado diretamente em uma nova aba do navegador para visualização ou impressão imediata
 */
export function openProcessoPdfInNewTab(processo: ProcessoRSC): boolean {
  try {
    const doc = buildProcessoPdfDocument(processo);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(blobUrl, '_blank');
    if (!newWindow) {
      // Caso popups estejam bloqueados, cria link temporário
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return true;
  } catch (err) {
    console.error('Erro ao abrir PDF na nova aba:', err);
    return false;
  }
}

export const generateProcessoPdf = exportProcessoToPdf;
