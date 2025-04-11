import { useEffect, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  delay: number = 300
): {
  debouncedValue: T;
  isDebouncing: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);

    const timeout = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}
