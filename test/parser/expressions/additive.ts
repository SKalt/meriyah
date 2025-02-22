import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Additive', () => {
  pass('Expressions - Additive (pass)', [
    [
      'd = a + b;  a = b;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 9,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'd'
              },
              right: {
                type: 'BinaryExpression',
                start: 4,
                end: 9,
                left: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  name: 'a'
                },
                operator: '+',
                right: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  name: 'b'
                }
              }
            }
          },
          {
            type: 'ExpressionStatement',
            start: 12,
            end: 18,
            expression: {
              type: 'AssignmentExpression',
              start: 12,
              end: 17,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 12,
                end: 13,
                name: 'a'
              },
              right: {
                type: 'Identifier',
                start: 16,
                end: 17,
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '--a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '--',
              prefix: true
            }
          }
        ]
      }
    ]
  ]);
});
