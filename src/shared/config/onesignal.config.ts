import OneSignal from 'react-onesignal';

export const oneSignalConfig = {
  appId: process.env.ONESIGNAL_APP_ID || '',
  allowLocalhostAsSecureOrigin: true,
};

export const initOneSignal = async () => {
  await OneSignal.init({
    ...oneSignalConfig,
    welcomeNotification: {
      disable: false,
      title: 'Welcome to Badalin! 🕋',
      message: 'You will now receive real-time updates for your visa status.',
      url: process.env.BASE_URL,
    },
    promptOptions: {
      slidedown: {
        prompts: [
          {
            type: 'push',
            autoPrompt: true,
            text: {
              actionMessage:
                'Track your visa status in real-time. Receive alerts for approvals and issues.',
              acceptButton: 'Yes, Notify Me',
              cancelButton: 'Maybe Later',
            },
            delay: {
              timeDelay: 5000,
            },
            // colors: {
            //   button: {
            //     text: '#FFFFFF',
            //     background: '#F28123', // Badalin Orange
            //   },
            // },
          },
        ],
      },
    },
  });
};
