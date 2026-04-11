export const oneSignalConfig = {
  appId: process.env.ONESIGNAL_APP_ID || '',
  allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
};
