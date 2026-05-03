import crypto from 'crypto';
import Logger from './logger';

const algorithm = 'aes-256-cbc';
const key = crypto
  .createHash('sha256')
  .update(process.env.APP_KEY || '')
  .digest();

export const encrypt = (plainText: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let cipherText = cipher.update(plainText, 'utf8', 'hex');
  cipherText += cipher.final('hex');
  return iv.toString('hex') + cipherText;
};

export const decrypt = <T extends object | string | undefined>(cipherText: string): T | null => {
  try {
    const contents = Buffer.from(cipherText, 'hex');
    
    // Attempt AES-GCM decryption (12-byte IV)
    try {
      const iv = contents.slice(0, 12);
      const authTag = contents.slice(contents.length - 16);
      const textBytes = contents.slice(12, contents.length - 16);
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(textBytes, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      try {
        return JSON.parse(decrypted) as T;
      } catch {
        return decrypted as unknown as T;
      }
    } catch (gcmError) {
      // Fallback to legacy AES-CBC
      const iv = contents.slice(0, 16);
      const textBytes = contents.slice(16);

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(textBytes, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      try {
        return (typeof decrypted === 'string' ? decrypted : JSON.parse(decrypted)) as T;
      } catch {
        return decrypted as unknown as T;
      }
    }
  } catch (error) {
    Logger.error(error, { location: 'decrypt' });
    return null;
  }
};
