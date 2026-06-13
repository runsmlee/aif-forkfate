import { useCallback, useRef } from 'react';
import type { ManualSignals, ReliabilityScore, ManualAnalysis } from '../lib/types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'commitcasualty_history';
const MAX_HISTORY = 20;

export function useManualAnalysis() {
  const [history, setHistory] = useLocalStorage<ManualAnalysis[]>(STORAGE_KEY, []);
  const lastSavedSignals = useRef<string>('');

  const saveToHistory = useCallback(
    (score: ReliabilityScore, signals: ManualSignals) => {
      // Dedup: don't save identical signal sets repeatedly
      const signalKey = JSON.stringify(signals);
      if (signalKey === lastSavedSignals.current) return;
      lastSavedSignals.current = signalKey;

      const entry: ManualAnalysis = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        signals,
        timestamp: new Date().toISOString(),
        score,
        label: `Score ${score.total}/100 (${score.grade})`,
      };

      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
      window.aif?.track('score_computed', {
        total: score.total,
        grade: score.grade,
        signals,
      });
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    lastSavedSignals.current = '';
  }, [setHistory]);

  return {
    history,
    saveToHistory,
    clearHistory,
  };
}
