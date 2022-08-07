export interface StorageKeyValue { }

type KV = StorageKeyValue
type TemplateLiteralType = number | string | bigint | boolean
type NonJsonStorage = undefined | null | string | number | bigint | boolean | Date

export type NonJsonStorageKey = {
  [K in keyof KV]-?: KV[K] extends NonJsonStorage ? K : never
}[keyof KV]

export type JsonStorageKey = {
  [K in keyof KV]-?
  : KV[K] extends Function | symbol | string | Date | bigint | undefined | null ? never
  : K
}[keyof KV]


export type NullableKey = {
  [K in keyof KV]-?
  : undefined extends KV[K] ? K
  : null extends KV[K] ? K
  : never
}[keyof KV]


type GetValue<T>
  = T extends null ? null
  : T extends undefined ? null
  : T extends Function | symbol ? never
  : T extends {}
    ? T extends TemplateLiteralType
      ? T extends object ? (string & {}) // (`${T}` & {}) // (string & {})
      : bigint extends T ? `${number}`
      : `${T}`
    : string
  : never
export type StorageGetValue = { [K in keyof KV]-?: GetValue<KV[K]> }


type StorageJson<T>
  = T extends Function | symbol ? never
  : T extends undefined ? undefined | null // 因为 removeItem 之后会返回 null
  : T
export type StorageJsonResult = { [K in keyof KV]: StorageJson<KV[K]> }


type SetValue<T>
  = T extends undefined | null | Function | symbol ? never
  : T extends {}
    ? T extends TemplateLiteralType ? T
    : T extends Date ? Date
    : T extends object ? string
    : T
  : never
export type StorageSetValue = { [K in keyof KV]-?: SetValue<KV[K]> }


declare global {
  interface Storage {
    removeItem(key: NullableKey): void
    getItem<TKey extends NonJsonStorageKey>(key: TKey): StorageGetValue[TKey]
    setItem<TKey extends NonJsonStorageKey>(key: TKey, value: StorageSetValue[TKey]): void
    getJsonItem<TKey extends JsonStorageKey>(key: TKey): StorageJsonResult[TKey]
    setJsonItem<TKey extends JsonStorageKey>(key: TKey, value: StorageJsonResult[TKey]): void
  }
}


Storage.prototype.getJsonItem = function (key) {
  const strVal = localStorage.getItem(key)
  if (strVal === null) { return null }

  /**
   * localStorage.setItem(key, undefined)
   * localStorage.getItem(key) === "undefined"
   * JSON.stringify(undefined) === undefined
   * JSON.parse("undefined") // 将会抛出异常
   *
   * 不知道返回类型是 string 类型还是 object | undefined 类型
   * 这里发生了混淆，本库处理的方式是：不支持 string 调用 setJsonItem 和 getJsonItem
   * 一旦遇到 "undefined" 字符串，则返回 undefined
   *
   * 这样就可以支持 object | undefined 类型
   * localStorage.setJsonItem(key, undefined as object | undefined)
   * const val: object | undefined = localStorage.getJsonItem(key)
   * val === undefined
  */
  if (strVal === "undefined") { return undefined }
  return JSON.parse(strVal)
}

Storage.prototype.setJsonItem = function (key, value) {
  /* localStorage.setItem(undefined)  // "undefined", JSON.parse 出错
   * localStorage.setItem(null)  // "null"; JSON.parse("null") === null
   * localStorage.setItem(1) // "1"; JSON.parse("1") === 1
   */
  localStorage.setItem(key, JSON.stringify(value))
}
