export enum PrefixEndpoint {
  V1 = '/api/v1',
  VISA = `${PrefixEndpoint.V1}/visa`,
}

export const endpoints = {
  auth: {
    checkUser: `${PrefixEndpoint.VISA}/auth/check-user`,
    register: `${PrefixEndpoint.VISA}/auth/register`,
    login: `${PrefixEndpoint.VISA}/auth/login`,
    socialAuth: `${PrefixEndpoint.VISA}/auth/social-auth`,
    forgotPassword: `${PrefixEndpoint.VISA}/auth/forgot-password`,
    resetPassword: `${PrefixEndpoint.VISA}/auth/reset-password`,
  },
  booking: {
    carpool: {
      invite: `${PrefixEndpoint.VISA}/booking/carpool/invite`,
      merge: `${PrefixEndpoint.VISA}/booking/carpool/merge`,
      respond: (inviteId: number) => `${PrefixEndpoint.VISA}/booking/carpool/${inviteId}/respond`,
    },
  },
  visa: {
    dashboard: {
      history: `${PrefixEndpoint.VISA}/dashboard/history`,
    },
    pilgrims: {
      base: `${PrefixEndpoint.VISA}/pilgrims`,
      detail: (id: string) => `${PrefixEndpoint.VISA}/pilgrims/${id}`,
    },
    transactions: {
      base: `${PrefixEndpoint.VISA}/transactions`,
      detail: (id: string) => `${PrefixEndpoint.VISA}/transactions/${id}`,
      paymentProof: (id: string) => `${PrefixEndpoint.VISA}/transactions/${id}/upload-proof`,
    },
    submissions: {
      preview: `${PrefixEndpoint.VISA}/submissions/preview`,
    },
    upload: `${PrefixEndpoint.V1}/upload`,
  },
  nextApi: {
    auth: {
      checkUser: '/api/auth/check-user',
      register: '/api/auth/register',
      login: '/api/auth/login',
      socialAuth: '/api/auth/social-auth',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
    },
    visa: {
      dashboard: {
        history: '/api/dashboard',
      },
      pilgrims: {
        base: '/api/visa/pilgrims',
        detail: (id: string) => `/api/visa/pilgrims/${id}`,
      },
      transactions: {
        base: '/api/visa/transactions',
        detail: (id: string) => `/api/visa/transactions/${id}`,
        paymentProof: (id: string) => `/api/visa/transactions/${id}/payment-proof`,
      },
      submissions: {
        preview: '/api/visa/submissions/preview',
      },
      upload: '/api/visa/upload',
    },
  },
};
