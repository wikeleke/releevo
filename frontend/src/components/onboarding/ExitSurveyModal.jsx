import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const OPTIONS = [
  {
    code: 'not_ready',
    emoji: '⏰',
    label: 'Aún no estoy listo para avanzar con la venta',
  },
  {
    code: 'elsewhere',
    emoji: '👋',
    label: 'Prefiero explorar opciones fuera de esta plataforma',
  },
  {
    code: 'privacy',
    emoji: '🤨',
    label: 'Tengo reservas sobre cómo se usarán mis datos',
  },
  {
    code: 'be_back',
    emoji: '👍',
    label: 'Todo en orden; regreso más tarde a terminar',
  },
];

export function ExitSurveyModal({ open, onClose, onAfterExit }) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const finish = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await api.post('/users/onboarding/exit-feedback', {
        reasonCode: selected,
        step: 'seller-company',
      });
      onAfterExit?.();
    } catch {
      alert('No se pudo registrar tu respuesta. Puedes salir igualmente.');
      onAfterExit?.();
    } finally {
      setSubmitting(false);
      setSelected(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-survey-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-[#E8E9EF]">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#5C5D6B] hover:bg-[#F0F1F6] transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h2 id="exit-survey-title" className="text-xl font-extrabold text-[#111124] pr-10 mb-2">
            ¿Todo bien?
          </h2>
          <p className="text-sm text-[#5C5D6B] font-medium mb-6">
            Cuéntanos qué pasó para mejorar la experiencia la próxima vez.
          </p>

          <div className="space-y-3 mb-8">
            {OPTIONS.map((opt) => {
              const isSel = selected === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setSelected(opt.code)}
                  className={`w-full text-left rounded-xl px-4 py-3.5 border-2 border-dashed transition-colors flex items-start gap-3 ${
                    isSel
                      ? 'border-[#5764FF] bg-[#F8F9FE]'
                      : 'border-[#D9DAE3] hover:border-[#111124]/40 bg-white'
                  }`}
                >
                  <span className="text-xl leading-none shrink-0" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="text-sm font-semibold text-[#111124] leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                onClose();
              }}
              className="px-5 py-3 rounded-xl font-semibold text-[#5C5D6B] border border-[#E8E9EF] hover:bg-[#F8F9FE]"
            >
              Seguir aquí
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={!selected || submitting}
              className="px-5 py-3 rounded-xl font-semibold text-white bg-[#111124] hover:bg-[#1f1f3a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Guardando…' : 'Salir y enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
