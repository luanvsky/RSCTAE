import React, { useState } from 'react';
import { Copy, Check, FileText, Sparkles, BookOpen } from 'lucide-react';
import { MemorialDescritivo, ServidorInfo } from '../types';
import { copySeiBlockToClipboard } from '../utils/seiClipboard';

interface Bloco3Props {
  memorial: MemorialDescritivo;
  servidor: ServidorInfo;
  onUpdateMemorial: (novoMemorial: MemorialDescritivo) => void;
}

export const Bloco3Memorial: React.FC<Bloco3Props> = ({
  memorial,
  servidor,
  onUpdateMemorial,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySei = () => {
    const text = `BLOCO 3: MEMORIAL DESCRITIVO CIRCUNSTANCIADO (RESOLUÇÃO CS/IFS Nº 394/2026)
Servidor(a): ${servidor.nome} | Matrícula SIAPE: ${servidor.matriculaSiape}
Nível de RSC Pleiteado: ${servidor.nivelRscSolicitado} (${servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'})

1. APRESENTAÇÃO E TRAJETÓRIA PROFISSIONAL:
${memorial.apresentacaoTrajetoria}

2. DESENVOLVIMENTO DE SABERES E ATIVIDADES NOS EIXOS NORMATIVOS:
${memorial.desenvolvimentoSaberes}

3. IMPACTO E CONTRIBUIÇÃO INSTITUCIONAL NO ÂMBITO DO SERVIÇO PÚBLICO:
${memorial.impactoInstitucional}

4. CONCLUSÃO E PEDIDO DE CONCESSÃO:
${memorial.conclusao || 'Submeto o presente Memorial à Comissão Especial de RSC-PCCTAE, pugnando pelo deferimento do pleito.'}`;

    copySeiBlockToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleChange = (field: keyof MemorialDescritivo, value: string) => {
    onUpdateMemorial({
      ...memorial,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              2. Memorial Descritivo Circunstanciado
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              Bloco 3 SEI • Resolução CS/IFS 394/2026
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Relato reflexivo da trajetória, saberes mobilizados e impacto institucional
          </p>
        </div>

        <button
          onClick={handleCopySei}
          className="text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copiado!' : 'Copiar p/ SEI'}</span>
        </button>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">
              1. Apresentação e Trajetória Profissional
            </label>
            <span className="text-[10px] text-slate-400">Ingresso, lotações, histórico funcional e objetivos</span>
          </div>
          <textarea
            rows={4}
            value={memorial.apresentacaoTrajetoria ?? ''}
            onChange={(e) => handleChange('apresentacaoTrajetoria', e.target.value)}
            placeholder="Descreva seu histórico de ingresso no IFS, áreas de lotação e visão geral da atuação..."
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">
              2. Desenvolvimento de Saberes e Atividades nos Eixos Normativos (Anexos I a VI)
            </label>
            <span className="text-[10px] text-slate-400">Detalhamento dos requisitos I, II, III, IV, V e VI</span>
          </div>
          <textarea
            rows={6}
            value={memorial.desenvolvimentoSaberes ?? ''}
            onChange={(e) => handleChange('desenvolvimentoSaberes', e.target.value)}
            placeholder="Detalhe suas atividades comprovadas: comissões, sistemas operados, contratos fiscalizados, cargos/funções e produções..."
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800 font-mono text-[11px]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">
              3. Impacto Institucional e Geração de Valor Público
            </label>
            <span className="text-[10px] text-slate-400">Resultados práticos para a comunidade acadêmica e IFE</span>
          </div>
          <textarea
            rows={4}
            value={memorial.impactoInstitucional ?? ''}
            onChange={(e) => handleChange('impactoInstitucional', e.target.value)}
            placeholder="Aponte os ganhos de conformidade, melhorias processuais, economia de recursos ou inovações geradas..."
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">
              4. Conclusão e Pedido Formal
            </label>
          </div>
          <textarea
            rows={2}
            value={memorial.conclusao ?? ''}
            onChange={(e) => handleChange('conclusao', e.target.value)}
            placeholder="Conclusão formal dirigida à Comissão Especial de RSC-PCCTAE..."
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
