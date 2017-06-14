import { difference } from 'lodash';
import { IConfigType } from '../types';

/**
 *
 *
 * @export
 * @param {any[]} values
 * @param {IConfigType} config
 * @param {any[]} core
 * @returns
 */
export function configure(values: any[], config: IConfigType, core: any[]) {
  let newValues: any[] = [];

  // if 'all' is true assume that none of 'core' were in the
  // passed values array and check if there are any missing
  // then add them in if they are
  if (config.all === true) {
    const missing = difference(core, values);
    newValues = missing.concat(values);
    return newValues;
  }

  if (config.all === false) {
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
