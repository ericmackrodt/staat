import { setScope } from '../utils';

describe('utils', () => {
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
  });
});
