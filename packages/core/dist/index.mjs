"use client";

// src/utils/cn.ts
import { clsx } from "clsx";
function cn(...inputs) {
  return clsx(inputs);
}

// src/utils/constants.ts
var APP_NAME = "Digital Employee Platform";
var APP_VERSION = "0.1.0";
var API_ENDPOINTS = {
  AUTH: "/api/auth",
  CHAT: "/api/chat",
  FILES: "/api/files",
  TASKS: "/api/tasks"
};
var DE_TYPES = {
  DA: "data-analyst",
  CSR: "customer-service",
  SA: "sales-agent",
  HR: "hr-assistant"
};
var TASK_STATUS = {
  RUNNING: "running",
  COMPLETED: "completed",
  ERROR: "error",
  IDLE: "idle"
};
var MESSAGE_TYPES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
  ERROR: "error"
};
var FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,
  // 10MB
  DOCUMENT: 25 * 1024 * 1024,
  // 25MB
  MAX_FILES_PER_MESSAGE: 5
};
var SUPPORTED_FILE_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  DOCUMENTS: ["application/pdf", "text/csv", "application/vnd.ms-excel"]
};

// src/types/index.ts
import { z } from "zod";
var UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional()
});
var MessageSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  type: z.enum(["user", "assistant", "system", "error"]),
  content: z.string(),
  timestamp: z.date()
});

// src/providers/query-provider.tsx
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function QueryProvider({ children, options = {} }) {
  const {
    staleTime = 60 * 1e3,
    // 1 minute
    gcTime = 5 * 60 * 1e3,
    // 5 minutes
    retry = 1,
    refetchOnWindowFocus = false
  } = options;
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime,
          gcTime,
          retry,
          refetchOnWindowFocus
        }
      }
    })
  );
  return /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, children);
}
export {
  API_ENDPOINTS,
  APP_NAME,
  APP_VERSION,
  DE_TYPES,
  FILE_SIZE_LIMITS,
  MESSAGE_TYPES,
  MessageSchema,
  QueryProvider,
  SUPPORTED_FILE_TYPES,
  TASK_STATUS,
  UserSchema,
  cn
};
//# sourceMappingURL=index.mjs.map