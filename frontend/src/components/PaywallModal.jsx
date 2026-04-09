import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, X } from 'lucide-react';

const PaywallModal = ({ onClose, pricingPath = '/pricing/buyers' }) => {
    const navigate = useNavigate();

    const handleAcquireMembership = () => {
        onClose();
        navigate(pricingPath);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-line bg-white shadow-pd-dropdown">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 text-white/90 transition-colors hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="relative overflow-hidden bg-brand-900 px-8 pb-8 pt-10 text-center text-white">
                    <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-brand-900 to-brand-900" />
                    <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white/15">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="relative z-10 mb-2 text-xl font-semibold tracking-tight">Se requiere acceso avanzado</h2>
                    <p className="relative z-10 text-[15px] font-normal text-white/90">Desbloquea datos confidenciales del negocio</p>
                </div>

                <div className="p-8">
                    <ul className="mb-8 space-y-3.5">
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <span className="text-[15px] font-medium leading-snug text-dark-700">Ver el nombre legal real del negocio</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <span className="text-[15px] font-medium leading-snug text-dark-700">Acceder a la direccion exacta</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <span className="text-[15px] font-medium leading-snug text-dark-700">Obtener datos directos de contacto del dueno</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <span className="text-[15px] font-medium leading-snug text-dark-700">Contactar al vendedor</span>
                        </li>
                    </ul>

                    <button
                        type="button"
                        onClick={handleAcquireMembership}
                        className="group flex w-full items-center justify-center rounded-xl bg-marine py-4 font-bold text-white shadow-lg transition-colors hover:bg-blue-900"
                    >
                        <Lock className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Adquirir membresia
                    </button>

                    <p className="mt-5 text-center text-xs leading-relaxed text-dark-300">
                        Membresía comprador: <span className="font-semibold text-dark-500">$3,499 MXN al año</span>.
                        Puedes cancelar la renovación cuando quieras.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaywallModal;
