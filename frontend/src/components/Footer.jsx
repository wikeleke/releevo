import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-line bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 md:gap-12 lg:px-8">
                <div>
                    <img
                        src="/logo.png"
                        alt="Releevo"
                        className="mb-5 h-auto max-h-12 w-auto object-contain"
                    />
                    <p className="pr-4 text-sm leading-relaxed text-dark-500">
                        El mercado líder para comprar y vender negocios tradicionales en México de manera transparente y segura.
                    </p>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-oxford">Contáctanos</h3>
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="mailto:soporte@releevo.com"
                                className="text-sm font-medium text-dark-500 transition-colors hover:text-brand-900"
                            >
                                soporte@releevo.com
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-oxford">Compañía</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#" className="text-sm font-medium text-dark-500 transition-colors hover:text-brand-900">
                                Acerca de nosotros
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-oxford">Recursos</h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="#" className="text-sm font-medium text-dark-500 transition-colors hover:text-brand-900">
                                Blog
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-sm font-medium text-dark-500 transition-colors hover:text-brand-900">
                                Valuación de tu empresa
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-sm font-medium text-dark-500 transition-colors hover:text-brand-900">
                                Programa de referencia
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-line">
                <div className="mx-auto flex max-w-7xl flex-col items-end justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row">
                    <p className="text-center text-sm font-medium text-dark-300 md:text-left">
                        &copy; {new Date().getFullYear()} Releevo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
