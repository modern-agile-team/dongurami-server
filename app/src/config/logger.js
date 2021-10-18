'use strict';

const { transports, createLogger, format } = require('winston');

const { combine, timestamp, printf, colorize, simple } = format;
require('winston-daily-rotate-file');

const printFormat = printf(
  (info) => `${info.timestamp} [ ${info.level} ] ${info.message}`
);

const printLogFormat = {
  file: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:dd',
    }),
    printFormat
  ),
  console: combine(colorize(), simple()),
};

const opts = {
  file: new transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: './src/config/logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    format: printLogFormat.file,
  }),
  console: new transports.Console({
    level: 'info',
    format: printLogFormat.console,
  }),
};

const logger = createLogger({
  transports: [opts.file],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(opts.console);
}

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;
