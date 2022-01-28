(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WebIDL2"] = factory();
	else
		root["WebIDL2"] = factory();
})(globalThis, function() {
__webpack_require__.r(__webpack_exports__);
 * @param {Tokeniser} tokeniser
 * @param {object} options
 * @param {boolean} [options.concrete]
function parseByTokens(tokeniser, options) {
  const source = tokeniser.source;
  function error(str) {
    tokeniser.error(str);
  }
  function consume(...candidates) {
    return tokeniser.consume(...candidates);
  }
  function callback() {
    const callback = consume("callback");
    if (!callback) return;
    if (tokeniser.probe("interface")) {
      return _productions_callback_interface_js__WEBPACK_IMPORTED_MODULE_10__.CallbackInterface.parse(tokeniser, callback);
    }
    return _productions_callback_js__WEBPACK_IMPORTED_MODULE_5__.CallbackFunction.parse(tokeniser, callback);
  }
  function interface_(opts) {
    const base = consume("interface");
    if (!base) return;
    const ret =
      _productions_mixin_js__WEBPACK_IMPORTED_MODULE_7__.Mixin.parse(tokeniser, base, opts) ||
      _productions_interface_js__WEBPACK_IMPORTED_MODULE_6__.Interface.parse(tokeniser, base, opts) ||
      error("Interface has no proper body");
    return ret;
  }
  function partial() {
    const partial = consume("partial");
    if (!partial) return;
    return (
      _productions_dictionary_js__WEBPACK_IMPORTED_MODULE_8__.Dictionary.parse(tokeniser, { partial }) ||
      interface_({ partial }) ||
      _productions_namespace_js__WEBPACK_IMPORTED_MODULE_9__.Namespace.parse(tokeniser, { partial }) ||
      error("Partial doesn't apply to anything")
    );
  }
  function definition() {
    return (
      callback() ||
      interface_() ||
      partial() ||
      _productions_dictionary_js__WEBPACK_IMPORTED_MODULE_8__.Dictionary.parse(tokeniser) ||
      _productions_enum_js__WEBPACK_IMPORTED_MODULE_1__.Enum.parse(tokeniser) ||
      _productions_typedef_js__WEBPACK_IMPORTED_MODULE_4__.Typedef.parse(tokeniser) ||
      _productions_includes_js__WEBPACK_IMPORTED_MODULE_2__.Includes.parse(tokeniser) ||
      _productions_namespace_js__WEBPACK_IMPORTED_MODULE_9__.Namespace.parse(tokeniser)
    );
  }
  function definitions() {
    if (!source.length) return [];
    const defs = [];
    while (true) {
      const ea = _productions_extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__.ExtendedAttributes.parse(tokeniser);
      const def = definition();
      if (!def) {
        if (ea.length) error("Stray extended attributes");
        break;
      }
      (0,_productions_helpers_js__WEBPACK_IMPORTED_MODULE_11__.autoParenter)(def).extAttrs = ea;
      defs.push(def);
    }
    const eof = tokeniser.consumeType("eof");
    if (options.concrete) {
      defs.push(eof);
    }
    return defs;
  }
  const res = definitions();
  if (tokeniser.position < source.length) error("Unrecognised tokens");
  return res;
}
 * @param {string} str
 * @param {object} [options]
 * @param {*} [options.sourceName]
 * @param {boolean} [options.concrete]
function parse(str, options = {}) {
  const tokeniser = new _tokeniser_js__WEBPACK_IMPORTED_MODULE_0__.Tokeniser(str);
  if (typeof options.sourceName !== "undefined") {
    tokeniser.source.name = options.sourceName;
  }
  return parseByTokens(tokeniser, options);
}
__webpack_require__.r(__webpack_exports__);
const tokenRe = {
  decimal:
};
const typeNameKeywords = [
  "ArrayBuffer",
  "DataView",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Float32Array",
  "Float64Array",
  "any",
  "object",
  "symbol",
];
const stringTypes = ["ByteString", "DOMString", "USVString"];
const argumentNameKeywords = [
  "async",
  "attribute",
  "callback",
  "const",
  "constructor",
  "deleter",
  "dictionary",
  "enum",
  "getter",
  "includes",
  "inherit",
  "interface",
  "iterable",
  "maplike",
  "namespace",
  "partial",
  "required",
  "setlike",
  "setter",
  "static",
  "stringifier",
  "typedef",
  "unrestricted",
];
const nonRegexTerminals = [
  "-Infinity",
  "FrozenArray",
  "Infinity",
  "NaN",
  "ObservableArray",
  "Promise",
  "bigint",
  "boolean",
  "byte",
  "double",
  "false",
  "float",
  "long",
  "mixin",
  "null",
  "octet",
  "optional",
  "or",
  "readonly",
  "record",
  "sequence",
  "short",
  "true",
  "undefined",
  "unsigned",
  "void",
].concat(argumentNameKeywords, stringTypes, typeNameKeywords);
const punctuations = [
  "(",
  ")",
  ",",
  "...",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "[",
  "]",
  "{",
  "}",
];
const reserved = [
  "_constructor",
  "toString",
  "_toString",
];
 * @typedef {ArrayItemType<ReturnType<typeof tokenise>>} Token
 * @param {string} str
function tokenise(str) {
  const tokens = [];
  let lastCharIndex = 0;
  let trivia = "";
  let line = 1;
  let index = 0;
  while (lastCharIndex < str.length) {
    const nextChar = str.charAt(lastCharIndex);
    let result = -1;
      result = attemptTokenMatch("whitespace", { noFlushTrivia: true });
      result = attemptTokenMatch("comment", { noFlushTrivia: true });
    }
    if (result !== -1) {
      const currentTrivia = tokens.pop().value;
      trivia += currentTrivia;
      index -= 1;
      result = attemptTokenMatch("decimal");
      if (result === -1) {
        result = attemptTokenMatch("integer");
      }
      if (result === -1) {
        result = attemptTokenMatch("identifier");
        const lastIndex = tokens.length - 1;
        const token = tokens[lastIndex];
        if (result !== -1) {
          if (reserved.includes(token.value)) {
            const message = `${(0,_productions_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(
              token.value
            )} is a reserved identifier and must not be used.`;
            throw new WebIDLParseError(
              (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.syntaxError)(tokens, lastIndex, null, message)
            );
          } else if (nonRegexTerminals.includes(token.value)) {
            token.type = "inline";
          }
        }
      }
    } else if (nextChar === '"') {
      result = attemptTokenMatch("string");
    }
    for (const punctuation of punctuations) {
      if (str.startsWith(punctuation, lastCharIndex)) {
        tokens.push({
          type: "inline",
          value: punctuation,
          trivia,
          line,
          index,
        });
        trivia = "";
        lastCharIndex += punctuation.length;
        result = lastCharIndex;
        break;
      }
    }
    if (result === -1) {
      result = attemptTokenMatch("other");
    }
    if (result === -1) {
      throw new Error("Token stream not progressing");
    }
    lastCharIndex = result;
    index += 1;
  }
  tokens.push({
    type: "eof",
    value: "",
    trivia,
  });
  return tokens;
   * @param {keyof typeof tokenRe} type
   * @param {object} options
   * @param {boolean} [options.noFlushTrivia]
  function attemptTokenMatch(type, { noFlushTrivia } = {}) {
    const re = tokenRe[type];
    re.lastIndex = lastCharIndex;
    const result = re.exec(str);
    if (result) {
      tokens.push({ type, value: result[0], trivia, line, index });
      if (!noFlushTrivia) {
        trivia = "";
      }
      return re.lastIndex;
    }
    return -1;
  }
}
class Tokeniser {
   * @param {string} idl
  constructor(idl) {
    this.source = tokenise(idl);
    this.position = 0;
  }
   * @param {string} message
   * @return {never}
  error(message) {
    throw new WebIDLParseError(
      (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.syntaxError)(this.source, this.position, this.current, message)
    );
  }
   * @param {string} type
  probeType(type) {
    return (
      this.source.length > this.position &&
      this.source[this.position].type === type
    );
  }
   * @param {string} value
  probe(value) {
    return (
      this.probeType("inline") && this.source[this.position].value === value
    );
  }
   * @param  {...string} candidates
  consumeType(...candidates) {
    for (const type of candidates) {
      if (!this.probeType(type)) continue;
      const token = this.source[this.position];
      this.position++;
      return token;
    }
  }
   * @param  {...string} candidates
  consume(...candidates) {
    if (!this.probeType("inline")) return;
    const token = this.source[this.position];
    for (const value of candidates) {
      if (token.value !== value) continue;
      this.position++;
      return token;
    }
  }
   * @param {number} position
  unconsume(position) {
    this.position = position;
  }
}
class WebIDLParseError extends Error {
   * @param {object} options
   * @param {string} options.message
   * @param {string} options.bareMessage
   * @param {string} options.context
   * @param {number} options.line
   * @param {*} options.sourceName
   * @param {string} options.input
   * @param {*[]} options.tokens
  constructor({
    message,
    bareMessage,
    context,
    line,
    sourceName,
    input,
    tokens,
  }) {
    super(message);
    this.bareMessage = bareMessage;
    this.context = context;
    this.line = line;
    this.sourceName = sourceName;
    this.input = input;
    this.tokens = tokens;
  }
}
__webpack_require__.r(__webpack_exports__);
 * @param {string} text
function lastLine(text) {
  const splitted = text.split("\n");
  return splitted[splitted.length - 1];
}
function appendIfExist(base, target) {
  let result = base;
  if (target) {
    result += ` ${target}`;
  }
  return result;
}
function contextAsText(node) {
  const hierarchy = [node];
  while (node && node.parent) {
    const { parent } = node;
    hierarchy.unshift(parent);
    node = parent;
  }
  return hierarchy.map((n) => appendIfExist(n.type, n.name)).join(" -> ");
}
 * @typedef {object} WebIDL2ErrorOptions
 * @property {"error" | "warning"} [level]
 * @property {Function} [autofix]
 *
 * @param {string} message error message
 * @param {"Syntax" | "Validation"} kind error type
 * @param {WebIDL2ErrorOptions} [options]
function error(
  source,
  position,
  current,
  message,
  kind,
  { level = "error", autofix, ruleName } = {}
) {
   * @param {number} count
  function sliceTokens(count) {
    return count > 0
      ? source.slice(position, position + count)
      : source.slice(Math.max(position + count, 0), position);
  }
  function tokensToText(inputs, { precedes } = {}) {
    const text = inputs.map((t) => t.trivia + t.value).join("");
    const nextToken = source[position];
    if (nextToken.type === "eof") {
      return text;
    }
    if (precedes) {
      return text + nextToken.trivia;
    }
    return text.slice(nextToken.trivia.length);
  }
  const line =
    source[position].type !== "eof"
      ? source[position].line
      : source.length > 1
      ? source[position - 1].line
      : 1;
  const precedingLastLine = lastLine(
    tokensToText(sliceTokens(-maxTokens), { precedes: true })
  );
  const subsequentTokens = sliceTokens(maxTokens);
  const subsequentText = tokensToText(subsequentTokens);
  const subsequentFirstLine = subsequentText.split("\n")[0];
  const spaced = " ".repeat(precedingLastLine.length) + "^";
  const sourceContext = precedingLastLine + subsequentFirstLine + "\n" + spaced;
  const contextType = kind === "Syntax" ? "since" : "inside";
  const inSourceName = source.name ? ` in ${source.name}` : "";
  const grammaticalContext =
    current && current.name
      ? `, ${contextType} \`${current.partial ? "partial " : ""}${contextAsText(
          current
        )}\``
      : "";
  const context = `${kind} error at line ${line}${inSourceName}${grammaticalContext}:\n${sourceContext}`;
  return {
    message: `${context} ${message}`,
    bareMessage: message,
    context,
    line,
    sourceName: source.name,
    level,
    ruleName,
    autofix,
    input: subsequentText,
    tokens: subsequentTokens,
  };
}
 * @param {string} message error message
function syntaxError(source, position, current, message) {
  return error(source, position, current, message, "Syntax");
}
 * @param {string} message error message
 * @param {WebIDL2ErrorOptions} [options]
function validationError(
  token,
  current,
  ruleName,
  message,
  options = {}
) {
  options.ruleName = ruleName;
  return error(
    current.source,
    token.index,
    current,
    message,
    "Validation",
    options
  );
}
__webpack_require__.r(__webpack_exports__);
 * @param {string} identifier
function unescape(identifier) {
  return identifier.startsWith("_") ? identifier.slice(1) : identifier;
}
 * Parses comma-separated list
 * @param {object} args
 * @param {Function} args.parser parser function for each item
 * @param {boolean} [args.allowDangler] whether to allow dangling comma
 * @param {string} [args.listName] the name to be shown on error messages
function list(tokeniser, { parser, allowDangler, listName = "list" }) {
  const first = parser(tokeniser);
  if (!first) {
    return [];
  }
  first.tokens.separator = tokeniser.consume(",");
  const items = [first];
  while (first.tokens.separator) {
    const item = parser(tokeniser);
    if (!item) {
      if (!allowDangler) {
        tokeniser.error(`Trailing comma in ${listName}`);
      }
      break;
    }
    item.tokens.separator = tokeniser.consume(",");
    items.push(item);
    if (!item.tokens.separator) break;
  }
  return items;
}
function const_value(tokeniser) {
  return (
    tokeniser.consumeType("decimal", "integer") ||
    tokeniser.consume("true", "false", "Infinity", "-Infinity", "NaN")
  );
}
 * @param {object} token
 * @param {string} token.type
 * @param {string} token.value
function const_data({ type, value }) {
  switch (type) {
    case "decimal":
    case "integer":
      return { type: "number", value };
    case "string":
      return { type: "string", value: value.slice(1, -1) };
  }
  switch (value) {
    case "true":
    case "false":
      return { type: "boolean", value: value === "true" };
    case "Infinity":
    case "-Infinity":
      return { type: "Infinity", negative: value.startsWith("-") };
    case "[":
      return { type: "sequence", value: [] };
    case "{":
      return { type: "dictionary" };
    default:
      return { type: value };
  }
}
function primitive_type(tokeniser) {
  function integer_type() {
    const prefix = tokeniser.consume("unsigned");
    const base = tokeniser.consume("short", "long");
    if (base) {
      const postfix = tokeniser.consume("long");
      return new _type_js__WEBPACK_IMPORTED_MODULE_0__.Type({ source, tokens: { prefix, base, postfix } });
    }
    if (prefix) tokeniser.error("Failed to parse integer type");
  }
  function decimal_type() {
    const prefix = tokeniser.consume("unrestricted");
    const base = tokeniser.consume("float", "double");
    if (base) {
      return new _type_js__WEBPACK_IMPORTED_MODULE_0__.Type({ source, tokens: { prefix, base } });
    }
    if (prefix) tokeniser.error("Failed to parse float type");
  }
  const { source } = tokeniser;
  const num_type = integer_type(tokeniser) || decimal_type(tokeniser);
  if (num_type) return num_type;
  const base = tokeniser.consume(
    "bigint",
    "boolean",
    "byte",
    "octet",
    "undefined"
  );
  if (base) {
    return new _type_js__WEBPACK_IMPORTED_MODULE_0__.Type({ source, tokens: { base } });
  }
}
function argument_list(tokeniser) {
  return list(tokeniser, {
    parser: _argument_js__WEBPACK_IMPORTED_MODULE_1__.Argument.parse,
    listName: "arguments list",
  });
}
 * @param {string} typeName
function type_with_extended_attributes(tokeniser, typeName) {
  const extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__.ExtendedAttributes.parse(tokeniser);
  const ret = _type_js__WEBPACK_IMPORTED_MODULE_0__.Type.parse(tokeniser, typeName);
  if (ret) autoParenter(ret).extAttrs = extAttrs;
  return ret;
}
 * @param {string} typeName
function return_type(tokeniser, typeName) {
  const typ = _type_js__WEBPACK_IMPORTED_MODULE_0__.Type.parse(tokeniser, typeName || "return-type");
  if (typ) {
    return typ;
  }
  const voidToken = tokeniser.consume("void");
  if (voidToken) {
    const ret = new _type_js__WEBPACK_IMPORTED_MODULE_0__.Type({
      source: tokeniser.source,
      tokens: { base: voidToken },
    });
    ret.type = "return-type";
    return ret;
  }
}
function stringifier(tokeniser) {
  const special = tokeniser.consume("stringifier");
  if (!special) return;
  const member =
    _attribute_js__WEBPACK_IMPORTED_MODULE_4__.Attribute.parse(tokeniser, { special }) ||
    _operation_js__WEBPACK_IMPORTED_MODULE_3__.Operation.parse(tokeniser, { special }) ||
    tokeniser.error("Unterminated stringifier");
  return member;
}
 * @param {string} str
function getLastIndentation(str) {
  const lines = str.split("\n");
  if (lines.length) {
    if (match) {
      return match[0];
    }
  }
  return "";
}
 * @param {string} parentTrivia
function getMemberIndentation(parentTrivia) {
  const indentation = getLastIndentation(parentTrivia);
  const indentCh = indentation.includes("\t") ? "\t" : "  ";
  return indentation + indentCh;
}
 * @param {object} def
function autofixAddExposedWindow(def) {
  return () => {
    if (def.extAttrs.length) {
      const tokeniser = new _tokeniser_js__WEBPACK_IMPORTED_MODULE_5__.Tokeniser("Exposed=Window,");
      const exposed = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__.SimpleExtendedAttribute.parse(tokeniser);
      exposed.tokens.separator = tokeniser.consume(",");
      const existing = def.extAttrs[0];
        existing.tokens.name.trivia = ` ${existing.tokens.name.trivia}`;
      }
      def.extAttrs.unshift(exposed);
    } else {
      autoParenter(def).extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__.ExtendedAttributes.parse(
        new _tokeniser_js__WEBPACK_IMPORTED_MODULE_5__.Tokeniser("[Exposed=Window]")
      );
      const trivia = def.tokens.base.trivia;
      def.extAttrs.tokens.open.trivia = trivia;
      def.tokens.base.trivia = `\n${getLastIndentation(trivia)}`;
    }
  };
}
 * Get the first syntax token for the given IDL object.
 * @param {*} data
