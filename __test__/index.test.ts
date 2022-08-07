import './localStorageMock'
import '../index'
import { NullableKey } from '../index'

declare module '../index' {
  interface StorageKeyValue {
    undefined: undefined
    null: null
    nullOpt?: null

    string: string
    stringOpt?: string
    stringOrNull: string | null
    stringOrNullOpt?: string | null
    stringLiteral: "a" | "b" | "c"
    stringAndLiteral: "a" | (string & {})

    number: number
    numberOpt?: number
    numberOrNull: number | null
    numberOrNullOpt?: number | null
    numberLiteral: 1 | 2 | 3
    numberAndLiteral: 1 | (number & {})

    obj: { a: 1 }
    objOpt?: { a: 1 }
    objOrNull: { a: 1 } | null
    objOrNullOpt?: { a: 1 } | null

    boolean: boolean

    // 不能使用 JSON
    date: Date // 反序列化成 string

    // JSON 序列化抛出异常
    bigint: bigint

    // 不应该存储的类型
    fn: () => 1
    symbol: symbol
  }
}

function expectType<T extends U, U>(expected: T, actual: U extends T ? U : never) {
  expect(actual).toBe(expected)
}

function expectObjType<T extends U, U>(expected: T, actual: U extends T ? U : never) {
  expect(actual).toStrictEqual(expected)
}

describe("localStorage", () => {
  localStorage.clear()

  test("setItem null should have a type error", () => {
    localStorage.setItem(
      "stringOrNull",
      // @ts-expect-error
      null
    )
  })

  test("setItem undefined should have a type error", () => {
    localStorage.setItem(
      "stringOpt",
      // @ts-expect-error
      undefined
    )
  })

  test("getJsonItem non-existent value", () => {
    localStorage.clear()
    const val1 = localStorage.getItem("non-existent value")
    expectType(null as string | null, val1)
    const val2 = localStorage.getJsonItem("non-existent value" as never)
    expectType(null as never, val2)
  })

  test("removeItem test NullableKey", () => {
    type TestNullableKey<K extends NullableKey> = K

    type TestString = TestNullableKey<
      // @ts-expect-error
      "string"
    >
    type TestStringOpt = TestNullableKey<"stringOpt">
    type TestStringOrNull = TestNullableKey<"stringOrNull">
  })
})

describe("undefined", () => {
  localStorage.clear()
  const key = "undefined"

  test("setItem should have type error", () => {
    localStorage.clear()
    localStorage.setItem(
      key,
      // @ts-expect-error
      undefined
    )

    let val1 = localStorage.getItem(key)
    expectType("undefined" as unknown, val1 as unknown)
  })

  test("getItem", () => {
    localStorage.clear()
    let val1 = localStorage.getItem(key)
    expectType(null, val1)
  })

  test("getJsonItem should have type error", () => {
    localStorage.clear()
    let val1 = localStorage.getJsonItem(
      // @ts-expect-error
      key // Just an undefined value should not be json
    ) as unknown
    expectType(null as unknown, val1)
  })

  test("setJsonItem should have type error", () => {
    localStorage.clear()
    localStorage.setJsonItem(
      // @ts-expect-error
      key, // Just an undefined value should not be json
      undefined
    )
    let val1 = localStorage.getItem(key)
    expectType("undefined" as unknown, val1 as unknown)
  })

})

describe("null", () => {
  localStorage.clear()
  const key = "null"

  test("setItem should have type error", () => {
    localStorage.clear()
    localStorage.setItem(
      key,
      // @ts-expect-error
      null
    )

    let val1 = localStorage.getItem(key)
    expectType("null" as unknown, val1 as unknown)
  })

  test("getItem", () => {
    localStorage.clear()
    let val1 = localStorage.getItem(key)
    expectType(null, val1)
  })

  test("getJsonItem should have type error", () => {
    localStorage.clear()
    let val1 = localStorage.getJsonItem(
      // @ts-expect-error
      key //Just a null value should not be json
    ) as unknown
    expectType(null as unknown, val1)
  })

  test("setJsonItem should have type error", () => {
    localStorage.setJsonItem(
      // @ts-expect-error
      key, // Just a null value should not be json
      null
    )
    let val1 = localStorage.getItem(key)
    expectType("null" as unknown, val1 as unknown)
  })

})

