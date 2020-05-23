import moment from 'moment';
import chalk from 'chalk';

import { ServiceConfiguration } from '../config';

export enum LoggerMode {
  ALL,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

export class Logger {
  constructor(
    protected conf: ServiceConfiguration,
    protected callback: (mode: string, message?: any, ...optionalParams: any[]) => Promise<void> | null = null,
  ) {}

  public setLoggerCalback(
    callback: (mode: string, message?: any, ...optionalParams: any[]) => Promise<void> | null,
  ) {
    this.callback = callback;
  }

  public debug(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.DEBUG) {
      this.log(LoggerMode.DEBUG, ...args);
    }
  }

  public info(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.INFO) {
      this.log(LoggerMode.INFO, ...args);
    }
  }

  public warn(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.WARN) {
      this.log(LoggerMode.WARN, ...args);
    }
  }

  public error(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.ERROR) {
      this.log(LoggerMode.ERROR, ...args);
    }
  }

  private log(mode: LoggerMode, ...args: any) {
    let modeLabel = 'LOG';
    let modeChalk = chalk.white;

    switch (mode) {
      case LoggerMode.DEBUG:
        modeLabel = 'DEBUG';
        modeChalk = chalk.gray;
        break;
      case LoggerMode.INFO:
        modeLabel = 'INFO';
        modeChalk = chalk.white;
        break;
      case LoggerMode.WARN:
        modeLabel = 'WARN';
        modeChalk = chalk.yellow;
        break;
      case LoggerMode.ERROR:
        modeLabel = 'ERROR';
        modeChalk = chalk.red;
        break;
    }

    const prefix = `[${this.conf.environment}::${this.conf.service}] [${moment().format('YYYY-MM-DD HH:mm:ss:SSS')}] [${modeLabel}]`;
    console.log(modeChalk(prefix), ...args);

    if (this.callback) {
      try {
        this.callback(modeLabel, ...args);
      } catch (error) {
        this.error('Error in Logger callback', error);
      }
    }
  }
}
