/**
 * Client-side encryption utility using Web Crypto API.
 * This is used to encrypt sensitive data (like passwords) before sending to the server.
 */

const getCryptoKey = async (password: string) => {
  const encoder = new TextEncoder();
  const rawKey = encoder.encode(password);
  
  // Use SHA-256 to create a 256-bit key from the app key
  const hash = await crypto.subtle.digest('SHA-256', rawKey);
  
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
};

export const encryptClient = async (plainText: string): Promise<string> => {
  try {
    const appKey = process.env.APP_KEY || '';
    const key = await getCryptoKey(appKey);
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    
    // Create a random 12-byte initialization vector for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data and convert to hex
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return Array.from(combined)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Encryption failed:', error);
    return plainText; // Fallback to plain text if encryption fails
  }
};
