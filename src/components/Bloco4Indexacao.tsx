import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { ComprovanteItem, EixoRequisito } from '../types';
import { copySeiBlockToClipboard } from '../utils/seiClipboard';
import { resolucaoIFS394 } from '../data/mockDossiers';
import { PainelSugestoesComprovantes } from './PainelSugestoesComprovantes';
import { SugestaoDocumental } from '../data/sugestoesComprovantes';

interface Bloco4Props {
  comprovantes: ComprovanteItem[];
  onUpdateComprovantes: (novosComprovantes: ComprovanteItem[]) => void;
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
}) => {
  const [copied, setCopied] = useState(false);
  const [filterEixo, setFilterEixo] = useState<string>('todos');
  const [editingItem, setEditingItem] = useState<ComprovanteItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);

  const formRef = useRef<HTMLDivElement>(null);

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
  });

  const handleCopySei = () => {
    const text = `BLOCO 4: TABELA DE INDEXAÇÃO E ADMISSIBILIDADE DE COMPROVANTES (RESOLUÇÃO CS/IFS Nº 394/2026)

| Req. / Critério Legal | Descrição da Atividade Comprovada | Documentação Anexada ao SEI | Quant. / Unid. | Pontos |
| :--- | :--- | :--- | :--- | :--- |
${comprovantes
  .map(
    (item) =>
      `| ${item.eixo.split(' - ')[0]} (${item.itemCriterio}) | ${item.descricaoAtividade} | ${item.documentoCorrespondente} | ${item.quantidadeInformada || 1} ${item.unidadeMedida || ''} | ${item.pontuacaoAtribuida.toFixed(1).replace('.', ',')} pts |`
  )
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
    });
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
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const filteredItems = comprovantes.filter((c) => {
    if (filterEixo === 'todos') return true;
    return c.eixo.startsWith(filterEixo);
  });

  const totalPontosFiltrados = filteredItems.reduce((acc, curr) => acc + (Number(curr.pontuacaoAtribuida) || 0), 0);

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
            <span>{showSidePanel ? 'Painel de Sugestões Ativo' : 'Ver Documentos Aceitos (CRSC)'}</span>
          </button>
        </div>
      </div>

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

          {/* Filter Tabs */}
          <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1">
              {[
                { key: 'todos', label: `Todos (${comprovantes.length})` },
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

              <div>
                <label className="block text-[11px] text-slate-700 font-semibold mb-1">Justificativa Legal / Observação</label>
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
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNew}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
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
                <label className="block text-[11px] text-slate-700 font-semibold mb-1">Descrição</label>
                <input
                  type="text"
                  value={editingItem.descricaoAtividade ?? ''}
                  onChange={(e) => setEditingItem({ ...editingItem, descricaoAtividade: e.target.value })}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
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
                  <th className="py-2.5 px-3 w-40">Requisito</th>
                  <th className="py-2.5 px-3">Atividade / Portarias</th>
                  <th className="py-2.5 px-3 w-40">Doc. Anexo / Fls. SEI</th>
                  <th className="py-2.5 px-3 w-20 text-right">Pontos</th>
                  <th className="py-2.5 px-3 w-24 text-center">Status</th>
                  <th className="py-2.5 px-3 w-16 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-600">Nenhum comprovante cadastrado neste filtro.</p>
                        <p className="text-[11px] text-slate-400">
                          Utilize o botão &quot;Novo Comprovante&quot; ou clique em um dos modelos sugeridos no painel lateral.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    const isExpanded = expandedRowId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-50/70 transition-colors group">
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
                            <div className="font-medium text-slate-900 line-clamp-2">
                              {item.descricaoAtividade}
                            </div>
                            {item.unidadeMedida && (
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Qtd: <strong>{item.quantidadeInformada || 1}</strong> &bull; {item.unidadeMedida}
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            <div className="line-clamp-1" title={item.documentoCorrespondente}>
                              {item.documentoCorrespondente}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <span className="font-bold text-emerald-700 text-sm">
                              {Number(item.pontuacaoAtribuida).toFixed(1).replace('.', ',')}
                            </span>
                            <span className="text-[10px] text-slate-400 block">pts</span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Validado</span>
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => setEditingItem(item)}
                                title="Editar"
                                className="p-1 hover:text-slate-900 text-slate-400 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                title="Excluir"
                                className="p-1 hover:text-rose-600 text-slate-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
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
