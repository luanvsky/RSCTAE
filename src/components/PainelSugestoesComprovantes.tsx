import React, { useState } from 'react';
import {
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Filter,
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SUGESTOES_POR_EIXO, SugestaoDocumental } from '../data/sugestoesComprovantes';
import { EixoRequisito } from '../types';

interface PainelSugestoesProps {
  selectedEixo: string;
  onSelectEixo: (eixo: string) => void;
  onApplyTemplate: (sugestao: SugestaoDocumental, eixoKey: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PainelSugestoesComprovantes: React.FC<PainelSugestoesProps> = ({
  selectedEixo,
  onSelectEixo,
  onApplyTemplate,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Normalize selected eixo key
  const normalizedKey = Object.keys(SUGESTOES_POR_EIXO).find((k) =>
    selectedEixo === 'todos' ? true : k.startsWith(selectedEixo) || selectedEixo.startsWith(k.split(' - ')[0])
  ) || 'I - Comissões e Grupos de Trabalho';

  const activeEixoData = SUGESTOES_POR_EIXO[normalizedKey] || SUGESTOES_POR_EIXO['I - Comissões e Grupos de Trabalho'];
  const [expandedCardId, setExpandedCardId] = useState<string | null>(activeEixoData.sugestoes[0]?.id || null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleApply = (sugestao: SugestaoDocumental) => {
    onApplyTemplate(sugestao, normalizedKey);
    setAppliedId(sugestao.id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  if (isCollapsed) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-col items-center justify-between border border-slate-800 shadow-sm w-12 hover:bg-slate-800 transition-colors">
        <button
          onClick={onToggleCollapse}
          className="flex flex-col items-center gap-2 text-emerald-400 hover:text-white"
          title="Expandir Guia de Documentos Aceitos pela CRSC"
        >
          <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 py-2">
            Guia de Documentos CRSC
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <aside className="bg-slate-50/90 rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold tracking-tight text-white">
                Documentos Aceitos pela CRSC
              </h3>
              <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                Dec. 13.048/2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Padrões probatórios e requisitos essenciais para deferimento
            </p>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors text-xs"
            title="Recolher painel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Eixo Selector Chips */}
      <div className="p-2 bg-slate-100/80 border-b border-slate-200">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
          <span>Selecione o Eixo / Requisito</span>
          <span className="text-[9px] font-medium text-slate-400">Anexos I a VI</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {Object.entries(SUGESTOES_POR_EIXO).map(([key, data]) => {
            const isSelected = normalizedKey === key;
            const prefix = key.split(' - ')[0];
            return (
              <button
                key={key}
                onClick={() => {
                  onSelectEixo(prefix);
                  setExpandedCardId(data.sugestoes[0]?.id || null);
                }}
                className={`px-1.5 py-1 rounded text-[11px] font-bold text-center transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
                title={data.eixoNome}
              >
                {prefix}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Eixo Meta Banner */}
      <div className="px-3.5 py-2.5 bg-white border-b border-slate-200/80 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
            {activeEixoData.eixoNome}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded whitespace-nowrap">
            Teto: {activeEixoData.pontuacaoMaximaEixo}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          {activeEixoData.resumoEixo}
        </p>
      </div>

      {/* Suggested Documents List */}
      <div className="p-3 space-y-2.5 overflow-y-auto max-h-[580px]">
        {activeEixoData.sugestoes.map((sugestao) => {
          const isExpanded = expandedCardId === sugestao.id;
          const isJustApplied = appliedId === sugestao.id;

          return (
            <div
              key={sugestao.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Summary Header */}
              <div
                onClick={() => setExpandedCardId(isExpanded ? null : sugestao.id)}
                className="p-3 cursor-pointer flex items-start justify-between gap-2 select-none"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                      {sugestao.itemReferencia.split(' (')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      +{sugestao.pontosSugeridos.toFixed(1).replace('.', ',')} pts
                    </span>
                    <span className="text-[9px] text-slate-400 lowercase">
                      ({sugestao.unidadeSugerida})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    {sugestao.tituloAtividade}
                  </h4>
                </div>

                <div className="text-slate-400 p-0.5">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-2.5 text-[11px]">
                  {/* Exemplos de Documentos Aceitos */}
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Documentos Habitualmente Aceitos pela Comissão:</span>
                    </div>
                    <ul className="space-y-1 pl-1">
                      {sugestao.documentosAceitos.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requisitos Essenciais */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-500" />
                      <span>Requisitos Essenciais no Documento:</span>
                    </div>
                    <ul className="space-y-0.5 text-slate-600 text-[10px] leading-normal pl-1">
                      {sugestao.requisitosEssenciais.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-slate-400">&bull;</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dica da Comissão */}
                  <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/80 text-[10px] text-amber-900 leading-tight flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Dica da CRSC: </strong>
                      {sugestao.dicaComissao}
                    </div>
                  </div>

                  {/* Alerta de Indeferimento if any */}
                  {sugestao.alertaIndeferimento && (
                    <div className="bg-rose-50/70 p-2 rounded-lg border border-rose-200/80 text-[10px] text-rose-900 leading-tight flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Atenção p/ evitar indeferimento: </strong>
                        {sugestao.alertaIndeferimento}
                      </div>
                    </div>
                  )}

                  {/* One Click Apply Action Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => handleApply(sugestao)}
                      className={`w-full py-1.5 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isJustApplied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {isJustApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Modelo Aplicado no Formulário!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Usar este Modelo no Processo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-100/90 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          <span>Vedado bis in idem (Art. 7º, § 2º)</span>
        </span>
        <span className="font-semibold text-slate-700">Res. CS/IFS 394/2026</span>
      </div>
    </aside>
  );
};