function getFirstToken(data) {
  if (data.extAttrs.length) {
    return data.extAttrs.tokens.open;
  }
  if (data.type === "operation" && !data.special) {
    return getFirstToken(data.idlType);
  }
  const tokens = Object.values(data.tokens).sort((x, y) => x.index - y.index);
  return tokens[0];
}
 * @template T
 * @param {T[]} array
 * @param {(item: T) => boolean} predicate
function findLastIndex(array, predicate) {
  const index = array.slice().reverse().findIndex(predicate);
  if (index === -1) {
    return index;
  }
  return array.length - index - 1;
}
 * Returns a proxy that auto-assign `parent` field.
 * @template T
 * @param {T} data
 * @param {*} [parent] The object that will be assigned to `parent`.
 *                     If absent, it will be `data` by default.
 * @return {T}
function autoParenter(data, parent) {
  if (!parent) {
    parent = data;
  }
  if (!data) {
    return data;
  }
  return new Proxy(data, {
    get(target, p) {
      const value = target[p];
      if (Array.isArray(value)) {
        return autoParenter(value, target);
      }
      return value;
    },
    set(target, p, value) {
      target[p] = value;
      if (!value) {
        return true;
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item.parent !== "undefined") {
            item.parent = parent;
          }
        }
      } else if (typeof value.parent !== "undefined") {
        value.parent = parent;
      }
      return true;
    },
  });
}
__webpack_require__.r(__webpack_exports__);
 * @param {string} typeName
