import { describe, it, expect } from 'vitest';
import { formatCurrency, analyzeInventory } from './money';

describe('formatCurrency', () => {
    it('groups thousands and appends đ', () => {
        expect(formatCurrency(50000)).toBe('50,000đ');
        expect(formatCurrency(1234567)).toBe('1,234,567đ');
    });

    it('treats null/0 as 0 and floors decimals', () => {
        expect(formatCurrency(null)).toBe('0đ');
        expect(formatCurrency(12345.9)).toBe('12,345đ');
    });

    it('accepts a custom symbol', () => {
        expect(formatCurrency(50000, '₫')).toBe('50,000₫');
    });
});

describe('analyzeInventory', () => {
    it('counts picked items and sums outfit totals', () => {
        const cart = [
            { top: { item: { id: 1 } }, bottom: { item: null }, total: 50000 },
            { top: { item: { id: 2 } }, extra: { bag: { item: { id: 3 } } }, total: 70000 },
        ];
        expect(analyzeInventory(cart)).toEqual({ itemCount: 3, totalSum: 120000 });
    });

    it('handles an empty cart', () => {
        expect(analyzeInventory([])).toEqual({ itemCount: 0, totalSum: 0 });
    });
});
