import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User,
    LogOut,
    Menu,
    ChevronDown,
    FilePlus,
    Handshake,
    Star,
    Mail,
    Bell,
    BellRing,
    X,
    UserCircle,
    Settings,
    CreditCard,
    ChevronRight,
} from 'lucide-react';
import { openBillingOrSubscribe } from '../services/billingPortal';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser, useAuth } from "@clerk/clerk-react";
import { useMessageNotificationsContext } from '../context/MessageNotificationsContext.jsx';

/** Fila de submenú estilo Pipedrive: lista compacta, sin tarjetas tipo marketplace. */
const NavFlyoutItem = ({ icon: Icon, title, description, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900/20"
    >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white text-dark-500 transition-colors group-hover:border-dark-500/15 group-hover:text-brand-900">
            <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-oxford">{title}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-dark-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            {description ? (
                <span className="mt-0.5 block text-[12px] leading-snug text-dark-500">{description}</span>
            ) : null}
        </span>
    </button>
);

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
        <header className="sticky top-0 z-50 border-b border-line bg-white shadow-pd">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between py-3 md:py-3.5 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img src="/logo.png" alt="Releevo - Continuidad de los Negocios" className="h-16 md:h-20 w-auto object-contain group-hover:opacity-90 transition-opacity" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex gap-6 lg:gap-8 relative items-center" ref={megaMenuRef}>
                        <Link to="/marketplace" className="pd-nav-link">Mercado</Link>

                        {/* Vendedores Dropdown Trigger */}
                        <div
                            className="flex items-center cursor-pointer"
                            onMouseEnter={() => setIsMegaMenuOpen(true)}
                            onMouseLeave={() => setIsMegaMenuOpen(false)}
                        >
                            <button
                                type="button"
                                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                className={`flex items-center gap-1.5 pd-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900/25 rounded-md ${isMegaMenuOpen ? 'text-brand-900' : ''}`}
                            >
                                Vendedores
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-brand-900' : 'text-dark-300'}`} />
                            </button>

                            {/* Mega Menu Panel */}
                            {isMegaMenuOpen && (
                                <div className="absolute left-0 top-full z-50 w-[min(100vw-2rem,20rem)] cursor-default pt-2 transition-opacity duration-150 md:left-1/2 md:-translate-x-1/2">
                                    <div className="overflow-hidden rounded-lg border border-line bg-white py-1.5 shadow-pd-dropdown">
                                        <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                                            Vendedores
                                        </p>
                                        <div className="px-1.5 pb-1">
                                            <NavFlyoutItem
                                                icon={FilePlus}
                                                title="Publica tu empresa"
                                                description="Crea tu listado y llega a compradores acreditados."
                                                onClick={() => {
                                                    setIsMegaMenuOpen(false);
                                                    navigate('/signup');
                                                }}
                                            />
                                            <NavFlyoutItem
                                                icon={Handshake}
                                                title="Ayuda para vender"
                                                description="Asesoría para preparar y cerrar la venta de tu negocio."
                                                onClick={() => {
                                                    setIsMegaMenuOpen(false);
                                                    navigate('/signup');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/buyers" className="pd-nav-link">Compradores</Link>

                        {/* Pricing Dropdown Trigger */}
                        <div
                            className="flex items-center cursor-pointer"
                            ref={pricingMegaMenuRef}
                            onMouseEnter={() => setIsPricingMegaMenuOpen(true)}
                            onMouseLeave={() => setIsPricingMegaMenuOpen(false)}
                        >
                            <button
                                type="button"
                                onClick={() => setIsPricingMegaMenuOpen(!isPricingMegaMenuOpen)}
                                className={`flex items-center gap-1.5 pd-nav-link focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900/25 rounded-md ${isPricingMegaMenuOpen ? 'text-brand-900' : ''}`}
                            >
                                Precio
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPricingMegaMenuOpen ? 'rotate-180 text-brand-900' : 'text-dark-300'}`} />
                            </button>

                            {/* Pricing Mega Menu Panel */}
                            {isPricingMegaMenuOpen && (
                                <div className="absolute right-0 top-full z-50 w-[min(100vw-2rem,20rem)] cursor-default pt-2 transition-opacity duration-150">
                                    <div className="overflow-hidden rounded-lg border border-line bg-white py-1.5 shadow-pd-dropdown">
                                        <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                                            Precios
                                        </p>
                                        <div className="px-1.5 pb-1">
                                            <NavFlyoutItem
                                                icon={FilePlus}
                                                title="Planes para vendedores"
                                                description="Publicación, visibilidad y herramientas para cerrar."
                                                onClick={() => {
                                                    setIsPricingMegaMenuOpen(false);
                                                    navigate('/pricing/sellers');
                                                }}
                                            />
                                            <NavFlyoutItem
                                                icon={Star}
                                                title="Planes para compradores"
                                                description="Acceso al mercado y contacto con vendedores."
                                                onClick={() => {
                                                    setIsPricingMegaMenuOpen(false);
                                                    navigate('/pricing/buyers');
                                                }}
                                            />
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
                                    className="relative hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-oxford transition-colors hover:border-line hover:bg-light-100"
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
                                    className="relative hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-oxford transition-colors hover:border-line hover:bg-light-100"
                                    title="Mensajes"
                                    aria-label="Mensajes"
                                >
                                    <Mail className="w-5 h-5" strokeWidth={2.2} />
                                </Link>
                            </>
                        ) : null}
                        {/* Free valuation text link - Hidden on mobile, moved to dropdown */}
                        <Link to="/valuation" className="hidden rounded-lg px-3 py-2 text-[15px] font-semibold text-dark-700 transition-colors hover:bg-light-100 hover:text-brand-900 md:block">
                            Valúa tu compañía
                        </Link>

                        {/* Dropdown Menu Container */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-2 py-1 shadow-pd transition-shadow hover:shadow-pd-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900/25"
                            >
                                <Menu className="ml-1 h-5 w-5 text-oxford" />
                                <SignedIn>
                                    <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-dark-700 md:block">
                                        {userDisplayName}
                                    </span>
                                </SignedIn>
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-100">
                                    <User className="h-5 w-5 text-oxford" fill="currentColor" />
                                </div>
                            </button>

                            {/* Dropdown Panel */}
                            {isMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 max-h-[85vh] w-64 overflow-y-auto rounded-xl border border-line bg-white py-2 shadow-pd-dropdown md:w-56">

                                    {/* Mobile Only Navigation Menu */}
                                    <div className="md:hidden">
                                        <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-[15px] font-bold text-[#3B3C4B] hover:bg-light-100 transition-colors">
                                            Mercado
                                        </Link>

                                        <div className="mt-1 px-6 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-dark-400">Vendedores</div>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-6 py-2 text-[13px] font-semibold text-dark-700 hover:bg-light-100">
                                            Publica tu empresa
                                        </Link>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-6 py-2 text-[13px] font-semibold text-dark-700 hover:bg-light-100">
                                            Ayuda para vender
                                        </Link>

                                        <div className="mt-2 px-6 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-dark-400">Compradores</div>
                                        <Link to="/buyers" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-6 py-2 text-[13px] font-semibold text-dark-700 hover:bg-light-100">
                                            Directorio
                                        </Link>

                                        <div className="mt-2 px-6 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-dark-400">Precios</div>
                                        <Link to="/pricing/sellers" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-6 py-2 text-[13px] font-semibold text-dark-700 hover:bg-light-100">
                                            Planes para vendedores
                                        </Link>
                                        <Link to="/pricing/buyers" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-6 py-2 text-[13px] font-semibold text-dark-700 hover:bg-light-100">
                                            Planes para compradores
                                        </Link>

                                        <div className="border-t border-line my-2 mx-5"></div>
                                        <Link to="/valuation" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-[15px] font-bold text-brand-900 hover:bg-brand-50 transition-colors">
                                            Valúa tu compañía
                                        </Link>
                                        <div className="border-t border-line my-2 mx-5"></div>
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
                                        <div className="px-6 py-3 border-b border-line flex justify-between items-center">
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

                                    <div className="border-t border-line my-2 mx-5"></div>

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
                                        <div className="border-t border-line my-2 mx-5"></div>
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
