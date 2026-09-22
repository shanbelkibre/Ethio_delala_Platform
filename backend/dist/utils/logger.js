"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class AppLogger {
    format(level, message) {
        return `[${level}] [${new Date().toISOString()}] ${message}`;
    }
    info(message, ...meta) {
        console.log(this.format('INFO', message), ...meta);
    }
    warn(message, ...meta) {
        console.warn(this.format('WARN', message), ...meta);
    }
    error(message, ...meta) {
        console.error(this.format('ERROR', message), ...meta);
    }
    debug(message, ...meta) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.format('DEBUG', message), ...meta);
        }
    }
}
exports.logger = new AppLogger();
