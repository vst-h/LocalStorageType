# LocalStorageType [![npm](https://img.shields.io/npm/v/localstoragetype.svg)](https://www.npmjs.com/package/localstoragetype)
## Introduction ( [中文](./README.zh-CN.md) | [English](./README.md) )
---
Provides more precise types for `localStorage` and support for using JSON. This package does not change the original methods of `localStorage`.

Type support: provides enumeration hints for key, non-null certainty for value, more precise types for returning value (such as literal), and value entry constraints for `setItem`.

JSON support: adds two convenience methods `getJsonItem` and `setJsonItem` with more precise types (while the return value of `getItem` will only be of type `string`).

## Disadvantages
---
Because [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) is used for interface `Storage`, it affects all `Storage` instances, e.g. `localStorage`, `sessionStorage`. Please do not use this package if it affects your code.

## Usage
---
Usage examples, Go to [TS playground](https://www.typescriptlang.org/play?#code/FASwtgDg9gTgLgAgOQBkoGMCGAbAynWTAcwFMAVATwhKQQHo6EBBAExYTgHcoEwS4AFlBYBnBAANScAFIioAOwCScEmHEJM89uJH9ZC5avUEE2DDnyFSwYAwQAREumyYYJDgPcBrEhQQA3HABXdzgqdygAMwQKKCCYU3M8AhhidxEUtIRPN2AWJxc3XmEg7HdUJMtU0kpqWgBvYAQEEHkVGEjMdHcqtIBpXwA1YPdG5uaMmFaiAC4ESemm8YX5IgB5CDgAfjmVoiWJuCnVlBB2nDmAIkxLhAAfBEuAI1uHy-RLg-mj6aYtU-O2CuN3uCAAFHsEAAyBD1AC+AEobOMEPIgmAniQYACsRcEABGUEAJlBAGZkeMoE8AFZzeoaOZojFYhBwr5U6kbbZ0hmo9GYhJs5pstm2RgAVREWRIAA9MJAyiJgJEgvJ0HAQAoEEEpaQAKJyhUkADCwhIYIRsK+ZiwySsJAAdLo4IYwGDLnscalsJcADSPG5IlHoBQZb7Ys647AIAC8iVtvVIDqkrvdnsj3suQfGdhRzQAelsKc0bRZMknnanLkyBV6cH6EETs80Q-Iw0y69G46W7dVHSmVG7q-ysZ2s19c3nC8X42X7U69HIlIP3RyG-TMAg5oTEV9W2GObHZ720snFwYV5c1836IxxtPrZVy463GAoP4SFW9lzx2ygA) view type effects.

``` ts
import 'LocalStorageType' // Add two methods `getJsonItem` and `setJsonItem` to localStorage

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
    localStorage.setItem("stringLiteral", "a")
    const strLiteral = localStorage.getItem("stringLiteral")
    //       ^?

    localStorage.setItem("numberLiteral", 2)
    const numLiteral = localStorage.getItem("numberLiteral")
    //       ^?

    localStorage.setJsonItem("obj", { a : 1 })
    const obj = localStorage.getJsonItem("obj")
    //    ^?

    localStorage.removeItem("stringOpt")
}
```
