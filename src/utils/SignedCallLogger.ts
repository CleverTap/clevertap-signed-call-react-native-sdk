import { LogLevel } from '../models/LogLevel';

export class SignedCallLogger {
  private static readonly defaultTagPrefix = '[CT]:[SignedCall]:[RN]';

  //Sets LogLevel.Info as default log level
  private static currentLogLevel = LogLevel.Info;

  static setLogLevel(priority: number): void {
    this.currentLogLevel = priority;
  }

  static verbose(options: { tag?: string; message: string }): void {
    let tag = options.tag || this.defaultTagPrefix;
    this._log(LogLevel.Verbose, tag, options.message);
  }

  static info(options: { tag?: string; message: string }): void {
    let tag = options.tag || this.defaultTagPrefix;
    this._log(LogLevel.Info, tag, options.message);
  }

  static debug(options: { tag?: string; message: string }): void {
    let tag = options.tag || this.defaultTagPrefix;
    this._log(LogLevel.Debug, tag, options.message);
  }

  private static _log(priority: LogLevel, tag: string, message: string): void {
    if (this.currentLogLevel > priority) {
      console.log(`${tag}: ${message}`);
    }
  }
}
