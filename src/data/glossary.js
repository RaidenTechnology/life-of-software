// Pattern glossary — what the words you typed actually MEAN.
//
// The game asks you to type `impl`, `nonlocal`, `%>%` and `>>=` at speed, and
// until now it never told you what any of them were: you could clear HASKELL
// without learning one thing about Haskell. This file is the other half of that
// deal. After a language level, LEARN mode reviews the patterns you actually
// typed and gives each a one-line meaning and a real example.
//
// Two layers, because most keywords are shared:
//   G_SHARED  word -> [meaning, example]      cross-language keywords
//   G_LANG    LANG -> { word -> [meaning, example] }   language-specific, wins
// Lookup checks the language layer first, then the shared one, then gives up —
// an unexplained word is simply left out of the review rather than padded with
// filler. Entries are [meaning, example]: terse on purpose, this is read in a
// few seconds between levels, not studied.
//
// Coverage is deliberately front-loaded onto the early ladder (HTML -> CSS ->
// PYTHON -> JAVASCRIPT -> ...), because that is where nearly every run is spent;
// the deep languages carry their distinctive patterns rather than every word.

const G_SHARED = {
  // --- control flow ---
  'if': ['runs a block only when a condition is true', 'if (hp <= 0) gameOver()'],
  'else': ['the branch taken when the if was false', 'if (x) a() else b()'],
  'elif': ['"else if" — chain another condition without nesting', 'if a: … elif b: … else: …'],
  'switch': ['picks one branch out of many by value', 'switch (key) { case "w": up() }'],
  'case': ['one branch of a switch', 'case 3: discount() break'],
  'default': ['the switch branch used when nothing matched', 'default: unknown()'],
  'for': ['repeats a block a set number of times', 'for i in range(10): print(i)'],
  'while': ['repeats a block as long as a condition holds', 'while (running) tick()'],
  'do': ['runs the body once before checking the condition', 'do { tick() } while (alive)'],
  'break': ['leaves the loop immediately', 'for x in xs: if bad(x): break'],
  'continue': ['skips to the next turn of the loop', 'for x in xs: if skip(x): continue'],
  'return': ['hands a value back and ends the function', 'return score * 2'],
  'goto': ['jumps to a label — powerful and almost always a mistake', 'goto cleanup;'],
  'match': ['branches on the SHAPE of a value, not just equality', 'match msg { Quit => … }'],
  'when': ['a guard: only take this branch if it also holds', 'when (x) { x > 9 -> big() }'],

  // --- declaring things ---
  'var': ['declares a variable (the old, loosest kind)', 'var count = 0'],
  'let': ['declares a variable scoped to its block', 'let name = "raiden"'],
  'const': ['a name whose binding never changes', 'const MAX = 100'],
  'def': ['defines a function', 'def add(a, b): return a + b'],
  'fn': ['defines a function (the short spelling)', 'fn add(a: i32) -> i32 { a + 1 }'],
  'func': ['defines a function', 'func add(a: Int) -> Int { a + 1 }'],
  'function': ['defines a reusable block of code', 'function add(a, b) { return a + b }'],
  'lambda': ['a tiny unnamed function written inline', 'sorted(xs, key=lambda p: p.hp)'],
  'class': ['a blueprint for objects: data + the methods on it', 'class Player: def hit(self): …'],
  'struct': ['a plain bundle of fields, no behaviour required', 'struct Point { x: f32, y: f32 }'],
  'enum': ['a type that is one of a fixed set of options', 'enum State { Idle, Firing }'],
  'interface': ['a contract: the methods a type promises to have', 'interface Drawable { draw() }'],
  'protocol': ['a contract a type promises to satisfy', 'protocol Drawable { func draw() }'],
  'trait': ['shared behaviour a type can opt into', 'trait Loud { fn shout(&self); }'],
  'module': ['a named container for related code', 'module Physics'],
  'package': ['the namespace a file belongs to', 'package main'],
  'namespace': ['keeps names from colliding across a codebase', 'namespace Raiden.Core'],
  'type': ['gives a name to a shape of data', 'type Id = string'],
  'typedef': ['gives a shorter name to an existing type', 'typedef unsigned int uint;'],

  // --- objects & inheritance ---
  'new': ['builds a fresh instance of a class', 'const p = new Player()'],
  'this': ['the object the method was called on', 'this.hp -= dmg'],
  'self': ['the object the method was called on', 'def hit(self): self.hp -= 1'],
  'super': ['reaches the version the parent class defined', 'super().__init__()'],
  'extends': ['inherit everything from another class', 'class Boss extends Enemy'],
  'implements': ['promises this class satisfies an interface', 'class Ship implements Drawable'],
  'abstract': ['declared but not finished — a subclass must fill it in', 'abstract class Shape'],
  'override': ['deliberately replaces the parent version', 'override func draw() { … }'],
  'virtual': ['a method a subclass is allowed to replace', 'virtual void draw();'],
  'static': ['belongs to the type itself, not to one instance', 'static int count = 0;'],
  'final': ['cannot be changed or subclassed further', 'final int MAX = 10;'],
  'public': ['visible from anywhere', 'public int hp;'],
  'private': ['visible only inside this type', 'private int seed;'],
  'protected': ['visible to this type and its subclasses', 'protected void reset() { }'],

  // --- errors ---
  'try': ['run this and be ready for it to fail', 'try { risky() } catch (e) { … }'],
  'catch': ['handle the failure the try produced', 'catch (e) { log(e) }'],
  'except': ['handle the failure the try produced', 'except ValueError: retry()'],
  'finally': ['runs either way — the cleanup branch', 'finally: file.close()'],
  'throw': ['raise an error and abandon the current path', 'throw new Error("no fuel")'],
  'raise': ['raise an error and abandon the current path', 'raise ValueError("bad id")'],
  'rescue': ['handle the error that was raised', 'rescue => e then puts e'],
  'assert': ['state something you believe is true; crash if not', 'assert hp > 0'],
  'panic': ['give up immediately — unrecoverable', 'panic!("index out of range")'],
  'defer': ['schedule cleanup to run when the function exits', 'defer file.Close()'],

  // --- modules ---
  'import': ['pulls in code from another file or library', 'import math'],
  'from': ['names WHERE the import comes from', 'from math import sqrt'],
  'as': ['renames the thing you just imported or matched', 'import numpy as np'],
  'export': ['makes this available to other files', 'export const VERSION = 2'],
  'require': ['loads another file at runtime', "const fs = require('fs')"],
  'include': ['pastes another file in at compile time', '#include <stdio.h>'],
  'using': ['bring a namespace into scope', 'using System;'],
  'use': ['bring a path into scope so you can name it short', 'use std::io::Read;'],

  // --- values ---
  'true': ['the yes value of a boolean', 'let alive = true'],
  'false': ['the no value of a boolean', 'let alive = false'],
  'null': ['the deliberate absence of a value', 'let target = null'],
  'nil': ['the deliberate absence of a value', 'target = nil'],
  'none': ['the deliberate absence of a value', 'target = None'],
  'nullptr': ['a pointer that deliberately points at nothing', 'Node* n = nullptr;'],
  'void': ['this function returns nothing at all', 'void reset() { hp = 100; }'],
  'int': ['a whole number', 'int hp = 100;'],
  'float': ['a number with a fractional part', 'float speed = 2.5;'],
  'double': ['a float with twice the precision', 'double pi = 3.14159;'],
  'char': ['a single character', "char grade = 'S';"],
  'bool': ['true or false, nothing else', 'bool alive = true;'],
  'str': ['text', "name = str(42)"],
  'string': ['text', 'string name = "raiden";'],

  // --- collections ---
  'list': ['an ordered, growable sequence', 'xs = list(range(3))'],
  'array': ['a fixed block of values you index by number', 'int xs[10];'],
  'dict': ['key -> value lookup', 'ages = {"ada": 36}'],
  'map': ['key -> value lookup (or: apply a function to every item)', 'map[string]int{}'],
  'set': ['a collection with no duplicates', 'seen = set()'],
  'tuple': ['a fixed-size group of values', 'point = (3, 4)'],
  'vector': ['a growable array', 'vector<int> xs;'],
  'len': ['how many items are in it', 'len(players)'],
  'range': ['a sequence of numbers to walk over', 'for i in range(5):'],
  'append': ['add an item to the end', 'xs.append(4)'],
  'push': ['add an item to the end', 'xs.push(4)'],
  'pop': ['take the last item off', 'last = xs.pop()'],
  'sort': ['put the items in order', 'xs.sort()'],
  'filter': ['keep only the items that pass a test', 'filter(alive, ships)'],
  'reduce': ['fold a whole collection down to one value', 'reduce(add, xs, 0)'],

  // --- async ---
  'async': ['this function can pause and resume — it returns a promise', 'async function load() { … }'],
  'await': ['wait here for an async result without freezing everything', 'const r = await fetch(url)'],
  'yield': ['hand back one value and pause where you are', 'yield line'],
  'thread': ['a second line of execution running alongside', 'Thread t = new Thread(run);'],
  'suspend': ['a function that can pause without blocking the thread', 'suspend fun load() { … }'],
  'spawn': ['start a new concurrent task', 'spawn worker()'],

  // --- logic & operators ---
  'and': ['true only if BOTH sides are true', 'if alive and armed:'],
  'or': ['true if EITHER side is true', 'if dead or empty:'],
  'not': ['flips true to false', 'if not found:'],
  'in': ['is this item inside that collection?', "if 'a' in name:"],
  'is': ['are these the exact same object?', 'if x is None:'],
  '==': ['are these two values equal?', 'if (hp == 0) die()'],
  '!=': ['are these two values different?', 'if (a != b) swap()'],
  '&&': ['true only if BOTH sides are true', 'if (alive && armed)'],
  '||': ['true if EITHER side is true', 'if (dead || empty)'],
  '=>': ['a compact function: inputs on the left, result on the right', 'xs.map(x => x * 2)'],
  '->': ['points at what a function gives back', 'def f(x) -> int:'],
  '::': ['reaches inside a namespace or type', 'std::cout'],
  '&': ['borrow a reference instead of copying the value', 'fn read(s: &str)'],
  '*': ['follow a pointer to the value it points at', 'int v = *ptr;'],
  '%': ['the remainder after division — the modulo', 'if (i % 2 == 0)'],
  '++': ['add one', 'count++;'],
  '+=': ['add to what is already there', 'score += 10'],
  '**': ['raise to a power', '2 ** 10  # 1024'],
  '//': ['divide and throw away the remainder', '7 // 2  # 3'],
  ':=': ['assign inside an expression (the walrus)', 'if (n := len(xs)) > 3:'],
  '?': ['the optional/failure marker — may or may not hold a value', 'let x = parse()?;'],
  '!': ['flips true to false', 'if (!ready) wait()'],

  // --- misc ---
  'print': ['write something out so a human can see it', 'print("hello")'],
  'input': ['read what the user types', 'name = input("who? ")'],
  'open': ['get a handle on a file', "f = open('save.txt')"],
  'close': ['let the file or connection go', 'f.close()'],
  'pass': ['do nothing — a placeholder that keeps the block legal', 'def todo(): pass'],
  'end': ['closes a block that was opened without braces', 'if x then y() end'],
  'begin': ['opens a block', 'begin … end'],
  'then': ['what to do when the condition held', 'if x then act() end'],
  'with': ['borrow a resource and give it back automatically', 'with open(p) as f:'],
  'global': ['reach the variable outside this function', 'global score'],
  'delete': ['remove it', 'delete obj.key'],
  'typeof': ['what kind of thing is this?', 'typeof x === "string"'],
  'instanceof': ['is this object of that class?', 'x instanceof Player'],
  'sizeof': ['how many bytes does this take?', 'sizeof(int)'],
  'inline': ['ask the compiler to paste the body in instead of calling', 'inline int sq(int x)'],
  'unsafe': ['a block where you take responsibility for memory yourself', 'unsafe { *p = 1; }'],
  'main': ['where the program starts', 'func main() { … }']
};

