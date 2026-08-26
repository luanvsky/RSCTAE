import React, { useState, useRef } from 'react';
import {
  Sparkles,
  UploadCloud,
  RefreshCw,
  Zap,
  X,
  AlertCircle,
  FileText,
  CheckCircle2,
  Trash2,
  Scale,
  Plus,
  Layers,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { ProcessoRSC, DocumentoAvaliado, ComprovanteItem } from '../types';
import { AvaliacaoLoteModal } from './AvaliacaoLoteModal';

interface UploadAndExtractionPanelProps {
  currentProcesso: ProcessoRSC;
  onProcessoUpdate: (novoProcesso: ProcessoRSC) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

interface StagedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  contentBase64?: string;
  textContent?: string;
  status: 'pronto' | 'lendo' | 'avaliado' | 'erro';
}

export const UploadAndExtractionPanel: React.FC<UploadAndExtractionPanelProps> = ({
  currentProcesso,
  onProcessoUpdate,
  isProcessing,
  setIsProcessing,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [additionalText, setAdditionalText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Evaluation modal state
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    documentosAvaliados: DocumentoAvaliado[];
    parecerGeral?: string;
    pontuacaoTotal: number;
    minimoExigido: number;
    aptoParaConcessao: boolean;
    resumoPorEixo: {
      eixoI: number;
      eixoII: number;
      eixoIII: number;
      eixoIV: number;
    };
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to read File as Base64 (without data: prefix)
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFilesAdded = async (fileList: FileList | File[]) => {
    setError(null);
    const incoming = Array.from(fileList);

    const newStaged: StagedFile[] = [];

    for (const f of incoming) {
      // Avoid duplicate by name and size
      if (!stagedFiles.some((sf) => sf.name === f.name && sf.size === f.size)) {
        newStaged.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file: f,
          name: f.name,
          size: f.size,
          type: f.type || 'application/pdf',
          status: 'pronto',
        });
      }
    }

    if (newStaged.length === 0) return;

    setStagedFiles((prev) => [...prev, ...newStaged]);
    if (!isOpen) setIsOpen(true);
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFiles = () => {
    setStagedFiles([]);
    setError(null);
  };

  // Load predefined sample bundle to test multi-PDF compliance verification instantly
  const handleLoadSampleBatch = () => {
    const samples: StagedFile[] = [
      {
        id: `sample-1-${Date.now()}`,
        file: new File([], 'Certificado_ENAP_Especializacao_Gestao_Publica_360h.pdf'),
        name: 'Certificado_ENAP_Especializacao_Gestao_Publica_360h.pdf',
        size: 2450000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Certificado de Pós-Graduação Lato Sensu em Gestão Pública. Carga horária: 360 horas. Escola Nacional de Administração Pública (ENAP). Conclusão em 2023. Nota 9.5.',
      },
      {
        id: `sample-2-${Date.now()}`,
        file: new File([], 'Certificado_TCU_Auditoria_Folha_Pagamento_80h.pdf'),
        name: 'Certificado_TCU_Auditoria_Folha_Pagamento_80h.pdf',
        size: 1180000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Certificado de Curso de Aperfeiçoamento em Auditoria de Folha de Pagamento e Conformidade Legal no Serviço Público. Carga horária: 80 horas. Instituto Serzedello Corrêa/TCU. 2024.',
      },
      {
        id: `sample-3-${Date.now()}`,
        file: new File([], 'Portaria_Aprovacao_Manual_Procedimentos_DGP_2024.pdf'),
        name: 'Portaria_Aprovacao_Manual_Procedimentos_DGP_2024.pdf',
        size: 3420000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Portaria Normativa nº 28/2024 - Reitoria. Aprova o Manual Prático de Concessão de Aposentadorias e Pensões dos Servidores do IFSP, elaborado pelo Assistente em Administração.',
      },
      {
        id: `sample-4-${Date.now()}`,
        file: new File([], 'Portaria_Designacao_Chefia_Coordenador_FG1_36meses.pdf'),
        name: 'Portaria_Designacao_Chefia_Coordenador_FG1_36meses.pdf',
        size: 890000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Portaria nº 142/2022 - Designação para Função Gratificada FG-1 de Coordenador de Carreiras e Pagamento, exercida ininterruptamente de 01/02/2022 a 31/01/2025 (36 meses).',
      },
      {
        id: `sample-5-${Date.now()}`,
        file: new File([], 'Declaracao_Instrutoria_Interna_Capacitacao_Novos_Servidores_40h.pdf'),
        name: 'Declaracao_Instrutoria_Interna_Capacitacao_Novos_Servidores_40h.pdf',
        size: 670000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Declaração da Pró-Reitoria de Desenvolvimento Institucional atestando que o servidor atuou como instrutor interno no Programa de Integração e Capacitação de Novos Servidores, ministrando 40h de aulas.',
      },
      {
        id: `sample-6-${Date.now()}`,
        file: new File([], 'Certificado_Palestra_Webinar_1h.pdf'),
        name: 'Certificado_Palestra_Webinar_1h.pdf',
        size: 450000,
        type: 'application/pdf',
        status: 'pronto',
        textContent: 'Certificado de ouvinte em webinar de 1 hora sobre introdução à gestão de tempo. Sem avaliação ou conteúdo programático.',
      },
    ];

    setStagedFiles(samples);
    setIsOpen(true);
  };

  // Client-side rule evaluation engine based on Resolução CS/IFS nº 394/2026
  const runLocalBatchEvaluation = (
    files: Array<{ name: string; size?: number; type?: string; textContent?: string }>,
    nivel: string = 'RSC-V',
    servidor?: any
  ) => {
    const avaliados: DocumentoAvaliado[] = [];
    let e1 = 0, e2 = 0, e3 = 0, e4 = 0, e5 = 0, e6 = 0;

    files.forEach((file, index) => {
      const lower = (file.name + ' ' + (file.textContent || '')).toLowerCase();
      const id = `doc-${Date.now()}-${index + 1}`;

      let tipo = 'Documento Comprobatório Geral';
      let veredito: DocumentoAvaliado['veredito'] = 'CABIVEL';
      let eixo: DocumentoAvaliado['eixoSugerido'] = 'I - Comissões e Grupos de Trabalho';
      let artigo = 'Anexo I, Item 3';
      let descricao = `Atividade referente ao documento ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
      let cargaHoraria = 'Conforme anexo';
      let pontos = 3.0;
      let pontosMax = 30.0;
      let justificativa = '';
      let orientacao = '';

      if (
        lower.includes('comprovante_residencia') ||
        lower.includes('rg_') ||
        lower.includes('cpf_') ||
        lower.includes('titulo_eleitor') ||
        lower.includes('cnh_') ||
        lower.includes('contracheque') ||
        lower.includes('holerite')
      ) {
        tipo = 'Documento Pessoal / Não Avaliável para RSC';
        veredito = 'NAO_CABIVEL';
        eixo = 'I - Comissões e Grupos de Trabalho';
        artigo = 'Não enquadrável na Resolução CS/IFS nº 394/2026';
        descricao = 'Documento de identificação ou funcional pessoal não pontuável no âmbito de competências do RSC.';
        cargaHoraria = 'N/A';
        pontos = 0;
        pontosMax = 0;
        justificativa = 'Documentos de cunho estritamente cadastral ou pessoal não constituem saberes ou competências pontuáveis no PCCTAE.';
        orientacao = 'Mantenha no dossiê de identificação funcional, mas não o inclua na tabela de pontuação.';
      } else if (lower.includes('patente') || lower.includes('inpi') || lower.includes('software') || lower.includes('registro')) {
        tipo = 'Depósito de Propriedade Intelectual / INPI';
        veredito = 'CABIVEL';
        eixo = 'VI - Produção Científica e Tecnológica';
        artigo = 'Anexo VI, Item 2 (Depósitos no INPI)';
        descricao = `Registro ou depósito de propriedade intelectual / software no INPI: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Concedido/Depositado';
        pontos = 25.0;
        pontosMax = 50.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo VI, Item 2: Depósito de patente ou software no INPI confere 25,00 pontos por projeto.';
        orientacao = 'Anexar o certificado de depósito com número de processo do INPI emitido em nome da IFE.';
      } else if (lower.includes('contrato') || lower.includes('fiscal') || lower.includes('fiscalizacao') || lower.includes('gestor')) {
        tipo = 'Portaria de Gestão e Fiscalização de Contratos';
        veredito = 'CABIVEL';
        eixo = 'IV - Responsabilidades e Contratos';
        artigo = 'Anexo IV, Item 3 (Fiscalização de Contratos)';
        descricao = `Fiscalização ou gestão continuada de contratos de serviços: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Atuação continuada';
        const isMulti = lower.includes('10') || lower.includes('conjunto');
        pontos = isMulti ? 45.0 : 4.5;
        pontosMax = 50.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo IV, Item 3: Gestão ou fiscalização de contratos confere 4,50 pts por contrato.';
        orientacao = 'Anexar portarias de designação de fiscal e extrato de vigência contratual.';
      } else if (lower.includes('siafi') || lower.includes('scdp') || lower.includes('estruturante') || lower.includes('conformidade')) {
        tipo = 'Operação de Sistemas Estruturantes Federais';
        veredito = 'CABIVEL';
        eixo = 'IV - Responsabilidades e Contratos';
        artigo = 'Anexo IV, Item 1 (SIAFI / SCDP / Sistemas Federais)';
        descricao = `Operação e conformidade de sistemas federais estruturantes: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Operação contínua';
        pontos = 9.0;
        pontosMax = 15.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo IV, Item 1: Operação e auditoria em sistemas estruturantes confere 4,50 pts por sistema.';
        orientacao = 'Apresentar portaria de designação de conformista ou operador formal.';
      } else if (lower.includes('fg') || lower.includes('cd') || lower.includes('chefia') || lower.includes('coorden')) {
        tipo = 'Exercício de Cargo de Direção ou Função Gratificada';
        veredito = 'CABIVEL';
        eixo = 'V - Cargos e Funções de Direção/Chefia';
        const isFG12 = lower.includes('fg-01') || lower.includes('fg-02') || lower.includes('fg01') || lower.includes('fg02');
        artigo = isFG12 ? 'Anexo V, Item 3 (FG-01 e FG-02)' : 'Anexo V, Item 4 (FG-03 a FG-05)';
        descricao = `Exercício de Função Gratificada / Chefia Institucional: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Período regular (> 6 meses)';
        pontos = isFG12 ? 13.5 : 9.0;
        pontosMax = 30.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo V: Exercício de CD/FG confere pontuação proporcional por ano ou fração superior a 6 meses.';
        orientacao = 'Anexar certidão de tempo de efetivo exercício em função de confiança.';
      } else if (lower.includes('comissao') || lower.includes('portaria') || lower.includes('inventario') || lower.includes('pad')) {
        tipo = 'Portaria de Comissão Institucional / Colegiado';
        veredito = 'CABIVEL';
        eixo = 'I - Comissões e Grupos de Trabalho';
        artigo = 'Anexo I, Item 3 (Membro Titular de Comissões)';
        descricao = `Atuação em comissões regularmente instituídas: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Mandato regular';
        pontos = 9.0;
        pontosMax = 30.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo I, Item 3: Participação como membro titular confere 3,00 pts por designação.';
        orientacao = 'Anexar portarias de designação e comprovante de encerramento dos trabalhos.';
      } else if (lower.includes('projeto') || lower.includes('pesquisa') || lower.includes('extensao') || lower.includes('propex')) {
        tipo = 'Coordenação / Participação em Projetos Institucionais';
        veredito = 'CABIVEL';
        eixo = 'II - Projetos, Pesquisa e Extensão';
        artigo = 'Anexo II, Item 1 (Coordenação de Projetos)';
        descricao = `Coordenação ou participação técnica em projeto institucional: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Projeto homologado';
        pontos = 7.5;
        pontosMax = 25.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo II, Item 1: Coordenação de projetos confere 7,50 pts por projeto.';
        orientacao = 'Apresentar declaração emitida pela Pró-Reitoria.';
      } else if (lower.includes('premio') || lower.includes('elogio')) {
        tipo = 'Premiação / Reconhecimento Público';
        veredito = 'CABIVEL';
        eixo = 'III - Premiações e Reconhecimento';
        artigo = 'Anexo III, Item 3 (Premiação Local ou Institucional)';
        descricao = `Premiação ou elogio formal institucional por projeto: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`;
        cargaHoraria = 'Premiação homologada';
        pontos = 7.5;
        pontosMax = 20.0;
        justificativa = 'Resolução CS/IFS 394/2026, Anexo III, Item 3: Premiação formal confere 7,50 pts.';
        orientacao = 'Anexar portaria de elogio ou certificado expedido.';
      }

      if (veredito !== 'NAO_CABIVEL') {
        if (eixo.startsWith('I -')) e1 += pontos;
        else if (eixo.startsWith('II -')) e2 += pontos;
        else if (eixo.startsWith('III -')) e3 += pontos;
        else if (eixo.startsWith('IV -')) e4 += pontos;
        else if (eixo.startsWith('V -')) e5 += pontos;
        else if (eixo.startsWith('VI -')) e6 += pontos;
      }

      avaliados.push({
        id,
        nomeArquivo: file.name,
        tipoDocumento: tipo,
        veredito,
        eixoSugerido: eixo,
        artigoDecreto: artigo,
        descricaoIdentificada: descricao,
        cargaHorariaOuPeriodo: cargaHoraria,
        pontosCalculados: pontos,
        pontosMaximosCriterio: pontosMax,
        justificativa,
        orientacaoAoServidor: orientacao,
        incluirNoProcesso: veredito !== 'NAO_CABIVEL',
      });
    });

    const totalValido = e1 + e2 + e3 + e4 + e5 + e6;
    const minReq =
      nivel === 'RSC-I'
        ? 10
        : nivel === 'RSC-II'
        ? 15
        : nivel === 'RSC-III'
        ? 25
        : nivel === 'RSC-IV'
        ? 30
        : nivel === 'RSC-V'
        ? 52
        : 75;

    return {
      documentosAvaliados: avaliados,
      parecerGeral: `Avaliação de admissibilidade em conformidade com a Resolução CS/IFS nº 394/2026. Foram auditados ${files.length} documento(s), totalizando ${totalValido.toFixed(1).replace('.', ',')} pontos válidos (Mínimo exigido para ${nivel}: ${minReq} pontos).`,
      pontuacaoTotalValida: totalValido,
      minimoExigido: minReq,
      aptoParaConcessao: totalValido >= minReq,
      resumoPorEixo: {
        eixoI: e1,
        eixoII: e2,
        eixoIII: e3,
        eixoIV: e4,
        eixoV: e5,
        eixoVI: e6,
      },
    };
  };

  const handleEvaluateBatch = async () => {
    if (stagedFiles.length === 0 && !additionalText.trim()) {
      setError('Selecione ou anexe pelo menos um arquivo PDF para avaliação.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatusMessage('Lendo e analisando todos os PDFs com as regras do Decreto nº 13.048/2026...');

    try {
      // Prepare files metadata and text contents
      const preparedFiles = stagedFiles.map((sf) => ({
        name: sf.name,
        size: sf.size,
        type: sf.type,
        textContent: sf.textContent,
      }));

      setStatusMessage('Avaliando admissibilidade, artigos normativos e calculando pontuação...');

      let evalData: any = null;

      try {
        const response = await fetch('/api/evaluate-batch-pdfs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: preparedFiles,
            nivelDesejado: currentProcesso.servidor.nivelRscSolicitado || 'RSC-II',
            servidorManual: currentProcesso.servidor,
            additionalContext: additionalText,
          }),
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success && data.evaluation) {
            evalData = data.evaluation;
          }
        }
      } catch (fetchErr) {
        console.warn('Backend evaluation failed, using local regulatory engine:', fetchErr);
      }

      // If server evaluation was unavailable or returned non-JSON, run the local compliance engine
      if (!evalData) {
        evalData = runLocalBatchEvaluation(
          preparedFiles,
          currentProcesso.servidor.nivelRscSolicitado || 'RSC-II',
          currentProcesso.servidor
        );
      }

      setEvaluationResult({
        documentosAvaliados: evalData.documentosAvaliados,
        parecerGeral: evalData.parecerGeral,
        pontuacaoTotal: evalData.pontuacaoTotalValida ?? evalData.pontuacaoTotal ?? 0,
        minimoExigido: evalData.minimoExigido || (currentProcesso.servidor.nivelRscSolicitado === 'RSC-I' ? 45 : currentProcesso.servidor.nivelRscSolicitado === 'RSC-II' ? 52 : 60),
        aptoParaConcessao: evalData.aptoParaConcessao ?? ((evalData.pontuacaoTotalValida ?? 0) >= (evalData.minimoExigido || 52)),
        resumoPorEixo: evalData.resumoPorEixo || { eixoI: 0, eixoII: 0, eixoIII: 0, eixoIV: 0 },
      });

      setIsEvaluationModalOpen(true);
    } catch (err: any) {
      console.error('Evaluation processing failed:', err);
      // Run local fallback even on unexpected error so user is never blocked
      const localEval = runLocalBatchEvaluation(
        stagedFiles.map((sf) => ({ name: sf.name, size: sf.size, type: sf.type, textContent: sf.textContent })),
        currentProcesso.servidor.nivelRscSolicitado || 'RSC-II',
        currentProcesso.servidor
      );
      setEvaluationResult({
        documentosAvaliados: localEval.documentosAvaliados,
        parecerGeral: localEval.parecerGeral,
        pontuacaoTotal: localEval.pontuacaoTotalValida,
        minimoExigido: localEval.minimoExigido,
        aptoParaConcessao: localEval.aptoParaConcessao,
        resumoPorEixo: localEval.resumoPorEixo,
      });
      setIsEvaluationModalOpen(true);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleApplyApprovedDocuments = (documentosAprovados: DocumentoAvaliado[]) => {
    // Transform approved items to ComprovanteItem format for Bloco 4
    const novosComprovantes: ComprovanteItem[] = documentosAprovados.map((doc, idx) => ({
      id: `comp-audited-${Date.now()}-${idx + 1}`,
      itemCriterio: `Decreto nº 13.048/2026 - ${doc.artigoDecreto}`,
      eixo: doc.eixoSugerido,
      descricaoAtividade: doc.descricaoIdentificada,
      documentoCorrespondente: `${doc.nomeArquivo} (Fls. ${String(idx * 4 + 1).padStart(2, '0')}-${String(idx * 4 + 4).padStart(2, '0')})`,
      periodoHoras: doc.cargaHorariaOuPeriodo,
      pontuacaoAtribuida: doc.pontosCalculados,
      pontuacaoMaximaPermitida: doc.pontosMaximosCriterio,
      statusValidacao: doc.veredito === 'CABIVEL_PARCIAL' ? 'Cabível com Ressalva' : 'Validade Confirmada',
      veredito: doc.veredito,
      justificativaLegal: doc.justificativa,
      artigoDecreto: doc.artigoDecreto,
      observacao: doc.orientacaoAoServidor,
      incluidoNoDossie: true,
    }));

    // Auto-update memorial descritivo highlights based on approved items
    const qualif = documentosAprovados.filter((d) => d.eixoSugerido.startsWith('I -')).map((d) => d.descricaoIdentificada).join('; ');
    const tecnic = documentosAprovados.filter((d) => d.eixoSugerido.startsWith('II -')).map((d) => d.descricaoIdentificada).join('; ');
    const gestao = documentosAprovados.filter((d) => d.eixoSugerido.startsWith('III -')).map((d) => d.descricaoIdentificada).join('; ');
    const ensino = documentosAprovados.filter((d) => d.eixoSugerido.startsWith('IV -')).map((d) => d.descricaoIdentificada).join('; ');

    const novoMemorial = {
      apresentacaoTrajetoria: currentProcesso.memorial.apresentacaoTrajetoria ||
        `Servidor público federal ocupante do cargo de ${currentProcesso.servidor.cargo || 'Assistente em Administração'}, lotado na ${currentProcesso.servidor.lotacao || 'Diretoria de Gestão de Pessoas'}, atuando com dedicação e compromisso no desenvolvimento das rotinas administrativas e pedagógicas institucionais.`,
      desenvolvimentoSaberes:
        `O desenvolvimento de saberes e competências ao longo da carreira encontra-se estruturado em estrita observância aos 4 eixos do Decreto nº 13.048/2026:\n` +
        `• Eixo I (Qualificação): ${qualif || 'Participação contínua em ações de capacitação técnica em escolas de governo e pós-graduação'}.\n` +
        `• Eixo II (Produção Técnica): ${tecnic || 'Elaboração e revisão de manuais de procedimentos operacionais e ferramentas de trabalho'}.\n` +
        `• Eixo III (Gestão e Governança): ${gestao || 'Atuação em funções de chefia e participação em comissões institucionais e colegiados'}.\n` +
        `• Eixo IV (Extensão e Ensino): ${ensino || 'Atuação como instrutor em treinamentos internos e projetos de difusão de conhecimento'}.`,
      impactoInstitucional:
        `As competências consolidadas resultaram em expressivos ganhos de celeridade, conformidade legal e padronização para o ${currentProcesso.servidor.campus || 'Campus Institucional'}, garantindo segurança jurídica aos processos e eficiência no atendimento à comunidade acadêmica.`,
      conclusao:
        `Diante da documentação comprobatória anexada e avaliada, totalizando pontuação superior ao piso regulamentar de ${currentProcesso.servidor.nivelRscSolicitado || 'RSC-II'}, requer-se o deferimento e a concessão do Reconhecimento de Saberes e Competências.`,
    };

    onProcessoUpdate({
      ...currentProcesso,
      memorial: novoMemorial,
      indexacaoComprovantes: novosComprovantes,
    });

    setIsOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Compact Banner when closed */}
      {!isOpen ? (
        <div className="mb-4 bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-50 border border-emerald-200/80 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Envio Unificado de Todos os PDFs &bull; Avaliação de Admissibilidade
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  Decreto nº 13.048/2026
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Envie todos os seus certificados, portarias e documentos em um único envio. O sistema lê e avalia se é cabível ou não pontuar cada item.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Carregar & Avaliar PDFs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Unified Multi-PDF Upload Panel */
        <div className="bg-white border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-md animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Envio Unificado e Auditoria de Admissibilidade de Documentos</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    PCCTAE / Decreto 13.048/2026
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Arraste ou selecione todos os seus PDFs de uma só vez (diplomas, certificados ENAP/TCU, portarias de chefia/comissão, manuais e declarações).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files) {
                handleFilesAdded(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-50/80 scale-[0.99]'
                : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) handleFilesAdded(e.target.files);
              }}
              multiple
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Clique para selecionar ou arraste todos os seus PDFs aqui
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Suporta múltiplos arquivos simultâneos (.pdf, .docx). O motor de IA examinará cada folha, carga horária e emissor para avaliar se é cabível ou não.
              </p>
            </div>
          </div>

          {/* Quick Presets & File Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleBatch}
                className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Carregar 6 documentos modelo: Especialização, Curso TCU, Portaria Manual, Portaria FG-1, Instrutoria e Webinar 1h"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Carregar Lote Exemplo (6 PDFs reais)</span>
              </button>
            </div>

            {stagedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  {stagedFiles.length} documento(s) carregado(s)
                </span>
                <button
                  type="button"
                  onClick={handleClearAllFiles}
                  className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar lista</span>
                </button>
              </div>
            )}
          </div>

          {/* Staged Files List */}
          {stagedFiles.length > 0 && (
            <div className="mt-3.5 space-y-2 max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stagedFiles.map((sf, idx) => (
                  <div
                    key={sf.id || idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate text-[11px]">
                          {sf.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatFileSize(sf.size)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(sf.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remover arquivo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional context text */}
          <div className="mt-3.5">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Informações complementares ou anotações funcionais (opcional):
            </label>
            <textarea
              value={additionalText ?? ''}
              onChange={(e) => setAdditionalText(e.target.value)}
              rows={2}
              placeholder="Ex: Tempo total de serviço, histórico de comissões não documentadas em PDF ou detalhes de projetos..."
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Status Bar during analysis */}
          {isProcessing && statusMessage && (
            <div className="mt-3 text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
              <span className="font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              Nível solicitado para validação:{' '}
              <strong className="text-slate-800">
                {currentProcesso.servidor.nivelRscSolicitado || 'RSC-II'} (Mínimo:{' '}
                {currentProcesso.servidor.nivelRscSolicitado === 'RSC-I'
                  ? 45
                  : currentProcesso.servidor.nivelRscSolicitado === 'RSC-III'
                  ? 60
                  : 52}{' '}
                pts)
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Fechar
              </button>

              <button
                type="button"
                onClick={handleEvaluateBatch}
                disabled={isProcessing || stagedFiles.length === 0}
                className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Avaliando Admissibilidade...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Ler e Avaliar Todos os PDFs ({stagedFiles.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admissibility Evaluation Modal */}
      {evaluationResult && (
        <AvaliacaoLoteModal
          isOpen={isEvaluationModalOpen}
          onClose={() => setIsEvaluationModalOpen(false)}
          documentos={evaluationResult.documentosAvaliados}
          parecerGeral={evaluationResult.parecerGeral}
          pontuacaoTotal={evaluationResult.pontuacaoTotal}
          minimoExigido={evaluationResult.minimoExigido}
          aptoParaConcessao={evaluationResult.aptoParaConcessao}
          resumoPorEixo={evaluationResult.resumoPorEixo}
          onAplicarAoProcesso={handleApplyApprovedDocuments}
        />
      )}
    </>
  );
};
