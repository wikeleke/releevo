import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, TrendingUp, Users, CheckCircle, Briefcase } from 'lucide-react';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';

const mockBusinesses = [
    {
        _id: 'mock-1',
        title: 'Cafetería de Especialidad en el Centro',
        slug: 'cafeteria-especialidad-centro',
        description: 'Excelente oportunidad para adquirir una cafetería con clientela establecida y equipo de alta gama en pleno centro de la ciudad.',
        location: { city: 'Ciudad de México', state: 'CDMX' },
        financials: { askingPrice: 1500000, annualRevenue: 2500000, annualProfit: 600000 },
        category: 'Alimentos y bebidas',
        status: 'published'
    },
    {
        _id: 'mock-2',
        title: 'Ferretería con 20 Años de Historia',
        slug: 'ferreteria-20-anos-historia',
        description: 'Negocio noble y estable. Maneja un inventario extenso y cuenta con proveedores directos de fábrica.',
        location: { city: 'Guadalajara', state: 'Jalisco' },
        financials: { askingPrice: 3200000, annualRevenue: 4000000, annualProfit: 950000 },
        category: 'Retail',
        status: 'published'
    },
    {
        _id: 'mock-3',
        title: 'Gimnasio Totalmente Equipado',
        slug: 'gimnasio-totalmente-equipado',
        description: 'Gimnasio llave en mano operando con más de 300 socios activos. Remodelado recientemente.',
        location: { city: 'Monterrey', state: 'Nuevo León' },
        financials: { askingPrice: 2800000, annualRevenue: 1800000, annualProfit: 800000 },
        category: 'Servicios',
        status: 'published'
    }
];

