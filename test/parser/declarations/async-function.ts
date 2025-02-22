import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import { parseSource } from '../../../src/parser';
import * as t from 'assert';

describe('Declarations - Async Function', () => {
  for (const arg of [
    'async function f() { for await ([x] in y) {} }',
    'async function f() { for await ("foo".x in y) {} }',
    'async function f() { for await ((x) in y) {} }',
    'async function f() { for await (var x in y) {} }',
    'async function f() { for await (let x in y) {} }',
    'async function f() { for await (const x in y) {} }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'async function wrap() {\n({a = await b} = obj)\n}',
    'async function wrap() {\n(a = await b)\n}',
    'async function foo(a = class {async bar() { await b }}) {}',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = async () => await b) {}',
    'async function foo(a = async function foo() { await b }) {}',
    'async function foo() { await + 1 }',
    'async function f() { for await ([a] of []); }',
    'async function f() { for await ([a = 1] of []); }',
    "async function f() { 'use strict'; for await ({a} of []); }",
    'async function * f() { for await ({a: a} of []); }',
    'async function * f() { for await ({0: a} of []); }',
    'async function * f() { for await ({0: a = 1} of []); }',
    'async function f3({x}) { var y = x; var x = 2; return y; }',
    'async function f4({x}) { { var y = x; var x = 2; } return y; }',
    'async function f6({x}, g = () => x) { { var x = 2; } return g(); }',
    'async function f7({x}) { var g = () => x; var x = 2; return g(); }',
    'async function f8({x}) { { var g = () => x; var x = 2; } return g(); }',
    'async function f9({x}, g = () => eval("x")) { var x = 2; return g(); }',
    'async function f12(y, g = () => y) { var y = 2; return g(); }',
    'async function f11({x}, y) { var z = y; var y = 2; return z; }',
    'async function f13({x}, y, [z], v) { var x, y, z; return x*y*z*v }',
    'async function f20({x}) { function x() { return 2 }; return x(); }',
    'async function f1(x = (y = 1)) { z = 1; await undefined; w = 1; };',
    'async function f1(a, b, c) { await a; }',
    'async function f1({x}) { var x = 2; return x }',
    'async function a() { await 4; } var await = 5',
    'async function a() { function b() { return await; } }',
    'async function a() { var k = { async: 4 } }',
    'async function a() { await 4; }',
    'async function a() { var t = !await 1 }',
    'async function a() { var t = ~await 1; }',
    'async function a() { var t = !(await 1); }',
    'async function a() { var t = ~(await 1);  }',
    'async function a() { var t = typeof (await 1); }',
    'async function a() { var t = typeof typeof await 1;  }',
    'async function a() { var t = void void await 1;  }',
    'async function a() { await 2 + 3; }',
    '(async function a() {}.constructor)',
    '"use strict"; async function a() { var t = +(await 1); }',
    '"use strict"; async function a() { var t = void (await 1); }',
    '"use strict"; async function a() { var t = !void void await 1; }',
    '"use strict"; async function a() { var t = +(await 1); }',
    '"use strict"; async function a() { var t = +(await 1); }',
    'async function foo({x}) { { var x = 2; } return x; }',
    'async function foo(a = x) { var x = 2; return a; }',
    'async function foo(a = x) { function x() {}; return a; }',
    'async function foo(a = eval("x")) { var x; return a; }',
    'async function foo(a = function() { return x }) { var x; return a(); }',
    'async function foo(a = () => x) { var x; return a(); }',
    'async function foo(a = () => eval("x")) { var x; return a(); }',
    'async function foo(x, y = () => x) { return x + y(); }',
    'async function foo(x = {a: 1, m() { return 2 }}) { return x.a + x.m(); }',
    'async function foo(x = () => 1) { return x() }',
    'async function async(x, y) { return x - y; }',
    'async function async() { return 12; }',
    'async function foo(a, b = () => a, c = b) { function b() { return a; } var a = 2; return [b, c]; }',
    'async function foo(a = x) { let x = 2; return a; }',
    'async function foo(a = () => eval("x")) { var x; return a(); }',
    'async function foo(x = (y = 1)) { z = 1; await undefined; w = 1; };',
    'async function f() { let a = function(a = await) {}; }',
    'async function f(a = async function() { await 1; }) {}',
    'async function foo(y = eval("var x = 2")) { with ({}) { return x; } }',
    'async function foo(y = eval("var x = 2"), z = x) { return z; }',
    'async function foo(y = eval("var x = 2"), z = eval("x")) { return z; }',
    'async function foo(z = eval("var y = 2")) { return y; }',
    'async function foo(f = () => x) { eval("var x = 2"); return f() }',
    'async function foo() { return await bar() + await z(); }',
    'async function foo(a, b) { await a + await b }',
    'async function foo(a) { return a ? await bar() : await z(); }',
    'async function af(x) { var x = 0; with (obj) { x = await af(); } return x; }',
    'async function * foo() { yield ()=>{}; }',
    'async function af1(a) { await a; return await foo.call({ x : 100 }); /** comment**/ }',
    'async function f2(d, e, f) { let x = await f1(d + 10, e + 20, f + 30); return x; }',
    '(async function(x = 1) {})',
    '(async function(x = 1, ...a) {})',
    '(async function(x, y = 1, z, v = 2, ...a) {})',
    '(async function(x, y = 1, z, v = 2) {})',
    '(async function(x, y = 1, z) {})',
    '(async function(x, y = 1, ...a) {})',
    `(async () => { return !await Promise.resolve(false); })();`,
    `async function f(x = async function(){await x}){}`,
    `async function f(x = async () => await x){}`,
    `async function f(){ async(await x); }`,
    `function f() { async function yield() {} }`,
    'async (a = async () => { await 1; }) => {}',
    `async function yield() {}`,
    `(async function yield() {});`,
    `function f() { (async function yield() {}); }`,
    `function* g() { (async function yield() {}); }`,
    `({ async yield() {} });`,
    `function f() { ({ async yield() {} }); }`,
    `function* g() { ({ async yield() {} }); }`,
    `({ async [yield]() {} });`,
    `function f() { ({ async [yield]() {} }); }`,
    `function* g() { ({ async [yield]() {} }); }`,
    'async function* a() { yield; (r = a) => {} }',
    'async function* x(a, b, ...c) { await 1; }',
    'async function* x(a, b = 2) { await 1; }',
    'async function* x(a) { yield 1; }',
    'async function* x(a, b = 2) { yield 1; }',
    'async function* x(a, b, ...c) { yield 1; }',
    'async function x() { let x = await 1; eval("var i = 5"); let y = await 2; debugger; }',
    'new (async function*() {})',
    '(async function*() {}).caller',
    '(async function*() {}).arguments',
    'async function fib(n) { return (n == 0 || n == 1) ? n : await fib(n - 1) + await fib(n - 2); }',
    'var hardcoreFib = async function fib2(n) { return (n == 0 || n == 1) ? n : await fib2(n - 1) + await fib2(n - 2); }',
    '() => class extends (async function() {}) {}',
    'async function f() {   class x { foo(x=new (await)()){} }   }',
    'async function f() {   class x extends await y { }   }',
    `async function yield() {}`,
    'async function x () { a = { a: await(a) } }',
    'async function* a(){}',
    'async function f() {   class x { await(){} }   }',
    'async function f() {   class x { foo(x=await){} }   }',
    'function f() {   class x { [await](){} }   }',
    '(async function* (){})',
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }',
    'async function f() {   class x { foo(await){} }   }',
    'function f() {   class x { await(){} }   }',
    'async function f() {   class x extends feh(await y) { }   }',
    'function f() {   class x { foo(x=new (await)()){} }   }',
    'async function fn() { const x = await import([a]); }',
    'async function fn() { const x = await import([]); }',
    'async function fn() { const x = await import(() => {}); }',
    'async function fn() { const x = await import(await a); }',
    'async function fn() { const x = await getpromise(); }',
    'async function fn() { const x = await import(a()()); }',
    'async function fn() { const x = await import(a()[0]); }',
    'async function fn() { const x = await import(a().x); }',
    'async function fn() { const x = await import(b()); }',
    'async function fn() { const x = await import((((((("./foo"))))))); }',
    'async function fn() { const x = await import(x += a); }',
    'async function fn() { const x = await import(x = a); }',
    'async function fn() { const x = await import(delete void typeof +-~! 0 && b); }',
    'async function fn() { const x = await import(false || b); }',
    'async function fn() { const x = await import({}); }',
    'async function fn() { const x = await import({}); }',
    'async function * fn() { return import(yield 42); }',
    `function *a(){yield\n*a}`,
    'async function * fn() { import(yield * ["Roberta Flack", "Donny Hathaway", "Frank Sinatra"]); }',
    'async function* f(a = async function*() { await 1; }) {}',
    'function f() { return await; }',
    `async function *gen() {
      yield {
          ...yield,
          y: 1,
          ...yield yield,
        };
    }`,
    `async function *gen() {
      yield [...yield];
    }`,
    `async function *gen() {
      yield [...yield yield];
    }`,
    `"use strict"; async function * fn() {
      for await ([ {} = yield ] of [iterable]) {
      }
    }`,
    `async function f() {
      let x = await y;
            const a = (b) => {};
    }`,
    `async function f() {
      (((x = await y)));
            const a = (b) => {};
    }`,
    `async function f() {
      let x = await y;
            async (b) => {};
    }`,
    `async function f() {
      (((x = await y)));
            async (b) => {};
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'async function f() { var await = { await : async function foo() {} } }',
    'async function f() { class x { foo(x=await y){} }   }',
    'async function f() { class x { foo(x=new (await y)()){} }   }',
    'async function f(async, await) { var x = await async; return x; }',
    'async function f() { class x { foo(await y){} }   }',
    'function f() { class x { foo(x=await y){} }   }',
    'async function foo() { async function bar(a = await baz()) {} }',
    'async function wrap() {\n({a = await b} = obj) => a\n}',
    'function f() { class x { foo(x=new (await y)()){} }   }',
    'async function wrap() {\n(a = await b) => a\n}',
    'async function f() { class x extends await { }   }',
    'function f() { class x { await y(){} }   }',
    'async function f() { class await { }   }',
    'function f() { class x { [await y](){} }   }',
    'async function * f() { for await ({0: a} = 1 of []); }',
    'async function * f() { for await ({0: a = 1} = 1 of []); }',
    'async function f() {   class x extends feh(await) { }   }',
    'async function * f() { for await ({a: a} = 1 of []); }',
    "async function f() { 'use strict'; for await ({a} = 1 of []); }",
    'async function foo() { await }',
    'async function a(k = await 3) {}',
    'async function a() { async function b(k = await 3) {} }',
    'async function a() { async function b(k = [await 3]) {} }',
    'async function a() { async function b([k = await 3]) {} }',
    'async function a() { async function b([k = [await 3]]) {} }',
    'async function a() { async function b({k = await 3}) {} }',
    'async function a() { async function b({k = [await 3]}) {} }',
    'async function f() { for await ([a = 1] = 1 of []); }',
    'async function f() { for await ([a] = 1 of []); }',
    'async function fn() { var await; }',
    'async function fn() { var await; }',
    'async function fn() { void await; }',
    'async function a(){ (foo = await bar) => {}     }',
    'async function f(){ (fail = class A {[await foo](){}; "x"(){}}) => {}    }',
    'async function fn() { await: ; }',
    `async function foo (foo = super()) { var bar; }`,
    'async function fn() { void await; }',
    'async function fn() { void await; }',
    'async function fn() { await: ; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { var a = (x = await 0) => { }; }',
    'async function af() { var a = (x, y = await 0, z = 0) => { }; }',
    'async function af() { var a = (x, y, z = await 0) => { }; }',
    'async function foo (x = await) {  }',
    'async function foo (await) {  }',
    '(async function await() {})',
    'function* a() { await 4; }',
    'async function a(k = await 3) {}',
    'async function a() { async function b(k = [await 3]) {} }',
    'async function a() { async function b([k = await 3]) {} }',
    'async function a() { async function b([k = [await 3]]) {} }',
    'async function a() { async function b({k = await 3}) {} }',
    'async function a() { async function b({k = [await 3]}) {} }',
    'async function a() { var await = 4; }',
    'async function a() { return await; }',
    'async function af() { var a = (x, y, await) => { }; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { (b = (c = await => {}) => {}) => {}; }',
    'async function foo (foo) { super() };',
    'async function foo() { (async function await() { }) }',
    `(async function() { 0, { await } = {};  });`,
    'async function f(){ (x = new (await x)) => {}   }',
    'async function f(){ (x = new f[await x]) => {}   }',
    `async function f(x = () => await x){}`,
    'async function f(){ (x = class A {[await foo](){}; "x"(){}}) => {} }',
    'async function x({await}) { return 1 }',
    'async function f() { return {await}; }',
    'async function f() { return {await = 0} = {}; }',
    'async (a = await => {}) => {}'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`() =>${arg}`, () => {
      t.throws(() => {
        parseSource(`() =>${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() {${arg}}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'var await = 1;',
    'var { await } = 1;',
    'var [ await ] = 1;',
    'return async (await) => {};',
    'var O = { async [await](a, a) {} }',
    'await;',
    'function await() {}',
    'var f = await => 42;',
    'var f = (await) => 42;',
    'var f = (await, a) => 42;',
    'var f = (...await) => 42;',
    'var e = (await);',
    'var e = (await, f);',
    'var e = (await = 42)',
    'var e = [await];',
    'var e = {await};'
  ]) {
    it(`async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`async function f() {${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var f = async() => {${arg}}`, undefined, Context.None);
      });
    });

    it(`var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var O = { async method() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var f = async function() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async function() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async() => {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`, undefined, Context.None);
      });
    });
  }

  fail('Declarations - Async Function (fail)', [
    ['async function foo (foo = super()) { let bar; }', Context.None],
    ['\\u0061sync function f(){}', Context.None],
    ['abc: async function a() {}', Context.None],
    ['async function wrap() {\nasync function await() { }\n}', Context.None],
    ['async function foo(await) { }', Context.None],
    ['(async function await() { })', Context.None],
    ['(async function foo(await) { })', Context.None],
    ['(async function foo() { return {await} })', Context.None],
    ['async function* a() { for (let m in ((await))) x;  (r = a) => {} }', Context.Strict],
    ['async function* g() { await; }; f = ([...[,]] = g()) => {};', Context.None],
    ['async ({a = b})', Context.None],
    ['async await => 1"', Context.None],
    ['async function f() { for await (let.x of a); }', Context.None],
    ['async function fn() { for await (const [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (const {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (const x = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let x = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var x = 1 of []) {} }', Context.None],
    ['async function fn() { for (const {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for (let {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for (let x = 1 of []) {} }', Context.None],
    ['async function fn() { for (var x = 1 of []) {} }', Context.None],
    ['async (a = await) => {}', Context.None],
    ['async (...await) => 1', Context.None],
    ['async ([await]) => 1', Context.None],
    ['async ([...await]) => 1', Context.None],
    ['async (b = {await}) => 1', Context.None],
    ['async (b = {a: await}) => 1', Context.None],
    ['async (b = [await]) => 1', Context.None],
    ['async function* f(a = await) {}', Context.None],
    ['function f(a = async function*(a = await) {}) {}', Context.None],
    ['function f() { a = async function*(a = await) {}; }', Context.None],
    ['async function a(k = await 3) {}', Context.None],
    ['async function a() { async function b(k = await 3) {} }', Context.None],
    ['async function a() { async function b(k = [await 3]) {} }', Context.None],
    ['async function k() { function a() { await 4; } }', Context.None],
    ['async (b = [...await]) => 1', Context.None],
    ['async (b = class await {}) => 1', Context.Strict | Context.Module],
    ['async (b = (await) => {}) => 1', Context.None],
    ['async (await, b = async()) => 2', Context.None],
    ['async (await, b = async () => {}) => 1', Context.None],
    ['async function* a() { await;  (r = a) => {} }', Context.None],
    ['async function* a() { (await) => {} }', Context.None],
    ['{ async function f() {} async function f() {} }', Context.OptionsLexical],
    ['switch (0) { case 1: async function f() {} default: function f() {} }', Context.OptionsLexical],
    ['{ function* f() {} async function f() {} }', Context.OptionsLexical | Context.Strict],
    ['async function* f() { a = async function*(a = await) {}; }', Context.None],
    ['function f(a = async function(a = await) {}) {}', Context.None],
    ['({async\nfoo() { }})', Context.None],
    ['({async get foo() { }})', Context.None],
    ['({async set foo(value) { }})', Context.None],
    ['({async foo() { var await }})', Context.None],
    ['function f() { a = async function(a = await) {}; }', Context.None],
    ['async function f() { a = async function(a = await) {}; }', Context.None],
    ['async (a = await) => {}', Context.None],
    ['async function foo (foo) { super.prop };', Context.None],
    ['async function foo (foo) { super.prop };', Context.None],
    ['"use strict"; async function eval () {  }', Context.None],
    ['async function foo (foo = super()) { let bar; }', Context.None],
    ['async function a(){ (foo = +await bar) => {} }', Context.None],
    ['async function a(){  (foo = [{m: 5 + t(+await bar)}]) => {}     }', Context.None],
    ['async function a(){ ([await]) => 1 }', Context.None],
    ['async function a(){ (x = delete ((await) = f)) => {} }', Context.None],
    ['async function a(){ (await) => x }', Context.None],
    ['async function a(){ (e=await)=>l }', Context.None],
    ['async function af() { var a = (x, y, z = await 0) => { }; }', Context.None],
    ['async function af() { var a = (x, y = await 0, z = 0) => { }; }', Context.None],
    ['async function af() { var a = (x = await 0) => { }; }', Context.None],
    ['async function af() { var a = (x, await, y) => { }; }', Context.None],
    ['async function af() { var a = (x, y, await) => { }; }', Context.None],
    ['async function af() { var a = (await) => { }; }', Context.None],
    ['async function af() { var a = await => { }; }', Context.None],
    ['async function a(){ async ([a=await]) => 1 }', Context.None],
    ['\\u0061sync function f(){}', Context.None],
    ['({async foo() { var await }})', Context.None],
    ['({async foo(await) { }})', Context.None],
    ['({async foo() { return {await} }})', Context.None],
    ['async function f(a = await) {}', Context.None],
    ['({async foo: 1})', Context.None],
    ['class A {async\nfoo() { }}', Context.None],
    ['class A {static async\nfoo() { }}', Context.None],
    ['async function* g(){ ({[await]: a}) => 0; }', Context.None],
    ['class A {async constructor() { }}', Context.None],
    ['await', Context.Module],
    ['class A {async foo() { return {await} }}', Context.None],
    ['async function foo() { await }', Context.None],
    ['(async function foo() { await })', Context.None],
    ['({async foo() { await }})', Context.None],
    ['async function foo(a = await b) {}', Context.None],
    ['(async function foo(a = await b) {})', Context.None],
    ['async (a = await b) => {}', Context.None],
    ['async function wrapper() {\nasync (a = await b) => {}\n}', Context.None],
    ['({async foo(a = await b) {}})', Context.None],
    ['async function wrap() {\n(a = await b) => a\n}', Context.None],
    ['async function wrap() {\n({a = await b} = obj) => a\n}', Context.None],
    ['function* wrap() {\nasync(a = yield b) => a\n}', Context.None],
    ['async function f(){ (x = new x(await x)) => {}   }', Context.None],
    ['async function arguments() { "use strict"; }', Context.None],
    ['async function fn(eval) { "use strict"; }', Context.None],
    ['async function method() { var await = 1; }', Context.None],
    ['async function method(await;) { }', Context.None],
    ['async function method() { var x = await; }', Context.None],
    ['async function af(a, b = await a) { }', Context.None],
    ['async function af(a, b = await a) { "use strict"; }', Context.None],
    ['async function af(x) { function f(a = await x) { } f(); } af();', Context.None],
    ['async function af(arguments) { "use strict"; }', Context.None],
    ['async function af(eval) { "use strict"; }', Context.None]
  ]);

  pass('Declarations - Async function (pass)', [
    [
      'async\nfunction foo() { }',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'async',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'foo',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async function *gen() { yield [...yield]; }',
      Context.Strict | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 43,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 43,
            id: {
              type: 'Identifier',
              start: 16,
              end: 19,
              name: 'gen'
            },
            generator: true,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 22,
              end: 43,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 24,
                  end: 41,
                  expression: {
                    type: 'YieldExpression',
                    start: 24,
                    end: 40,
                    delegate: false,
                    argument: {
                      type: 'ArrayExpression',
                      start: 30,
                      end: 40,
                      elements: [
                        {
                          type: 'SpreadElement',
                          start: 31,
                          end: 39,
                          argument: {
                            type: 'YieldExpression',
                            start: 34,
                            end: 39,
                            delegate: false,
                            argument: null
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '"use strict"; async function foo() { function bar() { await = 1; } bar(); }',
      Context.Strict | Context.OptionsRanges | Context.OptionsDirectives | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 75,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            expression: {
              type: 'Literal',
              start: 0,
              end: 12,
              value: 'use strict',
              raw: '"use strict"'
            },
            directive: 'use strict'
          },
          {
            type: 'FunctionDeclaration',
            start: 14,
            end: 75,
            id: {
              type: 'Identifier',
              start: 29,
              end: 32,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 35,
              end: 75,
              body: [
                {
                  type: 'FunctionDeclaration',
                  start: 37,
                  end: 66,
                  id: {
                    type: 'Identifier',
                    start: 46,
                    end: 49,
                    name: 'bar'
                  },
                  generator: false,
                  async: false,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 52,
                    end: 66,
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 54,
                        end: 64,
                        expression: {
                          type: 'AssignmentExpression',
                          start: 54,
                          end: 63,
                          operator: '=',
                          left: {
                            type: 'Identifier',
                            start: 54,
                            end: 59,
                            name: 'await'
                          },
                          right: {
                            type: 'Literal',
                            start: 62,
                            end: 63,
                            value: 1,
                            raw: '1'
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 67,
                  end: 73,
                  expression: {
                    type: 'CallExpression',
                    start: 67,
                    end: 72,
                    callee: {
                      type: 'Identifier',
                      start: 67,
                      end: 70,
                      name: 'bar'
                    },
                    arguments: []
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'export async function foo() { }',
      Context.Module,
      {
        body: [
          {
            declaration: {
              async: true,
              body: {
                body: [],
                type: 'BlockStatement'
              },

              generator: false,
              id: {
                name: 'foo',
                type: 'Identifier'
              },
              params: [],
              type: 'FunctionDeclaration'
            },
            source: null,
            specifiers: [],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'async function await() { }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 26,
            id: {
              type: 'Identifier',
              start: 15,
              end: 20,
              name: 'await'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 23,
              end: 26,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async function foo() { })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 25,
              id: {
                type: 'Identifier',
                start: 16,
                end: 19,
                name: 'foo'
              },
              generator: false,
              async: true,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 22,
                end: 25,
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async ({a: b = c})',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 18,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 18
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 18
              }
            },
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 18,
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 18
                }
              },
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 5
                  }
                },
                name: 'async'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 7,
                  end: 17,
                  loc: {
                    start: {
                      line: 1,
                      column: 7
                    },
                    end: {
                      line: 1,
                      column: 17
                    }
                  },
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 16,
                      loc: {
                        start: {
                          line: 1,
                          column: 8
                        },
                        end: {
                          line: 1,
                          column: 16
                        }
                      },
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        loc: {
                          start: {
                            line: 1,
                            column: 8
                          },
                          end: {
                            line: 1,
                            column: 9
                          }
                        },
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        start: 11,
                        end: 16,
                        loc: {
                          start: {
                            line: 1,
                            column: 11
                          },
                          end: {
                            line: 1,
                            column: 16
                          }
                        },
                        operator: '=',
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          loc: {
                            start: {
                              line: 1,
                              column: 11
                            },
                            end: {
                              line: 1,
                              column: 12
                            }
                          },
                          name: 'b'
                        },
                        right: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          loc: {
                            start: {
                              line: 1,
                              column: 15
                            },
                            end: {
                              line: 1,
                              column: 16
                            }
                          },
                          name: 'c'
                        }
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async await() { }})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 20,
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 19,
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 8,
                    end: 13,
                    name: 'await'
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 13,
                    end: 19,
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 16,
                      end: 19,
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a, b) { await a }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 36,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'Identifier',
                start: 19,
                end: 20,
                name: 'a'
              },
              {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 25,
              end: 36,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 27,
                  end: 34,
                  expression: {
                    type: 'AwaitExpression',
                    start: 27,
                    end: 34,
                    argument: {
                      type: 'Identifier',
                      start: 33,
                      end: 34,
                      name: 'a'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async function foo(a) { await a })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 35,
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 34,
              id: {
                type: 'Identifier',
                start: 16,
                end: 19,
                name: 'foo'
              },
              generator: false,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  name: 'a'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 23,
                end: 34,
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 25,
                    end: 32,
                    expression: {
                      type: 'AwaitExpression',
                      start: 25,
                      end: 32,
                      argument: {
                        type: 'Identifier',
                        start: 31,
                        end: 32,
                        name: 'a'
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async (a) => await a)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'AwaitExpression',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],

              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({async foo(a) { await a }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AwaitExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          }
                        }
                      ]
                    },
                    async: true,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async function foo(a, b) { await a + await b }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 46,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 46,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'Identifier',
                start: 19,
                end: 20,
                name: 'a'
              },
              {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 25,
              end: 46,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 27,
                  end: 44,
                  expression: {
                    type: 'BinaryExpression',
                    start: 27,
                    end: 44,
                    left: {
                      type: 'AwaitExpression',
                      start: 27,
                      end: 34,
                      argument: {
                        type: 'Identifier',
                        start: 33,
                        end: 34,
                        name: 'a'
                      }
                    },
                    operator: '+',
                    right: {
                      type: 'AwaitExpression',
                      start: 37,
                      end: 44,
                      argument: {
                        type: 'Identifier',
                        start: 43,
                        end: 44,
                        name: 'b'
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function foo() { await + 1 }',
      Context.OptionsLoc | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 28
          }
        },
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 28,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 28
              }
            },
            id: {
              type: 'Identifier',
              start: 9,
              end: 12,
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 12
                }
              },
              name: 'foo'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 15,
              end: 28,
              loc: {
                start: {
                  line: 1,
                  column: 15
                },
                end: {
                  line: 1,
                  column: 28
                }
              },
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 17,
                  end: 26,
                  loc: {
                    start: {
                      line: 1,
                      column: 17
                    },
                    end: {
                      line: 1,
                      column: 26
                    }
                  },
                  expression: {
                    type: 'BinaryExpression',
                    start: 17,
                    end: 26,
                    loc: {
                      start: {
                        line: 1,
                        column: 17
                      },
                      end: {
                        line: 1,
                        column: 26
                      }
                    },
                    left: {
                      type: 'Identifier',
                      start: 17,
                      end: 22,
                      loc: {
                        start: {
                          line: 1,
                          column: 17
                        },
                        end: {
                          line: 1,
                          column: 22
                        }
                      },
                      name: 'await'
                    },
                    operator: '+',
                    right: {
                      type: 'Literal',
                      start: 25,
                      end: 26,
                      loc: {
                        start: {
                          line: 1,
                          column: 25
                        },
                        end: {
                          line: 1,
                          column: 26
                        }
                      },
                      value: 1
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = async function foo() { await b }) {}',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 59,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 59
          }
        },
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 59,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 59
              }
            },
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              loc: {
                start: {
                  line: 1,
                  column: 15
                },
                end: {
                  line: 1,
                  column: 18
                }
              },
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 55,
                loc: {
                  start: {
                    line: 1,
                    column: 19
                  },
                  end: {
                    line: 1,
                    column: 55
                  }
                },
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  loc: {
                    start: {
                      line: 1,
                      column: 19
                    },
                    end: {
                      line: 1,
                      column: 20
                    }
                  },
                  name: 'a'
                },
                right: {
                  type: 'FunctionExpression',
                  start: 23,
                  end: 55,
                  loc: {
                    start: {
                      line: 1,
                      column: 23
                    },
                    end: {
                      line: 1,
                      column: 55
                    }
                  },
                  id: {
                    type: 'Identifier',
                    start: 38,
                    end: 41,
                    loc: {
                      start: {
                        line: 1,
                        column: 38
                      },
                      end: {
                        line: 1,
                        column: 41
                      }
                    },
                    name: 'foo'
                  },
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 44,
                    end: 55,
                    loc: {
                      start: {
                        line: 1,
                        column: 44
                      },
                      end: {
                        line: 1,
                        column: 55
                      }
                    },
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 46,
                        end: 53,
                        loc: {
                          start: {
                            line: 1,
                            column: 46
                          },
                          end: {
                            line: 1,
                            column: 53
                          }
                        },
                        expression: {
                          type: 'AwaitExpression',
                          start: 46,
                          end: 53,
                          loc: {
                            start: {
                              line: 1,
                              column: 46
                            },
                            end: {
                              line: 1,
                              column: 53
                            }
                          },
                          argument: {
                            type: 'Identifier',
                            start: 52,
                            end: 53,
                            loc: {
                              start: {
                                line: 1,
                                column: 52
                              },
                              end: {
                                line: 1,
                                column: 53
                              }
                            },
                            name: 'b'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 57,
              end: 59,
              loc: {
                start: {
                  line: 1,
                  column: 57
                },
                end: {
                  line: 1,
                  column: 59
                }
              },
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = async () => await b) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  },
                  params: [],

                  async: true,
                  expression: true
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'async function foo(a = {async bar() { await b }}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 52,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 52,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 48,
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  name: 'a'
                },
                right: {
                  type: 'ObjectExpression',
                  start: 23,
                  end: 48,
                  properties: [
                    {
                      type: 'Property',
                      start: 24,
                      end: 47,
                      method: true,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 30,
                        end: 33,
                        name: 'bar'
                      },
                      kind: 'init',
                      value: {
                        type: 'FunctionExpression',
                        start: 33,
                        end: 47,
                        id: null,
                        generator: false,
                        async: true,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 36,
                          end: 47,
                          body: [
                            {
                              type: 'ExpressionStatement',
                              start: 38,
                              end: 45,
                              expression: {
                                type: 'AwaitExpression',
                                start: 38,
                                end: 45,
                                argument: {
                                  type: 'Identifier',
                                  start: 44,
                                  end: 45,
                                  name: 'b'
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 50,
              end: 52,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = class {async bar() { await b }}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 58,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 58,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 54,
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  name: 'a'
                },
                right: {
                  type: 'ClassExpression',
                  start: 23,
                  end: 54,
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 29,
                    end: 54,
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 30,
                        end: 53,
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 36,
                          end: 39,
                          name: 'bar'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 39,
                          end: 53,
                          id: null,
                          generator: false,
                          async: true,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 42,
                            end: 53,
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 44,
                                end: 51,
                                expression: {
                                  type: 'AwaitExpression',
                                  start: 44,
                                  end: 51,
                                  argument: {
                                    type: 'Identifier',
                                    start: 50,
                                    end: 51,
                                    name: 'b'
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 56,
              end: 58,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = ({ w = counter(), x = counter(), y = counter(), z = counter() } = { w: null, x: 0, y: false, z: "" }) => {}',
      Context.OptionsLoc | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 111,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 111
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 111,
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 111
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 111,
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 111
                }
              },
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'f'
              },
              right: {
                type: 'ArrowFunctionExpression',
                start: 4,
                end: 111,
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 111
                  }
                },
                expression: false,
                async: false,
                params: [
                  {
                    type: 'AssignmentPattern',
                    start: 5,
                    end: 104,
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 104
                      }
                    },
                    left: {
                      type: 'ObjectPattern',
                      start: 5,
                      end: 67,
                      loc: {
                        start: {
                          line: 1,
                          column: 5
                        },
                        end: {
                          line: 1,
                          column: 67
                        }
                      },
                      properties: [
                        {
                          type: 'Property',
                          start: 7,
                          end: 20,
                          loc: {
                            start: {
                              line: 1,
                              column: 7
                            },
                            end: {
                              line: 1,
                              column: 20
                            }
                          },
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 7,
                            end: 8,
                            loc: {
                              start: {
                                line: 1,
                                column: 7
                              },
                              end: {
                                line: 1,
                                column: 8
                              }
                            },
                            name: 'w'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 7,
                            end: 20,
                            loc: {
                              start: {
                                line: 1,
                                column: 7
                              },
                              end: {
                                line: 1,
                                column: 20
                              }
                            },
                            left: {
                              type: 'Identifier',
                              start: 7,
                              end: 8,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 7
                                },
                                end: {
                                  line: 1,
                                  column: 8
                                }
                              },
                              name: 'w'
                            },
                            right: {
                              type: 'CallExpression',
                              start: 11,
                              end: 20,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 11
                                },
                                end: {
                                  line: 1,
                                  column: 20
                                }
                              },
                              callee: {
                                type: 'Identifier',
                                start: 11,
                                end: 18,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 11
                                  },
                                  end: {
                                    line: 1,
                                    column: 18
                                  }
                                },
                                name: 'counter'
                              },
                              arguments: []
                            }
                          }
                        },
                        {
                          type: 'Property',
                          start: 22,
                          end: 35,
                          loc: {
                            start: {
                              line: 1,
                              column: 22
                            },
                            end: {
                              line: 1,
                              column: 35
                            }
                          },
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 22,
                            end: 23,
                            loc: {
                              start: {
                                line: 1,
                                column: 22
                              },
                              end: {
                                line: 1,
                                column: 23
                              }
                            },
                            name: 'x'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 22,
                            end: 35,
                            loc: {
                              start: {
                                line: 1,
                                column: 22
                              },
                              end: {
                                line: 1,
                                column: 35
                              }
                            },
                            left: {
                              type: 'Identifier',
                              start: 22,
                              end: 23,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 22
                                },
                                end: {
                                  line: 1,
                                  column: 23
                                }
                              },
                              name: 'x'
                            },
                            right: {
                              type: 'CallExpression',
                              start: 26,
                              end: 35,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 26
                                },
                                end: {
                                  line: 1,
                                  column: 35
                                }
                              },
                              callee: {
                                type: 'Identifier',
                                start: 26,
                                end: 33,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 26
                                  },
                                  end: {
                                    line: 1,
                                    column: 33
                                  }
                                },
                                name: 'counter'
                              },
                              arguments: []
                            }
                          }
                        },
                        {
                          type: 'Property',
                          start: 37,
                          end: 50,
                          loc: {
                            start: {
                              line: 1,
                              column: 37
                            },
                            end: {
                              line: 1,
                              column: 50
                            }
                          },
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 37,
                            end: 38,
                            loc: {
                              start: {
                                line: 1,
                                column: 37
                              },
                              end: {
                                line: 1,
                                column: 38
                              }
                            },
                            name: 'y'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 37,
                            end: 50,
                            loc: {
                              start: {
                                line: 1,
                                column: 37
                              },
                              end: {
                                line: 1,
                                column: 50
                              }
                            },
                            left: {
                              type: 'Identifier',
                              start: 37,
                              end: 38,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 37
                                },
                                end: {
                                  line: 1,
                                  column: 38
                                }
                              },
                              name: 'y'
                            },
                            right: {
                              type: 'CallExpression',
                              start: 41,
                              end: 50,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 41
                                },
                                end: {
                                  line: 1,
                                  column: 50
                                }
                              },
                              callee: {
                                type: 'Identifier',
                                start: 41,
                                end: 48,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 41
                                  },
                                  end: {
                                    line: 1,
                                    column: 48
                                  }
                                },
                                name: 'counter'
                              },
                              arguments: []
                            }
                          }
                        },
                        {
                          type: 'Property',
                          start: 52,
                          end: 65,
                          loc: {
                            start: {
                              line: 1,
                              column: 52
                            },
                            end: {
                              line: 1,
                              column: 65
                            }
                          },
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 52,
                            end: 53,
                            loc: {
                              start: {
                                line: 1,
                                column: 52
                              },
                              end: {
                                line: 1,
                                column: 53
                              }
                            },
                            name: 'z'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 52,
                            end: 65,
                            loc: {
                              start: {
                                line: 1,
                                column: 52
                              },
                              end: {
                                line: 1,
                                column: 65
                              }
                            },
                            left: {
                              type: 'Identifier',
                              start: 52,
                              end: 53,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 52
                                },
                                end: {
                                  line: 1,
                                  column: 53
                                }
                              },
                              name: 'z'
                            },
                            right: {
                              type: 'CallExpression',
                              start: 56,
                              end: 65,
                              loc: {
                                start: {
                                  line: 1,
                                  column: 56
                                },
                                end: {
                                  line: 1,
                                  column: 65
                                }
                              },
                              callee: {
                                type: 'Identifier',
                                start: 56,
                                end: 63,
                                loc: {
                                  start: {
                                    line: 1,
                                    column: 56
                                  },
                                  end: {
                                    line: 1,
                                    column: 63
                                  }
                                },
                                name: 'counter'
                              },
                              arguments: []
                            }
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 70,
                      end: 104,
                      loc: {
                        start: {
                          line: 1,
                          column: 70
                        },
                        end: {
                          line: 1,
                          column: 104
                        }
                      },
                      properties: [
                        {
                          type: 'Property',
                          start: 72,
                          end: 79,
                          loc: {
                            start: {
                              line: 1,
                              column: 72
                            },
                            end: {
                              line: 1,
                              column: 79
                            }
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 72,
                            end: 73,
                            loc: {
                              start: {
                                line: 1,
                                column: 72
                              },
                              end: {
                                line: 1,
                                column: 73
                              }
                            },
                            name: 'w'
                          },
                          value: {
                            type: 'Literal',
                            start: 75,
                            end: 79,
                            loc: {
                              start: {
                                line: 1,
                                column: 75
                              },
                              end: {
                                line: 1,
                                column: 79
                              }
                            },
                            value: null
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 81,
                          end: 85,
                          loc: {
                            start: {
                              line: 1,
                              column: 81
                            },
                            end: {
                              line: 1,
                              column: 85
                            }
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 81,
                            end: 82,
                            loc: {
                              start: {
                                line: 1,
                                column: 81
                              },
                              end: {
                                line: 1,
                                column: 82
                              }
                            },
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            start: 84,
                            end: 85,
                            loc: {
                              start: {
                                line: 1,
                                column: 84
                              },
                              end: {
                                line: 1,
                                column: 85
                              }
                            },
                            value: 0
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 87,
                          end: 95,
                          loc: {
                            start: {
                              line: 1,
                              column: 87
                            },
                            end: {
                              line: 1,
                              column: 95
                            }
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 87,
                            end: 88,
                            loc: {
                              start: {
                                line: 1,
                                column: 87
                              },
                              end: {
                                line: 1,
                                column: 88
                              }
                            },
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            start: 90,
                            end: 95,
                            loc: {
                              start: {
                                line: 1,
                                column: 90
                              },
                              end: {
                                line: 1,
                                column: 95
                              }
                            },
                            value: false
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 97,
                          end: 102,
                          loc: {
                            start: {
                              line: 1,
                              column: 97
                            },
                            end: {
                              line: 1,
                              column: 102
                            }
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 97,
                            end: 98,
                            loc: {
                              start: {
                                line: 1,
                                column: 97
                              },
                              end: {
                                line: 1,
                                column: 98
                              }
                            },
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            start: 100,
                            end: 102,
                            loc: {
                              start: {
                                line: 1,
                                column: 100
                              },
                              end: {
                                line: 1,
                                column: 102
                              }
                            },
                            value: ''
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 109,
                  end: 111,
                  loc: {
                    start: {
                      line: 1,
                      column: 109
                    },
                    end: {
                      line: 1,
                      column: 111
                    }
                  },
                  body: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async = 0} = {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 12,
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 11,
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 7,
                      name: 'async'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 2,
                      end: 11,
                      left: {
                        type: 'Identifier',
                        start: 2,
                        end: 7,
                        name: 'async'
                      },
                      right: {
                        type: 'Literal',
                        start: 10,
                        end: 11,
                        value: 0
                      }
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 15,
                end: 17,
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async 100(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 16,
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 15,
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 8,
                    end: 11,
                    value: 100
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 11,
                    end: 15,
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 13,
                      end: 15,
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
