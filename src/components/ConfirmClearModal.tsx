import React from 'react';
import { Trash2, AlertTriangle, X, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface ConfirmClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serverName?: string;
  comprovantesCount?: number;
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serverName,
  comprovantesCount = 0,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Limpar Todos os Dados
              </h3>
              <p className="text-xs text-rose-800 font-medium">
                Atenção: Esta ação reinicia o formulário para um estado em branco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Você está prestes a limpar todos os campos preenchidos nos <strong>4 blocos</strong> do processo de RSC:
          </p>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">&bull;</span>
              <span><strong>Bloco 1 (Requerimento):</strong> Nome, SIAPE, Cargo, Campus, Lotação e Contatos.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">&bull;</span>
              <span><strong>Bloco 2 (Memorial):</strong> Todos os textos circunstanciados da trajetória e saberes.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">&bull;</span>
              <span>
                <strong>Bloco 3 (Comprovantes):</strong>{' '}
                {comprovantesCount > 0 ? (
                  <span className="text-rose-700 font-semibold">{comprovantesCount} item(ns) indexado(s) e pontuação acumulada</span>
                ) : (
                  'Toda a indexação e pontuação'
                )}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">&bull;</span>
              <span><strong>Bloco 4 (Declarações):</strong> Termos de veracidade, conformidade e não-acúmulo.</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Caso queira alternar entre perfis de exemplo já configurados, você também pode usar o seletor de modelos no cabeçalho.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            id="btn-confirm-clear-all"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sim, Limpar Tudo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
