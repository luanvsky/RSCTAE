import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Layers, Award, PieChart as PieChartIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { ProcessoRSC, NivelRSC } from '../types';
import { GraficoDistribuicaoEixos } from './GraficoDistribuicaoEixos';

interface ResumoPontuacaoProps {
  processo: ProcessoRSC;
  onChangeNivel: (nivel: NivelRSC) => void;
}

export const ResumoPontuacaoCard: React.FC<ResumoPontuacaoProps> = ({ processo, onChangeNivel }) => {
  const { resumoPontuacao, servidor, indexacaoComprovantes } = processo;
  const { totalPontos, minimoExigido, aptoParaConcessao, porEixo, minimoCriteriosExigidos = 5, bancoPontosExcedente = 0 } = resumoPontuacao;
  const [showChart, setShowChart] = useState(true);

  const niveis: Array<{ id: NivelRSC; label: string; min: number; minCrit: number; iq: string }> = [
    { id: 'RSC-I', label: 'RSC-I', min: 10, minCrit: 1, iq: '10%' },
    { id: 'RSC-II', label: 'RSC-II', min: 15, minCrit: 2, iq: '15%' },
    { id: 'RSC-III', label: 'RSC-III', min: 25, minCrit: 2, iq: '25%' },
    { id: 'RSC-IV', label: 'RSC-IV', min: 30, minCrit: 3, iq: '30%' },
    { id: 'RSC-V', label: 'RSC-V', min: 52, minCrit: 5, iq: '52%' },
    { id: 'RSC-VI', label: 'RSC-VI', min: 75, minCrit: 7, iq: '75%' },
  ];

  const excedente = Math.max(0, totalPontos - minimoExigido);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Score Badge & Server Summary */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 border transition-all ${
              aptoParaConcessao
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            <span className="text-xl leading-none font-black">{totalPontos.toFixed(1).replace('.0', '')}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">pontos</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">
                {servidor.nome || 'Servidor Requerente'}
              </span>
              {servidor.matriculaSiape && (
                <span className="text-xs text-slate-500 font-mono">SIAPE {servidor.matriculaSiape}</span>
              )}
              {servidor.nivelCargo && (
                <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                  {servidor.nivelCargo}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{servidor.cargo}</span>
              <span>&bull;</span>
              <span
                className={`font-semibold inline-flex items-center gap-1 ${
                  aptoParaConcessao ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {aptoParaConcessao ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apto p/ {servidor.nivelRscSolicitado} (Mín. {minimoExigido} pts e {minimoCriteriosExigidos} critérios)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Faltam {(minimoExigido - totalPontos).toFixed(1).replace('.0', '')} pts para {servidor.nivelRscSolicitado}</span>
                  </>
                )}
              </span>
            </div>

            {/* Banco de Pontos Excedente Tag */}
            {excedente > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 w-fit">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>
                  <strong>+{excedente.toFixed(1).replace('.0', '')} pts</strong> de saldo excedente (cumulativo p/ níveis futuros - Art. 7º, § 1º)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Level Switcher & Chart Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start lg:self-center">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {niveis.map((n) => {
              const isSelected = servidor.nivelRscSolicitado === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => onChangeNivel(n.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{n.id}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1 rounded">{n.iq}</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-400 block">{n.min} pts</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowChart(!showChart)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 inline-flex items-center gap-1.5 transition-colors self-end sm:self-center"
            title="Visualizar ou ocultar gráfico de distribuição de pontos por Eixo"
          >
            <PieChartIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{showChart ? 'Ocultar Gráfico' : 'Ver Gráfico'}</span>
            {showChart ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Donut Chart Visualizer */}
      {showChart && (
        <div className="pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <PieChartIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Distribuição da Pontuação por Eixo Normativo (Anexos I a VI)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Resolução CS/IFS nº 394/2026
            </span>
          </div>
          <GraficoDistribuicaoEixos
            porEixo={porEixo}
            totalPontos={totalPontos}
            minimoExigido={minimoExigido}
          />
        </div>
      )}
    </div>
  );
};
