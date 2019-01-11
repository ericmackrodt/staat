import * as utils from '../utils';

describe('timeTravel/utils', () => {
  test('getKeys', () => {
    expect(utils.getKeys({ prop1: '', prop2: 0 })).toEqual(['prop1', 'prop2']);
    expect(utils.getKeys({ keyA: new Date(), keyB: ['array'] })).toEqual([
      'keyA',
      'keyB',
    ]);
  });

  test('asArray', () => {
    expect(utils.asArray('test')).toEqual(['test']);
    expect(utils.asArray(['test'])).toEqual(['test']);
    expect(utils.asArray(1)).toEqual([1]);
    expect(utils.asArray([1])).toEqual([1]);
  });
});
