let _testToken = ''
const TYPES = ['undefined', 'null', 'array', 'object', 'boolean', 'NaN', 'number', 'bigint', 'string', 'symbol', 'function']

function fixType(input) {
  const isNull = input === null
  const isArray = Array.isArray(input)
  const isNaN = Number.isNaN(input)

  const typeMap = {
    undefined: 'undefined',
    object: isNull ? 'null' : isArray ? 'array' : 'object',
    boolean: 'boolean',
    number: isNaN ? 'NaN' : 'number',
    bigint: 'bigint',
    string: 'string',
    symbol: 'symbol',
    function: 'function',
  }

  return (
    typeMap[typeof input]
    || `❌ Internal Error from fixType, please send issue https://github.com/ESCSS-labs/ESCSS-ESTest/issues. input: ${input}.`
  )
}

function fixTextInLog(input) {
  switch (fixType(input)) {
    case 'array':
      return fix_ArrayInLog()
    case 'object':
      return fix_ObjectInLog()
    case 'bigint':
      return `${input}n`
    case 'string':
      return `'${input}'`
    case 'symbol':
      return `Symbol(...)`
    default:
      return input
  }

  function fix_ArrayInLog() {
    let result = ''

    input.forEach((item) => {
      result += `${fixTextInLog(item)}, `
    })

    // Remove , and space in the end
    result = `[${result.trim().slice(0, -1)}]`
    return result
  }

  function fix_ObjectInLog() {
    let result = ''

    for (const [key, value] of Object.entries(input)) {
      result += `${key}: ${fixTextInLog(value)}, `
    }

    // Remove , and space in the end
    result = `{${result.trim().slice(0, -1)}}`
    return result
  }
}

function ESTest(type, input, errMsg = 'undefined error message') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `
        🚫 Production hides details for security. View them in development.
        ❗ ${errMsg}
      `,
    )
  }
  else {    
    // development
    if (!TYPES.includes(type)) {
      throw new Error(
        `
          ✅ Expected 2nd Argument Type: 'undefined' | 'null' | 'array' | 'object' | 'boolean' | 'NaN' | 'number' | 'bigint' | 'string' | 'symbol' | 'function'
          ❌ Received 2nd Argument: ${fixTextInLog(type)}
        `,
      )
    }
    else if (!['undefined', 'string'].includes(typeof errMsg)) {
      throw new Error(
        `
          ✅ Expected Error Message Type: 'string'
          ❌ Received Error Message Type: '${fixType(errMsg)}' --> ${fixTextInLog(errMsg)}
        `,
      )
    }
    else if (fixType(input) !== type) {
      throw new Error(
        `
          ✅ Expected Type: ${fixTextInLog(type)} 
          ❌ Received Type: '${fixType(input)}' --> ${fixTextInLog(input)}
          ❗ ${errMsg}
        `,
      )
    }

    // internal testing purpose
    if (process.env.NODE_ENV === 'test') _testToken = type
  }
}

export { _testToken, ESTest }