describe("nullOpt", () => {
  localStorage.clear()
  const key = "nullOpt"

  test("setItem should have type error", () => {
    localStorage.clear()
    localStorage.setItem(
      key,
      // @ts-expect-error
      null
    )

    let val1 = localStorage.getItem(key)
    expectType("null" as unknown, val1 as unknown)
  })

  test("getItem", () => {
    localStorage.clear()
    let val1 = localStorage.getItem(key)
    expectType(null, val1)
  })

  test("getJsonItem should have type error", () => {
    localStorage.clear()
    let val1 = localStorage.getJsonItem(
      // @ts-expect-error
      key // Just a null or undefined value should not be json
    ) as unknown
    expectType(null as unknown, val1)
  })

  test("setJsonItem should have type error", () => {
    localStorage.clear()
    localStorage.setJsonItem(
      // @ts-expect-error
      key, // Just a null or undefined value should not be json
      null
    )
    let val1 = localStorage.getItem(key)
    expectType("null" as unknown, val1 as unknown)
  })

})

describe("string", () => {

  describe("string", () => {
    localStorage.clear()
    const key = "string"

    test("getItem", () => {
      localStorage.setItem(key, "str")
      let val1 = localStorage.getItem(key)
      expectType("str", val1)
    })

    test("getJsonItem should have type error and throw an exception", () => {
      localStorage.setItem(key, "str")
      expect(() => {
        localStorage.getJsonItem(
          // @ts-expect-error
          key // Just a string value should not be json
        ) as never
      }).toThrow(SyntaxError)
    })

    test("setJsonItem should have type error", () => {
      localStorage.setJsonItem(
        // @ts-expect-error
        key, // Just a string value should not be json
        "str"
      )
    })
  })

  describe("stringOpt", () => {
    localStorage.clear()
    const key = "stringOpt"

    test("setItem undefined should have type error", () => {
      localStorage.setItem(
        key,
        // @ts-expect-error
        undefined
      )
    })

    test("getItem", () => {
      localStorage.setItem(key, "str")
      let val1 = localStorage.getItem(key)
      expectType("str" as string | null, val1)
    })

    test("getJsonItem should have type error and throw an exception", () => {
      localStorage.setItem(key, "str")
      expect(() => {
        localStorage.getJsonItem(
          // @ts-expect-error
          key // Just a string value should not be json
        ) as never
      }).toThrow(SyntaxError)
    })

    test("setJsonItem should have type error", () => {
      localStorage.setJsonItem(
        // @ts-expect-error
        key, // Just a string value should not be json
        "str"
      )
    })
  })

  describe("stringOrNull", () => {
    localStorage.clear()
    const key = "stringOrNull"

    test("setItem undefined should have type error", () => {
      localStorage.setItem(
        key,
        // @ts-expect-error
        undefined
      )
    })

    test("getItem", () => {
      localStorage.setItem(key, "str")
      let val1 = localStorage.getItem(key)
      expectType("str" as string | null, val1)
    })

    test("getJsonItem should have type error and throw an exception", () => {
      localStorage.setItem(key, "str")
      expect(() => {
        localStorage.getJsonItem(
          // @ts-expect-error
          key // Just a string value should not be json
        ) as never
      }).toThrow(SyntaxError)
    })

    test("setJsonItem should have type error", () => {
      localStorage.setJsonItem(
        // @ts-expect-error
        key, // Just a string value should not be json
        "str"
      )
    })
  })

  describe("stringOrNullOpt", () => {
    localStorage.clear()
    const key = "stringOrNullOpt"

    test("setItem undefined should have type error", () => {
      localStorage.setItem(
        key,
        // @ts-expect-error
        undefined
      )
    })

    test("getItem", () => {
      localStorage.setItem(key, "str")
      let val1 = localStorage.getItem(key)
      expectType("str" as string | null, val1)
    })

    test("getJsonItem should have type error and throw an exception", () => {
      localStorage.setItem(key, "str")
      expect(() => {
        localStorage.getJsonItem(
          // @ts-expect-error
          key // Just a string value should not be json
        ) as never
      }).toThrow(SyntaxError)
    })

    test("setJsonItem should have type error", () => {
      localStorage.setJsonItem(
        // @ts-expect-error
        key, // Just a string value should not be json
        "str"
      )
    })
  })

  describe("stringLiteral", () => {
    localStorage.clear()
    const key = "stringLiteral"

    test("getItem", () => {
      localStorage.setItem(key, "a")
      let val1 = localStorage.getItem(key)
      expectType("a" as "a" | "b" | "c", val1)
    })
  })

  describe("stringAndLiteral", () => {
    localStorage.clear()
    const key = "stringAndLiteral"

    test("getItem", () => {
      localStorage.setItem(key, "a")
      let val1 = localStorage.getItem(key)
      expectType("a" as "a" | (string & {}), val1)

      localStorage.setItem(key, "otherString")
      let val2 = localStorage.getItem(key)
      expectType("otherString" as "a" | (string & {}), val2)
    })
  })

})

