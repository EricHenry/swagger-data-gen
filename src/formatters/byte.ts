import { FormatterDescription } from '../types';

/**
 * Generates a random Base64 encoded character string
 *
 * @method     byte
 * @param      {Object}  gen - The genator object passed from json-schema-faker
 * @return     {string}      - A base64 encoded string of characters
 */
function byte(gen: any): string {
  const randomWord = gen.faker.random.words();
  const buff = new Buffer(randomWord);
  const base64Encoded = buff.toString('base64');

  return base64Encoded;
}

const byteFormatter: FormatterDescription = { formatName: 'byte', callback: byte };
export default byteFormatter;