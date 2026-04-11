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
    const iv = contents.slice(0, 16);
    const textBytes = contents.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(textBytes, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    try {
      const result: T = typeof decrypted === 'string' ? decrypted : JSON.parse(decrypted);
      return result;
    } catch {
      return decrypted as unknown as T;
    }
  } catch (error) {
    Logger.error(error, { location: 'decrypt' });
    return null;
  }
};
