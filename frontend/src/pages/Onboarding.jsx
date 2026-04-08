import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ClipboardList,
  Loader2,
  Search,
} from 'lucide-react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { SellerCompanyWizard } from '../components/onboarding/SellerCompanyWizard';

const Onboarding = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(() =>
    searchParams.get('intent') === 'seller' ? 'seller-intro' : 'choose'
  );
  const [submitting, setSubmitting] = useState(false);

  const accountEmail = user?.primaryEmailAddress?.emailAddress || '';

  useEffect(() => {
    if (searchParams.get('intent') === 'seller') setStep('seller-intro');
  }, [searchParams]);

  const refreshGate = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const { data } = await api.get('/users/me');
      if (!data?.needsRoleOnboarding) {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      /* deja paso a la UI; protect puede fallar en frío */
    } finally {
      setChecking(false);
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setChecking(false);
      return;
    }
    refreshGate();
  }, [isLoaded, isSignedIn, refreshGate]);

  const completeRole = async (role) => {
    setSubmitting(true);
    try {
      await api.post('/users/onboarding/role', { role });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || 'No se pudo guardar tu perfil. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const goChoose = () => {
    setStep('choose');
    setSearchParams({}, { replace: true });
  };

  if (!isLoaded || checking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 text-[#111124] animate-spin" aria-hidden />
      </div>
    );
  }

  if (!isSignedIn) return <RedirectToSignIn />;

  if (step === 'seller-company') {
    return (
      <SellerCompanyWizard
        accountEmail={accountEmail}
        onBack={() => setStep('seller-requirements')}
        onComplete={() => navigate('/dashboard', { replace: true })}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-[#111124]">
      <div className="max-w-lg mx-auto px-6 py-10 sm:py-14">
        {step === 'choose' && (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-center">
              ¿Cómo quieres usar Releevo?
            </h1>
            <p className="text-center text-[#5C5D6B] text-sm sm:text-base font-medium mb-10">
              Ya creaste tu cuenta. Elige una opción para continuar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStep('seller-intro')}
                className="group text-left rounded-2xl border-2 border-[#E8E9EF] bg-white p-6 shadow-sm hover:border-[#111124] hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111124] focus-visible:ring-offset-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F1F6] text-[#111124] mb-4 group-hover:bg-[#111124] group-hover:text-white transition-colors">
                  <Building2 className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="text-lg font-bold mb-2">Quiero vender mi empresa</h2>
                <p className="text-sm text-[#7A7B8B] leading-relaxed">
                  Publica y conecta con compradores verificados en el marketplace.
                </p>
              </button>

              <button
                type="button"
                onClick={() => completeRole('buyer')}
                disabled={submitting}
                className="group text-left rounded-2xl border-2 border-[#E8E9EF] bg-white p-6 shadow-sm hover:border-[#111124] hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111124] focus-visible:ring-offset-2 disabled:opacity-60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F4FF] text-[#111124] mb-4 group-hover:bg-[#111124] group-hover:text-white transition-colors">
                  <Search className="h-6 w-6" aria-hidden />
                </div>
                <h2 className="text-lg font-bold mb-2">Quiero comprar una empresa</h2>
                <p className="text-sm text-[#7A7B8B] leading-relaxed">
                  Explora listados y guarda oportunidades que encajen con tu búsqueda.
                </p>
              </button>
            </div>
          </>
        )}

        {step === 'seller-intro' && (
          <>
            <button
              type="button"
              onClick={goChoose}
              className="inline-flex items-center text-[#5C5D6B] hover:text-[#111124] mb-8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111124] rounded"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>

            <h1 className="text-3xl sm:text-[2rem] font-extrabold tracking-tight leading-tight mb-4">
              Prepárate para el marketplace
            </h1>
            <p className="text-[#5C5D6B] text-base sm:text-lg font-medium mb-10 leading-relaxed">
              Estás a tres pasos de conectar con compradores para tu negocio.
            </p>

            <ol className="space-y-6 mb-12 text-[#3B3C4B] font-medium leading-relaxed list-decimal pl-5 marker:font-bold marker:text-[#111124]">
              <li>
                Arma tu perfil, el listado y la sala de datos para atraer compradores.
              </li>
              <li>
                Verifica tu identidad y tu empresa y envía todo a{' '}
                <abbr
                  title="Nuestro equipo revisa tu información antes de publicar el anuncio."
                  className="border-b border-dotted border-[#111124] cursor-help font-semibold text-[#111124] no-underline"
                >
                  aprobación
                </abbr>
                .
              </li>
              <li>
                Paga la mensualidad del listado para publicarte como anuncio de confianza.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setStep('seller-requirements')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111124] text-white font-bold text-lg px-10 py-4 shadow-lg hover:bg-[#1f1f3a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111124]"
            >
              Genial, empecemos
              <ArrowRight className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden />
            </button>

            <p className="mt-6 text-sm text-[#7A7B8B] italic">
              Esto debería llevarte menos de 10 minutos en total.
            </p>
          </>
        )}

        {step === 'seller-requirements' && (
          <>
            <button
              type="button"
              onClick={() => setStep('seller-intro')}
              className="inline-flex items-center text-[#5C5D6B] hover:text-[#111124] mb-8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111124] rounded"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F1F6] text-[#111124]">
                <ClipboardList className="h-6 w-6" aria-hidden />
              </div>
              <p className="text-xs font-bold text-[#7A7B8B] uppercase tracking-wide">
                Antes del formulario
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
              Qué información vas a necesitar
            </h1>
            <p className="text-[#5C5D6B] text-base font-medium mb-8 leading-relaxed">
              En el asistente te iremos pidiendo datos de tu empresa. Ten a mano lo siguiente para no
              tener que detenerte a mitad de camino.
            </p>

            <ul className="space-y-4 mb-8 text-[#3B3C4B] font-medium leading-relaxed">
              <li className="flex gap-3">
                <span className="text-[#111124] font-extrabold shrink-0">1.</span>
                <span>
                  <strong className="text-[#111124]">Tipo de empresa</strong> (sector o naturaleza del
                  negocio) y <strong className="text-[#111124]">nombre</strong> de la compañía tal como
                  quieres que figure en Releevo.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111124] font-extrabold shrink-0">2.</span>
                <span>
                  <strong className="text-[#111124]">Sitio web</strong> público y activo. Validaremos
                  desde la plataforma que responde; ten lista la URL completa (con{' '}
                  <code className="text-sm bg-[#F0F1F6] px-1 rounded">https://</code> si aplica).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111124] font-extrabold shrink-0">3.</span>
                <span>
                  <strong className="text-[#111124]">Propietarios o personas clave</strong>: nombre y
                  función en la empresa (por ejemplo socio, director general, representante legal).
                  Podrás agregar a varias personas.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111124] font-extrabold shrink-0">4.</span>
                <span>
                  <strong className="text-[#111124]">Dirección</strong> de operaciones o fiscal
                  (calle, ciudad, estado; idealmente con código postal).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#111124] font-extrabold shrink-0">5.</span>
                <span>
                  <strong className="text-[#111124]">Teléfono de contacto</strong> del negocio y, si no
                  es el mismo, un <strong className="text-[#111124]">correo de contacto</strong> distinto
                  al correo con el que abriste tu cuenta en Releevo.
                </span>
              </li>
            </ul>

            <div className="rounded-2xl border-2 border-dashed border-[#D9DAE3] bg-[#FAFBFC] px-4 py-3 mb-10">
              <p className="text-sm text-[#5C5D6B] leading-relaxed">
                <strong className="text-[#111124]">Después de este paso</strong> vendrán la verificación
                de identidad, documentos del negocio y el envío a aprobación del listado, como te
                comentamos antes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('seller-company')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111124] text-white font-bold text-lg px-10 py-4 shadow-lg hover:bg-[#1f1f3a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111124]"
            >
              Continuar al asistente
              <ArrowRight className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
