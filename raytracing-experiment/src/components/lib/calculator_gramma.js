import {Complex} from "./Complex"
import {Parser} from "jison"

var complex = new Complex(100, 100)
// console.log(complex.toString())

var calculatorGramma = {
  "comment": "JSON Math Parser",
  // JavaScript comments also work

  "_this": this,

  "lex": {
    "rules": [
      ["\\s+", "/* skip whitespace */"],
      ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER'"],
      ["i", "return 'COMPLEX_UNIT'"],
      ["P\\b", "return 'PI'"],
      ["E\\b", "return 'E'"],
      ["[0-9]+(?:\\.[0-9]+)?i\\b", "return 'COMPLEX'"],
      ["\\*", "return '*'"],
      ["\\/", "return '/'"],
      ["-", "return '-'"],
      ["\\+", "return '+'"],
      ["\\^", "return '^'"],
      ["!", "return '!'"],
      ["%", "return '%'"],
      ["\\(", "return '('"],
      ["\\)", "return ')'"],
      ["[a-zA-Z][a-zA-Z0-9]*", "return 'VARIABLE'"],
      ["$", "return 'EOF'"],
    ]
  },

  "operators": [
    ["left", "+", "-"],
    ["left", "*", "/"],
    ["left", "^"],
    ["right", "!"],
    ["right", "%"],
    ["left", "UMINUS"]
  ],

  "bnf": {
    "expressions": [["e EOF", "return $1.toString()"]],
    "e": [
      ["e + e", "$$ = $1.add($3)"],
      ["e - e", "$$ = $1.minus($3)"],
      ["e * e", "$$ = $1.multiply($3)"],
      ["e / e", "$$ = $1.divide($3)"],
      ["e ^ e", "$$ = $1.pow($3)"],
      ["e !", "$$ = (function(n) {if(n==0) return 1; return arguments.callee(n-1) * n})($1)"],
      ["e %", "$$ = $1/100"],
      ["- e", "$$ = $2.uminus()", {"prec": "UMINUS"}],
      ["( e )", "$$ = $2"],
      ["COMPLEX_UNIT", "$$ = new yy.Complex(0,1)" ],
      ["COMPLEX", "$$ = new yy.Complex(0, Number(yytext.slice(0,-1)))"],
      ["NUMBER", "$$ = new yy.Complex(Number(yytext), 0)"],
      ["VARIABLE",
        "var resultValue = 'NaN';"
        + "if(yy.variables[yytext]){ resultValue = yy.variables[yytext]}"
        + "else {"
        + "var tmp = prompt('Input variable:' + yytext);"
        + "yy.variables[yytext] = tmp;"
        + "}"
        + "$$ = yy.Complex.fromString(yy.variables[yytext]);"
      ],
      ["E", "$$ = new yy.Complex(Math.E,0)"],
      ["PI", "$$ = new yy.Complex(Math.PI,0)"]
    ]
  }
}

var parser = new Parser(calculatorGramma)

// console.log(parser)

parser.yy.Complex = Complex

export {parser}