describe("number", () => {

  describe("number", () => {
    localStorage.clear()
    const key = "number"

    test("getItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getItem(key)
      expectType("2.2" as `${number}`, val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 2)
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 2)
      var val1 = localStorage.getJsonItem(key)
      expectType(2 as number, val1)
    })

  })

  describe("numberOpt", () => {
    localStorage.clear()
    const key = "numberOpt"

    test("getItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getItem(key)
      expectType("2.2" as `${number}` | null, val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 2.2)
      localStorage.setJsonItem(key, undefined)
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getJsonItem(key)
      expectType(2.2 as number | null | undefined, val1)

      localStorage.setJsonItem(key, undefined)
      let val2 = localStorage.getJsonItem(key)
      expectType(undefined as number | null | undefined, val2)

      localStorage.removeItem(key)
      let val3 = localStorage.getJsonItem(key)
      expectType(null as number | null | undefined, val3)
    })
  })

  describe("numberOrNull", () => {
    localStorage.clear()
    const key = "numberOrNull"

    test("getItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getItem(key)
      expectType("2.2" as `${number}` | null, val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 2.2)
      localStorage.setJsonItem(key, null)
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getJsonItem(key)
      expectType(2.2 as number | null, val1)

      localStorage.setJsonItem(key, null)
      let val2 = localStorage.getJsonItem(key)
      expectType(null as number | null, val2)

      localStorage.removeItem(key)
      let val3 = localStorage.getJsonItem(key)
      expectType(null as number | null, val3)
    })
  })

  describe("numberOrNullOpt", () => {
    localStorage.clear()
    const key = "numberOrNullOpt"

    test("getItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getItem(key)
      expectType("2.2" as `${number}` | null, val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 2.2)
      localStorage.setJsonItem(key, null)
      localStorage.setJsonItem(key, undefined)
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 2.2)
      let val1 = localStorage.getJsonItem(key)
      expectType(2.2 as number | null | undefined, val1)

      localStorage.setJsonItem(key, null)
      let val2 = localStorage.getJsonItem(key)
      expectType(null as number | null | undefined, val2)

      localStorage.setJsonItem(key, undefined)
      let val3 = localStorage.getJsonItem(key)
      expectType(undefined as number | null | undefined, val3)

      localStorage.removeItem(key)
      let val4 = localStorage.getJsonItem(key)
      expectType(null as number | null | undefined, val4)
    })
  })

  describe("numberLiteral", () => {
    localStorage.clear()
    const key = "numberLiteral"

    test("setItem", () => {
      localStorage.setItem(key, 1)

      localStorage.setItem(
        key,
        // @ts-expect-error
        -1
      )
    })

    test("getItem", () => {
      localStorage.setItem(key, 1)
      let val1 = localStorage.getItem(key)
      expectType("1" as "1" | "2" | "3", val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 2)

      localStorage.setJsonItem(
        key,
        // @ts-expect-error
        -2
      )
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 2)
      let val1 = localStorage.getJsonItem(key)
      expectType(2 as 1 | 2 | 3, val1)

      localStorage.setJsonItem(key, 3)
      let val2 = localStorage.getJsonItem(key)
      expectType(3 as 1 | 2 | 3, val2)
    })
  })

  describe("numberAndLiteral", () => {
    localStorage.clear()
    const key = "numberAndLiteral"
    const otherNumber = 123456789

    test("getItem", () => {
      localStorage.setItem(key, 1)
      let val1 = localStorage.getItem(key)
      expectType("1" as "1" | (string & {}), val1)

      localStorage.setItem(key, otherNumber)
      let val2 = localStorage.getItem(key)
      expectType(`${otherNumber}` as "1" | (string & {}), val2)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, 1)
      localStorage.setJsonItem(key, otherNumber)
    })

    test("getJsonItem", () => {
      localStorage.setItem(key, 1)
      let val1 = localStorage.getJsonItem(key)
      expectType(1 as 1 | (number & {}), val1)

      localStorage.setItem(key, otherNumber)
      let val2 = localStorage.getJsonItem(key)
      expectType(otherNumber as 1 | (number & {}), val2)
    })
  })

})

