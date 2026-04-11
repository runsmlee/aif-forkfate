import '@testing-library/jest-dom';

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

// Patch React.act for React 19 + @testing-library/react compatibility
const React = require('react');
if (typeof React.act !== 'function') {
  // Use ReactDOM's internal act mechanism via flushSync
  const ReactDOM = require('react-dom');

  React.act = function act(callback: () => unknown): unknown {
    const flushSync = ReactDOM.flushSync;
    let result: unknown;
    flushSync(() => {
      result = callback();
    });
    return result;
  };
}