const G_LANG = {
  HTML: {
    'html': ['the root element — everything on the page lives inside it', '<html lang="en">…</html>'],
    'head': ['page metadata: title, styles, scripts. Nothing here is drawn', '<head><title>…</title></head>'],
    'body': ['everything the visitor actually sees', '<body><h1>hi</h1></body>'],
    'title': ['the name in the browser tab (and in search results)', '<title>Life of Software</title>'],
    'meta': ['facts ABOUT the page: charset, viewport, description', '<meta charset="UTF-8">'],
    'link': ['pulls in an external file, almost always a stylesheet', '<link rel="stylesheet" href="a.css">'],
    'script': ['runs JavaScript on the page', '<script src="game.js"></script>'],
    'style': ['CSS written inline in the page', '<style>body { margin: 0 }</style>'],
    'div': ['a generic box — the workhorse for grouping and layout', '<div class="card">…</div>'],
    'span': ['a generic inline box, for styling part of a line', 'a <span class="hot">word</span>'],
    'p': ['a paragraph of text', '<p>Type the pattern.</p>'],
    'a': ['a link to somewhere else', '<a href="/play">play</a>'],
    'img': ['an image', '<img src="hero.png" alt="hero">'],
    'href': ['WHERE a link points', '<a href="https://itch.io">itch</a>'],
    'src': ['WHERE an image/script loads its file from', '<img src="hero.png">'],
    'alt': ['text read out when the image cannot be seen — accessibility', '<img src="h.png" alt="the hero">'],
    'class': ['a reusable label CSS and JS can select on', '<div class="card wide">'],
    'id': ['a unique name for ONE element', '<div id="game">'],
    'ul': ['an unordered (bulleted) list', '<ul><li>one</li></ul>'],
    'ol': ['an ordered (numbered) list', '<ol><li>first</li></ol>'],
    'li': ['one item inside a list', '<li>a pattern</li>'],
    'table': ['tabular data — rows and columns', '<table><tr><td>1</td></tr></table>'],
    'tr': ['one row of a table', '<tr><td>hp</td></tr>'],
    'td': ['one cell of data in a row', '<td>100</td>'],
    'th': ['a header cell — names the column', '<th>score</th>'],
    'form': ['collects input and sends it somewhere', '<form action="/save">…</form>'],
    'input': ['a field the visitor types into', '<input type="text" name="q">'],
    'button': ['something to click', '<button>START</button>'],
    'label': ['names an input so it is clickable and readable aloud', '<label for="q">search</label>'],
    'select': ['a dropdown of options', '<select><option>easy</option></select>'],
    'option': ['one choice inside a dropdown', '<option value="hard">hard</option>'],
    'textarea': ['a multi-line text field', '<textarea rows="4"></textarea>'],
    'header': ['the top band of a page or section', '<header><h1>title</h1></header>'],
    'footer': ['the bottom band — credits, links, small print', '<footer>© 2026</footer>'],
    'nav': ['the block of navigation links', '<nav><a href="/">home</a></nav>'],
    'section': ['a themed chunk of the page', '<section id="about">…</section>'],
    'article': ['a piece that would still make sense on its own', '<article>a post</article>'],
    'main': ['the one block of content unique to this page', '<main>…</main>'],
    'aside': ['content beside the main point — a sidebar', '<aside>related</aside>'],
    'h1': ['the top-level heading. One per page', '<h1>LIFE OF SOFTWARE</h1>'],
    'h2': ['a section heading under the h1', '<h2>What is in it</h2>'],
    'h3': ['a sub-heading under an h2', '<h3>Controls</h3>'],
    'br': ['a line break', 'line one<br>line two'],
    'hr': ['a horizontal rule — a thematic break', '<hr>'],
    'strong': ['this matters — bold, and read with emphasis', '<strong>deprecated</strong>'],
    'em': ['stress this word — italic, and read with emphasis', 'it is <em>your</em> clock'],
    'iframe': ['embeds another whole page inside this one (itch runs games this way)', '<iframe src="game.html">'],
    'canvas': ['a blank pixel surface you draw on with code — this game runs on one', '<canvas id="game">'],
    'video': ['plays a video file', '<video src="clip.mp4" controls>'],
    'audio': ['plays a sound file', '<audio src="hit.wav">'],
    'doctype': ['the first line — tells the browser to use modern rules', '<!DOCTYPE html>']
  },
  CSS: {
    'color': ['the colour of the TEXT', 'color: #dcdcaa;'],
    'background': ['what sits behind the element', 'background: #1e1e1e;'],
    'margin': ['space OUTSIDE the box, pushing neighbours away', 'margin: 0 auto;'],
    'padding': ['space INSIDE the box, between border and content', 'padding: 12px;'],
    'border': ['the line drawn around the box', 'border: 1px solid #333;'],
    'width': ['how wide the box is', 'width: 960px;'],
    'height': ['how tall the box is', 'height: 540px;'],
    'display': ['what KIND of box this is — the single most important property', 'display: flex;'],
    'flex': ['lay children out in a row or column that shares space', 'display: flex; gap: 8px;'],
    'grid': ['lay children out on real rows and columns', 'display: grid;'],
    'position': ['how the box is placed: normal flow, or lifted out of it', 'position: absolute;'],
    'absolute': ['placed relative to its positioned ancestor, out of the flow', 'position: absolute; top: 0;'],
    'relative': ['stays in the flow, but can be nudged — and anchors absolute children', 'position: relative;'],
    'fixed': ['pinned to the screen; does not scroll away', 'position: fixed; bottom: 0;'],
    'sticky': ['scrolls normally until it hits an edge, then sticks', 'position: sticky; top: 0;'],
    'float': ['the old way to wrap text around a box', 'float: left;'],
    'clear': ['stop floating neighbours from sitting beside this', 'clear: both;'],
    'font': ['the typeface and its size', 'font: 14px monospace;'],
    'hover': ['style that applies while the pointer is over it', 'a:hover { color: #fff }'],
    'focus': ['style while it is keyboard-focused — do not remove it, it is accessibility', 'input:focus { outline: 2px }'],
    'active': ['style during the press itself', 'button:active { transform: scale(.98) }'],
    'before': ['inserts generated content in front of the element', 'a::before { content: "→" }'],
    'after': ['inserts generated content after the element', 'a::after { content: "↗" }'],
    'transform': ['move, rotate or scale without disturbing layout', 'transform: rotate(45deg);'],
    'transition': ['animate between two states smoothly', 'transition: opacity .2s;'],
    'animation': ['run a named keyframe sequence', 'animation: pulse 1s infinite;'],
    'opacity': ['how see-through it is, 0 to 1', 'opacity: .55;'],
    'z-index': ['who draws on top when boxes overlap', 'z-index: 40;'],
    'overflow': ['what happens to content too big for the box', 'overflow: hidden;'],
    'cursor': ['which mouse pointer to show over it', 'cursor: pointer;'],
    'align': ['line children up on the cross axis', 'align-items: center;'],
    'justify': ['line children up on the main axis', 'justify-content: space-between;'],
    'gap': ['space between grid/flex children — no margin hacks needed', 'gap: 12px;'],
    'rem': ['a size relative to the ROOT font size — scales with user settings', 'padding: 1.5rem;'],
    'vh': ['1% of the viewport HEIGHT', 'height: 100vh;'],
    'vw': ['1% of the viewport WIDTH', 'width: 50vw;'],
    'rgba': ['a colour plus an alpha channel', 'background: rgba(0,0,0,.5);'],
    'calc': ['do arithmetic across different units', 'width: calc(100% - 40px);'],
    'media': ['apply rules only at certain screen sizes or settings', '@media (max-width: 600px) { … }'],
    'important': ['force this rule to win. A last resort, and it hurts later', 'color: red !important;'],
    'inherit': ['take whatever the parent has', 'color: inherit;'],
    'initial': ['reset to the property default', 'display: initial;'],
    'none': ['off — not displayed, or no border at all', 'display: none;'],
    'auto': ['let the browser work it out', 'margin: 0 auto;'],
    'block': ['takes a full line of its own', 'display: block;'],
    'inline': ['sits inside a line of text', 'display: inline;'],
    'hidden': ['invisible, but still taking up its space', 'visibility: hidden;'],
    'root': ['the top element — where you keep your CSS variables', ':root { --bg: #1e1e1e }'],
    'var': ['reads a CSS custom property', 'color: var(--bg);']
  },
  PYTHON: {
    'def': ['defines a function. Indentation IS the block in Python', 'def hit(dmg):\n    hp -= dmg'],
    'elif': ['"else if" — Python spells it short', 'if a: … elif b: … else: …'],
    'nonlocal': ['write to a variable in the ENCLOSING function, not the global one', 'def outer():\n  n=0\n  def inc(): nonlocal n; n+=1'],
    'pass': ['do nothing — Python needs a body, this is the empty one', 'def todo():\n    pass'],
    'except': ['catch the error the try raised', 'except ValueError:\n    retry()'],
    'lambda': ['a one-expression function with no name', 'sorted(xs, key=lambda p: p.hp)'],
    'yield': ['makes it a generator: hands out one value and pauses', 'def lines():\n    yield "a"'],
    'self': ['the instance — Python passes it explicitly, unlike most languages', 'def hit(self):\n    self.hp -= 1'],
    'with': ['borrow a resource and close it automatically, even on error', 'with open(p) as f:\n    f.read()'],
    'dict': ['key -> value lookup', "ages = {'ada': 36}"],
    'tuple': ['a fixed group you cannot change afterwards', 'point = (3, 4)'],
    'assert': ['claim something is true; raise if it is not', 'assert hp > 0, "dead"'],
    'del': ['remove a name or an item', 'del cache[key]'],
    ':=': ['the walrus: assign AND use the value in one expression', 'if (n := len(xs)) > 3:'],
    '//': ['floor division — divide and drop the remainder', '7 // 2  # 3'],
    '**': ['power', '2 ** 10  # 1024']
  },
  JAVASCRIPT: {
    'let': ['a block-scoped variable — the modern default with const', 'let i = 0'],
    'const': ['a binding that cannot be reassigned (the object can still change)', 'const cfg = { fps: 60 }'],
    'var': ['the old function-scoped declaration. Avoid it in new code', 'var x = 1'],
    'function': ['defines a function', 'function add(a, b) { return a + b }'],
    '=>': ['arrow function — shorter, and it keeps the outer `this`', 'xs.map(x => x * 2)'],
    'document': ['the live page itself — your handle on the DOM', "document.getElementById('game')"],
    'window': ['the browser tab — globals, timers, events all hang off it', "window.addEventListener('blur', …)"],
    'promise': ['a value that is not ready yet but will be', 'new Promise((ok, fail) => …)'],
    'fetch': ['ask the network for something. Returns a promise', "const r = await fetch('/api')"],
    'async': ['marks a function that can await — it returns a promise', 'async function load() { … }'],
    'await': ['pause here for the promise without blocking the page', 'const data = await r.json()'],
    'null': ['deliberately nothing', 'let target = null'],
    'undefined': ['never given a value at all — different from null', 'let x; // undefined'],
    'typeof': ['what kind of value is this?', 'typeof x === "string"'],
    'json': ['the text format the web moves data in', 'JSON.stringify(save)'],
    'settimeout': ['run this once, later', 'setTimeout(tick, 500)'],
    'localstorage': ['key -> value storage that survives closing the tab', "localStorage.setItem('best', '9')"],
    'console': ['the developer log — where you find out what actually happened', "console.log(hp)"]
  },
  LUA: {
    'local': ['keeps the variable in this scope — without it, Lua makes it GLOBAL', 'local hp = 100'],
    'ipairs': ['walk an array in order, 1..n', 'for i, v in ipairs(xs) do'],
    'pairs': ['walk every key of a table, in no particular order', 'for k, v in pairs(t) do'],
    'tostring': ['turn a value into text', 'print(tostring(hp))'],
    'tonumber': ['turn text into a number (or nil if it is not one)', "n = tonumber('42')"],
    'nil': ['nothing. Assigning nil is also how you delete a key', 't[k] = nil'],
    'end': ['closes a block — Lua uses words, not braces', 'if x then act() end'],
    'then': ['follows the condition of an if', 'if hp <= 0 then die() end'],
    'repeat': ['loop until a condition becomes true', 'repeat tick() until done'],
    'table': ['the ONE data structure in Lua — array and dictionary at once', 't = { hp = 100 }']
  },
  RUBY: {
    'puts': ['print with a newline', 'puts "hello"'],
    'attr_accessor': ['generates the getter and setter for you', 'attr_accessor :hp'],
    'rescue': ['catch an error that was raised', 'rescue => e then puts e'],
    'to_s': ['the object as a string — Ruby calls it when printing', 'def to_s; "Ship"; end'],
    'end': ['closes a block — Ruby uses words, not braces', 'def hit; hp -= 1; end'],
    'unless': ['if NOT — reads better than negating', 'unless alive then respawn end'],
    'yield': ['run the block the caller handed to this method', 'def each; yield 1; end'],
    'nil': ['nothing', 'target = nil'],
    'module': ['a namespace, and a bag of methods to mix into classes', 'module Physics; end'],
    'require': ['load another file or gem', "require 'json'"],
    'symbol': ['a lightweight immutable name, written with a colon', ':hp']
  },
  PHP: {
    'echo': ['send text straight to the page', 'echo "hello";'],
    'isset': ['does this variable exist and hold something?', 'if (isset($_GET["id"]))'],
    'empty': ['missing, zero, empty string — all count as empty', 'if (empty($name))'],
    'array': ['PHP arrays are ordered maps — list and dictionary in one', '$a = ["hp" => 100];'],
    'foreach': ['walk every item of an array', 'foreach ($xs as $x) { … }'],
    '.=': ['append to the end of a string', '$out .= "line\\n";'],
    'null': ['deliberately nothing', '$target = null;'],
    'function': ['defines a function', 'function add($a, $b) { return $a + $b; }'],
    'global': ['reach a variable from outside the function', 'global $config;']
  },
  SQL: {
    'select': ['choose which columns come back', 'SELECT name, score FROM runs'],
    'from': ['which table the rows come from', 'SELECT * FROM players'],
    'where': ['keep only the rows that match', 'WHERE score > 1000'],
    'join': ['stitch two tables together on a shared key', 'JOIN runs ON runs.id = p.id'],
    'inner': ['keep only rows that matched on BOTH sides', 'INNER JOIN runs ON …'],
    'left': ['keep every row on the left, matched or not', 'LEFT JOIN runs ON …'],
    'group': ['collapse rows into buckets so you can total them', 'GROUP BY player_id'],
    'having': ['like WHERE, but it filters the GROUPS, after aggregating', 'HAVING COUNT(*) > 3'],
    'order': ['sort the result', 'ORDER BY score DESC'],
    'limit': ['stop after this many rows', 'LIMIT 10'],
    'distinct': ['drop duplicate rows', 'SELECT DISTINCT lang FROM runs'],
    'insert': ['add new rows', "INSERT INTO runs (score) VALUES (900)"],
    'update': ['change rows that already exist', 'UPDATE runs SET score = 0'],
    'delete': ['remove rows. Bring a WHERE, always', 'DELETE FROM runs WHERE id = 3'],
    'count': ['how many rows', 'SELECT COUNT(*) FROM runs'],
    'index': ['a lookup structure that makes a WHERE fast', 'CREATE INDEX ON runs(score)'],
    'primary': ['the column that uniquely identifies a row', 'id INTEGER PRIMARY KEY'],
    'foreign': ['a column pointing at another table\u2019s key', 'FOREIGN KEY (p_id) REFERENCES p(id)'],
    'commit': ['make the transaction permanent', 'COMMIT;'],
    'rollback': ['undo everything since the transaction began', 'ROLLBACK;'],
    'null': ['unknown — and it never equals anything, not even itself', 'WHERE deleted_at IS NULL']
  },
  DART: {
    'mixin': ['behaviour you fold into a class without inheriting', 'mixin Loud { void shout() {} }'],
    'factory': ['a constructor free to return a cached or different instance', 'factory Cfg() => _shared;'],
    'late': ['I will set this before anyone reads it — promise', 'late Player p;'],
    'required': ['this named argument is not optional', 'Ship({required this.hp});'],
    'final': ['set once, then fixed', 'final hp = 100;'],
    'var': ['let Dart infer the type', 'var name = "raiden";'],
    'void': ['returns nothing', 'void reset() {}'],
    'async': ['can await — returns a Future', 'Future<int> load() async { … }'],
    'await': ['wait for the Future without blocking the UI', 'final d = await load();']
  },
  TYPESCRIPT: {
    'interface': ['the shape an object must have — erased at runtime', 'interface P { hp: number }'],
    'type': ['names any shape, including unions', 'type Id = string | number'],
    'keyof': ['the union of an object type\u2019s keys', 'type K = keyof Player'],
    'infer': ['capture a type inside a conditional type', 'T extends Array<infer U> ? U : never'],
    'satisfies': ['check it fits a type WITHOUT widening what you wrote', 'const c = {…} satisfies Config'],
    'declare': ['tell TS something exists, defined elsewhere', 'declare const VERSION: string'],
    'readonly': ['this property cannot be assigned after construction', 'readonly id: string'],
    'enum': ['a named set of constants', 'enum State { Idle, Firing }'],
    'never': ['a value that can never happen — great for exhaustive checks', 'function fail(): never'],
    'unknown': ['like any, but you must narrow it before use — the safe any', 'let x: unknown'],
    'any': ['turns type checking off for this value. Use sparingly', 'let x: any'],
    'generic': ['code that works over a type you fill in later', 'function id<T>(x: T): T'],
    'as': ['assert a type the compiler cannot prove', 'el as HTMLCanvasElement']
  },
  JAVA: {
    'public': ['visible from anywhere', 'public class Main { }'],
    'static': ['belongs to the class, not to an instance', 'public static void main(String[] a)'],
    'void': ['returns nothing', 'public void reset() { }'],
    'final': ['cannot be reassigned or subclassed', 'final int MAX = 10;'],
    'synchronized': ['only one thread inside at a time', 'synchronized void add() { }'],
    'transient': ['skip this field when serialising', 'transient String cache;'],
    'native': ['implemented outside Java, in C', 'native void render();'],
    'extends': ['inherit from a class', 'class Boss extends Enemy'],
    'implements': ['satisfy an interface', 'class Ship implements Drawable'],
    'interface': ['the contract, no implementation', 'interface Drawable { void draw(); }'],
    'throws': ['declares the errors this method can hand up', 'void load() throws IOException']
  },
  KOTLIN: {
    'val': ['read-only — Kotlin\u2019s default', 'val hp = 100'],
    'var': ['a variable you can reassign', 'var score = 0'],
    'fun': ['defines a function', 'fun add(a: Int) = a + 1'],
    'companion': ['the object that holds a class\u2019s "static" members', 'companion object { const val MAX = 9 }'],
    'lateinit': ['non-null, but assigned later', 'lateinit var p: Player'],
    'reified': ['keeps the generic type at runtime (inline functions only)', 'inline fun <reified T> load()'],
    'suspend': ['can pause without blocking the thread — coroutines', 'suspend fun load() { … }'],
    'data': ['generates equals/hashCode/copy/toString for you', 'data class Point(val x: Int)'],
    'when': ['Kotlin\u2019s switch, but it is an expression', 'when (x) { 1 -> a(); else -> b() }'],
    '?': ['this type may be null, and the compiler will make you check', 'var p: Player? = null']
  },
  'C#': {
    'linq': ['query collections in SQL-ish syntax', 'from p in ps where p.Hp > 0 select p'],
    'delegate': ['a type that holds a function you can pass around', 'delegate void OnHit(int d);'],
    'writeline': ['print a line to the console', 'Console.WriteLine(hp);'],
    'namespace': ['groups types and keeps names from colliding', 'namespace Raiden.Core'],
    'using': ['import a namespace (or auto-dispose a resource)', 'using System;'],
    'var': ['let the compiler infer the type', 'var xs = new List<int>();'],
    'async': ['can await — returns a Task', 'async Task Load() { … }'],
    'property': ['a field with a getter/setter behind it', 'public int Hp { get; set; }'],
    'struct': ['a value type — copied on assignment, unlike a class', 'struct Point { public int X; }']
  },
  FLUTTER: {
    'widget': ['everything on screen is a widget, nested into a tree', 'class App extends StatelessWidget'],
    'scaffold': ['the standard page frame: app bar, body, buttons', 'Scaffold(body: Text("hi"))'],
    'stateless': ['a widget that never changes after it is built', 'class Logo extends StatelessWidget'],
    'stateful': ['a widget that keeps state and rebuilds when it changes', 'class Counter extends StatefulWidget'],
    'appbar': ['the bar across the top of a screen', 'AppBar(title: Text("Play"))'],
    'build': ['returns the widget tree to draw — called on every rebuild', 'Widget build(ctx) => Text("hi");'],
    'setstate': ['tell Flutter the state changed so it repaints', 'setState(() => hp -= 1);'],
    'container': ['a box with padding, colour, size — the div of Flutter', 'Container(padding: …)'],
    'column': ['stack children vertically', 'Column(children: [a, b])'],
    'row': ['lay children out horizontally', 'Row(children: [a, b])']
  },
  SWIFT: {
    'let': ['a constant — Swift\u2019s default', 'let hp = 100'],
    'var': ['a variable you can change', 'var score = 0'],
    'func': ['defines a function', 'func add(_ a: Int) -> Int { a + 1 }'],
    'guard': ['bail out early unless the condition holds — keeps nesting flat', 'guard let p = player else { return }'],
    'deinit': ['runs when the object is destroyed', 'deinit { save() }'],
    'mutating': ['this method is allowed to change the struct it belongs to', 'mutating func hit() { hp -= 1 }'],
    'protocol': ['a contract types can adopt', 'protocol Drawable { func draw() }'],
    'optional': ['a value that may be absent, and you must unwrap it', 'var p: Player?'],
    'extension': ['add methods to a type you did not write', 'extension Int { func sq() … }']
  },
  GO: {
    'func': ['defines a function', 'func add(a int) int { return a + 1 }'],
    'chan': ['a typed pipe goroutines send values down', 'ch := make(chan int)'],
    'go': ['run this function concurrently, right now', 'go worker(ch)'],
    'defer': ['run this when the function returns — cleanup that cannot be forgotten', 'defer f.Close()'],
    'fallthrough': ['carry on into the next case (Go does not do it by default)', 'case 1: fallthrough'],
    'fmt': ['the formatting/printing package', 'fmt.Println(hp)'],
    'recover': ['catch a panic and keep the program alive', 'defer func(){ recover() }()'],
    'struct': ['a bundle of fields — Go has no classes', 'type P struct { Hp int }'],
    'interface': ['a set of methods; any type with them satisfies it implicitly', 'type Drawer interface { Draw() }'],
    'err': ['Go returns errors as values, and you check them every time', 'if err != nil { return err }']
  },
  BASH: {
    'echo': ['print a line', 'echo "building…"'],
    'chmod': ['change file permissions', 'chmod +x build.sh'],
    'sudo': ['run as the superuser. Think first', 'sudo apt install git'],
    'awk': ['a whole little language for slicing text by column', "awk '{print $2}' log.txt"],
    'grep': ['find lines matching a pattern', "grep -n 'TODO' *.js"],
    'esac': ['ends a case block — "case" spelled backwards', 'case $1 in a) …;; esac'],
    'fi': ['ends an if block — "if" backwards', 'if [ -f x ]; then …; fi'],
    'done': ['ends a loop body', 'for f in *; do …; done'],
    'export': ['put a variable into the environment of child processes', 'export PORT=8766'],
    'pipe': ['feed one command\u2019s output into the next', 'cat log | grep err | wc -l']
  },
  PERL: {
    'qw': ['quote a whole list of words without quoting each', "my @xs = qw(a b c);"],
    'bless': ['marks a reference as belonging to a class — Perl\u2019s OO', 'bless $self, $class;'],
    'wantarray': ['am I being called in list context or scalar context?', 'return wantarray ? @xs : \\@xs;'],
    '=~': ['bind a string to a regex match or substitution', 'if ($line =~ /error/) { … }'],
    'my': ['declare a lexical variable', 'my $hp = 100;'],
    'sub': ['defines a subroutine', 'sub add { $_[0] + 1 }'],
    'chomp': ['strip the trailing newline off input', 'chomp(my $l = <STDIN>);']
  },
  R: {
    '%>%': ['the pipe: feed the left result into the next function', 'data %>% filter(hp > 0)'],
    'ggplot': ['the grammar-of-graphics plotting library', 'ggplot(d, aes(x, y)) + geom_point()'],
    'dplyr': ['the data-wrangling toolkit: filter, mutate, summarise', 'library(dplyr)'],
    'data.frame': ['a table: columns of equal length, each its own type', 'df <- data.frame(hp = 1:3)'],
    'vector': ['R\u2019s basic type — even one number is a length-1 vector', 'x <- c(1, 2, 3)'],
    'na': ['a missing value, and it spreads through arithmetic', 'mean(x, na.rm = TRUE)'],
    'factor': ['a categorical variable with a fixed set of levels', 'factor(c("easy","hard"))']
  },
  C: {
    'printf': ['print with a format string', 'printf("hp %d\\n", hp);'],
    'malloc': ['ask for memory. You must free it yourself', 'int *p = malloc(4 * n);'],
    'free': ['give memory back. Forget, and it leaks', 'free(p);'],
    'stdio': ['the standard input/output header', '#include <stdio.h>'],
    'scanf': ['read formatted input. Notorious for buffer bugs', 'scanf("%d", &n);'],
    'pointer': ['a variable holding an ADDRESS instead of a value', 'int *p = &hp;'],
    'sizeof': ['how many bytes a type takes', 'sizeof(int)'],
    'struct': ['a bundle of fields — C has no classes', 'struct P { int hp; };'],
    'null': ['a pointer deliberately pointing nowhere', 'if (p == NULL) return;'],
    'const': ['promises this will not be modified through this name', 'const char *name;']
  },
  'C++': {
    'cout': ['the standard output stream', 'std::cout << hp;'],
    'endl': ['newline, and flush the stream', 'cout << hp << endl;'],
    'iostream': ['the streams header', '#include <iostream>'],
    'nullptr': ['a properly typed null pointer (better than NULL)', 'Node* n = nullptr;'],
    'template': ['write code once, for any type', 'template<class T> T max(T a, T b)'],
    'vector': ['a growable array — the default container', 'std::vector<int> xs;'],
    'namespace': ['keeps names apart', 'namespace raiden { … }'],
    'auto': ['let the compiler deduce the type', 'auto it = xs.begin();'],
    'virtual': ['a method a subclass may override, dispatched at runtime', 'virtual void draw();'],
    'destructor': ['runs when the object dies — where C++ cleans up', '~Ship() { free(buf); }']
  },
  ZIG: {
    'comptime': ['run this at COMPILE time — Zig\u2019s answer to generics and macros', 'fn max(comptime T: type, …)'],
    'errdefer': ['cleanup that runs only if the function returns an error', 'errdefer allocator.free(buf);'],
    'anytype': ['accept any type, resolved at compile time', 'fn log(v: anytype) void'],
    'orelse': ['use this value if the optional was null', 'const p = maybe orelse default;'],
    'defer': ['cleanup that runs when the scope exits', 'defer file.close();'],
    'try': ['unwrap or return the error up the chain', 'const f = try open(path);'],
    'allocator': ['Zig hands you memory explicitly — no hidden allocations', 'const buf = try alloc.alloc(u8, 64);']
  },
  RUST: {
    'impl': ['where a type\u2019s methods (or a trait implementation) live', 'impl Ship { fn hit(&mut self) {} }'],
    'crate': ['a Rust package/compilation unit', 'use crate::game::Ship;'],
    'dyn': ['a trait object — the type is decided at runtime', 'Box<dyn Drawable>'],
    '&mut': ['a mutable borrow — exactly one may exist at a time', 'fn hit(&mut self)'],
    'fn': ['defines a function', 'fn add(a: i32) -> i32 { a + 1 }'],
    'let': ['bind a value. Immutable unless you say mut', 'let hp = 100;'],
    'mut': ['makes the binding changeable — Rust defaults to immutable', 'let mut score = 0;'],
    'match': ['branch on the shape of a value, and cover every case', 'match msg { Quit => …, _ => … }'],
    'option': ['Some(value) or None — Rust has no null', 'let p: Option<Ship> = None;'],
    'result': ['Ok(value) or Err(error) — errors are values here', 'fn load() -> Result<Cfg, Error>'],
    'trait': ['shared behaviour a type opts into', 'trait Draw { fn draw(&self); }'],
    'unwrap': ['take the value, and panic if there is not one. Cheap and dangerous', 'let v = maybe.unwrap();'],
    'borrow': ['use a value without taking ownership of it', 'fn read(s: &str)'],
    'ownership': ['every value has exactly one owner; drop it and it is freed', 'let b = a; // a moved'],
    'lifetime': ['how long a reference stays valid, written in the type', "fn first<'a>(x: &'a str) -> &'a str"]
  },
  HASKELL: {
    'putstrln': ['print a line', 'putStrLn "hello"'],
    'deriving': ['let the compiler write the boilerplate instances', 'data P = P Int deriving (Show, Eq)'],
    'newtype': ['a zero-cost wrapper around one type, for safety', 'newtype Hp = Hp Int'],
    '>>=': ['bind: feed a wrapped value into the next step', 'getLine >>= putStrLn'],
    'data': ['defines a new type by listing its shapes', 'data Shape = Circle Float | Rect Float Float'],
    'where': ['local definitions attached to the clause above', 'f x = y + 1 where y = x * 2'],
    'monad': ['a pattern for chaining computations that carry context', 'instance Monad Maybe where …'],
    'maybe': ['Just a value, or Nothing — Haskell has no null', 'lookup k m :: Maybe v'],
    'pure': ['no side effects: same input, same output, always', 'square x = x * x'],
    'lazy': ['nothing is computed until it is actually needed', 'take 5 [1..]  -- infinite list, fine'],
    'curry': ['every function takes one argument and returns a function', 'add 1 2  -- (add 1) 2']
  },
  ASSEMBLY: {
    'mov': ['copy a value from one place to another — the workhorse', 'mov eax, 1'],
    'eax': ['a general-purpose 32-bit register; return values land here', 'mov eax, 0'],
    'jmp': ['jump to a label unconditionally', 'jmp loop_start'],
    'nop': ['do nothing, for one instruction. Used for padding and timing', 'nop'],
    'push': ['put a value on the stack', 'push ebp'],
    'pop': ['take the top value off the stack', 'pop ebp'],
    'call': ['jump to a routine and remember where to come back to', 'call printf'],
    'ret': ['return to whoever called you', 'ret'],
    'cmp': ['compare two values and set the flags', 'cmp eax, 0'],
    'jne': ['jump if the last comparison was NOT equal', 'jne skip'],
    'register': ['storage inside the CPU itself — the fastest memory there is', 'mov ebx, eax'],
    'stack': ['the LIFO scratch memory holding locals and return addresses', 'push eax'],
    'syscall': ['ask the kernel to do something for you', 'syscall  ; write(1, …)']
  }
};

const Glossary = {
  // language layer wins, then the shared one, then nothing. Returns
  // { word, what, ex } or null — callers skip nulls rather than pad.
  lookup(langName, word) {
    const perLang = G_LANG[langName];
    const e = (perLang && perLang[word]) || G_SHARED[word];
    return e ? { word: word, what: e[0], ex: e[1] } : null;
  },

  // every explained pattern from `words`, in the order given, capped.
  review(langName, words, cap) {
    const out = [];
    for (const w of words) {
      const e = this.lookup(langName, w);
      if (e) out.push(e);
      if (cap && out.length >= cap) break;
    }
    return out;
  },

  // how much of a language's list the glossary can actually teach — used to
  // decide whether the review card is worth showing at all.
  coverage(lang) {
    let n = 0;
    for (const w of lang.words) if (this.lookup(lang.name, w)) n++;
    return n / lang.words.length;
  }
};
