import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { OutfitProvider, useOutfit } from './outfitContext';

// The outfit total is the money path: it drives the price the customer pays.
// These tests pin the add / toggle-off / replace arithmetic in updateOutFit.

const wrapper = ({ children }) => <OutfitProvider>{children}</OutfitProvider>;

const item = (id, total, type = 'top') => ({ id, total, type, name: `item-${id}` });

describe('useOutfit total', () => {

    // Provider persists to sessionStorage, so reset between tests.
    beforeEach(() => sessionStorage.clear());

    it('starts at 0', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });
        expect(result.current.outFit.total).toBe(0);
    });

    it('adds an item total', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });

        act(() => result.current.updateOutFit(item(1, 50000), 'top'));

        expect(result.current.outFit.total).toBe(50000);
        expect(result.current.outFit.top.item.id).toBe(1);
    });

    it('toggles the same item back off to 0', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });

        act(() => result.current.updateOutFit(item(1, 50000), 'top'));
        act(() => result.current.updateOutFit(item(1, 50000), 'top'));

        expect(result.current.outFit.total).toBe(0);
        expect(result.current.outFit.top.item).toBeNull();
    });

    it('replaces within a section instead of stacking', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });

        act(() => result.current.updateOutFit(item(1, 50000), 'top'));
        act(() => result.current.updateOutFit(item(2, 70000), 'top'));

        expect(result.current.outFit.total).toBe(70000);
        expect(result.current.outFit.top.item.id).toBe(2);
    });

    it('sums across different sections', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });

        act(() => result.current.updateOutFit(item(1, 50000, 'top'), 'top'));
        act(() => result.current.updateOutFit(item(2, 30000, 'bottom'), 'bottom'));

        expect(result.current.outFit.total).toBe(80000);
    });

    it('handles the extra section (bag) without breaking the total', () => {
        const { result } = renderHook(() => useOutfit(), { wrapper });

        act(() => result.current.updateOutFit(item(9, 20000, 'bag'), 'extra'));
        expect(result.current.outFit.total).toBe(20000);

        act(() => result.current.updateOutFit(item(9, 20000, 'bag'), 'extra'));
        expect(result.current.outFit.total).toBe(0);
    });
});
