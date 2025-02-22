import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Decorators', () => {
  for (const arg of [
    'var foo = @dec class Bar { bam() { f(); } }',
    'class A { @dec *m(){} }',
    'class A { @a.b.c.d(e, f)     m(){}}',
    'class Bar{ @outer( @classDec class { @inner innerMethod() {} } ) outerMethod() {} }',
    `@(foo().bar) class Foo { @(member[expression]) method() {} @(foo + bar) method2() {} }`,
    `@foo('bar')
      class Foo {}`,
    `(class A { @foo get getter(){} })`,
    `class A { @foo get getter(){} }`,
    `class A { @foo set setter(bar){} }`,
    `class A { @foo async bar(){} }`, // allowed?
    '@foo class Foo {}',
    `@outer({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@foo(@bar class Bar{})
      class Foo {}`,
    'class Foo { @foo @bar bar() {} }',
    'class Foo { @foo bar() {} }',
    'var foo = class Bar { @foo Zoo() {} }',
    `@foo('bar')
    class Foo {}`,
    `@abc class Foo {}`,
    `class A {
        @dec *m(){}
      }`,
    `(class A {
        @dec *m(){}
     })`,
    `class A {
      @a.b.c.d(e, f)
      m(){}
    }`,
    `class A { @foo async a(){} }`,
    `class Foo {
      @dec
      static bar() {}
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Async (pass)', [
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    [`class A {  constructor(@foo x) {} }`, Context.OptionsNext | Context.Module | Context.Strict],
    //[`@decorate`, Context.OptionsNext],
    [`class A { @abc constructor(){} }`, Context.OptionsNext | Context.Module | Context.Strict],
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    ['export default @decorator class Foo {}', Context.Module | Context.Strict],
    ['class Foo {@abc constructor(){}', Context.OptionsNext],
    ['class A { @dec }', Context.OptionsNext],
    ['class A { @dec ;}', Context.OptionsNext],
    ['var obj = { method(@foo x) {} };', Context.OptionsNext],
    ['class Foo { constructor(@foo x) {} }', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class Foo {  @a; m(){}}', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class A { @foo && bar method() {}  }', Context.OptionsNext],
    ['class A { @foo && bar; method() {}  }', Context.OptionsNext]
  ]);

  pass('Next - Decorators (pass)', [
    [
      `class A { @dec name = 0; }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [
                    {
                      expression: {
                        name: 'dec',
                        type: 'Identifier'
                      },
                      type: 'Decorator'
                    }
                  ],
                  key: {
                    name: 'name',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 0
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A {  @deco #prop; #foo = 2; test() {  this.#foo; }}`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'prop'
                  },
                  value: null,
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'deco'
                      }
                    }
                  ]
                },
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'foo'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateName',
                              name: 'foo'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `(class A { @foo get getter(){} })`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            expression: {
              body: {
                body: [
                  {
                    computed: false,
                    decorators: [
                      {
                        expression: {
                          name: 'foo',
                          type: 'Identifier'
                        },
                        type: 'Decorator'
                      }
                    ],
                    key: {
                      name: 'getter',
                      type: 'Identifier'
                    },
                    kind: 'get',
                    static: false,
                    type: 'MethodDefinition',
                    value: {
                      async: false,
                      body: {
                        body: [],
                        type: 'BlockStatement'
                      },
                      generator: false,
                      id: null,
                      params: [],
                      type: 'FunctionExpression'
                    }
                  }
                ],
                type: 'ClassBody'
              },
              decorators: [],
              id: {
                name: 'A',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `export default @id class Sample {
        method() {
          class Child {}
        }
      }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [
                  {
                    computed: false,
                    decorators: [],
                    key: {
                      name: 'method',
                      type: 'Identifier'
                    },
                    kind: 'method',
                    static: false,
                    type: 'MethodDefinition',
                    value: {
                      async: false,
                      body: {
                        body: [
                          {
                            body: {
                              body: [],
                              type: 'ClassBody'
                            },
                            decorators: [],
                            id: {
                              name: 'Child',
                              type: 'Identifier'
                            },
                            superClass: null,
                            type: 'ClassDeclaration'
                          }
                        ],
                        type: 'BlockStatement'
                      },
                      generator: false,
                      id: null,
                      params: [],
                      type: 'FunctionExpression'
                    }
                  }
                ],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'id',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Sample',
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
      `export default
          @bar class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'bar',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Foo',
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
      `@bar export default
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          [
            {
              expression: {
                name: 'bar',
                type: 'Identifier'
              },
              type: 'Decorator'
            }
          ],
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [],
              id: {
                name: 'Foo',
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
      `@pushElement({
        kind: "initializer",
        placement: "own",
        initializer() {
          self = this;
        }
      })
      class A {}
      new A();`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          [
            {
              expression: {
                arguments: [
                  {
                    properties: [
                      {
                        computed: false,
                        key: {
                          name: 'kind',
                          type: 'Identifier'
                        },
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        type: 'Property',
                        value: {
                          type: 'Literal',
                          value: 'initializer'
                        }
                      },
                      {
                        computed: false,
                        key: {
                          name: 'placement',
                          type: 'Identifier'
                        },
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        type: 'Property',
                        value: {
                          type: 'Literal',
                          value: 'own'
                        }
                      },
                      {
                        computed: false,
                        key: {
                          name: 'initializer',
                          type: 'Identifier'
                        },
                        kind: 'init',
                        method: true,
                        shorthand: false,
                        type: 'Property',
                        value: {
                          async: false,
                          body: {
                            body: [
                              {
                                expression: {
                                  left: {
                                    name: 'self',
                                    type: 'Identifier'
                                  },
                                  operator: '=',
                                  right: {
                                    type: 'ThisExpression'
                                  },
                                  type: 'AssignmentExpression'
                                },
                                type: 'ExpressionStatement'
                              }
                            ],
                            type: 'BlockStatement'
                          },
                          generator: false,
                          id: null,
                          params: [],
                          type: 'FunctionExpression'
                        }
                      }
                    ],
                    type: 'ObjectExpression'
                  }
                ],
                callee: {
                  name: 'pushElement',
                  type: 'Identifier'
                },
                type: 'CallExpression'
              },
              type: 'Decorator'
            }
          ],
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          },
          {
            expression: {
              arguments: [],
              callee: {
                name: 'A',
                type: 'Identifier'
              },
              type: 'NewExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `@decorator
           class Foo {
            async f1() {}
            *f2() {}
            async *f3() {}
          }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f1',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f2',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f3',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  name: 'decorator',
                  type: 'Identifier'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `export default (@decorator class Foo {})`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'decorator',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Foo',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassExpression'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `class Foo {
        @A * b() {}
      }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [
                    {
                      expression: {
                        name: 'A',
                        type: 'Identifier'
                      },
                      type: 'Decorator'
                    }
                  ],
                  key: {
                    name: 'b',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Foo',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `function deco() {}

      class Foo {
        @deco
        *generatorMethod() {}
      }`,
      Context.OptionsNext,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'deco',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          },
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [
                    {
                      expression: {
                        name: 'deco',
                        type: 'Identifier'
                      },
                      type: 'Decorator'
                    }
                  ],
                  key: {
                    name: 'generatorMethod',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Foo',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  name: 'deco1',
                  type: 'Identifier'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [],
                  callee: {
                    name: 'deco2',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [
                    {
                      name: 'foo',
                      type: 'Identifier'
                    },
                    {
                      name: 'bar',
                      type: 'Identifier'
                    }
                  ],
                  callee: {
                    name: 'deco3',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [
                    {
                      properties: [
                        {
                          computed: false,
                          key: {
                            name: 'foo',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: true,
                          type: 'Property',
                          value: {
                            name: 'foo',
                            type: 'Identifier'
                          }
                        },
                        {
                          computed: false,
                          key: {
                            name: 'bar',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: true,
                          type: 'Property',
                          value: {
                            name: 'bar',
                            type: 'Identifier'
                          }
                        }
                      ],
                      type: 'ObjectExpression'
                    }
                  ],
                  callee: {
                    name: 'deco4',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `@foo('bar')
  class Foo {}`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: []
            },
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'bar'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `@(foo().bar)
  class Foo {
    @(member[expression]) method() {}
    @(foo + bar) method2() {}
  }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    arguments: []
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'method'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'member'
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'expression'
                        }
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'method2'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        operator: '+'
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
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
          }
        ]
      }
    ],
    [
      `class Foo {
    @dec
    static bar() {}
  }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `class A {
        @(({ key }) => { pn = key; })
        #x = 1;

        getX() {
          return this.#x;
        }
      }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'pn'
                                },
                                operator: '=',
                                right: {
                                  type: 'Identifier',
                                  name: 'key'
                                }
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                value: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        ],
                        async: false,
                        expression: false
                      }
                    }
                  ]
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'getX'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateName',
                              name: 'x'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `@deco
        class A {
          get #get() {}

          set #set(_) {}

          get #getset() {}
          set #getset(_) {}

          test() {
            this.#get;
            this.#set = 2;
            this.#getset;
            this.#getset = 2;
          }
        }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'Identifier',
                  name: 'deco'
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'get'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'set'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: '_'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'getset'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'getset'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: '_'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateName',
                              name: 'get'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'set'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 2
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateName',
                              name: 'getset'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'getset'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 2
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `@deco
          class A {
            static #foo() {}

            test() {
              A.#foo();
            }
          }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'Identifier',
                  name: 'deco'
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  decorators: [],
                  static: true,
                  computed: false,
                  key: {
                    type: 'PrivateName',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'A'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'foo'
                              }
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class A {
              @(({ key }) => { pn = key; })
              #x;
            }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'x'
                  },
                  value: null,
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'pn'
                                },
                                operator: '=',
                                right: {
                                  type: 'Identifier',
                                  name: 'key'
                                }
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                value: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        ],
                        async: false,
                        expression: false
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `function writable(w) {
                return desc => {
                  desc.descriptor.writable = w;
                }
              }

              class A {
                @writable(false)
                #x = 2;

                @writable(true)
                @writable(false)
                #y = 2;

                testX() {
                  this.#x = 1;
                }

                testY() {
                  this.#y = 1;
                }
              }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'w'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Identifier',
                                  name: 'desc'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'descriptor'
                                }
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'writable'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'w'
                            }
                          }
                        }
                      ]
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'desc'
                      }
                    ],
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'writable'
            }
          },
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: false
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'y'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: true
                          }
                        ]
                      }
                    },
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: false
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'testX'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'x'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'testY'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'y'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `class A {
                  @(_ => el = _)
                  static foo() {}
                }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'el'
                          },
                          operator: '=',
                          right: {
                            type: 'Identifier',
                            name: '_'
                          }
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: '_'
                          }
                        ],
                        async: false,
                        expression: true
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
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
          }
        ]
      }
    ],
    [
      `@foo(class Bar{})
    class Foo {}`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  arguments: [
                    {
                      body: {
                        body: [],
                        type: 'ClassBody'
                      },
                      decorators: [],
                      id: {
                        name: 'Bar',
                        type: 'Identifier'
                      },
                      superClass: null,
                      type: 'ClassExpression'
                    }
                  ],
                  callee: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class Foo {
        @bar [bizz]
        abc() {

        }
      }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'abc'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        computed: true,
                        property: {
                          type: 'Identifier',
                          name: 'bizz'
                        }
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `class A {
          @foo get getter(){}
        }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'getter'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `@outer({
            store: @inner class Foo {}
          })
          class Bar {

          }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: []
            },
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'outer'
                  },
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'store'
                          },
                          value: {
                            type: 'ClassExpression',
                            id: {
                              type: 'Identifier',
                              name: 'Foo'
                            },
                            superClass: null,
                            body: {
                              type: 'ClassBody',
                              body: []
                            },
                            decorators: [
                              {
                                type: 'Decorator',
                                expression: {
                                  type: 'Identifier',
                                  name: 'inner'
                                }
                              }
                            ]
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class Bar{
              @outer(
                @classDec class {
                  @inner
                  innerMethod() {}
                }
              )
              outerMethod() {}
            }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'outerMethod'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'outer'
                        },
                        arguments: [
                          {
                            type: 'ClassExpression',
                            id: null,
                            superClass: null,
                            decorators: [
                              {
                                type: 'Decorator',
                                expression: {
                                  type: 'Identifier',
                                  name: 'classDec'
                                }
                              }
                            ],
                            body: {
                              type: 'ClassBody',
                              body: [
                                {
                                  type: 'MethodDefinition',
                                  kind: 'method',
                                  static: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    name: 'innerMethod'
                                  },
                                  decorators: [
                                    {
                                      type: 'Decorator',
                                      expression: {
                                        type: 'Identifier',
                                        name: 'inner'
                                      }
                                    }
                                  ],
                                  value: {
                                    type: 'FunctionExpression',
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
                          }
                        ]
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
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
          }
        ]
      }
    ],
    [
      `@({
                store: @inner class Foo {}
              })
              class Bar {

              }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'store'
                      },
                      value: {
                        type: 'ClassExpression',
                        id: {
                          type: 'Identifier',
                          name: 'Foo'
                        },
                        superClass: null,
                        decorators: [
                          {
                            type: 'Decorator',
                            expression: {
                              type: 'Identifier',
                              name: 'inner'
                            }
                          }
                        ],
                        body: {
                          type: 'ClassBody',
                          body: []
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      `class A {
                    @dec #name = 0
                  }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'name'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class Foo {
                      @dec
                      static bar() {}
                    }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
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
          }
        ]
      }
    ],
    [
      `class A {
                        @dec static #name = 0
                      }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'name'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: true,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class Foo { @foo @bar bar() {} }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
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
          }
        ]
      }
    ],
    [
      `var Foo = @foo class Foo {}`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ClassExpression',
                  id: {
                    type: 'Identifier',
                    name: 'Foo'
                  },
                  superClass: null,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ],
                  body: {
                    type: 'ClassBody',
                    body: []
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'Foo'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class Foo { @foo set bar(f) {} }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'f'
                      }
                    ],
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
          }
        ]
      }
    ]
  ]);
});
