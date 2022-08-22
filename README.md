# LocalStorageType [![npm](https://img.shields.io/npm/v/localstoragetype.svg)](https://www.npmjs.com/package/localstoragetype)
## Introduction ( [中文](./README.zh-CN.md) | [English](./README.md) )
Provides more precise types for `localStorage` and support for using JSON. This package does not change the original methods of `localStorage`.

Type support: provides type hints for key parameters, non-null certainty for value, more precise types for returning value (such as literal), and value entry constraints for `setItem`.

JSON support: adds two convenience methods `getJsonItem` and `setJsonItem` with more precise types (while the return value of `getItem` will only be of type `string`).

## Disadvantages
Because [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) is used for interface `Storage`, it affects all `Storage` instances, e.g. `localStorage`, `sessionStorage`. Please do not use this package if it affects your code.

## Usage
Import the package at the project entry and add the interface declaration merge code. For example, import in the `main.ts` file, or as a separate file, just import the package. The interface declaration merge can also be placed in the `*.d.ts` file.

[Usage examples, Go to
TS playground()
view type effects.]: #

``` ts
// Add two methods `getJsonItem` and `setJsonItem` to localStorage
import 'LocalStorageType'

// Declare the key value type of your localStorage storage here
declare module 'LocalStorageType' {
  interface StorageKeyValue {
    string: string
    stringOpt?: string
    stringLiteral: "a" | "b" | "c"
    stringAndLiteral: "a" | (string & {})

    numberLiteral: 1 | 2 | 3

    obj: { a: number }
    objOpt?: { a: number }
  }
}

// Usage examples
function usageExampleCode() {
  localStorage.setItem("string", "str")
  // The return type is non-null
  const str = localStorage.getItem("string")
  //    ^?
  // str: string

  localStorage.setItem("stringOpt", "str")
  // The return type is null with
  const stringOpt = localStorage.getItem("stringOpt")
  //    ^?
  // stringOpt: string | null

  localStorage.setItem("stringLiteral", "a")
  // Support for string literal type
  const strLiteral = localStorage.getItem("stringLiteral")
  //    ^?
  // strLiteral: "a" | "b" | "c"

  localStorage.setItem("numberLiteral", 2)
  // Support for number literal type
  const numLiteral = localStorage.getItem("numberLiteral")
  //    ^?
  // numLiteral: "1" | "2" | "3"
  const numLiteralJson = localStorage.getJsonItem("numberLiteral")
  //    ^?
  // numLiteralJson: 1 | 2 | 3

  // Provide the use of JSON
  localStorage.setJsonItem("obj", { a: 1 })
  const obj = localStorage.getJsonItem("obj")
  //    ^?
  // obj: { a: number }

  // Provide type hints for key parameters
  localStorage.removeItem("stringOpt")
}
```
