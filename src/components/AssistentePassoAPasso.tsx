import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  BookOpen,
  Scale,
  ShieldCheck,
  Download,
  Info,
  X,
  HelpCircle,
} from 'lucide-react';
import { ProcessoRSC } from '../types';

interface AssistenteProps {
  processo: ProcessoRSC;
  activeTab: string;
  onNavigateTab: (tab: 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie') => void;
  onOpenExportModal: () => void;
}

interface StepValidation {
  id: number;
  title: string;
  tabKey: 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie';
  icon: any;
  isComplete: boolean;
  statusText: string;
  summary: string;
  checklist: Array<{ label: string; done: boolean; tip: string }>;
}

export const AssistentePassoAPasso: React.FC<AssistenteProps> = ({
  processo,
  activeTab,
  onNavigateTab,
  onOpenExportModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const { servidor, memorial, indexacaoComprovantes, declaracoes, resumoPontuacao } = processo;

  // Validation Rules
  const hasNome = Boolean(servidor.nome && servidor.nome.trim().length > 3);
  const hasSiape = Boolean(servidor.matriculaSiape && servidor.matriculaSiape.trim().length >= 5);
  const hasCargo = Boolean(servidor.cargo && servidor.cargo.trim().length > 0);
  const hasEmail = Boolean(servidor.email && servidor.email.includes('@'));
  const hasNivel = Boolean(servidor.nivelRscSolicitado);
  const isStep1Complete = hasNome && hasSiape && hasCargo && hasNivel;

  const hasTrajetoria = Boolean(memorial.apresentacaoTrajetoria && memorial.apresentacaoTrajetoria.trim().length > 50);
  const hasSaberes = Boolean(memorial.desenvolvimentoSaberes && memorial.desenvolvimentoSaberes.trim().length > 50);
  const hasImpacto = Boolean(memorial.impactoInstitucional && memorial.impactoInstitucional.trim().length > 30);
  const hasConclusao = Boolean(memorial.conclusao && memorial.conclusao.trim().length > 20);
  const isStep2Complete = hasTrajetoria && hasSaberes && hasImpacto && hasConclusao;

  const comprovantesCount = indexacaoComprovantes ? indexacaoComprovantes.length : 0;
  const hasMinComprovantes = comprovantesCount >= 1;
  const isAptoPontos = Boolean(resumoPontuacao?.aptoParaConcessao);
  const hasValidDocs = (indexacaoComprovantes || []).every((c) => c.documentoCorrespondente && c.documentoCorrespondente.trim().length > 0);
  const isStep3Complete = hasMinComprovantes && isAptoPontos && hasValidDocs;

  const hasVeracidade = Boolean(declaracoes.declaracaoVeracidade && declaracoes.declaracaoVeracidade.length > 10);
  const hasConformidade = Boolean(declaracoes.declaracaoConformidade && declaracoes.declaracaoConformidade.length > 10);
  const hasNaoAcumulo = Boolean(declaracoes.declaracaoNaoAcumulo && declaracoes.declaracaoNaoAcumulo.length > 10);
  const isStep4Complete = hasVeracidade && hasConformidade && hasNaoAcumulo;

  const isDossieReady = isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete;

  const steps: StepValidation[] = [
    {
      id: 1,
      title: '1. Requerimento & Identificação',
      tabKey: 'requerimento',
      icon: FileCheck2,
      isComplete: isStep1Complete,
      statusText: isStep1Complete ? 'Dados Cadastrais Preenchidos' : 'Campos Obrigatórios Pendentes',
      summary: 'Informe nome completo, matrícula SIAPE, cargo e o nível de RSC pretendido.',
      checklist: [
        { label: 'Nome Completo e Matrícula SIAPE', done: hasNome && hasSiape, tip: 'Essencial para a autuação e assentamento na DGP.' },
        { label: 'Cargo e Nível de Enquadramento no PCCTAE', done: hasCargo, tip: 'Classes A a E conforme a Lei nº 11.091/2005.' },
        { label: `Nível de RSC Selecionado (${servidor.nivelRscSolicitado || 'RSC-V'})`, done: hasNivel, tip: 'Define a pontuação mínima exigida na avaliação.' },
        { label: 'E-mail Institucional e Lotação', done: hasEmail, tip: 'Para comunicações oficiais da Comissão.' },
      ],
    },
    {
      id: 2,
      title: '2. Memorial Descritivo (ABNT)',
      tabKey: 'memorial',
      icon: BookOpen,
      isComplete: isStep2Complete,
      statusText: isStep2Complete ? 'Memorial Concluído em 4 Seções' : 'Seções do Memorial Incompletas',
      summary: 'Redija o texto circunstanciado contextualizando sua trajetória e os saberes adquiridos.',
      checklist: [
        { label: 'Apresentação e Trajetória Funcional', done: hasTrajetoria, tip: 'Relate o histórico profissional e ingresso no IFS.' },
        { label: 'Desenvolvimento de Saberes e Competências', done: hasSaberes, tip: 'Conecte as atividades aos Anexos I a VI da Resolução 394/2026.' },
        { label: 'Impacto Institucional e na Sociedade', done: hasImpacto, tip: 'Demonstre a relevância dos trabalhos para o IFS.' },
        { label: 'Conclusão e Requerimento Formal', done: hasConclusao, tip: 'Finalize solicitando a concessão do RSC no nível pretendido.' },
      ],
    },
    {
      id: 3,
      title: '3. Comprovantes & Indexação SEI',
      tabKey: 'comprovantes',
      icon: Scale,
      isComplete: isStep3Complete,
      statusText: isStep3Complete ? `Apto (${resumoPontuacao.totalPontos.toFixed(1).replace('.0', '')} pts)` : 'Pontuação Insuficiente',
      summary: 'Cadastre portarias, atestados e documentos probatórios com referência às folhas do SEI.',
      checklist: [
        { label: `Mínimo de ${resumoPontuacao.minimoExigido} pontos atingidos (Atual: ${resumoPontuacao.totalPontos.toFixed(1).replace('.0', '')} pts)`, done: isAptoPontos, tip: `Para ${servidor.nivelRscSolicitado}, a meta é de no mínimo ${resumoPontuacao.minimoExigido} pontos.` },
        { label: `Pelo menos 1 comprovante registrado (${comprovantesCount} cadastrados)`, done: hasMinComprovantes, tip: 'Cadastre portarias e certidões no quadro analítico.' },
        { label: 'Indicação do Documento SEI e Fls. em todos os itens', done: hasValidDocs, tip: 'Facilita a conferência pela banca examinadora da CRSC.' },
      ],
    },
    {
      id: 4,
      title: '4. Declarações Legais',
      tabKey: 'declaracoes',
      icon: ShieldCheck,
      isComplete: isStep4Complete,
      statusText: isStep4Complete ? 'Termos e Declarações Validados' : 'Declarações Pendentes',
      summary: 'Confirme as declarações de veracidade, conformidade com o Decreto e vedação a bis in idem.',
      checklist: [
        { label: 'Declaração de Veracidade e Autenticidade (Art. 299 CP)', done: hasVeracidade, tip: 'Sob as penas da lei e do regime jurídico único.' },
        { label: 'Declaração de Não Ocorrência de Bis in Idem (Art. 7º, § 2º)', done: hasNaoAcumulo, tip: 'Garante que os títulos não foram usados em IQ.' },
        { label: 'Declaração de Conformidade com o Decreto 13.048/2026', done: hasConformidade, tip: 'Atesta observância às normas da carreira PCCTAE.' },
      ],
    },
  ];

  const completedCount = steps.filter((s) => s.isComplete).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl border border-slate-700 shadow-sm p-3.5 mb-4 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Assistente de Primeiros Passos
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full">
                {completedCount} de {steps.length} Blocos Prontos ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Guia estruturado para garantir que nenhum requisito obrigatório da Resolução 394/2026 seja esquecido
            </p>
          </div>
        </div>

        {/* Action / Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-600 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isOpen ? 'Recolher Assistente' : 'Abrir Passo a Passo'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/90 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Mini Step Badges Row (Always Visible) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800">
        {steps.map((step, idx) => {
          const isCurrentTab = activeTab === step.tabKey;
          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStepIndex(idx);
                onNavigateTab(step.tabKey);
                if (!isOpen) setIsOpen(true);
              }}
              className={`p-2 rounded-lg text-left transition-all flex items-center justify-between gap-1.5 border ${
                isCurrentTab
                  ? 'bg-slate-800 border-emerald-400/60 shadow-xs'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-300 truncate">
                  {step.title}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {step.statusText}
                </div>
              </div>
              {step.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Interactive Wizard Guide */}
      {isOpen && (
        <div className="mt-4 pt-3 border-t border-slate-700 bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Left: Step Description and Checklist */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">
                    Passo {activeStep.id} de {steps.length}
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {activeStep.title}
                  </h3>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                    activeStep.isComplete
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {activeStep.isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{activeStep.isComplete ? 'Etapa Cumprida' : 'Ajustes Necessários'}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStep.summary}
              </p>

              {/* Checklist items */}
              <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Checklist de Validação Formal:
                </span>
                <div className="space-y-1.5">
                  {activeStep.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-amber-400/80 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        </div>
                      )}
                      <div>
                        <span className={`font-medium ${item.done ? 'text-slate-200' : 'text-amber-200'}`}>
                          {item.label}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Step Navigation Actions */}
            <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Navegação Rápida
              </span>

              <button
                onClick={() => onNavigateTab(activeStep.tabKey)}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Preencher na Aba</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex gap-1.5 pt-1">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => {
                    const next = Math.max(0, activeStepIndex - 1);
                    setActiveStepIndex(next);
                    onNavigateTab(steps[next].tabKey);
                  }}
                  className="flex-1 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 rounded text-xs font-semibold transition-colors"
                >
                  Anterior
                </button>
                <button
                  disabled={activeStepIndex === steps.length - 1}
                  onClick={() => {
                    const next = Math.min(steps.length - 1, activeStepIndex + 1);
                    setActiveStepIndex(next);
                    onNavigateTab(steps[next].tabKey);
                  }}
                  className="flex-1 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 rounded text-xs font-semibold transition-colors"
                >
                  Próximo
                </button>
              </div>

              {isDossieReady && (
                <div className="pt-2 mt-1 border-t border-slate-700">
                  <button
                    onClick={onOpenExportModal}
                    className="w-full py-2 px-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md animate-pulse"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Dossiê Pronto! Exportar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
