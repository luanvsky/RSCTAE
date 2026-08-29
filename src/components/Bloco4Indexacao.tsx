import React, { useState, useRef, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  FileCheck2,
  HelpCircle,
  Sidebar,
  ShieldAlert,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Wand2,
  Zap,
} from 'lucide-react';
import { ComprovanteItem, EixoRequisito, MemorialDescritivo } from '../types';
import { copySeiBlockToClipboard } from '../utils/seiClipboard';
import { resolucaoIFS394 } from '../data/mockDossiers';
import { PainelSugestoesComprovantes } from './PainelSugestoesComprovantes';
import { SugestaoDocumental } from '../data/sugestoesComprovantes';
import {
  auditarComprovantesAltaPontuacao,
  avaliarComprovanteContraMemorial,
  LIMIAR_ALTA_PONTUACAO,
} from '../utils/memorialCrossCheck';

interface Bloco4Props {
  comprovantes: ComprovanteItem[];
  onUpdateComprovantes: (novosComprovantes: ComprovanteItem[]) => void;
  memorial?: MemorialDescritivo;
  onUpdateMemorial?: (novoMemorial: MemorialDescritivo) => void;
}

const EIXOS_OPTIONS: EixoRequisito[] = [
  'I - Comissões e Grupos de Trabalho',
  'II - Projetos, Pesquisa e Extensão',
  'III - Premiações e Reconhecimento',
  'IV - Responsabilidades e Contratos',
  'V - Cargos e Funções de Direção/Chefia',
  'VI - Produção Científica e Tecnológica',
];

