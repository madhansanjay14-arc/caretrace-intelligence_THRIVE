import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  text: string;
}

export const Toast: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isAlert = t.type === 'alert';

        const bgClass = isAlert
          ? 'bg-[#0D1B2A] text-white border-[#FF5C5C]'
          : isSuccess
          ? 'bg-[#0D1B2A] text-[#F8FAFC] border-[#22D3EE]'
          : 'bg-[#0D1B2A] text-[#F8FAFC] border-[#1E293B]';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded border shadow-2xl backdrop-blur-xl flex items-start gap-2.5 animate-in slide-in-from-bottom-3 duration-200 font-mono ${bgClass}`}
          >
            {isAlert ? (
              <AlertTriangle className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs leading-tight">
              {t.text}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#94A3B8] hover:text-white shrink-0 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