describe("object", () => {

  describe("obj", () => {
    localStorage.clear()
    const key = "obj"

    test("setItem", () => {
      localStorage.setItem(key, `{ "a": 1 }`)
      // @ts-expect-error
      localStorage.setItem(key, { a: 1 })
    })

    test("getItem", () => {
      localStorage.setItem(key, `{ "a": 1 }`)
      let val1 = localStorage.getItem(key)
      expectType(`{ "a": 1 }` as string | null, val1)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, { a: 1 })
    })

    test("getJsonItem", () => {
      localStorage.setJsonItem(key, { a: 1 })
      var val1 = localStorage.getJsonItem(key)
      expectObjType({ a: 1 } as { a: 1 }, val1)
    })

  })

  describe("objOpt", () => {
    localStorage.clear()
    const key = "objOpt"

    test("getItem", () => {
      localStorage.setItem(key, `{ "a": 1 }`)
      let val1 = localStorage.getItem(key)
      expectType(`{ "a": 1 }` as string | null, val1)

      localStorage.setJsonItem(key, undefined)
      let val2 = localStorage.getItem(key)
      expectType("undefined" as string | null, val2)

      localStorage.removeItem(key)
      let val3 = localStorage.getItem(key)
      expectType(null as string | null, val3)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, { a: 1 })
      localStorage.setJsonItem(key, undefined)
    })

    test("getJsonItem", () => {
      type GetJsonItemRes = { a: 1 } | null | undefined

      localStorage.setJsonItem(key, { a: 1 })
      var val1 = localStorage.getJsonItem(key)
      expectObjType({ a: 1 } as GetJsonItemRes, val1)

      localStorage.setJsonItem(key, undefined)
      var val2 = localStorage.getJsonItem(key)
      expectObjType(undefined as GetJsonItemRes, val2)

      localStorage.removeItem(key)
      var val3 = localStorage.getJsonItem(key)
      expectObjType(null as GetJsonItemRes, val3)
    })

  })

  describe("objOrNull", () => {
    localStorage.clear()
    const key = "objOrNull"

    test("getItem", () => {
      localStorage.setItem(key, `{ "a": 1 }`)
      let val1 = localStorage.getItem(key)
      expectType(`{ "a": 1 }` as string | null, val1)

      localStorage.setJsonItem(key, null)
      let val2 = localStorage.getItem(key)
      expectType("null" as string | null, val2)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, { a: 1 })
      localStorage.setJsonItem(key, null)
    })

    test("getJsonItem", () => {
      type GetJsonItemRes = { a: 1 } | null

      localStorage.setJsonItem(key, { a: 1 })
      var val1 = localStorage.getJsonItem(key)
      expectObjType({ a: 1 } as GetJsonItemRes, val1)

      localStorage.setJsonItem(key, null)
      var val2 = localStorage.getJsonItem(key)
      expectObjType(null as GetJsonItemRes, val2)

      localStorage.removeItem(key)
      var val3 = localStorage.getJsonItem(key)
      expectObjType(null as GetJsonItemRes, val3)
    })

  })

  describe("objOrNullOpt", () => {
    localStorage.clear()
    const key = "objOrNullOpt"

    test("getItem", () => {
      localStorage.setItem(key, `{ "a": 1 }`)
      let val1 = localStorage.getItem(key)
      expectType(`{ "a": 1 }` as string | null, val1)

      localStorage.setJsonItem(key, null)
      let val2 = localStorage.getItem(key)
      expectType("null" as string | null, val2)

      localStorage.setJsonItem(key, undefined)
      let val3 = localStorage.getItem(key)
      expectType("undefined" as string | null, val3)
    })

    test("setJsonItem", () => {
      localStorage.setJsonItem(key, { a: 1 })
      localStorage.setJsonItem(key, null)
      localStorage.setJsonItem(key, undefined)
    })

    test("getJsonItem", () => {
      type GetJsonItemRes = { a: 1 } | null | undefined

      localStorage.setJsonItem(key, { a: 1 })
      var val1 = localStorage.getJsonItem(key)
      expectObjType({ a: 1 } as GetJsonItemRes, val1)

      localStorage.setJsonItem(key, undefined)
      var val2 = localStorage.getJsonItem(key)
      expectObjType(undefined as GetJsonItemRes, val2)

      localStorage.setJsonItem(key, null)
      var val3 = localStorage.getJsonItem(key)
      expectObjType(null as GetJsonItemRes, val3)

      localStorage.removeItem(key)
      var val4 = localStorage.getJsonItem(key)
      expectObjType(null as GetJsonItemRes, val4)
    })
  })

})

