# LocalStorageType  [![npm](https://img.shields.io/npm/v/localstoragetype.svg)](https://www.npmjs.com/package/localstoragetype)
## 介绍 ( [中文](./README.zh-CN.md) | [English](./README.md) )
---
对 `localStorage` 提供更精确的类型，和对 JSON 的使用支持。本包不会改动 `localStorage` 原有的方法。

类型支持：提供 key 的枚举提示，value 的非空确定性，返回 value 更精确的类型（如字面量）， `setItem` 的 value 入参约束。

JSON 支持：添加了两个便利的方法 `getJsonItem` 和 `setJsonItem` ，并且类型更精确（而 `getItem` 的返回值只会是 `string` 类型）。

## 缺陷
---
因为对 interface `Storage` 使用了[声明合并](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)，所以会影响到所有 `Storage` 实例，如：`localStorage`、`sessionStorage`。如果本包影响到您的代码，请不要使用。

## 用法
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
