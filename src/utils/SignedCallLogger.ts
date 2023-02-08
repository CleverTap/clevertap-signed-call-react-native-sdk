import { LogLevel } from '../models/LogLevel';

export class SignedCallLogger {
  private static readonly defaultTagPrefix = '[CT]:[SignedCall]:[RN]';

  private static currentLogLevel = LogLevel.info;

  static setLogLevel(priority: number): void {
    this.currentLogLevel = priority;
  }

  static verbose(message: string, tag: string = this.defaultTagPrefix): void {
    this._log(LogLevel.verbose, tag, message);
  }

  static info(message: string, tag: string = this.defaultTagPrefix): void {
    this._log(LogLevel.info, tag, message);
  }

  static debug(message: string, tag: string = this.defaultTagPrefix): void {
    this._log(LogLevel.debug, tag, message);
  }

  private static _log(priority: LogLevel, tag: string, message: string): void {
    if (this.currentLogLevel > priority) {
      console.log(`${tag}: ${message}`);
    }
  }
}
