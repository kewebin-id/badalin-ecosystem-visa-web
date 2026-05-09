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
    submissions: {
      base: `${PrefixEndpoint.VISA}/submissions`,
      detail: (id: string) => `${PrefixEndpoint.VISA}/submissions/${id}`,
      paymentProof: (id: string) => `${PrefixEndpoint.VISA}/transactions/${id}/upload-proof`,
      preview: `${PrefixEndpoint.VISA}/submissions/preview`,
    },
    upload: `${PrefixEndpoint.V1}/upload`,
  },
  provider: {
    auth: {
      verifyToken: '/api/v1/p/auth/verify-token',
      register: '/api/v1/p/auth/register',
      login: '/api/v1/p/auth/login',
      forgotPassword: '/api/v1/p/auth/forgot-password',
      resetPassword: '/api/v1/p/auth/reset-password',
    },
    agency: {
      base: '/api/v1/p/agency',
      checkSlug: '/api/v1/p/agency/check-slug',
      validateSession: (slug: string = 'p') => `/api/v1/${slug}/agency/validate`,
    },
    dashboard: {
      summary: (slug: string = 'p') => `/api/v1/${slug}/dashboard/summary`,
    },
    submissions: {
      base: (slug: string = 'p') => `/api/v1/${slug}/submissions`,
      detail: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}`,
      verifyPayment: (slug: string, id: string) =>
        `/api/v1/${slug}/submissions/${id}/verify-payment`,
      review: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/review`,
      flightManifest: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/manifest/flight`,
      hotelManifest: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/manifest/hotel`,
      transportManifest: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/manifest/transport`,
      submitVisas: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/submit-visas`,
      uploadVisas: (slug: string, id: string) => `/api/v1/${slug}/submissions/${id}/upload-visas`,
    },
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
    provider: {
      auth: {
        verifyToken: '/api/provider/auth/verify-token',
        register: '/api/provider/auth/register',
        login: '/api/provider/auth/login',
        forgotPassword: '/api/provider/auth/forgot-password',
        resetPassword: '/api/provider/auth/reset-password',
      },
      agency: {
        base: '/api/provider/agency',
        checkSlug: '/api/provider/agency/check-slug',
        validateSession: '/api/provider/agency/validate',
      },
      dashboard: {
        summary: '/api/provider/dashboard/summary',
      },
      submissions: {
        base: '/api/provider/submissions',
        detail: (id: string) => `/api/provider/submissions/${id}`,
        verifyPayment: (id: string) => `/api/provider/submissions/${id}/verify-payment`,
        review: (id: string) => `/api/provider/submissions/${id}/review`,
        flightManifest: (id: string) => `/api/provider/submissions/${id}/manifest/flight`,
        hotelManifest: (id: string) => `/api/provider/submissions/${id}/manifest/hotel`,
        transportManifest: (id: string) => `/api/provider/submissions/${id}/manifest/transport`,
        submitVisas: (id: string) => `/api/provider/submissions/${id}/submit-visas`,
        uploadVisas: (id: string) => `/api/provider/submissions/${id}/upload-visas`,
      },
    },
    visa: {
      dashboard: {
        history: '/api/dashboard',
      },
      pilgrims: {
        base: '/api/visa/pilgrims',
        detail: (id: string) => `/api/visa/pilgrims/${id}`,
      },
      submissions: {
        base: '/api/visa/submissions',
        detail: (id: string) => `/api/visa/submissions/${id}`,
        paymentProof: (id: string) => `/api/visa/submissions/${id}/payment-proof`,
        preview: '/api/visa/submissions/preview',
      },
      upload: '/api/visa/upload',
    },
  },
};
