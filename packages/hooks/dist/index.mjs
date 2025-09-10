// src/hooks/useLocalStorage.ts
import { useState, useCallback } from "react";
function useLocalStorage(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  return [storedValue, setValue, removeValue];
}

// src/hooks/useSessionStorage.ts
import { useState as useState2, useCallback as useCallback2 } from "react";
function useSessionStorage(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;
  const [storedValue, setStoredValue] = useState2(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });
  const setValue = useCallback2(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );
  const removeValue = useCallback2(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  return [storedValue, setValue, removeValue];
}

// src/hooks/usePrevious.ts
import { useRef, useEffect } from "react";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// src/hooks/useToggle.ts
import { useCallback as useCallback3, useState as useState3 } from "react";
function useToggle(initialValue = false) {
  const [value, setValue] = useState3(initialValue);
  const toggle = useCallback3(() => setValue((prev) => !prev), []);
  const setTrue = useCallback3(() => setValue(true), []);
  const setFalse = useCallback3(() => setValue(false), []);
  return [value, toggle, setTrue, setFalse];
}

// src/hooks/useApi.ts
import { useState as useState4, useCallback as useCallback4, useRef as useRef2 } from "react";
function useApi(apiFunction, options = {}) {
  const {
    initialData = null,
    onSuccess,
    onError,
    retry = 0,
    retryDelay = 1e3
  } = options;
  const [state, setState] = useState4({
    data: initialData,
    loading: false,
    error: null
  });
  const retryCount = useRef2(0);
  const abortController = useRef2(null);
  const execute = useCallback4(
    async (...args) => {
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();
      retryCount.current = 0;
      const attemptCall = async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const data = await apiFunction(...args);
          if (!abortController.current?.signal.aborted) {
            setState({ data, loading: false, error: null });
            onSuccess?.(data);
          }
        } catch (error) {
          if (!abortController.current?.signal.aborted) {
            const apiError = error instanceof Error ? error : new Error("An error occurred");
            if (retryCount.current < retry) {
              retryCount.current++;
              setTimeout(() => {
                if (!abortController.current?.signal.aborted) {
                  attemptCall();
                }
              }, retryDelay);
            } else {
              setState((prev) => ({ ...prev, loading: false, error: apiError }));
              onError?.(apiError);
            }
          }
        }
      };
      await attemptCall();
    },
    [apiFunction, onSuccess, onError, retry, retryDelay]
  );
  const reset = useCallback4(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setState({
      data: initialData,
      loading: false,
      error: null
    });
    retryCount.current = 0;
  }, [initialData]);
  return {
    ...state,
    execute,
    reset
  };
}

// src/hooks/useDebounce.ts
import { useState as useState5, useEffect as useEffect2 } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState5(value);
  useEffect2(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/useThrottle.ts
import { useRef as useRef3, useCallback as useCallback5 } from "react";
function useThrottle(callback, delay) {
  const lastCall = useRef3(0);
  const timeoutRef = useRef3(null);
  const throttledCallback = useCallback5(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          callback(...args);
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  );
  return throttledCallback;
}

// src/hooks/useChatStream.ts
import { useState as useState6, useCallback as useCallback6 } from "react";
function useChatStream(options = {}) {
  const {
    apiEndpoint = "/api/chat",
    onError,
    onStreamStart,
    onStreamEnd
  } = options;
  const [messages, setMessages] = useState6([]);
  const [isStreaming, setIsStreaming] = useState6(false);
  const [error, setError] = useState6(null);
  const sendMessage = useCallback6(
    async (content) => {
      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setError(null);
      onStreamStart?.();
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [...messages, userMessage]
          })
        });
        if (!response.ok) throw new Error("Failed to send message");
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (done) break;
          const value = result.value;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim());
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              if (data.type === "token") {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    lastMessage.content += data.content;
                  }
                  return updated;
                });
              } else if (data.type === "error") {
                const errorMsg = data.error;
                setError(errorMsg);
                onError?.(errorMsg);
              }
            }
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsStreaming(false);
        onStreamEnd?.();
      }
    },
    [messages, apiEndpoint, onError, onStreamStart, onStreamEnd]
  );
  const clearMessages = useCallback6(() => {
    setMessages([]);
    setError(null);
  }, []);
  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearMessages
  };
}

// src/hooks/useClickOutside.ts
import { useEffect as useEffect3, useRef as useRef4 } from "react";
function useClickOutside(handler, events = ["mousedown", "touchstart"]) {
  const ref = useRef4(null);
  useEffect3(() => {
    const listener = (event) => {
      const element = ref.current;
      if (!element || element.contains(event.target)) {
        return;
      }
      handler(event);
    };
    events.forEach((event) => {
      document.addEventListener(event, listener);
    });
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [handler, events]);
  return ref;
}

// src/hooks/useKeyPress.ts
import { useState as useState7, useEffect as useEffect4 } from "react";
function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState7(false);
  useEffect4(() => {
    const downHandler = (event) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };
    const upHandler = (event) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);
  return keyPressed;
}

// src/hooks/useMediaQuery.ts
import { useState as useState8, useEffect as useEffect5 } from "react";
function useMediaQuery(query, options = {}) {
  const {
    defaultMatches = false,
    matchMedia = typeof window !== "undefined" ? window.matchMedia : void 0
  } = options;
  const [matches, setMatches] = useState8(() => {
    if (matchMedia) {
      return matchMedia(query).matches;
    }
    return defaultMatches;
  });
  useEffect5(() => {
    if (!matchMedia) {
      return;
    }
    const mediaQueryList = matchMedia(query);
    const listener = (event) => {
      setMatches(event.matches);
    };
    setMatches(mediaQueryList.matches);
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      mediaQueryList.addListener(listener);
    }
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query, matchMedia]);
  return matches;
}

// src/hooks/useWindowSize.ts
import { useState as useState9, useEffect as useEffect6 } from "react";
function useWindowSize(options = {}) {
  const {
    initialWidth = typeof window !== "undefined" ? window.innerWidth : 1200,
    initialHeight = typeof window !== "undefined" ? window.innerHeight : 800
  } = options;
  const [windowSize, setWindowSize] = useState9({
    width: initialWidth,
    height: initialHeight
  });
  useEffect6(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return windowSize;
}

// src/hooks/useIsomorphicLayoutEffect.ts
import { useEffect as useEffect7, useLayoutEffect } from "react";
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect7;

// src/hooks/useMountedState.ts
import { useCallback as useCallback7, useEffect as useEffect8, useRef as useRef5 } from "react";
function useMountedState() {
  const mountedRef = useRef5(false);
  const isMounted = useCallback7(() => mountedRef.current, []);
  useEffect8(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return isMounted;
}

// src/hooks/useUpdateEffect.ts
import { useEffect as useEffect9, useRef as useRef6 } from "react";
function useUpdateEffect(effect, deps) {
  const isFirstMount = useRef6(true);
  useEffect9(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
  }, deps);
}
export {
  useApi,
  useChatStream,
  useClickOutside,
  useDebounce,
  useIsomorphicLayoutEffect,
  useKeyPress,
  useLocalStorage,
  useMediaQuery,
  useMountedState,
  usePrevious,
  useSessionStorage,
  useThrottle,
  useToggle,
  useUpdateEffect,
  useWindowSize
};
//# sourceMappingURL=index.mjs.map