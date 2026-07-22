// Language ladder — easiest to hardest. All entries lowercase; input is
// lowercased before comparison so "True" and "forEach" both match.
// timeMult shrinks the per-word time bonus as languages get harder.

const LANGUAGES = [
  {
    name: 'PYTHON',
    color: '#4b8bbe',
    target: 400,
    timeMult: 1.0,
    words: [
      'import', 'from', 'as', 'def', 'class', 'return', 'if', 'elif', 'else',
      'for', 'while', 'in', 'is', 'not', 'and', 'or', 'break', 'continue',
      'pass', 'lambda', 'with', 'try', 'except', 'finally', 'raise', 'assert',
      'global', 'nonlocal', 'del', 'yield', 'async', 'await', 'true', 'false',
      'none', 'self', 'print', 'range', 'len', 'input', 'list', 'dict', 'set',
      'tuple', 'str', 'int', 'float', 'open'
    ]
  },
  {
    name: 'JAVASCRIPT',
    color: '#f7df1e',
    target: 500,
    timeMult: 0.9,
    words: [
      'var', 'let', 'const', 'function', 'return', 'if', 'else', 'switch',
      'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'new',
      'this', 'typeof', 'instanceof', 'class', 'extends', 'super', 'import',
      'export', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'delete',
      'void', 'in', 'of', 'yield', 'static', 'get', 'set', 'null', 'undefined',
      'true', 'false', 'console', 'document', 'window', 'map', 'filter',
      'reduce', 'push', 'foreach', 'promise', 'then', 'fetch', 'json'
    ]
  },
  {
    name: 'JAVA',
    color: '#e76f00',
    target: 600,
    timeMult: 0.8,
    words: [
      'public', 'private', 'protected', 'static', 'final', 'void', 'class',
      'interface', 'extends', 'implements', 'abstract', 'new', 'this', 'super',
      'return', 'if', 'else', 'switch', 'case', 'default', 'for', 'while',
      'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws',
      'import', 'package', 'int', 'long', 'short', 'byte', 'char', 'boolean',
      'float', 'double', 'string', 'enum', 'instanceof', 'synchronized',
      'volatile', 'transient', 'native', 'null', 'true', 'false', 'main',
      'system', 'println'
    ]
  },
  {
    name: 'C++',
    color: '#659ad2',
    target: 700,
    timeMult: 0.7,
    words: [
      'include', 'iostream', 'using', 'namespace', 'std', 'cout', 'cin',
      'endl', 'int', 'char', 'bool', 'float', 'double', 'void', 'long',
      'short', 'unsigned', 'signed', 'class', 'struct', 'union', 'enum',
      'public', 'private', 'protected', 'virtual', 'friend', 'inline',
      'template', 'typename', 'new', 'delete', 'const', 'constexpr', 'static',
      'extern', 'auto', 'nullptr', 'this', 'operator', 'sizeof', 'typedef',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
      'continue', 'try', 'catch', 'throw', 'vector', 'string'
    ]
  },
  {
    name: 'RUST',
    color: '#f74c00',
    target: 800,
    timeMult: 0.6,
    words: [
      'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl',
      'trait', 'pub', 'mod', 'use', 'crate', 'self', 'super', 'match', 'if',
      'else', 'loop', 'while', 'for', 'in', 'break', 'continue', 'return',
      'move', 'ref', 'box', 'dyn', 'unsafe', 'where', 'type', 'as', 'async',
      'await', 'some', 'none', 'ok', 'err', 'result', 'option', 'vec',
      'string', 'println', 'main', 'true', 'false', 'i32', 'u32', 'f64',
      'usize', 'str', 'clone', 'derive'
    ]
  }
];
