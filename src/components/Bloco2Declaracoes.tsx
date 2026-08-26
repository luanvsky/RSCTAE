import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { DeclaracoesConformidade, ServidorInfo } from '../types';
import { copySeiBlockToClipboard } from '../utils/seiClipboard';

interface Bloco2Props {
  declaracoes: DeclaracoesConformidade;
  servidor: ServidorInfo;
  onUpdateDeclaracoes: (novasDeclaracoes: DeclaracoesConformidade) => void;
}

export const Bloco2Declaracoes: React.FC<Bloco2Props> = ({
  declaracoes,
  servidor,
  onUpdateDeclaracoes,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySei = () => {
    const text = `BLOCO 2: TERMO DE DECLARAÇÕES E CONFORMIDADE LEGAL (RESOLUÇÃO CS/IFS Nº 394/2026)
Servidor(a): ${servidor.nome} | Matrícula SIAPE: ${servidor.matriculaSiape}
Nível Requerido: ${servidor.nivelRscSolicitado}

1. DECLARAÇÃO DE VERACIDADE DOCUMENTAL:
${declaracoes.declaracaoVeracidade}

2. DECLARAÇÃO DE CONFORMIDADE COM A RESOLUÇÃO CS/IFS Nº 394/2026:
${declaracoes.declaracaoConformidade}

3. DECLARAÇÃO DE NÃO DUPLICIDADE (VEDAÇÃO DE BIS IN IDEM - ART. 7º, § 2º):
${declaracoes.declaracaoNaoAcumulo}

4. DECLARAÇÃO DE CIÊNCIA DOS EFEITOS FINANCEIROS E RITO PROCEDIMENTAL (ART. 19):
${declaracoes.declaracaoCienciaRegulamento}`;

    copySeiBlockToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleChange = (field: keyof DeclaracoesConformidade, value: string) => {
    onUpdateDeclaracoes({
      ...declaracoes,
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
              4. Termo de Declarações e Compromisso Legal
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              Bloco 2 SEI • Resolução CS/IFS 394/2026
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Declarações sob as penas da lei (art. 299 CP) de veracidade, conformidade e não duplicidade
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

      {/* Inputs */}
      <div className="p-4 space-y-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              1. Declaração de Veracidade e Fé Pública
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Art. 299 CP / Lei 8.112/1990</span>
          </div>
          <textarea
            rows={3}
            value={declaracoes.declaracaoVeracidade ?? ''}
            onChange={(e) => handleChange('declaracaoVeracidade', e.target.value)}
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              2. Declaração de Pleno Enquadramento à Resolução CS/IFS nº 394/2026
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Arts. 6º e 7º da Resolução</span>
          </div>
          <textarea
            rows={3}
            value={declaracoes.declaracaoConformidade ?? ''}
            onChange={(e) => handleChange('declaracaoConformidade', e.target.value)}
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              3. Declaração de Não Duplicidade (Vedação de Bis in Idem)
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Art. 7º, § 2º da Resolução</span>
          </div>
          <textarea
            rows={3}
            value={declaracoes.declaracaoNaoAcumulo ?? ''}
            onChange={(e) => handleChange('declaracaoNaoAcumulo', e.target.value)}
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              4. Declaração de Ciência dos Efeitos Financeiros e Tramitação na CRSC
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Art. 19 da Resolução</span>
          </div>
          <textarea
            rows={3}
            value={declaracoes.declaracaoCienciaRegulamento ?? ''}
            onChange={(e) => handleChange('declaracaoCienciaRegulamento', e.target.value)}
            className="w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
