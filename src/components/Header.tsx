import React, { useState } from 'react';
import { Award, Download, BookOpen, FileText, Check } from 'lucide-react';
import { ProcessoRSC } from '../types';
import { mockDossiers } from '../data/mockDossiers';
import { exportProcessoToPdf } from '../utils/pdfExport';

interface HeaderProps {
  processo: ProcessoRSC;
  onOpenDecretoModal: () => void;
  onOpenExportModal: () => void;
  onSelectPreset: (id: string) => void;
  onNewBlankDossier: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  processo,
  onOpenDecretoModal,
  onOpenExportModal,
  onSelectPreset,
  onNewBlankDossier,
}) => {
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const handleQuickPdfDownload = () => {
    const res = exportProcessoToPdf(processo);
    if (res.success) {
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 2500);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shrink-0 font-bold shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                RSC-PCCTAE &bull; IFS
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded">
                Res. 394/2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Instrução de Processo SEI em Normas ABNT
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Profile Dropdown */}
          <div className="relative flex items-center">
            <select
              value={processo.id}
              onChange={(e) => {
                if (e.target.value === 'novo-em-branco') {
                  onNewBlankDossier();
                } else {
                  onSelectPreset(e.target.value);
                }
              }}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[220px] truncate"
            >
              {mockDossiers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.servidor.nome.split(' ')[0]} ({d.servidor.nivelRscSolicitado})
                </option>
              ))}
              <option value="novo-em-branco">
                + Novo Requerimento em Branco
              </option>
            </select>
          </div>

          <button
            id="btn-info-decreto"
            onClick={onOpenDecretoModal}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors hidden md:inline-flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Tabela de Pontos</span>
          </button>

          {/* Direct Quick PDF Button */}
          <button
            id="btn-quick-pdf"
            onClick={handleQuickPdfDownload}
            className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
            title="Baixar Dossiê Completo em PDF formatado nas normas ABNT"
          >
            {pdfDownloaded ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{pdfDownloaded ? 'PDF Baixado!' : 'Extrair em PDF (ABNT)'}</span>
            <span className="sm:hidden">{pdfDownloaded ? 'Baixado' : 'PDF'}</span>
          </button>

          {/* Full Export Modal Button */}
          <button
            id="btn-export-dossier"
            onClick={onOpenExportModal}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
