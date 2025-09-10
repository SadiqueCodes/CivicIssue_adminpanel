"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  API_ENDPOINTS: () => API_ENDPOINTS,
  APP_NAME: () => APP_NAME,
  APP_VERSION: () => APP_VERSION,
  DE_TYPES: () => DE_TYPES,
  FILE_SIZE_LIMITS: () => FILE_SIZE_LIMITS,
  MESSAGE_TYPES: () => MESSAGE_TYPES,
  MessageSchema: () => MessageSchema,
  QueryProvider: () => QueryProvider,
  SUPPORTED_FILE_TYPES: () => SUPPORTED_FILE_TYPES,
  TASK_STATUS: () => TASK_STATUS,
  UserSchema: () => UserSchema,
  cn: () => cn
});
module.exports = __toCommonJS(index_exports);

// src/utils/cn.ts
var import_clsx = require("clsx");
function cn(...inputs) {
  return (0, import_clsx.clsx)(inputs);
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
var import_zod = require("zod");
var UserSchema = import_zod.z.object({
  id: import_zod.z.string(),
  email: import_zod.z.string().email(),
  name: import_zod.z.string().optional(),
  avatar: import_zod.z.string().url().optional()
});
var MessageSchema = import_zod.z.object({
  id: import_zod.z.string(),
  taskId: import_zod.z.string(),
  type: import_zod.z.enum(["user", "assistant", "system", "error"]),
  content: import_zod.z.string(),
  timestamp: import_zod.z.date()
});

// src/providers/query-provider.tsx
var import_react = __toESM(require("react"));
var import_react_query = require("@tanstack/react-query");
function QueryProvider({ children, options = {} }) {
  const {
    staleTime = 60 * 1e3,
    // 1 minute
    gcTime = 5 * 60 * 1e3,
    // 5 minutes
    retry = 1,
    refetchOnWindowFocus = false
  } = options;
  const [queryClient] = (0, import_react.useState)(
    () => new import_react_query.QueryClient({
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
  return /* @__PURE__ */ import_react.default.createElement(import_react_query.QueryClientProvider, { client: queryClient }, children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map