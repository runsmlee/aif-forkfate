import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../hooks/useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light mode when no preference is stored', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);
  });

  it('reads stored preference from localStorage', () => {
    localStorage.setItem('forkfate_darkmode', 'true');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(true);
  });

  it('adds dark class to document when dark mode is enabled', () => {
    localStorage.setItem('forkfate_darkmode', 'true');
    renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when toggled off', () => {
    localStorage.setItem('forkfate_darkmode', 'true');
    const { result } = renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current[1](); // toggle
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(result.current[0]).toBe(false);
  });

  it('persists toggle to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](); // toggle on
    });

    expect(localStorage.getItem('forkfate_darkmode')).toBe('true');
    expect(result.current[0]).toBe(true);
  });
});
