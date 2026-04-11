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
    DASHBOARD: '/provider/dashboard',
    SUBMISSIONS: '/provider/submissions',
  },
  ADMIN: {
    CONSOLE: '/console',
    AGENCIES: '/console/agencies',
  },
} as const;
