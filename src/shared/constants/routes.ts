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
