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

/**
 * Si el usuario ya tiene membresía/suscripción pagada activa → portal Stripe.
 * Si no → página de precios correspondiente (comprador o vendedor).
 *
 * @param {(to: string) => void} navigate - función navigate de react-router
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function openBillingOrSubscribe(navigate) {
  try {
    const { data } = await api.get('/users/me');
    const role = String(data?.role || '').toLowerCase();
    const isPremium = Boolean(data?.isPremium);
    const hasActiveSellerSubscription = Boolean(data?.hasActiveSellerSubscription);

    if (role === 'admin') {
      return openStripeCustomerPortal();
    }

    if (role === 'buyer') {
      if (!isPremium) {
        navigate('/pricing/buyers');
        return { ok: true };
      }
      return openStripeCustomerPortal();
    }

    if (role === 'seller') {
      if (!hasActiveSellerSubscription) {
        navigate('/pricing/sellers');
        return { ok: true };
      }
      return openStripeCustomerPortal();
    }

    navigate('/pricing/buyers');
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'No se pudo comprobar tu cuenta.',
    };
  }
}
