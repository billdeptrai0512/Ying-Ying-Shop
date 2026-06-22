import { describe, it, expect } from 'vitest';
import { getDemoImages } from './outfitLayers';

// Pins the outfit -> layer flattening shared by all four Demo components.
// The extra-accessory case is a regression guard: checkout/demo.jsx used to
// push the whole demo_image array as the image, rendering a broken <img>.

const item = (z, images) => ({ item: { demo_image: images, z_index: z } });

describe('getDemoImages', () => {

    it('skips the total key and empty sections', () => {
        expect(getDemoImages({ total: 90000, top: { item: null } })).toEqual([]);
    });

    it('emits one layer per main-section image with its z_index', () => {
        const layers = getDemoImages({ top: item(3, ['a.png']) });
        expect(layers).toEqual([{ key: 'top-0', image: 'a.png', zIndex: 3 }]);
    });

    it('layers a multi-image section, forcing the 2nd image to z-index 6', () => {
        const layers = getDemoImages({ top: item(3, ['a.png', 'b.png']) });
        expect(layers).toEqual([
            { key: 'top-0', image: 'a.png', zIndex: 3 },
            { key: 'top-1', image: 'b.png', zIndex: 6 },
        ]);
    });

    it('uses demo_image[0] for extra accessories (not the whole array)', () => {
        const layers = getDemoImages({
            extra: { neck: item(2, ['neck.png', 'extra.png']), bag: item(1, ['bag.png']) },
        });
        // a real string URL per accessory — never the array
        expect(layers).toEqual([
            { key: 'neck', image: 'neck.png', zIndex: 2 },
            { key: 'bag', image: 'bag.png', zIndex: 1 },
        ]);
        layers.forEach((l) => expect(typeof l.image).toBe('string'));
    });
});
