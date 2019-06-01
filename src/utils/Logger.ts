import { ServiceConfiguration } from './ServiceConf';
import chalk from 'chalk';

export default class Logger {
  protected prefix: string;

  constructor(conf: ServiceConfiguration) {
    this.prefix = `[${conf.service}]:`;
  }

  public log(...args: any) {
    // print white
    console.log(this.prefix, ...args);
  }

  public ok(...args: any) {
    // print green
    console.log(chalk.green(this.prefix), ...args);
  }

  public error(...args: any) {
    // print red
    console.log(chalk.red(this.prefix), ...args);
  }

  public warn(...args: any) {
    // print yellow
    console.log(chalk.yellow(this.prefix), ...args);
  }

  public muted(...args: any) {
    // print gray
    console.log(chalk.gray(this.prefix), ...args);
  }

  public clean(...args: any) {
    // print gray
    console.log(...args);
  }

  public newLine() {
    console.log();
  }
}
