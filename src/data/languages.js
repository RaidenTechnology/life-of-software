// Language ladder — 25 languages ordered by learning difficulty, easiest first.
// All entries lowercase; input is lowercased before comparison.
// Operators/punctuation ("==", "=>", "::", "%>%") count as patterns too.
// target/timeMult are computed at the bottom of this file — timeMult from ladder
// position, target from ladder position AND what the list's own patterns pay.
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

// The per-word time bonus shrinks as you climb the ladder. Level targets are
// computed further down, after the rules below are attached — a rule changes
// what a pattern PAYS, so it has to be known before a target can be derived
// from it. (See "difficulty curve: level targets".)
LANGUAGES.forEach((lang, i) => {
  lang.timeMult = Math.max(0.5, +(1 - i * 0.02).toFixed(2));
});

// --- per-language rules ---
//
// Twenty-five levels of "type this language's words" is twenty-five levels of
// the same level. The word lists differ; the ACT doesn't. A rule gives a
// handful of them a character you have to play around instead of through, and
// it's drawn from what the language is actually like to write:
//
//   verbose   long patterns pay more (Java's ceremony is worth something here)
//   terse     short patterns pay more (APL-ish languages, ASM mnemonics)
//   strict    a wrong pattern costs 3 seconds (compilers that don't forgive)
//   volatile  patterns deprecate twice as fast (the churn languages)
//   legacy    the clock drains 25% faster (running on old iron)
//
// Deliberately only on 9 of 25: a rule everywhere is a rule nowhere, and the
// plain levels are what make a ruled one read as different. GameScene reads
// `rule` and shows the blurb in the HUD when the level opens.
const LANG_RULES = {
  strict:   { label: 'STRICT COMPILER', desc: 'a wrong pattern costs 3s' },
  verbose:  { label: 'VERBOSE',         desc: 'patterns 6+ chars pay 1.5x' },
  terse:    { label: 'TERSE',           desc: 'patterns under 4 chars pay 2x' },
  volatile: { label: 'MOVES FAST',      desc: 'patterns deprecate twice as fast' },
  legacy:   { label: 'LEGACY SYSTEM',   desc: 'the clock drains 25% faster' }
};

Object.entries({
  JAVA: 'verbose', 'C#': 'verbose', TYPESCRIPT: 'verbose',
  BASH: 'terse', ASSEMBLY: 'terse', C: 'terse',
  RUST: 'strict', HASKELL: 'strict',
  JAVASCRIPT: 'volatile', FLUTTER: 'volatile',
  PERL: 'legacy'
}).forEach(([name, rule]) => {
  const lang = LANGUAGES.find(l => l.name === name);
  if (lang) lang.rule = rule;
});

// --- difficulty curve: level targets ---
//
// Every language used to ask for a flat 500 points, and that is a fairness bug,
// because points scale with PATTERN LENGTH: GameScene pays w.length * 10 * combo
// * the rule's payout. A flat target therefore asks a language of long patterns
// for far fewer patterns than a language of short ones. Measured against the
// real scoring path (random typing order, 400 shuffles per language, stage 0):
//
//   JAVA / TYPESCRIPT cleared in 5.9 patterns   (mean length 5.7, and `verbose`
//                                                pays them another 1.5x on top)
//   HTML / PYTHON     cleared in 8.7 patterns   (mean length 4.1)
//
// — a 1.48x spread with nothing behind it but word-list vocabulary, which is
// exactly the "some levels go in 3 patterns, some take 6" a player reported.
// Best case it was worse: 4 patterns for JAVA against 7 for ASSEMBLY. Worse
// still, ladder position contributed NOTHING to the target, so within a stage
// the ramp was pure noise — HTML (position 0) was the joint-hardest level and
// JAVA (position 10) the easiest.
//
// So a target is now derived from what the language's own patterns are worth:
//
//   target = meanPay * COMBO_UNITS(patternsWanted(ladderPosition))
//
// meanPay is the average payout of one pattern from THIS list (length x 10,
// times the rule multiplier the level will actually apply). COMBO_UNITS turns a
// pattern COUNT into the point total those patterns bank, honouring GameScene's
// combo ladder. Invert it and every language costs the same number of patterns
// at the same ladder position — the vocabulary stops deciding the difficulty
// and the ladder position starts.
//
// The stage multiplier in targetScore() (1.0 -> 3.5, plus 0.5 a survival lap)
// still scales all of this, so the run-long ramp is untouched; this only fixes
// the accidental noise underneath it.
const RULE_PAY = (rule, len) =>
  (rule === 'verbose' && len >= 6) ? 1.5 :
  (rule === 'terse' && len < 4) ? 2 : 1;

