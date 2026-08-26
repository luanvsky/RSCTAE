import React from 'react';
import { X, BookOpen, Scale, Award, Layers, CheckSquare, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { resolucaoIFS394 } from '../data/mockDossiers';

interface DecretoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecretoInfoModal: React.FC<DecretoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Scale className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {resolucaoIFS394.numero}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {resolucaoIFS394.dataAprovacao}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Regulamento dos Critérios e Procedimentos para Concessão do RSC-PCCTAE no IFS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Ementa e Regra Geral */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 block uppercase text-xs tracking-wider">
              Ementa Normativa Oficial do Conselho Superior:
            </span>
            <p className="leading-relaxed text-slate-700 italic">{resolucaoIFS394.ementa}</p>
          </div>

          {/* 6 Níveis e Percentuais de Incentivo à Qualificação */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              Níveis de RSC, Pontuação Mínima e Percentuais de IQ (Arts. 6º e 7º)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">RSC-I</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">10% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 10 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Destinado a servidor que não concluiu o ensino fundamental.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">RSC-II</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">15% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 15 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Mínimo de 2 critérios específicos. Certificado Ensino Fundamental.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">RSC-III</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">25% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 25 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Mínimo de 2 critérios específicos. Certificado Ensino Médio/Técnico.</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">RSC-IV</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">30% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 30 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Mínimo de 3 critérios (min. 1 dos incisos II, IV, V ou VI). Graduação.</p>
              </div>

              <div className="p-3.5 bg-white border-2 border-emerald-500/40 bg-emerald-50/20 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-800 text-white">RSC-V</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">52% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 52 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Mínimo de 5 critérios (min. 1 dos incisos IV, V ou VI). Lato Sensu.</p>
              </div>

              <div className="p-3.5 bg-white border-2 border-emerald-600/40 bg-emerald-50/30 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-white">RSC-VI</span>
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">75% IQ</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">Mínimo: 75 pontos</p>
                <p className="text-[11px] text-slate-600 mt-1">Mínimo de 7 critérios (obrigatório min. 1 do inciso VI). Mestrado.</p>
              </div>
            </div>
          </div>

          {/* Tabela dos Anexos I a VI */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-1.5 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Tabela de Pontuação por Requisito Legal (Anexos I a VI)
            </h3>
            <div className="space-y-3">
              {resolucaoIFS394.anexosTabela.map((anexo) => (
                <details key={anexo.anexo} className="bg-slate-50 border border-slate-200 rounded-xl group" open={anexo.anexo === 'ANEXO I' || anexo.anexo === 'ANEXO IV'}>
                  <summary className="p-3 font-bold text-slate-900 cursor-pointer flex items-center justify-between hover:bg-slate-100/60 rounded-xl">
                    <span className="text-xs sm:text-sm">{anexo.anexo} &bull; {anexo.requisito}</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {anexo.itens.length} critérios
                    </span>
                  </summary>
                  <div className="p-3 pt-0 border-t border-slate-200/60 overflow-x-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-200">
                          <th className="py-1.5 pr-2 w-10">Item</th>
                          <th className="py-1.5 px-2">Critério Específico</th>
                          <th className="py-1.5 px-2 w-48">Unidade de Medida</th>
                          <th className="py-1.5 pl-2 text-right w-20">Pontos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/50">
                        {anexo.itens.map((it) => (
                          <tr key={it.item} className="hover:bg-white/60">
                            <td className="py-1.5 pr-2 font-mono font-bold text-slate-700">Item {it.item}</td>
                            <td className="py-1.5 px-2 text-slate-800">{it.descricao}</td>
                            <td className="py-1.5 px-2 text-slate-500 font-mono text-[10px]">{it.unidade}</td>
                            <td className="py-1.5 pl-2 text-right font-bold text-emerald-700">
                              {it.pontos.toFixed(1).replace('.', ',')}
                              {'pontosSubstituto' in it && (
                                <span className="block text-[10px] text-slate-400 font-normal">
                                  sub: {(it as any).pontosSubstituto.toFixed(1).replace('.', ',')}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Regras Importantes */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 text-amber-950">
            <h4 className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Diretrizes Fundamentais do Processo:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed text-amber-900">
              <li><strong>Banco de Pontos (Art. 7º, § 1º)</strong>: Toda pontuação excedente é cumulativa e aproveitada para requerimentos futuros nos níveis superiores.</li>
              <li><strong>Vedação de Bis in Idem (Art. 7º, § 2º)</strong>: Cada atividade/experiência só é considerada uma única vez, sendo vedada sobreposição entre critérios ou com Incentivo à Qualificação formal.</li>
              <li><strong>Efeitos Financeiros (Art. 19)</strong>: Incidem a partir da data de deferimento pela CRSC-PCCTAE, não retroagindo à data de autuação.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors"
          >
            Fechar Regulamento
          </button>
        </div>
      </div>
    </div>
  );
};
