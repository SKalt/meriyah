import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Call', () => {
  for (const arg of [
    'async(a)(b)async',
    '(a)(( async () => {}) => {})',
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #1
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #2
    'async(async() () => {})(async() () => {})(async() () => {})(async() () => {})(async() () => {})' // crazy #3
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['(...[1, 2, 3])', '......[1,2,3]']) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `a()(a)`,
    `async()()`,
    `async(a)()`,
    `async()(b)`,
    `async(a)(b)`,
    '...([1, 2, 3])',
    "...'123', ...'456'",
    '...new Set([1, 2, 3]), 4',
    '1, ...[2, 3], 4',
    '...Array(...[1,2,3,4])',
    '...NaN',
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89'",
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89', 10",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9, ...[10]"
  ]) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.Module | Context.Strict);
      });
    });
  }

  for (const arg of [
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a().b',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'g(a);',
    'h(a, b);',
    'i(a, b, ...c);',
    'j(...a);',
    'a.k();',
    '(a + b).l();',
    'a.m().n();',
    'new A();',
    'new A(a);',
    'new a.B();',
    'new a.b.C();',
    'new (a().B)();',
    'new new A()();',
    'new (A, B)();',
    'a.b( c() ).d.e((a)).f.g',
    'a.b( c() ).d.e((a = 123)).f.g',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({...{b: 2}, a: 3}));',
    "(function(obj) {}({...{a: 2, b: 3, c: 4, e: undefined, f: null, g: false}, a: 1, b: 7, d: 5, h: -0, i: Symbol('foo'), j: {a: 2, b: 3, c: 4, e: undefined, f: null, g: false}}));",
    '(function(obj) {}({...undefined}));',
    '(function(obj) {}(...target = [2, 3, 4]));',
    `a(String, 2).v(123).length;`,
    `a(b,c).abc(1).def`,
    `a(b,c).abc(1)`,
    `a(b,c).abc`,
    `a(b,c)`,
    `foo(bar, baz)`,
    'async (...a, ...b);',
    'async (...a, b);',
    `(    foo  )()`,
    `f(...a)`,
    `f(...a, ...b)`,
    `f(...a, ...b)`,
    'f();',
    'foo(...[1.1, 2.2, 3.3, 4.4, 5.5])',
    'foo(...[1])',
    'foo(...[1, 2, 3])',
    'foo(...new Set([1]))',
    'foo(...new Set([1, 2, 3, 4, 5, 6]))',
    'foo(..."")',
    'foo(...[])',
    'foo(...new Set)',
    'foo(...(function*() { })())',
    'foo(...[1, 2, 3], 4)',
    'foo(...new Set([1, 2, 3, 4]))',
    `foo(...(function*() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    })())`,
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8)',
    'foo.bar(...[1, 2, 3, 4, 5, 6])',
    'foo.bar(...new Set([1, 2]))',
    'foo.bar(..."")',
    'foo(...(function*(){ yield 1; yield 2; yield 3; })())',
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'O.nested, O.nested["returnThis"](..."test")',
    'foo.bar("tes", ..."t!!")',
    'foo.bar(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'fn(...b(), d())',
    'fn(a(), ...b())',
    'fn(a(), ...b(), ...c(), d(), e())',
    'foo(1, ...[2], 3)',
    'foo(...[1])',
    'foo(0)',
    'foo(NaN)',
    'foo("")',
    'foo(false)',
    'foo({})',
    'foo([])',
    'foo(1, ...[2], 3)',
    'foo(...a);'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  fail('Expressions - Call (pass)', [
    ['a.b( c() ).d.e().().f.g.();', Context.None],
    ['a.b( c() ).d.e(()).f.g', Context.None],
    ['foo({a=1})', Context.None],
    ['foo({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['async({a=1})', Context.None],
    ['async({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({a=1})', Context.None],
    ['yield({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({c=3} = {})', Context.Strict],
    ['yield({a})', Context.Strict],
    ['foo(,)', Context.None],
    ['foo(a,b,,)', Context.None],
    ['foo()["bar"', Context.None],
    ['foo().bar.', Context.None],
    ['foo()`bar', Context.None],
    ['foo(', Context.None],
    ['foo(...)', Context.None]
  ]);

  pass('Expressions - Call (pass)', [
    [
      ` obj
                          .foo
                              ["bar"]
                                  .baz()
                                      .foo
                                          ["bar"]()
                                              .baz()()`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 264,
        body: [
          {
            type: 'ExpressionStatement',
            start: 1,
            end: 264,
            expression: {
              type: 'CallExpression',
              start: 1,
              end: 264,
              callee: {
                type: 'CallExpression',
                start: 1,
                end: 262,
                callee: {
                  type: 'MemberExpression',
                  start: 1,
                  end: 260,
                  object: {
                    type: 'CallExpression',
                    start: 1,
                    end: 209,
                    callee: {
                      type: 'MemberExpression',
                      start: 1,
                      end: 207,
                      object: {
                        type: 'MemberExpression',
                        start: 1,
                        end: 157,
                        object: {
                          type: 'CallExpression',
                          start: 1,
                          end: 114,
                          callee: {
                            type: 'MemberExpression',
                            start: 1,
                            end: 112,
                            object: {
                              type: 'MemberExpression',
                              start: 1,
                              end: 73,
                              object: {
                                type: 'MemberExpression',
                                start: 1,
                                end: 35,
                                object: {
                                  type: 'Identifier',
                                  start: 1,
                                  end: 4,
                                  name: 'obj'
                                },
                                property: {
                                  type: 'Identifier',
                                  start: 32,
                                  end: 35,
                                  name: 'foo'
                                },
                                computed: false
                              },
                              property: {
                                type: 'Literal',
                                start: 67,
                                end: 72,
                                value: 'bar'
                              },
                              computed: true
                            },
                            property: {
                              type: 'Identifier',
                              start: 109,
                              end: 112,
                              name: 'baz'
                            },
                            computed: false
                          },
                          arguments: []
                        },
                        property: {
                          type: 'Identifier',
                          start: 154,
                          end: 157,
                          name: 'foo'
                        },
                        computed: false
                      },
                      property: {
                        type: 'Literal',
                        start: 201,
                        end: 206,
                        value: 'bar'
                      },
                      computed: true
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    start: 257,
                    end: 260,
                    name: 'baz'
                  },
                  computed: false
                },
                arguments: []
              },
              arguments: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async(x,) => x',
      Context.None,
      {
        body: [
          {
            expression: {
              async: true,
              body: {
                name: 'x',
                type: 'Identifier'
              },
              expression: true,
              params: [
                {
                  name: 'x',
                  type: 'Identifier'
                }
              ],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async(x,)',
      Context.None,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'x',
                  type: 'Identifier'
                }
              ],
              callee: {
                name: 'async',
                type: 'Identifier'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'foo({c=3} = {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 15,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'foo'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 4,
                  end: 14,
                  operator: '=',
                  left: {
                    type: 'ObjectPattern',
                    start: 4,
                    end: 9,
                    properties: [
                      {
                        type: 'Property',
                        start: 5,
                        end: 8,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 5,
                          end: 6,
                          name: 'c'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 5,
                          end: 8,
                          left: {
                            type: 'Identifier',
                            start: 5,
                            end: 6,
                            name: 'c'
                          },
                          right: {
                            type: 'Literal',
                            start: 7,
                            end: 8,
                            value: 3
                          }
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    start: 12,
                    end: 14,
                    properties: []
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
      'async({c=3} = {})',
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
              type: 'CallExpression',
              start: 0,
              end: 17,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 6,
                  end: 16,
                  operator: '=',
                  left: {
                    type: 'ObjectPattern',
                    start: 6,
                    end: 11,
                    properties: [
                      {
                        type: 'Property',
                        start: 7,
                        end: 10,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 7,
                          end: 8,
                          name: 'c'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 7,
                          end: 10,
                          left: {
                            type: 'Identifier',
                            start: 7,
                            end: 8,
                            name: 'c'
                          },
                          right: {
                            type: 'Literal',
                            start: 9,
                            end: 10,
                            value: 3
                          }
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    start: 14,
                    end: 16,
                    properties: []
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
      'async({a})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 10,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 6,
                  end: 9,
                  properties: [
                    {
                      type: 'Property',
                      start: 7,
                      end: 8,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        name: 'a'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        name: 'a'
                      }
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
      'foo(x=1,y=x,x+y)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 16,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'foo'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 4,
                  end: 7,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    start: 6,
                    end: 7,
                    value: 1
                  }
                },
                {
                  type: 'AssignmentExpression',
                  start: 8,
                  end: 11,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    name: 'y'
                  },
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    name: 'x'
                  }
                },
                {
                  type: 'BinaryExpression',
                  start: 12,
                  end: 15,
                  left: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    name: 'x'
                  },
                  operator: '+',
                  right: {
                    type: 'Identifier',
                    start: 14,
                    end: 15,
                    name: 'y'
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
      'foo(x,x=1);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 10,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  start: 6,
                  end: 9,
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    name: 'x'
                  },
                  right: {
                    type: 'Literal',
                    start: 8,
                    end: 9,
                    value: 1
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
      'foo()(1, 2, 3, ...{})',
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
              type: 'CallExpression',
              start: 0,
              end: 21,
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 5,
                callee: {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  name: 'foo'
                },
                arguments: []
              },
              arguments: [
                {
                  type: 'Literal',
                  start: 6,
                  end: 7,
                  value: 1
                },
                {
                  type: 'Literal',
                  start: 9,
                  end: 10,
                  value: 2
                },
                {
                  type: 'Literal',
                  start: 12,
                  end: 13,
                  value: 3
                },
                {
                  type: 'SpreadElement',
                  start: 15,
                  end: 20,
                  argument: {
                    type: 'ObjectExpression',
                    start: 18,
                    end: 20,
                    properties: []
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
      '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 50,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 50,
            expression: {
              type: 'CallExpression',
              start: 1,
              end: 48,
              callee: {
                type: 'FunctionExpression',
                start: 1,
                end: 17,
                id: null,
                generator: false,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 10,
                    end: 13,
                    name: 'obj'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 15,
                  end: 17,
                  body: []
                }
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 18,
                  end: 47,
                  properties: [
                    {
                      type: 'Property',
                      start: 19,
                      end: 23,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 19,
                        end: 20,
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 22,
                        end: 23,
                        value: 1
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 25,
                      end: 29,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 25,
                        end: 26,
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        start: 28,
                        end: 29,
                        value: 2
                      },
                      kind: 'init'
                    },
                    {
                      type: 'SpreadElement',
                      start: 31,
                      end: 46,
                      argument: {
                        type: 'ObjectExpression',
                        start: 34,
                        end: 46,
                        properties: [
                          {
                            type: 'Property',
                            start: 35,
                            end: 39,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 35,
                              end: 36,
                              name: 'c'
                            },
                            value: {
                              type: 'Literal',
                              start: 38,
                              end: 39,
                              value: 3
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 41,
                            end: 45,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 41,
                              end: 42,
                              name: 'd'
                            },
                            value: {
                              type: 'Literal',
                              start: 44,
                              end: 45,
                              value: 4
                            },
                            kind: 'init'
                          }
                        ]
                      }
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
      'a.b( c() ).d.e;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            expression: {
              type: 'MemberExpression',
              start: 0,
              end: 14,
              object: {
                type: 'MemberExpression',
                start: 0,
                end: 12,
                object: {
                  type: 'CallExpression',
                  start: 0,
                  end: 10,
                  callee: {
                    type: 'MemberExpression',
                    start: 0,
                    end: 3,
                    object: {
                      type: 'Identifier',
                      start: 0,
                      end: 1,
                      name: 'a'
                    },
                    property: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      name: 'b'
                    },
                    computed: false
                  },
                  arguments: [
                    {
                      type: 'CallExpression',
                      start: 5,
                      end: 8,
                      callee: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        name: 'c'
                      },
                      arguments: []
                    }
                  ]
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  name: 'd'
                },
                computed: false
              },
              property: {
                type: 'Identifier',
                start: 13,
                end: 14,
                name: 'e'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'i(a, b, ...c);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 13,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'i'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  name: 'b'
                },
                {
                  type: 'SpreadElement',
                  start: 8,
                  end: 12,
                  argument: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    name: 'c'
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
      '(function(obj) {}({a: 1, b: 2, ...null}));',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 42,
            expression: {
              type: 'CallExpression',
              start: 1,
              end: 40,
              callee: {
                type: 'FunctionExpression',
                start: 1,
                end: 17,
                id: null,
                generator: false,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 10,
                    end: 13,
                    name: 'obj'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  start: 15,
                  end: 17,
                  body: []
                }
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 18,
                  end: 39,
                  properties: [
                    {
                      type: 'Property',
                      start: 19,
                      end: 23,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 19,
                        end: 20,
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        start: 22,
                        end: 23,
                        value: 1
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 25,
                      end: 29,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 25,
                        end: 26,
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        start: 28,
                        end: 29,
                        value: 2
                      },
                      kind: 'init'
                    },
                    {
                      type: 'SpreadElement',
                      start: 31,
                      end: 38,
                      argument: {
                        type: 'Literal',
                        start: 34,
                        end: 38,
                        value: null
                      }
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
      'a.replace(/ /g, "")',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 19,
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 9,
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 2,
                  end: 9,
                  name: 'replace'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'Literal',
                  start: 10,
                  end: 14,
                  value: / /g,
                  regex: {
                    pattern: ' ',
                    flags: 'g'
                  }
                },
                {
                  type: 'Literal',
                  start: 16,
                  end: 18,
                  value: ''
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async(a)=> {}',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'call(await[1])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                name: 'call'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 5,
                  end: 13,
                  object: {
                    type: 'Identifier',
                    start: 5,
                    end: 10,
                    name: 'await'
                  },
                  property: {
                    type: 'Literal',
                    start: 11,
                    end: 12,
                    value: 1
                  },
                  computed: true
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(a)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 6,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 6,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 6,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'a'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(a)(b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 9,
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 6,
                callee: {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    name: 'a'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  name: 'b'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(a, b, c)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 12,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  name: 'c'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(a)(b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async(a)(b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async(a)(s)(y)(n)(c)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 20,
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 17,
                callee: {
                  type: 'CallExpression',
                  start: 0,
                  end: 14,
                  callee: {
                    type: 'CallExpression',
                    start: 0,
                    end: 11,
                    callee: {
                      type: 'CallExpression',
                      start: 0,
                      end: 8,
                      callee: {
                        type: 'Identifier',
                        start: 0,
                        end: 5,
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          start: 6,
                          end: 7,
                          name: 'a'
                        }
                      ]
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        name: 's'
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      name: 'y'
                    }
                  ]
                },
                arguments: [
                  {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
                    name: 'n'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  name: 'c'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async().a',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: []
              },
              property: {
                type: 'Identifier',
                name: 'a'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async()()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: []
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'async(async(async(async(async(async())))))',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 42,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 42,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 6,
                  end: 41,
                  callee: {
                    type: 'Identifier',
                    start: 6,
                    end: 11,
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'CallExpression',
                      start: 12,
                      end: 40,
                      callee: {
                        type: 'Identifier',
                        start: 12,
                        end: 17,
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'CallExpression',
                          start: 18,
                          end: 39,
                          callee: {
                            type: 'Identifier',
                            start: 18,
                            end: 23,
                            name: 'async'
                          },
                          arguments: [
                            {
                              type: 'CallExpression',
                              start: 24,
                              end: 38,
                              callee: {
                                type: 'Identifier',
                                start: 24,
                                end: 29,
                                name: 'async'
                              },
                              arguments: [
                                {
                                  type: 'CallExpression',
                                  start: 30,
                                  end: 37,
                                  callee: {
                                    type: 'Identifier',
                                    start: 30,
                                    end: 35,
                                    name: 'async'
                                  },
                                  arguments: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
      'a.b( o.bar )',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 12,
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 3,
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'b'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 5,
                  end: 10,
                  object: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    name: 'o'
                  },
                  property: {
                    type: 'Identifier',
                    start: 7,
                    end: 10,
                    name: 'bar'
                  },
                  computed: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.b( o["bar"] )',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 15,
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 3,
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'b'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 5,
                  end: 13,
                  object: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    name: 'o'
                  },
                  property: {
                    type: 'Literal',
                    start: 7,
                    end: 12,
                    value: 'bar'
                  },
                  computed: true
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.b( foo() )',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 12,
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 3,
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  name: 'a'
                },
                property: {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  name: 'b'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 5,
                  end: 10,
                  callee: {
                    type: 'Identifier',
                    start: 5,
                    end: 8,
                    name: 'foo'
                  },
                  arguments: []
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.b( c() ).d',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            expression: {
              type: 'MemberExpression',
              start: 0,
              end: 12,
              object: {
                type: 'CallExpression',
                start: 0,
                end: 10,
                callee: {
                  type: 'MemberExpression',
                  start: 0,
                  end: 3,
                  object: {
                    type: 'Identifier',
                    start: 0,
                    end: 1,
                    name: 'a'
                  },
                  property: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    name: 'b'
                  },
                  computed: false
                },
                arguments: [
                  {
                    type: 'CallExpression',
                    start: 5,
                    end: 8,
                    callee: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      name: 'c'
                    },
                    arguments: []
                  }
                ]
              },
              property: {
                type: 'Identifier',
                start: 11,
                end: 12,
                name: 'd'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.b( c() ).d.e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  },
                  arguments: [
                    {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      arguments: []
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ]
      }
    ],
    [
      'foo()(1, 2, 3)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              callee: {
                type: 'CallExpression',
                start: 0,
                end: 5,
                callee: {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  name: 'foo'
                },
                arguments: []
              },
              arguments: [
                {
                  type: 'Literal',
                  start: 6,
                  end: 7,
                  value: 1
                },
                {
                  type: 'Literal',
                  start: 9,
                  end: 10,
                  value: 2
                },
                {
                  type: 'Literal',
                  start: 12,
                  end: 13,
                  value: 3
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(x,y,)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(200)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Literal',
                  value: 200
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)(b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)(b)(c)(d)(e)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'CallExpression',
                  callee: {
                    type: 'CallExpression',
                    callee: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ]
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    }
                  ]
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'd'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'e'
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