function generic_type(tokeniser, typeName) {
  const base = tokeniser.consume(
    "FrozenArray",
    "ObservableArray",
    "Promise",
    "sequence",
    "record"
  );
  if (!base) {
    return;
  }
  const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(
    new Type({ source: tokeniser.source, tokens: { base } })
  );
  ret.tokens.open =
    tokeniser.consume("<") ||
    tokeniser.error(`No opening bracket after ${base.value}`);
  switch (base.value) {
    case "Promise": {
      if (tokeniser.probe("["))
        tokeniser.error("Promise type cannot have extended attribute");
      const subtype =
        (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.return_type)(tokeniser, typeName) ||
        tokeniser.error("Missing Promise subtype");
      ret.subtype.push(subtype);
      break;
    }
    case "sequence":
    case "FrozenArray":
    case "ObservableArray": {
      const subtype =
        (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser, typeName) ||
        tokeniser.error(`Missing ${base.value} subtype`);
      ret.subtype.push(subtype);
      break;
    }
    case "record": {
      if (tokeniser.probe("["))
        tokeniser.error("Record key cannot have extended attribute");
      const keyType =
        tokeniser.consume(..._tokeniser_js__WEBPACK_IMPORTED_MODULE_2__.stringTypes) ||
        tokeniser.error(`Record key must be one of: ${_tokeniser_js__WEBPACK_IMPORTED_MODULE_2__.stringTypes.join(", ")}`);
      const keyIdlType = new Type({
        source: tokeniser.source,
        tokens: { base: keyType },
      });
      keyIdlType.tokens.separator =
        tokeniser.consume(",") ||
        tokeniser.error("Missing comma after record key type");
      keyIdlType.type = typeName;
      const valueType =
        (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser, typeName) ||
        tokeniser.error("Error parsing generic type record");
      ret.subtype.push(keyIdlType, valueType);
      break;
    }
  }
  if (!ret.idlType) tokeniser.error(`Error parsing generic type ${base.value}`);
  ret.tokens.close =
    tokeniser.consume(">") ||
    tokeniser.error(`Missing closing bracket after ${base.value}`);
  return ret.this;
}
function type_suffix(tokeniser, obj) {
  const nullable = tokeniser.consume("?");
  if (nullable) {
    obj.tokens.nullable = nullable;
  }
  if (tokeniser.probe("?")) tokeniser.error("Can't nullable more than once");
}
 * @param {string} typeName
function single_type(tokeniser, typeName) {
  let ret = generic_type(tokeniser, typeName) || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.primitive_type)(tokeniser);
  if (!ret) {
    const base =
      tokeniser.consumeType("identifier") ||
      tokeniser.consume(..._tokeniser_js__WEBPACK_IMPORTED_MODULE_2__.stringTypes, ..._tokeniser_js__WEBPACK_IMPORTED_MODULE_2__.typeNameKeywords);
    if (!base) {
      return;
    }
    ret = new Type({ source: tokeniser.source, tokens: { base } });
    if (tokeniser.probe("<"))
      tokeniser.error(`Unsupported generic type ${base.value}`);
  }
  if (ret.generic === "Promise" && tokeniser.probe("?")) {
    tokeniser.error("Promise type cannot be nullable");
  }
  ret.type = typeName || null;
  type_suffix(tokeniser, ret);
  if (ret.nullable && ret.idlType === "any")
    tokeniser.error("Type `any` cannot be made nullable");
  return ret;
}
 * @param {string} type
