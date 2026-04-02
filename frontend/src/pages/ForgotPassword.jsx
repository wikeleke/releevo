import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [demoLink, setDemoLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus('loading');
            const { data } = await api.post('/auth/forgotpassword', { email });
            setMessage(data.message);
            // En una app real con SMTP no se devuelve demoLink; aqui se usa para demo local.
            if (data.demoLink) setDemoLink(data.demoLink); 
            setStatus('success');
        } catch (err) {
            setMessage(err.response?.data?.message || 'No se pudo procesar la solicitud');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
                <div className="mb-4">
                    <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-marine transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a iniciar sesion
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className={`inline-flex justify-center items-center w-16 h-16 rounded-full mb-4 ${status === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {status === 'success' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Mail className="w-8 h-8 text-marine" />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Olvidaste tu contrasena?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        No te preocupes, te enviaremos instrucciones para restablecerla.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
                            <p className="font-medium">{message}</p>
                        </div>
                        {demoLink && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 text-left">
                                <p className="text-sm text-blue-800 font-bold mb-2">Entorno de demo para desarrollo</p>
                                <p className="text-xs text-blue-600 mb-3">Como el envio de correos esta simulado, aqui tienes el enlace generado para restablecer:</p>
                                <Link to={demoLink} className="inline-block w-full text-center py-2 px-4 bg-marine text-white text-sm font-bold rounded-lg hover:bg-blue-900 transition-colors">
                                    Haz clic aqui para restablecer contrasena (Demo)
                                </Link>
                            </div>
                        )}
                        <p className="text-sm text-gray-500">No recibiste el correo? <button onClick={() => setStatus('idle')} className="text-marine font-bold hover:underline">Haz clic para reenviar</button></p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status === 'error' && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm font-medium text-red-700">{message}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Correo electronico</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine sm:text-sm transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                disabled={status === 'loading'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || !email}
                            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all
                                ${status === 'loading' ? 'bg-blue-300 cursor-not-allowed' : 'bg-marine hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marine'}
                            `}
                        >
                            {status === 'loading' ? 'Enviando...' : 'Restablecer contrasena'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
