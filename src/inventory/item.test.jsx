import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListItem from './item';
import { OutfitProvider } from '../public/outfitContext';

// ListItem renders one clickable image per inventory item and reads/writes
// the picked item through OutfitProvider, so it must run inside the provider.

const inventory = [
    { id: 1, displayID: 1, image: 'A', name: 'a', total: 50000, type: 'top' },
    { id: 2, displayID: 2, image: 'B', name: 'b', total: 60000, type: 'top' },
    { id: 3, displayID: 3, image: 'C', name: 'c', total: 70000, type: 'top' },
];

const renderList = () =>
    render(
        <ListItem inventory={inventory} section="top" itemRefs={{ current: {} }} />,
        { wrapper: ({ children }) => <OutfitProvider>{children}</OutfitProvider> }
    );

describe('ListItem', () => {

    it('renders one image per inventory item', () => {
        renderList();
        expect(screen.getAllByRole('img')).toHaveLength(inventory.length);
    });

    it('marks an item selected when clicked', async () => {
        const user = userEvent.setup();
        renderList();

        // each item image sits inside its own clickable div
        await user.click(screen.getByAltText('a').parentElement);

        // selection overlays a "selected" cover image
        expect(screen.getByAltText('selectedItem')).toBeInTheDocument();
    });

    it('deselects when the same item is clicked twice', async () => {
        const user = userEvent.setup();
        renderList();

        const tile = screen.getByAltText('a').parentElement;
        await user.click(tile);
        await user.click(tile);

        expect(screen.queryByAltText('selectedItem')).not.toBeInTheDocument();
    });
});