// Points banked after n patterns, in units of one average pattern's payout.
// Mirrors GameScene.comboMult() exactly, including that combo++ happens BEFORE
// the pattern is scored: patterns 1-4 pay x1, 5-14 pay x2, 15+ pay x3. Written
// for fractional n so the ladder ramp below doesn't have to be whole patterns.
const COMBO_UNITS = n =>
  Math.min(n, 4) + 2 * Math.max(0, Math.min(n, 14) - 4) + 3 * Math.max(0, n - 14);

// The ladder ramp, in patterns, at stage VERY EASY: 6 at HTML, 8 at ASSEMBLY,
// a straight line between. Kept deliberately gentle — the run's real difficulty
// ramp is the stage multiplier and the shrinking timeMult above, and a level is
// a 6-to-8-pattern beat by design. The old flat target averaged 7.4 patterns, so
// the ladder as a whole is paced the same; it's simply no longer random which
// language is the quick one.
const PATTERNS_FIRST = 6, PATTERNS_LAST = 8;

LANGUAGES.forEach((lang, i) => {
  const meanPay = lang.words.reduce(
    (sum, w) => sum + w.length * 10 * RULE_PAY(lang.rule, w.length), 0) / lang.words.length;
  const wanted = PATTERNS_FIRST +
    (PATTERNS_LAST - PATTERNS_FIRST) * (i / (LANGUAGES.length - 1));
  // Round to 10 so the HUD's "target N" reads like a score, not a measurement,
  // and so it survives targetScore()'s own /10 rounding unchanged.
  lang.target = Math.round(meanPay * COMBO_UNITS(wanted) / 10) * 10;
});

// Targets now span 320 (HTML) to 730 (TYPESCRIPT/JAVA) instead of a flat 500,
// and that spread is the point: TYPESCRIPT's patterns are worth ~1.9x HTML's, so
// it must ask for ~1.9x the points to cost the same number of patterns.
//
// Re-measured the same way (400 random typing orders per language per stage),
// patterns-to-clear now tracks the ladder instead of the vocabulary:
//
//                       before (flat 500)        after
//   VERY EASY   7.6 -> 7.4, noise +-1.66     6.5 -> 8.5, noise +-0.15
//   MEDIUM     11.6 ->11.4, noise +-3.22     9.7 ->13.3, noise +-0.14
//   HARD       13.9 ->13.7, noise +-3.70    11.9 ->15.6, noise +-1.85
//
// ("noise" = worst deviation from the ladder's own trend line. Before, the trend
// was FLAT — it even sagged slightly — so every one of those patterns of
// deviation was somebody's level being randomly short or long.)
//
// Headroom against targetScore()'s ceiling (a target is capped at 70% of the
// list's un-multiplied point pool so it can never outrun the word list): every
// target here clears the ceiling through MEDIUM, most at half of it or less. LUA
// — the smallest pool at 38 patterns, and the list that used to dead-end — sits
// at 58% of its ceiling at MEDIUM and 91% at VERY HARD.
//
// One residual, and it is not this file's to fix: the ceiling is computed from
// raw pattern length and ignores the rule payout, so a `terse` list whose short
// patterns all pay 2x can earn far more than the ceiling believes exists.
// ASSEMBLY (smallest pool of the three terse lists) is therefore the one target
// that runs tight — 96% of its ceiling at MEDIUM, capped from HARD upward, where
// it clears in 13.7 patterns against the 15.6 its ladder position asks for.
// Fixing it properly means teaching livePool()/targetScore() in GameScene.js
// about RULE_PAY; clamping harder here would only trade a fault at HARD+ for a
// worse one at VERY EASY, where the levels are actually played.

