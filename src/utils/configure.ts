import { union, without } from 'lodash';
import { IConfigType } from '../types';

/**
 * Creates an array of Type T's based on the configuration options passed.
 *  the configuration options determine what should be included or excluded from the
 *  returned array.
 *
 * @export
 * @param {T[]} core - the built in core values.
 * @param {IConfigType<T>} config - the configuration options.
 * @returns {T[]} - a new array with configured array
 */
export function configure<T>(core: T[], config: IConfigType<T>): T[] {
  let newValues: any[] = [];

  // if default is true, add all the core values
  if (config.default === true) {
    newValues = newValues.concat(core);
  }

  // include any additional T's that are already not in the array
  if (config.include && config.include.length > 0) {
    newValues = union(newValues, config.include);
  }

  // remove any value specified in exclude property
  if (config.exclude && config.exclude.length > 0) {
    newValues = without(newValues, ...config.exclude);
  }

  return newValues;
}
