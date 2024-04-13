import chalk from "chalk";

class Log {
  defaultArg: any = [];
  noLog = false;

  greeting() {
    if (this.noLog) return;
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
    if (this.noLog) return;
    console.log(...this.defaultArg, ...arg);
  }

  info(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.blueBright(`[INFO]: `), ...arg);
  }

  error(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.red(`[ERROR]: `), ...arg);
  }

  server(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.blue(`[SERVER]: `), ...arg);
  }

  agent(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.yellow(`[AGENT]: `), ...arg);
  }

  client(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.magenta(`[CLIENT]: `), ...arg);
  }

  api(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.cyan(`[API]: `), ...arg);
  }

  debug(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.magenta(`[DEBUG]: `), ...arg);
  }

  route(route: string) {
    const log = new Log();
    log.defaultArg = [chalk.green(`[ROUTE "${route}"]: `)];
    log.noLog = this.noLog;
    return log;
  }

  socket(...arg: any) {
    const log = new Log();
    log.defaultArg = [chalk.yellow(`[SOCKET]: `)];
    log.noLog = this.noLog;
    return log;
  }

  warn(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.yellow(`[WARN]: `), ...arg);
  }

  success(...arg: any) {
    if (this.noLog) return;
    console.log(...this.defaultArg, chalk.green(`[SUCCESS]: `), ...arg);
  }

  custom(...arg: any) {
    const log = new Log();
    log.defaultArg = [...this.defaultArg, ...arg];
    log.noLog = this.noLog;
    return log;
  }
}

const log = new Log();

const clearLastLines = (count: number) => {
  process.stdout.moveCursor(0, -count);
  process.stdout.clearScreenDown();
};

export { Log, clearLastLines };
export default log;