// --- growth-festival signatures ---
//
// The growth round asks "which language is this pattern from?" — and for most of
// the ladder that question has no honest answer. 837 of the 1276 patterns here
// appear in more than one list, and the ones that don't are often worse: `tuple`
// lives only in PYTHON's list, so a player who answered C++ (std::tuple, right
// there in the standard library) was told they were wrong. The question the game
// was really asking was "which of our hand-written arrays contains this string",
// which is not a question anyone can fairly answer.
//
// So the round now draws ONLY from these: patterns that genuinely belong to one
// language and would not be claimed by another. Keywords with no equivalent
// elsewhere (`elif`, `deriving`, `impl`), the language's own sigils (`>>=`,
// `<?php`, `%>%`), its stdlib's distinctive names (`putstrln`, `console`), its
// tooling (`cargo`, `pip`). Anything a working programmer could reasonably put
// in two columns is out, however tempting: no `class`, no `map`, no `tuple`.
//
// Validated at load below: every signature must exist in its own language's word
// list and in no other. A language with none simply doesn't appear in growth
// rounds — better a smaller pool than an unfair question.
const LANG_SIGNATURES = {
  HTML:       ['doctype', 'iframe', 'textarea', 'href'],
  CSS:        ['z-index', 'rgba', 'vh', 'vw'],
  PYTHON:     ['nonlocal', 'pass', 'except', 'dict'],
  JAVASCRIPT: ['document', 'window', 'promise', 'fetch'],
  LUA:        ['ipairs', 'pairs', 'tostring', 'tonumber'],
  RUBY:       ['puts', 'attr_accessor', 'rescue', 'to_s'],
  PHP:        ['isset', 'empty', '.='],
  SQL:        ['having', 'distinct', 'inner', 'rollback'],
  DART:       ['mixin', 'factory', 'late', 'required'],
  TYPESCRIPT: ['keyof', 'infer', 'satisfies', 'declare'],
  JAVA:       ['synchronized', 'transient', 'native'],
  KOTLIN:     ['companion', 'lateinit', 'reified', 'suspend'],
  'C#':       ['linq', 'delegate', 'writeline'],
  FLUTTER:    ['scaffold', 'stateless', 'stateful', 'appbar'],
  SWIFT:      ['deinit', 'mutating', 'protocol'],
  GO:         ['chan', 'fallthrough', 'fmt', 'recover'],
  BASH:       ['chmod', 'sudo', 'awk', 'esac'],
  PERL:       ['qw', 'bless', 'wantarray', '=~'],
  R:          ['%>%', 'ggplot', 'dplyr', 'data.frame'],
  C:          ['printf', 'malloc', 'stdio', 'scanf'],
  'C++':      ['cout', 'endl', 'iostream', 'nullptr'],
  ZIG:        ['comptime', 'errdefer', 'anytype', 'orelse'],
  RUST:       ['impl', 'crate', 'dyn', '&mut'],
  HASKELL:    ['putstrln', 'deriving', 'newtype', '>>='],
  ASSEMBLY:   ['mov', 'eax', 'jmp', 'nop']
};

// Keep only signatures that are real: present in their own language's list, and
// in nobody else's. A typo or a word that quietly appears in a second list would
// otherwise put the exact unfair question back on screen.
LANGUAGES.forEach(lang => {
  const sigs = LANG_SIGNATURES[lang.name] || [];
  lang.signatures = sigs.filter(w =>
    lang.words.includes(w) &&
    LANGUAGES.every(o => o === lang || !o.words.includes(w)));
});
