import { capitalizeFirstLetter } from '../strings';

describe('strings helper functions', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a lowercase string', () => {
      const result = capitalizeFirstLetter('hello');
      expect(result).toBe('Hello');
    });

    it('should maintain capitalization of already capitalized string', () => {
      const result = capitalizeFirstLetter('Hello');
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = capitalizeFirstLetter('');
      expect(result).toBe('');
    });

    it('should handle single character string', () => {
      const result = capitalizeFirstLetter('a');
      expect(result).toBe('A');
    });

    it('should handle single uppercase character', () => {
      const result = capitalizeFirstLetter('A');
      expect(result).toBe('A');
    });

    it('should capitalize first letter and keep rest unchanged', () => {
      const result = capitalizeFirstLetter('hELLO wORLD');
      expect(result).toBe('HELLO wORLD');
    });

    it('should handle strings with numbers', () => {
      const result = capitalizeFirstLetter('123abc');
      expect(result).toBe('123abc');
    });

    it('should handle strings starting with special characters', () => {
      const result = capitalizeFirstLetter('!hello');
      expect(result).toBe('!hello');
    });

    it('should handle strings with whitespace at start', () => {
      const result = capitalizeFirstLetter(' hello');
      expect(result).toBe(' hello');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const result = capitalizeFirstLetter(longString);
      expect(result).toBe('A' + 'a'.repeat(999));
      expect(result.length).toBe(1000);
    });

    it('should handle strings with unicode characters', () => {
      const result = capitalizeFirstLetter('çhello');
      expect(result).toBe('Çhello');
    });

    it('should be type-safe and return string', () => {
      const result = capitalizeFirstLetter('test');
      expect(typeof result).toBe('string');
    });

    it('should handle null-like inputs gracefully when cast to string', () => {
      // These would be edge cases if the function receives unexpected input
      const result1 = capitalizeFirstLetter(String(null));
      const result2 = capitalizeFirstLetter(String(undefined));
      expect(result1).toBe('Null');
      expect(result2).toBe('Undefined');
    });

    it('should maintain immutability - not modify original string', () => {
      const original = 'hello';
      const result = capitalizeFirstLetter(original);
      expect(original).toBe('hello'); // Original unchanged
      expect(result).toBe('Hello');   // Result is changed
      expect(original !== result).toBe(true);
    });
  });
});