const name = 'escss-estest-old'
let testResult = null // for internal testing
const OPERATORS = ["<", "<=", ">=", ">", "===", "!=="]
const TYPES = [
  "undefined",
  "null",
  "array",
  "object",
  "boolean",
  "NaN",
  "number",
  "bigint",
  "string",
  "symbol",
  "function",
]

function fixLegacyType(input) {
  const isNull = input === null;
  const isArray = Array.isArray(input);
  const isNaN = Number.isNaN(input);

  const typeMap = {
    undefined: "undefined",
    object: isNull ? "null" : isArray ? "array" : "object",
    boolean: "boolean",
    number: isNaN ? "NaN" : "number",
    bigint: "bigint",
    string: "string",
    symbol: "symbol",
    function: "function",
  };

  return (
    typeMap[typeof input] ||
    `❌ Error from fixLegacyType(), input: ${input}`
  );
}

function fixTextInLog(input) {
  const fix_ArrayInLog = () => {
    // fix nesting array
    // '[1, 'hello', [2, 3]]'  -->  '[1, 'hello', [...]]'
    let result = "";

    input.forEach((item) => {
      if (fixLegacyType(item) === "array") {
        result += `[...], `;
      } else {
        result += `${fixTextInLog(item)}, `;
      }
    });

    // to remove the end of spacing and ,
    // '[1, 'hello', [...]], '  -->  '[1, 'hello', [...]]'
    result = `[${result.trim().slice(0, -1)}]`;

    return result;
  };
  const fix_ObjectInLog = () => {
    // fix nesting object
    // '{a: 1, b: {c: 1, d: 2}}'  -->  '{a: 1, b: {...}}'
    let result = "";

    for (const [key, value] of Object.entries(input)) {
      if (fixLegacyType(value) === "object") {
        result += `${key}: {...}, `;
      } else {
        result += `${key}: ${fixTextInLog(value)}, `;
      }
    }

    result = `{${result.trim().slice(0, -1)}}`;

    return result;
  };

  switch (fixLegacyType(input)) {
    case "array":
      return fix_ArrayInLog();
    case "object":
      return fix_ObjectInLog();
    case "bigint":
      return `${input}n`;
    case "string":
      return `'${input}'`;
    case "symbol":
      return `Symbol(...)`;
    default:
      return input;
  }
}

function useTypeMode(input, mode, msg = "undefined error message") {
  {
    if (!TYPES.includes(mode)) {
      throw new Error(
        `
        ❌ 2nd argument: ${fixTextInLog(mode)}
        ✅ expects: 'undefined' | 'null' | 'array' | 'object' | 'boolean' | 'NaN' | 'number' | 'bigint' | 'string' | 'symbol' | 'function'
        `,
      );
    }
    if (!["undefined", "string"].includes(typeof msg)) {
      const customErrType = fixLegacyType(msg);
      const customErrInLog = fixTextInLog(msg);

      throw new Error(
        `
        ❌ custom error message type: 📝 ${customErrInLog}('${customErrType}')
        ✅ expects: 'string' type
        `,
      );
    }
  }

  if (fixLegacyType(input) !== mode) {
    const fixTextInLogType = fixTextInLog(mode);
    const fixTextInLogInput = fixTextInLog(input);
    const fixLegacyType = fixLegacyType(input);

    throw new Error(
      `
      📝 ${msg}
      ❌ type error: ${fixTextInLogInput} ('${fixLegacyType}') === ${fixTextInLogType}
      `,
    );
  }

  switch (mode) {
    case "undefined":
      break;
    case "null":
      break;
    case "array":
      break;
    case "object":
      break;
    case "boolean":
      break;
    case "NaN":
      break;
    case "number":
      break;
    case "bigint":
      break;
    case "string":
      break;
    case "symbol":
      break;
    case "function":
      break;
  }

  testResult = mode;
}

function useOperatorMode(input, mode, input2, msg = "undefined error message") {
  {
    if (!OPERATORS.includes(mode)) {
      throw new Error(
        `
        ❌ 2nd argument: ${fixTextInLog(mode)}
        ✅ expects: '<' | '<=' | '>=' | '>' | '===' | '!=='
        `,
      );
    }
    if (!["undefined", "string"].includes(typeof msg)) {
      const customErrType = fixLegacyType(msg);
      const customErrInLog = fixTextInLog(msg);

      throw new Error(
        `
        ❌ custom error message type: 📝 ${customErrInLog}('${customErrType}')
        ✅ expects: 'string' type
        `,
      );
    }
  }

  const inputInLog = fixTextInLog(input);
  const input2InLog = fixTextInLog(input2);

  switch (mode) {
    case "<":
      if (!(input < input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} < ${input2InLog}
          `,
        );
      }

      break;
    case "<=":
      if (!(input <= input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} <= ${input2InLog}
          `,
        );
      }

      break;
    case ">=":
      if (!(input >= input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} >= ${input2InLog}
          `,
        );
      }

      break;
    case ">":
      if (!(input > input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} > ${input2InLog}
          `,
        );
      }

      break;
    case "===":
      if (!(input === input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} === ${input2InLog}
          `,
        );
      }

      break;
    case "!==":
      if (!(input !== input2)) {
        throw new Error(
          `
          📝 ${msg}
          ❌ relational operators error: ${inputInLog} !== ${input2InLog}
          `,
        );
      }

      break;
  }

  testResult = true;
}

function _getTestResult() {
  return testResult;
}

function ESTest(input, mode, msgOrInput2, msg) {
  if (TYPES.includes(mode)) {
    useTypeMode(input, mode, msgOrInput2); // msg here
  } else if (OPERATORS.includes(mode)) {
    useOperatorMode(input, mode, msgOrInput2, msg); // input2 here
  } else {
    throw new Error(
      `
      ❌ 2nd argument: ${fixTextInLog(mode)}
      ✅ expects: 'undefined'|'null'|'array'|'object'|'boolean'|'NaN'|'number'|'bigint'|'string'|'symbol'|'function'|'==='|'!=='|'<'|'<='|'>='|'>'
      `,
    );
  }
}

export { _getTestResult, ESTest };

