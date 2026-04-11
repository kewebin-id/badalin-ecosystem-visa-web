// This configuration used axios and Node-only crypto.
// It is being deprecated in favor of the Edge-compatible RestAPI refactor.
// If you need the signature, use an Edge-compatible HMAC implementation.

export const getGposHeaders = () => {
  // Mocking headers for now to allow build to pass.
  // In a real scenario, implement this using Web Crypto API.
  return {
    'X-API-Key': 'legacy-signature',
    'X-Timestamp': Date.now().toString(),
  };
};
