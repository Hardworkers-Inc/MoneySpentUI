export class NumberUtils {

  public static formatDecimal(value: number): string {
    return (value > 10 ? '' : '0') + value
  }

}
