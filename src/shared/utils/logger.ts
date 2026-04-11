type LogLevel = 'log' | 'info' | 'error';

interface LogOptions {
  location?: string;
  error?: Error;
}

const getTimestamp = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24 jam
  };
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('id-ID', options);
  return formatter.format(date);
};

const logMessage = (level: LogLevel, message: Error | unknown, options: LogOptions) => {
  const timestamp = getTimestamp();

  let logMessage = `\n===== ${timestamp} [${level.toUpperCase()}] =====`;

  if (options.location) {
    logMessage += ` [Location: ${options.location}]`;
  }

  logMessage += ` - ${message}`;

  if (options.error) {
    logMessage += `\nError: ${
      options.error instanceof Error ? options.error.stack : options.error
    }`;
  }

  logMessage += `\n===============================`;

  return logMessage;
};

const Logger = {
  log: (message: Error | unknown, options: LogOptions = {}) => {
    console.log(logMessage('log', message, options));
  },

  info: (message: Error | unknown, options: LogOptions = {}) => {
    console.info(logMessage('info', message, options));
  },

  error: (message: Error | unknown, options: LogOptions = {}) => {
    console.error(logMessage('error', message, options));
  },
};

export default Logger;
