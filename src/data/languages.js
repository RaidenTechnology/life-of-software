// Language ladder — 25 languages ordered by learning difficulty, easiest first.
// All entries lowercase; input is lowercased before comparison.
// Operators/punctuation ("==", "=>", "::", "%>%") count as patterns too.
// target/timeMult are computed from ladder position at the bottom of this file.
// dark: true → badge abbreviation is drawn dark (for light badge colors).

const LANGUAGES = [
  {
    name: 'HTML', abbr: '<>', icon: '</>', color: '#e34c26',
    words: [
      'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style',
      'div', 'span', 'p', 'a', 'img', 'href', 'src', 'alt', 'class', 'id',
      'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button',
      'label', 'select', 'option', 'textarea', 'header', 'footer', 'nav',
      'section', 'article', 'main', 'aside', 'h1', 'h2', 'h3', 'br', 'hr',
      'strong', 'em', 'iframe', 'canvas', 'video', 'audio', 'doctype'
    ]
  },
  {
    name: 'CSS', abbr: 'CSS', icon: '🎨', color: '#264de4',
    words: [
      'color', 'background', 'margin', 'padding', 'border', 'width', 'height',
      'display', 'flex', 'grid', 'position', 'absolute', 'relative', 'fixed',
      'sticky', 'float', 'clear', 'font', 'hover', 'focus', 'active',
      'before', 'after', 'transform', 'transition', 'animation', 'opacity',
      'z-index', 'overflow', 'cursor', 'align', 'justify', 'gap', 'rem',
      'vh', 'vw', 'rgba', 'calc', 'media', 'important', 'inherit', 'initial',
      'none', 'auto', 'block', 'inline', 'hidden', 'root', 'var'
    ]
  },
  {
    name: 'PYTHON', abbr: 'Py', icon: '🐍', color: '#4b8bbe',
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
    name: 'JAVASCRIPT', abbr: 'JS', icon: 'JS', color: '#f7df1e', dark: true,
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
    name: 'LUA', abbr: 'Lua', icon: '🌙', color: '#51a0cf',
    words: [
      'local', 'function', 'end', 'if', 'then', 'else', 'elseif', 'for',
      'while', 'do', 'repeat', 'until', 'break', 'return', 'nil', 'true',
      'false', 'and', 'or', 'not', 'in', 'pairs', 'ipairs', 'print', 'table',
      'string', 'math', 'require', 'tostring', 'tonumber', 'type', 'self',
      'insert', 'remove', 'concat', '..', '~=', '#'
    ]
  },
  {
    name: 'RUBY', abbr: 'Rb', icon: '💎', color: '#cc342d',
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
    name: 'PHP', abbr: 'php', icon: '🐘', color: '#8993be',
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
    name: 'SQL', abbr: 'SQL', icon: '🗃', color: '#e38c00',
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
    name: 'DART', abbr: 'Dt', icon: '🎯', color: '#0175c2',
    words: [
      'void', 'main', 'var', 'final', 'const', 'int', 'double', 'num',
      'string', 'bool', 'list', 'map', 'set', 'dynamic', 'class', 'extends',
      'implements', 'with', 'mixin', 'abstract', 'factory', 'static', 'new',
      'this', 'super', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw',
      'async', 'await', 'future', 'stream', 'yield', 'null', 'true', 'false',
      'print', 'late', 'required', 'get', 'is', 'as',
      '=>', '??', '?.', '..'
    ]
  },
  {
    name: 'TYPESCRIPT', abbr: 'TS', icon: 'TS', color: '#3178c6',
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
    name: 'JAVA', abbr: 'J', icon: '☕', color: '#e76f00',
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
    name: 'KOTLIN', abbr: 'Kt', icon: 'K', color: '#7f52ff',
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
    name: 'C#', abbr: 'C#', icon: 'C#', color: '#9b4f96',
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
    name: 'FLUTTER', abbr: 'Fl', icon: '🦋', color: '#54c5f8', dark: true,
    words: [
      'widget', 'stateless', 'stateful', 'state', 'setstate', 'build',
      'context', 'scaffold', 'appbar', 'container', 'column', 'row', 'text',
      'center', 'padding', 'expanded', 'flexible', 'stack', 'positioned',
      'listview', 'gridview', 'sizedbox', 'icon', 'image', 'card', 'divider',
      'drawer', 'snackbar', 'dialog', 'theme', 'material', 'cupertino',
      'navigator', 'route', 'push', 'pop', 'animation', 'controller',
      'builder', 'future', 'stream', 'provider', 'align', 'wrap', 'key',
      'child', 'children', 'hero', 'inkwell', 'gesture'
    ]
  },
  {
    name: 'SWIFT', abbr: 'Sw', icon: '🐦', color: '#f05138',
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
    name: 'GO', abbr: 'Go', icon: '🐹', color: '#00add8',
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
    name: 'BASH', abbr: '>_', icon: '>_', color: '#4eaa25',
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
    name: 'PERL', abbr: 'Pl', icon: '🐪', color: '#39457e',
    words: [
      'my', 'our', 'local', 'sub', 'use', 'package', 'require', 'print',
      'chomp', 'if', 'elsif', 'else', 'unless', 'while', 'until', 'for',
      'foreach', 'do', 'last', 'next', 'redo', 'return', 'die', 'warn',
      'defined', 'undef', 'shift', 'push', 'pop', 'splice', 'split', 'join',
      'grep', 'sort', 'keys', 'values', 'each', 'scalar', 'wantarray',
      'bless', 'ref', 'qw', 'eq', 'ne', '=~', '->', '=>', '<=>'
    ]
  },
  {
    name: 'R', abbr: 'R', icon: 'R', color: '#276dc3',
    words: [
      'function', 'return', 'if', 'else', 'for', 'while', 'repeat', 'break',
      'next', 'library', 'require', 'print', 'cat', 'paste', 'vector',
      'matrix', 'list', 'factor', 'mean', 'median', 'sum', 'length', 'names',
      'null', 'na', 'true', 'false', 'apply', 'sapply', 'lapply', 'ggplot',
      'dplyr', 'filter', 'mutate', 'select', 'summary', 'plot', 'hist',
      'data.frame', 'rnorm', 'seq', 'rep', '<-', '%>%', '%in%'
    ]
  },
  {
    name: 'C', abbr: 'C', icon: 'C', color: '#5c6bc0',
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
    name: 'C++', abbr: 'C++', icon: 'C++', color: '#659ad2',
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
    name: 'ZIG', abbr: 'Zg', icon: '⚡', color: '#f7a41d', dark: true,
    words: [
      'fn', 'pub', 'const', 'var', 'comptime', 'inline', 'export', 'extern',
      'struct', 'enum', 'union', 'error', 'defer', 'errdefer', 'try',
      'catch', 'if', 'else', 'switch', 'while', 'for', 'break', 'continue',
      'return', 'unreachable', 'undefined', 'null', 'true', 'false', 'void',
      'usize', 'u8', 'u32', 'i32', 'f64', 'bool', 'anytype', 'test',
      'orelse', 'and', 'or', 'packed', 'align', 'volatile', 'std'
    ]
  },
  {
    name: 'RUST', abbr: 'Rs', icon: '🦀', color: '#f74c00',
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
    name: 'HASKELL', abbr: 'λ', icon: 'λ', color: '#5e5086',
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
    name: 'ASSEMBLY', abbr: 'ASM', icon: '⚙', color: '#8a8a8a',
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

// Difficulty curve, one place to tune: every level needs 500 points; the
// per-word time bonus shrinks as you climb the ladder.
LANGUAGES.forEach((lang, i) => {
  lang.target = 500;
  lang.timeMult = Math.max(0.5, +(1 - i * 0.02).toFixed(2));
});
