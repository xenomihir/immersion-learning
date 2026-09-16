'use client';
import { useState } from 'react';

export default function AIPopupCard({ score, brier, feedback }: { score: number, brier: number, feedback: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-parchment-base border border-cobalt-accent/30 text-cobalt-accent rounded-md hover:bg-cobalt-accent hover:text-white transition-colors font-ui-label-bold text-ui-label-sm whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-[16px]">visibility</span>
        View Note
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-deep/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-parchment-surface border border-subtle rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-subtle bg-surface-container-low">
              <div>
                <h3 className="font-headline-sm text-primary">Session AI Synthesis</h3>
                <p className="font-ui-label-sm text-on-surface-variant mt-1">Score: {score}/5 | Brier: {brier.toFixed(3)}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-on-surface-variant hover:text-primary transition-colors p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 font-body-md text-on-surface leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
              {feedback}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
