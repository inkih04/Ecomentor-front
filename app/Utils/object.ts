/**
 * Compares two objects of the same type to determine if they are shallowly equal.
 * 
 * This function performs a shallow comparison by checking if both objects have:
 * - The same set of keys.
 * - Corresponding values that are strictly equal (`===`).
 * 
 * @template T - The type of the objects being compared. Must extend `Record<string, any>`.
 * @param {T} a - The first object to compare.
 * @param {T} b - The second object to compare.
 * @returns {boolean} `true` if the objects are shallowly equal, otherwise `false`.
 * 
 * @example
 * const obj1 = { name: "Alice", age: 25 };
 * const obj2 = { name: "Alice", age: 25 };
 * const obj3 = { name: "Bob", age: 30 };
 * 
 * shallowEqual(obj1, obj2); // true
 * shallowEqual(obj1, obj3); // false
 */
export const shallowEqual = function<T extends Record<string, any>>(a: T, b: T): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(key => a[key] === b[key]);
}

export default {};