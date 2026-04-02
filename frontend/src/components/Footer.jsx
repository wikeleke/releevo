import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light-50 border-t border-light-400 mt-auto">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <img
                        src="/logo.png"
                        alt="Releevo"
                        className="w-auto h-auto max-h-12 mb-6 object-contain"
                    />
                    <p className="text-sm text-dark-500 leading-relaxed pr-4">
                        El mercado líder para comprar y vender negocios tradicionales en México de manera transparente y segura.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-extrabold text-dark-900 uppercase tracking-wider mb-6">Contáctanos</h3>
                    <ul className="space-y-4">
                        <li><a href="mailto:soporte@releevo.com" className="text-sm font-medium text-dark-500 hover:text-brand-900 transition-colors">soporte@releevo.com</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-extrabold text-dark-900 uppercase tracking-wider mb-6">Compañía</h3>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-sm font-medium text-dark-500 hover:text-brand-900 transition-colors">Acerca de nosotros</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-extrabold text-dark-900 uppercase tracking-wider mb-6">Recursos</h3>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-sm font-medium text-dark-500 hover:text-brand-900 transition-colors">Blog</a></li>
                        <li><a href="#" className="text-sm font-medium text-dark-500 hover:text-brand-900 transition-colors">Valuación de tu empresa</a></li>
                        <li><a href="#" className="text-sm font-medium text-dark-500 hover:text-brand-900 transition-colors">Programa de referencia</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-light-400">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end gap-4">
                    <p className="text-center md:text-left text-sm font-medium text-dark-300">
                        &copy; {new Date().getFullYear()} Releevo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
