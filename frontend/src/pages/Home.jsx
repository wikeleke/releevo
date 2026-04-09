import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    return (
        <div className="bg-white">
            <section className="relative overflow-hidden border-b border-line pt-16 pb-16 lg:pt-24 lg:pb-20">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-100/30 blur-[100px]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="mb-6 inline-flex items-center rounded-md border border-line bg-light-100 px-3 py-1.5 text-sm font-semibold text-brand-900">
                        <span className="mr-2 flex h-2 w-2 rounded-sm bg-brand-700" />
                        El mercado #1 de negocios en México
                    </div>

                    <h1 className="mx-auto mb-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-dark-900 sm:text-5xl md:text-[3.25rem]">
                        Compra y vende negocios rentables, <span className="text-brand-900">sin complicaciones.</span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-dark-500 md:text-lg">
                        Conectamos a emprendedores con negocios tradicionales verificados con inversionistas serios con total privacidad y transparencia garantizada.
                    </p>

                    <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to="/marketplace" className="w-full rounded-lg bg-brand-900 px-7 py-3 text-center text-sm font-semibold text-white shadow-pd transition-colors hover:bg-brand-700 sm:w-auto sm:text-base">
                            Ver negocios en venta
                        </Link>
                        <Link to="/signup" className="w-full rounded-lg border border-line bg-white px-7 py-3 text-center text-sm font-semibold text-oxford shadow-pd transition-colors hover:bg-light-100 sm:w-auto sm:text-base">
                            Vender mi negocio
                        </Link>
                    </div>

                    <p className="text-sm text-dark-500">
                        Unete al mercado donde se unen emprendedores e inversionistas en México
                    </p>

                </div>
            </section>

            {/* STATS SECTION */}
            <section className="border-b border-line bg-light-100 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-6 divide-x divide-line text-center md:grid-cols-4 md:gap-8">
                        <div className="px-4">
                            <div className="mb-1 text-2xl font-semibold text-brand-900 md:text-3xl">$500M+</div>
                            <div className="text-sm font-medium text-dark-500">Valor en listados</div>
                        </div>
                        <div className="px-4">
                            <div className="mb-1 text-2xl font-semibold text-brand-900 md:text-3xl">1,200+</div>
                            <div className="text-sm font-medium text-dark-500">Negocios vendidos</div>
                        </div>
                        <div className="px-4">
                            <div className="mb-1 text-2xl font-semibold text-brand-900 md:text-3xl">30k+</div>
                            <div className="text-sm font-medium text-dark-500">Compradores verificados</div>
                        </div>
                        <div className="px-4">
                            <div className="mb-1 text-2xl font-semibold text-brand-900 md:text-3xl">98%</div>
                            <div className="text-sm font-medium text-dark-500">Tasa de éxito</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-14 text-center">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-dark-900 md:text-3xl">
                            Un proceso diseñado para el éxito
                        </h2>
                        <p className="mx-auto max-w-2xl text-base text-dark-500 md:text-lg">
                            La forma más inteligente de transaccionar negocios en la República Mexicana.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                        <div className="rounded-xl border border-line bg-white p-8 shadow-pd transition-shadow hover:shadow-pd-md">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-900 text-white">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-dark-900">1. Descubre y filtra</h3>
                            <p className="text-[15px] leading-relaxed text-dark-500">
                                Encuentra negocios rentables filtrando por métricas financieras, ubicación geográfica o industria. Información clave al instante.
                            </p>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-8 shadow-pd transition-shadow hover:shadow-pd-md">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-900 text-white">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-dark-900">2. Analiza con privacidad</h3>
                            <p className="text-[15px] leading-relaxed text-dark-500">
                                Accede a nuestro plan avanzado para ver datos financieros, contactos verificados, nombre legal y ubicacion exacta bajo estrictos acuerdos de confidencialidad.
                            </p>
                        </div>
                        <div className="rounded-xl border border-line bg-white p-8 shadow-pd transition-shadow hover:shadow-pd-md">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-900 text-white">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-dark-900">3. Conecta directamente</h3>
                            <p className="text-[15px] leading-relaxed text-dark-500">
                                Inicia conversaciones directamente con los dueños sin intermediarios costosos. Cierra el trato bajo tus propios términos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="border-t border-line bg-light-100 py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-14 text-center">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-dark-900 md:text-3xl">
                            Historias de éxito reales
                        </h2>
                        <p className="mx-auto max-w-2xl text-base text-dark-500 md:text-lg">
                            Emprendedores reales que compraron o vendieron negocios a través de Releevo.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        {/* Testimonial 1 */}
                        <div className="relative rounded-xl border border-line bg-white p-8 shadow-pd transition-shadow hover:shadow-pd-md md:p-10">
                            <div className="text-brand-500 mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.017 21L16.411 14.283C14.122 14.283 12.333 12.441 12.333 10.083C12.333 7.725 14.122 5.883 16.411 5.883C18.7 5.883 20.489 7.725 20.489 10.083C20.489 11.233 19.989 12.333 19.344 13.25L16.5 21H14.017ZM5.528 21L7.922 14.283C5.633 14.283 3.844 12.441 3.844 10.083C3.844 7.725 5.633 5.883 7.922 5.883C10.211 5.883 12 7.725 12 10.083C12 11.233 11.5 12.333 10.856 13.25L8.011 21H5.528Z" />
                                </svg>
                            </div>
                            <p className="mb-8 text-lg font-medium leading-relaxed text-dark-800 md:text-xl">
                                "Releevo hizo que vender mi restaurante en la Roma fuera increíblemente fácil. Encontramos al comprador ideal en menos de 45 días sin pagar comisiones ridículas a brokers tradicionales."
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-brand-100 text-base font-semibold text-brand-900">
                                    CM
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-dark-900">Carlos Mendoza</p>
                                    <p className="text-sm font-medium text-brand-900">Ex-dueño de Restaurante</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="relative rounded-xl border border-line bg-white p-8 shadow-pd transition-shadow hover:shadow-pd-md md:p-10">
                            <div className="text-brand-500 mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.017 21L16.411 14.283C14.122 14.283 12.333 12.441 12.333 10.083C12.333 7.725 14.122 5.883 16.411 5.883C18.7 5.883 20.489 7.725 20.489 10.083C20.489 11.233 19.989 12.333 19.344 13.25L16.5 21H14.017ZM5.528 21L7.922 14.283C5.633 14.283 3.844 12.441 3.844 10.083C3.844 7.725 5.633 5.883 7.922 5.883C10.211 5.883 12 7.725 12 10.083C12 11.233 11.5 12.333 10.856 13.25L8.011 21H5.528Z" />
                                </svg>
                            </div>
                            <p className="mb-8 text-lg font-medium leading-relaxed text-dark-800 md:text-xl">
                                "Pude buscar opciones de inversion con privacidad absoluta. La interfaz para verificar los estados financieros avanzados fue clave para animarme a comprar rapidamente."
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-brand-100 text-base font-semibold text-brand-900">
                                    AR
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-dark-900">Ana Rodríguez</p>
                                    <p className="text-sm font-medium text-brand-900">Inversionista Privada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED LISTINGS */}
            <section className="border-t border-line bg-white py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-dark-900 md:text-3xl">Oportunidades Inmediatas</h2>
                            <p className="mt-2 text-base text-dark-500 md:text-lg">Explora negocios verificados que acaban de publicarse.</p>
                        </div>
                        <Link
                            to="/marketplace"
                            className="mt-2 inline-flex items-center rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-oxford shadow-pd transition-colors hover:bg-light-100 md:mt-0"
                        >
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
                        <div className="rounded-xl border border-dashed border-line bg-light-100 py-16 text-center md:py-20">
                            <Briefcase className="h-12 w-12 text-light-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-dark-900">Sin listados activos</h3>
                            <p className="text-dark-500 mt-2">Vuelve pronto para ver nuevas oportunidades de inversión.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden bg-brand-900 py-20 md:py-24">
                <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
                    <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">¿Listo para tu próxima adquisición?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-base text-brand-100 md:text-lg">
                        Miles de dueños en México ya usan Releevo para vender sus negocios. Únete hoy y obtén acceso total.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            to="/signup"
                            className="rounded-lg bg-white px-8 py-3 text-center text-sm font-semibold text-brand-900 shadow-pd transition-colors hover:bg-light-100 md:text-base"
                        >
                            Crear cuenta gratuita
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
