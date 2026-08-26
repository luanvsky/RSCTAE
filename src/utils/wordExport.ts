import { ProcessoRSC } from '../types';

export function exportProcessoToWord(processo: ProcessoRSC) {
  const { servidor, declaracoes, memorial, indexacaoComprovantes, resumoPontuacao } = processo;
  const { totalPontos = 0, minimoExigido = 52, porEixo = { eixoI: 0, eixoII: 0, eixoIII: 0, eixoIV: 0, eixoV: 0, eixoVI: 0 } } = resumoPontuacao || {};
  const totalFormatado = Number(totalPontos).toFixed(1).replace('.', ',');
  const saldoFormatado = Math.max(0, totalPontos - minimoExigido).toFixed(1).replace('.', ',');

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Processo RSC-PCCTAE - ${servidor.nome}</title>
      <style>
        @page Section1 {
          size: 210mm 297mm;
          margin: 30mm 20mm 20mm 30mm; /* ABNT: Superior 3cm, Direita 2cm, Inferior 2cm, Esquerda 3cm */
          mso-header-margin: 15mm;
          mso-footer-margin: 15mm;
          mso-paper-source: 0;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000000;
          text-align: justify;
        }
        .header-box {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1.5pt solid #000;
          padding-bottom: 8px;
        }
        .inst-title { font-size: 11pt; font-weight: bold; margin: 2px 0; }
        .inst-sub { font-size: 9.5pt; margin: 1px 0; }
        .doc-title {
          font-size: 13pt;
          font-weight: bold;
          text-align: center;
          margin-top: 15px;
          margin-bottom: 4px;
        }
        .doc-subtitle {
          font-size: 10pt;
          font-style: italic;
          text-align: center;
          margin-bottom: 20px;
        }
        .section-h1 {
          font-size: 12pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 22px;
          margin-bottom: 8px;
          background-color: #f2f2f2;
          padding: 4px 8px;
          border-left: 3pt solid #000;
        }
        .section-h2 {
          font-size: 11.5pt;
          font-weight: bold;
          margin-top: 14px;
          margin-bottom: 4px;
        }
        p {
          margin: 6px 0;
          text-indent: 1.25cm; /* Recuo padrão ABNT */
          line-height: 1.5;
        }
        p.no-indent {
          text-indent: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          margin-bottom: 14px;
          font-size: 9.5pt;
          line-height: 1.2;
        }
        th, td {
          border: 1pt solid #444;
          padding: 5px 7px;
          text-align: left;
        }
        th {
          background-color: #eaeaea;
          font-weight: bold;
        }
        .highlight-row {
          background-color: #f5f8fa;
          font-weight: bold;
        }
        .signature-block {
          margin-top: 40px;
          text-align: center;
          page-break-inside: avoid;
        }
        .sig-line {
          border-top: 1pt solid #000;
          width: 320px;
          display: inline-block;
          padding-top: 6px;
          font-size: 10.5pt;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <div class="header-box">
          <div class="inst-title">REPÚBLICA FEDERATIVA DO BRASIL</div>
          <div class="inst-title">MINISTÉRIO DA EDUCAÇÃO</div>
          <div class="inst-title">INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE SERGIPE - IFS</div>
          <div class="inst-sub">COMISSÃO PERMANENTE DE RECONHECIMENTO DE SABERES E COMPETÊNCIAS - CRSC-PCCTAE</div>
        </div>

        <div class="doc-title">REQUERIMENTO, MEMORIAL DESCRITIVO E DOSSIÊ DE RSC-PCCTAE</div>
        <div class="doc-subtitle">
          Resolução CS/IFS nº 394/2026 • Decreto Federal nº 13.048/2026 • Processo SEI nº ${processo.numeroProcessoSei || '23060.002409/2026-07'}
        </div>

        <div class="section-h1">1 IDENTIFICAÇÃO DO(A) SERVIDOR(A) E ENQUADRAMENTO</div>
        <table>
          <tr>
            <td width="25%"><strong>Nome do Servidor:</strong></td>
            <td width="45%">${servidor.nome || 'Não informado'}</td>
            <td width="15%"><strong>SIAPE:</strong></td>
            <td width="15%">${servidor.matriculaSiape || 'Não informado'}</td>
          </tr>
          <tr>
            <td><strong>Cargo Efetivo:</strong></td>
            <td>${servidor.cargo} (${servidor.nivelCargo})</td>
            <td><strong>Data Ingresso:</strong></td>
            <td>${servidor.dataIngressoIFE || '28/02/2018'}</td>
          </tr>
          <tr>
            <td><strong>Lotação / Campus:</strong></td>
            <td>${servidor.lotacao} - ${servidor.campus}</td>
            <td><strong>E-mail:</strong></td>
            <td>${servidor.email}</td>
          </tr>
          <tr>
            <td><strong>Nível Solicitado:</strong></td>
            <td colspan="3"><strong>${servidor.nivelRscSolicitado}</strong> (${servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'})</td>
          </tr>
          <tr class="highlight-row">
            <td><strong>Pontuação Apurada:</strong></td>
            <td colspan="3">${totalFormatado} pontos (Mínimo: ${minimoExigido} pontos) | Banco Excedente Cumulativo: ${saldoFormatado} pontos</td>
          </tr>
        </table>

        <p class="no-indent"><strong>Requerimento Formal:</strong></p>
        <p>Requeiro à Comissão Permanente de RSC-PCCTAE/IFS a concessão do <strong>${servidor.nivelRscSolicitado}</strong>, com base nos critérios estabelecidos na Resolução CS/IFS nº 394/2026 e no Decreto nº 13.048/2026, instruindo o presente processo com as declarações de conformidade, memorial descritivo circunstanciado e documentos comprobatórios indexados.</p>

        <div class="section-h1">2 DECLARAÇÕES DE CONFORMIDADE LEGAL E CIÊNCIA</div>
        <div class="section-h2">2.1 Declaração de Veracidade Documental (Art. 299 CP / Lei 8.112/1990)</div>
        <p>${declaracoes.declaracaoVeracidade || 'Declaro, sob as penas da lei, a autenticidade e veracidade de todos os documentos anexados.'}</p>

        <div class="section-h2">2.2 Declaração de Plena Conformidade com a Resolução CS/IFS nº 394/2026</div>
        <p>${declaracoes.declaracaoConformidade || 'Declaro atendimento a todos os critérios e percentuais fixados no regulamento institucional.'}</p>

        ${declaracoes.declaracaoNaoAcumulo ? `
        <div class="section-h2">2.3 Declaração de Não Duplicidade / Vedação a Bis in Idem (Art. 7º, § 2º)</div>
        <p>${declaracoes.declaracaoNaoAcumulo}</p>
        ` : ''}

        ${declaracoes.declaracaoCienciaRegulamento ? `
        <div class="section-h2">2.4 Declaração de Ciência dos Efeitos Financeiros e Trâmites (Art. 19)</div>
        <p>${declaracoes.declaracaoCienciaRegulamento}</p>
        ` : ''}

        <div class="section-h1">3 MEMORIAL DESCRITIVO CIRCUNSTANCIADO (ABNT NBR 14724)</div>
        <div class="section-h2">3.1 Apresentação e Trajetória Profissional no IFS</div>
        ${(memorial.apresentacaoTrajetoria || 'Não informado.')
          .split('\n')
          .filter((p) => p.trim())
          .map((p) => `<p>${p}</p>`)
          .join('')}

        <div class="section-h2">3.2 Desenvolvimento de Saberes e Competências (Anexos I a VI da Resolução 394/2026)</div>
        ${(memorial.desenvolvimentoSaberes || 'Não informado.')
          .split('\n')
          .filter((p) => p.trim())
          .map((p) => `<p>${p}</p>`)
          .join('')}

        <div class="section-h2">3.3 Impacto Institucional e Relevância no Âmbito Público</div>
        ${(memorial.impactoInstitucional || 'Não informado.')
          .split('\n')
          .filter((p) => p.trim())
          .map((p) => `<p>${p}</p>`)
          .join('')}

        ${memorial.conclusao ? `
        <div class="section-h2">3.4 Conclusão e Pedido</div>
        <p>${memorial.conclusao}</p>
        ` : ''}

        <div class="section-h1">4 QUADRO ANALÍTICO DE COMPROVANTES (ANEXOS I A VI)</div>
        <table>
          <thead>
            <tr>
              <th width="5%">#</th>
              <th width="25%">Requisito Normativo</th>
              <th width="38%">Atividade / Documento Comprovado</th>
              <th width="18%">Doc. SEI / Fls.</th>
              <th width="14%">Pontos</th>
            </tr>
          </thead>
          <tbody>
            ${indexacaoComprovantes
              .map(
                (c, i) => `
              <tr>
                <td style="text-align:center;">${i + 1}</td>
                <td><strong>${c.eixo.split(' - ')[0]}</strong><br><span style="font-size:8.5pt;">${c.itemCriterio}</span></td>
                <td>${c.descricaoAtividade}</td>
                <td>${c.documentoCorrespondente}</td>
                <td style="text-align:right;"><strong>${Number(c.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts</strong></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="section-h1">5 DEMONSTRATIVO DE PONTUAÇÃO POR REQUISITO</div>
        <table>
          <tr>
            <td><strong>Req. I (Comissões):</strong> ${Number(porEixo.eixoI || 0).toFixed(1).replace('.', ',')} pts</td>
            <td><strong>Req. IV (Contratos/Sistemas):</strong> ${Number(porEixo.eixoIV || 0).toFixed(1).replace('.', ',')} pts</td>
          </tr>
          <tr>
            <td><strong>Req. II (Projetos/Ensino):</strong> ${Number(porEixo.eixoII || 0).toFixed(1).replace('.', ',')} pts</td>
            <td><strong>Req. V (CD/FG Chefia):</strong> ${Number(porEixo.eixoV || 0).toFixed(1).replace('.', ',')} pts</td>
          </tr>
          <tr>
            <td><strong>Req. III (Premiações):</strong> ${Number(porEixo.eixoIII || 0).toFixed(1).replace('.', ',')} pts</td>
            <td><strong>Req. VI (Produção/INPI):</strong> ${Number(porEixo.eixoVI || 0).toFixed(1).replace('.', ',')} pts</td>
          </tr>
          <tr class="highlight-row">
            <td colspan="2">TOTAL GERAL APURADO: ${totalFormatado} PONTOS (MÍNIMO: ${minimoExigido} PTS) | BANCO EXCEDENTE: ${saldoFormatado} PTS</td>
          </tr>
        </table>

        <div class="signature-block">
          <p class="no-indent">Aracaju/SE, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>
          <br><br>
          <div class="sig-line">
            <strong>${servidor.nome || 'Servidor Requerente'}</strong><br>
            SIAPE ${servidor.matriculaSiape} • ${servidor.cargo} (${servidor.lotacao})
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Processo_RSC_${servidor.nivelRscSolicitado}_${(servidor.nome || 'Servidor').replace(/\s+/g, '_')}_ABNT.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
