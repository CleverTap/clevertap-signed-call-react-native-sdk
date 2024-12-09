import { SignedCallLogger } from '../utils/SignedCallLogger';
enum DTMFKey {
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  STAR = '*',
  HASH = '#',
}

class DTMFKeyUtil {
  static fromString(value: string): DTMFKey {
    switch (value) {
      case '0':
        return DTMFKey.ZERO;
      case '1':
        return DTMFKey.ONE;
      case '2':
        return DTMFKey.TWO;
      case '3':
        return DTMFKey.THREE;
      case '4':
        return DTMFKey.FOUR;
      case '5':
        return DTMFKey.FIVE;
      case '6':
        return DTMFKey.SIX;
      case '7':
        return DTMFKey.SEVEN;
      case '8':
        return DTMFKey.EIGHT;
      case '9':
        return DTMFKey.NINE;
      case '*':
        return DTMFKey.STAR;
      case '#':
        return DTMFKey.HASH;
      default:
        const errorMessage = `"${value}" is not a valid value for DTMFKey.`;
        SignedCallLogger.debug({
          message: errorMessage,
        });
        throw new Error(errorMessage);
    }
  }
}

export { DTMFKey, DTMFKeyUtil };
