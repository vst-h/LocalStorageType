export class Storage {
  [name: string]: any;

  /** Returns the number of key/value pairs. */
  get length() { return Object.keys(this).length }
  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  clear(): void {
    Object.keys(this).forEach(key => delete this[key])
  }

  /** Returns the current value associated with the given key, or null if the given key does not exist. */
  getItem(key: string): string | null {
    const val = this[key]
    return val === undefined ? null : val
  }
  /** Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. */
  key(index: number): string | null {
    return Object.keys(this)[index] ?? null
  }
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  removeItem(key: string): void {
    delete this[key]
  }
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  setItem(key: string, value: string): void {
    this[key] = value + ''
  }

}

globalThis.localStorage = new Storage() as any
globalThis.Storage = Storage as any
