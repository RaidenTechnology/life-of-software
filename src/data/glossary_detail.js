// Deep glossary — the second layer behind the code-review card.
//
// glossary.js answers "what is this word" in one line, because that card is
// read in a few seconds between levels. Some players want more than a few
// seconds. DETAILED opens this file: a longer explanation (what problem the
// thing solves, when you reach for it, what people get wrong) and several
// real snippets ordered simplest-first.
//
// Same two-layer shape as glossary.js, same precedence:
//   D_SHARED  word -> { long, examples[] }              cross-language
//   D_LANG    LANG -> { word -> { long, examples[] } }  wins over shared
//
// get() returns null when there is no deep entry, and the DETAILED button is
// only drawn when it returns non-null — a missing entry costs nothing, a wrong
// one is a lie on screen. So: no filler. If a word is not here, it is because
// nothing true and useful could be said in four sentences, not because the
// list ran out.

const D_SHARED = {
  // ------------------------------------------------------------------
  // control flow
  // ------------------------------------------------------------------
  'if': {
    long: "The fork in the road: the block runs only when the condition is true, and otherwise the program walks straight past it. You reach for it the moment a value can be in two states you must treat differently. The mistake nearly everyone makes at least once is writing a single = (assignment) where they meant == (comparison), which in the C family quietly succeeds and makes the branch always taken.",
    examples: [
      'if (hp <= 0) {\n  gameOver();\n}',
      'if score > best:\n    best = score',
      'if err != nil {\n\treturn err\n}'
    ]
  },
  'else': {
    long: "Everything the if did not catch. It earns its place when the two branches are equal partners; when one of them is just 'give up and leave', an early return usually reads better than an else. The classic trap in C-family languages is the dangling else: without braces it binds to the NEAREST if, not the one your indentation suggests.",
    examples: [
      'if (ready) start();\nelse wait();',
      'if hp > 0:\n    fight()\nelse:\n    respawn()',
      '// the else belongs to the INNER if:\nif (a)\n  if (b) x();\nelse y();'
    ]
  },
  'elif': {
    long: "A flat chain of conditions instead of a staircase of nested ifs. Python, Bash and PHP spell it elif; most other languages just write else if. Each test is only reached once every test above it has failed, so order matters — put the narrowest condition first, or a broader one above will swallow it.",
    examples: [
      'if hp > 60:\n    status = "fine"\nelif hp > 20:\n    status = "hurt"\nelse:\n    status = "critical"',
      'if [ "$1" = build ]; then\n  make\nelif [ "$1" = test ]; then\n  make test\nfi'
    ]
  },
  'switch': {
    long: "One value, many named destinations. It reads better than a long if/else chain when you are comparing the SAME expression against constants, and compilers can turn it into a jump table instead of a run of tests. In C, Java and JavaScript a case falls through into the next one unless you write break, which is the single most common switch bug ever shipped.",
    examples: [
      'switch (key) {\n  case "w": up(); break;\n  case "s": down(); break;\n  default: idle();\n}',
      'switch cmd {\ncase "build":\n\tbuild()\ncase "test":\n\ttest()\n}   // Go: no break needed'
    ]
  },
  'case': {
    long: "One arm of a switch: a constant to compare against, and what to do when it matches. Because it only tests equality, anything involving a range or a computed condition belongs in an if — except in Ruby and Kotlin, where the arms are much richer. Stacking several labels with no body between them is the deliberate way to say 'all of these do the same thing'.",
    examples: [
      'case 1:\ncase 2:\n  cheap();\n  break;',
      "case 'q':\n  quit();\n  break;",
      'case n\nwhen 1..5 then "low"\nwhen 6..9 then "high"\nend   # Ruby: ranges'
    ]
  },
  'default': {
    long: "The arm a switch takes when nothing matched. Leaving it out means an unexpected value silently does nothing at all, and that is the kind of bug that hides for months. In languages with real pattern matching the compiler can force you to handle every variant, and there a catch-all is often a way of switching that safety off rather than a safety net.",
    examples: [
      'default:\n  console.warn("unknown key", key);\n  break;',
      'default:\n  return "unknown";'
    ]
  },
  'for': {
    long: "The loop for when you already know what you are walking over: a count, a range, or the items of a collection. The C-style three-part header (init; test; step) is the old shape; most modern code uses the for-each form because it cannot run off the end. The classic bug is off-by-one from <= where you meant <, and the subtler one is changing a collection while you iterate it.",
    examples: [
      'for (let i = 0; i < xs.length; i++) draw(xs[i]);',
      'for name in players:\n    greet(name)',
      'for i, v := range xs {\n\tfmt.Println(i, v)\n}'
    ]
  },
  'while': {
    long: "Repeat as long as a condition holds, with no idea in advance how many turns that takes: read until end of file, poll until ready, run until the player quits. Something in the body has to move the condition toward false or the loop never ends. If you can say the same thing as a for over a range, prefer for — it makes the ending visible.",
    examples: [
      'while (running) {\n  tick();\n  draw();\n}',
      'while stack:\n    node = stack.pop()\n    visit(node)',
      'while read -r line; do\n  echo "$line"\ndone < log.txt'
    ]
  },
  'do': {
    long: "Runs the body once BEFORE testing the condition, so you always get at least one turn. It is the right shape when the test only makes sense after a first attempt — read a character, then check whether it was the end. It is rare in practice, and in C and JavaScript people forget that the closing while needs a semicolon after it.",
    examples: [
      'do {\n  roll = rand(6);\n} while (roll === last);',
      'do {\n  c = getchar();\n  count++;\n} while (c != EOF);',
      'repeat {\n    tick()\n} while alive   // Swift spells it repeat'
    ]
  },
  'break': {
    long: "Leave the loop right now, skipping the rest of the body and the next condition check. It is how you stop a search the instant you find what you wanted, instead of walking the remaining thousand items. It only escapes the INNERMOST loop, which surprises everyone writing nested loops the first time; languages with labelled breaks let you name the loop you actually meant.",
    examples: [
      'for (const p of players) {\n  if (p.id === id) { found = p; break; }\n}',
      'for x in xs:\n    if bad(x):\n        break',
      'outer:\nfor (…) {\n  for (…) {\n    if (done) break outer;\n  }\n}'
    ]
  },
  'continue': {
    long: "Skip the rest of this turn and start the next one. It flattens code that would otherwise wrap the whole body in an if: reject the cases you do not care about at the top, then get on with the real work at one level of indentation. In a hand-written while loop it is a trap — anything below it, including the increment, never runs, and the loop hangs.",
    examples: [
      'for line in f:\n    if line.startswith("#"):\n        continue\n    parse(line)',
      'for (const p of ps) {\n  if (!p.alive) continue;\n  p.update();\n}'
    ]
  },
  'return': {
    long: "Hand a value back to whoever called you and stop the function there. Returning early for the boring cases — the guard-clause style — keeps the interesting path unindented and is nearly always easier to follow than a single return at the bottom. In a function that returns nothing, a bare return is simply an early exit.",
    examples: [
      'function add(a, b) {\n  return a + b;\n}',
      'def find(xs, id):\n    for x in xs:\n        if x.id == id:\n            return x\n    return None',
      'if (!user) return;   // guard clause'
    ]
  },
  'goto': {
    long: "An unconditional jump to a label somewhere else in the same function. It is the ancestor of every loop and if, and structured programming replaced it precisely because code full of jumps cannot be read top to bottom. The one place it survives honestly is C error handling, where a ladder of labels unwinds allocations in reverse; almost everywhere else it is the wrong tool.",
    examples: [
      'if (!buf) goto fail;\nif (!fd) goto fail_buf;\n…\nfail_buf:\n    free(buf);\nfail:\n    return -1;',
      'goto loop_start;'
    ]
  },
  'match': {
    long: "Branches on the SHAPE of a value rather than its equality to a constant, and pulls the pieces out in the same breath. You reach for it when a value is one of several variants: Ok or Err, Some or None, a message enum. In Rust it is exhaustive — miss a variant and the build fails — which is exactly what makes it stronger than a switch.",
    examples: [
      'match maybe {\n    Some(v) => println!("{}", v),\n    None => println!("nothing"),\n}',
      'match msg {\n    Msg::Quit => break,\n    Msg::Move { x, y } => go(x, y),\n}',
      'match n {\n    0 => "zero",\n    1..=9 => "small",\n    _ => "big",\n}'
    ]
  },
  'when': {
    long: "Take this branch only when the extra condition also holds. Ruby uses it for the arms of a case (and its arms can test ranges, types or regexes, not just values); Kotlin makes when a whole switch that is also an expression, so it hands back a value. Written without a subject it is simply a tidy replacement for an if/else-if chain.",
    examples: [
      'case n\nwhen 1..5 then "low"\nwhen Integer then "big"\nend',
      'val status = when {\n    hp > 60 -> "fine"\n    hp > 20 -> "hurt"\n    else -> "critical"\n}'
    ]
  },

  // ------------------------------------------------------------------
  // declaring things
  // ------------------------------------------------------------------
  'var': {
    long: "The oldest and loosest way to say 'here is a name holding a value'. In JavaScript it is function-scoped and hoisted, which is why let and const replaced it; in Kotlin, Dart, Go and C# the same three letters just mean a mutable or type-inferred binding and are perfectly ordinary. Check which var you are reading before you judge it.",
    examples: [
      'var count = 0;',
      'var xs = new List<int>();   // C#: type inferred',
      'var score = 0   // Kotlin: reassignable (val is not)'
    ]
  },
  'let': {
    long: "Declares a binding scoped to the block it sits in, so it disappears at the closing brace instead of leaking through the whole function. In JavaScript it is the mutable partner of const; in Rust and Swift let is the IMMUTABLE default and you opt into change with mut or var. Same keyword, opposite defaults — that is what catches people crossing between the two families.",
    examples: [
      'let i = 0;\ni += 1;',
      'let hp = 100;       // Rust: immutable\nlet mut score = 0;  // reassignable',
      'let name = "raiden"  // Swift: a constant'
    ]
  },
  'const': {
    long: "The NAME cannot be pointed at anything else. That is a promise about the binding, not about the contents: a const array in JavaScript can still be pushed to, and that surprises people constantly. Make it your default in JS and reach for let only where you genuinely reassign, so a reader can tell the two apart at a glance.",
    examples: [
      'const MAX = 100;',
      'const cfg = { fps: 60 };\ncfg.fps = 30;   // fine, the object is mutable\ncfg = {};       // TypeError',
      'const char *name = "raiden";   // C: the characters are read-only'
    ]
  },
  'def': {
    long: "Defines a function in Python and Ruby. The name is just a variable holding the function, so you can pass it around, store it in a dict and call it later. Python has one famous trap here: a default argument is evaluated once, when the def runs, so a mutable default like [] is shared by every call that omits it.",
    examples: [
      'def add(a, b):\n    return a + b',
      'def greet(name, greeting="hi"):\n    print(greeting, name)',
      'def push(x, into=None):\n    into = [] if into is None else into   # never into=[]\n    into.append(x)\n    return into'
    ]
  },
  'fn': {
    long: "The short spelling of function, used by Rust and Zig. Argument types and the return type are written out and never guessed, so the signature alone tells you what goes in and what comes back. In Rust the last expression is the return value when you leave the semicolon off; adding a semicolon turns it into a statement and the function returns nothing.",
    examples: [
      'fn add(a: i32, b: i32) -> i32 {\n    a + b\n}',
      'fn main() {\n    println!("{}", add(1, 2));\n}',
      'pub fn max(a: u32, b: u32) u32 {\n    return if (a > b) a else b;\n}   // Zig'
    ]
  },
  'func': {
    long: "Defines a function in Go and Swift. Go writes the type after the name and lets a function return several values at once, which is how every error in the language travels home. Swift names its parameters at the call site unless you suppress that with an underscore, so calls read like sentences.",
    examples: [
      'func add(a int, b int) int {\n\treturn a + b\n}',
      'func load(p string) ([]byte, error) {\n\treturn os.ReadFile(p)\n}',
      'func add(_ a: Int, to b: Int) -> Int { a + b }\nadd(1, to: 2)'
    ]
  },
  'function': {
    long: "The long spelling, used by JavaScript, PHP, Lua and Bash. A JavaScript function declaration is hoisted, so you can call it above the line that defines it, and it gets its own `this` — which is the entire reason arrow functions exist. In Lua and Bash it is the only shape there is.",
    examples: [
      'function add(a, b) {\n  return a + b;\n}',
      'local function tick(dt)\n  t = t + dt\nend',
      'function build {\n  npm run build\n}'
    ]
  },
  'lambda': {
    long: "A function with no name, written exactly where it is used. It exists for the cases where naming the thing would be noise: a sort key, a callback, a one-line transform. Python's lambda is deliberately limited to a single expression — the moment you want a statement inside it, that is the language telling you to write a def.",
    examples: [
      'sorted(players, key=lambda p: p.hp)',
      'squares = list(map(lambda x: x * x, xs))',
      'total = reduce(lambda a, b: a + b, xs, 0)'
    ]
  },
  'class': {
    long: "A blueprint that ties data and the operations on it together, so callers go through methods instead of poking at fields. You reach for one when several functions all take the same bundle of state as their first argument. The usual mistake is using inheritance to share code: holding an object (composition) survives change far better than extending one.",
    examples: [
      'class Player:\n    def __init__(self, hp):\n        self.hp = hp\n\n    def hit(self, dmg):\n        self.hp -= dmg',
      'class Ship {\n  constructor(hp) { this.hp = hp; }\n  hit(d) { this.hp -= d; }\n}',
      'class Boss extends Enemy {\n  constructor() {\n    super();\n    this.phase = 1;\n  }\n}'
    ]
  },
  'struct': {
    long: "A plain bundle of named fields. In C, Go and Rust it is THE way to describe a record, and behaviour is attached separately rather than being part of the definition. In C# and Swift a struct is a VALUE type — assigning it copies — while a class is shared by reference, and that single difference is the one worth memorising.",
    examples: [
      'struct Point { float x, y; };',
      'type Player struct {\n\tHp   int\n\tName string\n}',
      'struct Ship {\n    hp: u32,\n    name: String,\n}'
    ]
  },
  'enum': {
    long: "A type whose value is exactly one of a fixed, named set: states, directions, error kinds. It beats passing bare strings or ints because a typo becomes a compile error instead of a silent bug, and a switch over it can be checked for completeness. Rust and Swift go further and let each variant carry its own data, which is how Option and Result are built.",
    examples: [
      'enum State { Idle, Firing, Dead }',
      'enum Msg {\n    Quit,\n    Move { x: i32, y: i32 },\n}',
      'enum Color: String {\n    case red = "r"\n    case blue = "b"\n}'
    ]
  },
  'interface': {
    long: "A list of methods with no bodies: any type that has them can be handed to code that asked for the interface. It lets you write against a capability instead of a concrete class, which is what makes implementations swappable and fakes possible in tests. Go is the odd one out and the nicest — a type satisfies an interface implicitly, with no declaration anywhere.",
    examples: [
      'interface Drawable {\n  draw(): void;\n}',
      'type Drawer interface {\n\tDraw()\n}',
      'class Ship implements Drawable {\n  draw() { … }\n}'
    ]
  },
  'protocol': {
    long: "Swift's word for an interface: the methods, properties and initialisers a type promises to provide. A type declares conformance in its definition, and an extension can supply a default implementation so conformers only write what actually differs. The Swift habit is to describe the capability first and only then pick struct, class or enum to satisfy it.",
    examples: [
      'protocol Drawable {\n    func draw()\n}',
      'struct Ship: Drawable {\n    func draw() { print("ship") }\n}',
      'extension Drawable {\n    func draw() { print("nothing to draw") }\n}'
    ]
  },
  'trait': {
    long: "Shared behaviour a type opts into after the fact — you can implement your own trait for a type somebody else wrote. Nothing is copied down a hierarchy the way inheritance does it; the type simply gains the methods. Traits are also how Rust does generics: T: Display means 'any T that implements Display', checked at compile time with no runtime cost.",
    examples: [
      'trait Draw {\n    fn draw(&self);\n}',
      'impl Draw for Ship {\n    fn draw(&self) { println!("ship"); }\n}',
      'fn show<T: Draw>(x: &T) {\n    x.draw();\n}'
    ]
  },
  'module': {
    long: "A named box around related code, so its names do not collide with the rest of the program and you can see what belongs together. Ruby also uses modules as bags of methods to mix into classes, Rust modules form a tree you address with ::, Haskell modules control what leaves the file. The habit worth building is deciding what a module HIDES, not only what it groups.",
    examples: [
      'mod game {\n    pub fn start() {}\n}',
      'module Physics\n  def self.gravity\n    9.8\n  end\nend',
      'module Main (main) where'
    ]
  },
  'package': {
    long: "The namespace a file declares itself to belong to. In Java it mirrors the directory path; in Go every file in a folder shares one package name and `package main` is what makes a program rather than a library. It is also a visibility boundary in both — Go exports a name simply by capitalising it, and keeps everything else inside the package.",
    examples: [
      'package main',
      'package com.raiden.core;',
      'package game\n\nfunc Start() {}   // exported: capital S\nfunc reset() {}   // package-private'
    ]
  },
  'namespace': {
    long: "Stops two things with the same name from fighting. C++, C# and PHP all use it to qualify names, and using/use then lets you drop the prefix inside one file. Dragging a whole namespace into every file — the famous `using namespace std;` — is convenient and is exactly how the collisions you were avoiding come back.",
    examples: [
      'namespace Raiden.Core;',
      'namespace raiden {\n    void start();\n}',
      'raiden::start();'
    ]
  },
  'type': {
    long: "Gives a name to a shape of data. In TypeScript and Haskell it is an alias and the compiler sees straight through it, so two aliases of string stay interchangeable; in Go, `type Celsius float64` makes a genuinely distinct type you cannot accidentally add to a Fahrenheit. Knowing which kind you have decides whether the name can catch bugs or only document them.",
    examples: [
      'type Id = string | number;',
      'type Celsius float64',
      'type Point = (Int, Int)'
    ]
  },
  'typedef': {
    long: "The C way to give an existing type a shorter name, usually to escape struct tags or the unreadable syntax of function pointers. It is an alias and not a new type, so the compiler will still happily mix your name with the original. Hiding a pointer inside a typedef is the common regret: the reader can no longer see that they are holding an address.",
    examples: [
      'typedef unsigned int uint;',
      'typedef struct { int x, y; } Point;',
      'typedef int (*Handler)(char *);'
    ]
  },
  // ------------------------------------------------------------------
  // objects & inheritance
  // ------------------------------------------------------------------
  'new': {
    long: "Builds a fresh instance: reserve the space, run the constructor, hand it back. In C++ it also means you now own that memory and must delete it, which is why modern C++ reaches for make_unique instead; in Java, C# and JavaScript a garbage collector handles that for you. Forgetting new in JavaScript calls the function like any other, and outside strict mode that quietly writes to globals.",
    examples: [
      'const p = new Player(100);',
      'var xs = new List<int>();',
      'Ship *s = new Ship();\ndelete s;'
    ]
  },
  'this': {
    long: "The object the method was called on. In Java, C# and C++ it is fixed by the class and never surprises anyone. In JavaScript it is decided by HOW the function was called rather than where it was written, so pulling a method off an object and passing it as a callback loses it — arrow functions and .bind() exist to pin it back down.",
    examples: [
      'hit(d) {\n  this.hp -= d;\n}',
      'btn.addEventListener("click", () => this.start());   // arrow keeps this',
      'const f = obj.method;\nf();   // this is no longer obj'
    ]
  },
  'self': {
    long: "The instance, spelled out. Python passes it as the first parameter of every method explicitly, which is why you write def hit(self, dmg) but call p.hit(5). Rust writes &self, &mut self or self to say whether the method only reads, may change, or consumes the value entirely — there it is part of the meaning, not ceremony.",
    examples: [
      'def hit(self, dmg):\n    self.hp -= dmg',
      'class P:\n    def __init__(self, hp):\n        self.hp = hp',
      'fn hit(&mut self) { self.hp -= 1; }   // Rust: borrows mutably'
    ]
  },
  'super': {
    long: "Reaches the version the parent class defined, so you can extend behaviour instead of throwing it away. In most languages a subclass constructor must call super before touching its own fields, because until then the parent half of the object does not exist. If you find yourself calling super in every single override, inheritance is probably the wrong shape for that relationship.",
    examples: [
      'class Boss extends Enemy {\n  constructor() {\n    super();\n    this.phase = 1;\n  }\n}',
      'def __init__(self, hp):\n    super().__init__(hp)\n    self.phase = 1',
      'override func draw() {\n    super.draw()\n    drawCrown()\n}'
    ]
  },
  'extends': {
    long: "Take everything another class has — fields, methods, behaviour — and start from there. It is the tightest coupling in object-oriented code: the parent can break every child by changing one method. Use it when the child genuinely IS the parent everywhere the parent is accepted; if you only wanted to reuse some code, hold an instance instead.",
    examples: [
      'class Boss extends Enemy { }',
      'class Counter extends StatefulWidget { }',
      'interface Admin extends User {\n  level: number;\n}'
    ]
  },
  'implements': {
    long: "A compiler-checked promise that this class provides everything an interface lists. Unlike extends it brings no code with it, only the obligation, so one class can implement many interfaces without the fragility of multiple inheritance. Java, PHP, Dart and TypeScript make you write it; Go deliberately does not and checks exactly the same thing in silence.",
    examples: [
      'class Ship implements Drawable {\n  draw() { … }\n}',
      'public class Job implements Runnable, Closeable { }',
      'class Cfg implements Config, Serializable { }'
    ]
  },
  'abstract': {
    long: "Declared but deliberately unfinished: the class cannot be instantiated, and any abstract method must be filled in by a subclass. It is how you say 'every shape has an area, but there is no such thing as a generic shape'. If your abstract class holds no state and has no finished methods, a plain interface is the lighter answer.",
    examples: [
      'abstract class Shape {\n  abstract double area();\n  void describe() { print(area()); }\n}',
      'abstract class Enemy {\n  abstract void ai();\n}',
      'Shape s = new Shape();   // compile error: abstract'
    ]
  },
  'override': {
    long: "Deliberately replaces the parent version of a method. Writing the keyword is not decoration: it makes the compiler check that you really are overriding something, so a typo or a signature that drifted becomes an error instead of a method that silently never runs again. Kotlin, Swift and C# require it; Java has @Override and it is worth using every time.",
    examples: [
      'override fun draw() {\n    super.draw()\n}',
      '@Override\npublic String toString() { return name; }',
      'override func viewDidLoad() {\n    super.viewDidLoad()\n}'
    ]
  },
  'virtual': {
    long: "Marks a method a subclass may replace, and tells the compiler to find the right one at RUNTIME from the object itself rather than from the declared type of the variable. Leave it off in C++ and a call through a base pointer runs the base version, quietly ignoring your override. A base class with virtual methods needs a virtual destructor too, or deleting through a base pointer leaks the derived part.",
    examples: [
      'virtual void draw();',
      'class Shape {\npublic:\n  virtual ~Shape() {}\n  virtual double area() = 0;   // pure virtual\n};',
      'public virtual void Update() { }   // C#'
    ]
  },
  'static': {
    long: "Belongs to the type rather than to any one instance: one copy, shared, reachable without creating anything. It suits counters, factories and constants, and it cannot see instance fields because there is no instance. In C the same word means something almost unrelated — a name private to the file, or a local that survives between calls — and that overload catches people crossing over.",
    examples: [
      'static int count = 0;',
      'public static void main(String[] args) { }',
      'static int calls(void) {\n  static int n = 0;   // survives across calls\n  return ++n;\n}'
    ]
  },
  'final': {
    long: "This cannot change again. On a variable it means assign once; on a method, no subclass may override it; on a class, no subclass at all. In Java and Dart a final reference still lets the object it points at change — like const in JavaScript, the promise is about the binding, not the contents.",
    examples: [
      'final int MAX = 10;',
      'final class Money { }   // nobody may subclass this',
      'final list = [1, 2];\nlist.add(3);   // fine\nlist = [];     // error'
    ]
  },
  'public': {
    long: "Visible from anywhere. It is the widest commitment in the file, because everything public is something you have promised not to break under the people using it. The healthy habit is to start private and widen when a real caller appears; going the other way — public first, narrow later — means breaking somebody.",
    examples: [
      'public class Main { }',
      'public int hp;',
      'pub fn start() { }   // Rust spells it pub'
    ]
  },
  'private': {
    long: "Visible only inside this type. It is what makes a class more than a bag of fields: you can change how something is stored tomorrow precisely because nobody outside could depend on it today. Most of these keywords are compiler-enforced convention rather than security — Python has no private at all, only a leading underscore that means 'do not'.",
    examples: [
      'private int seed;',
      'private void reset() { hp = 100; }',
      'class P:\n    def __init__(self):\n        self._seed = 0   # Python: convention only'
    ]
  },
  'protected': {
    long: "Visible to this class and to anything that inherits from it, but not to the outside world. It exists for state a subclass genuinely has to work with, and it is the middle ground that ages worst: every protected field is a promise to every future subclass. Prefer keeping the field private and exposing a protected method.",
    examples: [
      'protected void reset() { }',
      'protected int hp;',
      'class Boss extends Enemy {\n  void ai() { hp -= 1; }   // protected field is visible here\n}'
    ]
  },

  // ------------------------------------------------------------------
  // errors
  // ------------------------------------------------------------------
  'try': {
    long: "Marks a block where you expect something to fail and are ready for it. Keep it small: wrapping fifty lines in one try tells the reader nothing about WHICH line could throw, and makes it easy to catch a failure you never anticipated. In Zig and Rust the word is not a block at all — it unwraps a result or hands the error straight back to your caller.",
    examples: [
      'try {\n  const data = JSON.parse(text);\n} catch (e) {\n  console.warn("bad json", e);\n}',
      'try:\n    n = int(s)\nexcept ValueError:\n    n = 0',
      'const f = try std.fs.cwd().openFile(path, .{});   // Zig'
    ]
  },
  'catch': {
    long: "Handles the failure the try produced and hands you the error to inspect, log or wrap. Catch the narrowest type you can actually do something about; a bare catch that swallows everything turns a crash you would have fixed into behaviour nobody can explain. Catching to add context and rethrowing is honest — catching to hide it is where bugs go to live forever.",
    examples: [
      'catch (e) {\n  console.error(e.message);\n}',
      'catch (IOException e) {\n  throw new LoadError("could not read save", e);\n}',
      'try { risky(); } catch { }   // the line that hides the bug'
    ]
  },
  'except': {
    long: "Python's catch. Name the exception types you expect, because a bare except also swallows KeyboardInterrupt and your own typos arriving as NameError. Bind it with `as e` when you need to look at it, and remember that the first matching clause wins, so a subclass has to be listed above its parent or it will never be reached.",
    examples: [
      'try:\n    n = int(s)\nexcept ValueError:\n    n = 0',
      'except (KeyError, IndexError) as e:\n    log(e)',
      'except Exception as e:\n    raise LoadError("bad save") from e'
    ]
  },
  'finally': {
    long: "Runs on the way out no matter what happened: a normal finish, an exception, even a return from inside the try. It is where files get closed, locks released and spinners stopped. Returning a value from inside finally is a trap — it overrides whatever the try was returning and can silently discard an exception on its way up.",
    examples: [
      'try:\n    f = open(p)\n    use(f)\nfinally:\n    f.close()',
      'try {\n  lock();\n  work();\n} finally {\n  unlock();\n}',
      'with open(p) as f:   # same guarantee, less ceremony\n    use(f)'
    ]
  },
  'throw': {
    long: "Stop where you are and hand a failure up to whoever can deal with it. Throw when the function cannot fulfil its contract — not for an ordinary result you expected, like a search that found nothing. Throwing a bare string or number instead of an error object costs you the stack trace, which is a small betrayal of whoever debugs it at 2am.",
    examples: [
      'throw new Error("no fuel");',
      'if (hp < 0) throw new RangeError("hp cannot be negative");',
      'throw new LoadError("bad save", { cause: e });'
    ]
  },
  'raise': {
    long: "Python and Ruby's throw. Inside an except block, `raise` on its own re-raises the exception you are currently handling, which is how you log something and pass it on without flattening the traceback. Use `raise X from e` when you wrap a low-level failure in a friendlier one so the original cause stays attached instead of vanishing.",
    examples: [
      'raise ValueError("bad id")',
      'except OSError:\n    log("save failed")\n    raise',
      'raise LoadError("corrupt save") from e'
    ]
  },
  'rescue': {
    long: "Ruby's catch. It attaches to a begin block, and also directly to a method body, so a whole def can have a rescue clause with no extra nesting at all. A bare rescue catches StandardError rather than literally everything, which is the sane default — name the class when you mean something narrower.",
    examples: [
      'begin\n  risky\nrescue => e\n  puts e.message\nend',
      'def load\n  read_file\nrescue Errno::ENOENT\n  default_config\nend',
      'rescue JSON::ParserError => e\n  warn e'
    ]
  },
  'assert': {
    long: "States something you believe is always true and stops the program loudly when it is not. It documents an assumption and catches a broken one right where it broke instead of three functions downstream. It is a development tool, not error handling: Python throws every assert away when run with -O, so never use one to validate user input or enforce a permission.",
    examples: [
      'assert hp > 0, "player should still be alive here"',
      'assert len(xs) == len(ys)',
      'assert(ptr != NULL);'
    ]
  },
  'panic': {
    long: "Give up immediately: this state was supposed to be impossible, so there is nothing sensible left to do but stop and print how we got here. Rust panics on an out-of-range index or an unwrap of None; Go panics on a nil dereference. In library code it is bad manners — return the error and let the caller decide whether the program deserves to die.",
    examples: [
      'panic!("index {} out of range", i);',
      'let v = maybe.expect("config must be loaded by now");',
      'defer func() {\n\tif r := recover(); r != nil {\n\t\tlog.Println("recovered:", r)\n\t}\n}()'
    ]
  },
  'defer': {
    long: "Schedules something to run when the function exits, however it exits. Writing the cleanup on the line after the thing that needs cleaning removes the entire class of bug where one early return forgets to close the file. In Go deferred calls run last-in-first-out and their ARGUMENTS are evaluated immediately, which is the detail that trips people up.",
    examples: [
      'f, err := os.Open(p)\nif err != nil {\n\treturn err\n}\ndefer f.Close()',
      'mu.Lock()\ndefer mu.Unlock()',
      'for i := 0; i < 3; i++ {\n\tdefer fmt.Println(i)   // prints 2, 1, 0\n}'
    ]
  },

  // ------------------------------------------------------------------
  // modules
  // ------------------------------------------------------------------
  'import': {
    long: "Pulls names from another file or library into this one. Every import is also a dependency you have signed up for: something that must exist, be installed, and keep behaving. Circular imports — A needs B, which needs A — are the classic failure, and the fix is almost always to move the shared piece out into a third file.",
    examples: [
      'import math',
      'import { render } from "./ui.js";',
      'import java.util.List;'
    ]
  },
  'from': {
    long: "Names WHERE something comes from, so you can pull in single names instead of a whole module. `from x import *` is the version to avoid: it dumps names you cannot see into your file and quietly shadows your own. In JavaScript the same word ends the import line rather than starting it, but does the same job.",
    examples: [
      'from math import sqrt, pi',
      'from .models import Player as P',
      'import { render } from "./ui.js";'
    ]
  },
  'as': {
    long: "Renames the thing you just imported, opened or matched. Import aliases exist to shorten a long path (numpy as np) or to dodge a collision with a name you already have. Several languages give the same keyword a second job — a type cast, or naming the resource in a with/using block — so read the line around it before assuming.",
    examples: [
      'import numpy as np',
      'with open(path) as f:\n    data = f.read()',
      'const c = el as HTMLCanvasElement;'
    ]
  },
  'export': {
    long: "Marks what is allowed to leave this file. Everything you do not export stays private to the module, and that is the whole value: a short export list is a short promise. Bash gives the word an unrelated meaning — put this variable into the environment that child processes inherit.",
    examples: [
      'export const VERSION = 2;',
      'export default function Game() { … }',
      'export PORT=8766'
    ]
  },
  'require': {
    long: "Loads another file at RUNTIME and hands back what it exported. Because it is an ordinary call you can put it inside an if or a function, which static imports cannot do, and that is why it still shows up in Node config code. Ruby's require searches the load path and refuses to load the same file twice.",
    examples: [
      "const fs = require('fs');",
      "require 'json'",
      "local json = require('dkjson')"
    ]
  },
  'include': {
    long: "In C and C++ the preprocessor literally pastes the named file in before the compiler sees anything, which is why headers need include guards and why one fat header slows every build in the project. Ruby and PHP give the word a friendlier meaning: mix a module's methods into a class, or load another script and carry on even if it is missing.",
    examples: [
      '#include <stdio.h>',
      '#include "game.h"',
      'class Ship\n  include Comparable\nend'
    ]
  },
  'using': {
    long: "In C# and C++ it brings a namespace into scope so you can write Console instead of System.Console. C# gives it a second job: `using var f = ...` disposes the resource at the end of the block, its equivalent of Python's with. Modern C++ also uses it for type aliases, where it has quietly replaced typedef.",
    examples: [
      'using System;',
      'using var stream = File.OpenRead(path);',
      'using Handler = int (*)(char *);'
    ]
  },
  'use': {
    long: "Rust and PHP's import. In Rust it loads nothing — the crate is already being compiled in — it only shortens a path so you can write Read instead of std::io::Read. Grouping and aliasing keep the head of the file short, and a `use` inside a function is perfectly legal when a name is only needed there.",
    examples: [
      'use std::io::Read;',
      'use std::collections::{HashMap, HashSet};',
      'use App\\Models\\User;'
    ]
  },
  // ------------------------------------------------------------------
  // values & types
  // ------------------------------------------------------------------
  'true': {
    long: "One of the two values a boolean can hold. Most languages also accept other values as truthy in a condition — a non-empty string, a non-zero number — and the rules differ enough between them that carrying an assumption across is how bugs start. Comparing to it explicitly is noise: if (ready) already says what if (ready == true) says.",
    examples: [
      'let alive = true;',
      'if (ready) start();   // not: if (ready == true)',
      'bool ok = (1 == 1);'
    ]
  },
  'false': {
    long: "The other boolean. What counts as FALSY varies wildly and is worth learning for the language you actually live in: JavaScript treats 0, empty string, null, undefined and NaN as false; Python adds empty lists, dicts and strings; Ruby counts only false and nil, so an empty string there is true. That single table explains a lot of cross-language confusion.",
    examples: [
      'let alive = false;',
      'if (!xs.length) return;   // JS: 0 is falsy',
      'if not xs:\n    return   # Python: an empty list is falsy'
    ]
  },
  'null': {
    long: "A value meaning 'deliberately nothing here'. Its inventor called it his billion-dollar mistake, because in most languages ANY reference can secretly be null and you only find out when it crashes at runtime. Newer languages answer with option types or non-nullable references; the practical habit is to check at the edges of your code and keep the inside null-free.",
    examples: [
      'let target = null;',
      'if (target !== null) fire(target);',
      'String name = null;\nname.length();   // NullPointerException'
    ]
  },
  'nil': {
    long: "Lua, Ruby, Go and Swift's spelling of null. In Lua it is also how you delete — assigning nil to a table key removes it, and reading a key that was never set gives nil rather than an error. In Go a nil map can be read from but panics the moment you write to it, which is one of that language's sharpest edges.",
    examples: [
      'target = nil',
      't[key] = nil   -- Lua: this removes the key',
      'var m map[string]int\nm["a"] = 1   // panic: assignment to entry in nil map'
    ]
  },
  'none': {
    long: "Python's null: one single object meaning 'no value'. Compare with `is None` and never with `== None`, because a class can override equality and lie. It is the standard default for an optional argument, and the reason for the `x = [] if x is None else x` dance that dodges the shared-mutable-default trap.",
    examples: [
      'target = None',
      'if target is None:\n    return',
      'def find(xs, id):\n    for x in xs:\n        if x.id == id:\n            return x\n    return None'
    ]
  },
  'nullptr': {
    long: "C++11's properly typed null pointer, and the reason to stop writing NULL or 0. The old NULL is literally 0, so it can pick the wrong overload — f(int) where you meant f(char*) — while nullptr has its own type and always resolves to the pointer version. Dereferencing it is undefined behaviour, not a clean crash you can count on.",
    examples: [
      'Node* n = nullptr;',
      'if (n == nullptr) return;',
      'void f(int);\nvoid f(char*);\nf(NULL);      // calls f(int)\nf(nullptr);   // calls f(char*)'
    ]
  },
  'void': {
    long: "This function hands nothing back — you call it for what it does, not for what it gives. In C it has a second life as `void *`, a pointer to memory whose type you have deliberately forgotten, which is how C wrote generic code before templates existed. Also in C, f(void) in a declaration means 'takes no arguments' rather than 'unspecified'.",
    examples: [
      'void reset() { hp = 100; }',
      'public static void main(String[] args) { }',
      'void *buf = malloc(64);'
    ]
  },
  'int': {
    long: "A whole number in a fixed number of bits — usually 32, which caps it near plus or minus 2.1 billion. Push past that and most languages wrap silently round to a large negative number instead of telling you, which is the bug behind a surprising number of famous outages. Python is the exception: its integers just grow to whatever the number needs.",
    examples: [
      'int hp = 100;',
      'let big: i64 = 9_000_000_000;',
      'int x = 2147483647;\nx++;   // now -2147483648'
    ]
  },
  'float': {
    long: "A number with a fractional part, stored as sign, fraction and exponent — it trades exactness for enormous range. That is why 0.1 + 0.2 is not 0.3 in nearly every language: those values have no exact binary form, and the tiny error is real. Never compare floats with ==, and never store money in one; use a decimal or integer-cents type.",
    examples: [
      'float speed = 2.5f;',
      '0.1 + 0.2 == 0.3   // false',
      'if (fabs(a - b) < 1e-6) equal();'
    ]
  },
  'double': {
    long: "A float with twice the bits — 64 of them — giving roughly 15 to 17 significant digits instead of 7. It is the default floating-point type nearly everywhere, and every JavaScript number is one, which is why whole numbers above 2^53 start losing precision there. More accurate is not exact: the 0.1 + 0.2 problem applies to doubles too.",
    examples: [
      'double pi = 3.141592653589793;',
      'Number.MAX_SAFE_INTEGER;   // 9007199254740991',
      'double area = width * height;'
    ]
  },
  'char': {
    long: "A single character, which is a comfortable lie. In C a char is one byte, so anything outside ASCII takes several and an accented letter is not one char at all. Java and C# chars are 16-bit UTF-16 units, so an emoji is two of them; Rust's char is a full Unicode scalar and four bytes wide. Indexing text by char is where mojibake is born.",
    examples: [
      "char grade = 'S';",
      'char *name = "raiden";',
      "let c: char = '\\u{1F980}';   // Rust: one char, 4 bytes"
    ]
  },
  'bool': {
    long: "True or false and nothing else. A bare bool at a call site is a readability trap — draw(sprite, true, false) tells the reader nothing — so a named argument or a small enum usually beats it. In C a bool is an int underneath, and in C99 you need stdbool.h before the name even exists.",
    examples: [
      'bool alive = true;',
      'draw(sprite, true, false);   // unreadable\ndraw(sprite, flipX: true, flipY: false);',
      '#include <stdbool.h>'
    ]
  },
  'str': {
    long: "Python's text type, and the function that turns anything into its printable form. It holds Unicode code points rather than bytes — bytes are a separate type, and confusing the two is behind most Python encoding pain. Strings are immutable, so every edit builds a new one, and growing one with += in a loop is quietly quadratic; join a list instead.",
    examples: [
      'name = str(42)',
      'out = ",".join(str(x) for x in xs)',
      'text = data.decode("utf-8")   # bytes -> str'
    ]
  },
  'string': {
    long: "Text. In nearly every managed language strings are immutable, so concatenating in a loop allocates a fresh one every turn — that is what StringBuilder, join and strings.Builder exist to fix. Length is a trap too: most languages count code units rather than what a human calls characters, so one emoji can report a length of 2.",
    examples: [
      'string name = "raiden";',
      'const s = `hp: ${hp}`;',
      'let s = String::from("raiden");   // Rust: owned and growable'
    ]
  },

  // ------------------------------------------------------------------
  // collections
  // ------------------------------------------------------------------
  'list': {
    long: "An ordered sequence you can grow. Appending is cheap, but inserting or deleting at the front shifts everything after it, and `x in list` walks every element — if that is inside a loop you actually wanted a set or a dict. In R the word means something else: a container whose elements may each be a different type.",
    examples: [
      'xs = [1, 2, 3]\nxs.append(4)',
      'xs = list(range(3))   # [0, 1, 2]',
      'squares = [x * x for x in xs if x > 0]'
    ]
  },
  'array': {
    long: "A fixed block of values sitting side by side in memory, reached by index. That layout is exactly why it is fast: element i is one multiplication away and the CPU cache loves the straight line. In C nothing checks your index, so reading past the end quietly hands back whatever was next door — the original buffer overflow.",
    examples: [
      'int xs[10];\nxs[0] = 1;',
      'const xs = [1, 2, 3];\nxs[1];   // 2',
      '$a = ["hp" => 100];   // PHP arrays are ordered maps'
    ]
  },
  'dict': {
    long: "Key to value lookup that stays fast however many entries there are, because the key is hashed into a slot instead of searched for. Keys must be hashable, which is why a tuple can be one in Python and a list cannot. Reading a missing key raises, so use .get(k, default) whenever absence is ordinary rather than exceptional.",
    examples: [
      "ages = {'ada': 36}",
      "ages.get('nobody', 0)   # 0 instead of KeyError",
      'for k, v in ages.items():\n    print(k, v)'
    ]
  },
  'map': {
    long: "Two different ideas wearing one word. As a data structure it is key-to-value lookup: Go's map, C++'s std::map, Java's Map. As a function it applies something to every item and gives back a new collection, leaving the original alone — the everyday half of functional style, and the one that pairs with filter and reduce.",
    examples: [
      'xs.map(x => x * 2)',
      'm := map[string]int{"hp": 100}',
      'names = list(map(str.upper, names))'
    ]
  },
  'set': {
    long: "A collection that holds each value at most once and answers 'is this in here' instantly. Reach for it the moment you are about to write `if x not in seen` against a list, because that turns a full scan into a hash lookup. It has no order, so anything that depends on ordering needs a list instead.",
    examples: [
      'seen = set()\nseen.add(id)',
      'if id in seen:\n    return',
      'unique = list(set(names))   # order is lost'
    ]
  },
  'tuple': {
    long: "A fixed-size group of values, usually immutable, for when a thing has exactly two or three parts that travel together. Because it is immutable and hashable it can be a dictionary key, which a list cannot. Once you catch yourself writing p[2] and having to remember what index 2 meant, it is time for a named tuple, record or struct.",
    examples: [
      'point = (3, 4)',
      'x, y = point',
      'def size():\n    return (1920, 1080)\n\nw, h = size()'
    ]
  },
  'vector': {
    long: "A growable array: contiguous like an array, but when it fills up it allocates a bigger block and moves everything. That is why pushing is cheap on average and occasionally expensive, and why a pointer or iterator into a vector can go stale after a push. Reserve up front when you know the size. In R the word means the basic type, where even one number is a length-1 vector.",
    examples: [
      'std::vector<int> xs;\nxs.push_back(1);',
      'let mut xs: Vec<i32> = Vec::new();\nxs.push(1);',
      'xs.reserve(1000);   // pay for the growth once'
    ]
  },
  'len': {
    long: "How many items there are. For a list, string or array it is a stored number, not a count, so it is instant — but that is not universal: a linked list may have to walk, and a generator has no length at all. On text remember it counts code units, so len is not always what a reader would call characters.",
    examples: [
      'len(players)',
      'if len(xs) == 0:   # or, more Pythonic: if not xs',
      'len(xs)   # TypeError on a generator'
    ]
  },
  'range': {
    long: "A sequence of numbers to walk. In Python it is lazy — range(1000000) builds no list, it hands out numbers on demand — and the end is EXCLUSIVE, so range(5) is 0 to 4. That exclusive end is deliberate: range(len(xs)) is exactly the valid indices, and two ranges sharing an endpoint tile perfectly without overlapping.",
    examples: [
      'for i in range(5):\n    print(i)',
      'for i in range(2, 10, 2):   # 2, 4, 6, 8',
      'for i, v := range xs {\n\t// Go: index and value together\n}'
    ]
  },
  'append': {
    long: "Add one item to the end. In Python it mutates the list and returns None, so `xs = xs.append(4)` throws your whole list away — a classic first-week bug. In Go, append may or may not reuse the underlying array depending on capacity, which is why you must always write the result back.",
    examples: [
      'xs.append(4)',
      'xs = append(xs, 4)   // Go: always reassign',
      'xs.extend(ys)   # every item of ys, not ys itself'
    ]
  },
  'push': {
    long: "Add to the end of an array, or put a value on a stack — the same operation seen from two directions. In JavaScript push returns the new LENGTH rather than the array, so it does not chain the way map and filter do. With pop it turns any array into a stack with no extra data structure at all.",
    examples: [
      'xs.push(4);',
      'stack.push(node);\nconst top = stack.pop();',
      'push ebp   ; assembly: onto the call stack'
    ]
  },
  'pop': {
    long: "Take the last item off and hand it back, shortening the collection. With push it is how you walk a tree without recursion: push the children, pop the next node to visit. Popping an empty collection raises in most languages, and Python's list.pop(0) is slow because every remaining element shifts down.",
    examples: [
      'last = xs.pop()',
      'while stack:\n    node = stack.pop()\n    visit(node)',
      'value = d.pop(key, None)   # dicts pop by key'
    ]
  },
  'sort': {
    long: "Puts the items in order. Almost every standard sort is comparison-based and O(n log n), and most are STABLE — equal items keep their original order, which is what lets you sort by one field and then another and keep both. Watch the in-place versus copy split: Python's list.sort() mutates and returns None, while sorted() returns a new list.",
    examples: [
      'xs.sort()',
      'players.sort(key=lambda p: -p.score)',
      'xs.sort((a, b) => a - b);   // JS compares as text without this'
    ]
  },
  'filter': {
    long: "Keeps only the items that pass a test and leaves the original untouched. It is one third of a trio: filter narrows, map transforms, reduce collapses, and chaining them reads far better than one loop doing all three. In Python filter is lazy and hands back an iterator, so wrap it in list() if you need to use it twice.",
    examples: [
      'const alive = ps.filter(p => p.hp > 0);',
      'alive = [p for p in ps if p.hp > 0]   # idiomatic Python',
      'data %>% filter(hp > 0)   # R, via dplyr'
    ]
  },
  'reduce': {
    long: "Folds a whole collection into one value by carrying an accumulator through it: a sum, a maximum, a merged object, a grouping. Always pass the initial value — reducing an empty collection without one throws in both JavaScript and Python. And if the answer is simply a sum or a max, the dedicated function says it more clearly than a fold.",
    examples: [
      'const total = xs.reduce((a, b) => a + b, 0);',
      'from functools import reduce\nreduce(lambda a, b: a * b, xs, 1)',
      'const byId = ps.reduce((acc, p) => {\n  acc[p.id] = p;\n  return acc;\n}, {});'
    ]
  },

  // ------------------------------------------------------------------
  // async & concurrency
  // ------------------------------------------------------------------
  'async': {
    long: "Marks a function that is allowed to pause partway through. It returns a promise, future or task immediately; the body runs up to the first await and the real value arrives later. Marking something async does NOT put it on another thread or make anything parallel — it only lets the language suspend it, and ten awaited calls in a loop still happen strictly one after another.",
    examples: [
      'async function load() {\n  const r = await fetch(url);\n  return r.json();\n}',
      'const all = await Promise.all(urls.map(fetchOne));   // actually concurrent',
      'async def load():\n    async with session.get(url) as r:\n        return await r.json()'
    ]
  },
  'await': {
    long: "Pause here until the promise settles, then continue with its value — without blocking the thread, so the page keeps drawing and other work keeps running. It is only legal inside an async function, or at the top level of a module in modern JavaScript. Awaiting inside a loop is the usual performance mistake: start everything first, then await them together.",
    examples: [
      'const r = await fetch(url);\nconst data = await r.json();',
      'try {\n  await save();\n} catch (e) {\n  toast("save failed");\n}',
      'const [a, b] = await Promise.all([loadA(), loadB()]);'
    ]
  },
  'yield': {
    long: "Hand back one value and freeze the function exactly where it stands; the next request resumes it with every local still intact. That is what turns a function into a generator, and it lets you describe a huge or endless sequence without ever building it in memory. Ruby's yield is a different thing sharing the name: it calls the block the caller passed in.",
    examples: [
      'def lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.rstrip()',
      'def naturals():\n    n = 0\n    while True:\n        yield n\n        n += 1',
      'def each\n  yield 1\n  yield 2\nend   # Ruby: runs the caller block'
    ]
  },
  'thread': {
    long: "A second line of execution inside the same process, sharing all the same memory. That sharing is both the point and the danger: two threads touching one variable without a lock give results that depend on timing and disappear the moment you add a print statement. Threads are for work that genuinely needs another core; for waiting on I/O, async is usually the better answer.",
    examples: [
      'Thread t = new Thread(this::run);\nt.start();',
      'import threading\nt = threading.Thread(target=work)\nt.start()\nt.join()',
      'mu.Lock()\ncount++\nmu.Unlock()'
    ]
  },
  'suspend': {
    long: "Kotlin's marker for a function that can pause without holding on to a thread. It may only be called from another suspend function or from a coroutine builder such as launch, which is how the compiler proves the pause is safe. Because the thread is handed back while you wait, thousands of coroutines can share a handful of real threads.",
    examples: [
      'suspend fun load(): Config {\n    delay(100)\n    return read()\n}',
      'lifecycleScope.launch {\n    val cfg = load()\n    render(cfg)\n}',
      'coroutineScope {\n    val a = async { loadA() }\n    val b = async { loadB() }\n    show(a.await(), b.await())\n}'
    ]
  },
  'spawn': {
    long: "Start a concurrent task and carry on without waiting for it. What actually gets spawned varies enormously — an OS thread, a lightweight green thread, a whole process — and so does the cost, which is worth knowing before you spawn one per incoming request. Whatever you spawn, decide up front how it ends and where its errors go.",
    examples: [
      'let h = thread::spawn(|| work());\nh.join().unwrap();',
      'tokio::spawn(async move {\n    handle(conn).await;\n});',
      'go worker(ch)   // Go spells it go'
    ]
  },
  // ------------------------------------------------------------------
  // logic & operators
  // ------------------------------------------------------------------
  'and': {
    long: "True only when both sides are. It SHORT-CIRCUITS: if the left side is already false the right side is never evaluated at all, which is what makes `if p is not None and p.hp > 0` safe to write. Python's and does not hand back a boolean either — it returns one of the two operands, so `a and b` gives b whenever a is truthy.",
    examples: [
      'if alive and armed:\n    fire()',
      'if p is not None and p.hp > 0:\n    hit(p)   # the right side never runs when p is None',
      'name = given and given.strip()'
    ]
  },
  'or': {
    long: "True when either side is, and short-circuiting the same way: the right side only runs if the left was false. As an expression it hands back the first truthy operand, which is why `value or default` is the classic fallback. Its sharp edge is that 0 and the empty string are falsy, so `port or 8080` silently overrides a deliberate 0 — which is exactly why ?? was invented.",
    examples: [
      'if dead or empty:\n    reset()',
      'name = given or "anonymous"',
      'const port = cfg.port ?? 8080;   // ?? falls back only on null/undefined'
    ]
  },
  'not': {
    long: "Flips true to false. Stacking negations is where readability dies: `if not (a and not b)` costs real effort, and De Morgan lets you push it inward to `if not a or b`. When you catch yourself negating a name, rename the thing instead — isEmpty reads far better than not isNotEmpty.",
    examples: [
      'if not found:\n    create()',
      'if not xs:\n    return   # empty list is falsy',
      'if (!ready) wait();'
    ]
  },
  'in': {
    long: "Asks whether an item is inside a collection — and in a for loop it also names the thing being walked. The cost is not constant: on a list it scans every element, on a set or dict it is a single hash lookup, so the same three letters can be fast or slow depending on what is to the right. On a dict it tests the KEYS, not the values.",
    examples: [
      "if 'a' in name:",
      'for x in xs:\n    print(x)',
      "if 'ada' in ages:   # checks keys, not values"
    ]
  },
  'is': {
    long: "Asks whether two names point at the very same object, not whether they look alike. Use it for None, True and False, and use == for values — `x is 1000` may work or not depending on how the runtime caches small integers, which makes it a wonderfully confusing bug. SQL uses the word in IS NULL, because NULL is never equal to anything, not even to itself.",
    examples: [
      'if x is None:\n    return',
      'a = [1]\nb = [1]\na == b   # True\na is b   # False',
      'WHERE deleted_at IS NULL'
    ]
  },
  '==': {
    long: "Are these two values equal? The answer depends on the language more than anyone expects. In Java, == on objects compares references and you almost always wanted .equals(). In JavaScript it converts types first, so '1' == 1 is true, which is why === exists and should be your default. On floating point numbers it is nearly always the wrong tool.",
    examples: [
      'if (hp == 0) die();',
      "'1' == 1     // true in JS\n'1' === 1    // false",
      'a.equals(b)   // Java: == would compare references'
    ]
  },
  '!=': {
    long: "Are these two values different? It is the exact negation of == and inherits every one of that operator's quirks, so in JavaScript you want !== for the same reason you want ===. The classic logic slip is chaining it: `x != 1 || x != 2` is true for every possible x, and you meant &&.",
    examples: [
      'if (a != b) swap();',
      'if (x !== null && x !== undefined) use(x);',
      'if err != nil {\n\treturn err\n}'
    ]
  },
  '&&': {
    long: "Logical AND in the C family, short-circuiting exactly like Python's and: the right side never runs once the left is false. That laziness gets used deliberately as a guard, and in React-style code as `cond && <thing/>`. In Bash the same symbol works at the command level — run the next command only if this one succeeded.",
    examples: [
      'if (alive && armed) fire();',
      'p && p.update();',
      'npm run build && npm test'
    ]
  },
  '||': {
    long: "Logical OR in the C family, short-circuiting so the right side is only evaluated when the left was false. As an expression it hands back the first truthy operand, which makes `opts.name || \"anon\"` the classic default — carrying the classic bug that 0 and the empty string fall through it. In Bash it means 'run this only if the last command failed'.",
    examples: [
      'if (dead || empty) reset();',
      'const name = opts.name || "anon";',
      'make || echo "build failed"'
    ]
  },
  '=>': {
    long: "In JavaScript, C# and Dart it is an arrow function: parameters on the left, result on the right, and the return is implied when the body is one expression. Its quiet superpower in JavaScript is that it does NOT get its own `this` — it borrows the surrounding one, which is why callbacks stopped needing .bind(this). In Ruby, PHP and Perl the same arrow separates a hash key from its value.",
    examples: [
      'xs.map(x => x * 2)',
      'setTimeout(() => this.tick(), 16);',
      '{ "hp" => 100 }   # Ruby and PHP: a key/value pair'
    ]
  },
  '->': {
    long: "Points at what comes out. Python and Rust use it for the return type, Haskell builds entire function types from it, Swift puts it between the parameters and the result. In C, PHP and Perl the same two characters mean something completely different: reach through a pointer or reference to a member, so p->hp is shorthand for (*p).hp.",
    examples: [
      'def parse(s: str) -> int:',
      'fn add(a: i32, b: i32) -> i32 { a + b }',
      'p->hp = 100;   // C: same as (*p).hp'
    ]
  },
  '::': {
    long: "Reaches inside a namespace, module or type rather than into an object. C++ uses it for namespaces and static members, Rust for module paths and associated functions, PHP for static access, and Haskell for a type signature where it reads as 'has type'. It is the punctuation for 'the X that lives inside Y'.",
    examples: [
      'std::cout << hp;',
      'let s = String::from("hi");',
      'main :: IO ()   -- Haskell: has type'
    ]
  },
  '&': {
    long: "Three jobs sharing one character. In Rust and C++ it makes a reference, so you can read a value without copying it and without taking ownership. In C it means 'the address of', which is what scanf needs. And between two numbers in almost any C-family language it is bitwise AND, used to test flags.",
    examples: [
      'fn read(s: &str) { … }',
      'scanf("%d", &n);',
      'if (flags & MASK_ALIVE) { … }'
    ]
  },
  '*': {
    long: "In C and C++ it declares a pointer, and in an expression it dereferences one to reach the value at that address — same symbol, two directions. Everywhere else it is multiplication. Python adds unpacking: *args in a signature collects the extra positional arguments, and *xs at a call site spreads a list back into them.",
    examples: [
      'int v = *ptr;',
      'int *p = &hp;',
      'def log(fmt, *args):\n    print(fmt % args)'
    ]
  },
  '%': {
    long: "The remainder after division. It is how you test divisibility, wrap an index round the end of an array, and do anything that repeats on a cycle. Watch the sign: in C, Java and JavaScript -7 % 3 is -1, but Python gives 2 because it follows the sign of the divisor — so a wrap-around index built on % can go negative outside Python.",
    examples: [
      'if (i % 2 == 0) even();',
      'const next = (i + 1) % xs.length;   // wrap to the start',
      '-7 % 3   # 2 in Python, -1 in C and JS'
    ]
  },
  '++': {
    long: "Add one, in place. Written before the variable it increments and then hands back the new value; written after, it hands back the old value and then increments — which is why i++ and ++i are not interchangeable inside a larger expression. Using it twice on the same variable in one expression is undefined behaviour in C, and Python left the operator out on purpose.",
    examples: [
      'count++;',
      'xs[i++] = v;   // store, then advance',
      'for (int i = 0; i < n; ++i) { … }'
    ]
  },
  '+=': {
    long: "Add to what is already there. On strings and lists it usually means concatenate or extend, and that is where it gets expensive — growing a string with += inside a loop reallocates on every turn, so build a list and join it instead. In Python, += on a list mutates it in place while + creates a new one, a difference anyone else holding that list will notice.",
    examples: [
      'score += 10',
      'xs += [4]       # mutates in place\nxs = xs + [4]   # builds a new list',
      'out = "".join(parts)   # instead of out += line in a loop'
    ]
  },
  '**': {
    long: "Raise to a power: 2 ** 10 is 1024. Python gives it a second, unrelated job — **kwargs in a signature gathers keyword arguments into a dict, and **d at a call site spreads a dict back out into them. One precedence trap: ** binds tighter than unary minus, so -2 ** 2 is -4.",
    examples: [
      '2 ** 10   # 1024',
      'def make(**opts):\n    print(opts)',
      'make(**{"hp": 100, "name": "raiden"})'
    ]
  },
  '//': {
    long: "Floor division in Python: divide and round DOWN to a whole number, so 7 // 2 is 3. The part that surprises people is negatives — -7 // 2 is -4, not -3, because it rounds toward negative infinity rather than toward zero. Use it for indexes and midpoints where a float would be wrong. In most other languages the same two characters start a comment.",
    examples: [
      '7 // 2    # 3',
      'mid = (lo + hi) // 2',
      '-7 // 2   # -4'
    ]
  },
  ':=': {
    long: "Assignment inside an expression. Python calls it the walrus and it exists so you can bind a value and test it in the same breath without computing it twice. Go uses the same symbol for a related but different job: declare a new variable and infer its type, which is the everyday way to introduce one inside a function.",
    examples: [
      'if (n := len(xs)) > 3:\n    print(n)',
      'while (line := f.readline()):\n    parse(line)',
      'ch := make(chan int)   // Go: declare and infer'
    ]
  },
  '?': {
    long: "The question mark marks uncertainty, and each language picks its own flavour. In Kotlin, Swift, Dart and TypeScript it makes a type nullable or a member optional, and the compiler then forces you to deal with the absent case. In Rust a trailing ? unwraps an Ok or returns the Err straight to your caller. In the C family, a ? b : c is the ternary conditional.",
    examples: [
      'var p: Player? = null',
      'let cfg = load()?;   // Rust: propagate the error upward',
      'const label = hp > 0 ? "alive" : "dead";'
    ]
  },
  '!': {
    long: "In the C family it flips true to false. Elsewhere it is a promise or a warning: Kotlin's !! forces a nullable value and throws if it was null, Swift's ! force-unwraps an optional and crashes if it was nil, and Rust puts it on macro calls such as println!. In Ruby a trailing ! marks the version of a method that mutates in place.",
    examples: [
      'if (!ready) wait();',
      'val n = name!!   // Kotlin: throws if name is null',
      'xs.sort!   # Ruby: sorts the array itself'
    ]
  },

  // ------------------------------------------------------------------
  // everyday tools
  // ------------------------------------------------------------------
  'print': {
    long: "Writes something out where a human can see it. It is the oldest debugger there is and still one of the best — one print in the right place beats an hour of guessing. Its real limits are that it costs real time inside a tight loop, it goes to standard output where a server may throw it away, and prints left in shipped code become somebody else's log noise.",
    examples: [
      'print("hello")',
      'print(f"hp={hp} pos={x},{y}")',
      'console.log({ hp, x, y });   // JS: prints the names too'
    ]
  },
  'input': {
    long: "Reads what the user types, blocking until they press enter. It always hands back TEXT, so anything numeric has to be converted and that conversion is exactly where a stray character raises. Never trust what comes out of it: validate before you use it as an index, a path or part of a query.",
    examples: [
      'name = input("who? ")',
      'n = int(input("how many? "))',
      'try:\n    n = int(input())\nexcept ValueError:\n    n = 0'
    ]
  },
  'open': {
    long: "Gets you a handle on a file. It can fail for a dozen ordinary reasons — missing, locked, no permission — so the result is checked rather than assumed. The mode matters more than people notice: opening for writing truncates the file to empty immediately, before you have written a single byte. Prefer a with, using or defer block so it always closes.",
    examples: [
      "f = open('save.txt')",
      "with open('save.txt', 'w') as f:\n    f.write(data)",
      'f, err := os.Open(path)\nif err != nil {\n\treturn err\n}'
    ]
  },
  'close': {
    long: "Lets go of the file, socket or connection, and flushes whatever was still sitting in the buffer. Skip it and your last writes may never reach disk, while the process slowly runs out of handles — a leak that only appears under load. This is precisely why with, using, defer and destructors exist: so close cannot be forgotten on the error path.",
    examples: [
      'f.close()',
      'with open(p) as f:\n    use(f)   # closed for you, even if this raises',
      'defer f.Close()'
    ]
  },
  'pass': {
    long: "Do nothing, deliberately. Python needs a body after any colon, so pass is the legal way to write an empty one: a stub you will fill in, a class with no members yet, an exception you genuinely want to ignore. `except: pass` is the shape to be suspicious of — it is how a real error becomes total silence.",
    examples: [
      'def todo():\n    pass',
      'class Marker:\n    pass',
      'try:\n    os.remove(p)\nexcept FileNotFoundError:\n    pass   # fine: it was already gone'
    ]
  },
  'end': {
    long: "Closes a block in languages that use words rather than braces — Ruby, Lua, and the Pascal family. It reads well aloud, and it makes deep nesting painfully visible as a column of ends with nothing to say which is which. That discomfort is useful information: it is usually telling you to extract a method.",
    examples: [
      'if x then\n  act()\nend',
      'def hit(dmg)\n  @hp -= dmg\nend',
      'for i = 1, 10 do\n  print(i)\nend'
    ]
  },
  'begin': {
    long: "Opens a block. In Ruby it starts one you can attach rescue and ensure to, which is that language's try. In SQL it opens a TRANSACTION: everything after it is provisional until COMMIT, and ROLLBACK throws the lot away. Same word in both, and in both it is about grouping things that must succeed or fail as one.",
    examples: [
      'begin\n  risky\nrescue => e\n  puts e\nend',
      'BEGIN;\nUPDATE accounts SET bal = bal - 10 WHERE id = 1;\nUPDATE accounts SET bal = bal + 10 WHERE id = 2;\nCOMMIT;'
    ]
  },
  'then': {
    long: "In Lua, Ruby and Bash it simply follows the condition and introduces what to do. In JavaScript it is a method on a promise: .then(fn) registers what runs once the value arrives and returns another promise, so calls chain. Async/await is sugar over exactly that machinery, and mixing both styles in one function is where the confusion starts.",
    examples: [
      'if hp <= 0 then die() end',
      'fetch(url)\n  .then(r => r.json())\n  .then(render);',
      'if [ -f save.txt ]; then\n  load\nfi'
    ]
  },
  'with': {
    long: "Borrows a resource and gives it back at the end of the block whatever happens inside — the file closes even if the code raises. It is Python's tidy answer to try/finally, and it covers files, locks, database transactions and anything else with paired setup and teardown. Anything with __enter__ and __exit__ can be used this way, including classes you write yourself.",
    examples: [
      'with open(p) as f:\n    data = f.read()',
      'with lock:\n    count += 1',
      'with open(a) as src, open(b, "w") as dst:\n    dst.write(src.read())'
    ]
  },
  'global': {
    long: "Declares that a name inside this function means the module-level variable instead of a new local one. You only need it to ASSIGN — reading a global works without it, which is why 'referenced before assignment' catches people out. Needing it often is a design smell: passing the value in and returning the new one is easier to test and to follow.",
    examples: [
      'score = 0\n\ndef add(n):\n    global score\n    score += n',
      'def read():\n    return score   # reading needs no declaration',
      'global $config;   // PHP spells it this way'
    ]
  },
  'delete': {
    long: "Removes something, but what exactly depends on the language. In JavaScript `delete obj.key` takes a property off an object and is the wrong tool for arrays, where it leaves a hole and does not change the length. In C++ it frees what new allocated and must match exactly: delete for new, delete[] for new[], never twice. In SQL it removes rows and wants a WHERE.",
    examples: [
      'delete cache[key];',
      'delete ptr;\ndelete[] arr;',
      'DELETE FROM runs WHERE id = 3;'
    ]
  },
  'typeof': {
    long: "Asks what kind of value this is. JavaScript's version returns a string and carries two famous flaws: typeof null is 'object', and every array is 'object' too, so use Array.isArray for that. Its one genuinely unique use is checking a name that may not be declared at all, since typeof never throws. TypeScript gives the word a second life, capturing the TYPE of an existing value.",
    examples: [
      'typeof x === "string"',
      'typeof maybeUndeclared === "undefined"   // safe; a bare reference throws',
      'const cfg = { fps: 60 };\ntype Cfg = typeof cfg;   // TypeScript'
    ]
  },
  'instanceof': {
    long: "Asks whether an object was built from a class, walking up the inheritance chain so a Boss also counts as an Enemy. A long ladder of instanceof checks is usually polymorphism you have not written yet — one method implemented on each type says the same thing better. In browsers it also fails across iframes, since each frame has its own copies of the constructors.",
    examples: [
      'if (x instanceof Player) x.hit(1);',
      'e instanceof Error',
      'obj instanceof Enemy   // true for a Boss, if Boss extends Enemy'
    ]
  },
  'sizeof': {
    long: "How many bytes a type or value takes. It is resolved at compile time and its argument is never actually evaluated. The trap every C programmer meets exactly once: sizeof on an array gives the size of the whole array, but the moment that array is passed into a function it decays to a pointer, and sizeof quietly gives you the pointer size instead.",
    examples: [
      'sizeof(int)   /* usually 4 */',
      'int *p = malloc(n * sizeof *p);',
      'int xs[10];\nsizeof(xs);   /* 40 here, 8 inside a function */'
    ]
  },
  'inline': {
    long: "Asks the compiler to paste a function body at the call site instead of making a call, trading binary size for the loss of the call overhead. Modern compilers judge this far better than you can and largely ignore the hint; in C and C++ the keyword's real job today is letting a definition sit in a header without breaking the one-definition rule. CSS uses the same word for a display mode, unrelated to any of this.",
    examples: [
      'inline int sq(int x) { return x * x; }',
      'inline constexpr int MAX = 100;',
      'display: inline;   /* CSS: a completely different meaning */'
    ]
  },
  'unsafe': {
    long: "A block where you take on the guarantees the compiler normally makes: dereferencing raw pointers, calling into C, touching mutable global state. It does not switch the borrow checker off — everything else still applies — it is a small region where YOU promise the invariants hold. Keep the block as small as possible and wrap it in a safe function with a comment explaining why it is sound.",
    examples: [
      'unsafe { *p = 1; }',
      'unsafe {\n    let v = std::slice::from_raw_parts(ptr, len);\n}',
      'unsafe impl Send for MyBox {}'
    ]
  },
  'main': {
    long: "Where the program starts. The runtime calls it, and what it returns becomes the exit code the shell sees, where 0 conventionally means success. In C it can take argc and argv, the arguments you were launched with; in Go it must live in package main and takes nothing. Scripting languages have no main at all — the file itself is the entry point, which is what the __name__ check is working around.",
    examples: [
      'int main(void) {\n  printf("hi\\n");\n  return 0;\n}',
      'func main() {\n\tfmt.Println("hi")\n}',
      'if __name__ == "__main__":\n    main()'
    ]
  }
};

