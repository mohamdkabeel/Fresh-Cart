import { describe, it, expect } from 'vitest';
import SortStrategy from './sortingStrategies';

const products = [
  { title: 'Laptop', price: 999, ratingsAverage: 4.5 },
  { title: 'Phone', price: 499, ratingsAverage: 4.8 },
  { title: 'Tablet', price: 699, ratingsAverage: 3.9 },
  { title: 'Watch', price: 199, ratingsAverage: 4.2 },
];

describe('SortStrategy', () => {
  describe('apply()', () => {
    it('returns products in original order for "default" key', () => {
      const sorted = SortStrategy.apply('default', products);
      expect(sorted.map((p) => p.title)).toEqual(['Laptop', 'Phone', 'Tablet', 'Watch']);
    });

    it('sorts by ascending price for "lp" key', () => {
      const sorted = SortStrategy.apply('lp', products);
      expect(sorted.map((p) => p.price)).toEqual([199, 499, 699, 999]);
    });

    it('sorts by descending price for "hp" key', () => {
      const sorted = SortStrategy.apply('hp', products);
      expect(sorted.map((p) => p.price)).toEqual([999, 699, 499, 199]);
    });

    it('sorts by ascending rating for "lr" key', () => {
      const sorted = SortStrategy.apply('lr', products);
      expect(sorted.map((p) => p.ratingsAverage)).toEqual([3.9, 4.2, 4.5, 4.8]);
    });

    it('sorts by descending rating for "hr" key', () => {
      const sorted = SortStrategy.apply('hr', products);
      expect(sorted.map((p) => p.ratingsAverage)).toEqual([4.8, 4.5, 4.2, 3.9]);
    });

    it('falls back to "default" for an unknown key', () => {
      const sorted = SortStrategy.apply('nonexistent', products);
      expect(sorted.map((p) => p.title)).toEqual(['Laptop', 'Phone', 'Tablet', 'Watch']);
    });

    it('does not mutate the original array', () => {
      const copy = [...products];
      SortStrategy.apply('lp', products);
      expect(products).toEqual(copy);
    });

    it('handles an empty array', () => {
      expect(SortStrategy.apply('lp', [])).toEqual([]);
    });

    it('handles a single-element array', () => {
      const single = [{ price: 10, ratingsAverage: 5 }];
      expect(SortStrategy.apply('hp', single)).toEqual(single);
    });
  });

  describe('keys', () => {
    it('exposes all strategy keys', () => {
      expect(SortStrategy.keys).toContain('default');
      expect(SortStrategy.keys).toContain('lp');
      expect(SortStrategy.keys).toContain('hp');
      expect(SortStrategy.keys).toContain('lr');
      expect(SortStrategy.keys).toContain('hr');
    });

    it('has exactly 5 strategies', () => {
      expect(SortStrategy.keys).toHaveLength(5);
    });
  });
});
