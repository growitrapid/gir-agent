import chalk from "chalk";

class Log {
  defaultArg: any = [];

  greeting() {
    console.clear();
    console.log(
      chalk.cyanBright(`
   ██████╗ ██╗██████╗        █████╗  ██████╗ ███████╗███╗   ██╗████████╗
  ██╔════╝ ██║██╔══██╗      ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
  ██║  ███╗██║██████╔╝█████╗███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   
  ██║   ██║██║██╔══██╗╚════╝██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   
  ╚██████╔╝██║██║  ██║      ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   
   ╚═════╝ ╚═╝╚═╝  ╚═╝      ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   
`)
    );
  }

  raw(...arg: any) {
    console.log(...this.defaultArg, ...arg);
  }

  info(...arg: any) {
    console.log(...this.defaultArg, chalk.blueBright(`[INFO]: `), ...arg);
  }

  error(...arg: any) {
    console.log(...this.defaultArg, chalk.red(`[ERROR]: `), ...arg);
  }

  server(...arg: any) {
    console.log(...this.defaultArg, chalk.blue(`[SERVER]: `), ...arg);
  }

  agent(...arg: any) {
    console.log(...this.defaultArg, chalk.yellow(`[AGENT]: `), ...arg);
  }

  client(...arg: any) {
    console.log(...this.defaultArg, chalk.magenta(`[CLIENT]: `), ...arg);
  }

  api(...arg: any) {
    console.log(...this.defaultArg, chalk.cyan(`[API]: `), ...arg);
  }

  debug(...arg: any) {
    console.log(...this.defaultArg, chalk.magenta(`[DEBUG]: `), ...arg);
  }

  route(route: string) {
    const log = new Log();
    log.defaultArg = [chalk.green(`[ROUTE "${route}"]: `)];
    return log;
  }

  socket(...arg: any) {
    const log = new Log();
    log.defaultArg = [chalk.yellow(`[SOCKET]: `)];
    return log;
  }

  warn(...arg: any) {
    console.log(...this.defaultArg, chalk.yellow(`[WARN]: `), ...arg);
  }

  success(...arg: any) {
    console.log(...this.defaultArg, chalk.green(`[SUCCESS]: `), ...arg);
  }

  custom(...arg: any) {
    const log = new Log();
    log.defaultArg = arg;
    return log;
  }
}

const log = new Log();

export { Log };
export default log;