export const Bloco4Indexacao: React.FC<Bloco4Props> = ({
  comprovantes,
  onUpdateComprovantes,
  memorial,
  onUpdateMemorial,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterEixo, setFilterEixo] = useState<string>('todos');
  const [filterAuditoria, setFilterAuditoria] = useState<'todos' | 'criticos' | 'alta_pontuacao'>('todos');
  const [mostrarCamadaAuditoria, setMostrarCamadaAuditoria] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<ComprovanteItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);
  const [justificativaEmEdicao, setJustificativaEmEdicao] = useState<{ id: string; texto: string } | null>(null);
  const [feedbackAcao, setFeedbackAcao] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Auditoria em tempo real contra o Memorial
  const auditoria = useMemo(() => {
    return auditarComprovantesAltaPontuacao(comprovantes, memorial);
  }, [comprovantes, memorial]);

  const [newItem, setNewItem] = useState<ComprovanteItem>({
    id: `comp-${Date.now()}`,
    itemCriterio: 'Resolução CS/IFS nº 394/2026 - Anexo I, Item 3',
    eixo: 'I - Comissões e Grupos de Trabalho',
    itemNumero: 3,
    descricaoAtividade: '',
    documentoCorrespondente: '',
    unidadeMedida: 'Por designação',
    pontosPorUnidade: 3.0,
    quantidadeInformada: 1,
    periodoHoras: '',
    pontuacaoAtribuida: 3.0,
    pontuacaoMaximaPermitida: 30.0,
    statusValidacao: 'Validade Confirmada',
    observacao: '',
    justificativaLegal: 'Resolução CS/IFS 394/2026, Anexo I, Item 3 (3,00 pts por designação).',
    justificativaMemorial: '',
  });

  const showFeedback = (msg: string) => {
    setFeedbackAcao(msg);
    setTimeout(() => setFeedbackAcao(null), 3500);
  };

  const handleCopySei = () => {
    const text = `BLOCO 4: TABELA DE INDEXAÇÃO E ADMISSIBILIDADE DE COMPROVANTES (RESOLUÇÃO CS/IFS Nº 394/2026)

| Req. / Critério Legal | Descrição da Atividade Comprovada | Documentação Anexada ao SEI | Quant. / Unid. | Pontos | Justificativa / Correlação |
| :--- | :--- | :--- | :--- | :--- | :--- |
${comprovantes
  .map((item) => {
    const justif = item.justificativaMemorial ? ` [Justificativa: ${item.justificativaMemorial}]` : '';
    return `| ${item.eixo.split(' - ')[0]} (${item.itemCriterio}) | ${item.descricaoAtividade} | ${item.documentoCorrespondente} | ${item.quantidadeInformada || 1} ${item.unidadeMedida || ''} | ${Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts | ${justif || 'Conforme memorial'} |`;
  })
  .join('\n')}`;

    copySeiBlockToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleDeleteItem = (id: string) => {
    onUpdateComprovantes(comprovantes.filter((c) => c.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const updated = comprovantes.map((c) => (c.id === editingItem.id ? editingItem : c));
    onUpdateComprovantes(updated);
    setEditingItem(null);
    showFeedback('Item comprobatório atualizado com sucesso!');
  };

  const handleSaveNew = () => {
    if (!newItem.descricaoAtividade.trim() || !newItem.documentoCorrespondente.trim()) return;
    const updated = [...comprovantes, { ...newItem, id: `comp-${Date.now()}` }];
    onUpdateComprovantes(updated);
    setIsAddingNew(false);
    setNewItem({
      id: `comp-${Date.now()}`,
      itemCriterio: 'Resolução CS/IFS nº 394/2026 - Anexo I, Item 3',
      eixo: 'I - Comissões e Grupos de Trabalho',
      itemNumero: 3,
      descricaoAtividade: '',
      documentoCorrespondente: '',
      unidadeMedida: 'Por designação',
      pontosPorUnidade: 3.0,
      quantidadeInformada: 1,
      periodoHoras: '',
      pontuacaoAtribuida: 3.0,
      pontuacaoMaximaPermitida: 30.0,
      statusValidacao: 'Validade Confirmada',
      observacao: '',
      justificativaLegal: 'Resolução CS/IFS 394/2026, Anexo I, Item 3 (3,00 pts por designação).',
      justificativaMemorial: '',
    });
    showFeedback('Novo comprovante cadastrado com sucesso!');
  };

  // Salva a justificativa direta no item
  const handleSalvarJustificativaDireta = (id: string, texto: string) => {
    const updated = comprovantes.map((c) =>
      c.id === id ? { ...c, justificativaMemorial: texto } : c
    );
    onUpdateComprovantes(updated);
    setJustificativaEmEdicao(null);
    showFeedback('Justificativa obrigatória salva e vinculada ao item!');
  };

  // Ação rápida: Inserir menção estruturada no Memorial Descritivo
  const handleInserirNoMemorial = (comprovante: ComprovanteItem) => {
    if (!memorial || !onUpdateMemorial) {
      showFeedback('Aviso: Memorial não disponível para edição direta.');
      return;
    }

    const avaliacao = avaliarComprovanteContraMemorial(comprovante, memorial);
    const trecho = avaliacao.trechoSugeridoMemorial;

    const textoAtual = memorial.desenvolvimentoSaberes || '';
    const separador = textoAtual.trim() ? '\n\n' : '';
    const novoTextoSaberes = `${textoAtual}${separador}${trecho}`;

    onUpdateMemorial({
      ...memorial,
      desenvolvimentoSaberes: novoTextoSaberes,
    });

    // Também salva uma justificativa concisa no item para reforço probatório
    const updated = comprovantes.map((c) =>
      c.id === comprovante.id
        ? {
            ...c,
            justificativaMemorial:
              c.justificativaMemorial ||
              `Atividade detalhada e circunstanciada na seção de Desenvolvimento de Saberes do Memorial Descritivo (Resolução CS/IFS nº 394/2026).`,
          }
        : c
    );
    onUpdateComprovantes(updated);

    showFeedback('⚡ Menção detalhada inserida no Memorial Descritivo com sucesso! Pendência sanada.');
  };

  // Handler when user applies a template from the lateral panel
  const handleApplyTemplateFromPanel = (sugestao: SugestaoDocumental, eixoKey: string) => {
    setIsAddingNew(true);
    setNewItem({
      id: `comp-${Date.now()}`,
      itemCriterio: `Resolução CS/IFS nº 394/2026 - ${sugestao.itemReferencia}`,
      eixo: eixoKey as EixoRequisito,
      itemNumero: 1,
      descricaoAtividade: sugestao.descricaoExemplo,
      documentoCorrespondente: `Anexo XX - ${sugestao.documentosAceitos[0]} (Fls. SEI 00-00)`,
      unidadeMedida: sugestao.unidadeSugerida,
      pontosPorUnidade: sugestao.pontosSugeridos,
      quantidadeInformada: 1,
      periodoHoras: 'Conforme documento anexo',
      pontuacaoAtribuida: sugestao.pontosSugeridos,
      pontuacaoMaximaPermitida: sugestao.pontosMaximos,
      statusValidacao: 'Validade Confirmada',
      observacao: sugestao.dicaComissao,
      justificativaLegal: `Resolução CS/IFS nº 394/2026, ${sugestao.itemReferencia} (${sugestao.pontosSugeridos.toFixed(1).replace('.', ',')} pts ${sugestao.unidadeSugerida}). ${sugestao.dicaComissao}`,
      justificativaMemorial:
        sugestao.pontosSugeridos >= LIMIAR_ALTA_PONTUACAO
          ? `Atividade de alto impacto normativo nos termos do ${sugestao.itemReferencia}. ${sugestao.dicaComissao}`
          : '',
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // Filtragem combinada (Eixo + Auditoria)
  const filteredItems = comprovantes.filter((c) => {
    // Filtro por Eixo
    if (filterEixo !== 'todos' && !c.eixo.startsWith(filterEixo)) {
      return false;
    }

    // Filtro por Auditoria
    if (filterAuditoria === 'criticos') {
      const res = avaliarComprovanteContraMemorial(c, memorial);
      return res.isCriticoSemMemorial;
    }
    if (filterAuditoria === 'alta_pontuacao') {
      const res = avaliarComprovanteContraMemorial(c, memorial);
      return res.isAltaPontuacao;
    }

    return true;
  });

  const totalPontosFiltrados = filteredItems.reduce(
    (acc, curr) => acc + (Number(curr.pontuacaoAtribuida) || 0),
    0
  );

  // Eixo to pass to the side panel
  const currentActiveEixo =
    filterEixo !== 'todos'
      ? filterEixo
      : isAddingNew
      ? newItem.eixo
      : editingItem
      ? editingItem.eixo
      : 'I -';

  return (
    <div className="space-y-4">
      {/* Toast de Feedback */}
      {feedbackAcao && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackAcao}</span>
          </div>
        </div>
      )}

      {/* Top Banner with Toggle for Side Panel */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">
                Bloco 4: Indexação e Admissibilidade de Comprovantes
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded">
                Resolução CS/IFS nº 394/2026
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Comprovação documental rigorosa conforme os Anexos I a VI e o Decreto nº 13.048/2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auditoria Toggle Button */}
          <button
            onClick={() => setMostrarCamadaAuditoria(!mostrarCamadaAuditoria)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors border ${
              mostrarCamadaAuditoria
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Ativar/Desativar camada de destaque visual para itens de alta pontuação sem memorial"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{mostrarCamadaAuditoria ? 'Camada de Risco Ativa' : 'Ativar Camada de Risco'}</span>
          </button>

          {/* Side Panel Toggle Button */}
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors border ${
              showSidePanel
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Mostrar/Ocultar painel lateral com sugestões de documentos aceitos pela Comissão"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{showSidePanel ? 'Sugestões Ativas' : 'Ver Documentos Aceitos (CRSC)'}</span>
          </button>
        </div>
      </div>

      {/* BANNER DE ALERTA DE AUDITORIA: Itens Críticos de Alta Pontuação */}
      {mostrarCamadaAuditoria && auditoria.totalCriticos > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3.5 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-200/80 text-rose-800 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wide bg-rose-600 text-white px-2 py-0.5 rounded">
                  {auditoria.totalCriticos} Item(ns) Crítico(s) Detectado(s)
                </span>
                <span className="text-xs font-bold text-rose-900">
                  Alta Pontuação (≥ {LIMIAR_ALTA_PONTUACAO.toFixed(1).replace('.', ',')} pts) sem Detalhamento no Memorial
                </span>
              </div>
              <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                A <strong>Resolução CS/IFS nº 394/2026 (Art. 6º, § 2º)</strong> exige que itens de expressivo peso probatório sejam 
                circunstanciados no Memorial Descritivo ou acompanhados de <strong>Justificativa Obrigatória para Submissão</strong>, evitando glosa pela Comissão Especial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setFilterAuditoria(filterAuditoria === 'criticos' ? 'todos' : 'criticos')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                filterAuditoria === 'criticos'
                  ? 'bg-rose-700 text-white border-rose-800'
                  : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{filterAuditoria === 'criticos' ? 'Ver Todos os Itens' : 'Filtrar Apenas Críticos'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Responsive Grid: Table + Side Panel */}
      <div className={`grid grid-cols-1 ${showSidePanel ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-4 items-start`}>
        {/* Left / Main Table Container */}
        <div className={`${showSidePanel ? 'lg:col-span-7 xl:col-span-8' : 'w-full'} bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden`}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Quadro de Comprovantes Registrados
                </h3>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {comprovantes.length} item(ns)
                </span>
                {auditoria.totalCriticos > 0 && mostrarCamadaAuditoria && (
                  <span className="text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                    {auditoria.totalCriticos} crítico(s)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Validados para o cômputo da pontuação e banco de pontos excedente
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                }}
                className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Comprovante</span>
              </button>

              <button
                onClick={handleCopySei}
                className="text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copiado!' : 'Copiar Tabela SEI'}</span>
              </button>
            </div>
          </div>

          {/* Quick Auditoria Status Bar */}
          {mostrarCamadaAuditoria && (
            <div className="px-4 py-2 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300">Camada de Auditoria:</span>
                <button
                  onClick={() => setFilterAuditoria('todos')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    filterAuditoria === 'todos' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({comprovantes.length})
                </button>
                <button
                  onClick={() => setFilterAuditoria('criticos')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                    filterAuditoria === 'criticos'
                      ? 'bg-rose-600 text-white font-bold'
                      : auditoria.totalCriticos > 0
                      ? 'bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-700/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Alta Pontuação s/ Memorial ({auditoria.totalCriticos})</span>
                </button>
                <button
                  onClick={() => setFilterAuditoria('alta_pontuacao')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    filterAuditoria === 'alta_pontuacao'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Total Alta Pontuação ({auditoria.totalAltaPontuacao})
                </button>
              </div>

              <div className="text-[11px] text-slate-300">
                Limiar de Rigor: <strong className="text-amber-300">≥ {LIMIAR_ALTA_PONTUACAO.toFixed(1).replace('.', ',')} pts</strong>
              </div>
            </div>
          )}

          {/* Filter Tabs by Eixo */}
          <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1">
              {[
                { key: 'todos', label: `Todos os Eixos` },
                { key: 'I -', label: 'Req. I (Comissões)' },
                { key: 'II -', label: 'Req. II (Projetos/Ensino)' },
                { key: 'III -', label: 'Req. III (Prêmios)' },
                { key: 'IV -', label: 'Req. IV (Contratos/Sistemas)' },
                { key: 'V -', label: 'Req. V (CD/FG Chefia)' },
                { key: 'VI -', label: 'Req. VI (Produção/INPI)' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterEixo(tab.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    filterEixo === tab.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
              Subtotal: <span className="text-emerald-700 font-bold">{totalPontosFiltrados.toFixed(1).replace('.', ',')} pts</span>
            </div>
          </div>

          {/* Add New Form */}
          {isAddingNew && (
            <div ref={formRef} className="p-4 bg-emerald-50/50 border-b-2 border-emerald-300 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-900">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>Cadastrar Novo Documento Comprobatório</span>
                </span>
                <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Requisito Normativo (Anexo)</label>
                  <select
                    value={newItem.eixo ?? 'I - Comissões e Grupos de Trabalho'}
                    onChange={(e) => setNewItem({ ...newItem, eixo: e.target.value as any })}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none font-medium shadow-2xs"
                  >
                    {EIXOS_OPTIONS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Documento Anexado (PDF e Fls. SEI)</label>
                  <input
                    type="text"
                    value={newItem.documentoCorrespondente ?? ''}
                    onChange={(e) => setNewItem({ ...newItem, documentoCorrespondente: e.target.value })}
                    placeholder="Ex: Anexo 03 - Portarias Fiscalizacao.pdf (Fls. 33-58)"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Pontuação Calculada</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newItem.pontuacaoAtribuida ?? 0}
                    onChange={(e) => setNewItem({ ...newItem, pontuacaoAtribuida: Number(e.target.value) || 0 })}
                    className="w-full text-xs font-bold p-2 bg-white border border-emerald-300 rounded-lg outline-none text-emerald-800 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-semibold mb-1">Descrição Detalhada da Atividade / Encargo</label>
                <input
                  type="text"
                  value={newItem.descricaoAtividade ?? ''}
                  onChange={(e) => setNewItem({ ...newItem, descricaoAtividade: e.target.value })}
                  placeholder="Ex: Fiscalização continuada de 10 contratos de serviços continuados corporativos do IFS"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Critério Legal da Resolução</label>
                  <input
                    type="text"
                    value={newItem.itemCriterio ?? ''}
                    onChange={(e) => setNewItem({ ...newItem, itemCriterio: e.target.value })}
                    placeholder="Ex: Resolução CS/IFS nº 394/2026 - Anexo IV, Item 3"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Unidade de Medida / Quantidade</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem.unidadeMedida ?? ''}
                      onChange={(e) => setNewItem({ ...newItem, unidadeMedida: e.target.value })}
                      placeholder="Ex: Por contrato fiscalizado"
                      className="w-2/3 text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none shadow-2xs"
                    />
                    <input
                      type="number"
                      value={newItem.quantidadeInformada ?? 1}
                      onChange={(e) => {
                        const qtd = Number(e.target.value) || 1;
                        const ptsUnit = newItem.pontosPorUnidade || 3.0;
                        setNewItem({
                          ...newItem,
                          quantidadeInformada: qtd,
                          pontuacaoAtribuida: qtd * ptsUnit,
                        });
                      }}
                      placeholder="Qtd"
                      className="w-1/3 text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none font-bold text-center shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Justificativa Obrigatória para Submissão se Pontuação for Alta */}
              {Number(newItem.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Justificativa Obrigatória para Submissão (Item de Alta Pontuação: {Number(newItem.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewItem({
                          ...newItem,
                          justificativaMemorial: `Atividade de alta complexidade e relevância técnica (${newItem.descricaoAtividade || 'encargo funcional'}), comprovada mediante ${newItem.documentoCorrespondente || 'documentação em anexo'}. Contribui decisivamente para os objetivos institucionais e mobilização de competências no âmbito do ${newItem.eixo}.`,
                        });
                      }}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Preencher Modelo</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={newItem.justificativaMemorial ?? ''}
                    onChange={(e) => setNewItem({ ...newItem, justificativaMemorial: e.target.value })}
                    placeholder="Descreva a correlação desta atividade de alto impacto com os objetivos funcionais ou aponte como ela está circunstanciada no Memorial..."
                    className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-amber-800">
                    A Resolução CS/IFS nº 394/2026 exige que itens de pontuação ≥ 7,5 pts possuam relato circunstanciado no Memorial ou justificativa formal para admissão do processo.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-slate-700 font-semibold mb-1">Fundamento Legal / Observação</label>
                <input
                  type="text"
                  value={newItem.justificativaLegal ?? ''}
                  onChange={(e) => setNewItem({ ...newItem, justificativaLegal: e.target.value })}
                  placeholder="Justificativa legal e observações para a comissão"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 italic">
                  💡 Você também pode clicar em um dos modelos do painel lateral para preenchimento instantâneo.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNew}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    Salvar Comprovante
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Editing Modal/Form */}
          {editingItem && (
            <div className="p-4 bg-amber-50/70 border-b-2 border-amber-300 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-amber-700" />
                  <span>Editar Item Comprobatório</span>
                </span>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Requisito Normativo</label>
                  <select
                    value={editingItem.eixo ?? 'I - Comissões e Grupos de Trabalho'}
                    onChange={(e) => setEditingItem({ ...editingItem, eixo: e.target.value as any })}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    {EIXOS_OPTIONS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Documento SEI (PDF e Fls.)</label>
                  <input
                    type="text"
                    value={editingItem.documentoCorrespondente ?? ''}
                    onChange={(e) => setEditingItem({ ...editingItem, documentoCorrespondente: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-semibold mb-1">Pontuação Atribuída</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.pontuacaoAtribuida ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, pontuacaoAtribuida: Number(e.target.value) || 0 })}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-300 rounded-lg outline-none text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-semibold mb-1">Descrição da Atividade</label>
                <input
                  type="text"
                  value={editingItem.descricaoAtividade ?? ''}
                  onChange={(e) => setEditingItem({ ...editingItem, descricaoAtividade: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {/* Justificativa Obrigatória no Modo Edição */}
              <div className={`p-3 rounded-lg border space-y-1.5 ${
                Number(editingItem.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className={`flex items-center gap-1.5 ${
                    Number(editingItem.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO ? 'text-rose-900' : 'text-slate-800'
                  }`}>
                    {Number(editingItem.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-500" />
                    )}
                    <span>
                      {Number(editingItem.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO
                        ? `Justificativa Obrigatória para Submissão (Alta Pontuação: ${Number(editingItem.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts)`
                        : 'Justificativa / Correlação com o Memorial (Opcional)'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const res = avaliarComprovanteContraMemorial(editingItem, memorial);
                      setEditingItem({
                        ...editingItem,
                        justificativaMemorial: res.justificativaSugerida,
                      });
                    }}
                    className="text-[11px] text-rose-800 hover:text-rose-950 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" />
                    <span>Sugerir com IA</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editingItem.justificativaMemorial ?? ''}
                  onChange={(e) => setEditingItem({ ...editingItem, justificativaMemorial: e.target.value })}
                  placeholder="Detalhamento circunstanciado da atividade e seu valor para a instituição..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 w-36">Requisito</th>
                  <th className="py-2.5 px-3">Atividade &amp; Correlação Memorial</th>
                  <th className="py-2.5 px-3 w-36">Doc. Anexo / Fls. SEI</th>
                  <th className="py-2.5 px-3 w-20 text-right">Pontos</th>
                  <th className="py-2.5 px-3 w-32 text-center">Status Auditoria</th>
                  <th className="py-2.5 px-3 w-20 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-600">Nenhum comprovante encontrado para os filtros ativos.</p>
                        <p className="text-[11px] text-slate-400">
                          {filterAuditoria === 'criticos'
                            ? 'Parabéns! Não existem itens de alta pontuação sem detalhamento no Memorial.'
                            : 'Utilize o botão "Novo Comprovante" ou selecione um modelo do painel lateral.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    const avaliacao = avaliarComprovanteContraMemorial(item, memorial);
                    const isExpanded = expandedRowId === item.id;
                    const isCritico = avaliacao.isCriticoSemMemorial && mostrarCamadaAuditoria;
                    const isAltaPontuacaoConforme = avaliacao.isAltaPontuacao && avaliacao.isDetalhadoNoMemorial;

                    return (
                      <React.Fragment key={item.id}>
                        {/* Linha Principal com Destaque em Vermelho se Crítico */}
                        <tr
                          className={`transition-colors group ${
                            isCritico
                              ? 'bg-rose-50/75 border-l-4 border-l-rose-600 hover:bg-rose-100/70 text-rose-950'
                              : isAltaPontuacaoConforme
                              ? 'bg-emerald-50/20 hover:bg-slate-50/80'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                            {index + 1}
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-800">
                              {item.eixo.split(' - ')[0]}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono line-clamp-1" title={item.itemCriterio}>
                              {item.itemCriterio}
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-900">
                              {item.descricaoAtividade}
                            </div>

                            {/* Tags de Destaque / Alerta */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {/* Alerta de Alta Pontuação sem Memorial */}
                              {isCritico && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white shadow-2xs animate-pulse">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>ALTA PONTUAÇÃO ({Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts) • SEM MEMORIAL</span>
                                </span>
                              )}

                              {/* Selo Verde de Alta Pontuação Conforme */}
                              {isAltaPontuacaoConforme && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Alta Pontuação Conforme ({Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts)</span>
                                </span>
                              )}

                              {item.unidadeMedida && (
                                <span className="text-[10px] text-slate-500">
                                  Qtd: <strong>{item.quantidadeInformada || 1}</strong> &bull; {item.unidadeMedida}
                                </span>
                              )}
                            </div>

                            {/* Exibição da Justificativa se preenchida */}
                            {item.justificativaMemorial && (
                              <div className="mt-1 text-[11px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200/80 italic line-clamp-2">
                                <span className="font-semibold text-slate-700 not-italic">Justificativa de Submissão:</span> {item.justificativaMemorial}
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            <div className="line-clamp-2" title={item.documentoCorrespondente}>
                              {item.documentoCorrespondente}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`font-black text-sm ${
                                isCritico
                                  ? 'text-rose-700'
                                  : Number(item.pontuacaoAtribuida) >= LIMIAR_ALTA_PONTUACAO
                                  ? 'text-emerald-700'
                                  : 'text-slate-800'
                              }`}
                            >
                              {Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">pts</span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            {isCritico ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-900 bg-rose-200/90 border border-rose-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                                <AlertTriangle className="w-3 h-3 text-rose-700 shrink-0" />
                                <span>Exige Justificativa</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Validado</span>
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Botão de Expansão/Ação de Justificativa */}
                              <button
                                onClick={() => toggleRowExpand(item.id)}
                                title={isExpanded ? 'Recolher detalhes' : 'Ver/Editar Justificativa Obrigatória'}
                                className={`p-1 rounded transition-colors cursor-pointer ${
                                  isCritico
                                    ? 'bg-rose-200 text-rose-800 hover:bg-rose-300 font-bold'
                                    : 'hover:bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => setEditingItem(item)}
                                title="Editar Item Completo"
                                className="p-1 hover:text-slate-900 text-slate-400 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                title="Excluir Comprovante"
                                className="p-1 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Linha Expandida: Ação de Resolução Imediata e Justificativa Obrigatória */}
                        {isExpanded && (
                          <tr className={isCritico ? 'bg-rose-100/50' : 'bg-slate-50/60'}>
                            <td colSpan={7} className="p-3.5 px-4">
                              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <FileCheck2 className="w-4 h-4 text-slate-700" />
                                    <span className="font-bold text-xs text-slate-900">
                                      Detalhamento &amp; Correlação com o Memorial Descritivo
                                    </span>
                                    {isCritico && (
                                      <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded uppercase">
                                        Justificativa Obrigatória Pendente
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {/* Botão de Inserção com 1 Clique no Memorial */}
                                    <button
                                      type="button"
                                      onClick={() => handleInserirNoMemorial(item)}
                                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                      title="Insere um parágrafo estruturado com esta atividade diretamente no Memorial Descritivo"
                                    >
                                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                                      <span>⚡ Inserir Menção no Memorial</span>
                                    </button>

                                    {/* Botão de Gerar Justificativa com IA */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setJustificativaEmEdicao({
                                          id: item.id,
                                          texto: avaliacao.justificativaSugerida,
                                        });
                                      }}
                                      className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                                      <span>Sugerir Justificativa</span>
                                    </button>
                                  </div>
                                </div>

                                {isCritico && (
                                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 leading-relaxed">
                                    <strong>⚠️ Exigência Normativa para Submissão:</strong> Por se tratar de um item com pontuação elevada (<strong>{Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')} pts</strong>), 
                                    a comissão avaliadora do IFS exige que esta atividade seja detalhada nas seções do Memorial Descritivo ou acompanhada de justificativa formal abaixo.
                                  </div>
                                )}

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Texto da Justificativa de Submissão / Relevância da Atividade:
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={
                                      justificativaEmEdicao?.id === item.id
                                        ? justificativaEmEdicao.texto
                                        : item.justificativaMemorial || ''
                                    }
                                    onChange={(e) => {
                                      setJustificativaEmEdicao({
                                        id: item.id,
                                        texto: e.target.value,
                                      });
                                    }}
                                    placeholder="Escreva a justificativa de correlação circunstanciada desta atividade com o Memorial Descritivo..."
                                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-400 leading-relaxed"
                                  />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[11px] text-slate-500">
                                    {item.justificativaLegal && (
                                      <span>Base Legal: <em>{item.justificativaLegal}</em></span>
                                    )}
                                  </span>

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const texto =
                                          justificativaEmEdicao?.id === item.id
                                            ? justificativaEmEdicao.texto
                                            : item.justificativaMemorial || '';
                                        handleSalvarJustificativaDireta(item.id, texto);
                                      }}
                                      className="px-3.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                                    >
                                      Salvar Justificativa
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right / Lateral Suggestions Panel (Documentos Aceitos Conforme Decreto) */}
        {showSidePanel && (
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
            <PainelSugestoesComprovantes
              selectedEixo={currentActiveEixo}
              onSelectEixo={(eixoPrefix) => setFilterEixo(eixoPrefix)}
              onApplyTemplate={handleApplyTemplateFromPanel}
              onToggleCollapse={() => setShowSidePanel(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
