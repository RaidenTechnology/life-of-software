// Language ladder — 18 languages, easiest to hardest. All entries lowercase;
// input is lowercased before comparison so "True" and "forEach" both match.
// Operators/punctuation ("==", "=>", "::") count as patterns too.
// timeMult shrinks the per-word time bonus as languages get harder.
// dark: true → badge abbreviation is drawn dark (for light badge colors).

const LANGUAGES = [
  {
    name: 'PYTHON', abbr: 'Py', color: '#4b8bbe', target: 650, timeMult: 1.0,
    words: [
      'import', 'from', 'as', 'def', 'class', 'return', 'if', 'elif', 'else',
      'for', 'while', 'in', 'is', 'not', 'and', 'or', 'break', 'continue',
      'pass', 'lambda', 'with', 'try', 'except', 'finally', 'raise', 'assert',
      'global', 'nonlocal', 'del', 'yield', 'async', 'await', 'true', 'false',
      'none', 'self', 'print', 'range', 'len', 'input', 'list', 'dict', 'set',
      'tuple', 'str', 'int', 'float', 'open', '==', '!=', '->', ':=', '**', '//'
    ]
  },
  {
    name: 'RUBY', abbr: 'Rb', color: '#cc342d', target: 680, timeMult: 0.97,
    words: [
      'def', 'end', 'puts', 'gets', 'class', 'module', 'require', 'include',
      'attr_accessor', 'initialize', 'new', 'nil', 'true', 'false', 'self',
      'if', 'unless', 'elsif', 'else', 'then', 'case', 'when', 'while',
      'until', 'for', 'do', 'begin', 'rescue', 'ensure', 'raise', 'yield',
      'return', 'break', 'next', 'redo', 'retry', 'lambda', 'proc', 'each',
      'map', 'select', 'chomp', 'to_s', 'to_i', '=>', '<=>', '<<'
    ]
  },
  {
    name: 'JAVASCRIPT', abbr: 'JS', color: '#f7df1e', dark: true, target: 710, timeMult: 0.94,
    words: [
      'var', 'let', 'const', 'function', 'return', 'if', 'else', 'switch',
      'case', 'default', 'for', 'while', 'do', 'break', 'continue', 'new',
      'this', 'typeof', 'instanceof', 'class', 'extends', 'super', 'import',
      'export', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'delete',
      'void', 'in', 'of', 'yield', 'static', 'get', 'set', 'null', 'undefined',
      'true', 'false', 'console', 'document', 'window', 'map', 'filter',
      'reduce', 'push', 'foreach', 'promise', 'then', 'fetch', 'json',
      '=>', '===', '!==', '...', '&&', '||', '??'
    ]
  },
  {
    name: 'LUA', abbr: 'Lua', color: '#51a0cf', target: 740, timeMult: 0.91,
    words: [
      'local', 'function', 'end', 'if', 'then', 'else', 'elseif', 'for',
      'while', 'do', 'repeat', 'until', 'break', 'return', 'nil', 'true',
      'false', 'and', 'or', 'not', 'in', 'pairs', 'ipairs', 'print', 'table',
      'string', 'math', 'require', 'tostring', 'tonumber', 'type', 'self',
      'insert', 'remove', 'concat', '..', '~=', '#'
    ]
  },
  {
    name: 'PHP', abbr: 'php', color: '#8993be', target: 770, timeMult: 0.88,
    words: [
      'echo', 'print', 'function', 'class', 'public', 'private', 'protected',
      'static', 'new', 'this', 'extends', 'implements', 'interface',
      'namespace', 'use', 'require', 'include', 'isset', 'unset', 'empty',
      'array', 'foreach', 'as', 'if', 'else', 'elseif', 'while', 'for',
      'switch', 'case', 'break', 'continue', 'return', 'try', 'catch',
      'finally', 'throw', 'null', 'true', 'false', 'abstract', 'final',
      'const', 'global', 'list', '->', '=>', '===', '.='
    ]
  },
  {
    name: 'TYPESCRIPT', abbr: 'TS', color: '#3178c6', target: 800, timeMult: 0.85,
    words: [
      'interface', 'type', 'enum', 'implements', 'extends', 'readonly',
      'private', 'public', 'protected', 'abstract', 'namespace', 'declare',
      'keyof', 'typeof', 'infer', 'never', 'unknown', 'any', 'string',
      'number', 'boolean', 'void', 'null', 'undefined', 'as', 'satisfies',
      'async', 'await', 'const', 'let', 'function', 'return', 'class', 'new',
      'import', 'export', 'default', 'generic', 'partial', 'record', 'pick',
      'omit', '=>', '?.', '??', '<>'
    ]
  },
  {
    name: 'JAVA', abbr: 'J', color: '#e76f00', target: 830, timeMult: 0.82,
    words: [
      'public', 'private', 'protected', 'static', 'final', 'void', 'class',
      'interface', 'extends', 'implements', 'abstract', 'new', 'this',
      'super', 'return', 'if', 'else', 'switch', 'case', 'default', 'for',
      'while', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw',
      'throws', 'import', 'package', 'int', 'long', 'short', 'byte', 'char',
      'boolean', 'float', 'double', 'string', 'enum', 'instanceof',
      'synchronized', 'volatile', 'transient', 'native', 'null', 'true',
      'false', 'main', 'system', 'println', 'record', 'sealed'
    ]
  },
  {
    name: 'C#', abbr: 'C#', color: '#9b4f96', target: 860, timeMult: 0.79,
    words: [
      'using', 'namespace', 'class', 'struct', 'interface', 'enum', 'public',
      'private', 'protected', 'internal', 'static', 'readonly', 'const',
      'void', 'var', 'string', 'int', 'bool', 'double', 'decimal', 'new',
      'this', 'base', 'virtual', 'override', 'abstract', 'sealed', 'async',
      'await', 'return', 'if', 'else', 'switch', 'case', 'foreach', 'in',
      'while', 'do', 'break', 'continue', 'try', 'catch', 'finally', 'throw',
      'null', 'true', 'false', 'get', 'set', 'event', 'delegate', 'record',
      'console', 'writeline', 'linq', '=>', '??', '?.'
    ]
  },
  {
    name: 'GO', abbr: 'Go', color: '#00add8', target: 890, timeMult: 0.76,
    words: [
      'package', 'import', 'func', 'var', 'const', 'type', 'struct',
      'interface', 'map', 'chan', 'go', 'defer', 'select', 'range', 'return',
      'if', 'else', 'for', 'switch', 'case', 'default', 'break', 'continue',
      'fallthrough', 'goto', 'nil', 'true', 'false', 'make', 'new', 'len',
      'cap', 'append', 'copy', 'panic', 'recover', 'println', 'fmt', 'main',
      'error', 'string', 'int', 'bool', ':=', '<-', '=='
    ]
  },
  {
    name: 'BASH', abbr: '>_', color: '#4eaa25', target: 920, timeMult: 0.73,
    words: [
      'echo', 'read', 'if', 'then', 'else', 'elif', 'fi', 'for', 'while',
      'do', 'done', 'case', 'esac', 'function', 'local', 'export', 'source',
      'alias', 'cd', 'ls', 'pwd', 'grep', 'sed', 'awk', 'cat', 'chmod',
      'chown', 'sudo', 'exit', 'return', 'break', 'continue', 'shift',
      'eval', 'exec', 'trap', 'set', 'unset', 'test', 'sleep', 'kill',
      'touch', 'mkdir', 'curl', 'tar', '&&', '||', '>>', '|', '$?'
    ]
  },
  {
    name: 'SQL', abbr: 'SQL', color: '#e38c00', target: 950, timeMult: 0.70,
    words: [
      'select', 'from', 'where', 'insert', 'into', 'values', 'update',
      'delete', 'create', 'table', 'alter', 'drop', 'join', 'inner', 'left',
      'right', 'outer', 'on', 'group', 'by', 'having', 'order', 'limit',
      'offset', 'distinct', 'union', 'primary', 'key', 'foreign', 'index',
      'view', 'and', 'or', 'not', 'null', 'count', 'sum', 'avg', 'min',
      'max', 'between', 'like', 'in', 'as', 'exists', 'begin', 'commit',
      'rollback', 'grant', 'revoke'
    ]
  },
  {
    name: 'KOTLIN', abbr: 'Kt', color: '#7f52ff', target: 980, timeMult: 0.67,
    words: [
      'fun', 'val', 'var', 'class', 'object', 'interface', 'data', 'sealed',
      'open', 'override', 'abstract', 'companion', 'init', 'constructor',
      'when', 'is', 'in', 'if', 'else', 'for', 'while', 'do', 'return',
      'break', 'continue', 'null', 'true', 'false', 'this', 'super',
      'package', 'import', 'lateinit', 'lazy', 'suspend', 'inline',
      'reified', 'vararg', 'println', 'listof', 'mapof', 'let', 'also',
      'apply', 'run', 'with', '?:', '!!', '?.'
    ]
  },
  {
    name: 'SWIFT', abbr: 'Sw', color: '#f05138', target: 1010, timeMult: 0.64,
    words: [
      'func', 'var', 'let', 'class', 'struct', 'enum', 'protocol',
      'extension', 'guard', 'defer', 'if', 'else', 'switch', 'case',
      'default', 'for', 'in', 'while', 'repeat', 'return', 'break',
      'continue', 'import', 'init', 'deinit', 'self', 'super', 'nil',
      'true', 'false', 'some', 'any', 'try', 'catch', 'throws', 'async',
      'await', 'actor', 'lazy', 'weak', 'static', 'final', 'private',
      'public', 'print', 'mutating', '??', '->', '?.'
    ]
  },
  {
    name: 'C', abbr: 'C', color: '#5c6bc0', target: 1040, timeMult: 0.61,
    words: [
      'include', 'stdio', 'main', 'printf', 'scanf', 'int', 'char', 'float',
      'double', 'void', 'long', 'short', 'unsigned', 'signed', 'struct',
      'union', 'enum', 'typedef', 'static', 'extern', 'const', 'volatile',
      'register', 'sizeof', 'malloc', 'calloc', 'realloc', 'free', 'return',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
      'break', 'continue', 'goto', 'null', 'define', 'ifdef', 'endif',
      '->', '&&', '||', '++', '--', '=='
    ]
  },
  {
    name: 'C++', abbr: 'C++', color: '#659ad2', target: 1070, timeMult: 0.58,
    words: [
      'include', 'iostream', 'using', 'namespace', 'std', 'cout', 'cin',
      'endl', 'int', 'char', 'bool', 'float', 'double', 'void', 'long',
      'class', 'struct', 'union', 'enum', 'public', 'private', 'protected',
      'virtual', 'friend', 'inline', 'template', 'typename', 'new', 'delete',
      'const', 'constexpr', 'static', 'extern', 'auto', 'nullptr', 'this',
      'operator', 'sizeof', 'typedef', 'return', 'if', 'else', 'for',
      'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch',
      'throw', 'vector', 'string', 'unique_ptr', 'shared_ptr',
      '::', '->', '<<', '>>', '++', '=='
    ]
  },
  {
    name: 'RUST', abbr: 'Rs', color: '#f74c00', target: 1100, timeMult: 0.55,
    words: [
      'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl',
      'trait', 'pub', 'mod', 'use', 'crate', 'self', 'super', 'match', 'if',
      'else', 'loop', 'while', 'for', 'in', 'break', 'continue', 'return',
      'move', 'ref', 'box', 'dyn', 'unsafe', 'where', 'type', 'as', 'async',
      'await', 'some', 'none', 'ok', 'err', 'result', 'option', 'vec',
      'string', 'println', 'main', 'true', 'false', 'i32', 'u32', 'f64',
      'usize', 'str', 'clone', 'derive', 'borrow', 'lifetime',
      '->', '=>', '::', '&&', '&mut'
    ]
  },
  {
    name: 'HASKELL', abbr: 'λ', color: '#5e5086', target: 1130, timeMult: 0.52,
    words: [
      'module', 'where', 'import', 'data', 'type', 'newtype', 'class',
      'instance', 'deriving', 'let', 'in', 'case', 'of', 'do', 'if', 'then',
      'else', 'otherwise', 'main', 'putstrln', 'getline', 'show', 'read',
      'map', 'filter', 'foldr', 'foldl', 'zip', 'head', 'tail', 'length',
      'reverse', 'pure', 'return', 'maybe', 'just', 'nothing', 'either',
      'monad', 'functor', 'guard', 'lambda', 'curry', 'flip',
      '->', '=>', '::', '<-', '>>=', '<$>', '++'
    ]
  },
  {
    name: 'ASSEMBLY', abbr: 'ASM', color: '#8a8a8a', target: 1170, timeMult: 0.50,
    words: [
      'mov', 'add', 'sub', 'mul', 'div', 'inc', 'dec', 'jmp', 'je', 'jne',
      'jz', 'jnz', 'jg', 'jl', 'jge', 'jle', 'cmp', 'test', 'push', 'pop',
      'call', 'ret', 'int', 'lea', 'xor', 'and', 'or', 'not', 'neg', 'shl',
      'shr', 'rol', 'ror', 'nop', 'loop', 'eax', 'ebx', 'ecx', 'edx', 'esi',
      'edi', 'esp', 'ebp', 'rax', 'rbx', 'byte', 'word', 'dword', 'qword',
      'section', 'global', 'extern', 'db', 'dw', 'dd'
    ]
  }
];
