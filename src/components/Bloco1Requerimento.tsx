import React, { useState } from 'react';
import { Copy, Check, Info, Calendar, Phone, Award } from 'lucide-react';
import { ServidorInfo } from '../types';
import { copySeiBlockToClipboard } from '../utils/seiClipboard';

interface Bloco1Props {
  servidor: ServidorInfo;
  onUpdateServidor: (novoServidor: ServidorInfo) => void;
}

export const Bloco1Requerimento: React.FC<Bloco1Props> = ({ servidor, onUpdateServidor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySei = () => {
    const text = `BLOCO 1: REQUERIMENTO PADRÃO DE RSC-PCCTAE (RESOLUÇÃO CS/IFS Nº 394/2026)
- Servidor(a): ${servidor.nome}
- Matrícula SIAPE: ${servidor.matriculaSiape}
- Cargo Efetivo: ${servidor.cargo} (Nível/Classe: ${servidor.nivelCargo})
- Data de Ingresso em IFE: ${servidor.dataIngressoIFE || '28/02/2018'}
- Lotação: ${servidor.lotacao} - ${servidor.campus}
- Função/Encargo Atual: ${servidor.funcaoOuEncargoAtual || 'Não informado'}
- E-mail Institucional: ${servidor.email} | Telefone: ${servidor.telefone || 'Não informado'}
- Nível de RSC Pleiteado: ${servidor.nivelRscSolicitado} (${servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'})
- Tramitação Prioritária (Art. 69-A Lei 9.784/1999): ${servidor.tramitacaoPrioritaria ? 'Sim' : 'Não'}

SOLICITAÇÃO FORMAL:
Requeiro a concessão do Reconhecimento de Saberes e Competências (${servidor.nivelRscSolicitado}) aos servidores do PCCTAE no âmbito do Instituto Federal de Sergipe (IFS), com fulcro na Resolução CS/IFS nº 394/2026 e no Decreto nº 13.048/2026.`;

    copySeiBlockToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleChange = (field: keyof ServidorInfo, value: any) => {
    const updated = { ...servidor, [field]: value };
    if (field === 'nivelRscSolicitado') {
      if (value === 'RSC-I') updated.equivalenciaTitulacao = 'Sem Ensino Fundamental (IQ: 10% • Mín. 10 pts)';
      else if (value === 'RSC-II') updated.equivalenciaTitulacao = 'Ensino Fundamental (IQ: 15% • Mín. 15 pts e 2 critérios)';
      else if (value === 'RSC-III') updated.equivalenciaTitulacao = 'Ensino Médio/Técnico (IQ: 25% • Mín. 25 pts e 2 critérios)';
      else if (value === 'RSC-IV') updated.equivalenciaTitulacao = 'Graduação (IQ: 30% • Mín. 30 pts e 3 critérios)';
      else if (value === 'RSC-V') updated.equivalenciaTitulacao = 'Pós-Graduação Lato Sensu (IQ: 52% • Mín. 52 pts e 5 critérios)';
      else if (value === 'RSC-VI') updated.equivalenciaTitulacao = 'Mestrado (IQ: 75% • Mín. 75 pts e 7 critérios)';
    }
    onUpdateServidor(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            1. Formulário Padrão de Requerimento
          </h2>
          <p className="text-[11px] text-slate-500">
            Identificação funcional e enquadramento nos termos da Resolução CS/IFS nº 394/2026
          </p>
        </div>

        <button
          onClick={handleCopySei}
          className="text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copiado!' : 'Copiar p/ SEI'}</span>
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome Completo</label>
            <input
              type="text"
              value={servidor.nome ?? ''}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Ex: Victor César Santos de Melo"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Matrícula SIAPE</label>
            <input
              type="text"
              value={servidor.matriculaSiape ?? ''}
              onChange={(e) => handleChange('matriculaSiape', e.target.value)}
              placeholder="Ex: 3011216"
              className="w-full px-2.5 py-1.5 font-mono bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cargo Efetivo</label>
            <input
              type="text"
              value={servidor.cargo ?? ''}
              onChange={(e) => handleChange('cargo', e.target.value)}
              placeholder="Ex: Técnico em Secretariado"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Classe / Nível</label>
            <input
              type="text"
              value={servidor.nivelCargo ?? ''}
              onChange={(e) => handleChange('nivelCargo', e.target.value)}
              placeholder="Ex: Classe D"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Data de Ingresso em IFE</label>
            <input
              type="text"
              value={servidor.dataIngressoIFE ?? ''}
              onChange={(e) => handleChange('dataIngressoIFE', e.target.value)}
              placeholder="Ex: 28/02/2018"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Campus / Unidade</label>
            <input
              type="text"
              value={servidor.campus ?? ''}
              onChange={(e) => handleChange('campus', e.target.value)}
              placeholder="Ex: Reitoria - IFS"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lotação / Setor</label>
            <input
              type="text"
              value={servidor.lotacao ?? ''}
              onChange={(e) => handleChange('lotacao', e.target.value)}
              placeholder="Ex: Coordenadoria Geral da Conformidade de Registro de Gestão"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Função / Encargo Atual</label>
            <input
              type="text"
              value={servidor.funcaoOuEncargoAtual ?? ''}
              onChange={(e) => handleChange('funcaoOuEncargoAtual', e.target.value)}
              placeholder="Ex: FG-02 (Coordenador)"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-mail Institucional</label>
            <input
              type="email"
              value={servidor.email ?? ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ex: victor.melo@ifs.edu.br"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Telefone / Contato</label>
            <input
              type="text"
              value={servidor.telefone ?? ''}
              onChange={(e) => handleChange('telefone', e.target.value)}
              placeholder="Ex: (79) 99832-4660"
              className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nível de RSC Pleiteado</label>
            <select
              value={servidor.nivelRscSolicitado ?? 'RSC-V'}
              onChange={(e) => handleChange('nivelRscSolicitado', e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-emerald-50/70 font-semibold text-emerald-950 border border-emerald-300 rounded-lg outline-none focus:bg-white focus:border-emerald-500"
            >
              <option value="RSC-I">RSC-I &bull; Sem Fundamental (10% IQ • Mín. 10 pts)</option>
              <option value="RSC-II">RSC-II &bull; Ensino Fundamental (15% IQ • Mín. 15 pts / 2 crit.)</option>
              <option value="RSC-III">RSC-III &bull; Ensino Médio/Técnico (25% IQ • Mín. 25 pts / 2 crit.)</option>
              <option value="RSC-IV">RSC-IV &bull; Graduação (30% IQ • Mín. 30 pts / 3 crit.)</option>
              <option value="RSC-V">RSC-V &bull; Lato Sensu / Especialização (52% IQ • Mín. 52 pts / 5 crit.)</option>
              <option value="RSC-VI">RSC-VI &bull; Mestrado (75% IQ • Mín. 75 pts / 7 crit.)</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={servidor.tramitacaoPrioritaria ?? false}
                onChange={(e) => handleChange('tramitacaoPrioritaria', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>Tramitação prioritária (Art. 69-A Lei 9.784/1999)</span>
            </label>
          </div>
        </div>

        {/* Text preview */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Texto Oficial do Requerimento SEI: </span>
          &ldquo;Requeiro à Comissão para Reconhecimento de Saberes e Competências (CRSC-PCCTAE) a concessão do <strong>{servidor.nivelRscSolicitado}</strong> ({servidor.equivalenciaTitulacao || 'Resolução CS/IFS nº 394/2026'}), instruído com memorial descritivo e pasta comprobatória indexada.&rdquo;
        </div>
      </div>
    </div>
  );
};
