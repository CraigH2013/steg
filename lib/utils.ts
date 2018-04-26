import * as leftPad from "left-pad";

/**
 * Converts a string to an array of its unique characters
 *
 * @param str the string to get unique characters from
 */
export function uniqueCharsOf(str: string) {
  return Array.from(new Set(str));
}

/**
 * Converts integers to their hexadecimal value
 *
 * @param value the value to convert
 * @param len the minimum length of the outputed hex
 */
export function hexOf(value: number | string, prefix = true, len = 2) {
  const num = +value;
  if (Number.isNaN(num)) {
    throw Error("`value` must be a number");
  }
  if (!Number.isInteger(num)) {
    throw Error("`value` must be an integer");
  }
  return (prefix ? "0x" : "") + leftPad(num.toString(16), len, "0");
}

/**
 * Converts a character to its ASCII value in hexadecimal
 *
 * @param char the character to convert
 * @param len the minimum length of the outputed hex
 */
export function charToHex(char: string, prefix = true, len = 2) {
  if (char.length !== 1) {
    throw new Error("`char` must be a string with a length of 1");
  }
  return hexOf(char.charCodeAt(0), prefix, len);
}

/**
 * Converts a hexadecimal ASCII value to a character.
 * The function accepts strings of the form "0xff" or "ff"
 *
 * @param value the hexadecimal value to convert
 */
export function hexToChar(value: number | string) {
  if (typeof value === "string") {
    let num = NaN;

    if (/^0x/i.test(value)) {
      num = +value;
    } else {
      num = +("0x" + value);
    }

    if (Number.isNaN(num)) {
      throw new Error(`\`${value}\` is not a valid hexadecimal number`);
    }

    return String.fromCharCode(num);
  }

  if (typeof value === "number") {
    return String.fromCharCode(value);
  }
}
