import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, LogOut, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { ExitSurveyModal } from './ExitSurveyModal';

export function SellerCompanyWizard({ accountEmail, onBack, onComplete }) {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [sub, setSub] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [companyType, setCompanyType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [verifiedUrl, setVerifiedUrl] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [owners, setOwners] = useState([{ name: '', companyRole: '' }]);
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [useOtherEmail, setUseOtherEmail] = useState(false);
  const [contactEmail, setContactEmail] = useState('');

  const loadOptions = useCallback(async () => {
    try {
      const { data } = await api.get('/users/onboarding/seller-options');
      if (Array.isArray(data?.companyTypes)) {
        setCompanyTypes(data.companyTypes);
      }
    } catch {
      setCompanyTypes([]);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const verifySite = async () => {
    setVerifyMsg('');
    setVerifiedUrl('');
    if (!website.trim()) {
      setVerifyMsg('Escribe la página web de la empresa');
      return;
    }
    setVerifying(true);
    try {
      const { data } = await api.post('/users/onboarding/verify-website', { url: website.trim() });
      if (data?.ok && data?.url) {
        setVerifiedUrl(data.url);
        setVerifyMsg('Sitio verificado correctamente.');
      }
    } catch (err) {
      setVerifyMsg(err?.response?.data?.message || 'No pudimos verificar este sitio.');
    } finally {
      setVerifying(false);
    }
  };

  const addOwner = () => {
    if (owners.length >= 12) return;
    setOwners((o) => [...o, { name: '', companyRole: '' }]);
  };

  const removeOwner = (i) => {
    if (owners.length <= 1) return;
    setOwners((o) => o.filter((_, idx) => idx !== i));
  };

  const setOwnerField = (i, field, value) => {
    setOwners((o) => o.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const validateStep = () => {
    if (sub === 0) {
      if (!companyType) return 'Elige el tipo de empresa';
      if (companyName.trim().length < 2) return 'Indica el nombre de la empresa';
    }
    if (sub === 1) {
      if (!verifiedUrl) return 'Verifica el sitio web antes de continuar';
    }
    if (sub === 2) {
      const ok = owners.every((o) => o.name.trim() && o.companyRole.trim());
      if (!ok) return 'Completa nombre y función de cada persona';
    }
    if (sub === 3) {
      if (address.trim().length < 8) return 'Indica una dirección más completa';
      const digits = contactPhone.replace(/\D/g, '');
      if (digits.length < 10) return 'Indica un teléfono válido (al menos 10 dígitos)';
      if (useOtherEmail) {
        const e = contactEmail.trim();
        if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Correo de contacto inválido';
      }
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      alert(err);
      return;
    }
    setSub((s) => Math.min(s + 1, 3));
  };

  const prev = () => {
    if (sub <= 0) onBack();
    else setSub((s) => s - 1);
  };

  const finalize = async () => {
    const err = validateStep();
    if (err) {
      alert(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        companyType,
        companyName: companyName.trim(),
        website: verifiedUrl || website.trim(),
        owners: owners.map((o) => ({ name: o.name.trim(), companyRole: o.companyRole.trim() })),
        address: address.trim(),
        contactPhone: contactPhone.trim(),
      };
      if (useOtherEmail) payload.contactEmail = contactEmail.trim();
      await api.post('/users/onboarding/seller', payload);
      onComplete();
    } catch (e) {
      alert(e?.response?.data?.message || 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitle = ['Datos generales', 'Sitio web', 'Propietarios y roles', 'Contacto y ubicación'][sub];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-[#111124]">
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur border-b border-[#E8E9EF] px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          className="inline-flex items-center text-sm font-semibold text-[#5C5D6B] hover:text-[#111124]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" aria-hidden />
          {sub === 0 ? 'Volver' : 'Atrás'}
        </button>
        <span className="text-xs font-bold text-[#7A7B8B] uppercase tracking-wide truncate">
          {stepTitle} · {sub + 1}/4
        </span>
        <button
          type="button"
          onClick={() => setExitOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5764FF] hover:text-[#4550E6]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Salir
        </button>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= sub ? 'bg-[#111124]' : 'bg-[#E8E9EF]'}`}
            />
          ))}
        </div>

        {sub === 0 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="co-type" className="block text-sm font-bold text-[#111124] mb-2">
                Tipo de empresa
              </label>
              <select
                id="co-type"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full rounded-xl border-2 border-[#E8E9EF] px-4 py-3 text-[#111124] font-medium focus:border-[#111124] focus:outline-none"
              >
                <option value="">Selecciona una opción</option>
                {companyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="co-name" className="block text-sm font-bold text-[#111124] mb-2">
                Nombre de la empresa
              </label>
              <input
                id="co-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border-2 border-[#E8E9EF] px-4 py-3 focus:border-[#111124] focus:outline-none"
                placeholder="Ej. Distribuidora Central S.A. de C.V."
                autoComplete="organization"
              />
            </div>
          </div>
        )}

        {sub === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-[#5C5D6B] font-medium leading-relaxed">
              Ingresa la página web pública. Comprobaremos que el sitio responde antes de continuar.
            </p>
            <div>
              <label htmlFor="co-web" className="block text-sm font-bold text-[#111124] mb-2">
                Sitio web
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="co-web"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    setVerifiedUrl('');
                    setVerifyMsg('');
                  }}
                  className="flex-1 rounded-xl border-2 border-[#E8E9EF] px-4 py-3 focus:border-[#111124] focus:outline-none"
                  placeholder="https://tuempresa.com"
                  inputMode="url"
                />
                <button
                  type="button"
                  onClick={verifySite}
                  disabled={verifying}
                  className="rounded-xl px-5 py-3 font-bold text-white bg-[#111124] hover:bg-[#1f1f3a] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Verificar
                </button>
              </div>
              {verifyMsg ? (
                <p
                  className={`mt-2 text-sm font-medium ${verifiedUrl ? 'text-emerald-700' : 'text-red-600'}`}
                >
                  {verifyMsg}
                </p>
              ) : null}
            </div>
          </div>
        )}

        {sub === 2 && (
          <div className="space-y-5">
            <p className="text-sm text-[#5C5D6B] font-medium">
              Agrega a las personas con participación relevante y su función (ej. socio, representante legal).
            </p>
            {owners.map((row, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-dashed border-[#D9DAE3] p-4 space-y-3 bg-[#FAFBFC]"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-[#7A7B8B] uppercase">Persona {i + 1}</span>
                  {owners.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeOwner(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      aria-label="Quitar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <input
                  value={row.name}
                  onChange={(e) => setOwnerField(i, 'name', e.target.value)}
                  className="w-full rounded-xl border border-[#E8E9EF] px-3 py-2.5 focus:border-[#111124] focus:outline-none"
                  placeholder="Nombre completo"
                />
                <input
                  value={row.companyRole}
                  onChange={(e) => setOwnerField(i, 'companyRole', e.target.value)}
                  className="w-full rounded-xl border border-[#E8E9EF] px-3 py-2.5 focus:border-[#111124] focus:outline-none"
                  placeholder="Función (ej. Director general, socio mayoritario)"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addOwner}
              disabled={owners.length >= 12}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#5764FF] hover:text-[#4550E6] disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              Agregar otra persona
            </button>
          </div>
        )}

        {sub === 3 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="co-addr" className="block text-sm font-bold text-[#111124] mb-2">
                Dirección fiscal o de operaciones
              </label>
              <textarea
                id="co-addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-xl border-2 border-[#E8E9EF] px-4 py-3 focus:border-[#111124] focus:outline-none resize-y"
                placeholder="Calle, número, colonia, ciudad, estado, CP"
              />
            </div>
            <div>
              <label htmlFor="co-phone" className="block text-sm font-bold text-[#111124] mb-2">
                Teléfono de contacto
              </label>
              <input
                id="co-phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border-2 border-[#E8E9EF] px-4 py-3 focus:border-[#111124] focus:outline-none"
                placeholder="10 dígitos o más, con lada"
                inputMode="tel"
              />
            </div>
            <div className="rounded-xl border-2 border-[#E8E9EF] p-4 space-y-3">
              <p className="text-sm font-bold text-[#111124]">Correo de contacto</p>
              <p className="text-xs text-[#7A7B8B]">
                Cuenta en Releevo: <span className="font-semibold text-[#111124]">{accountEmail}</span>
              </p>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={useOtherEmail}
                  onChange={(e) => {
                    setUseOtherEmail(e.target.checked);
                    if (!e.target.checked) setContactEmail('');
                  }}
                  className="rounded border-[#C5C6D0]"
                />
                Usar un correo distinto para temas del negocio
              </label>
              {useOtherEmail ? (
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#E8E9EF] px-4 py-3 focus:border-[#111124] focus:outline-none"
                  placeholder="contacto@empresa.com"
                  type="email"
                  autoComplete="email"
                />
              ) : null}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <button
            type="button"
            onClick={prev}
            className="px-6 py-3 rounded-xl font-semibold border-2 border-[#E8E9EF] text-[#111124] hover:bg-[#F8F9FE]"
          >
            {sub === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          {sub < 3 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#111124] hover:bg-[#1f1f3a]"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 text-emerald-400" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={finalize}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#111124] hover:bg-[#1f1f3a] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              Finalizar y continuar
            </button>
          )}
        </div>
      </div>

      <ExitSurveyModal
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        onAfterExit={() => {
          window.location.href = '/';
        }}
      />
    </div>
  );
}
