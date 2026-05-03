export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PILGRIM: {
    DASHBOARD: '/',
    FAMILY: {
      INDEX: '/family',
      FORM: '/family/form',
    },
    TRANSACTION: {
      INDEX: '/transactions',
      FORM: '/transactions/form',
      DETAIL: '/transactions',
    },
  },
  PROVIDER: {
    DASHBOARD: (slug: string = 'p') => `/${slug}/dashboard`,
    SUBMISSIONS: (slug: string = 'p') => `/${slug}/submissions`,
    PAYMENT_VERIFICATION: (slug: string = 'p') => `/${slug}/payment-verification`,
    MANIFEST: (slug: string = 'p', id: string) => `/${slug}/submissions/${id}/manifest`,
    SETTINGS: (slug: string = 'p') => `/${slug}/settings`,
    AUTH: {
      LOGIN: (slug: string = 'p') => `/${slug}/auth/login`,
      FORGOT_PASSWORD: (slug: string = 'p') => `/${slug}/auth/forgot_password`,
      RESET_PASSWORD: (slug: string = 'p') => `/${slug}/auth/reset_password`,
      SETUP: (slug: string = 'p') => `/${slug}/auth/setup`,
    },
  },
  ADMIN: {
    CONSOLE: '/console',
    AGENCIES: '/console/agencies',
  },
} as const;
