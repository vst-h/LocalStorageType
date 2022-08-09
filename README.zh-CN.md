# LocalStorageType  [![npm](https://img.shields.io/npm/v/localstoragetype.svg)](https://www.npmjs.com/package/localstoragetype)
## 介绍 ( [中文](./README.zh-CN.md) | [English](./README.md) )
对 `localStorage` 提供更精确的类型，和对 JSON 的使用支持。本包不会改动 `localStorage` 原有的方法。

类型支持：提供 key 参数的枚举提示，value 的非空确定性，返回 value 更精确的类型（如字面量）， `setItem` 的 value 入参约束。

JSON 支持：添加了两个便利的方法 `getJsonItem` 和 `setJsonItem` ，并且类型更精确（而 `getItem` 的返回值只会是 `string` 类型）。

## 缺陷
因为对 interface `Storage` 使用了[声明合并](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)，所以会影响到所有 `Storage` 实例，如：`localStorage`、`sessionStorage`。如果本包影响到您的代码，请不要使用。

## 用法
在项目入口处 import 包并添加 interface 声明合并代码。比如在 `main.js` 文件 import ，也可以是独立的文件，只要把包 import 就可以。interface 声明合并也可以放到 `*.d.ts` 文件中。

[使用示例，转到
TS playground(https://www.typescriptlang.org/play?#code/FASwtgDg9gTgLgAgOQBkoGMCGAbAynWTAcwFMAVATwhKQQHo6EBBAExYTgHcoEwS4AFlBYBnBAANScAFIioAOwCScEmHEJM89uJH9ZC5avUEE2DDnyFSwYAwQAREumyYYJDgPcBrEhQQA3HABXdzgqdygAMwQKKCCYU3M8AhhidxEUtIRPN2AWJxc3XmEg7HdUJMtU0kpqWgBvYAQEEHkVGEjMdHcqtIBpXwA1YPdG5uaMmFaiAC4ESemm8YX5IgB5CDgAfjmVoiWJuCnVlBB2nDmAIkxLhAAfBEuAI1uHy-RLg-mj6aYtU-O2CuN3uCAAFHsEAAyBD1AC+AEobOMEPIgmAniQYACsRcEABGUEAJlBAGZkeMoE8AFZzeoaOZojFYhBwr5U6kbbZ0hmo9GYhJs5pstm2RgAVREWRIAA9MJAyiJgJEgvJ0HAQAoEEEpaQAKJyhUkADCwhIYIRsKWZiwySsJAAdLo4IYwGDLntLgAaR6TS5I5p2MieBBuODxeQccItMTyBQAWjR2GwS3QCgy3wSAF5ErbeqQHVJXe7PQH6IxxgA9LYUm0WTIF53Fj0-VZc72+o7+pZBkNhiNR6gxvnJhCcM4CVPpxB7LkIHN1u3VR1FlRulvHdabbuBisohDV2uVBuOptrkutog41LYDvXHflhC4IIQaDwBCRWCZ6amM647CDiQU7yBmkzXjg865vW9qFvwzZ7OBt5lnY+4HjW1rHjBZ6qO6TICohHZEshjDPq+sCIJ+CR4Sy2B-jegHARmTKIZBi75iucHnpc1HYnROAPih+6Hs0aYgYgzF8dg+iRgumHLrBMhyEoXE8QRxGoWhFJ2AACjAUD+CA+QeO4OoRNE0i4GsAByGF5ieTp6EpzYch29KYAgcyEoijGIByrFyWkCnSc5NICXumk9owun6YZoTRgIrRwGIlEID4fgQK48r8FiSrNGx9luGA+kkPBl7tkicJAA)
查看类型效果。]: #

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
  // obj: { a: 1 }

  // Provide type hints for key parameters
  localStorage.removeItem("stringOpt")
}
```
