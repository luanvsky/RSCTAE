import React, { useState } from 'react';
import { Copy, Check, Download, FileText, ExternalLink } from 'lucide-react';
import { ProcessoRSC } from '../types';
import { generateSeiFormattedText, copySeiBlockToClipboard } from '../utils/seiClipboard';
import { exportProcessoToPdf, openProcessoPdfInNewTab } from '../utils/pdfExport';

interface DossieSeiViewProps {
  processo: ProcessoRSC;
  onOpenExportModal: () => void;
}

export const DossieSeiView: React.FC<DossieSeiViewProps> = ({ processo, onOpenExportModal }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const fullText = generateSeiFormattedText(processo);

  const handleCopyAll = () => {
    copySeiBlockToClipboard(fullText).then((ok) => {
      if (ok) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    });
  };

  const handleDirectDownloadPdf = () => {
    const res = exportProcessoToPdf(processo);
    if (res.success) {
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <span>Dossiê Consolidado para o SEI</span>
            <span className="text-[10px] font-normal lowercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
              Normas ABNT &bull; Resolução CS/IFS nº 394/2026
            </span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Copie o texto integral dos 4 blocos para colar no SEI ou extraia o documento formatado em PDF / Word.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct PDF Download Button */}
          <button
            onClick={handleDirectDownloadPdf}
            className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {pdfSuccess ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{pdfSuccess ? 'PDF Baixado!' : 'Extrair em PDF (ABNT)'}</span>
          </button>

          {/* Export Options Modal Button */}
          <button
            onClick={onOpenExportModal}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Outros Formatos (.doc / JSON)</span>
          </button>

          {/* Copy full text */}
          <button
            onClick={handleCopyAll}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copiado!' : 'Copiar Texto Completo'}</span>
          </button>
        </div>
      </div>

      {/* Text Output Box */}
      <div className="p-4 bg-slate-50/30 print:p-0 print:bg-transparent">
        {/* Screen Textarea */}
        <textarea
          readOnly
          value={fullText}
          rows={16}
          className="print:hidden w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-3 text-slate-800 outline-none leading-relaxed resize-y select-all shadow-2xs"
        />

        {/* Print-optimized formatted display (breaks cleanly across pages) */}
        <pre className="hidden print:block font-mono text-[10pt] text-black whitespace-pre-wrap leading-relaxed p-0 m-0 border-0 bg-transparent break-inside-auto">
          {fullText}
        </pre>
      </div>
    </div>
  );
};
