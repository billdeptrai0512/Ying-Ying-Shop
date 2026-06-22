import { describe, it, expect } from 'vitest';
import { validateOrder } from './form/placeOrder';

const valid = {
    date: '15', month: '6', year: '2026',
    name: 'An', phone: '0987654321', address: 'Hanoi',
};
const cart = [{ total: 50000 }];

const paths = (errs) => errs.map((e) => e.path);

describe('validateOrder', () => {

    it('passes a complete, valid order', () => {
        expect(validateOrder(valid, cart)).toEqual([]);
    });

    it('flags missing required fields', () => {
        const errs = validateOrder({ date: '', month: '', year: '', name: '  ', phone: '', address: '' }, cart);
        expect(paths(errs)).toEqual(expect.arrayContaining(['date', 'name', 'phone', 'address']));
    });

    it('rejects an impossible calendar date', () => {
        const errs = validateOrder({ ...valid, date: '31', month: '2', year: '2026' }, cart);
        expect(paths(errs)).toContain('date');
    });

    it('rejects a malformed phone number', () => {
        expect(paths(validateOrder({ ...valid, phone: '123' }, cart))).toContain('phone');
        expect(paths(validateOrder({ ...valid, phone: '098abc1234' }, cart))).toContain('phone');
    });

    it('rejects an empty cart', () => {
        expect(validateOrder(valid, []).length).toBeGreaterThan(0);
    });
});
