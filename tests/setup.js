import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Analytics is a no-op in tests; components call window.gtag on interaction.
window.gtag = () => {};

afterEach(() => {
  cleanup();
  // Providers persist to sessionStorage; isolate tests like the app does on load.
  sessionStorage.clear();
});