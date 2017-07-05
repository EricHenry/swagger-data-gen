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
export declare function configure<T>(core: T[], config: IConfigType<T>): T[];