function union_type(tokeniser, type) {
  const tokens = {};
  tokens.open = tokeniser.consume("(");
  if (!tokens.open) return;
  const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(new Type({ source: tokeniser.source, tokens }));
  ret.type = type || null;
  while (true) {
    const typ =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser) ||
      tokeniser.error("No type after open parenthesis or 'or' in union type");
    if (typ.idlType === "any")
      tokeniser.error("Type `any` cannot be included in a union type");
    if (typ.generic === "Promise")
      tokeniser.error("Type `Promise` cannot be included in a union type");
    ret.subtype.push(typ);
    const or = tokeniser.consume("or");
    if (or) {
      typ.tokens.separator = or;
    } else break;
  }
  if (ret.idlType.length < 2) {
    tokeniser.error(
      "At least two types are expected in a union type but found less"
    );
  }
  tokens.close =
    tokeniser.consume(")") || tokeniser.error("Unterminated union type");
  type_suffix(tokeniser, ret);
  return ret.this;
}
class Type extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
   * @param {string} typeName
  static parse(tokeniser, typeName) {
    return single_type(tokeniser, typeName) || union_type(tokeniser, typeName);
  }
  constructor({ source, tokens }) {
    super({ source, tokens });
    Object.defineProperty(this, "subtype", { value: [], writable: true });
    this.extAttrs = new _extended_attributes_js__WEBPACK_IMPORTED_MODULE_5__.ExtendedAttributes({});
  }
  get generic() {
    if (this.subtype.length && this.tokens.base) {
      return this.tokens.base.value;
    }
    return "";
  }
  get nullable() {
    return Boolean(this.tokens.nullable);
  }
  get union() {
    return Boolean(this.subtype.length) && !this.tokens.base;
  }
  get idlType() {
    if (this.subtype.length) {
      return this.subtype;
    }
    const name = [this.tokens.prefix, this.tokens.base, this.tokens.postfix]
      .filter((t) => t)
      .map((t) => t.value)
      .join(" ");
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(name);
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    if (this.idlType === "void") {
      const message = `\`void\` is now replaced by \`undefined\`. Refer to the \
for more information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_3__.validationError)(this.tokens.base, this, "replace-void", message, {
        autofix: replaceVoid(this),
      });
    }
     * If a union is nullable, its subunions cannot include a dictionary
     * If not, subunions may include dictionaries if each union is not nullable
    const typedef = !this.union && defs.unique.get(this.idlType);
    const target = this.union
      ? this
      : typedef && typedef.type === "typedef"
      ? typedef.idlType
      : undefined;
    if (target && this.nullable) {
      const { reference } = (0,_validators_helpers_js__WEBPACK_IMPORTED_MODULE_4__.idlTypeIncludesDictionary)(target, defs) || {};
      if (reference) {
        const targetToken = (this.union ? reference : this).tokens.base;
        const message = "Nullable union cannot include a dictionary type.";
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_3__.validationError)(
          targetToken,
          this,
          "no-nullable-union-dict",
          message
        );
      }
    } else {
      for (const subtype of this.subtype) {
        yield* subtype.validate(defs);
      }
    }
  }
  write(w) {
    const type_body = () => {
      if (this.union || this.generic) {
        return w.ts.wrap([
          w.token(this.tokens.base, w.ts.generic),
          w.token(this.tokens.open),
          ...this.subtype.map((t) => t.write(w)),
          w.token(this.tokens.close),
        ]);
      }
      const firstToken = this.tokens.prefix || this.tokens.base;
      const prefix = this.tokens.prefix
        ? [this.tokens.prefix.value, w.ts.trivia(this.tokens.base.trivia)]
        : [];
      const ref = w.reference(
        w.ts.wrap([
          ...prefix,
          this.tokens.base.value,
          w.token(this.tokens.postfix),
        ]),
        { unescaped: this.idlType, context: this }
      );
      return w.ts.wrap([w.ts.trivia(firstToken.trivia), ref]);
    };
    return w.ts.wrap([
      this.extAttrs.write(w),
      type_body(),
      w.token(this.tokens.nullable),
      w.token(this.tokens.separator),
    ]);
  }
}
 * @param {Type} type
function replaceVoid(type) {
  return () => {
    type.tokens.base.value = "undefined";
  };
}
__webpack_require__.r(__webpack_exports__);
class Base {
   * @param {object} initializer
   * @param {Base["source"]} initializer.source
   * @param {Base["tokens"]} initializer.tokens
  constructor({ source, tokens }) {
    Object.defineProperties(this, {
      source: { value: source },
      tokens: { value: tokens, writable: true },
      parent: { value: null, writable: true },
    });
  }
  toJSON() {
    const json = { type: undefined, name: undefined, inheritance: undefined };
    let proto = this;
    while (proto !== Object.prototype) {
      const descMap = Object.getOwnPropertyDescriptors(proto);
      for (const [key, value] of Object.entries(descMap)) {
        if (value.enumerable || value.get) {
          json[key] = this[key];
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
    return json;
  }
}
__webpack_require__.r(__webpack_exports__);
 *
 * @param {*} idlType
 * @param {object} [options]
 * @param {boolean} [options.useNullableInner] use when the input idlType is nullable and you want to use its inner type
 * @return {{ reference: *, dictionary: Dictionary }} the type reference that ultimately includes dictionary.
function idlTypeIncludesDictionary(
  idlType,
  defs,
  { useNullableInner } = {}
) {
  if (!idlType.union) {
    const def = defs.unique.get(idlType.idlType);
    if (!def) {
      return;
    }
    if (def.type === "typedef") {
      const { typedefIncludesDictionary } = defs.cache;
      if (typedefIncludesDictionary.has(def)) {
        return typedefIncludesDictionary.get(def);
      }
      const result = idlTypeIncludesDictionary(def.idlType, defs);
      defs.cache.typedefIncludesDictionary.set(def, result);
      if (result) {
        return {
          reference: idlType,
          dictionary: result.dictionary,
        };
      }
    }
    if (def.type === "dictionary" && (useNullableInner || !idlType.nullable)) {
      return {
        reference: idlType,
        dictionary: def,
      };
    }
  }
  for (const subtype of idlType.subtype) {
    const result = idlTypeIncludesDictionary(subtype, defs);
    if (result) {
      if (subtype.union) {
        return result;
      }
      return {
        reference: subtype,
        dictionary: result.dictionary,
      };
    }
  }
}
 * @param {*} dict dictionary type
 * @return {boolean}
function dictionaryIncludesRequiredField(dict, defs) {
  if (defs.cache.dictionaryIncludesRequiredField.has(dict)) {
    return defs.cache.dictionaryIncludesRequiredField.get(dict);
  }
  defs.cache.dictionaryIncludesRequiredField.set(dict, undefined);
  let result = dict.members.some((field) => field.required);
  if (!result && dict.inheritance) {
    const superdict = defs.unique.get(dict.inheritance);
    if (!superdict) {
      result = true;
    } else if (dictionaryIncludesRequiredField(superdict, defs)) {
      result = true;
    }
  }
  defs.cache.dictionaryIncludesRequiredField.set(dict, result);
  return result;
}
__webpack_require__.r(__webpack_exports__);
 * @param {string} tokenName
function tokens(tokeniser, tokenName) {
  return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.list)(tokeniser, {
    parser: _token_js__WEBPACK_IMPORTED_MODULE_2__.WrappedToken.parser(tokeniser, tokenName),
    listName: tokenName + " list",
  });
}
const extAttrValueSyntax = ["identifier", "decimal", "integer", "string"];
const shouldBeLegacyPrefixed = [
  "NoInterfaceObject",
  "LenientSetter",
  "LenientThis",
  "TreatNonObjectAsNull",
  "Unforgeable",
];
const renamedLegacies = new Map([
  ...shouldBeLegacyPrefixed.map((name) => [name, `Legacy${name}`]),
  ["NamedConstructor", "LegacyFactoryFunction"],
  ["OverrideBuiltins", "LegacyOverrideBuiltIns"],
  ["TreatNullAs", "LegacyNullToEmptyString"],
]);
 * This will allow a set of extended attribute values to be parsed.
function extAttrListItems(tokeniser) {
  for (const syntax of extAttrValueSyntax) {
    const toks = tokens(tokeniser, syntax);
    if (toks.length) {
      return toks;
    }
  }
  tokeniser.error(
    `Expected identifiers, strings, decimals, or integers but none found`
  );
}
class ExtendedAttributeParameters extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const tokens = { assign: tokeniser.consume("=") };
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.autoParenter)(
      new ExtendedAttributeParameters({ source: tokeniser.source, tokens })
    );
    if (tokens.assign) {
      tokens.secondaryName = tokeniser.consumeType(...extAttrValueSyntax);
    }
    tokens.open = tokeniser.consume("(");
    if (tokens.open) {
      ret.list = ret.rhsIsList
          extAttrListItems(tokeniser)
          (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.argument_list)(tokeniser);
      tokens.close =
        tokeniser.consume(")") ||
        tokeniser.error("Unexpected token in extended attribute argument list");
    } else if (ret.hasRhs && !tokens.secondaryName) {
      tokeniser.error("No right hand side to extended attribute assignment");
    }
    return ret.this;
  }
  get rhsIsList() {
    return this.tokens.assign && !this.tokens.secondaryName;
  }
  get rhsType() {
    if (this.rhsIsList) {
      return this.list[0].tokens.value.type + "-list";
    }
    if (this.tokens.secondaryName) {
      return this.tokens.secondaryName.type;
    }
    return null;
  }
  write(w) {
    function extended_attribute_listitem(item) {
      return w.ts.wrap([
        w.token(item.tokens.value),
        w.token(item.tokens.separator),
      ]);
    }
    const { rhsType } = this;
    return w.ts.wrap([
      w.token(this.tokens.assign),
      w.reference_token(this.tokens.secondaryName, this.parent),
      w.token(this.tokens.open),
      ...(!this.list
        ? []
        : this.list.map((p) => {
            return rhsType === "identifier-list"
              ? w.identifier(p, this.parent)
              : rhsType && rhsType.endsWith("-list")
              ? extended_attribute_listitem(p)
              : p.write(w);
          })),
      w.token(this.tokens.close),
    ]);
  }
}
class SimpleExtendedAttribute extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const name = tokeniser.consumeType("identifier");
    if (name) {
      return new SimpleExtendedAttribute({
        source: tokeniser.source,
        tokens: { name },
        params: ExtendedAttributeParameters.parse(tokeniser),
      });
    }
  }
  constructor({ source, tokens, params }) {
    super({ source, tokens });
    params.parent = this;
    Object.defineProperty(this, "params", { value: params });
  }
  get type() {
    return "extended-attribute";
  }
  get name() {
    return this.tokens.name.value;
  }
  get rhs() {
    const { rhsType: type, tokens, list } = this.params;
    if (!type) {
      return null;
    }
    const value = this.params.rhsIsList
      ? list
      : (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.unescape)(tokens.secondaryName.value);
    return { type, value };
  }
  get arguments() {
    const { rhsIsList, list } = this.params;
    if (!list || rhsIsList) {
      return [];
    }
    return list;
  }
  *validate(defs) {
    const { name } = this;
    if (name === "LegacyNoInterfaceObject") {
      const message = `\`[LegacyNoInterfaceObject]\` extended attribute is an \
undesirable feature that may be removed from Web IDL in the future. Refer to the \
information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_4__.validationError)(
        this.tokens.name,
        this,
        "no-nointerfaceobject",
        message,
        { level: "warning" }
      );
    } else if (renamedLegacies.has(name)) {
      const message = `\`[${name}]\` extended attribute is a legacy feature \
that is now renamed to \`[${renamedLegacies.get(name)}]\`. Refer to the \
information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_4__.validationError)(this.tokens.name, this, "renamed-legacy", message, {
        level: "warning",
        autofix: renameLegacyExtendedAttribute(this),
      });
    }
    for (const arg of this.arguments) {
      yield* arg.validate(defs);
    }
  }
  write(w) {
    return w.ts.wrap([
      w.ts.trivia(this.tokens.name.trivia),
      w.ts.extendedAttribute(
        w.ts.wrap([
          w.ts.extendedAttributeReference(this.name),
          this.params.write(w),
        ])
      ),
      w.token(this.tokens.separator),
    ]);
  }
}
 * @param {SimpleExtendedAttribute} extAttr
function renameLegacyExtendedAttribute(extAttr) {
  return () => {
    const { name } = extAttr;
    extAttr.tokens.name.value = renamedLegacies.get(name);
    if (name === "TreatNullAs") {
      extAttr.params.tokens = {};
    }
  };
}
class ExtendedAttributes extends _array_base_js__WEBPACK_IMPORTED_MODULE_1__.ArrayBase {
  static parse(tokeniser) {
    const tokens = {};
    tokens.open = tokeniser.consume("[");
    if (!tokens.open) return new ExtendedAttributes({});
    const ret = new ExtendedAttributes({ source: tokeniser.source, tokens });
    ret.push(
      ...(0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.list)(tokeniser, {
        parser: SimpleExtendedAttribute.parse,
        listName: "extended attribute",
      })
    );
    tokens.close =
      tokeniser.consume("]") ||
      tokeniser.error("Unexpected closing token of extended attribute");
    if (!ret.length) {
      tokeniser.error("Found an empty extended attribute");
    }
    if (tokeniser.probe("[")) {
      tokeniser.error(
        "Illegal double extended attribute lists, consider merging them"
      );
    }
    return ret;
  }
  *validate(defs) {
    for (const extAttr of this) {
      yield* extAttr.validate(defs);
    }
  }
  write(w) {
    if (!this.length) return "";
    return w.ts.wrap([
      w.token(this.tokens.open),
      ...this.map((ea) => ea.write(w)),
      w.token(this.tokens.close),
    ]);
  }
}
__webpack_require__.r(__webpack_exports__);
class ArrayBase extends Array {
  constructor({ source, tokens }) {
    super();
    Object.defineProperties(this, {
      source: { value: source },
      tokens: { value: tokens },
      parent: { value: null, writable: true },
    });
  }
}
__webpack_require__.r(__webpack_exports__);
class WrappedToken extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
   * @param {string} type
  static parser(tokeniser, type) {
    return () => {
      const value = tokeniser.consumeType(type);
      if (value) {
        return new WrappedToken({
          source: tokeniser.source,
          tokens: { value },
        });
      }
    };
  }
  get value() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.value.value);
  }
}
__webpack_require__.r(__webpack_exports__);
class Argument extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const start_position = tokeniser.position;
    const tokens = {};
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.autoParenter)(
      new Argument({ source: tokeniser.source, tokens })
    );
    ret.extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__.ExtendedAttributes.parse(tokeniser);
    tokens.optional = tokeniser.consume("optional");
    ret.idlType = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.type_with_extended_attributes)(tokeniser, "argument-type");
    if (!ret.idlType) {
      return tokeniser.unconsume(start_position);
    }
    if (!tokens.optional) {
      tokens.variadic = tokeniser.consume("...");
    }
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.consume(..._tokeniser_js__WEBPACK_IMPORTED_MODULE_4__.argumentNameKeywords);
    if (!tokens.name) {
      return tokeniser.unconsume(start_position);
    }
    ret.default = tokens.optional ? _default_js__WEBPACK_IMPORTED_MODULE_1__.Default.parse(tokeniser) : null;
    return ret.this;
  }
  get type() {
    return "argument";
  }
  get optional() {
    return !!this.tokens.optional;
  }
  get variadic() {
    return !!this.tokens.variadic;
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.unescape)(this.tokens.name.value);
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    yield* this.idlType.validate(defs);
    const result = (0,_validators_helpers_js__WEBPACK_IMPORTED_MODULE_6__.idlTypeIncludesDictionary)(this.idlType, defs, {
      useNullableInner: true,
    });
    if (result) {
      if (this.idlType.nullable) {
        const message = `Dictionary arguments cannot be nullable.`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_5__.validationError)(
          this.tokens.name,
          this,
          "no-nullable-dict-arg",
          message
        );
      } else if (!this.optional) {
        if (
          this.parent &&
          !(0,_validators_helpers_js__WEBPACK_IMPORTED_MODULE_6__.dictionaryIncludesRequiredField)(result.dictionary, defs) &&
          isLastRequiredArgument(this)
        ) {
          const message = `Dictionary argument must be optional if it has no required fields`;
          yield (0,_error_js__WEBPACK_IMPORTED_MODULE_5__.validationError)(
            this.tokens.name,
            this,
            "dict-arg-optional",
            message,
            {
              autofix: autofixDictionaryArgumentOptionality(this),
            }
          );
        }
      } else if (!this.default) {
        const message = `Optional dictionary arguments must have a default value of \`{}\`.`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_5__.validationError)(
          this.tokens.name,
          this,
          "dict-arg-default",
          message,
          {
            autofix: autofixOptionalDictionaryDefaultValue(this),
          }
        );
      }
    }
  }
  write(w) {
    return w.ts.wrap([
      this.extAttrs.write(w),
      w.token(this.tokens.optional),
      w.ts.type(this.idlType.write(w)),
      w.token(this.tokens.variadic),
      w.name_token(this.tokens.name, { data: this }),
      this.default ? this.default.write(w) : "",
      w.token(this.tokens.separator),
    ]);
  }
}
 * @param {Argument} arg
