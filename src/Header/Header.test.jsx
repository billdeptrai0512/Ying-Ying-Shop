import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from './main';
import { AuthProvider } from '../public/authContext';

// Header's banner links home and Path reads useAuth, so it needs a router + auth.
const renderHeader = () =>
    render(
        <MemoryRouter>
            <AuthProvider>
                <Header />
            </AuthProvider>
        </MemoryRouter>
    );

describe('Header', () => {

    it('shows the shop name', () => {
        renderHeader();
        expect(screen.getByRole('link', { name: /YING YING COSPLAY SHOP/ })).toBeInTheDocument();
    });

    it('shows the tagline', () => {
        renderHeader();
        expect(screen.getByText(/Tự phối seifuku theo style của bạn!/)).toBeInTheDocument();
    });
});
