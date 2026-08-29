import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  BookOpen,
  Scale,
  ShieldCheck,
  Download,
  Filter,
  Check,
  TrendingUp,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  Award,
  Trash2,
} from 'lucide-react';
import { ProcessoRSC, NivelRSC } from '../types';
import { auditarComprovantesAltaPontuacao, LIMIAR_ALTA_PONTUACAO } from '../utils/memorialCrossCheck';

interface DashboardExecucaoProps {
  processo: ProcessoRSC;
  activeTab: string;
  onNavigateTab: (tab: 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie') => void;
  onOpenExportModal: () => void;
  onOpenClearModal?: () => void;
}

export type SeveridadePendencia = 'CRITICA' | 'IMPORTANTE' | 'RECOMENDACAO';

export interface ItemPendencia {
  id: string;
  blocoId: 1 | 2 | 3 | 4;
  blocoNome: string;
  tabKey: 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie';
  titulo: string;
  descricao: string;
  severidade: SeveridadePendencia;
  referenciaLegal: string;
  acaoTexto: string;
}

export interface BlocoStatusInfo {
  blocoId: 1 | 2 | 3 | 4;
  nome: string;
  subtitulo: string;
  tabKey: 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie';
  icon: any;
  totalCampos: number;
  camposPreenchidos: number;
  percentual: number;
  isComplete: boolean;
  pendenciasCount: number;
}

export const DashboardExecucao: React.FC<DashboardExecucaoProps> = ({
  processo,
  activeTab,
  onNavigateTab,
  onOpenExportModal,
  onOpenClearModal,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [filtroSeveridade, setFiltroSeveridade] = useState<string>('todos');
  const [filtroBloco, setFiltroBloco] = useState<number | 'todos'>('todos');

  const { servidor, memorial, indexacaoComprovantes = [], declaracoes, resumoPontuacao } = processo;

  // Analysis of all 4 blocks and extraction of pending items
  const { blocosStatus, pendencias, progressPercent, totalObrigatorios, totalPreenchidos } = useMemo(() => {
    const listPendencias: ItemPendencia[] = [];

    // ==========================================
    // BLOCO 1: REQUERIMENTO & IDENTIFICAÇÃO (7 critérios principais)
    // ==========================================
    let b1Preenchidos = 0;
    const b1Total = 7;

    // 1. Nome
    if (servidor.nome && servidor.nome.trim().length >= 4) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-nome',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Nome Completo do Servidor Requerente',
        descricao: 'O nome do servidor é obrigatório para identificação no processo SEI e publicação em Boletim de Serviço.',
        severidade: 'CRITICA',
        referenciaLegal: 'Decreto nº 13.048/2026, Art. 4º',
        acaoTexto: 'Informar Nome',
      });
    }

    // 2. SIAPE
    if (servidor.matriculaSiape && servidor.matriculaSiape.trim().length >= 5) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-siape',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Matrícula SIAPE não informada',
        descricao: 'Necessária para conferência funcional nos assentamentos individuais da DGP/IFS.',
        severidade: 'CRITICA',
        referenciaLegal: 'Lei nº 11.091/2005 e Decreto 13.048/2026',
        acaoTexto: 'Informar SIAPE',
      });
    }

    // 3. Cargo
    if (servidor.cargo && servidor.cargo.trim().length > 2) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-cargo',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Cargo Efetivo no PCCTAE',
        descricao: 'Especifique o cargo técnico-administrativo ocupado no Instituto Federal de Sergipe.',
        severidade: 'CRITICA',
        referenciaLegal: 'Lei nº 11.091/2005',
        acaoTexto: 'Informar Cargo',
      });
    }

    // 4. Classe / Nível
    if (servidor.nivelCargo && servidor.nivelCargo.trim().length > 0) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-nivel-cargo',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Nível de Classificação (Classe A, B, C, D ou E)',
        descricao: 'Selecione o nível de classificação do cargo para verificação dos requisitos de titulação.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Estrutura PCCTAE',
        acaoTexto: 'Definir Classe',
      });
    }

    // 5. Lotação / Campus
    if (servidor.lotacao && servidor.lotacao.trim().length > 2) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-lotacao',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Campus e Setor de Lotação',
        descricao: 'Informe o campus ou reitoria e o setor de exercício de suas atividades.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Portaria de Lotação IFS',
        acaoTexto: 'Informar Lotação',
      });
    }

    // 6. E-mail Institucional
    if (servidor.email && servidor.email.includes('@')) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-email',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'E-mail Institucional (@ifs.edu.br)',
        descricao: 'Canal oficial para notificações da Comissão Permanente de RSC.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Comunicação Oficial SEI',
        acaoTexto: 'Preencher E-mail',
      });
    }

    // 7. Nível RSC Solicitado
    if (servidor.nivelRscSolicitado) {
      b1Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b1-nivel-rsc',
        blocoId: 1,
        blocoNome: 'Bloco 1 - Requerimento',
        tabKey: 'requerimento',
        titulo: 'Nível de RSC Requerido (RSC-I a RSC-VI)',
        descricao: 'Indique expressamente o nível pleiteado e o percentual de retribuição correspondente.',
        severidade: 'CRITICA',
        referenciaLegal: 'Resolução CS/IFS nº 394/2026, Art. 5º',
        acaoTexto: 'Selecionar Nível',
      });
    }

    // ==========================================
    // BLOCO 2: MEMORIAL DESCRITIVO CIRCUNSTANCIADO (4 seções)
    // ==========================================
    let b2Preenchidos = 0;
    const b2Total = 4;

    // 1. Apresentação e Trajetória
    if (memorial.apresentacaoTrajetoria && memorial.apresentacaoTrajetoria.trim().length >= 50) {
      b2Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b2-trajetoria',
        blocoId: 2,
        blocoNome: 'Bloco 2 - Memorial Descritivo',
        tabKey: 'memorial',
        titulo: 'Apresentação e Trajetória Funcional Incompleta',
        descricao: 'O memorial deve conter relato histórico das funções desempenhadas e ingresso na carreira (mínimo recomendado de 50 caracteres).',
        severidade: 'CRITICA',
        referenciaLegal: 'Resolução CS/IFS nº 394/2026, Art. 6º',
        acaoTexto: 'Compor Trajetória',
      });
    }

    // 2. Desenvolvimento de Saberes
    if (memorial.desenvolvimentoSaberes && memorial.desenvolvimentoSaberes.trim().length >= 50) {
      b2Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b2-saberes',
        blocoId: 2,
        blocoNome: 'Bloco 2 - Memorial Descritivo',
        tabKey: 'memorial',
        titulo: 'Desenvolvimento de Saberes e Competências',
        descricao: 'Descreva a correlação das atividades práticas com os critérios dos Anexos I a VI da Resolução 394/2026.',
        severidade: 'CRITICA',
        referenciaLegal: 'Decreto nº 13.048/2026, Art. 6º',
        acaoTexto: 'Descrever Saberes',
      });
    }

    // 3. Impacto Institucional
    if (memorial.impactoInstitucional && memorial.impactoInstitucional.trim().length >= 30) {
      b2Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b2-impacto',
        blocoId: 2,
        blocoNome: 'Bloco 2 - Memorial Descritivo',
        tabKey: 'memorial',
        titulo: 'Impacto Institucional e Social',
        descricao: 'Evidencie os ganhos para o IFS, para o ensino, pesquisa, extensão ou gestão pública.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Resolução CS/IFS nº 394/2026, Art. 6º, § 1º',
        acaoTexto: 'Inserir Impacto',
      });
    }

    // 4. Conclusão e Pedido
    if (memorial.conclusao && memorial.conclusao.trim().length >= 20) {
      b2Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b2-conclusao',
        blocoId: 2,
        blocoNome: 'Bloco 2 - Memorial Descritivo',
        tabKey: 'memorial',
        titulo: 'Conclusão e Requerimento Formal',
        descricao: 'Finalize o memorial formalizando o pedido de homologação do RSC no nível pretendido.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Normas ABNT e Resolução 394/2026',
        acaoTexto: 'Redigir Conclusão',
      });
    }

    // ==========================================
    // BLOCO 3: INDEXAÇÃO DE COMPROVANTES & PONTUAÇÃO (5 critérios)
    // ==========================================
    let b3Preenchidos = 0;
    const b3Total = 5;

    // Auditoria de Alta Pontuação x Memorial Descritivo
    const auditoriaComprovantes = auditarComprovantesAltaPontuacao(indexacaoComprovantes, memorial);

    // 1. Pelo menos 1 comprovante cadastrado
    const compCount = indexacaoComprovantes.length;
    if (compCount >= 1) {
      b3Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b3-sem-comprovantes',
        blocoId: 3,
        blocoNome: 'Bloco 3 - Indexação de Comprovantes',
        tabKey: 'comprovantes',
        titulo: 'Nenhum Documento Comprobatório Cadastrado',
        descricao: 'É obrigatório anexar e indexar portarias, certificados, atestados ou contratos que comprovem os pontos declarados.',
        severidade: 'CRITICA',
        referenciaLegal: 'Resolução CS/IFS nº 394/2026, Anexos I a VI',
        acaoTexto: 'Cadastrar Comprovantes',
      });
    }

    // 2. Pontuação Mínima Atingida
    const pontosAtuais = resumoPontuacao.totalPontos || 0;
    const minimo = resumoPontuacao.minimoExigido || 52;
    if (resumoPontuacao.aptoParaConcessao || pontosAtuais >= minimo) {
      b3Preenchidos++;
    } else {
      const faltam = (minimo - pontosAtuais).toFixed(1).replace('.0', '');
      listPendencias.push({
        id: 'b3-pontuacao-insuficiente',
        blocoId: 3,
        blocoNome: 'Bloco 3 - Indexação de Comprovantes',
        tabKey: 'comprovantes',
        titulo: `Pontuação Insuficiente para ${servidor.nivelRscSolicitado || 'o nível selecionado'}`,
        descricao: `Pontuação atual: ${pontosAtuais.toFixed(1).replace('.0', '')} pts. Faltam ${faltam} pontos para atingir o mínimo legal de ${minimo} pts.`,
        severidade: 'CRITICA',
        referenciaLegal: `Resolução CS/IFS nº 394/2026, Art. 5º (Mín. ${minimo} pts)`,
        acaoTexto: 'Adicionar Pontos',
      });
    }

    // 3. Documentação SEI e Folhas preenchidas em todos os itens
    const invalidDocs = indexacaoComprovantes.filter(
      (c) => !c.documentoCorrespondente || c.documentoCorrespondente.trim().length < 3
    );
    if (compCount > 0 && invalidDocs.length === 0) {
      b3Preenchidos++;
    } else if (compCount > 0 && invalidDocs.length > 0) {
      listPendencias.push({
        id: 'b3-docs-incompletos',
        blocoId: 3,
        blocoNome: 'Bloco 3 - Indexação de Comprovantes',
        tabKey: 'comprovantes',
        titulo: `${invalidDocs.length} Comprovante(s) sem indicação de Documento SEI ou Folhas`,
        descricao: 'Todos os itens da tabela devem indicar o anexo correspondente e as páginas no SEI (ex: Anexo 02 - Portaria nº 123/2024, Fls. 12-15).',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Padrão Probatório CRSC/IFS',
        acaoTexto: 'Ajustar Documentos',
      });
    }

    // 4. Descrição detalhada da atividade
    const invalidDescriptions = indexacaoComprovantes.filter(
      (c) => !c.descricaoAtividade || c.descricaoAtividade.trim().length < 5
    );
    if (compCount > 0 && invalidDescriptions.length === 0) {
      b3Preenchidos++;
    } else if (compCount > 0 && invalidDescriptions.length > 0) {
      listPendencias.push({
        id: 'b3-descricoes-vazias',
        blocoId: 3,
        blocoNome: 'Bloco 3 - Indexação de Comprovantes',
        tabKey: 'comprovantes',
        titulo: `${invalidDescriptions.length} Atividade(s) sem descrição detalhada`,
        descricao: 'Descreva a função ou encargo comprovado para permitir a correta aferição dos critérios pela banca avaliadora.',
        severidade: 'IMPORTANTE',
        referenciaLegal: 'Critérios de Avaliação',
        acaoTexto: 'Completar Descrições',
      });
    }

    // 5. Justificativa Obrigatória / Correlação de Itens de Alta Pontuação (Exigência Crítica para Submissão)
    if (compCount > 0 && auditoriaComprovantes.totalCriticos === 0) {
      b3Preenchidos++;
    } else if (compCount > 0 && auditoriaComprovantes.totalCriticos > 0) {
      listPendencias.push({
        id: 'b3-alta-pontuacao-sem-memorial',
        blocoId: 3,
        blocoNome: 'Bloco 3 - Indexação de Comprovantes',
        tabKey: 'comprovantes',
        titulo: `${auditoriaComprovantes.totalCriticos} Comprovante(s) de Alta Pontuação sem Justificativa/Memorial`,
        descricao: `A Resolução CS/IFS nº 394/2026 (Art. 6º, § 2º) exige justificativa formal ou detalhamento no Memorial para itens com pontuação ≥ ${LIMIAR_ALTA_PONTUACAO.toFixed(1).replace('.', ',')} pts antes da submissão.`,
        severidade: 'CRITICA',
        referenciaLegal: 'Resolução CS/IFS nº 394/2026, Art. 6º, § 2º',
        acaoTexto: 'Sanar no Bloco 3',
      });
    } else if (compCount === 0) {
      // Quando não há comprovantes, não duplica pendência crítica além da de falta de comprovantes
      b3Preenchidos++;
    }

    // ==========================================
    // BLOCO 4: DECLARAÇÕES LEGAIS DE CONFORMIDADE (3 declarações)
    // ==========================================
    let b4Preenchidos = 0;
    const b4Total = 3;

    // 1. Veracidade
    if (declaracoes.declaracaoVeracidade && declaracoes.declaracaoVeracidade.length > 15) {
      b4Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b4-veracidade',
        blocoId: 4,
        blocoNome: 'Bloco 4 - Declarações Legais',
        tabKey: 'declaracoes',
        titulo: 'Declaração de Veracidade e Autenticidade não confirmada',
        descricao: 'O requerente deve atestar a autenticidade dos documentos sob as penas do Art. 299 do Código Penal.',
        severidade: 'CRITICA',
        referenciaLegal: 'Art. 299 do Código Penal e Lei nº 8.112/1990',
        acaoTexto: 'Aceitar Termo',
      });
    }

    // 2. Conformidade Decreto 13.048/2026
    if (declaracoes.declaracaoConformidade && declaracoes.declaracaoConformidade.length > 15) {
      b4Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b4-conformidade',
        blocoId: 4,
        blocoNome: 'Bloco 4 - Declarações Legais',
        tabKey: 'declaracoes',
        titulo: 'Declaração de Conformidade com o Decreto nº 13.048/2026',
        descricao: 'Confirmação do cumprimento das diretrizes de desenvolvimento na carreira do PCCTAE.',
        severidade: 'CRITICA',
        referenciaLegal: 'Decreto Presidencial nº 13.048/2026',
        acaoTexto: 'Atestar Conformidade',
      });
    }

    // 3. Vedação a Bis in Idem (Não Acúmulo)
    if (declaracoes.declaracaoNaoAcumulo && declaracoes.declaracaoNaoAcumulo.length > 15) {
      b4Preenchidos++;
    } else {
      listPendencias.push({
        id: 'b4-bis-in-idem',
        blocoId: 4,
        blocoNome: 'Bloco 4 - Declarações Legais',
        tabKey: 'declaracoes',
        titulo: 'Declaração de Não Ocorrência de Bis in Idem (Art. 7º, § 2º)',
        descricao: 'Garante que nenhum título utilizado para concessão de Incentivo à Qualificação (IQ) está sendo reutilizado no RSC.',
        severidade: 'CRITICA',
        referenciaLegal: 'Decreto nº 13.048/2026, Art. 7º, § 2º',
        acaoTexto: 'Confirmar Não-Acúmulo',
      });
    }

    // Status per block
    const bStatus: BlocoStatusInfo[] = [
      {
        blocoId: 1,
        nome: 'Bloco 1: Requerimento',
        subtitulo: 'Identificação e Enquadramento',
        tabKey: 'requerimento',
        icon: FileCheck2,
        totalCampos: b1Total,
        camposPreenchidos: b1Preenchidos,
        percentual: Math.round((b1Preenchidos / b1Total) * 100),
        isComplete: b1Preenchidos === b1Total,
        pendenciasCount: listPendencias.filter((p) => p.blocoId === 1).length,
      },
      {
        blocoId: 2,
        nome: 'Bloco 2: Memorial',
        subtitulo: 'Trajetória e Saberes (ABNT)',
        tabKey: 'memorial',
        icon: BookOpen,
        totalCampos: b2Total,
        camposPreenchidos: b2Preenchidos,
        percentual: Math.round((b2Preenchidos / b2Total) * 100),
        isComplete: b2Preenchidos === b2Total,
        pendenciasCount: listPendencias.filter((p) => p.blocoId === 2).length,
      },
      {
        blocoId: 3,
        nome: 'Bloco 3: Comprovantes',
        subtitulo: 'Resolução 394/2026 e SEI',
        tabKey: 'comprovantes',
        icon: Scale,
        totalCampos: b3Total,
        camposPreenchidos: b3Preenchidos,
        percentual: Math.round((b3Preenchidos / b3Total) * 100),
        isComplete: b3Preenchidos === b3Total,
        pendenciasCount: listPendencias.filter((p) => p.blocoId === 3).length,
      },
      {
        blocoId: 4,
        nome: 'Bloco 4: Declarações',
        subtitulo: 'Conformidade e Bis in Idem',
        tabKey: 'declaracoes',
        icon: ShieldCheck,
        totalCampos: b4Total,
        camposPreenchidos: b4Preenchidos,
        percentual: Math.round((b4Preenchidos / b4Total) * 100),
        isComplete: b4Preenchidos === b4Total,
        pendenciasCount: listPendencias.filter((p) => p.blocoId === 4).length,
      },
    ];

    const sumTotal = b1Total + b2Total + b3Total + b4Total;
    const sumPreenchidos = b1Preenchidos + b2Preenchidos + b3Preenchidos + b4Preenchidos;
    const globalPercent = Math.round((sumPreenchidos / sumTotal) * 100);

    return {
      blocosStatus: bStatus,
      pendencias: listPendencias,
      progressPercent: globalPercent,
      totalObrigatorios: sumTotal,
      totalPreenchidos: sumPreenchidos,
    };
  }, [servidor, memorial, indexacaoComprovantes, declaracoes, resumoPontuacao]);

  // Filtering of active pending items
  const filteredPendencias = useMemo(() => {
    return pendencias.filter((item) => {
      if (filtroSeveridade !== 'todos' && item.severidade !== filtroSeveridade) {
        return false;
      }
      if (filtroBloco !== 'todos' && item.blocoId !== filtroBloco) {
        return false;
      }
      return true;
    });
  }, [pendencias, filtroSeveridade, filtroBloco]);

  const criticasCount = pendencias.filter((p) => p.severidade === 'CRITICA').length;
  const importantesCount = pendencias.filter((p) => p.severidade === 'IMPORTANTE').length;
  const recomendacoesCount = pendencias.filter((p) => p.severidade === 'RECOMENDACAO').length;

  const isDossieReady = pendencias.length === 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-5 space-y-4">
      {/* Header Row: Title, Global Progress, and Expand/Collapse */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Dashboard de Execução &amp; Conformidade Processual
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isDossieReady
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : criticasCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-teal-50 text-teal-900 border-teal-300'
                }`}
              >
                {isDossieReady ? 'Dossiê 100% Conforme' : `${pendencias.length} Pendência(s)`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Validação integral dos 4 Blocos em estrita observância ao Decreto nº 13.048/2026 e Resolução CS/IFS nº 394/2026
            </p>
          </div>
        </div>

        {/* Global Progress Gauge & Actions */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-slate-700">Progresso Global:</span>
              <span
                className={`text-sm font-black ${
                  progressPercent === 100
                    ? 'text-emerald-700'
                    : progressPercent >= 70
                    ? 'text-teal-700'
                    : 'text-amber-700'
                }`}
              >
                {progressPercent}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {totalPreenchidos} de {totalObrigatorios} requisitos concluídos
            </span>
          </div>

          {/* Export, Clear or Toggle Button */}
          <div className="flex items-center gap-1.5">
            {onOpenClearModal && (
              <button
                type="button"
                onClick={onOpenClearModal}
                className="text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                title="Limpar todos os campos e reiniciar o requerimento em branco"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}

            {isDossieReady ? (
              <button
                onClick={onOpenExportModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Dossiê</span>
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{isExpanded ? 'Recolher Pendências' : 'Ver Pendências'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Progress Linear Bar */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              progressPercent === 100
                ? 'bg-emerald-600'
                : progressPercent >= 70
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                : 'bg-gradient-to-r from-amber-500 to-teal-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Blocks Executive Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {blocosStatus.map((bloco) => {
          const Icon = bloco.icon;
          const isCurrentTab = activeTab === bloco.tabKey;

          return (
            <div
              key={bloco.blocoId}
              onClick={() => onNavigateTab(bloco.tabKey)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                isCurrentTab
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500/30'
                  : bloco.isComplete
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/70'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`p-1 rounded-md ${
                      isCurrentTab
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : bloco.isComplete
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrentTab ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {bloco.nome.split(': ')[1] || bloco.nome}
                  </span>
                </div>

                {bloco.isComplete ? (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isCurrentTab ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  />
                ) : (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isCurrentTab
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {bloco.pendenciasCount} pend.
                  </span>
                )}
              </div>

              {/* Progress and Numbers */}
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className={isCurrentTab ? 'text-slate-300' : 'text-slate-500'}>
                  {bloco.camposPreenchidos}/{bloco.totalCampos} itens
                </span>
                <span
                  className={`font-black ${
                    isCurrentTab
                      ? 'text-emerald-400'
                      : bloco.isComplete
                      ? 'text-emerald-700'
                      : 'text-slate-700'
                  }`}
                >
                  {bloco.percentual}%
                </span>
              </div>

              {/* Mini progress bar inside card */}
              <div
                className={`w-full rounded-full h-1 overflow-hidden ${
                  isCurrentTab ? 'bg-slate-700' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    bloco.isComplete
                      ? 'bg-emerald-500'
                      : isCurrentTab
                      ? 'bg-teal-400'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${bloco.percentual}%` }}
                />
              </div>

              {/* Subtitle / Tip */}
              <div
                className={`text-[10px] mt-1.5 truncate ${
                  isCurrentTab ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {bloco.subtitulo}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Active Pending Items Panel */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 space-y-3">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filtrar:</span>
              </span>

              {/* Severity Chips */}
              <button
                onClick={() => setFiltroSeveridade('todos')}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                  filtroSeveridade === 'todos'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                Todas ({pendencias.length})
              </button>

              {criticasCount > 0 && (
                <button
                  onClick={() => setFiltroSeveridade('CRITICA')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    filtroSeveridade === 'CRITICA'
                      ? 'bg-rose-700 text-white'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  <span>Críticas ({criticasCount})</span>
                </button>
              )}

              {importantesCount > 0 && (
                <button
                  onClick={() => setFiltroSeveridade('IMPORTANTE')}
                  className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 ${
                    filtroSeveridade === 'IMPORTANTE'
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Importantes ({importantesCount})</span>
                </button>
              )}
            </div>

            {/* Block Filter Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Por Bloco:</span>
              <select
                value={filtroBloco}
                onChange={(e) => {
                  const val = e.target.value;
                  setFiltroBloco(val === 'todos' ? 'todos' : Number(val) as any);
                }}
                className="text-[11px] p-1 bg-white border border-slate-300 rounded-md outline-none font-medium text-slate-700"
              >
                <option value="todos">Todos os Blocos (1 a 4)</option>
                <option value="1">Bloco 1 (Requerimento)</option>
                <option value="2">Bloco 2 (Memorial)</option>
                <option value="3">Bloco 3 (Comprovantes)</option>
                <option value="4">Bloco 4 (Declarações)</option>
              </select>
            </div>
          </div>

          {/* Pending Items List or All Clear Celebration State */}
          {pendencias.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Parabéns! Nenhum campo ou requisito pendente.
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5 max-w-lg mx-auto">
                  Todos os dados de identificação, as 4 seções do memorial descritivo, os comprovantes indexados e as declarações de conformidade legal atendem às exigências da Resolução CS/IFS nº 394/2026.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={onOpenExportModal}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Dossiê Consolidado (SEI / PDF / Markdown)</span>
                </button>
              </div>
            </div>
          ) : filteredPendencias.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              Nenhuma pendência encontrada para os filtros selecionados.
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredPendencias.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    item.severidade === 'CRITICA'
                      ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/80'
                      : item.severidade === 'IMPORTANTE'
                      ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50/80'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  {/* Left info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.severidade === 'CRITICA'
                            ? 'bg-rose-200 text-rose-900'
                            : item.severidade === 'IMPORTANTE'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {item.severidade === 'CRITICA' ? 'Crítico / Bloqueante' : 'Importante'}
                      </span>

                      <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {item.blocoNome}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.referenciaLegal}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">
                      {item.titulo}
                    </h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>

                  {/* Right Action Button */}
                  <button
                    onClick={() => onNavigateTab(item.tabKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer ${
                      item.severidade === 'CRITICA'
                        ? 'bg-rose-700 hover:bg-rose-800 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{item.acaoTexto}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
