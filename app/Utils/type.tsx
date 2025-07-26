
/**
 * A utility type that enforces only one property of a given type `T` to be initialized at a time.
 * 
 * This type ensures that:
 * - Exactly one key from the object `T` is required.
 * - All other keys in the object are explicitly set to `undefined` or omitted.
 * 
 * @template T - The object type for which only one property should be allowed at a time.
 * 
 * @example
 * type Example = OneOf<{ a: string; b: number; c: boolean }>;
 * 
 * // Valid:
 * const valid1: Example = { a: "hello" };
 * const valid2: Example = { b: 42 };
 * const valid3: Example = { c: true };
 * 
 * // Invalid:
 * const invalid1: Example = { a: "hello", b: 42 }; // Error: Only one property can be set.
 * const invalid2: Example = {}; // Error: At least one property must be set.
 */
export type OneOf<T> = {
    [K in keyof T]: {
      [P in K]: T[P];
    } & {
      [P in Exclude<keyof T, K>]?: never;
    }
}[keyof T];


/**
 * Constructs a new string type by prefixing a given string type `T` with another string type `P`,
 * separated by a dot (`.`). If `P` is an empty string, the result is simply `T`.
 *
 * @template T - The base string type to be prefixed.
 * @template P - The prefix string type to be added before `T`. If empty, no prefix is added.
 * @returns A new string type in the format `P.T` or just `T` if `P` is empty.
 */
export type DotPrefix<T extends string, P extends string> = P extends "" ? T : `${P}.${T}`;

/**
 * A utility type that generates a union of string paths representing the nested keys of an object type `T`.
 * 
 * @template T - The object type whose keys and nested keys are being processed.
 * @template Prefix - An optional string prefix to prepend to the generated paths. Defaults to an empty string.
 * 
 * @typeParam T - The type of the object to extract field paths from.
 * @typeParam Prefix - A string prefix to prepend to each path. Defaults to an empty string.
 * 
 * @remarks
 * - If a key in `T` maps to an array, only the key itself is included in the path.
 * - If a key in `T` maps to an object, both the key itself and its nested paths are included in the result.
 * - The `DotPrefix` utility is used to concatenate the prefix and the current key with a dot (`.`).
 * 
 * @example
 * ```typescript
 * type Example = {
 *   user: {
 *     name: string;
 *     address: {
 *       city: string;
 *       zip: string;
 *     };
 *   };
 *   isActive: boolean;
 * };
 * 
 * type Paths = FieldPaths<Example>;
 * // Result: "user" | "user.name" | "user.address" | "user.address.city" | "user.address.zip" | "isActive"
 * ```
 */
export type FieldPaths<T, Prefix extends string = ""> = {
    [K in keyof T & string]: T[K] extends any[]
    ? DotPrefix<K, Prefix>
    : T[K] extends object
    ? DotPrefix<K, Prefix> | FieldPaths<T[K], DotPrefix<K, Prefix>>
    : DotPrefix<K, Prefix>;
}[keyof T & string];

export default {};