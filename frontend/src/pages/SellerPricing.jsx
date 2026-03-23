import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeDollarSign, RefreshCcw, Handshake, PenTool, ShieldCheck, LockKeyhole, ScrollText, CheckCircle2, UserCheck, Check, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-start p-6">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-light-300 flex items-center justify-center text-brand-900 mb-6">
            <Icon strokeWidth={2.5} className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-[#111124] mb-3">{title}</h3>
        <p className="text-[#3B3C4B] font-medium leading-relaxed">{description}</p>
    </div>
);

const SellerPricing = () => {
    const [activeTier, setActiveTier] = useState(0);

    const tiers = [
        { label: '<$250k', title: 'Para precios de venta menores a $250k', fee: '8%', monthly: 'Más $25/mes por publicar' },
        { label: '$250k-$1M', title: 'Para precios de venta entre $250k y $1M', fee: '7%', monthly: 'Más $50/mes por publicar' },
        { label: '$1M+', title: 'Para precios de venta mayores a $1M', fee: '6%', monthly: 'Más $100/mes por publicar' },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-100 opacity-40 blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#111124] tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto">
                        Precios simples para vender tu empresa.
                    </h1>

                    <p className="text-xl text-[#3B3C4B] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Vende tu negocio de manera rápida, segura y alcanzando su máxima valoración con un plan estructurado a tus objetivos financieros reales.
                    </p>
                </div>
            </section>

            {/* PRICING TOGGLE SECTION */}
            <section className="pb-24 pt-4 bg-white border-b border-light-300">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[40px] border border-light-300 shadow-[0_20px_40px_rgba(0,0,0,0.04)] p-8 md:p-12">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                            {/* Left Side: Pricing Controls */}
                            <div className="flex flex-col items-center text-center">
                                {/* Toggle Bar */}
                                <div className="bg-[#5764FF] p-1.5 rounded-full inline-flex w-full max-w-sm font-bold text-sm shadow-inner mb-12 relative overflow-hidden">
                                    {tiers.map((tier, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTier(index)}
                                            className={`relative flex-1 py-3 px-2 rounded-full z-10 transition-colors duration-300 ${activeTier === index ? 'text-[#5764FF]' : 'text-white hover:text-white/80'}`}
                                        >
                                            {tier.label}
                                        </button>
                                    ))}
                                    {/* Active Background Pill */}
                                    <div
                                        className="absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out"
                                        style={{ transform: `translateX(calc(${activeTier * 100}% + ${activeTier * 6}px))` }}
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-[#3B3C4B] mb-6">{tiers[activeTier].title}</h3>

                                <div className="text-[100px] font-black text-[#26263B] leading-none mb-1 tracking-tighter">
                                    {tiers[activeTier].fee}
                                </div>

                                <p className="text-xl text-[#3B3C4B] mb-6 font-medium border-b border-dashed border-[#B3B4C5] pb-1 inline-block">
                                    comisión de cierre al vender
                                </p>

                                <p className="text-xl text-[#5E5F70] mb-10 font-medium">
                                    {tiers[activeTier].monthly}
                                </p>

                                <Link to="/signup" className="w-full max-w-[280px] px-8 py-4 text-lg font-bold rounded-[20px] text-white bg-[#5764FF] hover:bg-[#4550E6] transition-all shadow-md flex items-center justify-center">
                                    Comenzar <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </div>

                            {/* Right Side: Features List */}
                            <div className="space-y-10">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-[#5E5F70]" strokeWidth={2.5} />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-xl font-bold text-[#5E5F70] mb-2">Interés máximo</h4>
                                        <p className="text-[#8E8FA3] text-[15px] leading-relaxed font-medium">Atrae más compradores con el apoyo de nuestro marketing y publicación.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <Handshake className="w-6 h-6 text-[#5E5F70]" strokeWidth={2.5} />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-xl font-bold text-[#5E5F70] mb-2">Guía experta</h4>
                                        <p className="text-[#8E8FA3] text-[15px] leading-relaxed font-medium">Vende por el mayor precio y con las mejores condiciones mediante nuestra asesoría.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <ShieldCheck className="w-6 h-6 text-[#5E5F70]" strokeWidth={2.5} />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-xl font-bold text-[#5E5F70] mb-2">Escrow libre y seguro</h4>
                                        <p className="text-[#8E8FA3] text-[15px] leading-relaxed font-medium">Cierra el acuerdo de forma fluida y segura con socios fiduciarios de primer nivel.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT YOU GET */}
            <section className="py-24 bg-[#F8F9FE]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#111124] mb-4 tracking-tight">Todo lo que obtienes al vender en Releevo</h2>
                        <p className="text-lg text-[#7A7B8B] max-w-3xl mx-auto font-medium">Herramientas expertas y soporte total incuídos sin costos ocultos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        <FeatureCard
                            icon={BadgeDollarSign}
                            title="Valuaciones"
                            description="Valuación sin costo respaldada en datos del mercado para asegurarnos de que exijas el precio justo y competitivo por tu compañía."
                        />
                        <FeatureCard
                            icon={RefreshCcw}
                            title="Métricas Sincronizadas"
                            description="Herramientas para reflejar flujos reales que mantienen la información financiera de tu listing siempre atractiva y al día."
                        />
                        <FeatureCard
                            icon={CheckCircle2}
                            title="Promoción Estratégica"
                            description="Posicionamiento y optimización de tu oferta dentro de nuestra lista privada de correos con cientos de miles de buscadores."
                        />
                        <FeatureCard
                            icon={PenTool}
                            title="Optimización de Anuncio"
                            description="Asesoría puntual para optimizar la redacción, subir tus documentos y crear un resumen que atrape la atención inmediatamente."
                        />
                        <FeatureCard
                            icon={UserCheck}
                            title="Compradores Verificados"
                            description="Filtro estricto de identidades y bloqueo a curiosos validando que cuenten con los fondos reales de compra para ahorrar tu tiempo."
                        />
                        <FeatureCard
                            icon={LockKeyhole}
                            title="NDAs Automáticos"
                            description="Acuerdos de confidencialidad incorporados al sistema a tu nombre para proteger estrictamente toda tu información."
                        />
                        <FeatureCard
                            icon={ScrollText}
                            title="Formatos Legales"
                            description="Generadores de Cartas de Intención (LOI) y documentos formales listos y estructurados por expertos para agilizar el cierre."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Escrow Seguro"
                            description="Cierre protegido, asegurando el resguardo y verificación de los fondos durante la transacción técnica usando Escrow."
                        />
                        <FeatureCard
                            icon={Handshake}
                            title="Guía Especializada"
                            description="Asesores y especialistas en M&A siempre listos detrás de correo o en chat para ayudarte si te atoras durante alguna negociación."
                        />
                    </div>
                </div>
            </section>

            {/* UPSELL SECTION */}
            <section className="py-24 bg-white border-t border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#111124] rounded-[40px] p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900 rounded-full opacity-20 blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6FBAFF] rounded-full opacity-10 blur-[120px]"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-900/40 text-brand-100 text-sm font-bold tracking-wider mb-8 border border-white/10 uppercase">
                                Para negocios rentables arriba de $10M MXN
                            </div>

                            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                                Maximiza tu venta final utilizando <span className="text-[#6FBAFF]">Releevo Advisors</span>
                            </h2>

                            <p className="text-xl text-[#8E8FA3] font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
                                Únete a los emprendedores que lograron valuaciones record en el último trimestre de la mano de ex-fundadores y bancas de inversión profesionales mediante nuestro programa de matchmaking guiado.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
                                <div className="border border-white/10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                                    <Check className="text-brand-300 w-8 h-8 mb-4" />
                                    <h4 className="text-white font-bold text-lg mb-2">Especialistas Exclusivos</h4>
                                    <p className="text-[#8E8FA3] text-sm">Maximiza el interés orgánico y multiplica la valoración general con expertos financieros.</p>
                                </div>
                                <div className="border border-white/10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                                    <Check className="text-brand-300 w-8 h-8 mb-4" />
                                    <h4 className="text-white font-bold text-lg mb-2">Private Equity Match</h4>
                                    <p className="text-[#8E8FA3] text-sm">Contactamos directamente tu portafolio ideal de fondos de inversión exigentes del país.</p>
                                </div>
                                <div className="border border-white/10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                                    <Check className="text-brand-300 w-8 h-8 mb-4" />
                                    <h4 className="text-white font-bold text-lg mb-2">Adquisición Impactante</h4>
                                    <p className="text-[#8E8FA3] text-sm">Negociamos férreamente las cláusulas de salida y estructura de tu post-venta.</p>
                                </div>
                            </div>

                            <Link to="#" className="inline-flex items-center px-10 py-4 font-extrabold text-brand-900 bg-white rounded-full hover:bg-light-100 transition-colors shadow-lg">
                                Conocer Programa Asesores
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SellerPricing;