const Home = () => {
    const [recentBusinesses, setRecentBusinesses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const { data } = await api.get('/business');
                if (data && data.length > 0) {
                    setRecentBusinesses(data.slice(0, 3));
                } else {
                    setRecentBusinesses(mockBusinesses);
                }
            } catch (err) {
                console.error('Error fetching recent businesses:', err);
                setRecentBusinesses(mockBusinesses);
            }
        };
        fetchRecent();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?city=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/marketplace');
        }
    };

    return (
        <div className="bg-white">
            {/* HEROS SECTION - Acquire.com Style */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden border-b border-light-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100 opacity-50 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-brand-300 opacity-20 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-brand-900 bg-brand-100 mb-8 border border-brand-300">
                        <span className="flex w-2 h-2 rounded-full bg-brand-700 mr-2"></span>
                        El mercado #1 de negocios en México
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-dark-900 tracking-tight mb-6 leading-tight max-w-5xl mx-auto">
                        Compra y vende negocios rentables, <span className="text-brand-900">sin complicaciones.</span>
                    </h1>

                    <p className="text-xl text-dark-500 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Conectamos a emprendedores con negocios tradicionales verificados. Despídete de los procesos opacos y comisiones excesivas. Total privacidad y transparencia garantizada.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link to="/marketplace" className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full text-white bg-brand-900 hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-300/50 hover:-translate-y-0.5">
                            Ver negocios en venta
                        </Link>
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-full text-brand-900 bg-white border-2 border-brand-100 hover:border-brand-300 hover:bg-brand-100/50 transition-all">
                            Vender mi negocio
                        </Link>
                    </div>

                    <p className="text-sm font-medium text-dark-300">
                        Únete a más de <strong className="text-dark-700">10,000+</strong> emprendedores e inversionistas en México.
                    </p>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-12 bg-light-100 border-b border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-light-400">
                        <div className="px-4">
                            <div className="text-3xl font-extrabold text-brand-900 mb-1">$500M+</div>
                            <div className="text-sm font-semibold text-dark-500">Valor en listados</div>
                        </div>
                        <div className="px-4">
                            <div className="text-3xl font-extrabold text-brand-900 mb-1">1,200+</div>
                            <div className="text-sm font-semibold text-dark-500">Negocios vendidos</div>
                        </div>
                        <div className="px-4">
                            <div className="text-3xl font-extrabold text-brand-900 mb-1">30k+</div>
                            <div className="text-sm font-semibold text-dark-500">Compradores verificados</div>
                        </div>
                        <div className="px-4">
                            <div className="text-3xl font-extrabold text-brand-900 mb-1">98%</div>
                            <div className="text-sm font-semibold text-dark-500">Tasa de éxito</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-dark-900 mb-4 tracking-tight">Un proceso diseñado para el éxito</h2>
                        <p className="text-lg text-dark-500">La forma más inteligente de transaccionar negocios en la República Mexicana.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="relative p-8 bg-brand-100/30 rounded-3xl border border-brand-100 hover:bg-brand-100/60 transition-colors">
                            <div className="w-14 h-14 bg-brand-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-brand-300">
                                <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-3">1. Descubre y Filtra</h3>
                            <p className="text-dark-500 leading-relaxed">Encuentra negocios rentables filtrando por métricas financieras, ubicación geográfica o industria. Información clave al instante.</p>
                        </div>
                        <div className="relative p-8 bg-brand-100/30 rounded-3xl border border-brand-100 hover:bg-brand-100/60 transition-colors">
                            <div className="w-14 h-14 bg-brand-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-brand-300">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-3">2. Analiza con Privacidad</h3>
                            <p className="text-dark-500 leading-relaxed">Accede a nuestro plan avanzado para ver datos financieros, contactos verificados, nombre legal y ubicacion exacta bajo estrictos acuerdos de confidencialidad.</p>
                        </div>
                        <div className="relative p-8 bg-brand-100/30 rounded-3xl border border-brand-100 hover:bg-brand-100/60 transition-colors">
                            <div className="w-14 h-14 bg-brand-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-brand-300">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-3">3. Conecta Directamente</h3>
                            <p className="text-dark-500 leading-relaxed">Inicia conversaciones directamente con los dueños sin intermediarios costosos. Cierra el trato bajo tus propios términos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-light-100 border-t border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-dark-900 mb-6 tracking-tight">Historias de éxito reales</h2>
                        <p className="text-xl text-dark-500 max-w-2xl mx-auto">Emprendedores reales que compraron o vendieron negocios a través de Releevo.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="p-10 bg-white rounded-3xl border border-light-400 relative hover:shadow-lg transition-shadow">
                            <div className="text-brand-500 mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.017 21L16.411 14.283C14.122 14.283 12.333 12.441 12.333 10.083C12.333 7.725 14.122 5.883 16.411 5.883C18.7 5.883 20.489 7.725 20.489 10.083C20.489 11.233 19.989 12.333 19.344 13.25L16.5 21H14.017ZM5.528 21L7.922 14.283C5.633 14.283 3.844 12.441 3.844 10.083C3.844 7.725 5.633 5.883 7.922 5.883C10.211 5.883 12 7.725 12 10.083C12 11.233 11.5 12.333 10.856 13.25L8.011 21H5.528Z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-dark-800 mb-8 leading-relaxed">"Releevo hizo que vender mi restaurante en la Roma fuera increíblemente fácil. Encontramos al comprador ideal en menos de 45 días sin pagar comisiones ridículas a brokers tradicionales."</p>
                            <div className="flex items-center">
                                <div className="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-900 mr-4 border border-brand-300">
                                    CM
                                </div>
                                <div>
                                    <p className="font-extrabold text-dark-900 text-lg">Carlos Mendoza</p>
                                    <p className="text-brand-900 font-medium">Ex-dueño de Restaurante</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="p-10 bg-white rounded-3xl border border-light-400 relative hover:shadow-lg transition-shadow">
                            <div className="text-brand-500 mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.017 21L16.411 14.283C14.122 14.283 12.333 12.441 12.333 10.083C12.333 7.725 14.122 5.883 16.411 5.883C18.7 5.883 20.489 7.725 20.489 10.083C20.489 11.233 19.989 12.333 19.344 13.25L16.5 21H14.017ZM5.528 21L7.922 14.283C5.633 14.283 3.844 12.441 3.844 10.083C3.844 7.725 5.633 5.883 7.922 5.883C10.211 5.883 12 7.725 12 10.083C12 11.233 11.5 12.333 10.856 13.25L8.011 21H5.528Z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-dark-800 mb-8 leading-relaxed">"Pude buscar opciones de inversion con privacidad absoluta. La interfaz para verificar los estados financieros avanzados fue clave para animarme a comprar rapidamente."</p>
                            <div className="flex items-center">
                                <div className="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-900 mr-4 border border-brand-300">
                                    AR
                                </div>
                                <div>
                                    <p className="font-extrabold text-dark-900 text-lg">Ana Rodríguez</p>
                                    <p className="text-brand-900 font-medium">Inversionista Privada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED LISTINGS */}
            <section className="py-24 bg-white border-t border-light-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-extrabold text-dark-900 tracking-tight">Oportunidades Inmediatas</h2>
                            <p className="text-dark-500 mt-2 text-lg">Explora negocios verificados que acaban de publicarse.</p>
                        </div>
                        <Link to="/marketplace" className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 font-bold text-brand-900 bg-brand-100 rounded-full hover:bg-brand-300/40 transition-colors">
                            Ver todos los negocios <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {recentBusinesses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentBusinesses.map((biz) => (
                                <BusinessCard key={biz._id || biz.slug} business={biz} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-light-100 rounded-3xl border border-dashed border-light-400">
                            <Briefcase className="h-12 w-12 text-light-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-dark-900">Sin listados activos</h3>
                            <p className="text-dark-500 mt-2">Vuelve pronto para ver nuevas oportunidades de inversión.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 bg-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">¿Listo para tu próxima adquisición?</h2>
                    <p className="text-brand-100 text-xl mb-10 max-w-2xl mx-auto">
                        Miles de dueños en México ya usan Releevo para vender sus negocios. Únete hoy y obtén acceso total.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="px-8 py-4 text-lg font-bold rounded-full text-brand-900 bg-white hover:bg-light-100 transition-all shadow-lg">
                            Crear cuenta gratuita
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
