const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

module.exports = withNextIntl(
  withPWA({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
    generateEtags: false,
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ipdbnagmooxlihfeoima.supabase.co',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'mkznrlyszlhmxglvdxcu.supabase.co',
          pathname: '/**',
        },
      ],
      unoptimized: false,
    },
    staticPageGenerationTimeout: 1000,
    env: {
      PORT: process.env.PORT,
      BASE_API_URL: process.env.BASE_API_URL,
      APP_KEY: process.env.APP_KEY,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_SESSION_MAX_AGE: process.env.NEXTAUTH_SESSION_MAX_AGE,
      BASE_URL: process.env.BASE_URL,
      ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CDN_URL: process.env.CDN_URL,
      ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
      API_KEY: process.env.API_KEY,
      APP_DOMAIN: process.env.APP_DOMAIN,
    },
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'Content-Security-Policy',
              value: `frame-ancestors 'self' http://localhost:4006/`,
            },
          ],
        },
      ];
    },
    /**
     * @param {import('webpack').Configuration} config
     * @returns {import('webpack').Configuration}
     */
    webpack: (config) => {
      // Add dark mode support
      const rules = config.module.rules.find((r) => !!r.oneOf);
      rules.oneOf.forEach((loaders) => {
        if (Array.isArray(loaders.use)) {
          loaders.use.forEach((loader) => {
            const isCssLoader =
              typeof loader?.loader === 'string' && /(?<!post)css-loader/.test(loader?.loader);
            const hasGetLocalIdent = !!loader?.options?.modules?.getLocalIdent;
            if (isCssLoader && hasGetLocalIdent) {
              const { getLocalIdent } = loader.options.modules;
              if (getLocalIdent) {
                loader.options.modules.getLocalIdent = (...args) => {
                  if (args.includes('dark')) return 'dark';
                  return getLocalIdent(...args);
                };
              }
            }
          });
        }
      });

      // Add SVGR as a loader
      const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
          use: ['@svgr/webpack'],
        },
      );
      fileLoaderRule.exclude = /\.svg$/i;

      return config;
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
);
