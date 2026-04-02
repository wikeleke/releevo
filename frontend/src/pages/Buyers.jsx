import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, ShieldCheck, CheckCircle2, ArrowRight, Building2, TrendingUp } from 'lucide-react';

const Buyers = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* HEROS SECTION */}
            <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden border-b border-light-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100 opacity-50 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-brand-300 opacity-20 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-brand-900 bg-brand-100 mb-8 border border-brand-300 shadow-sm">
                        <span className="flex w-2.5 h-2.5 rounded-full bg-brand-700 mr-2.5"></span>
                        Compradores en Releevo
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#111124] tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto">
                        Adquiere un negocio rentable en 90 días. <br />
                        <span className="text-brand-900">Tratos verificados. Sin complicaciones.</span>
                    </h1>

                    <p className="text-xl text-[#3B3C4B] mb-12 max-w-3xl mx-auto leading-relaxed">
                        Encuentra la oportunidad ideal entre miles de negocios tradicionales vetados a la venta. Conecta directamente con los fundadores. Visualiza métricas y confidenciales al instante. Negocia sin intermediarios.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-full text-white bg-brand-900 hover:bg-brand-700 transition-all shadow-xl hover:-translate-y-0.5">
                            Crear cuenta de comprador
                        </Link>
                        <Link to="/marketplace" className="w-full sm:w-auto px-10 py-4 text-lg font-bold rounded-full text-[#111124] bg-white border-2 border-light-400 hover:border-brand-900 hover:bg-[#F8F9FE] transition-all">
                            Explorar negocios
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 bg-[#F8F9FE]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#111124] mb-6 tracking-tight">Todo lo que necesitas para hacer una oferta</h2>
                        <p className="text-xl text-[#7A7B8B] max-w-3xl mx-auto">Herramientas financieras avanzadas y listados exclusivos diseñados para inversionistas exigentes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-white p-10 rounded-3xl border border-light-300 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-900 mb-8 border border-brand-300">
                                <Search className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111124] mb-4">Listados Verificados</h3>
                            <p className="text-[#3B3C4B] leading-relaxed mb-6">
                                Cuéntanos tus métodos de inversión y encontraremos negocios que encajen con tus criterios en nuestro marketplace.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Filtra por industria, ganancias y precio.</span></li>
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Recibe alertas instantáneas.</span></li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-10 rounded-3xl border border-light-300 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-900 mb-8 border border-brand-300">
                                <BarChart3 className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111124] mb-4">Métricas que importan</h3>
                            <p className="text-[#3B3C4B] leading-relaxed mb-6">
                                Analiza cuidadosamente el desempeño de la empresa a través de P&Ls conectados y métricas financieras reales.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Visualiza finanzas y reportes de pérdidas y ganancias.</span></li>
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Comprende los ingresos y rotación.</span></li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-10 rounded-3xl border border-light-300 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-900 mb-8 border border-brand-300">
                                <ShieldCheck className="w-8 h-8" strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111124] mb-4">Tecnología y Confidencialidad</h3>
                            <p className="text-[#3B3C4B] leading-relaxed mb-6">
                                Nuestro software encripta y estandariza las cartas de intención para que te enfoques en negociar.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Firma de NDAs en un click para abrir el perfil y ubicación reales.</span></li>
                                <li className="flex items-start text-[#3B3C4B]"><CheckCircle2 className="w-5 h-5 text-brand-700 mr-2 flex-shrink-0 mt-0.5" /> <span>Construye LOIs directo en el sitio.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS / STATS */}
            <section className="py-24 bg-white border-b border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111124] mb-6 tracking-tight">Haz de cada adquisición un gran éxito</h2>
                            <p className="text-xl text-[#3B3C4B] leading-relaxed mb-8">
                                Con la membresía para compradores, ganas acceso a listados completamente filtrados e información exlusiva de dueños de pymes en el país. Ya seas un inversor primerizo o un profesional de private equity, confía en Releevo para ejecutar transacciones serias.
                            </p>
                            <Link to="/signup" className="inline-flex items-center px-8 py-4 font-bold text-[#111124] bg-brand-300/30 border border-brand-300 rounded-full hover:bg-brand-100 transition-colors">
                                Volverte miembro avanzado <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-[#111124] p-8 rounded-[32px] text-white">
                                <Building2 className="w-10 h-10 text-brand-300 mb-6" />
                                <div className="text-4xl font-black mb-2">50k+</div>
                                <div className="text-[#7A7B8B] font-medium">Compradores verificados listos para invertir.</div>
                            </div>
                            <div className="bg-brand-900 p-8 rounded-[32px] text-white sm:mt-12">
                                <TrendingUp className="w-10 h-10 text-brand-100 mb-6" />
                                <div className="text-4xl font-black mb-2">$500M+</div>
                                <div className="text-brand-100 font-medium">Volumen transaccionado por nuestra red.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Buyers;
