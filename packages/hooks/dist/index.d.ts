import { useEffect } from 'react';

/**
 * Type definitions for hooks package
 */
interface IUseApiOptions<T = unknown> {
    initialData?: T;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    retry?: number;
    retryDelay?: number;
}
interface IUseApiState<T = unknown> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}
interface IUseStorageOptions {
    serialize?: (value: unknown) => string;
    deserialize?: (value: string) => unknown;
}
interface IUseMediaQueryOptions {
    defaultMatches?: boolean;
    matchMedia?: (query: string) => MediaQueryList;
}
interface IUseWindowSizeOptions {
    initialWidth?: number;
    initialHeight?: number;
}

/**
 * Custom hook for managing localStorage with React state
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Serialization options
 * @returns [value, setValue, removeValue]
 */
declare function useLocalStorage<T>(key: string, initialValue: T, options?: IUseStorageOptions): [T, (value: T | ((val: T) => T)) => void, () => void];

/**
 * Custom hook for managing sessionStorage with React state
 *
 * @param key - The sessionStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Serialization options
 * @returns [value, setValue, removeValue]
 */
declare function useSessionStorage<T>(key: string, initialValue: T, options?: IUseStorageOptions): [T, (value: T | ((val: T) => T)) => void, () => void];

/**
 * Custom hook that returns the previous value of a variable
 *
 * @param value - The current value
 * @returns The previous value
 */
declare function usePrevious<T>(value: T): T | undefined;

/**
 * Custom hook for managing boolean toggle state
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns [value, toggle, setTrue, setFalse]
 */
declare function useToggle(initialValue?: boolean): [
    boolean,
    () => void,
    () => void,
    () => void
];

/**
 * Custom hook for API calls with loading, error, and retry logic
 *
 * @param apiFunction - The async function to call
 * @param options - Configuration options
 * @returns API state and execute function
 */
declare function useApi<T = unknown, P extends unknown[] = unknown[]>(apiFunction: (...args: P) => Promise<T>, options?: IUseApiOptions<T>): IUseApiState<T> & {
    execute: (...args: P) => Promise<void>;
    reset: () => void;
};

/**
 * Custom hook that debounces a value
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
declare function useDebounce<T>(value: T, delay: number): T;

/**
 * Custom hook that throttles a function call
 *
 * @param callback - The function to throttle
 * @param delay - The throttle delay in milliseconds
 * @returns The throttled function
 */
declare function useThrottle<T extends (...args: unknown[]) => unknown>(callback: T, delay: number): T;

interface IMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
interface UseChatStreamOptions {
    apiEndpoint?: string;
    onError?: (error: string) => void;
    onStreamStart?: () => void;
    onStreamEnd?: () => void;
}
interface UseChatStreamReturn {
    messages: IMessage[];
    isStreaming: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
}
declare function useChatStream(options?: UseChatStreamOptions): UseChatStreamReturn;

/**
 * Custom hook that handles click outside of a referenced element
 *
 * @param handler - Function to call when clicking outside
 * @param events - Array of events to listen for (default: ['mousedown', 'touchstart'])
 * @returns Ref to attach to the element
 */
declare function useClickOutside<T extends HTMLElement = HTMLElement>(handler: (event: Event) => void, events?: string[]): React.RefObject<T>;

/**
 * Custom hook that detects if a key is being pressed
 *
 * @param targetKey - The key to detect
 * @returns Boolean indicating if the key is pressed
 */
declare function useKeyPress(targetKey: string): boolean;

/**
 * Custom hook that tracks a CSS media query
 *
 * @param query - The media query string
 * @param options - Configuration options
 * @returns Boolean indicating if the media query matches
 */
declare function useMediaQuery(query: string, options?: IUseMediaQueryOptions): boolean;

interface IWindowSize {
    width: number;
    height: number;
}
/**
 * Custom hook that tracks window size
 *
 * @param options - Configuration options
 * @returns Object with current window width and height
 */
declare function useWindowSize(options?: IUseWindowSizeOptions): IWindowSize;

/**
 * Custom hook that uses useLayoutEffect on the client and useEffect on the server
 * This prevents hydration mismatches in SSR applications
 */
declare const useIsomorphicLayoutEffect: typeof useEffect;

/**
 * Custom hook that returns a function to check if component is still mounted
 * Useful for preventing state updates after component unmounts
 *
 * @returns Function that returns true if component is mounted
 */
declare function useMountedState(): () => boolean;

/**
 * Custom hook that runs an effect only on updates, not on initial mount
 *
 * @param effect - The effect function to run
 * @param deps - The dependency array
 */
declare function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;

export { type IUseApiOptions, type IUseApiState, type IUseMediaQueryOptions, type IUseStorageOptions, type IUseWindowSizeOptions, type UseChatStreamOptions, type UseChatStreamReturn, useApi, useChatStream, useClickOutside, useDebounce, useIsomorphicLayoutEffect, useKeyPress, useLocalStorage, useMediaQuery, useMountedState, usePrevious, useSessionStorage, useThrottle, useToggle, useUpdateEffect, useWindowSize };
