import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, BarChart3, ChevronDown, CheckCircle2, Factory, RefreshCcw } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-light-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-brand-900' : 'text-[#111124] group-hover:text-brand-700'}`}>
                    {question}
                </span>
                <ChevronDown className={`w-5 h-5 text-dark-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-900' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                <p className="text-[#5E5F70] font-medium leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

const Valuation = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-[#F8F9FE] border-b border-light-300">
                <div className="absolute top-0 left-1/2 -ml-[400px] -mt-[400px] w-[800px] h-[800px] rounded-full bg-brand-100 opacity-70 blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left text-center lg:text-left">
                            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-brand-900 bg-brand-100 mb-8 border border-brand-300 shadow-sm">
                                <span className="flex w-2.5 h-2.5 rounded-full bg-brand-700 mr-2.5"></span>
                                Evaluador de Negocios
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#111124] tracking-tight mb-8 leading-[1.1]">
                                ¿Cuánto vale realmente tu <span className="text-brand-900">empresa?</span>
                            </h1>

                            <p className="text-xl text-[#3B3C4B] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Estima gratis el rango de valoración de tu negocio en minutos. Utiliza nuestra herramienta respaldada por la actividad y los múltiples dictados por el mercado real.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/signup" className="w-full sm:w-auto px-10 py-5 text-lg font-bold rounded-2xl text-white bg-brand-900 hover:bg-brand-700 transition-all shadow-xl hover:-translate-y-0.5">
                                    Conocer mi valuación gratis
                                </Link>
                            </div>
                        </div>

                        {/* Right side illustration / graphic representation */}
                        <div className="hidden lg:block relative">
                            <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-light-300 relative z-20">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-light-300">
                                    <h3 className="text-xl font-bold text-[#111124]">Reporte de Valuación</h3>
                                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-bold text-dark-500 uppercase tracking-wider mb-2">Estimación Calculada</p>
                                        <div className="text-5xl font-black text-brand-900">$45M - $52M <span className="text-xl text-dark-500 font-bold">MXN</span></div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-light-300">
                                        <div className="flex justify-between items-center bg-[#F8F9FE] p-4 rounded-xl">
                                            <span className="text-dark-700 font-bold">Múltiplo de EBITDA</span>
                                            <span className="text-[#111124] font-black">4.5x - 5.2x</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-[#F8F9FE] p-4 rounded-xl">
                                            <span className="text-dark-700 font-bold">Interés de Compradores</span>
                                            <span className="flex items-center text-green-600 font-extrabold"><BarChart3 className="w-4 h-4 mr-1" /> Alto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 w-24 h-24 bg-[#EAF2FF] rounded-full blur-xl z-10"></div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-100 rounded-full blur-2xl z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE PILLARS */}
            <section className="py-24 bg-white border-b border-light-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center sm:text-left">
                            <div className="w-16 h-16 bg-[#EAF2FF] rounded-2xl flex items-center justify-center text-brand-900 mb-6 mx-auto sm:mx-0">
                                <RefreshCcw strokeWidth={2.5} className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#111124] mb-3">Siempre Actualizada</h3>
                            <p className="text-[#5E5F70] font-medium leading-relaxed">
                                Procesamos múltiples datos cruzados de cientos de adquisiciones privadas recientes. Tu rango reflejará la demanda transaccional vigente, no la del año pasado.
                            </p>
                        </div>

                        <div className="text-center sm:text-left">
                            <div className="w-16 h-16 bg-[#EAF2FF] rounded-2xl flex items-center justify-center text-brand-900 mb-6 mx-auto sm:mx-0">
                                <Factory strokeWidth={2.5} className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#111124] mb-3">Contexto de Industria</h3>
                            <p className="text-[#5E5F70] font-medium leading-relaxed">
                                Nuestra calculadora aísla el comportamiento específico del sector (manufactura, logística, retail). Nada de valuaciones infladas por industrias ajenas a tu realidad comercial.
                            </p>
                        </div>

                        <div className="text-center sm:text-left">
                            <div className="w-16 h-16 bg-[#EAF2FF] rounded-2xl flex items-center justify-center text-brand-900 mb-6 mx-auto sm:mx-0">
                                <Clock strokeWidth={2.5} className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#111124] mb-3">Increíblemente Rápida</h3>
                            <p className="text-[#5E5F70] font-medium leading-relaxed">
                                Obtén tu reporte gratuito en cuestión de pocos minutos respondiendo preguntas y subiendo parámetros 100% anónimos, que luego puedes pasar a tu publicación con un sólo click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 bg-[#F8F9FE]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#111124] mb-6 tracking-tight">Preguntas Frecuentes</h2>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-light-300">
                        <FAQItem
                            question="¿Qué metodología usa la calculadora de valuación?"
                            answer="Nuestra calculadora de valuación se basa primordialmente en la metodología de 'Valuación por Múltiplos' (Típicamente usando EBITDA o Revenue), la cual es preferida abrumadoramente por Family Offices, Fondos de Capital Privado (PE) y buscadores tradicionales de M&A al evaluar compañías maduras en México."
                        />
                        <FAQItem
                            question="¿Qué tan certera es esta calculadora de negocios?"
                            answer="Nos estima un rango muy sólido de valuaciones usando tendencias transaccionales reales registradas en Releevo, sin embargo, ninguna herramienta puede sustituir un análisis contable financiero detallado o Appraisals Profesionales. Usa este rango como una guía poderosa para fijar tu precio y negociar con asertividad."
                        />
                        <FAQItem
                            question="¿Por qué obtengo un rango de valuación y no un número preciso?"
                            answer="Cada adquisición involucra factores no contables únicos (calidad del equipo, due diligence legal, sinergias de la industria, crecimiento proyectado y términos de pago). Por ende, el rango absorbe esos factores para que el mercado final te indique de qué lado del espectro tu empresa genera mayor interés para los fondos."
                        />
                        <FAQItem
                            question="¿Cuánto tiempo de esfuerzo me va a requerir obtener mi diagnóstico?"
                            answer="Calculamos que rellenarás en un periodo de 2 a 5 minutos el cuestionario financiero y de operaciones. Es muy simple. La magia posterior y los cruces de valuación en el servidor se procesan instantáneamente."
                        />
                        <FAQItem
                            question="¿Por qué necesitan mi información de contacto?"
                            answer="Nos permite atar el reporte generado a un perfil anónimo con el cual tú podrás crear inmediatamente tu Listado dentro de Releevo. No te obligamos a listar tu Pyme, pero cuando estés preparado en el futuro, tus valuaciones históricas estarán resguardadas aquí ahorrándote mucho trabajo."
                        />
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/signup" className="inline-flex py-4 px-10 text-lg font-bold rounded-full text-white bg-[#111124] hover:bg-[#2B2B43] shadow-[0_15px_30px_rgba(17,17,36,0.15)] hover:-translate-y-1 transition-all">
                            Evaluar mi empresa gratis
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Valuation;
