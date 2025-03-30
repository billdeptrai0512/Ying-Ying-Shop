import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
// import userEvent from "@testing-library/user-event";

import App from './App';

describe("App component", () => {
    it("Header include ❤ Ying Ying - Tiệm thuê đồ cosplay, seifuku ❤", () => {

      render(<App />);
      
      expect(screen.getByText("❤ Ying Ying - Tiệm thuê đồ cosplay, seifuku ❤")).toBeInTheDocument()
    });

  });

