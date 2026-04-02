import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { KeyRound, ArrowRight, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Las contrasenas no coinciden');
            return;
        }

        try {
            setStatus('loading');
            const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
            setMessage(data.message);
            setStatus('success');
        } catch (err) {
            setMessage(err.response?.data?.message || 'No se pudo restablecer la contrasena');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className={`inline-flex justify-center items-center w-16 h-16 rounded-full mb-4 ${status === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {status === 'success' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <KeyRound className="w-8 h-8 text-marine" />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Establecer nueva contrasena</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {status === 'success' ? 'Tu contrasena se restablecio correctamente.' : 'Ingresa tu nueva contrasena a continuacion.'}
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
                            <p className="font-bold">{message}</p>
                        </div>
                        <Link 
                            to="/login"
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-marine hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marine transition-all"
                        >
                            Continuar al inicio de sesion <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status === 'error' && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm font-medium text-red-700">{message}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">Nueva contrasena</label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength="6"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine sm:text-sm transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={status === 'loading'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirmar contrasena</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength="6"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine sm:text-sm transition-colors"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={status === 'loading'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || !password || !confirmPassword}
                            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all
                                ${status === 'loading' ? 'bg-blue-300 cursor-not-allowed' : 'bg-marine hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marine'}
                            `}
                        >
                            {status === 'loading' ? 'Restableciendo...' : 'Restablecer contrasena'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
