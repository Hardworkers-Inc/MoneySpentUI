import {NumberUtils} from "./number-utils";

export class DateTimeUtils {

  public static formatDateTime(dateTime: any, dateDelimiter: string, timeDelimiter: string, allDelimiter: string) {
    return ''
      + NumberUtils.formatDecimal(dateTime[0]) + dateDelimiter
      + NumberUtils.formatDecimal(dateTime[1]) + dateDelimiter
      + NumberUtils.formatDecimal(dateTime[2]) + allDelimiter
      + NumberUtils.formatDecimal(dateTime[3]) + timeDelimiter
      + NumberUtils.formatDecimal(dateTime[4])
  }

  public static getNowDateTimeInString(): string {
    let now = new Date();
    return DateTimeUtils.fromArrayToFormatString({
      0: now.getFullYear(),
      1: now.getMonth() + 1,
      2: now.getDate(),
      3: now.getHours(),
      4: now.getMinutes()
    })
  }

  public static fromArrayToViewingString(dateTime: any): string {
    return DateTimeUtils.formatDateTime(dateTime, '.', ':', ' ')
  }

  public static fromArrayToFormatString(dateTime: any): string {
    return DateTimeUtils.formatDateTime(dateTime, '-', ':', 'T')
  }
}
