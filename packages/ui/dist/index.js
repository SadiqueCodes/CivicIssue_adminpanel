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
  Button: () => Button,
  DashboardLayout: () => DashboardLayout,
  DashboardSkeleton: () => DashboardSkeleton,
  Sidebar: () => Sidebar,
  SidebarItem: () => SidebarItem,
  version: () => version
});
module.exports = __toCommonJS(index_exports);

// src/components/button.tsx
var import_react = __toESM(require("react"));
var import_core = require("@de/core");
var Button = (0, import_react.forwardRef)(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    };
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8"
    };
    return /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        className: (0, import_core.cn)(baseStyles, variants[variant], sizes[size], className),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/components/dashboard-skeleton.tsx
var import_react2 = __toESM(require("react"));
function DashboardSkeleton() {
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex h-screen items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-12 w-48 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-6 w-64 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-2 pt-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-4 w-80 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-4 w-72 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-4 w-76 animate-pulse rounded bg-muted mx-auto" })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "h-12 w-32 animate-pulse rounded-lg bg-muted mx-auto mt-8" })));
}

// src/components/dashboard-layout.tsx
var import_react3 = __toESM(require("react"));
function DashboardLayout({
  children,
  sidebar,
  header,
  className = ""
}) {
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: `flex h-screen ${className}` }, sidebar && /* @__PURE__ */ import_react3.default.createElement("aside", { className: "w-64 border-r bg-card" }, sidebar), /* @__PURE__ */ import_react3.default.createElement("main", { className: "flex-1 flex flex-col" }, header && /* @__PURE__ */ import_react3.default.createElement("header", { className: "border-b px-6 py-4" }, header), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex-1 overflow-y-auto" }, children)));
}

// src/components/sidebar.tsx
var import_react4 = __toESM(require("react"));
function Sidebar({ title, subtitle, children, className = "" }) {
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: `p-4 ${className}` }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react4.default.createElement("h1", { className: "text-xl font-semibold" }, title), subtitle && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm text-muted-foreground" }, subtitle)), /* @__PURE__ */ import_react4.default.createElement("nav", { className: "space-y-2" }, children));
}
function SidebarItem({
  children,
  active = false,
  onClick,
  variant = "ghost"
}) {
  return /* @__PURE__ */ import_react4.default.createElement(
    Button,
    {
      variant: active ? "primary" : variant,
      className: "w-full justify-start",
      onClick
    },
    children
  );
}

// src/index.ts
var version = "0.1.0";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  DashboardLayout,
  DashboardSkeleton,
  Sidebar,
  SidebarItem,
  version
});
//# sourceMappingURL=index.js.map