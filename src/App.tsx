import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { UploadAndExtractionPanel } from './components/UploadAndExtractionPanel';
import { ResumoPontuacaoCard } from './components/ResumoPontuacaoCard';
import { Bloco1Requerimento } from './components/Bloco1Requerimento';
import { Bloco2Declaracoes } from './components/Bloco2Declaracoes';
import { Bloco3Memorial } from './components/Bloco3Memorial';
import { Bloco4Indexacao } from './components/Bloco4Indexacao';
import { DossieSeiView } from './components/DossieSeiView';
import { DecretoInfoModal } from './components/DecretoInfoModal';
import { ExportModal } from './components/ExportModal';
import { AssistentePassoAPasso } from './components/AssistentePassoAPasso';
import { ProcessoRSC, ServidorInfo, DeclaracoesConformidade, MemorialDescritivo, ComprovanteItem, NivelRSC } from './types';
import { mockDossiers } from './data/mockDossiers';
import { Copy, Check, Eye, Layout } from 'lucide-react';
import { generateSeiFormattedText, copySeiBlockToClipboard } from './utils/seiClipboard';

type ActiveTabType = 'requerimento' | 'memorial' | 'comprovantes' | 'declaracoes' | 'dossie';

export default function App() {
  const [processo, setProcesso] = useState<ProcessoRSC>(mockDossiers[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDecretoModalOpen, setIsDecretoModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('requerimento');
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');

  // Recalculate score breakdown when items or desired level change
  const currentProcessoWithRecalc = useMemo(() => {
    const items = processo.indexacaoComprovantes || [];
    let e1 = 0, e2 = 0, e3 = 0, e4 = 0, e5 = 0, e6 = 0;
    const distinctCriteria = new Set<string>();

    items.forEach((item) => {
      const pts = Number(item.pontuacaoAtribuida) || 0;
      if (item.eixo.startsWith('I -')) e1 += pts;
      else if (item.eixo.startsWith('II -')) e2 += pts;
      else if (item.eixo.startsWith('III -')) e3 += pts;
      else if (item.eixo.startsWith('IV -')) e4 += pts;
      else if (item.eixo.startsWith('V -')) e5 += pts;
      else if (item.eixo.startsWith('VI -')) e6 += pts;

      if (pts > 0 && item.itemCriterio) {
        distinctCriteria.add(`${item.eixo}-${item.itemCriterio}`);
      }
    });

    const total = e1 + e2 + e3 + e4 + e5 + e6;
    const nivel = processo.servidor.nivelRscSolicitado || 'RSC-V';

    const minExigidoMap: Record<string, { min: number; criterios: number }> = {
      'RSC-I': { min: 10, criterios: 2 },
      'RSC-II': { min: 15, criterios: 3 },
      'RSC-III': { min: 25, criterios: 4 },
      'RSC-IV': { min: 30, criterios: 4 },
      'RSC-V': { min: 52, criterios: 5 },
      'RSC-VI': { min: 75, criterios: 6 },
    };

    const targetConfig = minExigidoMap[nivel] || { min: 52, criterios: 5 };
    const minExigido = targetConfig.min;
    const minCriterios = targetConfig.criterios;
    const criteriosCount = distinctCriteria.size;

    const apto = total >= minExigido;
    const bancoExcedente = Math.max(0, total - minExigido);

    return {
      ...processo,
      resumoPontuacao: {
        totalPontos: total,
        minimoExigido: minExigido,
        minimoCriteriosExigidos: minCriterios,
        criteriosUtilizados: criteriosCount,
        bancoPontosExcedente: bancoExcedente,
        aptoParaConcessao: apto,
        porEixo: {
          eixoI: e1,
          eixoII: e2,
          eixoIII: e3,
          eixoIV: e4,
          eixoV: e5,
          eixoVI: e6,
        },
      },
    };
  }, [processo]);

  const handleUpdateServidor = (novoServidor: ServidorInfo) => {
    setProcesso((prev) => ({
      ...prev,
      servidor: novoServidor,
    }));
  };

  const handleUpdateDeclaracoes = (novasDeclaracoes: DeclaracoesConformidade) => {
    setProcesso((prev) => ({
      ...prev,
      declaracoes: novasDeclaracoes,
    }));
  };

  const handleUpdateMemorial = (novoMemorial: MemorialDescritivo) => {
    setProcesso((prev) => ({
      ...prev,
      memorial: novoMemorial,
    }));
  };

  const handleUpdateComprovantes = (novosComprovantes: ComprovanteItem[]) => {
    setProcesso((prev) => ({
      ...prev,
      indexacaoComprovantes: novosComprovantes,
    }));
  };

  const handleSelectPreset = (dossierId: string) => {
    const selected = mockDossiers.find((d) => d.id === dossierId);
    if (selected) {
      setProcesso(selected);
    }
  };

  const handleNewBlankDossier = () => {
    setProcesso({
      id: `dossie-novo-${Date.now()}`,
      tituloDossie: 'Novo Requerimento RSC-PCCTAE',
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
      numeroProcessoSei: '23000.000000/2026-00',
      servidor: {
        nome: '',
        matriculaSiape: '',
        cargo: 'Assistente em Administração',
        nivelCargo: 'Classe D - Nível I',
        campus: 'Campus Central',
        lotacao: 'Diretoria de Gestão de Pessoas',
        email: '',
        telefone: '',
        tempoServicoPublico: '',
        titulacaoAtual: 'Graduação',
        nivelRscSolicitado: 'RSC-II',
        equivalenciaTitulacao: 'Equivalência a Mestrado (Decreto nº 13.048/2026)',
      },
      declaracoes: {
        declaracaoVeracidade:
          'Declaro, sob as penas da lei (art. 299 do Código Penal e art. 132 da Lei nº 8.112/1990), a veracidade e autenticidade de todos os documentos comprobatórios anexados.',
        declaracaoConformidade:
          'Declaro cumprimento integral aos critérios do Decreto nº 13.048/2026 e das diretrizes do PCCTAE.',
        declaracaoNaoAcumulo:
          'Declaro não haver duplicidade de cômputo com eventos já utilizados para concessão de Incentivo à Qualificação.',
        declaracaoCienciaRegulamento:
          'Declaro ciência dos procedimentos de avaliação pela Comissão Especial de RSC-PCCTAE.',
      },
      memorial: {
        apresentacaoTrajetoria: '',
        desenvolvimentoSaberes: '',
        impactoInstitucional: '',
        conclusao: 'Requeiro a concessão de RSC nos termos do Decreto nº 13.048/2026.',
      },
      indexacaoComprovantes: [],
      resumoPontuacao: {
        totalPontos: 0,
        minimoExigido: 52,
        aptoParaConcessao: false,
        porEixo: { eixoI: 0, eixoII: 0, eixoIII: 0, eixoIV: 0 },
      },
    });
    setActiveTab('requerimento');
  };

  const handleCopyAllSEI = () => {
    const fullText = generateSeiFormattedText(currentProcessoWithRecalc);
    copySeiBlockToClipboard(fullText).then((ok) => {
      if (ok) {
        setCopiedQuick(true);
        setTimeout(() => setCopiedQuick(false), 2000);
      }
    });
  };

  const handleChangeNivel = (novoNivel: NivelRSC) => {
    const equivMap: Record<NivelRSC, string> = {
      'RSC-I': 'Ensino Fundamental Completo - 10% (Resolução CS/IFS nº 394/2026)',
      'RSC-II': 'Ensino Médio / Técnico - 15% (Resolução CS/IFS nº 394/2026)',
      'RSC-III': 'Graduação / Superior - 25% (Resolução CS/IFS nº 394/2026)',
      'RSC-IV': 'Aperfeiçoamento / Pós lato - 30% (Resolução CS/IFS nº 394/2026)',
      'RSC-V': 'Especialização - 52% (Resolução CS/IFS nº 394/2026)',
      'RSC-VI': 'Mestrado / Doutorado - 75% (Resolução CS/IFS nº 394/2026)',
    };

    setProcesso((prev) => ({
      ...prev,
      servidor: {
        ...prev.servidor,
        nivelRscSolicitado: novoNivel,
        equivalenciaTitulacao: equivMap[novoNivel] || 'Resolução CS/IFS nº 394/2026',
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      {/* Clean Header */}
      <Header
        processo={currentProcessoWithRecalc}
        onOpenDecretoModal={() => setIsDecretoModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onSelectPreset={handleSelectPreset}
        onNewBlankDossier={handleNewBlankDossier}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Compact AI Assist Drawer */}
        <UploadAndExtractionPanel
          currentProcesso={currentProcessoWithRecalc}
          onProcessoUpdate={(newProc) => setProcesso(newProc)}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        {/* Score & Level Card with Donut Chart */}
        <ResumoPontuacaoCard
          processo={currentProcessoWithRecalc}
          onChangeNivel={handleChangeNivel}
        />

        {/* First Steps Assistant / Process Flow Guide */}
        <AssistentePassoAPasso
          processo={currentProcessoWithRecalc}
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setViewMode('tabs');
          }}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Navigation Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-1 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'requerimento', label: '1. Requerimento' },
              { id: 'memorial', label: '2. Memorial' },
              { id: 'comprovantes', label: `3. Comprovantes (${currentProcessoWithRecalc.indexacaoComprovantes.length})` },
              { id: 'declaracoes', label: '4. Declarações' },
              { id: 'dossie', label: 'Texto SEI' },
            ].map((tab) => {
              const isSelected = viewMode === 'tabs' && activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as ActiveTabType);
                    setViewMode('tabs');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setViewMode(viewMode === 'tabs' ? 'all' : 'tabs')}
              className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1 transition-colors"
            >
              {viewMode === 'tabs' ? (
                <>
                  <Layout className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver Tudo</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Por Abas</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAllSEI}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedQuick ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuick ? 'Copiado!' : 'Copiar p/ SEI'}</span>
            </button>
          </div>
        </div>

        {/* View Mode: Tabs vs All */}
        {viewMode === 'tabs' ? (
          <div>
            {activeTab === 'requerimento' && (
              <Bloco1Requerimento
                servidor={currentProcessoWithRecalc.servidor}
                onUpdateServidor={handleUpdateServidor}
              />
            )}

            {activeTab === 'memorial' && (
              <Bloco3Memorial
                memorial={currentProcessoWithRecalc.memorial}
                servidor={currentProcessoWithRecalc.servidor}
                onUpdateMemorial={handleUpdateMemorial}
              />
            )}

            {activeTab === 'comprovantes' && (
              <Bloco4Indexacao
                comprovantes={currentProcessoWithRecalc.indexacaoComprovantes}
                onUpdateComprovantes={handleUpdateComprovantes}
              />
            )}

            {activeTab === 'declaracoes' && (
              <Bloco2Declaracoes
                declaracoes={currentProcessoWithRecalc.declaracoes}
                onUpdateDeclaracoes={handleUpdateDeclaracoes}
              />
            )}

            {activeTab === 'dossie' && (
              <DossieSeiView
                processo={currentProcessoWithRecalc}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <Bloco1Requerimento
              servidor={currentProcessoWithRecalc.servidor}
              onUpdateServidor={handleUpdateServidor}
            />

            <Bloco3Memorial
              memorial={currentProcessoWithRecalc.memorial}
              servidor={currentProcessoWithRecalc.servidor}
              onUpdateMemorial={handleUpdateMemorial}
            />

            <Bloco4Indexacao
              comprovantes={currentProcessoWithRecalc.indexacaoComprovantes}
              onUpdateComprovantes={handleUpdateComprovantes}
            />

            <Bloco2Declaracoes
              declaracoes={currentProcessoWithRecalc.declaracoes}
              onUpdateDeclaracoes={handleUpdateDeclaracoes}
            />

            <DossieSeiView
              processo={currentProcessoWithRecalc}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-400 text-xs py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-[11px]">
          <span>Decreto Presidencial nº 13.048/2026 &bull; PCCTAE</span>
          <button onClick={() => setIsDecretoModalOpen(true)} className="hover:text-slate-700 underline">
            Critérios e Pontuação
          </button>
        </div>
      </footer>

      {/* Modals */}
      <DecretoInfoModal
        isOpen={isDecretoModalOpen}
        onClose={() => setIsDecretoModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        processo={currentProcessoWithRecalc}
      />
    </div>
  );
}
