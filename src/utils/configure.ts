import { difference } from 'lodash';
import { binary, byte, fullDate, password } from '../formatters';
import { requireProps, fakerDate, fakerMatcher } from '../middleware';
import { IConfigType, MiddlewareConfig, Middleware, FormatterConfig, Formatter } from '../types';

const CORE_MIDDLEWARE: Middleware[] = [requireProps, fakerMatcher, fakerDate];
const CORE_FORMATTERS: Formatter[] = [binary, byte, fullDate, password];

export function configureMiddleware(values: Middleware[], config: MiddlewareConfig): Middleware[] {
  return configure<Middleware>(values, config, CORE_MIDDLEWARE);
}

export function configureFormatters(values: Formatter[], config: FormatterConfig): Formatter[] {
  return configure<Formatter>(values, config, CORE_FORMATTERS);
}

/**
 *
 *
 * @export
 * @param {any[]} values
 * @param {IConfigType} config
 * @param {any[]} core
 * @returns
 */
function configure<T>(values: T[], config: IConfigType<T>, core: T[]): T[] {
  let newValues: any[] = [];

  // if 'all' is true assume that none of 'core' were in the
  // passed values array and check if there are any missing
  // then add them in if they are
  if (config.default === true) {
    const missing = difference(core, values);
    newValues = missing.concat(values);
    return newValues;
  }

  if (config.default === false) {
    const removedCoreValues = difference(values, core);
    return removedCoreValues;
  }

  newValues = [...values];
  Object.keys(config)
    .filter(k => k === 'all') // assume that the 'all' property is passed in as undefined
    .forEach(k => {
      if (config[k] === true) {
        if (newValues.includes(core[k])) {
          return;
        }

        newValues.push(core[k]);
      }

      if (config[k] === false) {
        if (!newValues.includes(core[k])) {
          return;
        }

        let listLocation = newValues.findIndex(core[k]);
        newValues.splice(listLocation, 1);
      }
    });

  return newValues;
}
