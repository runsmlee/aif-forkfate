import '@testing-library/jest-dom';
import React from 'react';
import { flushSync } from 'react-dom';

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill React.act for React 19 + @testing-library/react compatibility
if (typeof (React as Record<string, unknown>).act !== 'function') {
  (React as Record<string, unknown>).act = function act(callback: () => unknown): unknown {
    let result: unknown;
    flushSync(() => {
      result = callback();
    });
    return result;
  };
}
