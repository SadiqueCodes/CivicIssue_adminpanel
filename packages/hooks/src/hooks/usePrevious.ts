import { useRef, useEffect } from 'react';

/**
 * Custom hook that returns the previous value of a variable
 * 
 * @param value - The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}