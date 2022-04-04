import * as index from '../lib/index';

describe('Index', () => {
  test('export Ecs class', () => {
    const classes = Object.keys(index);
    expect(classes).toContain('Ecs');
  });
});
