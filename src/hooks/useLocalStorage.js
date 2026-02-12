import { useState, useEffect } from "react";

/**
 * useLocalStorage(key, initialValue)
 * - Keeps a piece of React state in sync with localStorage.
 * - Returns [value, setValue] like useState.
 *
 * Behavior:
 * - On first render it tries to read localStorage[key]. If present, it parses JSON.
 * - If absent / parse fails, it uses initialValue.
 * - Whenever `value` changes, it writes the JSON back to localStorage.
 */

export default function useLocalStorage(key, initialValue) {
  // 1) Lazy initial state: only run the function on first render
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        // nothing stored — use initialValue directly
        return typeof initialValue === "function" ? initialValue() : initialValue;
      }
      // parse the stored JSON
      return JSON.parse(raw);
    } catch (err) {
      // If parsing fails, return initialValue (fail-safe)
      console.warn("useLocalStorage: read error for key", key, err);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  // 2) Side effect: whenever state changes, write it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.warn("useLocalStorage: write error for key", key, err);
    }
  }, [key, state]);

  // Return state + setter so it behaves like useState
  return [state, setState];
}
