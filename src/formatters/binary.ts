import { random } from 'lodash';
import { FormatterDescription } from '../types';

/**
 * binary - creates a random binary string of 4 octets
 *
 * @returns {string} - the concatenated binary string;
 */
function binary(): string {
  const randomOctets = [
    random(0, 255),
    random(0, 255),
    random(0, 255),
    random(0, 255),
  ];

  const binaryString = randomOctets
    .reduce((currentBinaryString, randomNumber, index) => {
      let binaryRepresentationOfRandomNumber = randomNumber.toString(2);

      if (index === 0) {
        return binaryRepresentationOfRandomNumber;
      }

      return currentBinaryString + ' ' + binaryRepresentationOfRandomNumber;
    }, '');

  return binaryString;
}

export const binaryFormatter: FormatterDescription = { formatName: 'binary', callback: binary };
