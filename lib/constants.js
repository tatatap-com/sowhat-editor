const WS_PATTERN = /\s+/m;
const SYMBOL_PATTERN = /\S+/;
const OPERATOR_PATTERN = /[\S]{1,42}/; // /\+|\-|\*|\/|%|sum|min|max|round|floor|ceil|pow|cos|sin|tan|[Bb][Ee][Aa][Nn][\+\-]?|\$/;
const ARG_PATTERN = /-|(?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))|(?:(?:[0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)/;
const TODO_PATTERN = /[Tt][Oo][Dd][Oo]/;
const DONE_PATTERN = /[Dd][Oo][Nn][Ee]/;
const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
const PIN_PATTERN = /\*[0-9]{0,3}/;
const DATETIME_PATTERN = /(?:\d{4})-?(?:1[0-2]|0[1-9])-?(?:3[01]|0[1-9]|[12][0-9])(?:(?:[\sT])?(?:2[0-3]p|[01][0-9]):?(?:[0-5][0-9]):?(?:[0-5][0-9])?(?:\.[0-9]+)?Z?)?/

export const PATH_PATTERN = new RegExp('(/(?:(?:"(?:[^"\\n]|\.)*?")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?)(/(?:(?:"(?:[^"\\n]|\.)*?")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?)*');

const BANG_PATTERN /******************/ = /!(?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))/;
export const AUTO_COMPLETE_BANG_PATTERN = /!(?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?/;

const TAG_PATTERN /******************/ = /#(?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))/;
export const AUTO_COMPLETE_TAG_PATTERN = /#(?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?/;

const PLUS_PATTERN /******************/ = /[\+](?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))(?::(?:[0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)?/;
export const AUTO_COMPLETE_PLUS_PATTERN = /[\+](?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?(?::(?:[0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)?/;

const MINUS_PATTERN /******************/ = /[\-](?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))(?::(?:[0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)?/;
export const AUTO_COMPLETE_MINUS_PATTERN = /[\-](?:(?:"(?:[^"\\]*(?:\\.[^"\\]*)*?)")|(?:(?:[\u1000-\uffff]|[a-zA-Z]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F])(?:[\u1000-\uffff]|[a-zA-Z0-9\-_]|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F]){0,18}))?(?::(?:[0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)(?:[eE][+-]?[0-9]+)?)?/;

export const LINK_OPEN_PATTERN = /:\/\//
export const QUOTED_NAME_PATTERN = /(?:"(?:[^"\\]|\\.)*")/

export const STATES =  {
  start: [
    { token: 'space', regex: WS_PATTERN},
    { token: 'pin',  regex: PIN_PATTERN, next: 'pin_start'},
    { token: 'date',  regex: DATETIME_PATTERN, next: 'date_start'},
    { token: 'path',  regex: PATH_PATTERN, next: 'path'},
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard' },
    { token: 'bang', regex: BANG_PATTERN, next: 'standard' },
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard' },
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard' },
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'todo', regex: TODO_PATTERN, next: 'todo'  },
    { token: 'done', regex: DONE_PATTERN, next: 'todo'  },
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  pin_start: [
    { token: 'space', regex: WS_PATTERN},
    { token: 'date',  regex: DATETIME_PATTERN, next: 'date_start'},
    { token: 'path',  regex: PATH_PATTERN, next: 'path'},
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard' },
    { token: 'bang', regex: BANG_PATTERN, next: 'standard' },
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard' },
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard' },
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'todo', regex: TODO_PATTERN, next: 'todo'  },
    { token: 'done', regex: DONE_PATTERN, next: 'todo'  },
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  date_start: [
    { token: 'space', regex: WS_PATTERN},
    { token: 'path',  regex: PATH_PATTERN, next: 'path'},
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard' },
    { token: 'bang', regex: BANG_PATTERN, next: 'standard' },
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard' },
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard' },
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'todo', regex: TODO_PATTERN, next: 'todo'  },
    { token: 'done', regex: DONE_PATTERN, next: 'todo'  },
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  standard: [
    { token: 'space', regex: WS_PATTERN},
    { token: 'tagname', regex: TAG_PATTERN},
    { token: 'bang', regex: BANG_PATTERN},
    { token: 'plus', regex: PLUS_PATTERN},
    { token: 'minus', regex: MINUS_PATTERN},
    { token: 'url', regex: URL_PATTERN},
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN },
  ],

  path: [
    { token: 'done', regex: DONE_PATTERN, next: 'standard'  },
    { token: 'todo', regex: TODO_PATTERN, next: 'standard'  },
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard'},
    { token: 'bang', regex: BANG_PATTERN, next: 'standard'},
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard'},
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard'},
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard' },
    { token: 'space', regex: WS_PATTERN, next: 'todo'},
  ],

  todo: [
    { token: 'done', regex: DONE_PATTERN, next: 'standard'  },
    { token: 'todo', regex: TODO_PATTERN, next: 'standard'  },
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard'},
    { token: 'bang', regex: BANG_PATTERN, next: 'standard'},
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard'},
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard'},
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard' },
    { token: 'space', regex: WS_PATTERN, next: 'standard'},
  ],

  // Links
  'link-open': [
    { token: 'space',  regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, next: 'link-setup-url'},
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-setup-url': [
    { token: 'href', regex: QUOTED_NAME_PATTERN, next: 'link-setup-title'},
    { token: 'space',  regex: WS_PATTERN },
    { token: 'rparen', regex: /\)/, next: 'link-img-open'},
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-setup-title': [
    { token: 'quoted-text', regex: QUOTED_NAME_PATTERN, next: 'link-setup-close' },
    { token: 'rparen', regex: /\)/, next: 'link-img-open' },
    { token: 'space',  regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-setup-close': [
    { token: 'rparen', regex: /\)/, next: 'link-img-open' },
    { token: 'space',  regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-img-open': [
    { token: 'space',  regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, next: 'link-img-url'},

    { token: 'space', regex: WS_PATTERN, next: 'standard'},
    { token: 'tagname', regex: TAG_PATTERN, next: 'standard'},
    { token: 'bang', regex: BANG_PATTERN, next: 'standard'},
    { token: 'plus', regex: PLUS_PATTERN, next: 'standard'},
    { token: 'minus', regex: MINUS_PATTERN, next: 'standard'},
    { token: 'url', regex: URL_PATTERN, next: 'standard'},
    { token: 'formula-open', regex: /\$\$/, next: 'formula-open'},
    { token: 'link-open', regex: LINK_OPEN_PATTERN, next: 'link-open'},
    { token: 'word', regex: SYMBOL_PATTERN, next: 'standard'},
    
  ],

  'link-img-url': [
    { token: 'href', regex: QUOTED_NAME_PATTERN, next: 'link-img-title'},
    { token: 'space',  regex: WS_PATTERN },
    { token: 'rparen', regex: /\)/, next: 'standard' },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-img-title': [
    { token: 'quoted-text', regex: QUOTED_NAME_PATTERN, next: 'link-img-close'},
    { token: 'rparen', regex: /\)/, next: 'standard' },
    { token: 'space',  regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'link-img-close': [
    { token: 'rparen', regex: /\)/, next: 'standard' },
    { token: 'space',  regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  // Formulas
  'formula-open': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, next: 'formula-setup-name' },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'formula-setup-name': [
    { token: 'arg', regex: ARG_PATTERN, next: 'formula-setup-close' },
    { token: 'rparen', regex: /\)/, next: 'formula-func-open' },
    { token: 'space', regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'formula-setup-close': [
    { token: 'rparen', regex: /\)/, next: 'formula-func-open' },
    { token: 'space', regex: WS_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'formula-func-open': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, next: 'formula-func-operator' },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'formula-func-operator': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'operator', regex: OPERATOR_PATTERN, next: 'formula-func' },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'formula-func': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, push: 'operator' },
    { token: 'rparen', regex: /\)/, next: 'standard' },
    { token: 'arg', regex: ARG_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'func': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'lparen', regex: /\(/, push: 'operator' },
    { token: 'rparen', regex: /\)/, pop: true },
    { token: 'arg', regex: ARG_PATTERN },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],

  'operator': [
    { token: 'space', regex: WS_PATTERN },
    { token: 'operator', regex: OPERATOR_PATTERN, next: 'func' },
    { token: 'syntaxerror', regex: SYMBOL_PATTERN, next: 'standard' },
  ],
}
