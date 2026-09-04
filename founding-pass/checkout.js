const endpoint = document.querySelector('meta[name="pmuloop-checkout-endpoint"]')?.content.trim();
const checkoutButton = document.querySelector('#checkout-button');
const checkoutStatus = document.querySelector('#checkout-status');

if (endpoint && checkoutButton instanceof HTMLButtonElement) {
  checkoutButton.disabled = false;
  checkoutButton.textContent = 'Acquista il Founding Pass';
  checkoutButton.addEventListener('click', async () => {
    checkoutButton.disabled = true;
    checkoutButton.textContent = 'Apro il pagamento sicuro…';
    if (checkoutStatus) checkoutStatus.textContent = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string') throw new Error('checkout_unavailable');
      const checkoutUrl = new URL(result.url);
      if (checkoutUrl.protocol !== 'https:' || checkoutUrl.hostname !== 'checkout.stripe.com') {
        throw new Error('invalid_checkout_url');
      }
      window.location.assign(checkoutUrl.href);
    } catch {
      checkoutButton.disabled = false;
      checkoutButton.textContent = 'Riprova il pagamento';
      if (checkoutStatus) checkoutStatus.textContent = 'Il pagamento non è disponibile in questo momento. Riprova tra poco.';
    }
  });
}
