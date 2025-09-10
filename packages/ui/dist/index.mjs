"use client";

// src/components/button.tsx
import React, { forwardRef } from "react";
import { cn } from "@de/core";
var Button = forwardRef(
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
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        className: cn(baseStyles, variants[variant], sizes[size], className),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/components/dashboard-skeleton.tsx
import React2 from "react";
function DashboardSkeleton() {
  return /* @__PURE__ */ React2.createElement("div", { className: "flex h-screen items-center justify-center" }, /* @__PURE__ */ React2.createElement("div", { className: "text-center space-y-4" }, /* @__PURE__ */ React2.createElement("div", { className: "h-12 w-48 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ React2.createElement("div", { className: "h-6 w-64 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ React2.createElement("div", { className: "space-y-2 pt-8" }, /* @__PURE__ */ React2.createElement("div", { className: "h-4 w-80 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ React2.createElement("div", { className: "h-4 w-72 animate-pulse rounded bg-muted mx-auto" }), /* @__PURE__ */ React2.createElement("div", { className: "h-4 w-76 animate-pulse rounded bg-muted mx-auto" })), /* @__PURE__ */ React2.createElement("div", { className: "h-12 w-32 animate-pulse rounded-lg bg-muted mx-auto mt-8" })));
}

// src/components/dashboard-layout.tsx
import React3 from "react";
function DashboardLayout({
  children,
  sidebar,
  header,
  className = ""
}) {
  return /* @__PURE__ */ React3.createElement("div", { className: `flex h-screen ${className}` }, sidebar && /* @__PURE__ */ React3.createElement("aside", { className: "w-64 border-r bg-card" }, sidebar), /* @__PURE__ */ React3.createElement("main", { className: "flex-1 flex flex-col" }, header && /* @__PURE__ */ React3.createElement("header", { className: "border-b px-6 py-4" }, header), /* @__PURE__ */ React3.createElement("div", { className: "flex-1 overflow-y-auto" }, children)));
}

// src/components/sidebar.tsx
import React4 from "react";
function Sidebar({ title, subtitle, children, className = "" }) {
  return /* @__PURE__ */ React4.createElement("div", { className: `p-4 ${className}` }, /* @__PURE__ */ React4.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React4.createElement("h1", { className: "text-xl font-semibold" }, title), subtitle && /* @__PURE__ */ React4.createElement("p", { className: "text-sm text-muted-foreground" }, subtitle)), /* @__PURE__ */ React4.createElement("nav", { className: "space-y-2" }, children));
}
function SidebarItem({
  children,
  active = false,
  onClick,
  variant = "ghost"
}) {
  return /* @__PURE__ */ React4.createElement(
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
export {
  Button,
  DashboardLayout,
  DashboardSkeleton,
  Sidebar,
  SidebarItem,
  version
};
//# sourceMappingURL=index.mjs.map