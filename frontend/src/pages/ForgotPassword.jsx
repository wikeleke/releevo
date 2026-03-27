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
            // In a real app with SMTP, you wouldn't return the demoLink, but for our local demo we do
            if (data.demoLink) setDemoLink(data.demoLink); 
            setStatus('success');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to process request');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
                <div className="mb-4">
                    <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-marine transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className={`inline-flex justify-center items-center w-16 h-16 rounded-full mb-4 ${status === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {status === 'success' ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Mail className="w-8 h-8 text-marine" />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot password?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
                            <p className="font-medium">{message}</p>
                        </div>
                        {demoLink && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 text-left">
                                <p className="text-sm text-blue-800 font-bold mb-2">Development Demo Environment</p>
                                <p className="text-xs text-blue-600 mb-3">Since email setup is mocked for development, here is your auto-generated reset link:</p>
                                <Link to={demoLink} className="inline-block w-full text-center py-2 px-4 bg-marine text-white text-sm font-bold rounded-lg hover:bg-blue-900 transition-colors">
                                    Click here to reset password (Demo)
                                </Link>
                            </div>
                        )}
                        <p className="text-sm text-gray-500">Didn't receive the email? <button onClick={() => setStatus('idle')} className="text-marine font-bold hover:underline">Click to resend</button></p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status === 'error' && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm font-medium text-red-700">{message}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine sm:text-sm transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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
                            {status === 'loading' ? 'Sending...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
