/**
 * Enum representing what level of logs will Android and iOS project be printing on their consoles respectively.
 */
export enum LogLevel {
  //disables all debugging
  Off = -1,

  //default level, shows minimal SDK integration related logging
  Info = 0,

  //shows debug output
  Debug = 2,

  //shows verbose output
  Verbose = 3,
}