describe("boolean", () => {

  localStorage.clear()
  const key = "boolean"

  test("getItem", () => {
    localStorage.setItem(key, false)
    let val1 = localStorage.getItem(key)
    expectType("false" as `${boolean}`, val1)
  })

  test("setJsonItem", () => {
    localStorage.setJsonItem(key, true)
  })

  test("getJsonItem", () => {
    localStorage.setItem(key, true)
    var val1 = localStorage.getJsonItem(key)
    expectType(true as boolean, val1)
  })

})

describe("date", () => {

  localStorage.clear()
  const key = "date"

  test("getItem", () => {
    localStorage.setItem(key, new Date("2022-07-17T10:47:45.191Z"))
    let val1 = localStorage.getItem(key)
    expectType(new Date(val1).toString(), val1)
  })

  test("setJsonItem", () => {
    localStorage.setJsonItem(
      // @ts-expect-error
      key,
      new Date("2022-07-17T10:47:45.191Z")
    )
  })

})

describe("bigint", () => {

  localStorage.clear()
  const key = "bigint"

  test("getItem", () => {
    localStorage.setItem(key, 3n)
    let val1 = localStorage.getItem(key)
    expectType("3" as `${number}`, val1)
  })

  test("setJsonItem", () => {
    expect(() => {
      localStorage.setJsonItem(
        // @ts-expect-error
        key,
        3n
      )
    }).toThrow(TypeError)
  })

})

describe("fn", () => {

  localStorage.clear()
  const key = "fn"

  test("setItem", () => {
    // @ts-expect-error
    localStorage.setItem(key, null as unknown)
  })

  test("setJsonItem", () => {
    localStorage.setJsonItem(
      // @ts-expect-error
      key,
      null as unknown
    )
  })

})

describe("symbol", () => {

  localStorage.clear()
  const key = "symbol"

  test("setItem", () => {
    // @ts-expect-error
    localStorage.setItem(key, null as unknown)
  })

  test("setJsonItem", () => {
    localStorage.setJsonItem(
      // @ts-expect-error
      key,
      null as unknown
    )
  })

})
