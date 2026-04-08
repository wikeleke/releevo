import api from './api';

/**
 * Abre el Customer Portal de Stripe (facturas, método de pago, cancelar renovación).
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function openStripeCustomerPortal() {
  try {
    const { data } = await api.post('/billing/portal');
    if (data?.url) {
      window.location.href = data.url;
      return { ok: true };
    }
    return { ok: false, message: 'No se recibió el enlace del portal de pago.' };
  } catch (err) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'No se pudo abrir el portal de facturación.',
    };
  }
}
