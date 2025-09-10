"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useApi: () => useApi,
  useChatStream: () => useChatStream,
  useClickOutside: () => useClickOutside,
  useDebounce: () => useDebounce,
  useIsomorphicLayoutEffect: () => useIsomorphicLayoutEffect,
  useKeyPress: () => useKeyPress,
  useLocalStorage: () => useLocalStorage,
  useMediaQuery: () => useMediaQuery,
  useMountedState: () => useMountedState,
  usePrevious: () => usePrevious,
  useSessionStorage: () => useSessionStorage,
  useThrottle: () => useThrottle,
  useToggle: () => useToggle,
  useUpdateEffect: () => useUpdateEffect,
  useWindowSize: () => useWindowSize
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useLocalStorage.ts
var import_react = require("react");
function useLocalStorage(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;
  const [storedValue, setStoredValue] = (0, import_react.useState)(() => {
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
  const setValue = (0, import_react.useCallback)(
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
  const removeValue = (0, import_react.useCallback)(() => {
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
var import_react2 = require("react");
function useSessionStorage(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;
  const [storedValue, setStoredValue] = (0, import_react2.useState)(() => {
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
  const setValue = (0, import_react2.useCallback)(
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
  const removeValue = (0, import_react2.useCallback)(() => {
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
var import_react3 = require("react");
function usePrevious(value) {
  const ref = (0, import_react3.useRef)();
  (0, import_react3.useEffect)(() => {
    ref.current = value;
  });
  return ref.current;
}

// src/hooks/useToggle.ts
var import_react4 = require("react");
function useToggle(initialValue = false) {
  const [value, setValue] = (0, import_react4.useState)(initialValue);
  const toggle = (0, import_react4.useCallback)(() => setValue((prev) => !prev), []);
  const setTrue = (0, import_react4.useCallback)(() => setValue(true), []);
  const setFalse = (0, import_react4.useCallback)(() => setValue(false), []);
  return [value, toggle, setTrue, setFalse];
}

// src/hooks/useApi.ts
var import_react5 = require("react");
function useApi(apiFunction, options = {}) {
  const {
    initialData = null,
    onSuccess,
    onError,
    retry = 0,
    retryDelay = 1e3
  } = options;
  const [state, setState] = (0, import_react5.useState)({
    data: initialData,
    loading: false,
    error: null
  });
  const retryCount = (0, import_react5.useRef)(0);
  const abortController = (0, import_react5.useRef)(null);
  const execute = (0, import_react5.useCallback)(
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
  const reset = (0, import_react5.useCallback)(() => {
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
var import_react6 = require("react");
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = (0, import_react6.useState)(value);
  (0, import_react6.useEffect)(() => {
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
var import_react7 = require("react");
function useThrottle(callback, delay) {
  const lastCall = (0, import_react7.useRef)(0);
  const timeoutRef = (0, import_react7.useRef)(null);
  const throttledCallback = (0, import_react7.useCallback)(
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
var import_react8 = require("react");
function useChatStream(options = {}) {
  const {
    apiEndpoint = "/api/chat",
    onError,
    onStreamStart,
    onStreamEnd
  } = options;
  const [messages, setMessages] = (0, import_react8.useState)([]);
  const [isStreaming, setIsStreaming] = (0, import_react8.useState)(false);
  const [error, setError] = (0, import_react8.useState)(null);
  const sendMessage = (0, import_react8.useCallback)(
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
  const clearMessages = (0, import_react8.useCallback)(() => {
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
var import_react9 = require("react");
function useClickOutside(handler, events = ["mousedown", "touchstart"]) {
  const ref = (0, import_react9.useRef)(null);
  (0, import_react9.useEffect)(() => {
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
var import_react10 = require("react");
function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = (0, import_react10.useState)(false);
  (0, import_react10.useEffect)(() => {
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
var import_react11 = require("react");
function useMediaQuery(query, options = {}) {
  const {
    defaultMatches = false,
    matchMedia = typeof window !== "undefined" ? window.matchMedia : void 0
  } = options;
  const [matches, setMatches] = (0, import_react11.useState)(() => {
    if (matchMedia) {
      return matchMedia(query).matches;
    }
    return defaultMatches;
  });
  (0, import_react11.useEffect)(() => {
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
var import_react12 = require("react");
function useWindowSize(options = {}) {
  const {
    initialWidth = typeof window !== "undefined" ? window.innerWidth : 1200,
    initialHeight = typeof window !== "undefined" ? window.innerHeight : 800
  } = options;
  const [windowSize, setWindowSize] = (0, import_react12.useState)({
    width: initialWidth,
    height: initialHeight
  });
  (0, import_react12.useEffect)(() => {
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
var import_react13 = require("react");
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react13.useLayoutEffect : import_react13.useEffect;

// src/hooks/useMountedState.ts
var import_react14 = require("react");
function useMountedState() {
  const mountedRef = (0, import_react14.useRef)(false);
  const isMounted = (0, import_react14.useCallback)(() => mountedRef.current, []);
  (0, import_react14.useEffect)(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return isMounted;
}

// src/hooks/useUpdateEffect.ts
var import_react15 = require("react");
function useUpdateEffect(effect, deps) {
  const isFirstMount = (0, import_react15.useRef)(true);
  (0, import_react15.useEffect)(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
  }, deps);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map