import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'feed-saved';

function readInitial() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed);
    return new Set();
  } catch {
    return new Set();
  }
}

export function useSaved() {
  const [saved, setSaved] = useState(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [saved]);

  const toggleSave = useCallback((id) => {
    if (!id) return;
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => saved.has(id), [saved]);

  return { saved, toggleSave, isSaved };
}
