import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShieldCheck, Zap, Users, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

const BuyerPricing = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 overflow-hidden bg-white border-b border-light-300">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100 opacity-40 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[#6FBAFF] opacity-10 blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#111124] tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto">
                        Tu aliado para adquirir las mejores empresas.
                    </h1>

                    <p className="text-xl text-[#3B3C4B] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Maximiza los retornos de tu inversión con acceso a negocios mexicanos verificados, y navega con el soporte integral de expertos M&A.
                    </p>
                </div>
            </section>

            {/* PRICING PLANS */}
            <section className="py-20 bg-[#F8F9FE]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 -mt-32 relative z-20">
                        {/* Basic Free Plan */}
                        <div className="bg-white rounded-[32px] p-10 border border-light-300 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-lg transition-shadow">
                            <h3 className="text-3xl font-extrabold text-[#111124] mb-4">Básico</h3>
                            <p className="text-[#7A7B8B] font-medium mb-8 pb-8 border-b border-light-300 min-h-[80px]">
                                Explora negocios a la venta y obtén visibilidad general del mercado de Pymes en Releevo.
                            </p>

                            <div className="text-[48px] font-black text-[#111124] mb-8 leading-none">
                                $0
                                <span className="text-lg text-[#7A7B8B] font-medium ml-2 relative -top-3">/ mensual</span>
                            </div>

                            <ul className="space-y-5 mb-12 flex-1">
                                <li className="flex items-start text-[#3B3C4B] font-medium">
                                    <CheckCircle2 className="w-6 h-6 text-brand-700 mr-3 flex-shrink-0" />
                                    <span>Acceso al listado público del marketplace</span>
                                </li>
                                <li className="flex items-start text-[#3B3C4B] font-medium">
                                    <CheckCircle2 className="w-6 h-6 text-brand-700 mr-3 flex-shrink-0" />
                                    <span>Alertas globales básicas por email</span>
                                </li>
                                <li className="flex items-start text-[#7A7B8B] font-medium opacity-50">
                                    <Eye className="w-6 h-6 text-light-500 mr-3 flex-shrink-0" />
                                    <span>Información censurada (Requiere de tu upgrade)</span>
                                </li>
                            </ul>

                            <Link to="/signup" className="w-full py-4 text-center text-lg font-bold rounded-2xl text-[#111124] bg-[#F7F8FC] border-2 border-light-400 hover:border-brand-900 hover:text-brand-900 transition-all">
                                Explorar Gratis
                            </Link>
                        </div>

                        {/* Premium Plan */}
                        <div className="bg-[#111124] rounded-[32px] p-10 shadow-[0_20px_50px_rgba(87,100,255,0.15)] flex flex-col relative overflow-hidden transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-900 rounded-full opacity-30 blur-[80px] pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 bg-brand-900/40 border border-brand-300/30 text-brand-100 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                                    Recomendado
                                </div>
                                <h3 className="text-3xl font-extrabold text-white mb-4">Membresía Comprador</h3>
                                <p className="text-[#8E8FA3] font-medium mb-8 pb-8 border-b border-white/10 min-h-[80px]">
                                    Diseñado para adquirentes serios, profesionales (Private Equity / Family Offices) e inversionistas independientes.
                                </p>

                                <div className="text-[48px] font-black text-white mb-2 leading-none">
                                    $7,000 <span className="text-xl">MXN</span>
                                    <span className="text-lg text-[#8E8FA3] font-medium ml-2 relative -top-3">/ anual</span>
                                </div>
                                <p className="text-brand-300 text-sm font-medium mb-8">Recupera la inversión con tu primer cierre.</p>

                                <ul className="space-y-5 mb-12 flex-1">
                                    <li className="flex items-start text-[#D4D6DD] font-medium">
                                        <CheckCircle2 className="w-6 h-6 text-brand-300 mr-3 flex-shrink-0" />
                                        <span>Desbloqueo de métricas P&L y URL del negocio</span>
                                    </li>
                                    <li className="flex items-start text-[#D4D6DD] font-medium">
                                        <CheckCircle2 className="w-6 h-6 text-brand-300 mr-3 flex-shrink-0" />
                                        <span>Firma de NDAs instantáneos y envíos de LOI</span>
                                    </li>
                                    <li className="flex items-start text-[#D4D6DD] font-medium">
                                        <CheckCircle2 className="w-6 h-6 text-brand-300 mr-3 flex-shrink-0" />
                                        <span>Conexión y chat directo con fundadores</span>
                                    </li>
                                    <li className="flex items-start text-[#D4D6DD] font-medium">
                                        <CheckCircle2 className="w-6 h-6 text-brand-300 mr-3 flex-shrink-0" />
                                        <span>Alertas VIP tempranas (7 días de exclusividad)</span>
                                    </li>
                                </ul>

                                <Link to="/signup" className="w-full py-4 text-center text-lg font-bold rounded-2xl text-white bg-[#5764FF] hover:bg-[#4550E6] transition-all shadow-lg flex items-center justify-center">
                                    Volverte Miembro <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MEMBER BENEFITS SECTION */}
            <section className="py-24 bg-white border-t border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#111124] mb-4 tracking-tight">Beneficios exclusivos para miembros</h2>
                        <p className="text-lg text-[#7A7B8B] max-w-3xl mx-auto font-medium">Descubre cómo nuestra membresía te ayuda a encontrar, adquirir y crecer negocios con apoyo en cada etapa del trato.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto">
                        <div className="flex gap-6 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center text-brand-900 border border-brand-100 flex-shrink-0">
                                <ShieldCheck strokeWidth={2.5} className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#111124] mb-3">Acceso a tratos verificados</h4>
                                <p className="text-[#5E5F70] leading-relaxed font-medium">Conecta con miles de Pymes formales que hemos curado estrictamente y que ya hemos preparado para tener una salida ágil y auditable.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center text-brand-900 border border-brand-100 flex-shrink-0">
                                <Zap strokeWidth={2.5} className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#111124] mb-3">Agiliza tus adquisiciones</h4>
                                <p className="text-[#5E5F70] leading-relaxed font-medium">Simplifica y acelera la firma de tratos gracias a nuestras herramientas integradas de debida diligencia técnica y formatos legales estructurados.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center text-brand-900 border border-brand-100 flex-shrink-0">
                                <Users strokeWidth={2.5} className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#111124] mb-3">Únete a una comunidad VIP</h4>
                                <p className="text-[#5E5F70] leading-relaxed font-medium">Interactúa con dueños de portafolios de inversión, co-invierte en empresas grandes y mantén un networking con los profesionales del Private Equity en México.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center text-brand-900 border border-brand-100 flex-shrink-0">
                                <GraduationCap strokeWidth={2.5} className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-[#111124] mb-3">Acceso a "Releevo Academy"</h4>
                                <p className="text-[#5E5F70] leading-relaxed font-medium">Aprende realmente a estructurar LBOs (compras apalancadas), buscar y valuar oportunidades para construir riqueza mediante nuestras Masterclasses exclusivas en M&A.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <Link to="/signup" className="inline-flex py-4 px-10 text-lg font-bold rounded-full text-white bg-[#111124] hover:bg-[#2B2B43] shadow-[0_15px_30px_rgba(17,17,36,0.15)] hover:-translate-y-1 transition-all">
                            Adquiere tu Membresía Ahora
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BuyerPricing;
