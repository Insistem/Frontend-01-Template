// DecimalLiteral

// some components
const NonZeroDigitRegExpStr = '[1-9]'
const DecimalDigitRegExpStr = '\\d'
const ExponentPartRegExpStr = `[eE][+-]?${DecimalDigitRegExpStr}+`
const DecimalIntegerLitralRegExpStr = `0|(${NonZeroDigitRegExpStr}${DecimalDigitRegExpStr}*)`

// DecimalIntegerLiteral . DecimalDigits(optional) ExponentPart(optional)
const d1String = `(${DecimalIntegerLitralRegExpStr})\\.${DecimalDigitRegExpStr}*(${ExponentPartRegExpStr})?`
const DecimalLiteralRegExp1 = new RegExp(`^${d1String}$`)

// DecimalIntegerLiteral ExponentPart(optional)
const d2String = `(${DecimalIntegerLitralRegExpStr})(${ExponentPartRegExpStr})?`
const DecimalLiteralRegExp2 = new RegExp(`^${d2String}$`)

// . DecimalDigits ExponentPart(optional)
const d3String = `\\.(${DecimalDigitRegExpStr}+)(${ExponentPartRegExpStr})?`
const DecimalLiteralRegExp3 = new RegExp(`^${d3String}$`)

// the final answer of DecimalLiteral
export const DecimalLiteralRegExp = new RegExp(`(^${d1String}$)|(^${d2String}$)|(^${d3String}$)`)




// BinaryIntegerLiteral

export const BinaryIntegerLiteralRegExp = /^0[bB][01]+$/




// OctalIntegerLiteral

export const OctalIntegerLiteralRegExp = /^0[oO][0-7]+$/




// HexIntegerLiteral

export const HexIntegerLiteralRegExp = /^0[xX][\dA-Fa-f]+$/



// NumericLiterals

export const NumericLiterals = new RegExp(`((^${d1String}$)|(^${d2String}$)|(^${d3String}$))|(^0[bB][01]+$)|(^0[oO][0-7]+$)|(^0[xX][\dA-Fa-f]+$)`)
