import { FormatterDescription } from '../types';

/**
 * password   - generates a random password string
 *
 * @param gen {object}  - generator object that will be passed in from json-schema faker
 * @returns   {string}  - a password as a string
 */
function password(gen: any): string {
  return gen.faker.internet.password();
}

const passwordFormatter: FormatterDescription = { formatName: 'password', callback: password };
export default passwordFormatter;
