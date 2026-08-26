import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Copy,
  Check,
  Printer,
  FileSpreadsheet,
  FileCode,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ProcessoRSC } from '../types';
import { exportProcessoToPdf, openProcessoPdfInNewTab } from '../utils/pdfExport';
import { exportProcessoToWord } from '../utils/wordExport';
import { generateSeiFormattedText, copySeiBlockToClipboard } from '../utils/seiClipboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  processo: ProcessoRSC;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  processo,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'info' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleDownloadPdf = () => {
    const result = exportProcessoToPdf(processo);
    if (result.success) {
      showToast('success', `PDF no formato ABNT gerado com sucesso! Arquivo: ${result.filename}`);
    } else {
      showToast('error', 'Não foi possível iniciar o download automático do PDF. Tentando abrir em nova aba...');
      openProcessoPdfInNewTab(processo);
    }
  };

  const handleOpenPdfNewTab = () => {
    const ok = openProcessoPdfInNewTab(processo);
    if (ok) {
      showToast('info', 'PDF ABNT aberto em nova aba para visualização e impressão.');
    } else {
      showToast('error', 'Verifique se o seu navegador não bloqueou a abertura de popups.');
    }
  };

  const handleDownloadWord = () => {
    exportProcessoToWord(processo);
    showToast('success', 'Documento Word (.doc) em conformidade ABNT baixado com sucesso!');
  };

  const handleCopyFullSei = () => {
    const fullText = generateSeiFormattedText(processo);
    copySeiBlockToClipboard(fullText).then((ok) => {
      if (ok) {
        setCopiedAll(true);
        showToast('success', 'Texto integral dos 4 Blocos copiado para a área de transferência!');
        setTimeout(() => setCopiedAll(false), 2500);
      } else {
        showToast('error', 'Falha ao copiar texto.');
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(processo, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dossie_RSC_${processo.servidor.matriculaSiape || 'Servidor'}_Backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('success', 'Backup JSON exportado com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Download className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Exportar Dossiê & Memorial (Normas ABNT)</h2>
              <p className="text-xs text-slate-400">
                Resolução CS/IFS nº 394/2026 &bull; Decreto nº 13.048/2026 &bull; Formatação ABNT NBR 14724
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div
            className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : feedbackMessage.type === 'info'
                ? 'bg-blue-50 text-blue-800 border-b border-blue-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedbackMessage.type === 'info' ? (
              <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Direct PDF Download (ABNT) */}
            <div
              onClick={handleDownloadPdf}
              className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/20 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Baixar PDF Oficial (ABNT)</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Margens 3cm/2cm, Times New Roman, cabeçalho federal, memorial e tabelas de comprovantes.
                </p>
              </div>
            </div>

            {/* View/Print PDF in New Tab */}
            <div
              onClick={handleOpenPdfNewTab}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Visualizar PDF em Nova Aba</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Abre o PDF completo no navegador para visualização direta, impressão ou download manual.
                </p>
              </div>
            </div>

            {/* Word DOCX Option */}
            <div
              onClick={handleDownloadWord}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Documento Word (.doc ABNT)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arquivo editável com estilos de títulos, recuo de 1,25cm, entrelinhas 1,5 e assinatura.
                </p>
              </div>
            </div>

            {/* Copy Full SEI Text */}
            <div
              onClick={handleCopyFullSei}
              className="p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/30 cursor-pointer transition-all flex items-start space-x-3 group"
            >
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {copiedAll ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {copiedAll ? 'Copiado para Área de Transferência!' : 'Copiar Texto p/ SEI'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Texto consolidado dos 4 Blocos para colar direto no editor do SEI.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Actions: JSON Backup & Quick Print */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <FileCode className="w-4 h-4 text-slate-500" />
              <span>Exportar Backup (JSON)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir Tela Atual</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Todos os documentos seguem a Resolução CS/IFS nº 394/2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
