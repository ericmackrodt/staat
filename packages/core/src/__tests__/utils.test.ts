import { setScope, isTransformer } from '../utils';

describe('utils', () => {
  test('isTransformer', () => {
    expect(isTransformer({})).toBe(false);
    expect(isTransformer(jest.fn())).toBe(true);
  });

  describe('setScope', () => {
    it('should build correct object', () => {
      const state = {
        level1: {
          name: 'Test',
        },
      };

      const result = setScope(state, { name: 'Another' }, ['level1']);
      expect(result).toEqual({
        level1: {
          name: 'Another',
        },
      });
      expect(result).not.toBe(state);
    });

    it('should build correct object with multiple levels', () => {
      const state = {
        level1: {
          level2: {
            name: 'Test',
          },
        },
      };

      const result = setScope(state, { name: 'Another' }, ['level1', 'level2']);
      expect(result).toEqual({
        level1: {
          level2: {
            name: 'Another',
          },
        },
      });
      expect(result).not.toBe(state);
    });

    it('should throw error if property does not exist', () => {
      const state = {
        level1: {
          level2: {
            name: 'Test',
          },
        },
      };

      expect(() =>
        setScope(state, { name: 'Another' }, ['non_existant']),
      ).toThrowError(
        'The property [non_existant] in path is invalid or undefined',
      );
    });
  });
});
