import { ServiceConfiguration } from './ServiceConf';
import moment from 'moment';
import chalk from 'chalk';

export enum LoggerMode {
  ALL,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

export default class Logger {
  constructor(protected conf: ServiceConfiguration) {}

  private getPrefix(mode: LoggerMode): string {
    let modeStr = '[ALL]  ';
    switch (mode) {
      case LoggerMode.ALL:
        modeStr = '[ALL]  ';
        break;
      case LoggerMode.DEBUG:
        modeStr = '[DEBUG]';
        break;
      case LoggerMode.INFO:
        modeStr = '[INFO] ';
        break;
      case LoggerMode.WARN:
        modeStr = '[WARN] ';
        break;
      case LoggerMode.ERROR:
        modeStr = '[ERROR]';
        break;
      case LoggerMode.OFF:
        modeStr = '[OFF]  ';
        break;
    }
    return `[${this.conf.environment}::${this.conf.service}] [${moment().format('YYYY-MM-DD HH:mm:ss:SSS')}] ${modeStr}`;
  }

  public debug(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.DEBUG) {
      // print gray
      console.log(chalk.gray(this.getPrefix(LoggerMode.DEBUG)), ...args);
    }
  }

  public info(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.INFO) {
      // print white
      console.log(this.getPrefix(LoggerMode.INFO), ...args);
    }
  }

  public warn(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.WARN) {
      // print yellow
      console.log(chalk.yellow(this.getPrefix(LoggerMode.WARN)), ...args);
    }
  }

  public error(...args: any) {
    if (this.conf.loggerMode <= LoggerMode.ERROR) {
      // print red
      console.log(chalk.red(this.getPrefix(LoggerMode.ERROR)), ...args);
    }
  }
}
