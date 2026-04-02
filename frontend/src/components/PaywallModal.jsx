import React from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';

const PaywallModal = ({ onClose }) => {
    const handleUpgrade = () => {
        // TODO: Integrate with a real payment flow (e.g. Stripe)
        alert('La mejora a membresia avanzada estara disponible pronto.');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="bg-marine text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300 via-marine to-marine pointer-events-none"></div>
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-md relative z-10">
                        <Lock className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2 relative z-10 tracking-tight">Se requiere acceso avanzado</h2>
                    <p className="text-blue-100/90 font-medium relative z-10">Desbloquea datos confidenciales del negocio</p>
                </div>

                <div className="p-8">
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start">
                            <ShieldCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">Ver el nombre legal real del negocio</span>
                        </li>
                        <li className="flex items-start">
                            <ShieldCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">Acceder a la direccion exacta</span>
                        </li>
                        <li className="flex items-start">
                            <ShieldCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">Obtener datos directos de contacto del dueno</span>
                        </li>
                    </ul>

                    <button
                        onClick={handleUpgrade}
                        className="w-full bg-marine text-white py-4 rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-lg flex justify-center items-center group"
                    >
                        <Lock className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Mejorar membresia
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-5">
                        Los planes avanzados inician desde $29/mes. Cancela en cualquier momento.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaywallModal;
