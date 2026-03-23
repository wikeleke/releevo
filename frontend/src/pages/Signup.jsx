import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [error, setError] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                        <UserPlus className="w-8 h-8 text-marine" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join Releevo to buy or sell businesses
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">I want to...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('buyer')}
                                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${role === 'buyer' ? 'border-marine bg-blue-50 text-marine' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                Buy Businesses
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('seller')}
                                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${role === 'seller' ? 'border-marine bg-blue-50 text-marine' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                                Sell a Business
                            </button>
                        </div>
                    </div>

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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine sm:text-sm transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-marine hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marine transition-all mt-6"
                    >
                        Create account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-marine hover:text-blue-800 transition-colors">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
