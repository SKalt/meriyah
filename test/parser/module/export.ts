import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Module - Export', () => {
  // Async await module errors
  for (const arg of [
    'export default (async function await() {})',
    'export default async function await() {}',
    'export async function await() {}',
    'export async function() {}',
    'export async',
    'export async\nfunction async() { await 1; }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsWebCompat);
      });
    });
  }

  // Namespace export parsing
  for (const arg of [
    "export * as arguments from 'bar'",
    "export * as await from 'bar'",
    "export * as default from 'bar'",
    "export * as enum from 'bar'",
    "export * as foo from 'bar'",
    "export * as for from 'bar'",
    "export * as let from 'bar'",
    "export * as static from 'bar'",
    "export * as yield from 'bar'"
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  // Async await module
  for (const arg of [
    'export default async function() { await 1; }',
    'export default async function async() { await 1; }',
    'export async function async() { await 1; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsWebCompat);
      });
    });
  }

  // Namespace export parsing
  for (const arg of [
    "export * as arguments from 'bar'",
    "export * as await from 'bar'",
    "export * as default from 'bar'",
    "export * as enum from 'bar'",
    "export * as foo from 'bar'",
    "export * as for from 'bar'",
    "export * as let from 'bar'",
    "export * as static from 'bar'",
    "export * as yield from 'bar'"
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    'export {',
    'var a; export { a',
    'var a; export { a',
    'var a; export { a,',
    'var a; export { a, ;',
    'var a; export { a as };',
    'var a, b; export { a as , b};',
    'export function () {}',
    'export class () {}',
    'export var {[x]} = z;',
    'export var {[x]};',
    'export default async function() { yield = 1; }',
    'export default async function() { yield; }',
    'export const await = 5',
    'export function p\\u0061ckage() {}',
    'export function br\\u0065ak() {}',
    'export var {[x] = y} = z;',
    `export default var x = null;
    export default var x = null;`,
    'export { , };',
    'export default let x = 7;',
    'export default const x = 7;',
    'export *;',
    'export * from;',
    'export { Q } from;',
    'export { 123 } from;',
    'export { # } from;',
    "export default from 'module.js';",
    'export * as z from "c";',
    "export * as arguments from 'bar'",
    "export * as await from 'bar'",
    "export * as default from 'bar'",
    "export * as enum from 'bar'",
    "export * as foo from 'bar'",
    "export * as for from 'bar'",
    "export * as let from 'bar'",
    "export * as static from 'bar'",
    "export * as yield from 'bar'",
    'export {',
    'var a; export { a',
    'var a; export { a,',
    'var a; export { a, ;',
    'var a; export { a as };',
    'var a, b; export { a as , b};',
    'export }',
    'var foo, bar; export { foo bar };',
    'export { , };',
    'export var await',
    'export typeof foo;',
    'export new Foo();',
    'function foo() { export default function() { } }',
    'function foo() { }; export { , foo };',
    'function foo() { }; () => { export { foo }; }',
    'function foo() { }; try { export { foo }; } catch(e) { }',
    // 'Syntax error if export is followed by non-identifier'
    'export 12;',
    'export *',
    'export * from foo',
    'export { bar } from foo',
    'export const const1;',
    'function foo() { }; export foo;',
    'export function () { }',
    'export function* () { }',
    'export B, * as A, { C, D } from "test";',
    'export default;',
    'export default var x = 7;',
    'export default let x = 7;',
    'export default const x = 7;',
    'export * as;',
    'export * as foo;',
    'export * as foo from;',
    "export * as foo from ';",
    "export * as ,foo from 'bar'",
    'export *;',
    'export 12;',
    'export function() {}',
    'export function*() {}',
    'export class {}',
    'export class extends C {}',
    'export const const1;',
    'function foo() { }; export foo;',
    'export function () { }',
    'export function* () { }',
    'export class { }',
    'function foo() { }; export [ foo ];',
    'function foo() { export default function() { } }',
    'function foo() { }; export { , foo };',
    'function foo() { }; () => { export { foo }; }',
    'function foo() { }; try { export { foo }; } catch(e) { }',
    'function foo() { }; { export { foo }; }',
    'export default 1, 2, 3;',
    'export ',
    'if (false) export default null;',
    'if (false) {} else export default null;',
    'for(var i=0; i<1; i++) export default null;',
    'while(false) export default null;',
    `do export default null
                                while (false);`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  fail('Module - Export (fail)', [
    ['export const x = x, x = y;', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const [x, x] = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const [x, {x}] = y', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const {x:x, x:x} = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const a = b; let a = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['var x; export {x: a}', Context.Strict | Context.Module],
    ['var x; export {x: a}', Context.OptionsWebCompat],
    ['export async function(){}', Context.Strict | Context.Module],
    ['export async', Context.Strict | Context.Module],
    ['export let ...x = y', Context.Strict | Context.Module],
    ['export ...x = y', Context.Strict | Context.Module],
    ['export default ...x = y', Context.Strict | Context.Module],
    ['export async function f(){} foo', Context.None],
    ['export class x {} foo', Context.None],
    ['export default await', Context.Strict | Context.Module],
    ['export var let = x;', Context.Strict | Context.Module],
    ['{export {x};}', Context.Strict | Context.Module],
    ['let x = () => {export {x};}', Context.Strict | Context.Module],
    ['if (x) export {x};', Context.Strict | Context.Module],
    ['for (;;) export {x};', Context.Strict | Context.Module],
    ['x = { foo(){ export {x}; }}', Context.Strict | Context.Module],
    ['x = { foo(){ export {x}; }}', Context.None],
    ['class x { foo(){ export {x}; }}', Context.Strict | Context.Module],
    ['var foo, bar; export {foo, ...bar}', Context.Strict | Context.Module],
    ['var foo, bar; export {[foo]}', Context.Strict | Context.Module],
    ['var foo, bar; export {{foo}}', Context.Strict | Context.Module],
    ['var foo, bar, x; export {{foo: x}}', Context.Strict | Context.Module],
    ['var foo; export {foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {[foo](){}}', Context.Strict | Context.Module],
    ['export let await;', Context.Strict | Context.Module],
    ['var foo; export {async foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {*foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {*foo(){}}', Context.None],
    ['export foo', Context.Strict | Context.Module],
    ['export {', Context.Strict | Context.Module],
    ['export async;', Context.Strict | Context.Module],
    ['export async () => y', Context.Strict | Context.Module],
    ['var a; export { a,', Context.Strict | Context.Module],
    ["export * as class from 'source';", Context.Strict | Context.Module],
    ['class A extends B { foo() { (super).foo } }', Context.OptionsWebCompat],
    ['export class extends C {}', Context.None],
    ['export *;', Context.Strict | Context.Module],
    ['export * as;', Context.Strict | Context.Module],
    ['export * as foo;', Context.Strict | Context.Module],
    ['export * as foo from;', Context.Strict | Context.Module],
    ["export * as foo from ';", Context.Strict | Context.Module],
    ["export * as ,foo from 'bar'", Context.Strict | Context.Module],
    ["export * as default from 'bar'", Context.Strict | Context.Module],
    ["export * as enum from 'bar'", Context.Strict | Context.Module],
    ["export * as foo from 'bar'", Context.Strict | Context.Module],
    ["export * as for from 'bar'", Context.Strict | Context.Module],
    ["export * as let from 'bar'", Context.Strict | Context.Module],
    ["export * as static from 'bar'", Context.Strict | Context.Module],
    ["export * as yield from 'bar'", Context.Strict | Context.Module],
    ['export {', Context.Strict | Context.Module],
    ['export *;', Context.Strict | Context.Module],
    ['export * as;', Context.Strict | Context.Module],
    ['export * as foo;', Context.Strict | Context.Module],
    ['export * as foo from;', Context.Strict | Context.Module],
    ["export * as foo from ';", Context.Strict | Context.Module],
    ["export * as ,foo from 'bar'", Context.Strict | Context.Module],
    ['export * as foo from;', Context.Strict | Context.Module | Context.OptionsNext],
    ["export * as foo from ';", Context.Strict | Context.Module | Context.OptionsNext],
    ["export * as ,foo from 'bar'", Context.Strict | Context.Module | Context.OptionsNext],
    ['var a; export { a', Context.Strict | Context.Module],
    ['var a; export { a,', Context.Strict | Context.Module],
    ['var a; export { a, ;', Context.Strict | Context.Module],
    ['var a; export { a as };', Context.Strict | Context.Module],
    ['var a, b; export { a as , b};', Context.Strict | Context.Module],
    ['export default = 42', Context.Strict | Context.Module],
    ['export {default} +', Context.Strict | Context.Module],
    ['export default from "foo"', Context.Strict | Context.Module],
    ['({ set m(x) { export default null; } });', Context.Strict | Context.Module],
    ['for (let y in []) import v from "foo"', Context.Strict | Context.Module],
    ['for (let y in []) import v from "foo"', Context.Strict | Context.Module],
    ['switch(0) { default: export default null; }', Context.Strict | Context.Module],
    ['switch(0) { case 1: export default null; }', Context.Strict | Context.Module],
    ['if (true) { } else export default null;', Context.Strict | Context.Module],
    ['function* g() { export default null; }', Context.None],
    ['test262: export default null;', Context.Strict | Context.Module],
    ['(function() { export default null; });', Context.Strict | Context.Module],
    ['for (x = 0; false;) export default null;', Context.Strict | Context.Module],
    ['do export default null; while (false)', Context.Strict | Context.Module],
    ["export * as arguments from 'bar'", Context.Strict | Context.Module],
    ["export * as await from 'bar'", Context.Strict | Context.Module],
    ['export default async x \n() => {}', Context.Strict | Context.Module],
    ['{export default 3}', Context.Strict | Context.Module],
    ['while (1) export default 3', Context.Strict | Context.Module],
    ['export {a,,b}', Context.Strict | Context.Module],
    ['export {function} from a', Context.Strict | Context.Module],
    ['export let[a] = 0 export let[b] = 0', Context.Strict | Context.Module],
    ['export 3', Context.Strict | Context.Module],
    ['export function () {}', Context.Strict | Context.Module],
    ['export default default', Context.Strict | Context.Module],
    ['export default function', Context.Strict | Context.Module],
    ['export default let', Context.Strict | Context.Module],
    ['let a; let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export const a = 1;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; var a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a; export var a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, a as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export class a{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export const a = 0; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a as b}; var b;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a as b}; let b;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {b, a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, c}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b as a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x, x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function x(){}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {b, a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {a}; export {a, b};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {b as a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; class f{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; class f{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f{}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f{}; async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export foo; export bar; class f{}; async function foo(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['export async function f(){}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default function(){}; export default function(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      'export default class x{}; export default async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      'export default class x{}; export async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      'export class x{}; export default async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['export class x{}; export async function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default class x{}; export default function(){};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['export default class x{}; export default class x{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default class x{}; export default () => {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default async x => { let x; };', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default function() {} export default function() {}',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['export function a() {} export default function a() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {} export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f} export class f {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export const x = y; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f}; export const x = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f}; export async function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var x, y; export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; const f = foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const f = foo; export async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { Q } from;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var foo; export let foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let foo; export let foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {b, a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {a, b}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a){ let a; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a){ const a = 0; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a, a){}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function([a, a]){}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {b as a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function x(){}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export {x};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {}; export function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {}; export function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x, x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, a, b}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {b, a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['class C { method() { export default null; } }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['{ export default null; }', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      `export function f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      `export class f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      `export function f() {}
    export class f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      `export async function *f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      `export default async function *f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      `export async function *f() {}
    export default function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      'var canBeUndeclared; export {mustExist as canBeUndeclared};',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['export {mustExist as canBeUndeclared};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var x, y; export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {foo, bar,};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for as foo }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { arguments }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { bar, };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo2, baz }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo3, baz as baz2, }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo4, bar as bar2, foobar }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { x as default };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {aa as bb, x};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {foob};', Context.Strict | Context.Module | Context.OptionsLexical]
  ]);

  for (const arg of [
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export default async function() {}',
    'export default async function f() {}',
    'export default x;',
    'export const foo = async function() { }',
    'export function async() { }',
    'export function func() { };',
    'export class C { };',
    'export class A extends B {};',
    'export default class A extends B {};',
    'export { };',
    'export {get}; function get() {};',
    'function f() {}; f(); export { f };',
    'export let x = 0;',
    "export { a as b } from 'm.js';",
    "export * from 'p.js';",
    'export var foo;',
    'export {b as a}; export {a};',
    'export default class cName { valueOf() { return 45; } }',
    'export function goo() {};',
    'export let hoo;',
    'export const joo = 42;',
    'export default (function koo() {});',
    'export var y = 0;',
    'export const z = 0;',
    'export function func() { };',
    'export class C { };',
    'export { };',
    'export function foo () { return "foo"; }',
    'export const boo = 5;',
    'import {ns} from "three";',
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export default x;',
    'export function func() { };',
    'export class C { };',
    'export var j = 42;',
    'export let k = 42;',
    'export function l() {}',
    'export default function () {}',
    'export default class extends C {}',
    'export default 42',
    'var x; export default x = 7',
    "export { Q } from 'somemodule.js';",
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { for } from 'm.js';",
    "export { yield } from 'm.js'",
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'export default [];',
    'export default 42;',
    'export default { foo: 1 };',
    'export * from "foo";',
    'export {default} from "foo";',
    'export {foo as bar} from "foo";',
    'export function *foo () {}',
    'export default function(){}; export default function(){};',
    'export function a() {} export default function a() {}',
    'export let x = y, [x] = y;',
    'export function x(){}; export let [z] = y;',
    'export class f{}; async function f(){};',
    'export var a = x, b = y;',
    'export {a as b};',
    'export var foo = 1;',
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    "export {thing}; import thing from 'a.js';",
    "export {thing}; import {thing} from 'a.js';",
    "export {thing}; import * as thing from 'a.js';",
    'export { x as y };',
    "export { a as b } from 'm.js';",
    "export * from 'p.js';",
    'export var foo;',
    'export function goo() {};',
    'export let hoo;',
    `export default class { constructor() {	foo() } a() {	bar()	}	}`,
    'export const joo = 42;',
    'export default (function koo() {});',
    'export { };',
    'export {get}; function get() {};',
    'function f() {}; f(); export { f };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function *a() {}',
    'export var foo = function () {};',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function*() {}',
    'export default class C {}',
    'export default class {}',
    'export default class extends C {}',
    'export default 42',
    `export var x;
    x = 'Pass';`,
    'var x; export default x = 7',
    "export { Q } from 'somemodule.js';",
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { for } from 'm.js';",
    "export { yield } from 'm.js'",
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function *a() {}',
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export function func() { };',
    'export class C { };',
    'export { };',
    'function f() {}; f(); export { f };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function*() {}',
    'export default class C {}',
    'export default class {}',
    'export default class extends C {}',
    'export default 42',
    'var x; export default x = 7',
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { yield } from 'm.js'",
    'export default function f(){}; export {f};',
    'export default async function f(){}; export {f};',
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    'export var document',
    'export var document = {}',
    'export var document',
    'export class Class {}',
    'export default 42',
    'export default class A {}',
    'export default (class{});',
    'export default /foo/',
    'export var namedOther = null;',
    'export var starAsVarDecl;',
    'export let starAsLetDecl;',
    'export const starAsConstDecl = null;',
    'export function starAsFuncDecl() {}',
    'export function* starAsGenDecl() {}',
    'export class starAsClassDecl {}',
    'export default class Foo {}++x',
    "export { x as y } from './y.js';\nexport { x as z } from './z.js';",
    "export { default as y } from './y.js';\nexport default 42;",
    'export default function(x) {};',
    'export default function () { };',
    'export default function _fn2 () { }',
    'class c { }; export default c',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    'var a; export default a = 10;',
    'export default () => 3',
    'function _default() { }; export default _default',
    'export let a, [...x] = y',
    'export let [...x] = y',
    // Named generator function statement
    'function* g() { }; export default g',
    'class c { }; export default c',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    'export default async \nfunction f(){}',
    'function foo() { }',
    "export const const2 = 'str';",
    'export const const3 = 3, const4 = 4;',
    'export const const5 = { }',
    'export const const6 = [ ]',
    'export {};',
    'class bar { }',
    'function* baz() { }',
    'function foobar() { }',
    "export var var1 = 'string';",
    "export default 'default';",
    'export var var2;',
    'export var var3 = 5, var4',
    'export var var5, var6, var7',
    'export default 1;',
    'var a; export default a = 10;',
    'function _default() { }; export default _default',
    'function* g() { }; export default g',
    'export function *g() { } if (true) { }',
    'export class c1 { } if (true) { }',
    'export default function* _gn2 () { } if (true) { }',
    'export default class _cl2 { } if (true) { }',
    'export default function _fn2 () { } if (true) { }',
    'class c { }; export default c',
    'export function a() {} export default function a() {}',
    'export function f(){}; export {f};',
    'export function f(){}; export {f};',
    'export class f {} export {f};',
    'export {x}; export class y {};',
    'export const x = y; export {f};',
    'export let x = y; export {f};',
    'export {f}; export const x = y;',
    'export {f}; export async function f() {}',
    'export default x; export {y as default};',
    'var x, y; export default x; export {y as default};',
    'export async function f(){}; const z = foo;',
    'const f = foo; export async function z(){};',
    'export var foo; export let foo;',
    'export let foo; export let foo;',
    'var a,b; export {c, d}; export {e};',
    'export { for }',
    'export {b as a}; export {a};',
    'export {a}; export {b as c};',
    'export {x}; export let {...x} = y;',
    'export let x = y, {...z} = y;',
    'export let x = y, [...z] = y;',
    'export {x}; export let [...z] = y;',
    'export let [x] = y; export function z(){};',
    'export function x(){}; export let [z] = y;',
    'export async function f(){}; export {z};',
    'export class f {}; export function y() {}',
    'export class f {}; export function y() {}',
    'export default function () {}',
    'export default class {}',
    'export var a = x, b = y;',
    'export let [x, z] = y;',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    `export{};
      export {};
      export {}
      export { };
      export
      {
      };
      export//-
      {//-
      //-
      };
      export/**/{/**/};`,
    'var a; export { a as b };',
    'export default 1',
    'export default () => {}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsWebCompat
        );
      });
    });
  }
  for (const arg of [
    "export var var1 = 'string';",
    "export default 'default';",
    'export var var2;',
    'export var var3 = 5, var4',
    'export var var5, var6, var7',
    'export default 1;',
    'var a; export default a = 10;',
    "export { let } from 'm.js'",
    'export default [];',
    'export default 42;',
    'export default { foo: 1 };',
    'export * from "foo";',
    'export {default} from "foo";',
    'export {foo as bar} from "foo";',
    'export function *foo () {}'
    //"export {thing}; import thing from 'a.js';",
    //"export {thing}; import {thing} from 'a.js';",
    //"export {thing}; import * as thing from 'a.js';",
    //'export { x as y };',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsLexical | Context.OptionsNext
        );
      });
    });
  }

  pass('Module - Export (pass)', [
    [
      'export default async',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 20,
            declaration: {
              type: 'Identifier',
              start: 15,
              end: 20,
              name: 'async'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default class f{}; export {f};',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsLexical,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [],
              id: {
                name: 'f',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          },
          {
            type: 'EmptyStatement'
          },
          {
            declaration: null,
            source: null,
            specifiers: [
              {
                exported: {
                  name: 'f',
                  type: 'Identifier'
                },
                local: {
                  name: 'f',
                  type: 'Identifier'
                },
                type: 'ExportSpecifier'
              }
            ],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export default function f(){}; export {f};',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsLexical,
      {
        body: [
          {
            declaration: {
              async: false,
              body: {
                body: [],
                type: 'BlockStatement'
              },
              generator: false,
              id: {
                name: 'f',
                type: 'Identifier'
              },
              params: [],
              type: 'FunctionDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          },
          {
            type: 'EmptyStatement'
          },
          {
            declaration: null,
            source: null,
            specifiers: [
              {
                exported: {
                  name: 'f',
                  type: 'Identifier'
                },
                local: {
                  name: 'f',
                  type: 'Identifier'
                },
                type: 'ExportSpecifier'
              }
            ],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export default async \nfunction f(){}',
      Context.Module | Context.OptionsNext | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'Identifier',
              name: 'async'
            }
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      "export * as class from 'source';",
      Context.Module | Context.OptionsNext | Context.Strict,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: 'source'
            },
            specifiers: [
              {
                specifier: {
                  name: 'class',
                  type: 'Identifier'
                },
                type: 'ExportNamespaceSpecifier'
              }
            ],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export * as ns from "source";',
      Context.Module | Context.OptionsNext | Context.Strict,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: 'source'
            },
            specifiers: [
              {
                specifier: {
                  name: 'ns',
                  type: 'Identifier'
                },
                type: 'ExportNamespaceSpecifier'
              }
            ],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export * from "foo"',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        body: [
          {
            type: 'ExportAllDeclaration',
            start: 0,
            end: 19,
            source: {
              type: 'Literal',
              start: 14,
              end: 19,
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export * from "a"',
      Context.Module | Context.Strict | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        body: [
          {
            type: 'ExportAllDeclaration',
            start: 0,
            end: 17,
            source: {
              type: 'Literal',
              start: 14,
              end: 17,
              value: 'a'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export * as foo from "./foo";',
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: './foo'
            },
            specifiers: [
              {
                specifier: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'ExportNamespaceSpecifier'
              }
            ],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export {}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 9,
            declaration: null,
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x}; var x;',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 11,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 8,
                end: 9,
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'x'
                }
              }
            ],
            source: null
          },
          {
            type: 'VariableDeclaration',
            start: 12,
            end: 18,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 16,
                end: 17,
                id: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x; export {x as a}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 6,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 7,
            end: 22,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 15,
                end: 21,
                local: {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  name: 'a'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x; export {x,}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 6,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 7,
            end: 18,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 15,
                end: 16,
                local: {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  name: 'x'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x} from "foo"',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 21,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 8,
                end: 9,
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 16,
              end: 21,
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x as a} from "foo"',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 26,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 8,
                end: 14,
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  name: 'a'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 21,
              end: 26,
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x,} from "foo"',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: {
              type: 'Literal',
              value: 'foo'
            },
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            declaration: null
          }
        ]
      }
    ],
    [
      'var x; export {x as a,}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 6,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 7,
            end: 23,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 15,
                end: 21,
                local: {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  name: 'a'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x,y; export {x as a, y as b}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 8,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 7,
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'y'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 9,
            end: 32,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 17,
                end: 23,
                local: {
                  type: 'Identifier',
                  start: 17,
                  end: 18,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  name: 'a'
                }
              },
              {
                type: 'ExportSpecifier',
                start: 25,
                end: 31,
                local: {
                  type: 'Identifier',
                  start: 25,
                  end: 26,
                  name: 'y'
                },
                exported: {
                  type: 'Identifier',
                  start: 30,
                  end: 31,
                  name: 'b'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export var x = 10, y = 20',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 25,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 25,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 17,
                  id: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    name: 'x'
                  },
                  init: {
                    type: 'Literal',
                    start: 15,
                    end: 17,
                    value: 10
                  }
                },
                {
                  type: 'VariableDeclarator',
                  start: 19,
                  end: 25,
                  id: {
                    type: 'Identifier',
                    start: 19,
                    end: 20,
                    name: 'y'
                  },
                  init: {
                    type: 'Literal',
                    start: 23,
                    end: 25,
                    value: 20
                  }
                }
              ],
              kind: 'var'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let x',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 12,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 12,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 12,
                  id: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    name: 'x'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let x, y',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 15,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 15,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 12,
                  id: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    name: 'x'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  start: 14,
                  end: 15,
                  id: {
                    type: 'Identifier',
                    start: 14,
                    end: 15,
                    name: 'y'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export const x = 10, y = 20',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 27,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 27,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 13,
                  end: 19,
                  id: {
                    type: 'Identifier',
                    start: 13,
                    end: 14,
                    name: 'x'
                  },
                  init: {
                    type: 'Literal',
                    start: 17,
                    end: 19,
                    value: 10
                  }
                },
                {
                  type: 'VariableDeclarator',
                  start: 21,
                  end: 27,
                  id: {
                    type: 'Identifier',
                    start: 21,
                    end: 22,
                    name: 'y'
                  },
                  init: {
                    type: 'Literal',
                    start: 25,
                    end: 27,
                    value: 20
                  }
                }
              ],
              kind: 'const'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export function f(){}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 21,
            declaration: {
              type: 'FunctionDeclaration',
              start: 7,
              end: 21,
              id: {
                type: 'Identifier',
                start: 16,
                end: 17,
                name: 'f'
              },
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 19,
                end: 21,
                body: []
              }
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export async function f(){}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 27,
            declaration: {
              type: 'FunctionDeclaration',
              start: 7,
              end: 27,
              id: {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'f'
              },
              generator: false,
              async: true,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 25,
                end: 27,
                body: []
              }
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export function* f(){}',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      'export default function f(){}',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          }
        ]
      }
    ],
    [
      'export default async function f(){}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 35,
            declaration: {
              type: 'FunctionDeclaration',
              start: 15,
              end: 35,
              id: {
                type: 'Identifier',
                start: 30,
                end: 31,
                name: 'f'
              },
              generator: false,
              async: true,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 33,
                end: 35,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],

    [
      'export default function* f(){}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 30,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 30,
            declaration: {
              type: 'FunctionDeclaration',
              start: 15,
              end: 30,
              id: {
                type: 'Identifier',
                start: 25,
                end: 26,
                name: 'f'
              },
              generator: true,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 28,
                end: 30,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export class x {}',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 17,
            declaration: {
              type: 'ClassDeclaration',
              start: 7,
              end: 17,
              id: {
                type: 'Identifier',
                start: 13,
                end: 14,
                name: 'x'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 15,
                end: 17,
                body: []
              }
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],

    [
      'export default class x {}',
      Context.OptionsWebCompat | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 25,
            declaration: {
              type: 'ClassDeclaration',
              start: 15,
              end: 25,
              id: {
                type: 'Identifier',
                start: 21,
                end: 22,
                name: 'x'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 23,
                end: 25,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let [...x] = y',
      Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 21,
            declaration: {
              type: 'VariableDeclaration',
              start: 7,
              end: 21,
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 11,
                  end: 21,
                  id: {
                    type: 'ArrayPattern',
                    start: 11,
                    end: 17,
                    elements: [
                      {
                        type: 'RestElement',
                        start: 12,
                        end: 16,
                        argument: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          name: 'x'
                        }
                      }
                    ]
                  },
                  init: {
                    type: 'Identifier',
                    start: 20,
                    end: 21,
                    name: 'y'
                  }
                }
              ],
              kind: 'let'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let {...x} = y',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'export default [x] = y',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'var a,b; export {a}; export {b};',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 8,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'a'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 7,
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'b'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 9,
            end: 20,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 17,
                end: 18,
                local: {
                  type: 'Identifier',
                  start: 17,
                  end: 18,
                  name: 'a'
                },
                exported: {
                  type: 'Identifier',
                  start: 17,
                  end: 18,
                  name: 'a'
                }
              }
            ],
            source: null
          },
          {
            type: 'ExportNamedDeclaration',
            start: 21,
            end: 32,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 29,
                end: 30,
                local: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  name: 'b'
                },
                exported: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  name: 'b'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default async () => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 28,
            declaration: {
              type: 'ArrowFunctionExpression',
              start: 15,
              end: 28,
              expression: true,
              async: true,
              params: [],
              body: {
                type: 'Identifier',
                start: 27,
                end: 28,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default async (x) => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 29,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 29,
            declaration: {
              type: 'ArrowFunctionExpression',
              start: 15,
              end: 29,
              expression: true,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  name: 'x'
                }
              ],
              body: {
                type: 'Identifier',
                start: 28,
                end: 29,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default async function(){}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 33,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 33,
            declaration: {
              type: 'FunctionDeclaration',
              start: 15,
              end: 33,
              id: null,
              generator: false,
              async: true,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 31,
                end: 33,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default function* (){}',
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: null
            }
          }
        ]
      }
    ],
    [
      'export default class x{}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 24,
            declaration: {
              decorators: [],
              type: 'ClassDeclaration',
              start: 15,
              end: 24,
              id: {
                type: 'Identifier',
                start: 21,
                end: 22,
                name: 'x'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 22,
                end: 24,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {} from "x"',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 18,
            declaration: null,
            specifiers: [],
            source: {
              type: 'Literal',
              start: 15,
              end: 18,
              value: 'x'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default async x => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 27,
            declaration: {
              type: 'ArrowFunctionExpression',
              start: 15,
              end: 27,
              expression: true,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  name: 'x'
                }
              ],
              body: {
                type: 'Identifier',
                start: 26,
                end: 27,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default (a,b) => {}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 26,
            declaration: {
              type: 'ArrowFunctionExpression',
              start: 15,
              end: 26,
              expression: false,
              async: false,
              params: [
                {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  name: 'b'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 24,
                end: 26,
                body: []
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default () => {}',
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: []
              },
              params: [],
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'export {};',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: null
          }
        ]
      }
    ],
    [
      'export var foo = 1;',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  init: {
                    type: 'Literal',
                    value: 1
                  }
                }
              ],
              kind: 'var'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export function foo () {}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'export function \\u{5A}() {}',
      Context.Strict | Context.Module,
      {
        body: [
          {
            declaration: {
              async: false,
              body: {
                body: [],
                type: 'BlockStatement'
              },
              generator: false,

              id: {
                name: 'Z',
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
      'export {foo} from "foo";',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: {
              type: 'Literal',
              value: 'foo'
            },
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                },
                exported: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ],
            declaration: null
          }
        ]
      }
    ],
    [
      'export * from "foo";',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportAllDeclaration',
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ]
      }
    ],
    [
      'export default function () {}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: null
            }
          }
        ]
      }
    ],
    [
      'export default (1 + 2);',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 23,
            declaration: {
              type: 'BinaryExpression',
              start: 16,
              end: 21,
              left: {
                type: 'Literal',
                start: 16,
                end: 17,
                value: 1
              },
              operator: '+',
              right: {
                type: 'Literal',
                start: 20,
                end: 21,
                value: 2
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],

    [
      'export class a {}',
      Context.Strict | Context.Module,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              id: {
                name: 'a',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
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
      'export default class A {}',
      Context.Strict | Context.Module,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              id: {
                name: 'A',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'export default [];',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 18,
            declaration: {
              type: 'ArrayExpression',
              start: 15,
              end: 17,
              elements: []
            }
          }
        ],
        sourceType: 'module'
      }
    ],

    [
      'export default function foo() {}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'export default function *foo() {}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'var foo; export {foo as new}',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 8,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 7,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 7,
                  name: 'foo'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 9,
            end: 28,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 17,
                end: 27,
                local: {
                  type: 'Identifier',
                  start: 17,
                  end: 20,
                  name: 'foo'
                },
                exported: {
                  type: 'Identifier',
                  start: 24,
                  end: 27,
                  name: 'new'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {a as b}; var a;',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        body: [
          {
            type: 'ExportNamedDeclaration',
            start: 0,
            end: 16,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 8,
                end: 14,
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'a'
                },
                exported: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  name: 'b'
                }
              }
            ],
            source: null
          },
          {
            type: 'VariableDeclaration',
            start: 17,
            end: 23,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 21,
                end: 22,
                id: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  name: 'a'
                },
                init: null
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var a; export {a as b};',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ]
          },
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'a'
                },
                exported: {
                  type: 'Identifier',
                  name: 'b'
                }
              }
            ],
            declaration: null
          }
        ]
      }
    ],
    [
      `[function* (...{}) {  switch (yield) {}  }]
        a = (u) => {}`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 65,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 43,
            expression: {
              type: 'ArrayExpression',
              start: 0,
              end: 43,
              elements: [
                {
                  type: 'FunctionExpression',
                  start: 1,
                  end: 42,
                  id: null,
                  generator: true,
                  async: false,
                  params: [
                    {
                      type: 'RestElement',
                      start: 12,
                      end: 17,
                      argument: {
                        type: 'ObjectPattern',
                        start: 15,
                        end: 17,
                        properties: []
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    start: 19,
                    end: 42,
                    body: [
                      {
                        type: 'SwitchStatement',
                        start: 22,
                        end: 39,
                        discriminant: {
                          type: 'YieldExpression',
                          start: 30,
                          end: 35,
                          delegate: false,
                          argument: null
                        },
                        cases: []
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            type: 'ExpressionStatement',
            start: 52,
            end: 65,
            expression: {
              type: 'AssignmentExpression',
              start: 52,
              end: 65,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 52,
                end: 53,
                name: 'a'
              },
              right: {
                type: 'ArrowFunctionExpression',
                start: 56,
                end: 65,
                expression: false,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 57,
                    end: 58,
                    name: 'u'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 63,
                  end: 65,
                  body: []
                }
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {foo}; function foo() {};',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                },
                exported: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ],
            declaration: null
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          },
          {
            type: 'EmptyStatement'
          }
        ]
      }
    ],
    [
      'export var x = 1;',
      Context.Strict | Context.Module,
      {
        body: [
          {
            declaration: {
              declarations: [
                {
                  id: {
                    name: 'x',
                    type: 'Identifier'
                  },
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  type: 'VariableDeclarator'
                }
              ],
              kind: 'var',
              type: 'VariableDeclaration'
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
      'export default 3;',
      Context.Strict | Context.Module,
      {
        body: [
          {
            declaration: {
              type: 'Literal',
              value: 3
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'var x; export { x as a }; export { x as b };',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 6,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 7,
            end: 25,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 16,
                end: 22,
                local: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  name: 'a'
                }
              }
            ],
            source: null
          },
          {
            type: 'ExportNamedDeclaration',
            start: 26,
            end: 44,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 35,
                end: 41,
                local: {
                  type: 'Identifier',
                  start: 35,
                  end: 36,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 40,
                  end: 41,
                  name: 'b'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default [x] = y',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        body: [
          {
            type: 'ExportDefaultDeclaration',
            start: 0,
            end: 22,
            declaration: {
              type: 'AssignmentExpression',
              start: 15,
              end: 22,
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 15,
                end: 18,
                elements: [
                  {
                    type: 'Identifier',
                    start: 16,
                    end: 17,
                    name: 'x'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 21,
                end: 22,
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'let foo, bar; export {foo, bar}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'bar'
                },
                init: null
              }
            ],
            kind: 'let'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'foo'
                },
                local: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'bar'
                },
                local: {
                  type: 'Identifier',
                  name: 'bar'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export default function *f(){} foo',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'f'
              }
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'export * from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportAllDeclaration',
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: null
          }
        ]
      }
    ],
    [
      'export {x}; var x;',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            declaration: null
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x; export {x as a}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'a'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x; export {x,}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x} from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x as a} from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'a'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export {x,} from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x; export {x as a,}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ],
            declaration: null
          }
        ]
      }
    ],
    [
      'var x,y; export {x, y}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'y'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'y'
                },
                local: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x,y; export {x as a, y as b}',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 8,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 5,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                start: 6,
                end: 7,
                id: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  name: 'y'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            start: 9,
            end: 32,
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                start: 17,
                end: 23,
                local: {
                  type: 'Identifier',
                  start: 17,
                  end: 18,
                  name: 'x'
                },
                exported: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  name: 'a'
                }
              },
              {
                type: 'ExportSpecifier',
                start: 25,
                end: 31,
                local: {
                  type: 'Identifier',
                  start: 25,
                  end: 26,
                  name: 'y'
                },
                exported: {
                  type: 'Identifier',
                  start: 30,
                  end: 31,
                  name: 'b'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x,y; export {x, y,}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'y'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'y'
                },
                local: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'var x,y; export {x as a, y as b,}',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'y'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'a'
                },
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ExportSpecifier',
                exported: {
                  type: 'Identifier',
                  name: 'b'
                },
                local: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            ],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export var x',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export var x, y',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  init: null
                }
              ],
              kind: 'var'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export var x = 10, y = 20',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  init: {
                    type: 'Literal',
                    value: 10
                  }
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  init: {
                    type: 'Literal',
                    value: 20
                  }
                }
              ],
              kind: 'var'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let x',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'export let x, y',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  init: null
                },
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            specifiers: [],
            source: null
          }
        ],
        sourceType: 'module'
      }
    ],

    [
      'export let a = 1;',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            source: null,
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Literal',
                    value: 1
                  },
                  id: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
