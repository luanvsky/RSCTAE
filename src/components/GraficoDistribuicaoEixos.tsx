import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface EixoData {
  name: string;
  shortName: string;
  value: number;
  color: string;
  anexo: string;
}

interface GraficoDistribuicaoEixosProps {
  porEixo: {
    eixoI?: number;
    eixoII?: number;
    eixoIII?: number;
    eixoIV?: number;
    eixoV?: number;
    eixoVI?: number;
  };
  totalPontos: number;
  minimoExigido: number;
}

const EIXOS_CONFIG: Array<{ key: keyof GraficoDistribuicaoEixosProps['porEixo']; name: string; shortName: string; color: string; anexo: string }> = [
  { key: 'eixoI', name: 'Req. I - Comissões e Grupos de Trabalho', shortName: 'Req. I (Comissões)', color: '#0284c7', anexo: 'Anexo I' },
  { key: 'eixoII', name: 'Req. II - Projetos, Pesquisa e Extensão', shortName: 'Req. II (Projetos)', color: '#0d9488', anexo: 'Anexo II' },
  { key: 'eixoIII', name: 'Req. III - Premiações e Reconhecimento', shortName: 'Req. III (Prêmios)', color: '#eab308', anexo: 'Anexo III' },
  { key: 'eixoIV', name: 'Req. IV - Responsabilidades e Contratos', shortName: 'Req. IV (Contratos)', color: '#6366f1', anexo: 'Anexo IV' },
  { key: 'eixoV', name: 'Req. V - Cargos/Funções de Chefia', shortName: 'Req. V (CD/FG)', color: '#8b5cf6', anexo: 'Anexo V' },
  { key: 'eixoVI', name: 'Req. VI - Produção Científica/INPI', shortName: 'Req. VI (Produção)', color: '#059669', anexo: 'Anexo VI' },
];

export const GraficoDistribuicaoEixos: React.FC<GraficoDistribuicaoEixosProps> = ({
  porEixo,
  totalPontos,
  minimoExigido,
}) => {
  const chartData: EixoData[] = EIXOS_CONFIG.map((conf) => ({
    name: conf.name,
    shortName: conf.shortName,
    value: Number(porEixo[conf.key]) || 0,
    color: conf.color,
    anexo: conf.anexo,
  })).filter((d) => d.value > 0);

  // If there are no points yet, provide a placeholder slice
  const displayData = chartData.length > 0
    ? chartData
    : [{ name: 'Sem pontuação registrada', shortName: 'Sem pontos', value: 1, color: '#e2e8f0', anexo: '-' }];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as EixoData;
      if (data.color === '#e2e8f0') {
        return (
          <div className="bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700">
            <span>Nenhum comprovante cadastrado</span>
          </div>
        );
      }
      const percentage = totalPontos > 0 ? ((data.value / totalPontos) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.shortName}</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Pontos: <strong className="text-white">{data.value.toFixed(1).replace('.', ',')} pts</strong> ({percentage}%)
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {data.anexo} - Resolução CS/IFS 394/2026
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 rounded-xl p-3 border border-slate-200/80">
      {/* Donut Chart with Center Indicator */}
      <div className="relative w-36 h-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={chartData.length > 1 ? 3 : 0}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Donut Hole Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Total</span>
          <span className="text-sm font-black text-slate-900 leading-tight">
            {totalPontos.toFixed(1).replace('.0', '')}
          </span>
          <span className="text-[9px] text-slate-500 font-medium">pts</span>
        </div>
      </div>

      {/* Legend & Breakdown Bars */}
      <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
        {EIXOS_CONFIG.map((conf) => {
          const pts = Number(porEixo[conf.key]) || 0;
          const percentage = totalPontos > 0 ? ((pts / totalPontos) * 100).toFixed(0) : '0';
          const hasPoints = pts > 0;

          return (
            <div
              key={conf.key}
              className={`p-1.5 rounded-lg border transition-all ${
                hasPoints
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-transparent border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: conf.color }}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 truncate" title={conf.name}>
                    {conf.shortName.split(' (')[0]}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">
                  {pts > 0 ? `${pts.toFixed(1).replace('.0', '')}p` : '0p'}
                </span>
              </div>

              {/* Progress mini-bar */}
              <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Number(percentage))}%`,
                    backgroundColor: conf.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