const D_LANG = {
  HTML: {
    'html': {
      long: "The root element: everything lives inside it, with exactly one head and one body as its children. The lang attribute is the part people forget and it does real work — screen readers use it to choose a voice and pronunciation, and browsers use it for hyphenation and for deciding whether to offer a translation.",
      examples: [
        '<html lang="en">\n  <head>…</head>\n  <body>…</body>\n</html>',
        '<html lang="tr">'
      ]
    },
    'head': {
      long: "The metadata section: title, charset, stylesheets, icons, scripts. Nothing here is drawn, but everything here shapes how the page loads — a plain script tag in the head blocks the parser until it has downloaded and run, which is why scripts carry defer or sit at the end of the body. It is also what search engines and chat previews read.",
      examples: [
        '<head>\n  <meta charset="UTF-8">\n  <title>Life of Software</title>\n  <link rel="stylesheet" href="style.css">\n</head>',
        '<script src="game.js" defer></script>'
      ]
    },
    'body': {
      long: "Everything the visitor actually sees. There is exactly one per document, and it is the top of the visible tree that scripts and stylesheets work against. A very common first CSS line is body { margin: 0 }, because browsers apply a default margin that quietly stops a full-bleed layout from reaching the edges.",
      examples: [
        '<body>\n  <h1>LIFE OF SOFTWARE</h1>\n</body>',
        'body { margin: 0; background: #1e1e1e; }',
        'document.body.appendChild(el);'
      ]
    },
    'title': {
      long: "The name of the page: the browser tab, the bookmark, and the headline in a search result all come from here. Put the distinguishing part first, because tabs and search listings both truncate the end. It lives in the head, there is one per document, and scripts can change it while the page runs.",
      examples: [
        '<title>Life of Software</title>',
        '<title>Settings — Life of Software</title>',
        'document.title = "PAUSED";'
      ]
    },
    'meta': {
      long: "Facts about the page rather than content in it. Two of them carry real weight: charset, which should come first so the browser decodes your text correctly, and the viewport line, without which a phone pretends to be a 980px desktop and shrinks everything to unreadable. The rest is mostly what search engines and chat apps quote when the link is shared.",
      examples: [
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="description" content="Type the language, ship the build.">'
      ]
    },
    'link': {
      long: "Connects this page to an external resource — almost always a stylesheet, sometimes an icon or a preloaded font. It is NOT a hyperlink; that is the a element. The rel attribute says what the relationship is, and a wrong or missing rel is the usual reason a stylesheet silently does nothing at all.",
      examples: [
        '<link rel="stylesheet" href="style.css">',
        '<link rel="icon" href="favicon.png">',
        '<link rel="preload" href="font.woff2" as="font" crossorigin>'
      ]
    },
    'script': {
      long: "Runs JavaScript. Where you put it matters more than anything else about it: a plain script in the head stops the parser until it has downloaded and executed, so use defer (run after parsing, in order) or put it at the end of the body. A module script is deferred automatically and gives you import and export.",
      examples: [
        '<script src="game.js"></script>',
        '<script src="game.js" defer></script>',
        '<script type="module">\n  import { start } from "./game.js";\n  start();\n</script>'
      ]
    },
    'style': {
      long: "CSS written directly in the page instead of a separate file. It is genuinely useful for a tiny page, or for the small block of critical CSS you want applied before any stylesheet has downloaded. For anything larger a linked stylesheet wins: it caches across pages and keeps the rules in one place instead of scattered through the markup.",
      examples: [
        '<style>\n  body { margin: 0 }\n</style>',
        '<style>\n  .card { padding: 12px; border: 1px solid #333 }\n</style>'
      ]
    },
    'div': {
      long: "A box with no meaning of its own — the workhorse for grouping and layout. The lack of meaning is the point, and also the risk: a page built entirely of divs tells a screen reader nothing about its structure. If header, nav, section, article or button describes what the box IS, use that and keep div for pure layout.",
      examples: [
        '<div class="card">…</div>',
        '<div class="row">\n  <div class="col">a</div>\n  <div class="col">b</div>\n</div>',
        '<div id="game"></div>'
      ]
    },
    'span': {
      long: "The inline version of div: no meaning, used to style or script part of a line without breaking it. Reach for it to colour one word, to wrap a number you will update from JavaScript, or to slot an icon into a sentence. If the words are emphasised or important, em and strong say that properly instead.",
      examples: [
        'a <span class="hot">word</span>',
        'HP: <span id="hp">100</span>',
        'document.getElementById("hp").textContent = hp;'
      ]
    },
    'p': {
      long: "A paragraph. The browser gives it vertical margins by default, which is why text in a p breathes and text loose in a div does not. It cannot contain block elements: put a div inside a p and the browser silently closes the paragraph first, so the tree you get is not the one you wrote.",
      examples: [
        '<p>Type the pattern before it deprecates.</p>',
        '<p>Two <em>separate</em> sentences. One paragraph.</p>'
      ]
    },
    'a': {
      long: "A hyperlink. href is what makes it a link at all — an a with no href is just text, and a div with a click handler is not a link to a keyboard or a screen reader. When you open a new tab with target, add rel='noopener' so the new page cannot reach back into yours.",
      examples: [
        '<a href="/play">play</a>',
        '<a href="https://itch.io" target="_blank" rel="noopener">itch.io</a>',
        '<a href="#credits">jump to credits</a>'
      ]
    },
    'img': {
      long: "Puts an image on the page. Always give it alt text, and give it width and height too — without them the browser cannot reserve the space, so everything below jumps down when the picture finally arrives. Add loading='lazy' for images far below the fold so they do not compete with the first paint.",
      examples: [
        '<img src="hero.png" alt="the hero ship" width="320" height="180">',
        '<img src="divider.png" alt="">   <!-- decorative: empty alt -->',
        '<img src="map.jpg" alt="level map" loading="lazy">'
      ]
    },
    'href': {
      long: "WHERE a link points. It can be a full URL, a path relative to this page, a #fragment that scrolls to an id in this document, or a scheme like mailto: and tel:. A relative href resolves against the current URL, which is exactly why links break when a page moves one folder deeper.",
      examples: [
        '<a href="/play">play</a>',
        '<a href="#credits">credits</a>',
        '<a href="mailto:hi@example.com">email</a>'
      ]
    },
    'src': {
      long: "WHERE an image, script, iframe or video loads its file from. Unlike href, which describes a relationship you may choose to follow, src means 'fetch this now and put it here' — the browser goes and gets it while building the page. A wrong src is silent for an image (you see the alt) and loud for a script (nothing runs).",
      examples: [
        '<img src="hero.png" alt="hero">',
        '<script src="game.js" defer></script>',
        '<iframe src="game.html"></iframe>'
      ]
    },
    'alt': {
      long: "The text that stands in for an image when it cannot be seen: by a screen reader, on a dead connection, or when the file is missing. Describe what the image MEANS here, not what it literally depicts, and leave it empty for purely decorative images so assistive tech skips them instead of reading out a filename.",
      examples: [
        '<img src="hero.png" alt="the hero ship, damaged">',
        '<img src="divider.png" alt="">',
        '<img src="chart.png" alt="score doubles after level 10">'
      ]
    },
    'class': {
      long: "A reusable label. Many elements can share one class and one element can carry several, which is the entire mechanism behind utility-class frameworks. Classes are for styling and grouping; when a script needs exactly one specific element, an id or a data- attribute states that intent far more honestly.",
      examples: [
        '<div class="card wide">…</div>',
        '.card { padding: 12px }',
        'document.querySelectorAll(".card")'
      ]
    },
    'id': {
      long: "A unique name for ONE element in the document. It is the target of a #fragment link, the thing a label's for attribute points at, and the fastest handle for getElementById. Duplicating an id is invalid and the symptoms are quietly confusing, because the browser will simply keep returning the first match forever.",
      examples: [
        '<div id="game"></div>',
        'document.getElementById("game")',
        '<label for="q">search</label>\n<input id="q">'
      ]
    },
    'ul': {
      long: "An unordered list: items where the order carries no meaning. Only li elements may be its direct children — a div dropped straight into a ul is invalid, though nothing will tell you. It is also the right markup for a navigation menu, which is why nav > ul > li is such a common shape on real sites.",
      examples: [
        '<ul>\n  <li>type</li>\n  <li>ship</li>\n</ul>',
        '<nav>\n  <ul>\n    <li><a href="/">home</a></li>\n  </ul>\n</nav>',
        'ul { list-style: none; padding: 0 }'
      ]
    },
    'ol': {
      long: "An ordered list, where the numbers are meaning rather than decoration — steps that must happen in sequence. The browser generates the numbering, so inserting a step in the middle renumbers everything for free. start continues a list that was interrupted, and reversed counts down.",
      examples: [
        '<ol>\n  <li>install</li>\n  <li>build</li>\n  <li>ship</li>\n</ol>',
        '<ol start="4">\n  <li>test</li>\n</ol>'
      ]
    },
    'li': {
      long: "One item inside a list. It belongs to a ul or ol and nowhere else, and it can hold anything — paragraphs, links, even a nested list, which is how sub-menus are built. The bullet or number is styled on the parent list with list-style, not on the item itself.",
      examples: [
        '<li>a pattern</li>',
        '<li>menu\n  <ul>\n    <li>sub item</li>\n  </ul>\n</li>'
      ]
    },
    'table': {
      long: "For tabular DATA: rows and columns that only mean something together. It was abused for page layout for a decade, which is why people flinch, but for a real table nothing else comes close on accessibility — a screen reader can announce the column header alongside each cell. That only works if you use th and give it a scope.",
      examples: [
        '<table>\n  <tr><th>lang</th><th>score</th></tr>\n  <tr><td>HTML</td><td>900</td></tr>\n</table>',
        '<table>\n  <caption>Best runs</caption>\n  <thead>…</thead>\n  <tbody>…</tbody>\n</table>'
      ]
    },
    'tr': {
      long: "One row of a table. Its children are cells — th for headers, td for data. Rows are the only structure HTML gives you: there is no column element you can put content into, so anything you want to do per column is handled by position or by CSS.",
      examples: [
        '<tr><td>hp</td><td>100</td></tr>',
        '<tr><th>lang</th><th>score</th></tr>'
      ]
    },
    'td': {
      long: "One cell of data inside a row. colspan and rowspan let a cell stretch across its neighbours, which is how merged cells work and also how a table's structure quietly becomes hard to follow. If a cell is naming its column or its row rather than holding data, it should be a th.",
      examples: [
        '<td>100</td>',
        '<td colspan="2">total</td>'
      ]
    },
    'th': {
      long: "A header cell: it names a column or a row, and browsers render it bold and centred by default. The real value is invisible — with scope='col' or scope='row', a screen reader can announce 'score, 900' for each cell instead of reading out a bare number with no context.",
      examples: [
        '<th scope="col">score</th>',
        '<th scope="row">HTML</th>'
      ]
    },
    'form': {
      long: "Collects input and sends it somewhere. action is where it goes, method is how: GET puts the values in the URL, which is bookmarkable and ends up in server logs; POST puts them in the body, which is what you want for anything that changes state. A button inside a form submits by default, and that surprise page reload has cost everyone an afternoon.",
      examples: [
        '<form action="/save" method="post">\n  <input name="score">\n  <button>save</button>\n</form>',
        '<form action="/search" method="get">\n  <input name="q">\n</form>',
        'form.addEventListener("submit", e => {\n  e.preventDefault();\n});'
      ]
    },
    'input': {
      long: "A single form field, and the type attribute changes it completely: text, number, checkbox, radio, date, color, file, range. Choosing the right type is not cosmetic — on a phone it decides which keyboard appears, and the browser hands you validation for free. It is a void element with no closing tag.",
      examples: [
        '<input type="text" name="q" placeholder="search">',
        '<input type="number" name="hp" min="0" max="100">',
        '<input type="checkbox" name="sound" checked>'
      ]
    },
    'button': {
      long: "Something to click, and it arrives with everything you would otherwise have to rebuild by hand: keyboard focus, activation on Enter and Space, and an announcement that this is a control. Inside a form its default type is submit, so write type='button' when it is not meant to submit anything.",
      examples: [
        '<button>START</button>',
        '<button type="button" onclick="pause()">PAUSE</button>',
        '<button disabled>LOADING…</button>'
      ]
    },
    'label': {
      long: "Names a form field. Connect it with for pointing at the input's id, or simply wrap the input inside it, and two things happen: a screen reader reads the name together with the field, and clicking the label focuses or toggles the control. That larger hit area is why a labelled checkbox feels so much better on a phone.",
      examples: [
        '<label for="q">search</label>\n<input id="q" name="q">',
        '<label>\n  <input type="checkbox" name="sound"> sound\n</label>'
      ]
    },
    'select': {
      long: "A dropdown of predefined choices, filled with option elements. Use it when the list is long enough that radio buttons would be unwieldy; below about five choices radios are usually kinder, because everything is visible without a click. What gets submitted is the option's value attribute, not the text the visitor read.",
      examples: [
        '<select name="difficulty">\n  <option value="e">easy</option>\n  <option value="h" selected>hard</option>\n</select>',
        '<select multiple size="4">…</select>'
      ]
    },
    'option': {
      long: "One choice inside a select. The text between the tags is what a human reads; the value attribute is what is submitted, and leaving value off means the text is sent instead. selected marks the initial choice, and optgroup clusters related options under a heading.",
      examples: [
        '<option value="hard">hard</option>',
        '<option value="" disabled selected>choose…</option>'
      ]
    },
    'textarea': {
      long: "A multi-line text field. Unlike input it has a closing tag, and its initial content sits BETWEEN the tags rather than in a value attribute — every whitespace character in there is part of the text, which is why the opening tag and the content are written on the same line. rows and cols size it, though CSS usually overrides them.",
      examples: [
        '<textarea name="notes" rows="4"></textarea>',
        '<textarea name="bio">starting text</textarea>'
      ]
    },
    'header': {
      long: "The introductory band of a page or of a section: a title, a logo, sometimes the nav. It is not restricted to the top of the document — an article can carry its own header, and that is exactly what it is for. Being a landmark, assistive technology can jump to it, which a div could never offer.",
      examples: [
        '<header>\n  <h1>LIFE OF SOFTWARE</h1>\n</header>',
        '<article>\n  <header><h2>Patch notes</h2></header>\n</article>'
      ]
    },
    'footer': {
      long: "The closing band: credits, links, copyright, small print. Like header it belongs to whatever section contains it, so an article can end with its own footer holding the author and the date. It is also a landmark, so a screen reader user can jump straight to it.",
      examples: [
        '<footer>© 2026 Raiden Technology</footer>',
        '<article>\n  …\n  <footer>posted 25 July</footer>\n</article>'
      ]
    },
    'nav': {
      long: "The block of major navigation links. It is a landmark, so screen reader users can jump straight to it or skip past it — that is its entire purpose, and it is why not every group of links deserves one. A page may have several (site nav, in-page contents), in which case give each an aria-label so they can be told apart.",
      examples: [
        '<nav>\n  <a href="/">home</a>\n  <a href="/play">play</a>\n</nav>',
        '<nav aria-label="table of contents">…</nav>'
      ]
    },
    'section': {
      long: "A themed chunk of the page, and it should have a heading — that heading is what makes it a section rather than a div. The test is simple: if you cannot name it, you wanted a div. Nested sections deepen the document outline, so the heading levels inside should step down with them.",
      examples: [
        '<section id="about">\n  <h2>What is in it</h2>\n  <p>…</p>\n</section>',
        '<section aria-labelledby="rules">\n  <h2 id="rules">Rules</h2>\n</section>'
      ]
    },
    'article': {
      long: "A piece that would still make sense pulled out on its own: a blog post, a comment, a product card, a news item. That is the whole test — if it could be syndicated elsewhere and still read correctly it is an article, and if it only makes sense where it sits it is a section.",
      examples: [
        '<article>\n  <h2>Patch 1.2</h2>\n  <p>Boss fight rebalanced.</p>\n</article>',
        '<article>\n  <header><h3>comment by ada</h3></header>\n  <p>nice</p>\n</article>'
      ]
    },
    'main': {
      long: "The one block of content unique to this page, with the header, nav and footer that repeat everywhere deliberately left outside it. There is exactly one per document, and it is what a 'skip to content' link targets — probably the single most appreciated accessibility feature for anyone navigating by keyboard.",
      examples: [
        '<main>\n  <h1>Play</h1>\n  …\n</main>',
        '<a href="#main" class="skip">skip to content</a>\n<main id="main">…</main>'
      ]
    },
    'aside': {
      long: "Content beside the main point: a sidebar, a pull quote, related links, an ad. The test is whether removing it would damage the main content — if it would, it belongs inline instead. It is a landmark, so screen readers can skip it, which is exactly what you want for a box of tangential links.",
      examples: [
        '<aside>\n  <h2>Related</h2>\n  <ul>…</ul>\n</aside>',
        '<aside class="pull-quote">the clock is the enemy</aside>'
      ]
    },
    'h1': {
      long: "The top-level heading: what this page is. Headings form the outline a screen reader user navigates by, so their LEVELS matter far more than their size — never choose a heading tag because it looks the right size, style it in CSS instead. One h1 per page is the safe convention.",
      examples: [
        '<h1>LIFE OF SOFTWARE</h1>',
        'h1 { font-size: 2rem; letter-spacing: .04em }'
      ]
    },
    'h2': {
      long: "A section heading, one level below the h1. Do not skip levels: jumping from h1 straight to h3 leaves a hole in the outline that assistive tech reads as a missing section. If an h2 looks too heavy in your design, change the CSS rather than the tag.",
      examples: [
        '<h2>What is in it</h2>',
        '<section>\n  <h2>Controls</h2>\n  <p>…</p>\n</section>'
      ]
    },
    'h3': {
      long: "A sub-heading beneath an h2. By the time you are reaching for h4 and h5 the page is usually telling you it should be split, because almost nobody navigates six levels of outline. Keep the nesting shallow and make each heading describe what follows it.",
      examples: [
        '<h3>Keyboard</h3>',
        '<h2>Controls</h2>\n<h3>Keyboard</h3>\n<h3>Gamepad</h3>'
      ]
    },
    'br': {
      long: "A line break inside a block of text. It is correct where the break IS the content — a postal address, a line of a poem. It is wrong for spacing: a stack of br tags to push something down is what margin and padding are for, and it falls apart the moment the text reflows on a narrower screen.",
      examples: [
        'Raiden Technology<br>Istanbul',
        '<p>line one<br>line two</p>'
      ]
    },
    'hr': {
      long: "A thematic break: the topic changes here. It renders as a horizontal rule by default, but the meaning is the shift and not the line — if all you wanted was a line, that is a border in CSS. It takes no closing tag and holds no content.",
      examples: [
        '<hr>',
        'hr { border: none; border-top: 1px solid #333 }'
      ]
    },
    'strong': {
      long: "This matters. It renders bold, but the point is importance: a screen reader can announce it and search engines weigh it. If you only want something to LOOK bold, that is font-weight in CSS, and the tag for stylistic bold with no added importance is b.",
      examples: [
        '<strong>deprecated</strong> since 1.2',
        '<p><strong>Warning:</strong> this deletes your save.</p>'
      ]
    },
    'em': {
      long: "Stress this word — the kind of emphasis that changes a sentence when you read it aloud: it is YOUR clock. It renders italic, but as with strong the meaning comes first; i is the tag for italics with no emphasis, like a species name or a foreign phrase.",
      examples: [
        'it is <em>your</em> clock',
        '<p>Do <em>not</em> refresh.</p>'
      ]
    },
    'iframe': {
      long: "Embeds another whole page inside this one, with its own document, its own scripts and its own URL — this is exactly how itch.io runs browser games. It is also a security boundary: a cross-origin frame cannot read your page and you cannot read into it. sandbox and allow narrow further what the embedded page is permitted to do.",
      examples: [
        '<iframe src="game.html" width="960" height="540" title="the game"></iframe>',
        '<iframe src="https://example.com" sandbox="allow-scripts" title="demo"></iframe>'
      ]
    },
    'canvas': {
      long: "A blank grid of pixels you draw on from JavaScript — this game runs on one. Nothing inside it is an element, so nothing is selectable, searchable or reachable by a screen reader; that is the trade for drawing thousands of things per frame. Set width and height as ATTRIBUTES to size the pixel buffer, because CSS width only stretches the result afterwards.",
      examples: [
        '<canvas id="game" width="960" height="540"></canvas>',
        'const ctx = canvas.getContext("2d");\nctx.fillRect(0, 0, 100, 50);',
        '<canvas width="960" height="540" style="width:100%"></canvas>'
      ]
    },
    'video': {
      long: "Plays a video file, with controls, a poster image and looping all as plain attributes rather than a plugin. Browsers block autoplay with sound, so a decorative background video must also be muted — and playsinline, or iOS will take it fullscreen. Offer more than one source format if older browsers matter to you.",
      examples: [
        '<video src="clip.mp4" controls></video>',
        '<video src="bg.mp4" autoplay muted loop playsinline></video>',
        '<video controls poster="cover.jpg">\n  <source src="clip.webm" type="video/webm">\n  <source src="clip.mp4" type="video/mp4">\n</video>'
      ]
    },
    'audio': {
      long: "Plays a sound file. Browsers refuse to let a page make noise before the visitor has interacted with it, which is why game audio gets started inside the first click or keypress rather than on load. For many short overlapping effects the Web Audio API is the better tool; this element suits one long track.",
      examples: [
        '<audio src="hit.wav"></audio>',
        '<audio src="music.mp3" controls loop></audio>',
        'document.addEventListener("click", () => audio.play(), { once: true });'
      ]
    },
    'doctype': {
      long: "The very first line of the file. It is not a tag and has no closing partner: its only job is to put the browser in standards mode. Leave it out and you get quirks mode, a bug-compatible emulation of 1990s browsers where box sizing and layout follow different rules and your CSS quietly misbehaves.",
      examples: [
        '<!DOCTYPE html>',
        '<!DOCTYPE html>\n<html lang="en">\n  <head>…</head>\n  <body>…</body>\n</html>'
      ]
    }
  },

  CSS: {
    'color': {
      long: "Sets the colour of the TEXT — the background is a separate property, and swapping the two is a first-hour mistake. It inherits, so setting it once on body colours everything that does not override it, and currentColor lets borders and SVG icons follow along automatically. Contrast against the background is a requirement rather than taste: aim for at least 4.5:1 on body text.",
      examples: [
        'color: #dcdcaa;',
        'body { color: #ddd }   /* inherited by everything inside */',
        'border: 1px solid currentColor;'
      ]
    },
    'background': {
      long: "What sits behind the content: a colour, an image, a gradient, or several layered together. It is a SHORTHAND, so writing `background: red` also resets background-image and everything else it covers — which is how a gradient you set earlier silently disappears. Write background-color when you only mean the colour.",
      examples: [
        'background: #1e1e1e;',
        'background: linear-gradient(#222, #111);',
        'background: url(grid.png) repeat, #1e1e1e;'
      ]
    },
    'margin': {
      long: "Space OUTSIDE the box, pushing neighbours away. Two quirks define it: vertical margins between stacked elements COLLAPSE into one, the larger winning rather than the two adding up, and `margin: 0 auto` centres a block that has a width. Flex and grid children do not collapse margins, and there gap is almost always the better tool.",
      examples: [
        'margin: 0 auto;',
        'margin: 12px 0;   /* top and bottom only */',
        'margin-block: 1rem;   /* logical: follows writing direction */'
      ]
    },
    'padding': {
      long: "Space INSIDE the box, between the border and the content. It is what makes a button comfortable to press and text readable inside a card. Under the default box model padding ADDS to the declared width, which is the classic 'my 100% column overflows' bug — set box-sizing: border-box globally and width means the whole box instead.",
      examples: [
        'padding: 12px;',
        'padding: 8px 16px;   /* vertical, horizontal */',
        '*, *::before, *::after { box-sizing: border-box }'
      ]
    },
    'border': {
      long: "The line around the box: width, style and colour. The style is not optional — `border: 1px #333` draws absolutely nothing, because the default style is none. Borders take up layout space, so adding one on hover shifts the page; declare a transparent border up front and only change its colour, or use outline, which does not affect layout.",
      examples: [
        'border: 1px solid #333;',
        'border-bottom: 2px solid currentColor;',
        '.btn { border: 1px solid transparent }\n.btn:hover { border-color: #666 }'
      ]
    },
    'width': {
      long: "How wide the box is. A fixed pixel width is the thing that breaks on a phone, so reach first for a percentage, a max-width, or simply letting the box size itself. `width: 100%` plus padding overflows under the default box model, so either set box-sizing: border-box or use max-width: 100% instead.",
      examples: [
        'width: 960px;',
        'max-width: 960px;\nwidth: 100%;',
        'img { max-width: 100%; height: auto }'
      ]
    },
    'height': {
      long: "How tall the box is — riskier to fix than width, because content grows and text wraps in ways you did not plan, and a fixed height plus one extra line equals overflow. Prefer min-height so the box can grow with its content. And `height: 100%` only does anything if every ancestor up the chain also has a height.",
      examples: [
        'min-height: 100vh;',
        'height: 540px;',
        'html, body { height: 100% }   /* needed before a child height: 100% works */'
      ]
    },
    'display': {
      long: "What KIND of box this is, and the single most consequential property in CSS. block takes a full line, inline flows inside text, flex and grid turn the element into a layout container for its children, and none removes it from the page entirely. Nearly every 'why will this not line up' question is answered by reading display first.",
      examples: [
        'display: flex;',
        'display: grid;',
        'display: none;   /* gone, and takes no space */'
      ]
    },
    'flex': {
      long: "One-dimensional layout: children lay out along a row or a column and share the space on it. justify-content works along the main axis and align-items across it — and the moment you set flex-direction: column those two swap orientation, which is why they feel backwards half the time. On a child, `flex: 1` means take an equal share of what is left over.",
      examples: [
        'display: flex;\ngap: 8px;\nalign-items: center;',
        'display: flex;\njustify-content: space-between;',
        '.main { flex: 1 }   /* fills the remaining space */'
      ]
    },
    'grid': {
      long: "Two-dimensional layout: real rows and columns you declare up front and place children into. Use it for page structure and galleries, and flex for things that simply need to sit in a line. The fr unit means 'a share of the free space', and repeat(auto-fit, minmax(...)) gives you a responsive gallery with no media query at all.",
      examples: [
        'display: grid;\ngrid-template-columns: 200px 1fr;\ngap: 16px;',
        'grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));',
        'grid-column: 1 / -1;   /* span every column */'
      ]
    },
    'position': {
      long: "How the box is placed. static is the default and ignores offsets; relative keeps its space and lets you nudge it; absolute lifts it out of the flow and measures against the nearest positioned ancestor; fixed pins it to the viewport; sticky switches between relative and fixed at a threshold. The rule people miss is that top, right, bottom and left do nothing on a static element.",
      examples: [
        'position: relative;',
        '.wrap { position: relative }\n.badge { position: absolute; top: 4px; right: 4px }',
        'position: sticky;\ntop: 0;'
      ]
    },
    'absolute': {
      long: "Taken out of the normal flow and positioned against the nearest ancestor that is itself positioned — if there is none, that is the page. Everything else lays out as though the box did not exist, which is why absolute elements overlap so easily. The habitual pairing is position: relative on the container and position: absolute on the thing inside it.",
      examples: [
        '.wrap { position: relative }\n.badge { position: absolute; top: 0; right: 0 }',
        'position: absolute;\ninset: 0;   /* fill the positioned parent */'
      ]
    },
    'relative': {
      long: "Stays exactly where it was in the flow, keeping its space reserved, but can be nudged with offsets — which moves the paint without moving anything around it. Its more important job is silent: it becomes the anchor that absolutely positioned children measure against, and it creates a stacking context for z-index.",
      examples: [
        'position: relative;\ntop: 2px;',
        '.card { position: relative }   /* anchor for an absolute badge */'
      ]
    },
    'fixed': {
      long: "Pinned to the viewport, so it does not scroll away: it is positioned against the window rather than the document. Sticky headers, cookie bars and modal backdrops are all built on it. One catch costs everybody an afternoon eventually — a transform, filter or will-change on ANY ancestor makes fixed position against that ancestor instead of the window.",
      examples: [
        'position: fixed;\nbottom: 0;\nleft: 0;\nright: 0;',
        'position: fixed;\ninset: 0;\nbackground: rgba(0,0,0,.6);   /* modal backdrop */'
      ]
    },
    'sticky': {
      long: "Scrolls along normally until it reaches the offset you gave it, then holds there while the rest of the container scrolls past. It needs a threshold — `position: sticky` with no top, bottom, left or right does nothing at all. It also only sticks inside its own parent, so an overflow set anywhere up the tree quietly kills it.",
      examples: [
        'position: sticky;\ntop: 0;',
        'th { position: sticky; top: 0; background: #1e1e1e }'
      ]
    },
    'float': {
      long: "The old way to make text wrap around a box. It was CSS's only real layout tool for years, and whole frameworks were built on it plus clearfix hacks, all of which flex and grid have replaced. What it is still genuinely good at is the job it was designed for: an image with paragraph text flowing around it.",
      examples: [
        'float: left;\nmargin-right: 12px;',
        'img.portrait { float: right; shape-outside: circle() }'
      ]
    },
    'clear': {
      long: "Stops an element sitting alongside a floated neighbour and pushes it below instead. It exists because floats leave the normal flow, so a container of nothing but floats collapses to zero height and its background vanishes. Modern code rarely needs it: `display: flow-root` on the container solves the same problem in one line.",
      examples: [
        'clear: both;',
        '.container { display: flow-root }   /* the modern clearfix */'
      ]
    },
    'font': {
      long: "The shorthand for the whole typographic stack — style, weight, size, line-height and family, in that order. Being a shorthand it RESETS everything it covers, and it is ignored entirely unless you give both a size and a family, which is why most code sets font-family, font-size and line-height separately. Always end the family list with a generic fallback.",
      examples: [
        'font: 14px/1.5 monospace;',
        'font-family: Consolas, "Courier New", monospace;',
        'font-weight: 700;'
      ]
    },
    'hover': {
      long: "Applies while the pointer is over the element. It is feedback that something is interactive, so it belongs on links and buttons and rarely anywhere else. Touch screens have no hover at all — anything reachable ONLY on hover is invisible on a phone, which is exactly how drop-down menus become unusable there.",
      examples: [
        'a:hover { color: #fff }',
        '.btn:hover { background: #333 }',
        '@media (hover: hover) {\n  .card:hover { transform: translateY(-2px) }\n}'
      ]
    },
    'focus': {
      long: "Applies while the element has keyboard focus. The ring browsers draw is not decoration: removing it with `outline: none` makes a page unusable for anyone navigating by keyboard, and it is one of the most common accessibility failures on the web. If the default is ugly, replace it with something visible, and use :focus-visible so it only appears for keyboard users.",
      examples: [
        'input:focus { outline: 2px solid #4ec9b0 }',
        'button:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}',
        ':focus { outline: none }   /* never on its own */'
      ]
    },
    'active': {
      long: "Applies during the press itself, between the button going down and coming back up. A small change here — a slight scale, a darker shade — makes a control feel physical, and its absence is a large part of why some interfaces feel dead. It must come after :hover in the stylesheet, since they share specificity.",
      examples: [
        'button:active { transform: scale(.98) }',
        'a:hover { color: #fff }\na:active { color: #ff0 }'
      ]
    },
    'before': {
      long: "Inserts a generated pseudo-element as the FIRST child of the element. It does nothing at all without a content property, even an empty one, which is the mistake everyone makes exactly once. Use it for decoration — icons, quote marks, overlays — and never for text that matters, since generated content cannot be selected and is unreliable for screen readers.",
      examples: [
        'a::before { content: "→ " }',
        '.card::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background: rgba(0,0,0,.4);\n}'
      ]
    },
    'after': {
      long: "The same idea as ::before but inserted as the LAST child. The classic uses are a trailing icon on external links, a decorative underline you can animate, and the old clearfix. Like ::before it needs content, and neither works on void elements such as img or input, which have no children to insert into.",
      examples: [
        'a[target="_blank"]::after { content: " ↗" }',
        '.underline::after {\n  content: "";\n  display: block;\n  height: 2px;\n  background: currentColor;\n}'
      ]
    },
    'transform': {
      long: "Moves, rotates, scales or skews the element as it is PAINTED, without disturbing the layout around it — nothing reflows, so it is cheap and often runs on the GPU. That is why translate and scale are the right things to animate, while animating top or width forces a full layout pass every frame. Order matters: rotate then translate is not the same as translate then rotate.",
      examples: [
        'transform: rotate(45deg);',
        'transform: translate(-50%, -50%);   /* the centring trick */',
        'transform: translateY(-2px) scale(1.02);'
      ]
    },
    'transition': {
      long: "Animates a property smoothly whenever its value changes. Declare it on the base state rather than inside :hover, so it eases on the way out as well as in. `transition: all` is a trap — it animates properties you never intended and quietly costs performance, so list the ones you actually mean.",
      examples: [
        'transition: opacity .2s ease;',
        '.btn { transition: background .15s, transform .15s }',
        '@media (prefers-reduced-motion: reduce) {\n  * { transition: none !important }\n}'
      ]
    },
    'animation': {
      long: "Runs a named @keyframes sequence — what you use when a transition is not enough: something that loops, has several stages, or must start with no state change to trigger it. Watch the fill mode, because without `forwards` the element snaps back to its starting style the instant it ends. Honour prefers-reduced-motion; for some people motion is not taste but nausea.",
      examples: [
        '@keyframes pulse {\n  from { opacity: 1 }\n  to   { opacity: .4 }\n}\n.dot { animation: pulse 1s infinite alternate }',
        'animation: fade .3s ease forwards;'
      ]
    },
    'opacity': {
      long: "How see-through the element is, from 0 to 1. It applies to the WHOLE element including its text, so you cannot fade a background this way and keep the words solid — an rgba background colour is how you do that. Any value below 1 also creates a new stacking context, which is a very common reason a z-index suddenly stops working.",
      examples: [
        'opacity: .55;',
        'background: rgba(0, 0, 0, .5);   /* fades only the background */',
        '.hidden { opacity: 0; pointer-events: none }'
      ]
    },
    'z-index': {
      long: "Who is painted on top when boxes overlap. It only applies to positioned elements and flex/grid children, and it is not global: an element only competes with its siblings inside the same stacking context, which is why z-index 9999 can still sit behind something with 1. opacity, transform and filter each create a new context, and that is usually the culprit.",
      examples: [
        'position: relative;\nz-index: 40;',
        '.modal { position: fixed; z-index: 100 }',
        '.parent { opacity: .99 }   /* new stacking context: children are trapped inside */'
      ]
    },
    'overflow': {
      long: "What happens to content too big for its box: visible (spills, the default), hidden (clipped), scroll, or auto (a scrollbar only when needed). Anything other than visible also turns the element into a scroll container, which is what silently breaks a sticky child further down. An `overflow: hidden` on some ancestor is the usual reason a dropdown gets cut off.",
      examples: [
        'overflow: hidden;',
        'overflow-y: auto;\nmax-height: 300px;',
        'overflow-x: auto;   /* let a wide table scroll by itself */'
      ]
    },
    'cursor': {
      long: "Which pointer to show over the element. Its real job is honesty about what is interactive: pointer on something clickable, not-allowed on something disabled. If you are adding pointer to a div, ask whether it should have been a button — you would get keyboard support, focus and the cursor together, for free.",
      examples: [
        'cursor: pointer;',
        'button[disabled] { cursor: not-allowed }',
        'cursor: grab;'
      ]
    },
    'align': {
      long: "The cross-axis family. align-items on the container sets how every child lines up across the axis, align-self overrides it for one child, and align-content distributes whole rows when the content wraps onto several lines. In a flex row that direction is vertical — until flex-direction: column flips it.",
      examples: [
        'align-items: center;',
        'align-self: flex-end;',
        'display: grid;\nplace-items: center;   /* align and justify in one */'
      ]
    },
    'justify': {
      long: "The main-axis family. justify-content spreads children ALONG the axis: start, center, space-between, space-around, space-evenly. In a flex row that is horizontal, in a column vertical. Grid adds justify-items and justify-self, which position an item inside its own cell rather than distributing the tracks.",
      examples: [
        'justify-content: space-between;',
        'display: flex;\njustify-content: center;\nalign-items: center;',
        'justify-self: end;   /* grid: inside its own cell */'
      ]
    },
    'gap': {
      long: "Space between flex or grid children, and only between them: no trailing margin on the last one, nothing to reset. It replaced a whole generation of `.item + .item { margin-left }` tricks. Row and column gaps can be given separate values, and it works in flexbox in every current browser.",
      examples: [
        'gap: 12px;',
        'gap: 8px 16px;   /* row gap, then column gap */',
        'display: flex;\nflex-wrap: wrap;\ngap: 8px;'
      ]
    },
    'rem': {
      long: "A length relative to the ROOT font size — 1rem is whatever html is set to, normally 16px. Sizing in rem means the entire layout scales when someone raises their browser's default text size, which is why it matters for accessibility and why you should never pin html to a pixel value. em is its cousin, relative to the CURRENT element, so nested ems multiply and run away.",
      examples: [
        'padding: 1.5rem;',
        'font-size: .875rem;   /* 14px at the default root size */',
        'html { font-size: 100% }   /* leave the user their preference */'
      ]
    },
    'vh': {
      long: "One percent of the viewport HEIGHT, so 100vh is exactly one screen tall. On mobile it has a famous flaw: 100vh counts the area behind the browser's address bar, so a full-height layout gets clipped as that bar hides and reappears. The newer dvh unit tracks the genuinely visible height and is the fix.",
      examples: [
        'min-height: 100vh;',
        'min-height: 100dvh;   /* mobile-safe */',
        'height: calc(100vh - 60px);'
      ]
    },
    'vw': {
      long: "One percent of the viewport WIDTH. It underpins fluid type, but alone it will shrink text to unreadable on a phone or inflate it on a wide monitor, so clamp() with a floor and a ceiling is the usual form. Note that vw includes the scrollbar, which is exactly why 100vw so often causes a horizontal scrollbar of its own.",
      examples: [
        'width: 50vw;',
        'font-size: clamp(1rem, 2.5vw, 2rem);',
        'width: 100%;   /* usually safer than 100vw */'
      ]
    },
    'rgba': {
      long: "A colour plus an alpha channel: red, green, blue and how opaque. Unlike opacity it fades only the thing it is applied to, so a semi-transparent background keeps its text fully solid. Modern CSS writes the same thing as rgb(0 0 0 / 50%), and hsl is often easier to reason about when you want a lighter or darker version of one hue.",
      examples: [
        'background: rgba(0, 0, 0, .5);',
        'box-shadow: 0 2px 8px rgba(0, 0, 0, .35);',
        'color: rgb(255 255 255 / 60%);'
      ]
    },
    'calc': {
      long: "Does arithmetic across units the browser only resolves at layout time — percentages, viewport units and pixels in one expression. That is the whole point: calc(100% - 40px) is something no static value can express. Whitespace around + and - is required, and it composes with custom properties, which is where it gets genuinely powerful.",
      examples: [
        'width: calc(100% - 40px);',
        'height: calc(100vh - var(--header-h));',
        'padding: calc(1rem + 2px);'
      ]
    },
    'media': {
      long: "Applies rules only under certain conditions: a screen width, print, dark mode, reduced motion. Mobile-first means writing the small-screen rules plainly and adding min-width queries as the screen grows, which keeps the phone case the simple one. Choose breakpoints where YOUR layout actually breaks, not from a list of device widths.",
      examples: [
        '@media (max-width: 600px) {\n  .sidebar { display: none }\n}',
        '@media (prefers-color-scheme: dark) {\n  :root { --bg: #1e1e1e }\n}',
        '@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important }\n}'
      ]
    },
    'important': {
      long: "Forces a declaration to win regardless of specificity. It is a last resort because it starts an arms race: the only thing that beats an !important is another !important, and a stylesheet full of them can no longer be reasoned about. The honest fixes are a more specific selector, a later rule, or working out why the losing rule was written that way.",
      examples: [
        'color: red !important;',
        '.theme-dark .btn { background: #222 }   /* specificity instead */'
      ]
    },
    'inherit': {
      long: "Take whatever value the parent computed for this property. Some properties inherit by default (color, font, line-height) and most do not (margin, border, background), so this keyword is how you opt in explicitly. Its most useful everyday job is making form controls follow the page, since inputs and buttons do not inherit fonts unless told to.",
      examples: [
        'color: inherit;',
        'button, input, select { font: inherit }',
        'a { color: inherit; text-decoration: none }'
      ]
    },
    'initial': {
      long: "Resets a property to the value the CSS specification defines, ignoring both the parent and any earlier rule. Careful: that spec default is often not what you see, because the browser's own stylesheet already changed it — `display: initial` means inline, not whatever the element normally is. `revert` goes back to the browser default and is usually what people actually wanted.",
      examples: [
        'all: initial;',
        'display: initial;   /* inline, probably not what you meant */',
        'all: revert;   /* back to the browser default */'
      ]
    },
    'none': {
      long: "Turns something off, and what that means depends on the property. `display: none` removes the element completely — no space, and invisible to screen readers, unlike visibility: hidden which keeps its space. `border: none` draws no border, `list-style: none` removes bullets, `text-decoration: none` removes the underline.",
      examples: [
        'display: none;',
        'list-style: none;',
        'text-decoration: none;'
      ]
    },
    'auto': {
      long: "Let the browser work it out — and it means something different per property. On margin it splits the leftover space, which is why `margin: 0 auto` centres a block that has a width. On width and height it means size to the content. On overflow it means show a scrollbar only when one is actually needed.",
      examples: [
        'margin: 0 auto;',
        'overflow-y: auto;',
        'grid-template-columns: auto 1fr;'
      ]
    },
    'block': {
      long: "The element takes a full line of its own and accepts width, height and vertical margins. div, p and h1 are block by default; span and a are not, which is why setting a height on a link seems to do nothing until you change its display. inline-block is the middle ground: it sits in a line but takes box properties.",
      examples: [
        'display: block;',
        'a.btn { display: inline-block; padding: 8px 16px }',
        'img { display: block }   /* removes the mysterious gap underneath */'
      ]
    },
    'inline': {
      long: "The element sits inside a line of text and flows with it. Width, height and vertical margins are ignored on inline boxes, which answers most 'why will this span not resize' questions. Horizontal padding does apply but does not push the surrounding lines apart, so it can overlap the line above.",
      examples: [
        'display: inline;',
        'display: inline-block;   /* flows in a line, but takes width and height */',
        'display: inline-flex;'
      ]
    },
    'hidden': {
      long: "Invisible but still taking up its space — that is visibility: hidden, and the contrast with display: none, which removes the box entirely, is the thing to remember. The same word also appears as overflow: hidden, which clips whatever spills out, and as the HTML hidden attribute, which behaves closer to display: none.",
      examples: [
        'visibility: hidden;',
        'overflow: hidden;',
        '<div hidden>…</div>'
      ]
    },
    'root': {
      long: ":root selects the document root, which in an HTML page is the html element. It is where custom properties are conventionally declared, because everything inherits from there and can read them back with var(). It also carries slightly higher specificity than a plain html selector, which makes it a convenient home for defaults you intend to override lower down.",
      examples: [
        ':root {\n  --bg: #1e1e1e;\n  --fg: #dcdcaa;\n}',
        'body { background: var(--bg); color: var(--fg) }',
        ':root { font-size: 100% }'
      ]
    },
    'var': {
      long: "Reads a CSS custom property. Unlike a preprocessor variable this one is LIVE: it inherits down the tree, can be redefined per element or changed from JavaScript at runtime, and every rule reading it updates immediately — which is what makes theming and dark mode a couple of lines rather than a rebuild. The second argument is a fallback for when the property is not set.",
      examples: [
        'color: var(--fg);',
        'color: var(--fg, #ddd);   /* fallback if --fg is missing */',
        'document.documentElement.style.setProperty("--bg", "#000");'
      ]
    }
  },

  PYTHON: {
    'nonlocal': {
      long: "Lets a nested function ASSIGN to a variable in the enclosing function instead of quietly creating a new local one. Without it, `n += 1` inside the inner function makes a fresh local and the outer n never moves — which is the entire reason the keyword exists. It is not global: global reaches the module level, nonlocal reaches the nearest enclosing function that already has that name.",
      examples: [
        'def counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc',
        'c = counter()\nc()   # 1\nc()   # 2'
      ]
    },
    'del': {
      long: "Removes a NAME, not necessarily an object: `del x` unbinds the name, and the object is only freed once nothing else refers to it. On a container it deletes an item — del d[key], del xs[2] — and on a slice it removes a whole range at once. Deleting from a list while looping over it skips elements, which is why you build a new list instead.",
      examples: [
        'del cache[key]',
        'del xs[1:3]   # remove a slice',
        'xs = [x for x in xs if keep(x)]   # instead of deleting mid-loop'
      ]
    }
  },

  JAVASCRIPT: {
    'document': {
      long: "Your handle on the live page: every element and text node, plus the methods to search and change them. querySelector takes a CSS selector and is the modern way in, while getElementById is the fast path when you have an id. Reading layout values such as offsetWidth or getBoundingClientRect forces the browser to recalculate, so doing it inside a loop is how a smooth page becomes a slideshow.",
      examples: [
        'document.getElementById("game")',
        'document.querySelectorAll(".card")',
        'document.addEventListener("keydown", e => console.log(e.key));'
      ]
    },
    'window': {
      long: "The browser tab itself, and the global object — every top-level var and function declaration ends up on it. Timers, the URL, history, and resize and blur events all hang off it. It does not exist in a worker or in Node, which is why library code checks for it before touching anything browser-specific.",
      examples: [
        'window.addEventListener("resize", onResize);',
        'window.location.href',
        'window.requestAnimationFrame(tick);'
      ]
    },
    'promise': {
      long: "An object standing in for a value that is not ready yet. It is pending, then either fulfilled or rejected, and it settles exactly ONCE — so the callbacks you attach with .then and .catch each run at most once. Async/await is sugar over this machinery, and a rejected promise with no handler produces an unhandled rejection that can bring down a Node process.",
      examples: [
        'new Promise((resolve, reject) => {\n  setTimeout(() => resolve(42), 100);\n});',
        'fetch(url)\n  .then(r => r.json())\n  .catch(err => console.warn(err));',
        'const [a, b] = await Promise.all([loadA(), loadB()]);'
      ]
    },
    'fetch': {
      long: "Asks the network for something and hands back a promise. The single most common surprise: it only rejects on a NETWORK failure, so a 404 or a 500 resolves perfectly happily and you must check response.ok yourself. The body arrives separately, which is why almost every call has two awaits — one for the response, one for .json().",
      examples: [
        'const r = await fetch("/api/scores");\nif (!r.ok) throw new Error(r.status);\nconst data = await r.json();',
        'await fetch("/save", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(save),\n});'
      ]
    },
    'undefined': {
      long: "A name that exists but was never given a value — different from null, which is an absence somebody chose deliberately. You get it from an unset variable, a missing property, a function that returns nothing, and a parameter nobody passed. That is exactly why `== null` (which matches both) and ?? (which falls back on both) are so useful in practice.",
      examples: [
        'let x;\nx;   // undefined',
        'obj.missing;   // undefined, no error',
        'const port = cfg.port ?? 8080;   // covers null and undefined'
      ]
    },
    'json': {
      long: "The text format the web moves structured data in: objects, arrays, strings, numbers, booleans, null, and nothing else. JSON.stringify turns a value into that text and JSON.parse turns it back — and parse throws on malformed input, so it belongs inside a try. What it cannot represent silently disappears: functions and undefined vanish, and Dates come back as strings.",
      examples: [
        'const text = JSON.stringify(save);',
        'const save = JSON.parse(text);',
        'JSON.stringify(save, null, 2)   // pretty-printed'
      ]
    },
    'settimeout': {
      long: "Runs a function once, after AT LEAST the delay you gave. 'At least' is the important part: it queues the callback, which cannot run until the current work finishes, so setTimeout(fn, 0) means 'as soon as the stack clears'. For anything drawn per frame use requestAnimationFrame instead — it syncs with the display and pauses in a hidden tab.",
      examples: [
        'setTimeout(tick, 500);',
        'const id = setTimeout(warn, 3000);\nclearTimeout(id);',
        'requestAnimationFrame(loop);'
      ]
    },
    'localstorage': {
      long: "Key-value storage in the browser that survives closing the tab, scoped to one origin. It holds STRINGS only, so objects go through JSON.stringify on the way in and JSON.parse on the way out. It is synchronous, capped at a few megabytes, and can throw when the quota is full or in private mode — so wrap the write if losing it would matter.",
      examples: [
        'localStorage.setItem("best", String(score));',
        'const best = Number(localStorage.getItem("best") ?? 0);',
        'localStorage.setItem("save", JSON.stringify(state));'
      ]
    },
    'console': {
      long: "The developer log, and the fastest route to finding out what actually happened. console.log is the workhorse, but the rest earn their keep: table for arrays of objects, time and timeEnd for a quick measurement, warn and error for things that should stand out. Logging an object stores a live reference in some browsers, so what you expand later may not be what it was when you logged it.",
      examples: [
        'console.log({ hp, x, y });',
        'console.table(players);',
        'console.time("draw");\ndraw();\nconsole.timeEnd("draw");'
      ]
    }
  },

  LUA: {
    'local': {
      long: "Keeps a variable in the current scope. Leave it off and Lua makes the variable GLOBAL, silently — which is the language's most common bug, because a mistyped name becomes a brand new global instead of an error. Locals are also measurably faster than globals, so caching a library function in a local at the top of a hot file is standard Lua practice.",
      examples: [
        'local hp = 100',
        'local function tick(dt)\n  t = t + dt\nend',
        'local floor = math.floor   -- cached for speed'
      ]
    },
    'ipairs': {
      long: "Walks an array-style table in order from index 1 and STOPS at the first nil. That makes it right for dense arrays and wrong for tables with holes, where it will quietly visit only the first few elements. Lua indexes from 1 rather than 0, which is the detail that catches nearly everyone arriving from another language.",
      examples: [
        'for i, v in ipairs(xs) do\n  print(i, v)\nend',
        't = {"a", "b", nil, "d"}\n-- ipairs stops after "b"'
      ]
    },
    'pairs': {
      long: "Walks EVERY key of a table, string keys included, in no defined order — and that order can differ between runs, so never rely on it. Use it for dictionary-style tables and ipairs when array order matters. Adding new keys while iterating with pairs is undefined behaviour; removing one by assigning nil is allowed.",
      examples: [
        'for k, v in pairs(t) do\n  print(k, v)\nend',
        't = { hp = 100, name = "raiden" }\nfor k in pairs(t) do print(k) end'
      ]
    },
    'tostring': {
      long: "Turns any value into text, including nil and tables, so it never fails the way a bare concatenation can. That is its everyday job: \"hp: \" .. hp errors when hp is nil, while tostring(hp) gives you the string 'nil' and carries on. A table can define __tostring in its metatable to decide what it becomes.",
      examples: [
        'print(tostring(hp))',
        'print("hp: " .. tostring(hp))   -- safe even when hp is nil',
        'setmetatable(p, { __tostring = function(s) return "Ship" end })'
      ]
    },
    'tonumber': {
      long: "Turns text into a number and hands back nil rather than raising when it cannot. That nil IS the validation: `local n = tonumber(s); if not n then ... end` is the idiomatic way to check input. It also takes a base, so tonumber('ff', 16) gives 255.",
      examples: [
        'n = tonumber("42")',
        'local n = tonumber(input)\nif not n then\n  print("not a number")\nend',
        'tonumber("ff", 16)   -- 255'
      ]
    },
    'repeat': {
      long: "Runs the body and only then tests, so it always executes at least once — Lua's do/while. The condition after `until` is the STOP condition, the opposite way round from while: the loop keeps going while it is false. Unusually, locals declared inside the body are still in scope in the until expression.",
      examples: [
        'repeat\n  tick()\nuntil done',
        'repeat\n  local line = io.read()\nuntil line == "quit"'
      ]
    },
    'table': {
      long: "The only data structure Lua has: array and dictionary at once, and also how modules, objects and classes are built. Integer keys from 1 form the array part, everything else lands in a hash part, and both live in the same value. The real power is the metatable — __index gives you inheritance, and that is the entire basis of object orientation in Lua.",
      examples: [
        't = { hp = 100, "first", "second" }',
        'table.insert(xs, 4)\ntable.remove(xs, 1)',
        'setmetatable(obj, { __index = Base })'
      ]
    },
    'do': {
      long: "In Lua this is NOT a loop. On its own it opens a plain block, which is how you give a local a tight scope, and after for or while it is simply the word that starts the body — closed with end. Lua's do/while equivalent is repeat ... until.",
      examples: [
        'do\n  local tmp = compute()\n  use(tmp)\nend',
        'for i = 1, 10 do\n  print(i)\nend',
        'while running do\n  tick()\nend'
      ]
    }
  },

  RUBY: {
    'puts': {
      long: "Prints with a newline, adding one only if the string does not already end in one. Given an array it prints each element on its own line, which surprises everyone once. Its relatives matter: print writes with no newline, and p writes the inspect form — quotes, nil, structure — which is what you actually want while debugging.",
      examples: [
        'puts "hello"',
        'puts [1, 2, 3]   # three lines',
        'p "hello"        # prints "hello" with the quotes'
      ]
    },
    'attr_accessor': {
      long: "Generates the getter and the setter for an instance variable so you do not write them by hand. attr_reader makes it read-only and attr_writer write-only, and reaching for the narrowest of the three is the habit worth building. It takes symbols, and writing a real method of the same name afterwards simply replaces the generated one.",
      examples: [
        'class Ship\n  attr_accessor :hp\nend',
        'attr_reader :id, :name',
        's = Ship.new\ns.hp = 100\ns.hp'
      ]
    },
    'to_s': {
      long: "The string form of an object, which Ruby calls implicitly whenever you interpolate it or hand it to puts. Defining it is how your class prints as something readable rather than an object address. Its partner is inspect, used by p and in the console, which should reveal the internals for a developer rather than a friendly label.",
      examples: [
        'class Ship\n  def to_s\n    "Ship(hp=#{@hp})"\n  end\nend',
        'puts ship       # calls to_s',
        '"hp: #{ship}"   # interpolation calls to_s too'
      ]
    },
    'unless': {
      long: "if NOT — it exists because `unless ready` reads better aloud than `if !ready`. Keep it for a simple positive condition: unless with an else clause, or with a compound condition, is genuinely harder to read than the if it replaced. Its trailing form is the idiomatic guard clause.",
      examples: [
        'unless alive\n  respawn\nend',
        'return unless user',
        'puts "empty" unless xs.any?'
      ]
    },
    'lambda': {
      long: "One of Ruby's two flavours of anonymous function, and the strict one: it checks its argument count, and a return inside it returns from the lambda. A proc is loose about both — its return returns from the enclosing METHOD, which is a genuine source of surprise. The stabby arrow is the usual spelling now.",
      examples: [
        'square = ->(x) { x * x }\nsquare.call(4)',
        'add = lambda { |a, b| a + b }\nadd.(1, 2)',
        'xs.map(&square)'
      ]
    },
    'do': {
      long: "In Ruby, do ... end delimits a BLOCK: a chunk of code handed to a method, which runs it with yield. It means the same thing as braces, and the convention is braces for one-liners and do/end for anything multi-line. Blocks are everywhere — each, map, times, File.open — and they are a large part of why the language reads the way it does.",
      examples: [
        'xs.each do |x|\n  puts x\nend',
        '3.times { |i| puts i }',
        'File.open(path) do |f|\n  puts f.read\nend   # closed automatically'
      ]
    }
  },

  PHP: {
    'echo': {
      long: "Sends text straight to the output, which in a web request means the page. It is a language construct rather than a function, so it needs no parentheses and accepts several comma-separated arguments — marginally cheaper than joining them first. Always escape anything that came from a user with htmlspecialchars, or you have written an XSS hole.",
      examples: [
        'echo "hello";',
        'echo "hp: ", $hp, "\\n";',
        '<p><?= htmlspecialchars($name) ?></p>'
      ]
    },
    'isset': {
      long: "Does this variable exist AND hold something other than null? It is the safe way to read anything that might not be there — a query parameter, an array key — because touching a missing key directly emits a warning. It takes a variable rather than an expression, and a variable holding null counts as not set.",
      examples: [
        'if (isset($_GET["id"])) { … }',
        '$id = $_GET["id"] ?? 0;   // the modern shorthand',
        'if (isset($a["x"]["y"])) { … }   // checks the whole chain'
      ]
    },
    'empty': {
      long: "True when the value is missing OR falsy: null, false, 0, the string '0', an empty string and an empty array all count. That breadth is the trap — empty($qty) is true for a deliberate zero, which is how quantities and page numbers go wrong. Use isset when you mean 'is it there' and an explicit comparison when you mean 'is it zero'.",
      examples: [
        'if (empty($name)) { … }',
        'empty("0");   // true — the classic surprise',
        'if (!isset($qty)) { … }   // when 0 is a legitimate value'
      ]
    },
    'array': {
      long: "PHP's array is an ordered MAP: keys are integers or strings, insertion order is preserved, and the one type serves as list, dictionary, stack and queue. That is why it is everywhere, and also why performance surprises happen — it is a hash table wearing a list's clothes. Modern code writes it with square brackets and walks it with foreach.",
      examples: [
        '$a = ["hp" => 100, "name" => "raiden"];',
        '$xs = [1, 2, 3];\n$xs[] = 4;   // append',
        'foreach ($a as $key => $value) { … }'
      ]
    },
    'foreach': {
      long: "Walks every element of an array or iterable, optionally handing you the key as well as the value. Taking the value BY REFERENCE lets you modify the array in place, and it leaves that reference dangling after the loop — the classic PHP bug where the last element gets duplicated, cured by unset() straight afterwards.",
      examples: [
        'foreach ($xs as $x) { … }',
        'foreach ($a as $key => $value) { … }',
        'foreach ($xs as &$x) { $x *= 2; }\nunset($x);   // always do this'
      ]
    },
    '.=': {
      long: "Appends to a string in place: $out .= $line is shorthand for $out = $out . $line. Building HTML or a report this way is idiomatic PHP, though for a large loop collecting into an array and imploding at the end allocates far less. Note that PHP concatenates with a DOT — using + on two strings is an error, not concatenation.",
      examples: [
        '$out .= "line\\n";',
        '$html = "";\nforeach ($rows as $r) {\n  $html .= "<li>" . htmlspecialchars($r) . "</li>";\n}',
        '$out = implode("\\n", $lines);   // cheaper for big loops'
      ]
    }
  },

  SQL: {
    'select': {
      long: "Chooses which columns come back — and it is nearly the LAST part of the query the database evaluates, after FROM, WHERE and GROUP BY have done their work. `SELECT *` is fine while exploring and a liability in shipped code: it drags every column over the wire and breaks the day somebody adds one. Name the columns you need.",
      examples: [
        'SELECT name, score FROM runs;',
        'SELECT COUNT(*) FROM runs;',
        'SELECT name AS player FROM runs;'
      ]
    },
    'from': {
      long: "Names the table, view or subquery the rows come from. Several sources listed here get joined, and the modern spelling of that is an explicit JOIN rather than commas with conditions hidden in the WHERE — the same result, but the relationship is visible and an accidental cross join is much harder to write.",
      examples: [
        'SELECT * FROM players;',
        'SELECT p.name, r.score\nFROM players p\nJOIN runs r ON r.player_id = p.id;',
        'FROM (SELECT * FROM runs WHERE score > 900) AS top;'
      ]
    },
    'where': {
      long: "Filters rows before any grouping happens. It is evaluated per row, so wrapping a column in a function here — WHERE lower(name) = 'ada' — usually stops an index being usable and turns a lookup into a full table scan. And never build one by pasting user input into the string: use parameters, or you have written an SQL injection.",
      examples: [
        'SELECT * FROM runs WHERE score > 1000;',
        "WHERE lang = 'RUST' AND score > 900",
        'WHERE deleted_at IS NULL'
      ]
    },
    'join': {
      long: "Stitches two tables together on a shared key, which is the entire reason it is safe to keep data split across tables. The ON condition is what pairs the rows — leave it out and you get a cross join, every row against every row. Joining on unindexed columns is the usual explanation for a query that was instant last month and takes a minute now.",
      examples: [
        'SELECT p.name, r.score\nFROM players p\nJOIN runs r ON r.player_id = p.id;',
        'LEFT JOIN runs r ON r.player_id = p.id',
        'JOIN langs l ON l.id = r.lang_id AND l.active = 1'
      ]
    },
    'inner': {
      long: "Keeps only rows that matched on BOTH sides — and it is the default, so a bare JOIN means INNER JOIN. That default is the thing to watch: an inner join silently DROPS rows that had no match, so a report which mysteriously lost a hundred players is nearly always an inner join where a left join was meant.",
      examples: [
        'SELECT * FROM players p\nINNER JOIN runs r ON r.player_id = p.id;',
        '-- identical:\nFROM a JOIN b ON …\nFROM a INNER JOIN b ON …'
      ]
    },
    'left': {
      long: "Keeps every row from the left table whether or not it matched, filling the right-hand columns with NULL where it did not. It is how you ask for 'all players, and their runs if they have any'. The trap: putting a condition on the right table in the WHERE clause discards those NULL rows and quietly turns it back into an inner join — that condition belongs in the ON.",
      examples: [
        'SELECT p.name, r.score\nFROM players p\nLEFT JOIN runs r ON r.player_id = p.id;',
        'LEFT JOIN runs r ON r.player_id = p.id AND r.score > 900',
        'WHERE r.id IS NULL   -- players with no runs at all'
      ]
    },
    'group': {
      long: "Collapses rows into buckets so aggregate functions can summarise each one: a total per player, a count per language. Every column in the SELECT must either appear in the GROUP BY or be wrapped in an aggregate — otherwise you are asking the database which of several values to show, and the strict ones refuse.",
      examples: [
        'SELECT player_id, COUNT(*)\nFROM runs\nGROUP BY player_id;',
        'SELECT lang, AVG(score), MAX(score)\nFROM runs\nGROUP BY lang;'
      ]
    },
    'having': {
      long: "Like WHERE, but it filters the GROUPS after aggregation, so it can test COUNT(*) and SUM() which WHERE cannot see yet. The rule of thumb is simple: conditions on raw columns belong in WHERE, where they are cheaper because fewer rows get aggregated, and conditions on aggregates belong here.",
      examples: [
        'SELECT player_id, COUNT(*) AS runs\nFROM runs\nGROUP BY player_id\nHAVING COUNT(*) > 3;',
        'SELECT lang, AVG(score)\nFROM runs\nWHERE score > 0\nGROUP BY lang\nHAVING AVG(score) > 500;'
      ]
    },
    'order': {
      long: "Sorts the result. Without it there is NO guaranteed order — a table has no natural order, and a query that appeared sorted for months can change the day an index does. DESC reverses, extra columns break ties, and sorting a large result is one of the more expensive things you can ask a database for.",
      examples: [
        'SELECT * FROM runs ORDER BY score DESC;',
        'ORDER BY lang ASC, score DESC',
        'ORDER BY score DESC LIMIT 10;'
      ]
    },
    'limit': {
      long: "Stops after this many rows, applied last — after sorting. That ordering matters: LIMIT without ORDER BY gives you an arbitrary handful rather than the top ones. With OFFSET it gives you paging, though deep offsets get slow because the database still walks past every row it skips.",
      examples: [
        'SELECT * FROM runs ORDER BY score DESC LIMIT 10;',
        'LIMIT 20 OFFSET 40;   -- page 3',
        'SELECT TOP 10 * FROM runs;   -- SQL Server spells it differently'
      ]
    },
    'distinct': {
      long: "Drops duplicate rows — and it considers the WHOLE selected row, not just the first column, which is why adding an id to the SELECT quietly makes every row unique again. Reaching for it often usually means a join is multiplying rows, and fixing the join is a better answer than deduplicating afterwards.",
      examples: [
        'SELECT DISTINCT lang FROM runs;',
        'SELECT COUNT(DISTINCT player_id) FROM runs;',
        'SELECT DISTINCT lang, player_id FROM runs;   -- unique PAIRS'
      ]
    },
    'insert': {
      long: "Adds new rows. Name the columns explicitly, because the short form depends on column order and breaks the day somebody adds one in the middle. A multi-row insert in a single statement is dramatically faster than a loop of single inserts, since each statement is its own round trip to the server.",
      examples: [
        "INSERT INTO runs (player_id, lang, score)\nVALUES (1, 'RUST', 900);",
        "INSERT INTO runs (lang, score) VALUES\n  ('HTML', 500),\n  ('CSS', 620);",
        'INSERT INTO archive (id, score)\nSELECT id, score FROM runs WHERE score > 900;'
      ]
    },
    'update': {
      long: "Changes rows that already exist. It takes a WHERE, and forgetting it updates the ENTIRE table — comfortably the most expensive typo in the profession. Run the WHERE as a SELECT first to see exactly what it matches, and do the update inside a transaction so ROLLBACK is still available when the row count surprises you.",
      examples: [
        'UPDATE runs SET score = 0 WHERE id = 3;',
        "BEGIN;\nUPDATE runs SET score = score + 10 WHERE lang = 'GO';\n-- check the row count, then COMMIT or ROLLBACK",
        'UPDATE players SET last_seen = NOW() WHERE id = 1;'
      ]
    },
    'delete': {
      long: "Removes rows, and like UPDATE it takes a WHERE or it empties the table. TRUNCATE is the faster way to empty one deliberately, though it usually cannot be rolled back. A delete against a table other rows reference will either fail or cascade depending on the foreign key rule, and knowing which BEFORE you press enter is the difference between an afternoon and a week.",
      examples: [
        'DELETE FROM runs WHERE id = 3;',
        "SELECT COUNT(*) FROM runs WHERE created_at < '2026-01-01';\n-- then run DELETE with exactly the same WHERE",
        'DELETE FROM runs\nWHERE player_id IN (SELECT id FROM players WHERE banned = 1);'
      ]
    },
    'count': {
      long: "Counts rows. COUNT(*) counts every row; COUNT(col) counts only rows where that column is not NULL, and that difference is real and frequently missed. COUNT(DISTINCT col) counts unique values. On a large table an exact count can be expensive, because the database may have to walk the whole thing to be sure.",
      examples: [
        'SELECT COUNT(*) FROM runs;',
        'SELECT COUNT(score) FROM runs;   -- skips NULL scores',
        'SELECT lang, COUNT(*) FROM runs GROUP BY lang;'
      ]
    },
    'index': {
      long: "A separate sorted structure that lets the database find rows without reading the whole table — usually a B-tree over the columns you named. It turns a scan into a jump, and it is not free: every insert and update must maintain it, and an index nothing queries is pure cost. Column ORDER in a composite index matters, because it can only be used left to right.",
      examples: [
        'CREATE INDEX idx_runs_score ON runs(score);',
        'CREATE INDEX idx_runs_lang_score ON runs(lang, score);',
        'EXPLAIN SELECT * FROM runs WHERE score > 900;'
      ]
    },
    'primary': {
      long: "The column, or set of columns, that uniquely identifies a row. It implies NOT NULL and UNIQUE, and it usually decides the physical layout of the table, which is why most tables get a small integer or a UUID. Every table should have one: without it there is no reliable way to point at a single row, and updates and replication both suffer for it.",
      examples: [
        'id INTEGER PRIMARY KEY',
        'CREATE TABLE runs (\n  id INTEGER PRIMARY KEY,\n  player_id INTEGER NOT NULL,\n  score INTEGER\n);',
        'PRIMARY KEY (player_id, lang)   -- composite'
      ]
    },
    'foreign': {
      long: "A column pointing at another table's key, and a promise the database will enforce: you cannot insert a run for a player who does not exist. What happens when the parent is deleted depends on the rule — CASCADE removes the children with it, which is convenient and occasionally terrifying, so know which one is set before you delete anything.",
      examples: [
        'FOREIGN KEY (player_id) REFERENCES players(id)',
        'FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE',
        'ON DELETE SET NULL'
      ]
    },
    'commit': {
      long: "Makes everything since BEGIN permanent and visible to everyone else. Until then the changes are provisional and yours alone — that is what a transaction buys: several statements that either all land or none do. Holding one open while you do slow work keeps its locks held, and that is where deadlocks and timeouts come from.",
      examples: [
        'BEGIN;\nUPDATE accounts SET bal = bal - 10 WHERE id = 1;\nUPDATE accounts SET bal = bal + 10 WHERE id = 2;\nCOMMIT;',
        'COMMIT;'
      ]
    },
    'rollback': {
      long: "Throws away everything since the transaction began, as though none of it happened. It is the safety net that makes a risky UPDATE survivable: begin, run it, check the row count, and only then commit. Note that some statements — CREATE TABLE and friends, in several databases — commit implicitly and cannot be rolled back.",
      examples: [
        'BEGIN;\nDELETE FROM runs WHERE score < 100;\n-- 4000 rows? not what I meant\nROLLBACK;',
        'ROLLBACK;'
      ]
    },
    'null': {
      long: "Not zero and not an empty string — UNKNOWN. That is why NULL = NULL is not true and why you must write IS NULL rather than = NULL. It spreads: arithmetic and comparisons involving NULL produce NULL, aggregates skip it, and a `<>` filter silently excludes rows where the column is NULL. COALESCE gives you a fallback value.",
      examples: [
        'WHERE deleted_at IS NULL',
        'SELECT COALESCE(score, 0) FROM runs;',
        "SELECT * FROM runs WHERE lang <> 'GO';   -- rows with NULL lang are NOT returned"
      ]
    }
  },

  DART: {
    'mixin': {
      long: "Behaviour folded into a class without inheriting from it, which is how a Dart class can gain capabilities from several places while keeping single inheritance. `on` restricts which classes may use it, so the mixin is allowed to rely on their members. When two mixins define the same method the LAST one wins, so the order in the with clause is meaningful.",
      examples: [
        'mixin Loud {\n  void shout() => print("HEY");\n}',
        'class Boss extends Enemy with Loud, Flying { }',
        'mixin Damageable on Entity {\n  void hit() { hp -= 1; }\n}'
      ]
    },
    'factory': {
      long: "A constructor that is free NOT to build a new object: it may return a cached instance, an object of a subclass, or one parsed from JSON. That is exactly what a normal constructor cannot do, since it must produce a fresh instance of that class. It is the standard way to write singletons and fromJson constructors in Dart.",
      examples: [
        'factory Config() => _shared;',
        'factory Ship.fromJson(Map<String, dynamic> j) =>\n    Ship(hp: j["hp"], name: j["name"]);',
        'class Logger {\n  static final _cache = <String, Logger>{};\n  factory Logger(String name) =>\n      _cache.putIfAbsent(name, () => Logger._(name));\n  Logger._(this.name);\n  final String name;\n}'
      ]
    },
    'late': {
      long: "A promise that this non-nullable variable will be assigned before anything reads it, moving the check from compile time to runtime. It suits something set in initState or injected after construction, and breaking the promise gives you a clear LateInitializationError rather than a mysterious null. `late final` also means lazy: the initialiser runs on first read.",
      examples: [
        'late Player p;',
        'late final config = loadConfig();   // computed on first use',
        'late final AnimationController controller;'
      ]
    },
    'required': {
      long: "Marks a named argument that must be supplied. Named arguments are optional by default in Dart, so without it a caller can leave out something the class cannot function without. It is why Flutter constructors are a wall of `required this.x` — it keeps call sites readable while still enforcing what is genuinely mandatory.",
      examples: [
        'Ship({required this.hp, this.name = "raiden"});',
        'void draw({required Canvas canvas, double scale = 1});',
        'Ship(hp: 100);   // name falls back to its default'
      ]
    },
    'final': {
      long: "Set once, then fixed — but at RUNTIME, which is the whole difference from const. A final field can hold something computed while the object is built; a const value must be known at compile time and is canonicalised, so two identical consts are literally the same object. In Flutter that matters: const widgets let the framework skip rebuilding them entirely.",
      examples: [
        'final hp = 100;',
        'final now = DateTime.now();   // fine; const would not compile',
        'const SizedBox(height: 8)   // cheap precisely because it is const'
      ]
    },
    'async': {
      long: "Marks a function that returns a Future and may await inside it. The body runs synchronously up to the first await, then yields to the event loop — which is what keeps a Flutter UI responsive while work is in flight. Its sibling `async*` returns a Stream instead, yielding many values over time rather than one.",
      examples: [
        'Future<Config> load() async {\n  final text = await File(p).readAsString();\n  return Config.parse(text);\n}',
        'Stream<int> ticks() async* {\n  for (var i = 0; ; i++) {\n    await Future.delayed(Duration(seconds: 1));\n    yield i;\n  }\n}'
      ]
    }
  },

  TYPESCRIPT: {
    'interface': {
      long: "Describes the shape an object must have, and it is ERASED at runtime — nothing is checked once the code is JavaScript, so data arriving from a network or a file still needs real validation. Interfaces are open: declaring the same name twice merges the members, which is how you extend types from a library you do not control.",
      examples: [
        'interface Player {\n  hp: number;\n  name?: string;   // optional\n}',
        'interface Admin extends Player {\n  level: number;\n}',
        'declare global {\n  interface Window { game: Game }\n}'
      ]
    },
    'type': {
      long: "Names any type at all, not only object shapes: unions, intersections, tuples, function types, mapped and conditional types. The practical split with interface is that interfaces merge declarations and read better for object contracts, while only a type alias can express `A | B`. Both vanish at runtime.",
      examples: [
        'type Id = string | number;',
        'type Point = { x: number; y: number };',
        'type Handler = (e: KeyboardEvent) => void;'
      ]
    },
    'keyof': {
      long: "Gives you the union of an object type's keys, so keyof Player is 'hp' | 'name'. It is what makes a generic property getter type-safe: the compiler knows the key exists AND knows which type comes back for that particular key. Combined with mapped types it lets you transform every property of a type at once.",
      examples: [
        'type K = keyof Player;   // "hp" | "name"',
        'function get<T, K extends keyof T>(o: T, k: K): T[K] {\n  return o[k];\n}',
        'type Optional<T> = { [K in keyof T]?: T[K] };'
      ]
    },
    'infer': {
      long: "Captures a type inside a conditional type and gives it a name you can use in the true branch. It is how the standard utility types are built: ReturnType pulls the result out of a function type, Awaited pulls the value out of a promise. You reach for it writing library types, and almost never in everyday application code.",
      examples: [
        'type Elem<T> = T extends Array<infer U> ? U : never;',
        'type Ret<F> = F extends (...a: any[]) => infer R ? R : never;',
        'type X = Elem<string[]>;   // string'
      ]
    },
    'satisfies': {
      long: "Checks that a value fits a type WITHOUT widening it to that type, so you keep the precise literal types you wrote and still get an error if something is missing. Before it existed you had to choose one or the other: annotate and lose the specifics, or leave the annotation off and lose the check.",
      examples: [
        'const cfg = {\n  fps: 60,\n  mode: "hard",\n} satisfies Config;',
        'cfg.mode;   // type is "hard", not string',
        'const colors = { bg: "#111" } satisfies Record<string, string>;'
      ]
    },
    'declare': {
      long: "Tells the compiler something exists without emitting any code for it: a global from a script tag, a value injected by a bundler, a library that ships no types. It is a promise you are making and nothing verifies it, so a wrong declare is a lie the compiler will believe right up until it crashes.",
      examples: [
        'declare const VERSION: string;',
        'declare global {\n  interface Window { Phaser: any }\n}',
        'declare module "*.png" {\n  const src: string;\n  export default src;\n}'
      ]
    },
    'readonly': {
      long: "This property cannot be assigned after the object is built. It is compile-time only — nothing stops plain JavaScript writing to it at runtime — but it catches the everyday mistake of mutating an object you meant to copy. ReadonlyArray and `as const` extend the same idea to whole arrays and object literals.",
      examples: [
        'interface P { readonly id: string; hp: number }',
        'const xs: readonly number[] = [1, 2, 3];\nxs.push(4);   // error',
        'const modes = ["easy", "hard"] as const;'
      ]
    },
    'enum': {
      long: "A named set of constants, and the one TypeScript feature that emits real JavaScript instead of disappearing at compile time. That runtime object costs bundle size and behaves oddly (a numeric enum maps both ways, so Object.keys gives you twice what you expect), which is why a lot of modern code prefers a union of string literals with `as const`.",
      examples: [
        'enum State { Idle, Firing, Dead }',
        'enum Lang { Rust = "RUST", Go = "GO" }',
        'const STATES = ["idle", "firing"] as const;\ntype State = typeof STATES[number];'
      ]
    },
    'never': {
      long: "The type of a value that can never exist: a function that always throws or never returns, or a branch the compiler has proved unreachable. Its most useful application is exhaustiveness — assign the switch subject to a never in the default branch, and adding a new variant to the union becomes a compile error instead of a silent gap.",
      examples: [
        'function fail(msg: string): never {\n  throw new Error(msg);\n}',
        'default: {\n  const _exhaustive: never = shape;\n  return _exhaustive;\n}'
      ]
    },
    'unknown': {
      long: "Like any, but safe: you can put anything into it and do nothing with it until you have narrowed it down. That is exactly right for a fetch response, a JSON.parse result or a caught error — data whose shape nobody has verified yet. Changing an any to unknown is often the single highest-value type change you can make in a codebase.",
      examples: [
        'let x: unknown = JSON.parse(text);',
        'if (typeof x === "string") x.trim();   // narrowed, now allowed',
        'try { … } catch (e: unknown) {\n  if (e instanceof Error) console.log(e.message);\n}'
      ]
    },
    'any': {
      long: "Turns type checking off for this value completely, and it is contagious: everything reached through an any is also any, so one of them can silently disable checking across a whole file. It exists for migration and for genuinely dynamic edges. When you mean 'I do not know what this is yet', unknown says that without switching the compiler off.",
      examples: [
        'let x: any;\nx.whatever.nonsense();   // compiles fine, crashes at runtime',
        'let x: unknown;   // the safe version of the same idea',
        'function parse(s: string): unknown { return JSON.parse(s); }'
      ]
    },
    'generic': {
      long: "Code written over a type you fill in later, so one function or class serves many types without forgetting what it knows about them. The point is the RELATIONSHIP: `function id<T>(x: T): T` promises the output type matches the input, which (x: any) => any cannot express. Constrain with extends when the body needs the type to have something.",
      examples: [
        'function id<T>(x: T): T { return x; }',
        'function first<T>(xs: T[]): T | undefined { return xs[0]; }',
        'function len<T extends { length: number }>(x: T) { return x.length; }'
      ]
    },
    'as': {
      long: "A type ASSERTION: you are telling the compiler you know better and it stops checking. It converts nothing at runtime, so `value as Player` applied to something that is not a Player simply moves the crash somewhere less obvious. The legitimate uses are narrow — a DOM query whose tag you know, or `as const`; anything else is usually a missing type guard.",
      examples: [
        'const c = el as HTMLCanvasElement;',
        'const modes = ["easy", "hard"] as const;',
        'if (isPlayer(v)) { … }   // a type guard beats an assertion'
      ]
    }
  },

  RUST: {
    'impl': {
      long: "Where a type's methods live. An inherent impl block adds methods to your own type; `impl Trait for Type` implements a trait, and that second form is what lets you attach behaviour to a type you did not define. Trait methods are only callable where the trait is in scope, which is why adding a use line can make a method suddenly appear.",
      examples: [
        'impl Ship {\n    fn new(hp: u32) -> Self { Ship { hp } }\n    fn hit(&mut self) { self.hp -= 1; }\n}',
        'impl Draw for Ship {\n    fn draw(&self) { println!("ship"); }\n}',
        'impl fmt::Display for Ship {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "Ship({})", self.hp)\n    }\n}'
      ]
    },
    'crate': {
      long: "A Rust compilation unit — one library or one binary — and the root of its module tree. `crate::` at the start of a path means 'from the root of this crate', which is how you write an absolute path within your own code. A package, which is what Cargo.toml describes, may contain several crates.",
      examples: [
        'use crate::game::Ship;',
        'use serde::Serialize;   // from an external crate',
        'pub(crate) fn reset() { }   // visible inside this crate only'
      ]
    },
    'dyn': {
      long: "A trait object: the concrete type is not known until runtime, so the call goes through a vtable instead of being resolved while compiling. You need it when one collection must hold several different types that share a trait. The cost is an indirection and no inlining — generics do the same job at compile time whenever the types are known.",
      examples: [
        'let shapes: Vec<Box<dyn Draw>> = vec![Box::new(ship), Box::new(rock)];',
        'fn render(x: &dyn Draw) { x.draw(); }',
        'fn render<T: Draw>(x: &T) { x.draw(); }   // static, no vtable'
      ]
    },
    '&mut': {
      long: "A mutable borrow: you may change the value through it, and while it exists NOTHING else may read or write that value. That exclusivity is the borrow checker's central rule — many readers or one writer, never both — and it is what eliminates data races at compile time. Most 'cannot borrow as mutable more than once' errors are that rule pointing at two uses that need separating.",
      examples: [
        'fn hit(&mut self) { self.hp -= 1; }',
        'let r = &mut xs;\nr.push(4);',
        'let a = &mut v;\nlet b = &mut v;   // error: second mutable borrow'
      ]
    },
    'mut': {
      long: "Rust bindings are immutable unless you say otherwise, and this is how you say otherwise. It describes the BINDING, not the type: `let mut s` means you may modify or reassign s, while `&mut T` is the separate business of borrowing mutably. Immutable by default is deliberate — most values never change, and saying so makes the ones that do stand out.",
      examples: [
        'let mut score = 0;\nscore += 10;',
        'let mut xs = Vec::new();\nxs.push(1);',
        'fn grow(v: &mut Vec<i32>) { v.push(0); }'
      ]
    },
    'option': {
      long: "Rust has no null, so a value that might be missing is an Option<T>: either Some(v) or None. Because it is an ordinary type the compiler makes you handle the empty case before you can touch the value, which is how a whole category of crash stops existing. match, if let, unwrap_or and map are the everyday ways through it.",
      examples: [
        'let p: Option<Ship> = None;',
        'match maybe {\n    Some(v) => use_it(v),\n    None => default(),\n}',
        'let hp = maybe.map(|s| s.hp).unwrap_or(0);'
      ]
    },
    'result': {
      long: "Errors are values in Rust: a fallible function returns Result<T, E>, which is Ok(v) or Err(e). Nothing is thrown, so every failure is visible in the signature and ignoring one produces a warning. The ? operator is what keeps that readable — it unwraps the Ok, or returns the Err to your caller, in a single character.",
      examples: [
        'fn load(p: &str) -> Result<Config, io::Error> {\n    let text = fs::read_to_string(p)?;\n    Ok(Config::parse(&text))\n}',
        'match load(p) {\n    Ok(cfg) => run(cfg),\n    Err(e) => eprintln!("{}", e),\n}',
        'let cfg = load(p).unwrap_or_default();'
      ]
    },
    'unwrap': {
      long: "Takes the value out of an Option or Result and PANICS if there was not one. It is fine in a prototype, a test, or somewhere you can genuinely prove the value is there — and it is also how most Rust programs crash. expect() is the same thing plus a message saying what you believed, which turns a bare panic into a useful bug report.",
      examples: [
        'let v = maybe.unwrap();',
        'let cfg = load(p).expect("config.toml must exist");',
        'let v = maybe.unwrap_or(0);   // no panic'
      ]
    },
    'borrow': {
      long: "Use a value without taking ownership, so the owner keeps it and it is not dropped when your reference ends. The rules are checked at compile time: any number of shared borrows, or exactly one mutable borrow, never both at once, and no borrow may outlive the value. Taking &str and &[T] parameters rather than String and Vec is the everyday form of this.",
      examples: [
        'fn read(s: &str) -> usize { s.len() }',
        'let n = read(&name);   // name is still usable afterwards',
        'for x in &xs { println!("{}", x); }   // does not consume xs'
      ]
    },
    'ownership': {
      long: "Every value has exactly one owner, and when that owner goes out of scope the value is dropped — no garbage collector, no manual free, no double free. Assigning or passing a non-Copy value MOVES it, so the old name can no longer be used, which is the error every newcomer meets in week one. Borrowing or cloning are the two ways past it.",
      examples: [
        'let a = String::from("hi");\nlet b = a;   // a has been moved\n// println!("{}", a);   // error: value used after move',
        'let b = a.clone();   // explicit copy: both stay usable',
        'fn take(s: String) { }   // consumes it\nfn look(s: &str) { }     // only borrows'
      ]
    },
    'lifetime': {
      long: "How long a reference is guaranteed to stay valid, written into the type so the compiler can prove no reference outlives what it points at. Most of the time it is inferred and you never write one; the syntax appears when a function returns a reference and the compiler cannot tell which input it came from. It describes what your code already does — it changes nothing at runtime.",
      examples: [
        "fn first<'a>(x: &'a str, _y: &str) -> &'a str { x }",
        "struct Parser<'a> {\n    input: &'a str,\n}",
        "fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len() > b.len() { a } else { b }\n}"
      ]
    }
  },

  HASKELL: {
    'putstrln': {
      long: "Prints a string followed by a newline. Its type is String -> IO (), and that IO is the point: in Haskell a value that performs effects has a different type from a pure one, so the compiler can always tell them apart. print is its cousin for anything with a Show instance.",
      examples: [
        'main :: IO ()\nmain = putStrLn "hello"',
        'putStrLn ("hp: " ++ show hp)',
        'print [1, 2, 3]   -- print = putStrLn . show'
      ]
    },
    'deriving': {
      long: "Asks the compiler to write standard instances for you rather than typing them out: Show for printing, Eq for equality, Ord for comparison, Enum and Bounded for simple enumerations. It only works where the derivation is mechanical, which covers most plain data types. Writing the instance by hand is how you override one of them.",
      examples: [
        'data Point = Point Int Int deriving (Show, Eq)',
        'data Color = Red | Green deriving (Show, Eq, Ord, Enum, Bounded)',
        'data Shape = Circle Float | Rect Float Float deriving Show'
      ]
    },
    'newtype': {
      long: "A wrapper around exactly one type that exists only at compile time — it disappears entirely in the generated code, so it is free at runtime. Its whole purpose is to stop you confusing two things that are both Int underneath: a UserId and a Score should not be interchangeable. Unlike a type alias, the compiler treats it as a genuinely distinct type.",
      examples: [
        'newtype Hp = Hp Int',
        'newtype UserId = UserId Int\nnewtype Score  = Score Int',
        'unHp :: Hp -> Int\nunHp (Hp n) = n'
      ]
    },
    '>>=': {
      long: "Bind: take a value wrapped in some context — IO, Maybe, a list — and feed it into a function that produces another wrapped value. It is the operation every monad must define, and it is what lets you sequence steps that might fail, or that touch the outside world, without unwrapping anything by hand. do-notation is sugar over chains of it.",
      examples: [
        'main = getLine >>= putStrLn',
        'main = getLine >>= \\name -> putStrLn ("hi " ++ name)',
        'lookup "a" m >>= \\v -> lookup v m2'
      ]
    },
    'data': {
      long: "Defines a brand new type by listing the shapes it can take, each with its own fields. One constructor gives you a record; several give you a sum type, and pattern matching then forces every shape to be handled. This is the central modelling tool in Haskell: make illegal states impossible to construct and a whole class of bug cannot be written.",
      examples: [
        'data Shape = Circle Float | Rect Float Float',
        'data Player = Player { name :: String, hp :: Int }',
        'area :: Shape -> Float\narea (Circle r) = pi * r * r\narea (Rect w h) = w * h'
      ]
    },
    'where': {
      long: "Local definitions attached to the clause above, and visible across ALL the guards of that equation — which is exactly why it is preferred over let when several guards share a helper value. The same keyword also ends a module header and introduces the methods of a class or instance. A where block is in scope for that one function and nowhere else.",
      examples: [
        'f x = y + 1\n  where y = x * 2',
        'bmi w h\n  | b < 18.5  = "under"\n  | b < 25    = "normal"\n  | otherwise = "over"\n  where b = w / h ^ 2',
        'module Main (main) where'
      ]
    },
    'monad': {
      long: "A pattern for chaining computations that carry something extra along: the possibility of failure, several results, state, or contact with the outside world. Anything that defines >>= and pure gets do-notation and a large library of combinators for free. The word sounds forbidding; the idea is simply 'a standard way to sequence steps inside a context'.",
      examples: [
        'main = do\n  name <- getLine\n  putStrLn ("hi " ++ name)',
        'safeDiv a b = if b == 0 then Nothing else Just (a `div` b)',
        'sequence [Just 1, Just 2]   -- Just [1,2]'
      ]
    },
    'maybe': {
      long: "Just a value, or Nothing — Haskell's answer to null. Because it is an ordinary type, a function that might return nothing has to say so in its signature, and every caller has to deal with it. The function also named maybe is the standard way out: give it a default, a function, and the Maybe value.",
      examples: [
        'lookup :: Eq k => k -> [(k, v)] -> Maybe v',
        'case lookup "hp" cfg of\n  Just v  -> v\n  Nothing -> 100',
        'maybe 100 id (lookup "hp" cfg)'
      ]
    },
    'pure': {
      long: "Two related meanings. A pure FUNCTION has no side effects — same input, same output, every time — which is what makes Haskell code so straightforward to reason about and to test. The function `pure` lifts an ordinary value into an applicative or monad, so pure 5 :: Maybe Int is Just 5; it is the modern general name for what return does in a monad.",
      examples: [
        'square x = x * x   -- pure: no effects at all',
        'pure 5 :: Maybe Int   -- Just 5',
        'main = pure ()'
      ]
    },
    'lazy': {
      long: "Nothing is evaluated until something actually needs it, which is why an infinite list is an ordinary value in Haskell and take 5 [1..] finishes instantly. It also lets a definition refer to itself. The cost is space leaks: an unevaluated chain of thunks can pile up in memory, which is precisely why foldl' exists alongside foldl.",
      examples: [
        'take 5 [1..]   -- [1,2,3,4,5]',
        'fibs = 0 : 1 : zipWith (+) fibs (tail fibs)',
        "import Data.List (foldl')   -- the strict fold"
      ]
    },
    'curry': {
      long: "Every Haskell function takes exactly one argument and returns a function taking the next, so `add 1 2` is really `(add 1) 2`. That is why partial application is free: supply half the arguments and you have a new function. The type signature shows it plainly — Int -> Int -> Int is Int -> (Int -> Int).",
      examples: [
        'add :: Int -> Int -> Int\nadd a b = a + b',
        'inc = add 1   -- partial application',
        'map (add 10) [1,2,3]   -- [11,12,13]'
      ]
    },
    'do': {
      long: "In Haskell do is not a loop: it is notation for sequencing monadic steps, and it desugars into a chain of >>= calls. Inside it, <- binds the value out of a step while let binds a pure value. It works for ANY monad, not just IO — the same block shape sequences Maybe, lists and parsers.",
      examples: [
        'main = do\n  name <- getLine\n  putStrLn ("hi " ++ name)',
        'do\n  x <- lookup "a" m\n  y <- lookup "b" m\n  return (x + y)'
      ]
    }
  },

  GO: {
    'chan': {
      long: "A typed pipe that goroutines send values down, and Go's preferred way to share data: communicate rather than lock. An unbuffered channel is a rendezvous — the sender waits until somebody receives — while a buffered one holds a few values first. Sending on a channel nobody is reading blocks forever, which is the classic Go deadlock.",
      examples: [
        'ch := make(chan int)\ngo func() { ch <- 42 }()\nfmt.Println(<-ch)',
        'ch := make(chan int, 10)   // buffered',
        'for v := range ch {\n\tfmt.Println(v)\n}   // ends when the channel is closed'
      ]
    },
    'go': {
      long: "Starts a goroutine: the function runs concurrently and the caller carries straight on. Goroutines are cheap enough that tens of thousands is normal, but nobody waits for them — if main returns they die mid-sentence, which is why you need a channel or a WaitGroup. Capturing a loop variable in one was a classic bug; Go 1.22 fixed the semantics, but the shadowing workaround still appears in older code.",
      examples: [
        'go worker(ch)',
        'var wg sync.WaitGroup\nwg.Add(1)\ngo func() {\n\tdefer wg.Done()\n\twork()\n}()\nwg.Wait()',
        'for _, v := range xs {\n\tv := v   // the old shadowing fix\n\tgo use(v)\n}'
      ]
    },
    'fallthrough': {
      long: "Carries execution on into the NEXT case. Go's switch does not fall through by default — each case ends on its own — which removes the most common switch bug in C and Java. When you genuinely want the old behaviour you ask for it explicitly, and it must be the final statement in the case.",
      examples: [
        'switch n {\ncase 1:\n\tfmt.Println("one")\n\tfallthrough\ncase 2:\n\tfmt.Println("two")\n}',
        'switch {\ncase hp > 60:\n\treturn "fine"\ncase hp > 20:\n\treturn "hurt"\n}   // no breaks needed'
      ]
    },
    'fmt': {
      long: "Go's formatting and printing package. The verbs repay learning: %d for integers, %s for strings, %v for any value, and %+v which adds struct field names — that last one is the debugging workhorse. Printf writes to stdout, Sprintf returns the string, and Errorf builds an error, with %w wrapping the original so errors.Is can find it later.",
      examples: [
        'fmt.Println(hp)',
        'fmt.Printf("%+v\\n", player)',
        'return fmt.Errorf("load config: %w", err)'
      ]
    },
    'recover': {
      long: "Stops a panic unwinding any further and hands you the value it carried. It only works inside a DEFERRED function, which is why the idiom always has that shape. Use it at a boundary — a server handler that should not take the process down because one request panicked — and not as a general try/catch, since Go expects ordinary failures to be returned as errors.",
      examples: [
        'defer func() {\n\tif r := recover(); r != nil {\n\t\tlog.Println("recovered:", r)\n\t}\n}()',
        'func safe(f func()) (err error) {\n\tdefer func() {\n\t\tif r := recover(); r != nil {\n\t\t\terr = fmt.Errorf("panic: %v", r)\n\t\t}\n\t}()\n\tf()\n\treturn\n}'
      ]
    },
    'err': {
      long: "Go has no exceptions: a function that can fail returns an error as its last result and you check it right there. That is why Go code is full of `if err != nil` — the handling is visible instead of hidden in a catch several frames up. Wrap with %w to keep the original, and use errors.Is or errors.As to inspect it further up.",
      examples: [
        'f, err := os.Open(p)\nif err != nil {\n\treturn err\n}',
        'if err != nil {\n\treturn fmt.Errorf("read config: %w", err)\n}',
        'if errors.Is(err, os.ErrNotExist) {\n\treturn defaultConfig(), nil\n}'
      ]
    }
  },

  ZIG: {
    'comptime': {
      long: "Runs code at COMPILE time. It is how Zig does generics — a function takes a `comptime T: type` parameter and the compiler stamps out a version per type — and it replaces macros entirely, because the language you write at compile time is just Zig. Anything that must be settled before the program runs, from array lengths to which branches survive, goes through it.",
      examples: [
        'fn max(comptime T: type, a: T, b: T) T {\n    return if (a > b) a else b;\n}',
        'const table = comptime buildTable();',
        'comptime {\n    if (@sizeOf(usize) != 8) @compileError("64-bit only");\n}'
      ]
    },
    'errdefer': {
      long: "Cleanup that runs ONLY when the function returns an error, unlike defer which always runs. It is exactly what a constructor needs: allocate, errdefer free, keep going — so if a later step fails everything already taken is released, and if it all succeeds the caller keeps the memory. Without it, half-built objects leak on the error path.",
      examples: [
        'const buf = try allocator.alloc(u8, 64);\nerrdefer allocator.free(buf);',
        'const f = try std.fs.cwd().createFile(p, .{});\nerrdefer f.close();'
      ]
    },
    'anytype': {
      long: "A parameter whose type is worked out at compile time from whatever you pass, giving you duck typing at no runtime cost — the compiler generates a version for each type actually used. It is how a logging or printing helper accepts anything. The trade is that the constraints are implicit, so a mismatch surfaces as an error inside your function rather than at the call site.",
      examples: [
        'fn log(v: anytype) void {\n    std.debug.print("{any}\\n", .{v});\n}',
        'fn describe(x: anytype) void {\n    std.debug.print("{s}\\n", .{@typeName(@TypeOf(x))});\n}'
      ]
    },
    'orelse': {
      long: "Unwraps an optional and supplies the value to use when it was null. It is the tidy alternative to an if with two branches, and the right-hand side may be a block that returns or breaks, so `orelse return error.Missing` is normal Zig. Its cousin `catch` does the same job for error unions.",
      examples: [
        'const p = maybe orelse default;',
        'const p = maybe orelse return error.NotFound;',
        'const n = parse(s) catch 0;   // the error-union equivalent'
      ]
    },
    'allocator': {
      long: "Zig hides no allocations: anything needing memory takes an allocator parameter, so a signature tells you whether a function allocates at all. That makes strategies swappable — an arena for one request, a fixed buffer on embedded hardware, a testing allocator that fails the test on a leak. Every alloc is paired with a defer free on the line beneath it.",
      examples: [
        'const buf = try allocator.alloc(u8, 64);\ndefer allocator.free(buf);',
        'var gpa = std.heap.GeneralPurposeAllocator(.{}){};\nconst allocator = gpa.allocator();',
        'var arena = std.heap.ArenaAllocator.init(allocator);\ndefer arena.deinit();'
      ]
    },
    'try': {
      long: "Not a block: `try expr` evaluates the expression and, if it produced an error, returns that error from the current function immediately — otherwise you get the value. It is Zig's equivalent of Rust's ?, and it makes every possible failure visible on the exact line where it can happen. The enclosing function must itself return an error union for try to be legal.",
      examples: [
        'const f = try std.fs.cwd().openFile(path, .{});',
        'fn load(p: []const u8) ![]u8 {\n    const f = try std.fs.cwd().openFile(p, .{});\n    defer f.close();\n    return try f.readToEndAlloc(alloc, 1 << 20);\n}',
        'const n = parse(s) catch 0;   // handle it here instead'
      ]
    }
  },

  C: {
    'printf': {
      long: "Prints using a format string, where each % placeholder is replaced by the next argument. The language does not check this: pass an int where %s was expected and you get garbage or a crash, because printf simply trusts the string — which is also why a user-supplied format string is a real security hole. And remember the newline: stdout is line-buffered, so without it your output may not appear when you expect.",
      examples: [
        'printf("hp %d\\n", hp);',
        'printf("%s scored %.2f\\n", name, score);',
        'printf("%p\\n", (void *)ptr);'
      ]
    },
    'malloc': {
      long: "Asks for a block of memory of the size you give and returns a pointer to it, or NULL if it could not. The memory is UNINITIALISED — it holds whatever was there before — so reading it before writing produces bugs that only appear on someone else's machine. Every malloc needs exactly one matching free, and calloc is the version that zeroes.",
      examples: [
        'int *xs = malloc(n * sizeof *xs);\nif (!xs) return -1;',
        'char *buf = calloc(64, 1);   /* zeroed */',
        'free(xs);\nxs = NULL;'
      ]
    },
    'free': {
      long: "Gives a block back to the allocator. There are three ways to get it wrong and all are serious: forget it and you leak, use the pointer afterwards and you have a use-after-free, call it twice and you corrupt the allocator itself. Setting the pointer to NULL immediately after is a cheap habit that turns two of those into a clean crash.",
      examples: [
        'free(p);\np = NULL;',
        'free(NULL);   /* legal, and does nothing */',
        'for (int i = 0; i < n; i++) free(rows[i]);\nfree(rows);'
      ]
    },
    'stdio': {
      long: "The standard input/output header: printf, scanf, fopen, fgets, FILE. Including it brings in the DECLARATIONS so the compiler knows the signatures; the actual code lives in the C library and is linked in afterwards. Calling printf without it used to compile with a warning and then misbehave, which is precisely what headers exist to prevent.",
      examples: [
        '#include <stdio.h>',
        '#include <stdio.h>\n\nint main(void) {\n    printf("hi\\n");\n    return 0;\n}',
        'FILE *f = fopen("save.txt", "r");'
      ]
    },
    'scanf': {
      long: "Reads formatted input, and it is notoriously easy to misuse. %s writes as many characters as it finds with no idea how large your buffer is, which is a buffer overflow waiting to happen — always give it a width, or use fgets instead. It also leaves the newline sitting in the input buffer, which is why the next read appears to be skipped.",
      examples: [
        'scanf("%d", &n);',
        'char name[32];\nscanf("%31s", name);   /* bound it */',
        'fgets(line, sizeof line, stdin);   /* usually the better tool */'
      ]
    },
    'pointer': {
      long: "A variable holding an ADDRESS rather than a value. That is what makes it possible to pass something large without copying it, to let a function modify its caller's variable, and to build structures that grow. The cost is that C checks nothing: a pointer into freed, uninitialised or out-of-range memory looks exactly like a valid one until the moment it does not.",
      examples: [
        'int hp = 100;\nint *p = &hp;\n*p = 50;   /* hp is now 50 */',
        'void reset(int *hp) { *hp = 100; }',
        'if (p == NULL) return;'
      ]
    },
    'null': {
      long: "A pointer that deliberately points nowhere. Returning it is how C functions report 'nothing here' — malloc when it fails, fopen when the file will not open — so an unchecked return value is the single most common route to a segfault. It is zero in a pointer context, and dereferencing it is undefined behaviour rather than a guaranteed crash.",
      examples: [
        'if (p == NULL) return -1;',
        'FILE *f = fopen(path, "r");\nif (!f) { perror(path); return 1; }',
        'free(p);\np = NULL;'
      ]
    }
  },

  'C++': {
    'cout': {
      long: "The standard output stream, written to with <<. Chaining works because each << hands the stream back. It is type-safe in a way printf is not — the compiler picks the right overload for whatever you give it — at the cost of being wordy, which is why C++20 added std::format.",
      examples: [
        'std::cout << "hp: " << hp << "\\n";',
        'std::cout << std::fixed << std::setprecision(2) << score;',
        'std::cerr << "error\\n";   // unbuffered, for errors'
      ]
    },
    'endl': {
      long: "Writes a newline AND flushes the stream. The flush is the whole difference from a plain newline character, and it is why endl inside a loop can be dramatically slower: you are forcing a write to the operating system on every line. Use a newline by default and endl only where the output genuinely has to appear right now.",
      examples: [
        'std::cout << hp << std::endl;',
        'std::cout << hp << "\\n";   // faster: no flush',
        'std::cout << std::flush;    // flush with no newline'
      ]
    },
    'iostream': {
      long: "The header for the C++ stream objects: cin, cout, cerr and the << and >> operators. It is a famously heavy include — it drags in a large chunk of the standard library and lengthens every compile — which is why headers should include only what they need and why <iosfwd> exists for forward declarations.",
      examples: [
        '#include <iostream>',
        '#include <iostream>\n\nint main() {\n    std::cout << "hi\\n";\n}'
      ]
    },
    'template': {
      long: "Write the code once and let the compiler generate a version for each type it is used with. That is why std::vector<int> and std::vector<std::string> are equally fast — no boxing, no runtime dispatch, just two generated copies. The costs are compile time, binary size, and error messages of legendary length.",
      examples: [
        'template<class T>\nT max(T a, T b) { return a > b ? a : b; }',
        'template<class T>\nclass Stack {\n    std::vector<T> items;\n};',
        'max(1, 2);          // T deduced as int\nmax<double>(1, 2);  // forced'
      ]
    },
    'auto': {
      long: "Lets the compiler deduce the type from the initialiser. It earns its place on iterator types and lambdas that nobody wants to spell out, and in range-for loops. Watch what it deduces, though: plain auto COPIES, so `for (auto x : bigThings)` copies every element — write `const auto&` when you only mean to look.",
      examples: [
        'auto it = xs.begin();',
        'for (const auto& row : rows) { … }',
        'auto add = [](int a, int b) { return a + b; };'
      ]
    },
    'destructor': {
      long: "Runs automatically when an object is destroyed: at the end of its scope, or when whatever holds it goes away. That is the entire basis of RAII — acquire the resource in the constructor, release it in the destructor, and it becomes impossible to forget even while an exception unwinds. A base class you delete through needs a virtual destructor, or only the base part is destroyed.",
      examples: [
        '~Ship() { free(buf); }',
        'class File {\n    FILE* f;\npublic:\n    File(const char* p) { f = fopen(p, "r"); }\n    ~File() { if (f) fclose(f); }\n};',
        'virtual ~Shape() = default;'
      ]
    }
  },

  SWIFT: {
    'guard': {
      long: "An early exit that reads forwards: state the condition you NEED, and handle the failure in an else block that must leave the scope. Its real advantage over if is that anything unwrapped in a guard stays in scope for the rest of the function, so the happy path never gains a level of indentation.",
      examples: [
        'guard let p = player else { return }\np.hit()',
        'guard hp > 0 else {\n    respawn()\n    return\n}',
        'guard let url = URL(string: s), !s.isEmpty else { return nil }'
      ]
    },
    'deinit': {
      long: "Runs just before an object is destroyed, which happens when the last strong reference to it disappears. It is where you unregister observers, close connections and cancel timers. Only classes have one, because structs are values that are simply copied and dropped — and a deinit that never runs is usually a reference cycle needing weak or unowned.",
      examples: [
        'deinit {\n    NotificationCenter.default.removeObserver(self)\n}',
        'class Session {\n    deinit { socket.close() }\n}'
      ]
    },
    'mutating': {
      long: "Marks a method allowed to change the struct or enum it belongs to. Value types are immutable inside their own methods by default, so without it `hp -= 1` will not compile — the language is making you declare that calling this changes the value. A mutating method cannot be called on something declared with let.",
      examples: [
        'struct Ship {\n    var hp = 100\n    mutating func hit() { hp -= 1 }\n}',
        'var s = Ship()\ns.hit()',
        'let t = Ship()\nt.hit()   // error: t is a constant'
      ]
    },
    'optional': {
      long: "A type that may hold a value or nil, written with a trailing question mark. Swift makes it a genuinely distinct type so the compiler forces you to deal with the empty case: optional binding (if let, guard let), optional chaining, and the ?? default operator are the safe routes through. Force-unwrapping with ! skips all of that and crashes when you were wrong.",
      examples: [
        'var p: Player? = nil',
        'if let p = p { p.hit() }',
        'let name = p?.name ?? "anonymous"'
      ]
    },
    'extension': {
      long: "Adds methods, computed properties and protocol conformance to a type you did not write — including Int, String and types from Apple's own frameworks. It cannot add stored properties, because that would change the size of the type. It is also an organisation tool: one extension per protocol conformance keeps a large type readable.",
      examples: [
        'extension Int {\n    var squared: Int { self * self }\n}',
        'extension Ship: Drawable {\n    func draw() { … }\n}',
        'extension String {\n    func trimmed() -> String {\n        trimmingCharacters(in: .whitespaces)\n    }\n}'
      ]
    }
  },

  KOTLIN: {
    'val': {
      long: "A read-only reference, and Kotlin's default — reach for it until you actually need var. It means you cannot REASSIGN it; the object it points at can still change, so a val MutableList is still very much mutable. Making immutability the default is a large part of why Kotlin code has fewer accidental-state bugs than the Java it replaced.",
      examples: [
        'val hp = 100',
        'val xs = mutableListOf(1, 2)\nxs.add(3)   // fine\n// xs = mutableListOf()   // error: val cannot be reassigned',
        'val name: String by lazy { load() }'
      ]
    },
    'companion': {
      long: "The object holding what other languages call static members: factories, constants, and anything belonging to the class rather than to an instance. Kotlin has no static keyword, so this is where those live. It is a real object, which means it can implement interfaces and be passed around — something a static block never could.",
      examples: [
        'class Ship {\n    companion object {\n        const val MAX_HP = 100\n        fun create() = Ship()\n    }\n}',
        'Ship.MAX_HP',
        'companion object Factory : Creator<Ship> { … }'
      ]
    },
    'lateinit': {
      long: "Promises a non-null property will be assigned before anything reads it, so you can avoid a nullable type for something injected or set in onCreate. Reading it too early throws a clear UninitializedPropertyAccessException rather than handing you a null. It works only on var, only on non-null reference types, and never on primitives.",
      examples: [
        'lateinit var player: Player',
        'override fun onCreate() {\n    player = Player(100)\n}',
        'if (::player.isInitialized) { … }'
      ]
    },
    'reified': {
      long: "Keeps a generic type available at RUNTIME. The JVM normally erases generics, so a function cannot ask what T was; marking an inline function's type parameter reified makes the compiler paste the real type in at every call site. That is what lets you write `is T` or T::class inside a generic function, and it only works on inline functions.",
      examples: [
        'inline fun <reified T> parse(json: String): T =\n    gson.fromJson(json, T::class.java)',
        'val cfg = parse<Config>(text)',
        'inline fun <reified T> List<*>.onlyT() = filterIsInstance<T>()'
      ]
    },
    'data': {
      long: "Generates equals, hashCode, toString, copy and the componentN functions from the properties in the primary constructor. That makes it right for anything that is a value rather than an identity — a point, a DTO, a piece of UI state. Careful: only CONSTRUCTOR properties count, so a field declared in the body is invisible to equals and toString.",
      examples: [
        'data class Point(val x: Int, val y: Int)',
        'val p2 = p.copy(y = 9)',
        'val (x, y) = p   // destructuring'
      ]
    },
    '?': {
      long: "Kotlin's null safety in one character: String cannot hold null, String? can, and the compiler will not let you touch the second without checking. ?. calls only when the value is there, ?: supplies a fallback, and !! asserts it is not null and throws when you are wrong. This is the feature that turns most NullPointerExceptions into compile errors.",
      examples: [
        'var p: Player? = null',
        'val n = p?.name ?: "anonymous"',
        'val n = p!!.name   // throws if p is null'
      ]
    }
  },

  JAVA: {
    'synchronized': {
      long: "Only one thread at a time may be inside: it takes the object's monitor on the way in and releases it on the way out, even when an exception is thrown. It gives you mutual exclusion AND a memory barrier, so changes made inside are visible to the next thread that enters. It is coarse, though — java.util.concurrent locks and atomics are usually better on a hot path.",
      examples: [
        'public synchronized void add(int n) { total += n; }',
        'synchronized (lock) {\n    queue.add(item);\n}',
        'private final AtomicInteger count = new AtomicInteger();   // often better'
      ]
    },
    'transient': {
      long: "Marks a field to be SKIPPED when the object is serialised. Use it for anything that should not or cannot be written out: a cache you can recompute, an open connection, a password. After deserialisation a transient field holds the type's default — null or zero — so anything depending on it has to cope with that.",
      examples: [
        'private transient String cache;',
        'private transient Connection conn;',
        'class Session implements Serializable {\n    private String user;\n    private transient String password;\n}'
      ]
    },
    'native': {
      long: "Declares a method whose body is implemented outside Java, in C or C++, and reached through JNI. It is how the standard library touches the operating system and how a program uses an existing native library. Everything Java guarantees stops at that boundary — memory safety, exceptions, portability — so it is a last resort rather than a shortcut.",
      examples: [
        'public native void render();',
        'static { System.loadLibrary("engine"); }',
        'private native long createContext(int w, int h);'
      ]
    },
    'throws': {
      long: "Declares which checked exceptions a method can hand up, making them part of its signature. Callers must then either catch them or declare them in turn, which is Java's controversial insistence that failure be visible in the type. The habit to avoid is `throws Exception`: it tells the caller nothing and forces everybody above to handle everything.",
      examples: [
        'void load(String p) throws IOException { … }',
        'void run() throws IOException, ParseException { … }',
        'try {\n    load(p);\n} catch (IOException e) {\n    log.warn("load failed", e);\n}'
      ]
    }
  },

  'C#': {
    'linq': {
      long: "Queries any collection in a uniform way, either in method syntax or the SQL-like query syntax. The results are LAZY: nothing runs until you enumerate, so a query defined now reflects the data as it is when you finally use it, which surprises people. With Entity Framework the same expression is translated into real SQL instead of running in memory.",
      examples: [
        'var alive = players.Where(p => p.Hp > 0).Select(p => p.Name);',
        'var q = from p in players\n        where p.Hp > 0\n        orderby p.Score descending\n        select p;',
        'var list = q.ToList();   // now it actually runs'
      ]
    },
    'delegate': {
      long: "A type that holds a method you can pass around and call later — the typed function pointer behind events and callbacks. Modern C# rarely declares one by hand, because Action and Func already cover nearly every shape. Delegates are multicast: += adds another target and all of them are invoked, which is exactly how events fire.",
      examples: [
        'delegate void OnHit(int damage);',
        'Action<int> log = n => Console.WriteLine(n);',
        'Func<int, int, int> add = (a, b) => a + b;'
      ]
    },
    'writeline': {
      long: "Writes a line to the console — Console.WriteLine, the first thing anyone runs in C#. It accepts any object and calls ToString on it, and it supports composite formatting with numbered placeholders, although string interpolation has largely replaced that. Debug.WriteLine is its sibling that only writes in a debug build.",
      examples: [
        'Console.WriteLine(hp);',
        'Console.WriteLine($"hp: {hp}, pos: {x},{y}");',
        'Console.WriteLine("{0} scored {1}", name, score);'
      ]
    },
    'property': {
      long: "A field with a getter and setter behind it, which callers use exactly as though it were a field. That is the value: start with `{ get; set; }` and you can add validation, logging or laziness later without touching a single caller. `{ get; init; }` allows assignment only during construction, which is how immutable models are written now.",
      examples: [
        'public int Hp { get; set; }',
        'public int Hp {\n    get => _hp;\n    set => _hp = Math.Clamp(value, 0, 100);\n}',
        'public string Name { get; init; }'
      ]
    }
  },

  FLUTTER: {
    'widget': {
      long: "Everything on screen is a widget, and widgets are immutable DESCRIPTIONS rather than the objects actually drawn. You never mutate one; you build a new tree and Flutter diffs it against the last to work out the smallest real change. That is why padding, alignment and even gestures are widgets — composition is the only structure the framework has.",
      examples: [
        'Text("hp: 100")',
        'Padding(\n  padding: EdgeInsets.all(8),\n  child: Text("hi"),\n)',
        'class Logo extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) => Text("RAIDEN");\n}'
      ]
    },
    'scaffold': {
      long: "The standard Material page frame: slots for an app bar, a body, a floating action button, a drawer and a snackbar host, with the layout between them handled for you. Almost every screen in a Material app has one at its root — and snackbars and drawers are looked up through it, which is why showing one without a Scaffold above fails.",
      examples: [
        'Scaffold(\n  appBar: AppBar(title: Text("Play")),\n  body: Center(child: Text("hi")),\n)',
        'Scaffold(\n  body: content,\n  floatingActionButton: FloatingActionButton(\n    onPressed: start,\n    child: Icon(Icons.play_arrow),\n  ),\n)'
      ]
    },
    'stateless': {
      long: "A widget with no mutable state of its own: give it the same constructor arguments and it always builds the same thing. Use it by default and only reach for stateful when something must survive between rebuilds. Making its constructor const lets Flutter skip rebuilding that subtree entirely, which is free performance.",
      examples: [
        'class Logo extends StatelessWidget {\n  const Logo({super.key});\n\n  @override\n  Widget build(BuildContext context) => Text("RAIDEN");\n}',
        'const Logo()'
      ]
    },
    'stateful': {
      long: "A widget that keeps state across rebuilds, and it comes in two objects for a reason: the widget itself is immutable and thrown away on every rebuild, while its State survives and holds the mutable data. That is why the fields live in the State class, and why a change only takes effect when you call setState.",
      examples: [
        'class Counter extends StatefulWidget {\n  @override\n  State<Counter> createState() => _CounterState();\n}',
        'class _CounterState extends State<Counter> {\n  int n = 0;\n\n  @override\n  Widget build(BuildContext context) => TextButton(\n        onPressed: () => setState(() => n++),\n        child: Text("$n"),\n      );\n}',
        '@override\nvoid initState() {\n  super.initState();\n  controller = AnimationController(vsync: this);\n}'
      ]
    },
    'appbar': {
      long: "The bar across the top of a screen: a title, a leading button (a back arrow or drawer toggle, added automatically), and actions on the right. Handed to a Scaffold it also reserves the space under the status bar for you. For scroll-linked effects such as a collapsing header you swap it for SliverAppBar.",
      examples: [
        'AppBar(title: Text("Play"))',
        'AppBar(\n  title: Text("Play"),\n  actions: [\n    IconButton(icon: Icon(Icons.settings), onPressed: open),\n  ],\n)'
      ]
    },
    'build': {
      long: "Returns the widget tree to draw, and Flutter calls it whenever anything it depends on changes — potentially on every frame. So it must be cheap and it must be PURE: no network calls, no timers, no side effects, because you do not control how often it runs. Anything expensive belongs in initState or behind a cache.",
      examples: [
        '@override\nWidget build(BuildContext context) {\n  return Text("hp: $hp");\n}',
        'Widget build(BuildContext context) => Column(\n      children: [Logo(), PlayButton()],\n    );'
      ]
    },
    'setstate': {
      long: "Tells Flutter the State has changed so this widget should rebuild. Change the fields INSIDE the callback — mutating them outside and then calling an empty setState works by accident and hides what happened. Calling it after the widget is disposed throws, which is the standard bug when an async result arrives late; guard it with a mounted check.",
      examples: [
        'setState(() => hp -= 1);',
        'final data = await load();\nif (!mounted) return;\nsetState(() => this.data = data);'
      ]
    },
    'container': {
      long: "The general-purpose box: padding, margin, colour, size, decoration and a transform in one widget. It is convenient and slightly lazy — a Container with only padding is a Padding, and with only a colour a ColoredBox, both cheaper and clearer. Note that colour and decoration cannot both be set, because the colour lives inside the decoration.",
      examples: [
        'Container(\n  padding: EdgeInsets.all(12),\n  color: Colors.black12,\n  child: Text("hi"),\n)',
        'Container(\n  decoration: BoxDecoration(\n    borderRadius: BorderRadius.circular(8),\n    color: Colors.black12,\n  ),\n  child: Text("hi"),\n)'
      ]
    },
    'column': {
      long: "Stacks children vertically: mainAxisAlignment positions them along the vertical axis and crossAxisAlignment across it. Two things bite everyone — overflow when the content is taller than the screen, cured by a scrollable such as ListView, and an unbounded-height error when a Column sits inside another scrollable.",
      examples: [
        'Column(\n  children: [Text("a"), Text("b")],\n)',
        'Column(\n  mainAxisAlignment: MainAxisAlignment.center,\n  crossAxisAlignment: CrossAxisAlignment.start,\n  children: [Logo(), PlayButton()],\n)',
        'Expanded(child: content)   // takes the leftover vertical space'
      ]
    },
    'row': {
      long: "Lays children out horizontally, with exactly the same properties as Column but with the axes swapped, so mainAxis is the horizontal one here. Its usual failure is a long Text running off the right edge, fixed by wrapping that child in Expanded or Flexible so it takes the space that is left rather than the space it wants.",
      examples: [
        'Row(\n  children: [Icon(Icons.star), Text("900")],\n)',
        'Row(\n  children: [\n    Expanded(\n      child: Text(longTitle, overflow: TextOverflow.ellipsis),\n    ),\n    Icon(Icons.chevron_right),\n  ],\n)'
      ]
    }
  },

  PERL: {
    'qw': {
      long: "Quote words: it splits the text on whitespace and gives you a list, so you can write a run of short strings without quoting and comma-ing each one. It is used constantly for import lists and small fixed sets. Nothing inside is interpolated — every character is literal.",
      examples: [
        'my @xs = qw(a b c);',
        'use POSIX qw(floor ceil);',
        'for my $d (qw(mon tue wed)) { … }'
      ]
    },
    'bless': {
      long: "Marks a reference as belonging to a package, which is all that Perl object orientation really is: after blessing, a method call on that reference looks for subs in that package. Nearly every constructor is the same three lines — make a hashref, bless it, return it. Blessing into the class argument rather than a hard-coded name is what makes subclassing work.",
      examples: [
        'sub new {\n    my ($class, %args) = @_;\n    my $self = { hp => $args{hp} // 100 };\n    return bless $self, $class;\n}',
        'my $s = Ship->new(hp => 50);\n$s->hit;'
      ]
    },
    'wantarray': {
      long: "Asks whether the current sub was called in list context, scalar context, or neither. Perl functions genuinely behave differently depending on how their result is used, and this is how you write one that does. It is clever, and it is a readability trap — a function returning two different shapes needs a very good reason.",
      examples: [
        'return wantarray ? @xs : scalar @xs;',
        'my @all = get();   # list context\nmy $n   = get();   # scalar context'
      ]
    },
    '=~': {
      long: "Binds a string to a regex match or substitution. Without it the regex tests $_ rather than the variable you meant, which is the usual reason a match mysteriously fails. Its negated partner is !~, and the substitution form is where Perl earns its reputation: s/// edits the variable in place.",
      examples: [
        'if ($line =~ /error/) { … }',
        '$line =~ s/\\s+$//;   # strip trailing whitespace',
        'my ($k, $v) = $line =~ /^(\\w+)=(.*)$/;'
      ]
    },
    'my': {
      long: "Declares a lexically scoped variable, visible from that point to the end of the enclosing block. It is what `use strict` insists on, and using it everywhere is the single biggest improvement you can make to Perl code — without it a mistyped name silently creates a package global instead of an error. Its cousin `our` declares a package variable on purpose.",
      examples: [
        'my $hp = 100;',
        'my ($a, $b) = @_;',
        'use strict;\nuse warnings;'
      ]
    },
    'sub': {
      long: "Defines a subroutine. The arguments do not appear in the signature: they arrive flattened in the array @_, which is why almost every sub begins by unpacking them into named variables. The last expression evaluated is the return value when you do not write return explicitly.",
      examples: [
        'sub add {\n    my ($a, $b) = @_;\n    return $a + $b;\n}',
        'sub greet { print "hi $_[0]\\n" }',
        'my $double = sub { $_[0] * 2 };   # anonymous'
      ]
    },
    'chomp': {
      long: "Removes the trailing newline from a string — and only a newline, unlike chop which removes the last character whatever it happens to be. It is what you call on every line read from input, because the newline comes along with it and otherwise ends up inside your comparisons. It modifies the variable in place.",
      examples: [
        'chomp(my $line = <STDIN>);',
        'while (my $l = <$fh>) {\n    chomp $l;\n    process($l);\n}'
      ]
    }
  },

  R: {
    '%>%': {
      long: "The pipe: it takes the value on the left and passes it as the first argument to the function on the right, so a chain of transformations reads in the order it actually happens rather than inside-out. It is the defining feature of tidyverse code. Base R has since added its own |> which does nearly the same thing with no package to load.",
      examples: [
        'data %>% filter(hp > 0)',
        'runs %>%\n  filter(score > 500) %>%\n  group_by(lang) %>%\n  summarise(avg = mean(score))',
        'data |> head()   # the base R pipe'
      ]
    },
    'ggplot': {
      long: "Builds plots from a grammar: the data, an aesthetic mapping from columns to visual properties, and layers of geoms added with +. Because it composes you can build a plot up piece by piece and change one layer without redrawing the rest. Watch the punctuation — pipes to prepare the data, then plus signs between plot layers.",
      examples: [
        'ggplot(d, aes(x, y)) + geom_point()',
        'ggplot(runs, aes(lang, score)) +\n  geom_boxplot() +\n  labs(title = "Score by language")',
        'ggplot(d, aes(x, y, color = lang)) +\n  geom_line() +\n  facet_wrap(~lang)'
      ]
    },
    'dplyr': {
      long: "The data-wrangling half of the tidyverse: filter rows, select columns, mutate to add them, arrange to sort, and group_by with summarise to aggregate. The verbs are deliberately few and they compose through the pipe, so most analysis becomes one readable chain. It is essentially SQL for data frames, written in R.",
      examples: [
        'library(dplyr)',
        'runs %>%\n  filter(score > 500) %>%\n  mutate(bonus = score * 0.1) %>%\n  arrange(desc(score))',
        'runs %>%\n  group_by(lang) %>%\n  summarise(n = n(), avg = mean(score))'
      ]
    },
    'data.frame': {
      long: "A table: columns of equal length, each with its own type. It is the central data structure in R and what almost every modelling and plotting function expects to be given. Older R silently turned strings into factors here, which caused years of confusion; that stopped in R 4.0, and tibbles avoid that plus several other surprises.",
      examples: [
        'df <- data.frame(hp = 1:3, name = c("a", "b", "c"))',
        'nrow(df)\nncol(df)\nstr(df)',
        'df$score <- c(900, 500, 620)'
      ]
    },
    'vector': {
      long: "R's basic type, and the reason so much R code contains no loops: even a single number is a length-1 vector, and arithmetic applies element by element. That vectorisation is also the performance advice — `x * 2` runs in compiled code while an equivalent for loop runs in the interpreter. Every element must share one type.",
      examples: [
        'x <- c(1, 2, 3)',
        'x * 2   # 2 4 6, no loop needed',
        'length(x)\nx[2]    # R indexes from 1'
      ]
    },
    'na': {
      long: "A missing value, and it is contagious: any arithmetic involving NA gives NA, so mean(x) on a column with one gap returns NA rather than a number. That is deliberate — it forces you to decide what the gap means instead of quietly ignoring it. na.rm = TRUE drops them, and is.na() tests for them, because NA == NA is itself NA.",
      examples: [
        'mean(x, na.rm = TRUE)',
        'sum(is.na(df$score))   # how many are missing',
        'df <- na.omit(df)'
      ]
    },
    'factor': {
      long: "A categorical variable with a fixed set of levels, stored as integers with labels attached. It is what statistical models need in order to treat something as a category rather than a number, and the level ORDER controls the order of bars and legends in a plot. Converting one straight with as.numeric gives you the internal codes rather than the labels — a silent, data-corrupting classic.",
      examples: [
        'f <- factor(c("easy", "hard", "easy"))',
        'levels(f)',
        'as.numeric(as.character(f))   # the safe conversion'
      ]
    }
  },

  ASSEMBLY: {
    'mov': {
      long: "Copies a value from one place to another: register to register, memory to register, or an immediate constant into either. It does not move anything — the source is unchanged, so the name is a historical lie. On x86 you cannot mov straight from one memory location to another; one end must be a register, which is why so much assembly is shuffling values through them.",
      examples: [
        'mov eax, 1        ; constant into a register',
        'mov ebx, eax      ; register to register',
        'mov [count], eax  ; register into memory'
      ]
    },
    'eax': {
      long: "The 32-bit general-purpose accumulator. By convention it carries the return value of a function, and on 32-bit Linux the system call number, which is why you see it set immediately before an interrupt. It is the same physical register as al, ax and rax at different widths — writing to a narrow name leaves parts of the wider one alone, which catches people out.",
      examples: [
        'mov eax, 0',
        'add eax, ebx      ; eax = eax + ebx',
        'xor eax, eax      ; the idiomatic zero: shorter than mov eax, 0'
      ]
    },
    'jmp': {
      long: "An unconditional jump to a label: set the instruction pointer there and carry on. Every loop and every if in a high-level language becomes some arrangement of jmp and its conditional cousins. A backward jump is a loop and a forward jump skips a block — at this level that really is all control flow is.",
      examples: [
        'jmp loop_start',
        'loop_start:\n    dec ecx\n    cmp ecx, 0\n    jne loop_start'
      ]
    },
    'nop': {
      long: "Does nothing, for one instruction. It pads code so a function or branch target starts on a convenient address, reserves space a patch can overwrite later, and historically produced tiny timing delays. On x86 it is encoded as 0x90, which is why long runs of 0x90 in a binary are so instantly recognisable.",
      examples: [
        'nop',
        'nop\nnop\nnop   ; padding to align the next label'
      ]
    },
    'push': {
      long: "Puts a value on the stack: decrement the stack pointer, then write there. The stack grows DOWNWARD in memory on x86, which surprises everyone exactly once. It is how arguments were passed under 32-bit calling conventions, and how a function saves registers it is not allowed to clobber.",
      examples: [
        'push ebp',
        'push eax\ncall printf\nadd esp, 4   ; caller cleans up the argument'
      ]
    },
    'pop': {
      long: "Takes the top value off the stack into a register and moves the stack pointer back. Pushes and pops must balance: leave one extra push behind and ret jumps to whatever that value happened to be, which is exactly how stack-smashing attacks take control. A push/pop pair around a call is how a register survives it.",
      examples: [
        'pop ebp',
        'push ebx\n; ... use ebx ...\npop ebx   ; restore what the caller had'
      ]
    },
    'call': {
      long: "Jumps to a routine and pushes the return address on the stack so ret knows where to come back to. That single push is what makes functions, recursion and the whole call stack possible — and it is also why deep recursion overflows it. The address pushed is that of the instruction directly after the call.",
      examples: [
        'call printf',
        'call my_func\n; execution resumes here afterwards'
      ]
    },
    'ret': {
      long: "Pops the return address off the stack and jumps to it. It trusts the stack completely: if the function pushed and popped unevenly, ret sends the processor to whatever value is on top, which is the foundation of buffer-overflow exploits. Whatever sits in the return register is what the caller reads as the result.",
      examples: [
        'ret',
        'mov eax, 0\nret   ; return 0'
      ]
    },
    'cmp': {
      long: "Compares two values by subtracting them and throwing the answer away, keeping only the FLAGS it set — zero, sign, carry, overflow. It does not branch; the conditional jump on the next line reads those flags. That split is why cmp and its jump are always written as a pair, and why an instruction slipped between them can quietly break the logic.",
      examples: [
        'cmp eax, 0\nje  is_zero',
        'cmp eax, ebx\njg  greater',
        'test eax, eax\njz  is_zero   ; cheaper than comparing with 0'
      ]
    },
    'jne': {
      long: "Jump if the last comparison was NOT equal — it branches when the zero flag is clear. It is half of the standard loop shape: compare the counter, jump back while it has not reached the end. Its family covers every relation, and the signed and unsigned versions differ (jg versus ja), which is a genuine source of bugs.",
      examples: [
        'cmp eax, 5\njne not_five',
        'loop_start:\n    dec ecx\n    cmp ecx, 0\n    jne loop_start'
      ]
    },
    'register': {
      long: "Storage inside the CPU itself, and the fastest memory that exists — a handful of them, each a word wide, with no address to compute. Everything a program calculates passes through them, which is why so much assembly is load, work, store back. Compilers spend serious effort on register allocation for exactly this reason: a value spilled to memory is dramatically slower.",
      examples: [
        'mov ebx, eax     ; register to register',
        'mov eax, [ptr]   ; memory into a register',
        'xor ecx, ecx     ; zero a register'
      ]
    },
    'stack': {
      long: "A region of memory that grows and shrinks last-in-first-out, holding local variables, saved registers and return addresses. The stack pointer marks the top, and a function's frame sits between it and the base pointer. It is fast because allocating is just moving a pointer — and it is finite, which is what 'stack overflow' means quite literally.",
      examples: [
        'push ebp\nmov ebp, esp\nsub esp, 16   ; room for 16 bytes of locals',
        'mov esp, ebp\npop ebp\nret'
      ]
    },
    'syscall': {
      long: "Asks the kernel to do something a user program cannot do itself: write to a file, map memory, exit. You put the call number and its arguments into agreed registers and execute the instruction; the CPU switches to kernel mode and returns with a result. Every print and every file read in every language eventually becomes one of these.",
      examples: [
        'mov rax, 60    ; exit\nmov rdi, 0     ; status\nsyscall',
        'mov rax, 1     ; write\nmov rdi, 1     ; stdout\nsyscall',
        'mov eax, 1\nint 0x80       ; the older 32-bit Linux way'
      ]
    }
  }
};

const GlossaryDetail = {
  // language layer wins, then the shared one, then nothing. Returns
  // { long, examples } or null — the DETAILED button is only drawn when this
  // returns non-null, so a missing entry simply costs the button.
  get(langName, word) {
    // Own keys only -- the same hazard glossary.js's lookup carries. These are
    // plain objects, so `perLang['constructor']` on a language with no entry for
    // it returns the INHERITED Object constructor: truthy, so the DETAILED
    // button appeared, and the panel then rendered `long` and `examples` as
    // undefined. KOTLIN's word list really does contain `constructor`, so this
    // was live. (`toString`, `valueOf`, `__proto__` are the same trap waiting on
    // a future word list.)
    const own = (o, k) => o && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : null;
    return own(D_LANG[langName], word) || own(D_SHARED, word) || null;
  }
};
