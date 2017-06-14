import { random } from 'lodash';
import { FormatterDescription } from '../types';

/**
 * Generates a Date as a string in JSON Schema full-date format.
 *
 * @method     fullDate
 * @return     {string}  - a random date as a string.
 */
function fullDate(): string {
  const YEAR = random(1900, 2030);
  const MONTH = random(1, 12);
  const DAY = random(1, 28);

  const yearString = YEAR.toString();
  const monthString = MONTH < 10 ? '0' + MONTH.toString() : MONTH.toString();
  const dayString = DAY < 10 ? '0' + DAY.toString() : DAY.toString();

  return yearString + '-' + monthString + '-' + dayString;
}

export const fullDateFormatter: FormatterDescription = { formatName: 'fullDate', callback: fullDate };
