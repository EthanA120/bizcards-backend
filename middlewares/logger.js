import morgan from "morgan";
import chalk from "chalk";

function loggerMiddleware(req, res, next) {
  // Define a custom token for local time
  morgan.token('local-date', function () {
    return new Date().toLocaleString();
  });

  morgan.token('colored-status', function () {
    const status = res.statusCode;
    if (status >= 500) {
      return chalk.red(status);
    } else if (status >= 400) {
      return chalk.yellow(status);
    } else {
      return chalk.green(status);
    }
  });

  const logger = morgan(
    `:local-date :method :url :colored-status :response-time ms`,
  );
  logger(req, res, next);
}

export default loggerMiddleware;