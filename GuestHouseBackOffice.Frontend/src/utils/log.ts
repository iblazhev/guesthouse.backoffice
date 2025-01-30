export class Log {
  public static debug<T>(msg: string, supportingDetails: T) {
    this.emit("debug", msg, supportingDetails);
  }

  public static error<T>(msg: string, supportingDetails: T) {
    this.emit("error", msg, supportingDetails);
  }

  public static info<T>(msg: string, supportingDetails: T | null = null) {
    this.emit("info", msg, supportingDetails);
  }

  public static warn<T>(msg: string, supportingDetails: T) {
    this.emit("warn", msg, supportingDetails);
  }

  private static emit<T>(
    msgType: "debug" | "info" | "error" | "warn",
    msg: string,
    supportingDetails: T,
  ) {
    if (supportingDetails != null) {
      console[msgType](msg, supportingDetails);
    } else {
      console[msgType](msg);
    }
  }
}
