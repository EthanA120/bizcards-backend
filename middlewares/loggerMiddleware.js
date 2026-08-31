import morgan from "morgan";
import chalk from "chalk";
import fs from "fs";
import path from "path";

// Define custom Morgan tokens
morgan.token("local-date", () => new Date().toLocaleString());

morgan.token("colored-status", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  return chalk.green(status);
});

// Export console logger middleware instance
export const consoleLogger = morgan(
  ":local-date :method :url :colored-status :response-time ms"
);


/**
 * Middleware for logging error responses to a file
 */
export const fileLogger = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      const now = new Date();

      // Format date for log file name (YYYY-MM-DD)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      // Ensure logs directory exists
      const logsDir = path.resolve("logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      // Format timestamp for log entry
      const timestamp = now.toISOString().replace("T", ", ").substring(0, 20);

      // Construct log message string
      const logMessage = `[${timestamp}] Status: ${res.statusCode} | Method: ${req.method} | URL: ${req.originalUrl} | Message: ${res.statusMessage || "Error"}\n`;

      // Log file path
      const logFilePath = path.join(logsDir, `${dateString}.log`);

      // Append log entry to the daily log file
      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
          console.error("Failed to write to log file:", err);
        }
      });
    }
  });

  next();
};