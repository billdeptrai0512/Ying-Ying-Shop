import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
// import userEvent from "@testing-library/user-event";

import Header from './Header';

describe("Header component", () => {
    it("render title = YING YING COSPLAY SHOP", () => {

      render(<Header />);

      expect(screen.getByRole("heading").textContent).toBe("YING YING COSPLAY SHOP")
      
    });

    it("activities = Tự phối seifuku theo style của bạn! ❤", () => {

        render(<Header />);
  
        expect(screen.getByText('Tự phối seifuku theo style của bạn! ❤')).toBeInTheDocument()
        
      });

  });