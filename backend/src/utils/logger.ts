export interface ILogger {
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  debug(message: string, ...meta: unknown[]): void;
}

class AppLogger implements ILogger {
  private format(level: string, message: string): string {
    return `[${level}] [${new Date().toISOString()}] ${message}`;
  }

  info(message: string, ...meta: unknown[]): void {
    console.log(this.format('INFO', message), ...meta);
  }

  warn(message: string, ...meta: unknown[]): void {
    console.warn(this.format('WARN', message), ...meta);
  }

  error(message: string, ...meta: unknown[]): void {
    console.error(this.format('ERROR', message), ...meta);
  }

  debug(message: string, ...meta: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.format('DEBUG', message), ...meta);
    }
  }
}

export const logger: ILogger = new AppLogger();
