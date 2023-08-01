/**
 * Represents a builder callback.
 * @template T The builder's type.
 */
type BuilderCallback<T> = (this: T, builder: T) => T;
