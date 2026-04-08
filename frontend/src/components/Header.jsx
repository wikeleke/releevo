import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, ChevronDown, FilePlus, Handshake, Star, Mail, Bell, BellRing, X, UserCircle, Settings, CreditCard } from 'lucide-react';
import { openBillingOrSubscribe } from '../services/billingPortal';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser, useAuth } from "@clerk/clerk-react";
import { useMessageNotificationsContext } from '../context/MessageNotificationsContext.jsx';

const Header = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const {
        unreadTotal,
        toastText,
        dismissToast,
        requestNotifyPermission,
        notifySupported,
        notifyPermission,
    } = useMessageNotificationsContext();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isPricingMegaMenuOpen, setIsPricingMegaMenuOpen] = useState(false);

    const menuRef = useRef(null);
    const megaMenuRef = useRef(null);
    const pricingMegaMenuRef = useRef(null);
    const userDisplayName =
        user?.fullName ||
        user?.firstName ||
        user?.username ||
        user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
        'Mi cuenta';

    const handleLogout = async () => {
        localStorage.removeItem('token');
        await signOut({ redirectUrl: '/' });
        setIsMenuOpen(false);
    };

    const handleBillingPortal = async () => {
        const result = await openBillingOrSubscribe(navigate);
        if (!result.ok) {
            alert(result.message);
        }
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
                setIsMegaMenuOpen(false);
            }
            if (pricingMegaMenuRef.current && !pricingMegaMenuRef.current.contains(event.target)) {
                setIsPricingMegaMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadLabel = unreadTotal > 99 ? '99+' : unreadTotal > 0 ? String(unreadTotal) : null;

    return (
        <>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between py-4 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img src="/logo.png" alt="Releevo - Continuidad de los Negocios" className="h-16 md:h-20 w-auto object-contain group-hover:opacity-90 transition-opacity" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8 relative items-center" ref={megaMenuRef}>
                        <Link to="/marketplace" className="text-dark-700 hover:text-brand-900 font-bold transition-colors">Mercado</Link>

                        {/* Vendedores Dropdown Trigger */}
                        <div
                            className="flex items-center cursor-pointer"
                            onMouseEnter={() => setIsMegaMenuOpen(true)}
                            onMouseLeave={() => setIsMegaMenuOpen(false)}
                        >
                            <button
                                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                className={`flex items-center gap-1.5 font-bold transition-colors focus:outline-none ${isMegaMenuOpen ? 'text-brand-900' : 'text-dark-700 hover:text-brand-900'}`}
                            >
                                Vendedores
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-brand-900' : 'text-dark-400'}`} />
                            </button>

                            {/* Mega Menu Panel */}
                            {isMegaMenuOpen && (
                                <div className="absolute left-[-20px] md:left-[-40px] top-full pt-6 w-[95vw] md:w-[70vw] lg:w-[600px] z-50 cursor-default transition-all duration-300">
                                    <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-light-300 p-5 md:p-6">
                                        <h2 className="text-2xl font-extrabold text-[#000000] mb-5">Vendedores</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                            {/* Card 1 */}
                                            <div onClick={() => { setIsMegaMenuOpen(false); navigate('/signup'); }} className="bg-[#F8F9FE] p-5 md:p-6 rounded-[20px] cursor-pointer hover:bg-[#F2F4FC] transition-colors border border-transparent hover:border-brand-300 group flex flex-col h-full">
                                                <div className="w-[44px] h-[44px] rounded-full bg-[#ECF1FF] flex items-center justify-center text-brand-900 mb-5 shadow-sm">
                                                    <FilePlus strokeWidth={2.5} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-[17px] font-extrabold text-[#111124] mb-2 leading-tight">Publica tu Empresa</h3>
                                                <p className="text-[#393A47] text-[13px] md:text-[14px] font-medium mb-3 leading-snug flex-grow">Crea y publica el listado de tu compañía frente a más de 30k+ compradores reales.</p>
                                                <p className="text-[#7A7B8B] text-[12px] italic mt-auto">Vende con nuestras herramientas expertas.</p>
                                            </div>

                                            {/* Card 2 */}
                                            <div onClick={() => { setIsMegaMenuOpen(false); navigate('/signup'); }} className="bg-[#F8F9FE] p-5 md:p-6 rounded-[20px] cursor-pointer hover:bg-[#F2F4FC] transition-colors border border-transparent hover:border-brand-300 group flex flex-col h-full">
                                                <div className="w-[44px] h-[44px] rounded-full bg-[#ECF1FF] flex items-center justify-center text-brand-900 mb-5 shadow-sm">
                                                    <Handshake strokeWidth={2.5} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-[17px] font-extrabold text-[#111124] mb-2 leading-tight">Ayuda para vender</h3>
                                                <p className="text-[#393A47] text-[13px] md:text-[14px] font-medium mb-3 leading-snug flex-grow">Servicios de asesoría de adquisición a la medida para fundadores locales.</p>
                                                <p className="text-[#7A7B8B] text-[12px] italic mt-auto">Obtén el mejor precio con ayuda.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/buyers" className="text-dark-700 hover:text-brand-900 font-bold transition-colors">Compradores</Link>

                        {/* Pricing Dropdown Trigger */}
                        <div
                            className="flex items-center cursor-pointer"
                            ref={pricingMegaMenuRef}
                            onMouseEnter={() => setIsPricingMegaMenuOpen(true)}
                            onMouseLeave={() => setIsPricingMegaMenuOpen(false)}
                        >
                            <button
                                onClick={() => setIsPricingMegaMenuOpen(!isPricingMegaMenuOpen)}
                                className={`flex items-center gap-1.5 font-bold transition-colors focus:outline-none ${isPricingMegaMenuOpen ? 'text-brand-900' : 'text-dark-700 hover:text-brand-900'}`}
                            >
                                Precio
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPricingMegaMenuOpen ? 'rotate-180 text-brand-900' : 'text-dark-400'}`} />
                            </button>

                            {/* Pricing Mega Menu Panel */}
                            {isPricingMegaMenuOpen && (
                                <div className="absolute right-[-20px] md:right-[-40px] xl:right-0 top-full pt-6 w-[95vw] md:w-[70vw] lg:w-[600px] z-50 cursor-default transition-all duration-300">
                                    <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-light-300 p-5 md:p-6">
                                        <h2 className="text-2xl font-extrabold text-[#000000] mb-5">Precio</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                            {/* Sellers Pricing */}
                                            <div onClick={() => { setIsPricingMegaMenuOpen(false); navigate('/pricing/sellers'); }} className="bg-[#F8F9FE] p-5 md:p-6 rounded-[20px] cursor-pointer hover:bg-[#F2F4FC] transition-colors border border-transparent hover:border-brand-300 group flex flex-col h-full">
                                                <div className="w-[44px] h-[44px] rounded-full bg-[#ECF1FF] flex items-center justify-center text-brand-900 mb-5 shadow-sm">
                                                    <FilePlus strokeWidth={2.5} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-[17px] font-extrabold text-[#111124] mb-2 leading-tight">Vendedores</h3>
                                                <p className="text-[#393A47] text-[13px] md:text-[14px] font-medium mb-3 leading-snug flex-grow">Vende tu startup con un plan de adquisición adaptado a tus objetivos de salida.</p>
                                                <p className="text-[#7A7B8B] text-[12px] italic mt-auto">Publica y vende tu negocio con nosotros.</p>
                                            </div>

                                            {/* Buyers Pricing */}
                                            <div onClick={() => { setIsPricingMegaMenuOpen(false); navigate('/pricing/buyers'); }} className="bg-[#F8F9FE] p-5 md:p-6 rounded-[20px] cursor-pointer hover:bg-[#F2F4FC] transition-colors border border-transparent hover:border-brand-300 group flex flex-col h-full">
                                                <div className="w-[44px] h-[44px] rounded-full bg-[#ECF1FF] flex items-center justify-center text-brand-900 mb-5 shadow-sm">
                                                    <Star strokeWidth={2.5} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <h3 className="text-[17px] font-extrabold text-[#111124] mb-2 leading-tight">Compradores</h3>
                                                <p className="text-[#393A47] text-[13px] md:text-[14px] font-medium mb-3 leading-snug flex-grow">Visualiza los planes que te conectan con fundadores reales para vender.</p>
                                                <p className="text-[#7A7B8B] text-[12px] italic mt-auto">Inicia una adquisición privada hoy.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right side section: Messages + Evaluate company + User Dropdown */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {isSignedIn ? (
                            <>
                                <Link
                                    to="/inbox"
                                    className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full text-[#2B2B43] hover:bg-[#F7F8FC] border border-transparent hover:border-[#2B2B43]/20 transition-colors"
                                    title="Notificaciones"
                                    aria-label="Notificaciones"
                                >
                                    <Bell className="w-5 h-5" strokeWidth={2.2} />
                                    {unreadLabel ? (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-extrabold text-white bg-red-500 rounded-full border-2 border-white">
                                            {unreadLabel}
                                        </span>
                                    ) : null}
                                </Link>
                                <Link
                                    to="/inbox"
                                    className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full text-[#2B2B43] hover:bg-[#F7F8FC] border border-transparent hover:border-[#2B2B43]/20 transition-colors"
                                    title="Mensajes"
                                    aria-label="Mensajes"
                                >
                                    <Mail className="w-5 h-5" strokeWidth={2.2} />
                                </Link>
                            </>
                        ) : null}
                        {/* Free valuation text link - Hidden on mobile, moved to dropdown */}
                        <Link to="/valuation" className="hidden md:block text-dark-500 hover:text-brand-900 font-bold text-[15px] transition-colors">
                            Valúa tu compañía
                        </Link>

                        {/* Dropdown Menu Container */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-center gap-3 px-2 py-1.5 bg-[#F7F8FC] border border-[#2B2B43] rounded-full hover:shadow-md transition-shadow focus:outline-none"
                            >
                                <Menu className="w-5 h-5 text-dark-900 ml-2" />
                                <SignedIn>
                                    <span className="hidden md:block text-[13px] font-bold text-dark-700 max-w-[120px] truncate">
                                        {userDisplayName}
                                    </span>
                                </SignedIn>
                                <div className="bg-[#D3E4FF] w-9 h-9 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#19192D]" fill="currentColor" />
                                </div>
                            </button>

                            {/* Dropdown Panel */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 md:w-56 bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-light-300 py-3 z-50 overflow-y-auto max-h-[85vh]">

                                    {/* Mobile Only Navigation Menu */}
                                    <div className="md:hidden">
                                        <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors">
                                            Mercado
                                        </Link>

                                        <div className="px-6 py-2 text-[11px] font-bold text-dark-500 tracking-wider uppercase mt-1">Vendedores</div>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-6 py-2.5 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors">
                                            Publica tu Empresa
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-6 py-2.5 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors">
                                            Ayuda para vender
                                        </Link>

                                        <div className="px-6 py-2 text-[11px] font-bold text-dark-500 tracking-wider uppercase mt-2">Compradores</div>
                                        <Link to="/buyers" onClick={() => setIsMenuOpen(false)} className="block px-6 py-2.5 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors">
                                            Directorio
                                        </Link>

                                        <div className="px-6 py-2 text-[11px] font-bold text-dark-500 tracking-wider uppercase mt-2">Precios</div>
                                        <Link to="/pricing/sellers" onClick={() => setIsMenuOpen(false)} className="block px-6 py-2.5 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors">
                                            Para Vendedores
                                        </Link>
                                        <Link to="/pricing/buyers" onClick={() => setIsMenuOpen(false)} className="block px-6 py-2.5 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors">
                                            Para Compradores
                                        </Link>

                                        <div className="border-t border-light-300 my-2 mx-5"></div>
                                        <Link to="/valuation" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-[15px] font-bold text-brand-900 hover:bg-brand-50 transition-colors">
                                            Valúa tu compañía
                                        </Link>
                                        <div className="border-t border-light-300 my-2 mx-5"></div>
                                    </div>

                                    <SignedOut>
                                        <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                                            <button
                                                onClick={() => setIsMenuOpen(false)}
                                                className="w-full text-left block px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                            >
                                                Ingresar / Unirse
                                            </button>
                                        </SignInButton>
                                    </SignedOut>

                                    <SignedIn>
                                        <div className="px-6 py-3 border-b border-light-300 flex justify-between items-center">
                                            <p className="text-[14px] font-bold text-dark-500 truncate mr-3">{userDisplayName}</p>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                        >
                                            Panel
                                        </Link>
                                        <Link
                                            to="/cuenta"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-brand-900 shrink-0" />
                                            Cuenta
                                        </Link>
                                        <Link
                                            to="/perfil"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                        >
                                            <UserCircle className="w-4 h-4 text-brand-900 shrink-0" />
                                            Perfil
                                        </Link>
                                        <Link
                                            to="/inbox"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-between px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-brand-900 shrink-0" />
                                                Notificaciones
                                            </span>
                                            {unreadLabel ? (
                                                <span className="text-[11px] font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadLabel}</span>
                                            ) : null}
                                        </Link>
                                        <Link
                                            to="/inbox"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors"
                                        >
                                            <Mail className="w-4 h-4 text-brand-900 shrink-0" />
                                            Mensajes
                                        </Link>
                                        {notifySupported && notifyPermission === 'default' ? (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await requestNotifyPermission();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full text-left px-6 py-2.5 text-[13px] font-semibold text-[#5764FF] hover:bg-[#F0F2FF] flex items-center gap-2"
                                            >
                                                <BellRing className="w-4 h-4 shrink-0" />
                                                Activar avisos del navegador
                                            </button>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={handleBillingPortal}
                                            className="w-full text-left px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors flex items-center gap-2"
                                        >
                                            <CreditCard className="w-4 h-4 text-brand-900 shrink-0" />
                                            Facturación y suscripción
                                        </button>
                                    </SignedIn>

                                    <div className="border-t border-light-300 my-2 mx-5"></div>

                                    <Link
                                        to="#"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-6 py-3 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors"
                                    >
                                        Centro de ayuda
                                    </Link>
                                    <Link
                                        to="#"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-6 py-3 text-[15px] font-medium text-[#7A7B8B] hover:bg-light-100 transition-colors"
                                    >
                                        Blog
                                    </Link>

                                    <SignedIn>
                                        <div className="border-t border-light-300 my-2 mx-5"></div>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Cerrar sesión
                                        </button>
                                    </SignedIn>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>

            {toastText ? (
                <div
                    className="fixed bottom-4 left-1/2 z-[200] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2"
                    role="status"
                >
                    <div className="flex items-start gap-3 rounded-2xl border border-[#2B2B43]/20 bg-[#111124] text-white px-4 py-3 shadow-2xl">
                        <Bell className="w-5 h-5 text-[#6FBAFF] shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-snug flex-1 pt-0.5">{toastText}</p>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <Link
                                to="/inbox"
                                onClick={dismissToast}
                                className="text-xs font-bold text-[#6FBAFF] hover:underline whitespace-nowrap"
                            >
                                Abrir
                            </Link>
                            <button
                                type="button"
                                onClick={dismissToast}
                                className="p-1 rounded-lg hover:bg-white/10 text-white/80"
                                aria-label="Cerrar aviso"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Header;