function isLastRequiredArgument(arg) {
  const list = arg.parent.arguments || arg.parent.list;
  const index = list.indexOf(arg);
  const requiredExists = list.slice(index + 1).some((a) => !a.optional);
  return !requiredExists;
}
 * @param {Argument} arg
function autofixDictionaryArgumentOptionality(arg) {
  return () => {
    const firstToken = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.getFirstToken)(arg.idlType);
    arg.tokens.optional = {
      type: "optional",
      value: "optional",
      trivia: firstToken.trivia,
    };
    firstToken.trivia = " ";
    autofixOptionalDictionaryDefaultValue(arg)();
  };
}
 * @param {Argument} arg
function autofixOptionalDictionaryDefaultValue(arg) {
  return () => {
    arg.default = _default_js__WEBPACK_IMPORTED_MODULE_1__.Default.parse(new _tokeniser_js__WEBPACK_IMPORTED_MODULE_4__.Tokeniser(" = {}"));
  };
}
__webpack_require__.r(__webpack_exports__);
class Default extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const assign = tokeniser.consume("=");
    if (!assign) {
      return null;
    }
    const def =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.const_value)(tokeniser) ||
      tokeniser.consumeType("string") ||
      tokeniser.consume("null", "[", "{") ||
      tokeniser.error("No value for default");
    const expression = [def];
    if (def.value === "[") {
      const close =
        tokeniser.consume("]") ||
        tokeniser.error("Default sequence value must be empty");
      expression.push(close);
    } else if (def.value === "{") {
      const close =
        tokeniser.consume("}") ||
        tokeniser.error("Default dictionary value must be empty");
      expression.push(close);
    }
    return new Default({
      source: tokeniser.source,
      tokens: { assign },
      expression,
    });
  }
  constructor({ source, tokens, expression }) {
    super({ source, tokens });
    expression.parent = this;
    Object.defineProperty(this, "expression", { value: expression });
  }
  get type() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.const_data)(this.expression[0]).type;
  }
  get value() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.const_data)(this.expression[0]).value;
  }
  get negative() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.const_data)(this.expression[0]).negative;
  }
  write(w) {
    return w.ts.wrap([
      w.token(this.tokens.assign),
      ...this.expression.map((t) => w.token(t)),
    ]);
  }
}
__webpack_require__.r(__webpack_exports__);
class Operation extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
   *
   * @param {object} [options]
   * @param {Token} [options.special]
   * @param {Token} [options.regular]
  static parse(tokeniser, { special, regular } = {}) {
    const tokens = { special };
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(
      new Operation({ source: tokeniser.source, tokens })
    );
    if (special && special.value === "stringifier") {
      tokens.termination = tokeniser.consume(";");
      if (tokens.termination) {
        ret.arguments = [];
        return ret;
      }
    }
    if (!special && !regular) {
      tokens.special = tokeniser.consume("getter", "setter", "deleter");
    }
    ret.idlType =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.return_type)(tokeniser) || tokeniser.error("Missing return type");
    tokens.name =
      tokeniser.consumeType("identifier") || tokeniser.consume("includes");
    tokens.open =
      tokeniser.consume("(") || tokeniser.error("Invalid operation");
    ret.arguments = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.argument_list)(tokeniser);
    tokens.close =
      tokeniser.consume(")") || tokeniser.error("Unterminated operation");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated operation, expected `;`");
    return ret.this;
  }
  get type() {
    return "operation";
  }
  get name() {
    const { name } = this.tokens;
    if (!name) {
      return "";
    }
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(name.value);
  }
  get special() {
    if (!this.tokens.special) {
      return "";
    }
    return this.tokens.special.value;
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    if (!this.name && ["", "static"].includes(this.special)) {
      const message = `Regular or static operations must have both a return type and an identifier.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_2__.validationError)(this.tokens.open, this, "incomplete-op", message);
    }
    if (this.idlType) {
      yield* this.idlType.validate(defs);
    }
    for (const argument of this.arguments) {
      yield* argument.validate(defs);
    }
  }
  write(w) {
    const { parent } = this;
    const body = this.idlType
      ? [
          w.ts.type(this.idlType.write(w)),
          w.name_token(this.tokens.name, { data: this, parent }),
          w.token(this.tokens.open),
          w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
          w.token(this.tokens.close),
        ]
      : [];
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        this.tokens.name
          ? w.token(this.tokens.special)
          : w.token(this.tokens.special, w.ts.nameless, { data: this, parent }),
        ...body,
        w.token(this.tokens.termination),
      ]),
      { data: this, parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Attribute extends _base_js__WEBPACK_IMPORTED_MODULE_2__.Base {
   * @param {object} [options]
   * @param {boolean} [options.noInherit]
   * @param {boolean} [options.readonly]
  static parse(
    tokeniser,
    { special, noInherit = false, readonly = false } = {}
  ) {
    const start_position = tokeniser.position;
    const tokens = { special };
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.autoParenter)(
      new Attribute({ source: tokeniser.source, tokens })
    );
    if (!special && !noInherit) {
      tokens.special = tokeniser.consume("inherit");
    }
    if (ret.special === "inherit" && tokeniser.probe("readonly")) {
      tokeniser.error("Inherited attributes cannot be read-only");
    }
    tokens.readonly = tokeniser.consume("readonly");
    if (readonly && !tokens.readonly && tokeniser.probe("attribute")) {
      tokeniser.error("Attributes must be readonly in this context");
    }
    tokens.base = tokeniser.consume("attribute");
    if (!tokens.base) {
      tokeniser.unconsume(start_position);
      return;
    }
    ret.idlType =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.type_with_extended_attributes)(tokeniser, "attribute-type") ||
      tokeniser.error("Attribute lacks a type");
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.consume("async", "required") ||
      tokeniser.error("Attribute lacks a name");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated attribute, expected `;`");
    return ret.this;
  }
  get type() {
    return "attribute";
  }
  get special() {
    if (!this.tokens.special) {
      return "";
    }
    return this.tokens.special.value;
  }
  get readonly() {
    return !!this.tokens.readonly;
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.unescape)(this.tokens.name.value);
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    yield* this.idlType.validate(defs);
    switch (this.idlType.generic) {
      case "sequence":
      case "record": {
        const message = `Attributes cannot accept ${this.idlType.generic} types.`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.validationError)(
          this.tokens.name,
          this,
          "attr-invalid-type",
          message
        );
        break;
      }
      default: {
        const { reference } =
          (0,_validators_helpers_js__WEBPACK_IMPORTED_MODULE_1__.idlTypeIncludesDictionary)(this.idlType, defs) || {};
        if (reference) {
          const targetToken = (this.idlType.union ? reference : this.idlType)
            .tokens.base;
          const message = "Attributes cannot accept dictionary types.";
          yield (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.validationError)(
            targetToken,
            this,
            "attr-invalid-type",
            message
          );
        }
      }
    }
  }
  write(w) {
    const { parent } = this;
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.special),
        w.token(this.tokens.readonly),
        w.token(this.tokens.base),
        w.ts.type(this.idlType.write(w)),
        w.name_token(this.tokens.name, { data: this, parent }),
        w.token(this.tokens.termination),
      ]),
      { data: this, parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class EnumValue extends _token_js__WEBPACK_IMPORTED_MODULE_1__.WrappedToken {
  static parse(tokeniser) {
    const value = tokeniser.consumeType("string");
    if (value) {
      return new EnumValue({ source: tokeniser.source, tokens: { value } });
    }
  }
  get type() {
    return "enum-value";
  }
  get value() {
    return super.value.slice(1, -1);
  }
  write(w) {
    const { parent } = this;
    return w.ts.wrap([
      w.ts.trivia(this.tokens.value.trivia),
      w.ts.definition(
        w.ts.wrap(['"', w.ts.name(this.value, { data: this, parent }), '"']),
        { data: this, parent }
      ),
      w.token(this.tokens.separator),
    ]);
  }
}
class Enum extends _base_js__WEBPACK_IMPORTED_MODULE_2__.Base {
  static parse(tokeniser) {
    const tokens = {};
    tokens.base = tokeniser.consume("enum");
    if (!tokens.base) {
      return;
    }
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("No name for enum");
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.autoParenter)(new Enum({ source: tokeniser.source, tokens }));
    tokeniser.current = ret.this;
    tokens.open = tokeniser.consume("{") || tokeniser.error("Bodyless enum");
    ret.values = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.list)(tokeniser, {
      parser: EnumValue.parse,
      allowDangler: true,
      listName: "enumeration",
    });
    if (tokeniser.probeType("string")) {
      tokeniser.error("No comma between enum values");
    }
    tokens.close =
      tokeniser.consume("}") || tokeniser.error("Unexpected value in enum");
    if (!ret.values.length) {
      tokeniser.error("No value in enum");
    }
    tokens.termination =
      tokeniser.consume(";") || tokeniser.error("No semicolon after enum");
    return ret.this;
  }
  get type() {
    return "enum";
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.unescape)(this.tokens.name.value);
  }
  write(w) {
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.base),
        w.name_token(this.tokens.name, { data: this }),
        w.token(this.tokens.open),
        w.ts.wrap(this.values.map((v) => v.write(w))),
        w.token(this.tokens.close),
        w.token(this.tokens.termination),
      ]),
      { data: this }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Includes extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const target = tokeniser.consumeType("identifier");
    if (!target) {
      return;
    }
    const tokens = { target };
    tokens.includes = tokeniser.consume("includes");
    if (!tokens.includes) {
      tokeniser.unconsume(target.index);
      return;
    }
    tokens.mixin =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("Incomplete includes statement");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("No terminating ; for includes statement");
    return new Includes({ source: tokeniser.source, tokens });
  }
  get type() {
    return "includes";
  }
  get target() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.target.value);
  }
  get includes() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.mixin.value);
  }
  write(w) {
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.reference_token(this.tokens.target, this),
        w.token(this.tokens.includes),
        w.reference_token(this.tokens.mixin, this),
        w.token(this.tokens.termination),
      ]),
      { data: this }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Typedef extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const tokens = {};
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(new Typedef({ source: tokeniser.source, tokens }));
    tokens.base = tokeniser.consume("typedef");
    if (!tokens.base) {
      return;
    }
    ret.idlType =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser, "typedef-type") ||
      tokeniser.error("Typedef lacks a type");
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("Typedef lacks a name");
    tokeniser.current = ret.this;
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated typedef, expected `;`");
    return ret.this;
  }
  get type() {
    return "typedef";
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.name.value);
  }
  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
  write(w) {
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.base),
        w.ts.type(this.idlType.write(w)),
        w.name_token(this.tokens.name, { data: this }),
        w.token(this.tokens.termination),
      ]),
      { data: this }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class CallbackFunction extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser, base) {
    const tokens = { base };
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(
      new CallbackFunction({ source: tokeniser.source, tokens })
    );
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("Callback lacks a name");
    tokeniser.current = ret.this;
    tokens.assign =
      tokeniser.consume("=") || tokeniser.error("Callback lacks an assignment");
    ret.idlType =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.return_type)(tokeniser) || tokeniser.error("Callback lacks a return type");
    tokens.open =
      tokeniser.consume("(") ||
      tokeniser.error("Callback lacks parentheses for arguments");
    ret.arguments = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.argument_list)(tokeniser);
    tokens.close =
      tokeniser.consume(")") || tokeniser.error("Unterminated callback");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated callback, expected `;`");
    return ret.this;
  }
  get type() {
    return "callback";
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.name.value);
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    yield* this.idlType.validate(defs);
  }
  write(w) {
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.base),
        w.name_token(this.tokens.name, { data: this }),
        w.token(this.tokens.assign),
        w.ts.type(this.idlType.write(w)),
        w.token(this.tokens.open),
        ...this.arguments.map((arg) => arg.write(w)),
        w.token(this.tokens.close),
        w.token(this.tokens.termination),
      ]),
      { data: this }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
function static_member(tokeniser) {
  const special = tokeniser.consume("static");
  if (!special) return;
  const member =
    _attribute_js__WEBPACK_IMPORTED_MODULE_1__.Attribute.parse(tokeniser, { special }) ||
    _operation_js__WEBPACK_IMPORTED_MODULE_2__.Operation.parse(tokeniser, { special }) ||
    tokeniser.error("No body in static member");
  return member;
}
class Interface extends _container_js__WEBPACK_IMPORTED_MODULE_0__.Container {
  static parse(tokeniser, base, { partial = null } = {}) {
    const tokens = { partial, base };
    return _container_js__WEBPACK_IMPORTED_MODULE_0__.Container.parse(
      tokeniser,
      new Interface({ source: tokeniser.source, tokens }),
      {
        type: "interface",
        inheritable: !partial,
        allowedMembers: [
          [_constant_js__WEBPACK_IMPORTED_MODULE_3__.Constant.parse],
          [_constructor_js__WEBPACK_IMPORTED_MODULE_8__.Constructor.parse],
          [static_member],
          [_helpers_js__WEBPACK_IMPORTED_MODULE_5__.stringifier],
          [_iterable_js__WEBPACK_IMPORTED_MODULE_4__.IterableLike.parse],
          [_attribute_js__WEBPACK_IMPORTED_MODULE_1__.Attribute.parse],
          [_operation_js__WEBPACK_IMPORTED_MODULE_2__.Operation.parse],
        ],
      }
    );
  }
  get type() {
    return "interface";
  }
  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    if (
      !this.partial &&
      this.extAttrs.every((extAttr) => extAttr.name !== "Exposed")
    ) {
      const message = `Interfaces must have \`[Exposed]\` extended attribute. \
To fix, add, for example, \`[Exposed=Window]\`. Please also consider carefully \
if your interface should also be exposed in a Worker scope. Refer to the \
for more information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_6__.validationError)(
        this.tokens.name,
        this,
        "require-exposed",
        message,
        {
          autofix: (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.autofixAddExposedWindow)(this),
        }
      );
    }
    const oldConstructors = this.extAttrs.filter(
      (extAttr) => extAttr.name === "Constructor"
    );
    for (const constructor of oldConstructors) {
      const message = `Constructors should now be represented as a \`constructor()\` operation on the interface \
instead of \`[Constructor]\` extended attribute. Refer to the \
for more information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_6__.validationError)(
        constructor.tokens.name,
        this,
        "constructor-member",
        message,
        {
          autofix: autofixConstructor(this, constructor),
        }
      );
    }
    const isGlobal = this.extAttrs.some((extAttr) => extAttr.name === "Global");
    if (isGlobal) {
      const factoryFunctions = this.extAttrs.filter(
        (extAttr) => extAttr.name === "LegacyFactoryFunction"
      );
      for (const named of factoryFunctions) {
        const message = `Interfaces marked as \`[Global]\` cannot have factory functions.`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_6__.validationError)(
          named.tokens.name,
          this,
          "no-constructible-global",
          message
        );
      }
      const constructors = this.members.filter(
        (member) => member.type === "constructor"
      );
      for (const named of constructors) {
        const message = `Interfaces marked as \`[Global]\` cannot have constructors.`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_6__.validationError)(
          named.tokens.base,
          this,
          "no-constructible-global",
          message
        );
      }
    }
    yield* super.validate(defs);
    if (!this.partial) {
      yield* (0,_validators_interface_js__WEBPACK_IMPORTED_MODULE_7__.checkInterfaceMemberDuplication)(defs, this);
    }
  }
}
function autofixConstructor(interfaceDef, constructorExtAttr) {
  interfaceDef = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.autoParenter)(interfaceDef);
  return () => {
    const indentation = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.getLastIndentation)(
      interfaceDef.extAttrs.tokens.open.trivia
    );
    const memberIndent = interfaceDef.members.length
      ? (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.getLastIndentation)((0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.getFirstToken)(interfaceDef.members[0]).trivia)
      : (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.getMemberIndentation)(indentation);
    const constructorOp = _constructor_js__WEBPACK_IMPORTED_MODULE_8__.Constructor.parse(
      new _tokeniser_js__WEBPACK_IMPORTED_MODULE_9__.Tokeniser(`\n${memberIndent}constructor();`)
    );
    constructorOp.extAttrs = new _extended_attributes_js__WEBPACK_IMPORTED_MODULE_10__.ExtendedAttributes({});
    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.autoParenter)(constructorOp).arguments = constructorExtAttr.arguments;
    const existingIndex = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.findLastIndex)(
      interfaceDef.members,
      (m) => m.type === "constructor"
    );
    interfaceDef.members.splice(existingIndex + 1, 0, constructorOp);
    const { close } = interfaceDef.tokens;
    if (!close.trivia.includes("\n")) {
      close.trivia += `\n${indentation}`;
    }
    const { extAttrs } = interfaceDef;
    const index = extAttrs.indexOf(constructorExtAttr);
    const removed = extAttrs.splice(index, 1);
    if (!extAttrs.length) {
      extAttrs.tokens.open = extAttrs.tokens.close = undefined;
    } else if (extAttrs.length === index) {
      extAttrs[index - 1].tokens.separator = undefined;
    } else if (!extAttrs[index].tokens.name.trivia.trim()) {
      extAttrs[index].tokens.name.trivia = removed[0].tokens.name.trivia;
    }
  };
}
__webpack_require__.r(__webpack_exports__);
function inheritance(tokeniser) {
  const colon = tokeniser.consume(":");
  if (!colon) {
    return {};
  }
  const inheritance =
    tokeniser.consumeType("identifier") ||
    tokeniser.error("Inheritance lacks a type");
  return { colon, inheritance };
}
class Container extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
   * @template T
   * @param {T} instance
   * @param {*} args
  static parse(tokeniser, instance, { type, inheritable, allowedMembers }) {
    const { tokens } = instance;
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error(`Missing name in ${instance.type}`);
    tokeniser.current = instance;
    instance = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.autoParenter)(instance);
    if (inheritable) {
      Object.assign(tokens, inheritance(tokeniser));
    }
    tokens.open = tokeniser.consume("{") || tokeniser.error(`Bodyless ${type}`);
    instance.members = [];
    while (true) {
      tokens.close = tokeniser.consume("}");
      if (tokens.close) {
        tokens.termination =
          tokeniser.consume(";") ||
          tokeniser.error(`Missing semicolon after ${type}`);
        return instance.this;
      }
      const ea = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_1__.ExtendedAttributes.parse(tokeniser);
      let mem;
      for (const [parser, ...args] of allowedMembers) {
        mem = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.autoParenter)(parser(tokeniser, ...args));
        if (mem) {
          break;
        }
      }
      if (!mem) {
        tokeniser.error("Unknown member");
      }
      mem.extAttrs = ea;
      instance.members.push(mem.this);
    }
  }
  get partial() {
    return !!this.tokens.partial;
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.unescape)(this.tokens.name.value);
  }
  get inheritance() {
    if (!this.tokens.inheritance) {
      return null;
    }
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.unescape)(this.tokens.inheritance.value);
  }
  *validate(defs) {
    for (const member of this.members) {
      if (member.validate) {
        yield* member.validate(defs);
      }
    }
  }
  write(w) {
    const inheritance = () => {
      if (!this.tokens.inheritance) {
        return "";
      }
      return w.ts.wrap([
        w.token(this.tokens.colon),
        w.ts.trivia(this.tokens.inheritance.trivia),
        w.ts.inheritance(
          w.reference(this.tokens.inheritance.value, { context: this })
        ),
      ]);
    };
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.callback),
        w.token(this.tokens.partial),
        w.token(this.tokens.base),
        w.token(this.tokens.mixin),
        w.name_token(this.tokens.name, { data: this }),
        inheritance(),
        w.token(this.tokens.open),
        w.ts.wrap(this.members.map((m) => m.write(w))),
        w.token(this.tokens.close),
        w.token(this.tokens.termination),
      ]),
      { data: this }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Constant extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const tokens = {};
    tokens.base = tokeniser.consume("const");
    if (!tokens.base) {
      return;
    }
    let idlType = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.primitive_type)(tokeniser);
    if (!idlType) {
      const base =
        tokeniser.consumeType("identifier") ||
        tokeniser.error("Const lacks a type");
      idlType = new _type_js__WEBPACK_IMPORTED_MODULE_1__.Type({ source: tokeniser.source, tokens: { base } });
    }
    if (tokeniser.probe("?")) {
      tokeniser.error("Unexpected nullable constant type");
    }
    idlType.type = "const-type";
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("Const lacks a name");
    tokens.assign =
      tokeniser.consume("=") || tokeniser.error("Const lacks value assignment");
    tokens.value =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.const_value)(tokeniser) || tokeniser.error("Const lacks a value");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated const, expected `;`");
    const ret = new Constant({ source: tokeniser.source, tokens });
    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.autoParenter)(ret).idlType = idlType;
    return ret;
  }
  get type() {
    return "const";
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.unescape)(this.tokens.name.value);
  }
  get value() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.const_data)(this.tokens.value);
  }
  write(w) {
    const { parent } = this;
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.base),
        w.ts.type(this.idlType.write(w)),
        w.name_token(this.tokens.name, { data: this, parent }),
        w.token(this.tokens.assign),
        w.token(this.tokens.value),
        w.token(this.tokens.termination),
      ]),
      { data: this, parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class IterableLike extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const start_position = tokeniser.position;
    const tokens = {};
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(
      new IterableLike({ source: tokeniser.source, tokens })
    );
    tokens.readonly = tokeniser.consume("readonly");
    if (!tokens.readonly) {
      tokens.async = tokeniser.consume("async");
    }
    tokens.base = tokens.readonly
      ? tokeniser.consume("maplike", "setlike")
      : tokens.async
      ? tokeniser.consume("iterable")
      : tokeniser.consume("iterable", "maplike", "setlike");
    if (!tokens.base) {
      tokeniser.unconsume(start_position);
      return;
    }
    const { type } = ret;
    const secondTypeRequired = type === "maplike";
    const secondTypeAllowed = secondTypeRequired || type === "iterable";
    const argumentAllowed = ret.async && type === "iterable";
    tokens.open =
      tokeniser.consume("<") ||
      tokeniser.error(`Missing less-than sign \`<\` in ${type} declaration`);
    const first =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser) ||
      tokeniser.error(`Missing a type argument in ${type} declaration`);
    ret.idlType = [first];
    ret.arguments = [];
    if (secondTypeAllowed) {
      first.tokens.separator = tokeniser.consume(",");
      if (first.tokens.separator) {
        ret.idlType.push((0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser));
      } else if (secondTypeRequired) {
        tokeniser.error(`Missing second type argument in ${type} declaration`);
      }
    }
    tokens.close =
      tokeniser.consume(">") ||
      tokeniser.error(`Missing greater-than sign \`>\` in ${type} declaration`);
    if (tokeniser.probe("(")) {
      if (argumentAllowed) {
        tokens.argsOpen = tokeniser.consume("(");
        ret.arguments.push(...(0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.argument_list)(tokeniser));
        tokens.argsClose =
          tokeniser.consume(")") ||
          tokeniser.error("Unterminated async iterable argument list");
      } else {
        tokeniser.error(`Arguments are only allowed for \`async iterable\``);
      }
    }
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error(`Missing semicolon after ${type} declaration`);
    return ret.this;
  }
  get type() {
    return this.tokens.base.value;
  }
  get readonly() {
    return !!this.tokens.readonly;
  }
  get async() {
    return !!this.tokens.async;
  }
  *validate(defs) {
    for (const type of this.idlType) {
      yield* type.validate(defs);
    }
    for (const argument of this.arguments) {
      yield* argument.validate(defs);
    }
  }
  write(w) {
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.readonly),
        w.token(this.tokens.async),
        w.token(this.tokens.base, w.ts.generic),
        w.token(this.tokens.open),
        w.ts.wrap(this.idlType.map((t) => t.write(w))),
        w.token(this.tokens.close),
        w.token(this.tokens.argsOpen),
        w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
        w.token(this.tokens.argsClose),
        w.token(this.tokens.termination),
      ]),
      { data: this, parent: this.parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
function* checkInterfaceMemberDuplication(defs, i) {
  const opNames = new Set(getOperations(i).map((op) => op.name));
  const partials = defs.partials.get(i.name) || [];
  const mixins = defs.mixinMap.get(i.name) || [];
  for (const ext of [...partials, ...mixins]) {
    const additions = getOperations(ext);
    yield* forEachExtension(additions, opNames, ext, i);
    for (const addition of additions) {
      opNames.add(addition.name);
    }
  }
  function* forEachExtension(additions, existings, ext, base) {
    for (const addition of additions) {
      const { name } = addition;
      if (name && existings.has(name)) {
        const message = `The operation "${name}" has already been defined for the base interface "${base.name}" either in itself or in a mixin`;
        yield (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.validationError)(
          addition.tokens.name,
          ext,
          "no-cross-overload",
          message
        );
      }
    }
  }
  function getOperations(i) {
    return i.members.filter(({ type }) => type === "operation");
  }
}
__webpack_require__.r(__webpack_exports__);
class Constructor extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const base = tokeniser.consume("constructor");
    if (!base) {
      return;
    }
    const tokens = { base };
    tokens.open =
      tokeniser.consume("(") ||
      tokeniser.error("No argument list in constructor");
    const args = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.argument_list)(tokeniser);
    tokens.close =
      tokeniser.consume(")") || tokeniser.error("Unterminated constructor");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("No semicolon after constructor");
    const ret = new Constructor({ source: tokeniser.source, tokens });
    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(ret).arguments = args;
    return ret;
  }
  get type() {
    return "constructor";
  }
  *validate(defs) {
    if (this.idlType) {
      yield* this.idlType.validate(defs);
    }
    for (const argument of this.arguments) {
      yield* argument.validate(defs);
    }
  }
  write(w) {
    const { parent } = this;
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.base, w.ts.nameless, { data: this, parent }),
        w.token(this.tokens.open),
        w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
        w.token(this.tokens.close),
        w.token(this.tokens.termination),
      ]),
      { data: this, parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Mixin extends _container_js__WEBPACK_IMPORTED_MODULE_0__.Container {
   *
   * @param {Token} base
   * @param {object} [options]
   * @param {Token} [options.partial]
  static parse(tokeniser, base, { partial } = {}) {
    const tokens = { partial, base };
    tokens.mixin = tokeniser.consume("mixin");
    if (!tokens.mixin) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__.Container.parse(
      tokeniser,
      new Mixin({ source: tokeniser.source, tokens }),
      {
        type: "interface mixin",
        allowedMembers: [
          [_constant_js__WEBPACK_IMPORTED_MODULE_1__.Constant.parse],
          [_helpers_js__WEBPACK_IMPORTED_MODULE_4__.stringifier],
          [_attribute_js__WEBPACK_IMPORTED_MODULE_2__.Attribute.parse, { noInherit: true }],
          [_operation_js__WEBPACK_IMPORTED_MODULE_3__.Operation.parse, { regular: true }],
        ],
      }
    );
  }
  get type() {
    return "interface mixin";
  }
}
__webpack_require__.r(__webpack_exports__);
class Dictionary extends _container_js__WEBPACK_IMPORTED_MODULE_0__.Container {
   * @param {object} [options]
  static parse(tokeniser, { partial } = {}) {
    const tokens = { partial };
    tokens.base = tokeniser.consume("dictionary");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__.Container.parse(
      tokeniser,
      new Dictionary({ source: tokeniser.source, tokens }),
      {
        type: "dictionary",
        inheritable: !partial,
        allowedMembers: [[_field_js__WEBPACK_IMPORTED_MODULE_1__.Field.parse]],
      }
    );
  }
  get type() {
    return "dictionary";
  }
}
__webpack_require__.r(__webpack_exports__);
class Field extends _base_js__WEBPACK_IMPORTED_MODULE_0__.Base {
  static parse(tokeniser) {
    const tokens = {};
    const ret = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.autoParenter)(new Field({ source: tokeniser.source, tokens }));
    ret.extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__.ExtendedAttributes.parse(tokeniser);
    tokens.required = tokeniser.consume("required");
    ret.idlType =
      (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.type_with_extended_attributes)(tokeniser, "dictionary-type") ||
      tokeniser.error("Dictionary member lacks a type");
    tokens.name =
      tokeniser.consumeType("identifier") ||
      tokeniser.error("Dictionary member lacks a name");
    ret.default = _default_js__WEBPACK_IMPORTED_MODULE_3__.Default.parse(tokeniser);
    if (tokens.required && ret.default)
      tokeniser.error("Required member must not have a default");
    tokens.termination =
      tokeniser.consume(";") ||
      tokeniser.error("Unterminated dictionary member, expected `;`");
    return ret.this;
  }
  get type() {
    return "field";
  }
  get name() {
    return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.unescape)(this.tokens.name.value);
  }
  get required() {
    return !!this.tokens.required;
  }
  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
  write(w) {
    const { parent } = this;
    return w.ts.definition(
      w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.required),
        w.ts.type(this.idlType.write(w)),
        w.name_token(this.tokens.name, { data: this, parent }),
        this.default ? this.default.write(w) : "",
        w.token(this.tokens.termination),
      ]),
      { data: this, parent }
    );
  }
}
__webpack_require__.r(__webpack_exports__);
class Namespace extends _container_js__WEBPACK_IMPORTED_MODULE_0__.Container {
   * @param {object} [options]
  static parse(tokeniser, { partial } = {}) {
    const tokens = { partial };
    tokens.base = tokeniser.consume("namespace");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__.Container.parse(
      tokeniser,
      new Namespace({ source: tokeniser.source, tokens }),
      {
        type: "namespace",
        allowedMembers: [
          [_attribute_js__WEBPACK_IMPORTED_MODULE_1__.Attribute.parse, { noInherit: true, readonly: true }],
          [_constant_js__WEBPACK_IMPORTED_MODULE_5__.Constant.parse],
          [_operation_js__WEBPACK_IMPORTED_MODULE_2__.Operation.parse, { regular: true }],
        ],
      }
    );
  }
  get type() {
    return "namespace";
  }
  *validate(defs) {
    if (
      !this.partial &&
      this.extAttrs.every((extAttr) => extAttr.name !== "Exposed")
    ) {
      const message = `Namespaces must have [Exposed] extended attribute. \
To fix, add, for example, [Exposed=Window]. Please also consider carefully \
if your namespace should also be exposed in a Worker scope. Refer to the \
for more information.`;
      yield (0,_error_js__WEBPACK_IMPORTED_MODULE_3__.validationError)(
        this.tokens.name,
        this,
        "require-exposed",
        message,
        {
          autofix: (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.autofixAddExposedWindow)(this),
        }
      );
    }
    yield* super.validate(defs);
  }
}
__webpack_require__.r(__webpack_exports__);
class CallbackInterface extends _container_js__WEBPACK_IMPORTED_MODULE_0__.Container {
  static parse(tokeniser, callback, { partial = null } = {}) {
    const tokens = { callback };
    tokens.base = tokeniser.consume("interface");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__.Container.parse(
      tokeniser,
      new CallbackInterface({ source: tokeniser.source, tokens }),
      {
        type: "callback interface",
        inheritable: !partial,
        allowedMembers: [
          [_constant_js__WEBPACK_IMPORTED_MODULE_2__.Constant.parse],
          [_operation_js__WEBPACK_IMPORTED_MODULE_1__.Operation.parse, { regular: true }],
        ],
      }
    );
  }
  get type() {
    return "callback interface";
  }
}
__webpack_require__.r(__webpack_exports__);
function noop(arg) {
  return arg;
}
const templates = {
  wrap: (items) => items.join(""),
  trivia: noop,
  name: noop,
  reference: noop,
  type: noop,
  generic: noop,
  nameless: noop,
  inheritance: noop,
  definition: noop,
  extendedAttribute: noop,
  extendedAttributeReference: noop,
};
class Writer {
  constructor(ts) {
    this.ts = Object.assign({}, templates, ts);
  }
  reference(raw, { unescaped, context }) {
    if (!unescaped) {
      unescaped = raw.startsWith("_") ? raw.slice(1) : raw;
    }
    return this.ts.reference(raw, unescaped, context);
  }
  token(t, wrapper = noop, ...args) {
    if (!t) {
      return "";
    }
    const value = wrapper(t.value, ...args);
    return this.ts.wrap([this.ts.trivia(t.trivia), value]);
  }
  reference_token(t, context) {
    return this.token(t, this.reference.bind(this), { context });
  }
  name_token(t, arg) {
    return this.token(t, this.ts.name, arg);
  }
  identifier(id, context) {
    return this.ts.wrap([
      this.reference_token(id.tokens.value, context),
      this.token(id.tokens.separator),
    ]);
  }
}
function write(ast, { templates: ts = templates } = {}) {
  ts = Object.assign({}, templates, ts);
  const w = new Writer(ts);
  function dispatch(it) {
    if (it.type === "eof") {
      return ts.trivia(it.trivia);
    }
    return it.write(w);
  }
  return ts.wrap(ast.map(dispatch));
}
__webpack_require__.r(__webpack_exports__);
function getMixinMap(all, unique) {
  const map = new Map();
  const includes = all.filter((def) => def.type === "includes");
  for (const include of includes) {
    const mixin = unique.get(include.includes);
    if (!mixin) {
      continue;
    }
    const array = map.get(include.target);
    if (array) {
      array.push(mixin);
    } else {
      map.set(include.target, [mixin]);
    }
  }
  return map;
}
 * @typedef {ReturnType<typeof groupDefinitions>} Definitions
