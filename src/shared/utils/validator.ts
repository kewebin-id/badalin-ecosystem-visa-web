export const isEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isNumber = (num: string) => {
  const regex = /^\d+$/;
  return regex.test(num);
};

export const isPhone = (phone: string) => {
  const regex = /^(?:\+62|0)[0-9]{8,13}$/;
  return regex.test(phone);
};

export const isNumeral = (num: string): boolean => {
  const numeralRegex = /^(0|[1-9]\d*)$/;
  return numeralRegex.test(num);
};

export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Validates if email ends with allowed domain
 * @param email - Email to validate
 * @param allowedDomain - Domain to check
 * @returns true if email ends with allowed domain
 */
export const isAllowedEmailDomain = (
  email: string,
  allowedDomain: string = process.env.ALLOWED_EMAIL_DOMAIN || '',
): boolean => {
  return email.endsWith(allowedDomain);
};

export const isBase64 = (str: string) => {
  const regex = /^data:[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+;base64,[a-zA-Z0-9+/=]+$/;
  return regex.test(str);
};
