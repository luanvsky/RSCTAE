import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Scale,
  Award,
  BookOpen,
  Building,
  GraduationCap,
  ArrowRight,
  Filter,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DocumentoAvaliado, ProcessoRSC } from '../types';

interface AvaliacaoLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentos: DocumentoAvaliado[];
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
  onAplicarAoProcesso: (documentosAprovados: DocumentoAvaliado[]) => void;
}

export const AvaliacaoLoteModal: React.FC<AvaliacaoLoteModalProps> = ({
  isOpen,
  onClose,
  documentos,
  parecerGeral,
  pontuacaoTotal,
  minimoExigido,
  aptoParaConcessao,
  resumoPorEixo,
  onAplicarAoProcesso,
}) => {
  const [items, setItems] = useState<DocumentoAvaliado[]>(documentos);
  const [filterVeredito, setFilterVeredito] = useState<'TODOS' | 'CABIVEL' | 'NAO_CABIVEL' | 'CABIVEL_PARCIAL'>('TODOS');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Sync state when props change
  React.useEffect(() => {
    setItems(documentos);
  }, [documentos]);

  if (!isOpen) return null;

  const totalAnalisados = items.length;
  const totalCabiveis = items.filter((d) => d.veredito === 'CABIVEL').length;
  const totalParciais = items.filter((d) => d.veredito === 'CABIVEL_PARCIAL').length;
  const totalNaoCabiveis = items.filter((d) => d.veredito === 'NAO_CABIVEL').length;

  const itemsFiltrados = items.filter((d) => {
    if (filterVeredito === 'TODOS') return true;
    return d.veredito === filterVeredito;
  });

  const handleToggleInclude = (id: string) => {
    setItems((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, incluirNoProcesso: !doc.incluirNoProcesso } : doc))
    );
  };

  const handleAplicar = () => {
    const selecionados = items.filter((d) => d.incluirNoProcesso);
    onAplicarAoProcesso(selecionados);
    onClose();
  };

  const toggleExpand = (id: string) => {
    setExpandedDocId(expandedDocId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100/70 text-emerald-800 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Resultado da Avaliação Regulatória (Decreto nº 13.048/2026)
              </h2>
              <p className="text-xs text-slate-500">
                Auditoria de admissibilidade e cálculo de pontuação dos PDFs enviados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Executive Summary Card */}
          <div className={`p-4 rounded-xl border ${aptoParaConcessao ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'} space-y-3`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {aptoParaConcessao ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {aptoParaConcessao ? 'Requisitos Mínimos Atendidos' : 'Pontuação Insuficiente / Complementação Necessária'}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {parecerGeral || `Analisados ${totalAnalisados} PDFs. ${totalCabiveis + totalParciais} documentos pontuáveis identificados.`}
                  </p>
                </div>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Pontos Válidos</div>
                  <div className="text-sm font-extrabold text-slate-900">{pontuacaoTotal} pts</div>
                </div>
                <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Mínimo Exigido</div>
                  <div className="text-sm font-extrabold text-slate-700">{minimoExigido} pts</div>
                </div>
              </div>
            </div>

            {/* Score by Eixo Mini Bars (Eixos I a VI da Resolução CS/IFS nº 394/2026) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo I: Comissões</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoI || 0} pts</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo II: Projetos</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoII || 0} pts</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo III: Premiações</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoIII || 0} pts</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo IV: Contratos/Sist.</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoIV || 0} pts</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo V: Chefia/FG</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoV || 0} pts</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/70">
                <div className="text-[10px] text-slate-500 font-medium truncate">Eixo VI: Patentes/INPI</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{resumoPorEixo.eixoVI || 0} pts</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 text-[11px] font-medium mr-1">Filtrar por Veredito:</span>
              <button
                onClick={() => setFilterVeredito('TODOS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterVeredito === 'TODOS'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({totalAnalisados})
              </button>
              <button
                onClick={() => setFilterVeredito('CABIVEL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterVeredito === 'CABIVEL'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Cabíveis ({totalCabiveis})
              </button>
              {totalParciais > 0 && (
                <button
                  onClick={() => setFilterVeredito('CABIVEL_PARCIAL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    filterVeredito === 'CABIVEL_PARCIAL'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Parciais ({totalParciais})
                </button>
              )}
              {totalNaoCabiveis > 0 && (
                <button
                  onClick={() => setFilterVeredito('NAO_CABIVEL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    filterVeredito === 'NAO_CABIVEL'
                      ? 'bg-rose-700 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Não Cabíveis ({totalNaoCabiveis})
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500">
              {items.filter((d) => d.incluirNoProcesso).length} de {items.length} selecionados para o SEI
            </div>
          </div>

          {/* Documents Evaluation List */}
          <div className="space-y-2.5">
            {itemsFiltrados.map((doc, idx) => {
              const isExpanded = expandedDocId === doc.id;
              const isCabivel = doc.veredito === 'CABIVEL';
              const isParcial = doc.veredito === 'CABIVEL_PARCIAL';
              const isNaoCabivel = doc.veredito === 'NAO_CABIVEL';

              return (
                <div
                  key={doc.id || idx}
                  className={`rounded-xl border transition-all ${
                    doc.incluirNoProcesso
                      ? isCabivel
                        ? 'border-emerald-200 bg-white hover:border-emerald-300'
                        : isParcial
                        ? 'border-amber-200 bg-white hover:border-amber-300'
                        : 'border-rose-200 bg-white'
                      : 'border-slate-200 bg-slate-50/60 opacity-80'
                  } shadow-2xs`}
                >
                  {/* Summary Bar */}
                  <div className="p-3 sm:p-3.5 flex items-start gap-3">
                    {/* Checkbox for inclusion */}
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={doc.incluirNoProcesso}
                        onChange={() => handleToggleInclude(doc.id)}
                        disabled={isNaoCabivel}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 disabled:opacity-30 cursor-pointer"
                        title={isNaoCabivel ? 'Documento não pontuável no PCCTAE' : 'Marcar para incluir na tabela do processo SEI'}
                      />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {doc.nomeArquivo}
                          </span>
                        </div>

                        {/* Verdict Badge */}
                        <div className="flex items-center gap-1.5">
                          {isCabivel && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              CABÍVEL (+{doc.pontosCalculados} pts)
                            </span>
                          )}
                          {isParcial && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <AlertTriangle className="w-3 h-3" />
                              CABÍVEL PARCIAL (+{doc.pontosCalculados} pts)
                            </span>
                          )}
                          {isNaoCabivel && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3 h-3" />
                              DESCARTADO / NÃO CABÍVEL (0 pts)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtitle & Axis */}
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {doc.descricaoIdentificada}
                      </p>

                      {/* Descrição da Leitura do Anexo */}
                      {doc.detalhamentoLeitura && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-900 leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-0.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Descrição da Leitura do Anexo:</span>
                          </div>
                          <p className="text-slate-700 pl-5">
                            {doc.detalhamentoLeitura}
                          </p>
                        </div>
                      )}

                      {doc.motivoDescarte && (
                        <div className="mt-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-200/80 text-[11px] text-rose-800 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span><strong>Motivo do Descarte:</strong> {doc.motivoDescarte}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {doc.eixoSugerido.split(' - ')[0]}
                        </span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-600">{doc.artigoDecreto}</span>
                        {doc.cargaHorariaOuPeriodo && (
                          <>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-slate-600">{doc.cargaHorariaOuPeriodo}</span>
                          </>
                        )}
                        <button
                          onClick={() => toggleExpand(doc.id)}
                          className="ml-auto text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center gap-0.5 text-[11px]"
                        >
                          {isExpanded ? (
                            <>
                              <span>Ocultar detalhes</span>
                              <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              <span>Ver fundamentação legal</span>
                              <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail / Legal Justification */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block mb-0.5">
                          Fundamentação Regulatória (Resolução CS/IFS nº 394/2026):
                        </span>
                        <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                          {doc.justificativa}
                        </p>
                      </div>

                      {doc.orientacaoAoServidor && (
                        <div className="bg-blue-50/80 border border-blue-200 p-2.5 rounded-lg text-blue-900">
                          <span className="font-bold text-[11px] block mb-0.5">
                            Orientação para a Comissão Avaliadora:
                          </span>
                          <p className="text-xs text-blue-800 leading-relaxed">
                            {doc.orientacaoAoServidor}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Dossiê será sincronizado nos 4 blocos para envio ao SEI.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>

            <button
              onClick={handleAplicar}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Aplicar no Dossiê SEI ({items.filter((d) => d.incluirNoProcesso).length} comprovantes)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