function groupDefinitions(all) {
  const unique = new Map();
  const duplicates = new Set();
  const partials = new Map();
  for (const def of all) {
    if (def.partial) {
      const array = partials.get(def.name);
      if (array) {
        array.push(def);
      } else {
        partials.set(def.name, [def]);
      }
      continue;
    }
    if (!def.name) {
      continue;
    }
    if (!unique.has(def.name)) {
      unique.set(def.name, def);
    } else {
      duplicates.add(def);
    }
  }
  return {
    all,
    unique,
    partials,
    duplicates,
    mixinMap: getMixinMap(all, unique),
    cache: {
      typedefIncludesDictionary: new WeakMap(),
      dictionaryIncludesRequiredField: new WeakMap(),
    },
  };
}
function* checkDuplicatedNames({ unique, duplicates }) {
  for (const dup of duplicates) {
    const { name } = dup;
    const message = `The name "${name}" of type "${
      unique.get(name).type
    }" was already seen`;
    yield (0,_error_js__WEBPACK_IMPORTED_MODULE_0__.validationError)(dup.tokens.name, dup, "no-duplicate", message);
  }
}
function* validateIterable(ast) {
  const defs = groupDefinitions(ast);
  for (const def of defs.all) {
    if (def.validate) {
      yield* def.validate(defs);
    }
  }
  yield* checkDuplicatedNames(defs);
}
function flatten(array) {
  if (array.flat) {
    return array.flat();
  }
  return [].concat(...array);
}
 * @param {*} ast AST or array of ASTs
function validate(ast) {
  return [...validateIterable(flatten(ast))];
}
var __webpack_exports__ = {};
(() => {
__webpack_require__.r(__webpack_exports__);
})();
;
});
