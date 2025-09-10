"use client"

// src/components/atoms/ActionButton.tsx
import { jsx } from "react/jsx-runtime";
var ActionButton = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "text-white hover:text-white/80",
    icon: "background: none border: none cursor: pointer display: flex align-items: center padding: 2px"
  };
  const sizes = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3"
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`,
      disabled: disabled || isLoading,
      ...props,
      children: isLoading ? /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : children
    }
  );
};

// src/components/atoms/AttachmentIcon.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var AttachmentIcon = ({
  className = "",
  size = 20,
  color = "#101012"
}) => {
  return /* @__PURE__ */ jsx2(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 25 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: /* @__PURE__ */ jsx2(
        "path",
        {
          d: "M21.5526 11.5475L12.537 20.5631C10.4868 22.6133 7.16265 22.6133 5.1124 20.5631C3.06214 18.5128 3.06214 15.1887 5.1124 13.1385L14.128 4.12284C15.4948 2.75601 17.7109 2.75601 19.0778 4.12284C20.4446 5.48968 20.4446 7.70576 19.0778 9.07259L10.4157 17.7346C9.73228 18.4181 8.62424 18.4181 7.94082 17.7346C7.25741 17.0512 7.25741 15.9432 7.94082 15.2598L15.5422 7.65838",
          stroke: color,
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
};

// src/components/atoms/ChatBubble.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var ChatBubble = ({
  children,
  className = "",
  onClick
}) => {
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: `inline-block px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer hover:opacity-90 ${className}`,
      onClick,
      children
    }
  );
};

// src/components/atoms/LoadingSpinner.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var LoadingSpinner = ({
  size = 20,
  color = "#3840EB"
}) => {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: "animate-spin",
      style: {
        width: size,
        height: size
      },
      children: /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 41 41", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
        /* @__PURE__ */ jsx4("rect", { x: "0.400146", y: "0.64798", width: "40", height: "40", rx: "20", fill: "#E1E2F8" }),
        /* @__PURE__ */ jsx4("path", { d: "M20.4001 10.898V13.398M20.4001 26.648V30.648M14.1501 20.648H10.6501M29.6501 20.648H28.1501M26.8573 27.1051L26.1501 26.398M27.0644 14.0638L25.6501 15.478M13.3217 27.7264L16.1501 24.898M13.5288 13.8567L15.6501 15.978", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
      ] })
    }
  );
};

// src/components/atoms/MaximizeIcon.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var MaximizeIcon = () => /* @__PURE__ */ jsx5("svg", { width: "25", height: "25", viewBox: "0 0 25 25", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx5("path", { d: "M12.4001 3.21045V21.2104M8.20015 3.21045H16.6001C18.2803 3.21045 19.1204 3.21045 19.7621 3.53743C20.3266 3.82505 20.7855 4.28399 21.0732 4.84848C21.4001 5.49021 21.4001 6.33029 21.4001 8.01045V16.4104C21.4001 18.0906 21.4001 18.9307 21.0732 19.5724C20.7855 20.1369 20.3266 20.5958 19.7621 20.8835C19.1204 21.2104 18.2803 21.2104 16.6001 21.2104H8.20015C6.51999 21.2104 5.67991 21.2104 5.03817 20.8835C4.47369 20.5958 4.01475 20.1369 3.72713 19.5724C3.40015 18.9307 3.40015 18.0906 3.40015 16.4104V8.01045C3.40015 6.33029 3.40015 5.49021 3.72713 4.84848C4.01475 4.28399 4.47369 3.82505 5.03817 3.53743C5.67991 3.21045 6.51999 3.21045 8.20015 3.21045Z", stroke: "#CCCCCC", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });

// src/components/atoms/PurpleHueSmiley.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
var PurpleHueSmiley = ({ className = "" }) => /* @__PURE__ */ jsxs2("svg", { width: "569", height: "491", viewBox: "0 0 569 491", fill: "none", xmlns: "http://www.w3.org/2000/svg", className, children: [
  /* @__PURE__ */ jsx6("g", { filter: "url(#filter1_f_5_24)", children: /* @__PURE__ */ jsx6("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M335.525 251.781C307.865 270.464 269.561 265.086 242.214 258.421C219.096 252.787 193.281 241.349 179.783 225.434C163.082 205.741 151.495 180.721 161.645 152.489C171.964 123.788 209.297 102.552 242.214 90.1604C269.4 79.9262 292.774 89.8995 317.925 93.6574C341.323 97.1536 371.464 93.6066 381.443 110.963C391.417 128.312 396.895 165.885 389.701 187.949C380.966 214.738 362.954 233.254 335.525 251.781Z", fill: "#B5B9FF" }) }),
  /* @__PURE__ */ jsx6("path", { d: "M237.282 158.233C238.987 144.503 254.405 145.935 257.112 152.703", stroke: "white", strokeWidth: "3.52669", strokeLinecap: "round" }),
  /* @__PURE__ */ jsx6("path", { d: "M311.273 142.887C313.515 131.044 331.346 136.443 331.843 143.716", stroke: "white", strokeWidth: "3.52669", strokeLinecap: "round" }),
  /* @__PURE__ */ jsx6("path", { d: "M312.839 164.434C314.192 194.666 271.1 190.83 267.942 172.104", stroke: "white", strokeWidth: "3.52669", strokeLinecap: "round" }),
  /* @__PURE__ */ jsx6("defs", { children: /* @__PURE__ */ jsxs2("filter", { id: "filter1_f_5_24", x: "57.8438", y: "-14.3225", width: "435.139", height: "378.935", filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [
    /* @__PURE__ */ jsx6("feFlood", { floodOpacity: "0", result: "BackgroundImageFix" }),
    /* @__PURE__ */ jsx6("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
    /* @__PURE__ */ jsx6("feGaussianBlur", { stdDeviation: "30.6601", result: "effect1_foregroundBlur_5_24" })
  ] }) })
] });

// src/components/atoms/PurpleHueSvg.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var PurpleHueSvg = ({
  className = "",
  style = {}
}) => {
  return /* @__PURE__ */ jsx7(
    "div",
    {
      className: `absolute ${className}`,
      style: {
        width: "392.98px",
        height: "376.55px",
        top: "-8.93px",
        left: "67.51px",
        opacity: 1,
        ...style
      },
      children: /* @__PURE__ */ jsxs3(
        "svg",
        {
          width: "569",
          height: "491",
          viewBox: "0 0 569 491",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          style: { width: "100%", height: "100%" },
          children: [
            /* @__PURE__ */ jsx7("g", { filter: "url(#filter0_f_5_24)", children: /* @__PURE__ */ jsx7(
              "path",
              {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M351.708 278.948C314.275 304.813 253.537 298.782 214.29 286.244C181.113 275.645 170.945 286.202 150.451 260.871C125.092 229.527 83.8114 200.585 95.6456 158.684C107.677 116.085 158.554 87.2104 203.977 71.3517C241.492 58.254 275.417 75.4553 311.3 83.3911C344.684 90.7741 386.969 88.0784 402.618 115.283C418.259 142.474 392.484 177.446 384.279 210.259C374.316 250.098 388.829 253.299 351.708 278.948Z",
                fill: "#CFD1FD"
              }
            ) }),
            /* @__PURE__ */ jsx7("g", { filter: "url(#filter1_f_5_24)", children: /* @__PURE__ */ jsx7(
              "path",
              {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M335.525 251.781C307.865 270.464 269.561 265.086 242.214 258.421C219.096 252.787 193.281 241.349 179.783 225.434C163.082 205.741 151.495 180.721 161.645 152.489C171.964 123.788 209.297 102.552 242.214 90.1604C269.4 79.9262 292.774 89.8995 317.925 93.6574C341.323 97.1536 371.464 93.6066 381.443 110.963C391.417 128.312 396.895 165.885 389.701 187.949C380.966 214.738 362.954 233.254 335.525 251.781Z",
                fill: "#B5B9FF"
              }
            ) }),
            /* @__PURE__ */ jsx7(
              "path",
              {
                d: "M237.282 158.233C238.987 144.503 254.405 145.935 257.112 152.703",
                stroke: "white",
                strokeWidth: "3.52669",
                strokeLinecap: "round"
              }
            ),
            /* @__PURE__ */ jsx7(
              "path",
              {
                d: "M311.273 142.887C313.515 131.044 331.346 136.443 331.843 143.716",
                stroke: "white",
                strokeWidth: "3.52669",
                strokeLinecap: "round"
              }
            ),
            /* @__PURE__ */ jsx7(
              "path",
              {
                d: "M312.839 164.434C314.192 194.666 271.1 190.83 267.942 172.104",
                stroke: "white",
                strokeWidth: "3.52669",
                strokeLinecap: "round"
              }
            ),
            /* @__PURE__ */ jsxs3("defs", { children: [
              /* @__PURE__ */ jsxs3("filter", { id: "filter0_f_5_24", x: "-100.006", y: "-126.982", width: "701.131", height: "617.55", filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [
                /* @__PURE__ */ jsx7("feFlood", { floodOpacity: "0", result: "BackgroundImageFix" }),
                /* @__PURE__ */ jsx7("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
                /* @__PURE__ */ jsx7("feGaussianBlur", { stdDeviation: "96.7834", result: "effect1_foregroundBlur_5_24" })
              ] }),
              /* @__PURE__ */ jsxs3("filter", { id: "filter1_f_5_24", x: "57.8438", y: "-14.3225", width: "435.139", height: "378.935", filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [
                /* @__PURE__ */ jsx7("feFlood", { floodOpacity: "0", result: "BackgroundImageFix" }),
                /* @__PURE__ */ jsx7("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
                /* @__PURE__ */ jsx7("feGaussianBlur", { stdDeviation: "30.6601", result: "effect1_foregroundBlur_5_24" })
              ] })
            ] })
          ]
        }
      )
    }
  );
};

// src/components/atoms/ResizeIcon.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
var ResizeIcon = () => /* @__PURE__ */ jsx8("svg", { width: "25", height: "25", viewBox: "0 0 25 25", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx8("path", { d: "M10.4001 10.2104L3.40015 3.21045M3.40015 3.21045H9.40015M3.40015 3.21045V9.21045M14.4001 14.2104L21.4001 21.2104M21.4001 21.2104H15.4001M21.4001 21.2104L21.4001 15.2104", stroke: "#CCCCCC", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });

// src/components/atoms/SendIcon.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var SendIcon = ({
  className = "",
  size = 20,
  color = "black"
}) => {
  return /* @__PURE__ */ jsx9(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 25 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className,
      children: /* @__PURE__ */ jsx9(
        "path",
        {
          d: "M21.6821 12.648H5.40057M5.31592 12.9395L2.981 19.9142C2.79756 20.4622 2.70585 20.7361 2.77167 20.9048C2.82883 21.0514 2.95159 21.1624 3.10307 21.2047C3.27751 21.2534 3.54097 21.1348 4.06791 20.8977L20.7794 13.3776C21.2937 13.1461 21.5509 13.0304 21.6304 12.8696C21.6994 12.73 21.6994 12.5661 21.6304 12.4264C21.5509 12.2656 21.2937 12.1499 20.7794 11.9185L4.06208 4.39574C3.53674 4.15933 3.27406 4.04113 3.0998 4.08962C2.94846 4.13173 2.82571 4.24252 2.76835 4.38876C2.70231 4.55715 2.79305 4.83053 2.97452 5.37729L5.31657 12.4335C5.34774 12.5274 5.36332 12.5744 5.36947 12.6224C5.37493 12.665 5.37488 12.7082 5.36931 12.7508C5.36303 12.7988 5.34733 12.8457 5.31592 12.9395Z",
          stroke: color,
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
};

// src/components/atoms/SparkleIcon.tsx
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
var SparkleIcon = () => /* @__PURE__ */ jsxs4("svg", { width: "25", height: "25", viewBox: "0 0 25 25", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx10("path", { d: "M7.40015 13.7104L8.1846 15.2794C8.45009 15.8103 8.58284 16.0758 8.76018 16.3059C8.91754 16.51 9.10055 16.6931 9.3047 16.8504C9.53476 17.0278 9.80025 17.1605 10.3312 17.426L11.9001 18.2104L10.3312 18.9949C9.80025 19.2604 9.53476 19.3931 9.3047 19.5705C9.10055 19.7278 8.91754 19.9109 8.76018 20.115C8.58284 20.3451 8.45009 20.6106 8.1846 21.1415L7.40015 22.7104L6.61569 21.1415C6.3502 20.6106 6.21745 20.3451 6.04012 20.115C5.88275 19.9109 5.69974 19.7278 5.49559 19.5705C5.26553 19.3931 5.00004 19.2604 4.46906 18.9949L2.90015 18.2104L4.46906 17.426C5.00004 17.1605 5.26553 17.0278 5.49559 16.8504C5.69974 16.6931 5.88275 16.51 6.04012 16.3059C6.21745 16.0758 6.3502 15.8103 6.61569 15.2794L7.40015 13.7104Z", fill: "url(#paint0_linear_34_2317)" }),
  /* @__PURE__ */ jsx10("path", { d: "M15.9001 2.71045L17.0788 5.77487C17.3608 6.5081 17.5018 6.87471 17.7211 7.18309C17.9154 7.4564 18.1542 7.69519 18.4275 7.88953C18.7359 8.10881 19.1025 8.24982 19.8357 8.53183L22.9001 9.71045L19.8357 10.8891C19.1025 11.1711 18.7359 11.3121 18.4275 11.5314C18.1542 11.7257 17.9154 11.9645 17.7211 12.2378C17.5018 12.5462 17.3608 12.9128 17.0788 13.646L15.9001 16.7104L14.7215 13.646C14.4395 12.9128 14.2985 12.5462 14.0792 12.2378C13.8849 11.9645 13.6461 11.7257 13.3728 11.5314C13.0644 11.3121 12.6978 11.1711 11.9646 10.8891L8.90015 9.71045L11.9646 8.53183C12.6978 8.24982 13.0644 8.10881 13.3728 7.88953C13.6461 7.69519 13.8849 7.4564 14.0792 7.18309C14.2985 6.87471 14.4395 6.5081 14.7215 5.77487L15.9001 2.71045Z", fill: "url(#paint1_linear_34_2317)" }),
  /* @__PURE__ */ jsxs4("defs", { children: [
    /* @__PURE__ */ jsxs4("linearGradient", { id: "paint0_linear_34_2317", x1: "12.9001", y1: "2.71045", x2: "12.9001", y2: "22.7104", gradientUnits: "userSpaceOnUse", children: [
      /* @__PURE__ */ jsx10("stop", { stopColor: "#3840EB" }),
      /* @__PURE__ */ jsx10("stop", { offset: "1", stopColor: "white" })
    ] }),
    /* @__PURE__ */ jsxs4("linearGradient", { id: "paint1_linear_34_2317", x1: "12.9001", y1: "2.71045", x2: "12.9001", y2: "22.7104", gradientUnits: "userSpaceOnUse", children: [
      /* @__PURE__ */ jsx10("stop", { stopColor: "#3840EB" }),
      /* @__PURE__ */ jsx10("stop", { offset: "1", stopColor: "white" })
    ] })
  ] })
] });

// src/components/atoms/ZanoohLogoSvg.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
var ZanoohLogoSvg = ({
  className = "",
  style = {}
}) => {
  return /* @__PURE__ */ jsx11(
    "div",
    {
      className: `flex items-center justify-center ${className}`,
      style: {
        width: "201.37px",
        height: "19px",
        gap: "12px",
        opacity: 1,
        ...style
      },
      children: /* @__PURE__ */ jsxs5(
        "svg",
        {
          width: "203",
          height: "20",
          viewBox: "0 0 203 20",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          style: { width: "100%", height: "100%" },
          children: [
            /* @__PURE__ */ jsx11("path", { d: "M6.1236 11.1949L3.07672 11.187L3.29547 9.96048L6.16266 9.96829C6.65224 9.96829 7.10016 9.88496 7.50641 9.71829C7.91787 9.55163 8.25641 9.30163 8.52203 8.96829C8.79287 8.63496 8.95953 8.21048 9.02203 7.69485C9.07933 7.25215 9.03505 6.87194 8.88922 6.55423C8.7486 6.23131 8.52464 5.98131 8.21735 5.80423C7.91005 5.62715 7.53766 5.53079 7.10016 5.51517L4.41266 5.50735L2.65485 15.648H1.17828L3.15485 4.27298L7.13922 4.28079C7.8163 4.29642 8.41787 4.43965 8.94391 4.71048C9.47516 4.9761 9.88141 5.35892 10.1627 5.85892C10.4439 6.35892 10.5533 6.96569 10.4908 7.67923C10.4231 8.48131 10.1835 9.14277 9.77203 9.6636C9.36578 10.1844 8.84235 10.5699 8.20172 10.8199C7.5663 11.0699 6.8736 11.1949 6.1236 11.1949ZM11.182 11.562L11.2055 11.3824C11.268 10.8146 11.4086 10.2678 11.6273 9.74173C11.8513 9.21569 12.1456 8.74694 12.5102 8.33548C12.8747 7.92402 13.307 7.6011 13.807 7.36673C14.307 7.13235 14.8643 7.02298 15.4789 7.0386C16.0727 7.04902 16.5805 7.17663 17.0023 7.42142C17.4294 7.66621 17.7732 7.99173 18.0336 8.39798C18.2992 8.79902 18.4841 9.25215 18.5883 9.75735C18.6925 10.2626 18.7185 10.7834 18.6664 11.3199L18.6508 11.4995C18.5831 12.0673 18.4372 12.6115 18.2133 13.1324C17.9893 13.6532 17.6925 14.1167 17.3227 14.523C16.9581 14.9292 16.5258 15.2495 16.0258 15.4839C15.5258 15.7131 14.9711 15.8199 14.3617 15.8042C13.7732 15.7938 13.2654 15.6688 12.8383 15.4292C12.4164 15.1844 12.0753 14.8615 11.8148 14.4605C11.5544 14.0594 11.3721 13.6089 11.268 13.1089C11.1638 12.6089 11.1352 12.0933 11.182 11.562ZM12.6117 11.3824L12.5961 11.5699C12.5596 11.898 12.557 12.2391 12.5883 12.5933C12.6247 12.9475 12.7081 13.2756 12.8383 13.5777C12.9737 13.8798 13.169 14.1271 13.4242 14.3199C13.6794 14.5126 14.0102 14.6141 14.4164 14.6245C14.8487 14.635 15.2289 14.5516 15.557 14.3745C15.8852 14.1923 16.1638 13.9475 16.393 13.6402C16.6273 13.3329 16.8122 12.9917 16.9477 12.6167C17.0883 12.2417 17.182 11.8693 17.2289 11.4995L17.2445 11.3199C17.281 10.9917 17.281 10.6506 17.2445 10.2964C17.2133 9.93704 17.13 9.60371 16.9945 9.29642C16.8643 8.98392 16.6716 8.73131 16.4164 8.5386C16.1612 8.34069 15.8305 8.23652 15.4242 8.2261C14.9919 8.21048 14.6091 8.29642 14.2758 8.48392C13.9477 8.66621 13.669 8.9136 13.4398 9.2261C13.2107 9.5386 13.0258 9.88496 12.8852 10.2652C12.7497 10.6402 12.6586 11.0126 12.6117 11.3824ZM22.178 14.0777L25.4592 7.19485H26.4358L25.9827 8.65579L22.6545 15.648H21.7014L22.178 14.0777ZM21.9514 7.19485L22.5373 14.312L22.4202 15.648H21.4983L20.5842 7.19485H21.9514ZM27.2327 14.0933L30.1155 7.19485H31.5686L27.7248 15.648H26.7327L27.2327 14.0933ZM26.5998 7.19485L27.4905 14.1167L27.4436 15.648H26.5764L25.592 8.4761L25.6467 7.19485H26.5998ZM35.2442 15.8042C34.6661 15.7938 34.1635 15.6792 33.7364 15.4605C33.3145 15.2365 32.9682 14.937 32.6973 14.562C32.4317 14.1818 32.2416 13.7495 32.127 13.2652C32.0124 12.7808 31.9786 12.273 32.0255 11.7417L32.0567 11.4058C32.1088 10.8641 32.2416 10.3329 32.4552 9.81204C32.6687 9.286 32.9526 8.81204 33.3067 8.39017C33.6661 7.96829 34.088 7.63496 34.5723 7.39017C35.0619 7.14017 35.6036 7.02298 36.1973 7.0386C36.7859 7.04902 37.2755 7.17402 37.6661 7.4136C38.0567 7.65319 38.3614 7.9709 38.5802 8.36673C38.8041 8.75735 38.9499 9.19746 39.0177 9.68704C39.0854 10.1714 39.0906 10.6688 39.0333 11.1792L38.9473 11.8277H32.8145L33.002 10.648L37.6817 10.6558L37.7052 10.5308C37.7572 10.1558 37.7364 9.79381 37.6427 9.44485C37.5489 9.0959 37.377 8.80944 37.127 8.58548C36.8822 8.35631 36.5515 8.23652 36.1348 8.2261C35.7026 8.21048 35.3276 8.29902 35.0098 8.49173C34.6921 8.67923 34.4265 8.93444 34.213 9.25735C33.9994 9.57506 33.8302 9.92402 33.7052 10.3042C33.5854 10.6792 33.502 11.0464 33.4552 11.4058L33.4239 11.7339C33.3927 12.0673 33.4031 12.4032 33.4552 12.7417C33.5072 13.0803 33.6062 13.3902 33.752 13.6714C33.9031 13.9475 34.1114 14.174 34.377 14.3511C34.6427 14.523 34.9708 14.6141 35.3614 14.6245C35.8354 14.635 36.2598 14.5334 36.6348 14.3199C37.0151 14.1011 37.3614 13.8251 37.6739 13.4917L38.4786 14.1792C38.2338 14.5386 37.9421 14.8407 37.6036 15.0855C37.2651 15.3303 36.8953 15.5126 36.4942 15.6324C36.0932 15.7521 35.6765 15.8094 35.2442 15.8042ZM42.7011 8.58548L41.4745 15.648H40.0605L41.5292 7.19485H42.9042L42.7011 8.58548ZM45.4433 7.12454L45.3105 8.48392C45.2011 8.46308 45.0891 8.44485 44.9745 8.42923C44.8652 8.4136 44.7558 8.40579 44.6464 8.40579C44.3079 8.40058 44.0032 8.45267 43.7323 8.56204C43.4667 8.66621 43.2297 8.81465 43.0214 9.00735C42.8183 9.20006 42.6438 9.42663 42.498 9.68704C42.3573 9.94746 42.2454 10.2287 42.162 10.5308L41.7167 10.7652C41.774 10.3433 41.8678 9.911 41.998 9.46829C42.1334 9.02558 42.3183 8.61673 42.5527 8.24173C42.7922 7.86673 43.0917 7.56465 43.4511 7.33548C43.8157 7.10631 44.2532 6.99954 44.7636 7.01517C44.8782 7.01517 44.9902 7.02558 45.0995 7.04642C45.2141 7.06725 45.3287 7.09329 45.4433 7.12454ZM48.908 15.8042C48.3298 15.7938 47.8272 15.6792 47.4002 15.4605C46.9783 15.2365 46.6319 14.937 46.3611 14.562C46.0955 14.1818 45.9054 13.7495 45.7908 13.2652C45.6762 12.7808 45.6423 12.273 45.6892 11.7417L45.7205 11.4058C45.7726 10.8641 45.9054 10.3329 46.1189 9.81204C46.3324 9.286 46.6163 8.81204 46.9705 8.39017C47.3298 7.96829 47.7517 7.63496 48.2361 7.39017C48.7257 7.14017 49.2673 7.02298 49.8611 7.0386C50.4496 7.04902 50.9392 7.17402 51.3298 7.4136C51.7205 7.65319 52.0252 7.9709 52.2439 8.36673C52.4679 8.75735 52.6137 9.19746 52.6814 9.68704C52.7491 10.1714 52.7543 10.6688 52.697 11.1792L52.6111 11.8277H46.4783L46.6658 10.648L51.3455 10.6558L51.3689 10.5308C51.421 10.1558 51.4002 9.79381 51.3064 9.44485C51.2127 9.0959 51.0408 8.80944 50.7908 8.58548C50.546 8.35631 50.2153 8.23652 49.7986 8.2261C49.3663 8.21048 48.9913 8.29902 48.6736 8.49173C48.3559 8.67923 48.0903 8.93444 47.8767 9.25735C47.6632 9.57506 47.4939 9.92402 47.3689 10.3042C47.2491 10.6792 47.1658 11.0464 47.1189 11.4058L47.0877 11.7339C47.0564 12.0673 47.0668 12.4032 47.1189 12.7417C47.171 13.0803 47.2699 13.3902 47.4158 13.6714C47.5668 13.9475 47.7752 14.174 48.0408 14.3511C48.3064 14.523 48.6345 14.6141 49.0252 14.6245C49.4991 14.635 49.9236 14.5334 50.2986 14.3199C50.6788 14.1011 51.0252 13.8251 51.3377 13.4917L52.1423 14.1792C51.8976 14.5386 51.6059 14.8407 51.2673 15.0855C50.9288 15.3303 50.559 15.5126 50.158 15.6324C49.7569 15.7521 49.3403 15.8094 48.908 15.8042ZM59.193 13.9214L60.9742 3.64798H62.3961L60.3102 15.648H59.0211L59.193 13.9214ZM54.0992 11.5777L54.1148 11.4136C54.1826 10.8928 54.3076 10.3719 54.4898 9.8511C54.6773 9.33027 54.9299 8.85371 55.2477 8.42142C55.5654 7.98913 55.9508 7.64538 56.4039 7.39017C56.857 7.13496 57.3857 7.01517 57.9898 7.03079C58.5315 7.04642 58.9846 7.17402 59.3492 7.4136C59.7138 7.65319 60.0003 7.9709 60.2086 8.36673C60.4221 8.75735 60.5654 9.18704 60.6383 9.65579C60.7164 10.1245 60.7398 10.5959 60.7086 11.0699L60.6227 11.7886C60.5341 12.2938 60.3883 12.7886 60.1852 13.273C59.982 13.7574 59.719 14.1949 59.3961 14.5855C59.0784 14.9709 58.6956 15.2756 58.2477 15.4995C57.8049 15.7235 57.2971 15.8277 56.7242 15.812C56.1721 15.7912 55.7138 15.648 55.3492 15.3824C54.9898 15.1167 54.7086 14.7756 54.5055 14.3589C54.3076 13.937 54.1773 13.4839 54.1148 12.9995C54.0576 12.51 54.0523 12.036 54.0992 11.5777ZM55.5523 11.398L55.5367 11.562C55.5003 11.8745 55.4872 12.2053 55.4977 12.5542C55.5133 12.898 55.5732 13.2235 55.6773 13.5308C55.7815 13.8329 55.9508 14.0829 56.1852 14.2808C56.4195 14.4735 56.7372 14.5777 57.1383 14.5933C57.5654 14.6037 57.9612 14.5074 58.3258 14.3042C58.6904 14.1011 59.0029 13.8303 59.2633 13.4917C59.5237 13.1532 59.7112 12.786 59.8258 12.3902L60.1305 10.4917C60.1461 10.2053 60.1122 9.93183 60.0289 9.67142C59.9456 9.40579 59.8206 9.16881 59.6539 8.96048C59.4924 8.75215 59.2919 8.58548 59.0523 8.46048C58.818 8.33027 58.5549 8.26256 58.2633 8.25735C57.8258 8.24173 57.4482 8.32767 57.1305 8.51517C56.8128 8.69746 56.5445 8.94485 56.3258 9.25735C56.1122 9.56465 55.943 9.90579 55.818 10.2808C55.693 10.6558 55.6044 11.0282 55.5523 11.398ZM68.8098 3.64798H70.2317L68.4192 14.0933L68.0286 15.648H66.7239L68.8098 3.64798ZM74.4192 11.3042L74.4036 11.4683C74.3359 11.9839 74.2109 12.4995 74.0286 13.0152C73.8515 13.5308 73.6067 14.0021 73.2942 14.4292C72.9869 14.8563 72.6093 15.1975 72.1614 15.4527C71.7187 15.7079 71.1979 15.8277 70.5989 15.812C70.0572 15.8016 69.6015 15.6766 69.2317 15.437C68.8619 15.1975 68.5703 14.885 68.3567 14.4995C68.1432 14.1089 67.9973 13.6792 67.9192 13.2105C67.8411 12.7365 67.8177 12.2626 67.8489 11.7886L67.9348 11.0699C68.0234 10.5646 68.1692 10.0699 68.3723 9.58548C68.5755 9.1011 68.8385 8.6636 69.1614 8.27298C69.4843 7.88235 69.8671 7.57506 70.3098 7.3511C70.7526 7.12194 71.2604 7.01517 71.8333 7.03079C72.4114 7.04642 72.8802 7.18704 73.2395 7.45267C73.6041 7.71829 73.8802 8.06204 74.0677 8.48392C74.2552 8.90058 74.3723 9.35631 74.4192 9.8511C74.4713 10.3459 74.4713 10.8303 74.4192 11.3042ZM72.9817 11.4605L73.0052 11.2886C73.0416 10.9761 73.0546 10.6454 73.0442 10.2964C73.0338 9.94746 72.9765 9.61933 72.8723 9.31204C72.7734 9.00475 72.6067 8.75475 72.3723 8.56204C72.1432 8.36413 71.8229 8.25996 71.4114 8.24954C71.0833 8.23913 70.7734 8.29381 70.4817 8.4136C70.1953 8.52819 69.9348 8.69225 69.7005 8.90579C69.4661 9.11413 69.2656 9.35631 69.0989 9.63235C68.9374 9.90319 68.8151 10.1896 68.7317 10.4917L68.427 12.3902C68.4166 12.7652 68.4895 13.1193 68.6458 13.4527C68.802 13.7808 69.0234 14.049 69.3098 14.2574C69.6015 14.4605 69.9401 14.5699 70.3255 14.5855C70.7578 14.6011 71.1302 14.5178 71.4427 14.3355C71.7552 14.148 72.0156 13.9006 72.2239 13.5933C72.4374 13.2808 72.6041 12.937 72.7239 12.562C72.8489 12.187 72.9348 11.8199 72.9817 11.4605ZM77.9855 14.687L81.548 7.19485H83.1105L78.1495 16.9605C78.0193 17.2365 77.8657 17.5021 77.6886 17.7574C77.5167 18.0126 77.3188 18.2417 77.0948 18.4449C76.8761 18.648 76.6287 18.8068 76.3527 18.9214C76.0766 19.036 75.7719 19.0933 75.4386 19.0933C75.298 19.0881 75.1573 19.0725 75.0167 19.0464C74.8709 19.0204 74.7303 18.9917 74.5948 18.9605L74.6808 17.773C74.7433 17.7834 74.8058 17.7912 74.8683 17.7964C74.9308 17.8068 74.9907 17.8146 75.048 17.8199C75.3969 17.8303 75.6964 17.7808 75.9464 17.6714C76.2016 17.562 76.4204 17.4006 76.6027 17.187C76.7902 16.9735 76.9568 16.7183 77.1027 16.4214L77.9855 14.687ZM77.5948 7.19485L78.6027 13.8355L78.6964 15.3277L77.6417 15.8433L76.1105 7.19485H77.5948Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M104.125 4.05575C104.753 3.42848 105.77 3.42848 106.397 4.05575L107.372 5.03119C108 5.65846 108 6.67546 107.372 7.30273L98.4348 16.2402C97.8075 16.8675 96.7905 16.8675 96.1632 16.2402L95.1878 15.2648C94.5605 14.6375 94.5605 13.6205 95.1878 12.9932L104.125 4.05575Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M96.2332 10.3921L101.52 5.10485C102.026 4.59892 101.668 3.73386 100.953 3.73386L95.6705 3.73386C95.2273 3.73385 94.8678 4.09294 94.8674 4.53619L94.8623 9.82342C94.8616 10.5393 95.7271 10.8983 96.2332 10.3921Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M106.332 9.91465L101.045 15.2019C100.539 15.7078 100.897 16.5729 101.613 16.5729L106.895 16.5729C107.338 16.5729 107.697 16.2138 107.698 15.7706L107.703 10.4833C107.704 9.76744 106.838 9.40845 106.332 9.91465Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M118.081 15.2381V14.4382L124.444 6.04669H118.138V5.05774H125.888V5.85762L119.496 14.2491H126.002V15.2381H118.081Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M147.578 15.2381V5.05774H148.679L154.699 13.3184V5.05774H155.743V15.2381H154.77L148.621 6.75931V15.2381H147.578Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M131.992 15.2381L136.139 5.05774H137.469L141.587 15.2381H140.386L139.128 12.0386H134.409L133.136 15.2381H131.992ZM134.795 11.0787H138.742L136.769 6.09032L134.795 11.0787Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M166.594 15.3981C167.319 15.3981 167.996 15.2624 168.625 14.9909C169.245 14.7194 169.793 14.3462 170.269 13.8711C170.737 13.3863 171.104 12.8288 171.37 12.1986C171.637 11.5587 171.771 10.8751 171.771 10.148C171.771 9.42081 171.642 8.74212 171.385 8.11191C171.118 7.472 170.751 6.91451 170.284 6.43942C169.807 5.95464 169.259 5.57652 168.639 5.30504C168.01 5.03357 167.333 4.89783 166.609 4.89783C165.837 4.89783 165.107 5.04326 164.421 5.33413C163.735 5.62499 163.148 6.03706 162.662 6.57031L163.406 7.34111C163.787 6.89512 164.264 6.55092 164.836 6.30853C165.398 6.05645 165.989 5.93041 166.609 5.93041C167.181 5.93041 167.715 6.03706 168.21 6.25036C168.696 6.46366 169.125 6.76423 169.497 7.15205C169.86 7.53018 170.146 7.97617 170.355 8.49004C170.555 8.99421 170.656 9.54686 170.656 10.148C170.656 10.7394 170.555 11.2921 170.355 11.8059C170.146 12.3198 169.86 12.7706 169.497 13.1585C169.125 13.5366 168.696 13.8323 168.21 14.0456C167.715 14.2589 167.181 14.3656 166.609 14.3656C165.932 14.3656 165.322 14.2153 164.778 13.9147C164.226 13.6142 163.782 13.2021 163.449 12.6785C163.105 12.155 162.905 11.5635 162.848 10.9042H166.437V9.91529H161.733V10.3661C161.733 11.0739 161.857 11.7332 162.104 12.344C162.352 12.9549 162.695 13.4881 163.134 13.9438C163.573 14.3995 164.087 14.7582 164.678 15.02C165.269 15.2721 165.908 15.3981 166.594 15.3981Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M182.923 15.3981C182.199 15.3981 181.522 15.2672 180.893 15.0055C180.273 14.734 179.725 14.3607 179.248 13.8856C178.781 13.4008 178.414 12.8434 178.147 12.2131C177.89 11.5732 177.761 10.8848 177.761 10.148C177.761 9.41112 177.89 8.72758 178.147 8.09737C178.414 7.45746 178.781 6.89996 179.248 6.42488C179.725 5.9401 180.273 5.56682 180.893 5.30504C181.522 5.03357 182.199 4.89783 182.923 4.89783C183.638 4.89783 184.305 5.03357 184.925 5.30504C185.554 5.56682 186.102 5.9401 186.569 6.42488C187.046 6.89996 187.413 7.45746 187.671 8.09737C187.937 8.72758 188.071 9.41112 188.071 10.148C188.071 10.8848 187.937 11.5732 187.671 12.2131C187.413 12.8434 187.046 13.4008 186.569 13.8856C186.102 14.3607 185.554 14.734 184.925 15.0055C184.305 15.2672 183.638 15.3981 182.923 15.3981ZM182.923 14.3656C183.495 14.3656 184.024 14.2589 184.51 14.0456C184.997 13.8323 185.421 13.5366 185.783 13.1585C186.155 12.7706 186.441 12.3198 186.641 11.8059C186.851 11.2921 186.956 10.7394 186.956 10.148C186.956 9.54686 186.851 8.99421 186.641 8.49004C186.441 7.97617 186.155 7.53018 185.783 7.15205C185.421 6.76423 184.997 6.46366 184.51 6.25036C184.024 6.03706 183.495 5.93041 182.923 5.93041C182.351 5.93041 181.817 6.03706 181.322 6.25036C180.835 6.46366 180.406 6.76423 180.035 7.15205C179.672 7.53018 179.386 7.97617 179.177 8.49004C178.976 8.99421 178.876 9.54201 178.876 10.1334C178.876 10.7346 178.976 11.2921 179.177 11.8059C179.386 12.3198 179.672 12.7706 180.035 13.1585C180.406 13.5366 180.835 13.8323 181.322 14.0456C181.817 14.2589 182.351 14.3656 182.923 14.3656Z", fill: "#757575" }),
            /* @__PURE__ */ jsx11("path", { d: "M194.061 15.2381V5.05774H195.162V9.60981H200.982V5.05774H202.083V15.2381H200.982V10.6133H195.162V15.2381H194.061Z", fill: "#757575" })
          ]
        }
      )
    }
  );
};

// src/components/molecules/ChatbotAvatarButton.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var MessageSvg = () => /* @__PURE__ */ jsx12("svg", { width: "30", height: "30", viewBox: "0 0 65 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx12("path", { d: "M0.400146 20.1202C0.400146 9.07448 9.35445 0.120178 20.4001 0.120178H44.2058C55.2515 0.120178 64.2058 9.07448 64.2058 20.1202V43.9258C64.2058 54.9715 55.2515 63.9258 44.2058 63.9258H0.400146V20.1202Z", fill: "white" }) });
var ChatbotAvatarButton = ({
  onClick,
  className = "",
  style = {}
}) => {
  return /* @__PURE__ */ jsx12(
    "button",
    {
      onClick,
      className: `
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg
        cursor-pointer
        ${className}
      `,
      style: {
        width: "60px",
        height: "60px",
        borderRadius: "20px",
        background: "linear-gradient(180deg, #151515 0%, #FFFFFF 727.93%)",
        padding: "8px",
        opacity: 1,
        ...style
      },
      children: /* @__PURE__ */ jsx12("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx12(MessageSvg, {}) })
    }
  );
};

// src/components/molecules/MessageBubble.tsx
import { jsx as jsx13, jsxs as jsxs6 } from "react/jsx-runtime";
var MessageBubble = ({
  message,
  isUser,
  isLoading = false,
  className = "",
  style = {}
}) => {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      className,
      style: {
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        ...style
      },
      children: /* @__PURE__ */ jsx13(
        "div",
        {
          style: {
            maxWidth: "70%",
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: isUser ? "#f4f4f4" : "transparent",
            color: "#000000",
            fontSize: "14px",
            lineHeight: "1.4",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto"
          },
          children: isLoading ? /* @__PURE__ */ jsx13("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs6("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx13(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "0ms" }
              }
            ),
            /* @__PURE__ */ jsx13(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "150ms" }
              }
            ),
            /* @__PURE__ */ jsx13(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "300ms" }
              }
            )
          ] }) }) : /* @__PURE__ */ jsx13("span", { children: message })
        }
      )
    }
  );
};

// src/components/molecules/SearchBar.tsx
import { useEffect, useRef } from "react";
import { jsx as jsx14, jsxs as jsxs7 } from "react/jsx-runtime";
var SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Write your query here...",
  disabled = false,
  isLoading = false,
  className = "",
  style = {}
}) => {
  const textareaRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled && !isLoading) {
      onSubmit();
    }
  };
  useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.style.height = "20px";
    }
  }, [value]);
  return /* @__PURE__ */ jsxs7("form", { onSubmit: handleSubmit, className, style: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    padding: "6px 12px",
    gap: "8px",
    minHeight: "40px",
    border: "1px solid #9CA3AF",
    ...style
  }, children: [
    /* @__PURE__ */ jsx14("button", { type: "button", style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "2px"
    }, children: /* @__PURE__ */ jsx14(AttachmentIcon, {}) }),
    /* @__PURE__ */ jsx14(
      "textarea",
      {
        ref: textareaRef,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        disabled: disabled || isLoading,
        rows: 1,
        style: {
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          fontSize: "13px",
          color: "#000000",
          resize: "none",
          minHeight: "20px",
          maxHeight: "60px",
          overflow: "auto"
        },
        className: "placeholder:text-gray-400 scrollbar-thin",
        onInput: (e) => {
          const textarea = e.target;
          textarea.style.height = "20px";
          const newHeight = Math.min(Math.max(textarea.scrollHeight, 20), 60);
          textarea.style.height = newHeight + "px";
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled && !isLoading) {
              handleSubmit(e);
            }
          }
        }
      }
    ),
    /* @__PURE__ */ jsx14("style", { children: `
        .scrollbar-thin::-webkit-scrollbar {
          width: 1px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 0px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      ` }),
    /* @__PURE__ */ jsx14(
      "button",
      {
        type: "submit",
        disabled: isLoading || !value.trim(),
        style: {
          background: "none",
          border: "none",
          cursor: isLoading || !value.trim() ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          padding: "2px"
        },
        children: isLoading ? /* @__PURE__ */ jsx14(LoadingSpinner, { size: 14 }) : /* @__PURE__ */ jsx14(SendIcon, {})
      }
    )
  ] });
};

// src/components/molecules/SuggestionBubbles.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
var SuggestionBubbles = ({
  suggestions,
  onSuggestionClick,
  className = "",
  style = {}
}) => {
  return /* @__PURE__ */ jsx15(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",
        ...style
      },
      className,
      children: suggestions.map((suggestion) => /* @__PURE__ */ jsx15(
        "button",
        {
          onClick: () => onSuggestionClick(suggestion),
          style: {
            backgroundColor: "#F0F0FB",
            border: "1px solid transparent",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#000000",
            cursor: "pointer",
            textAlign: "left",
            transition: "border 0.2s ease",
            width: "fit-content"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.border = "1px solid #000000";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.border = "1px solid transparent";
          },
          onFocus: (e) => {
            e.currentTarget.style.border = "1px solid #000000";
          },
          onBlur: (e) => {
            e.currentTarget.style.border = "1px solid transparent";
          },
          children: suggestion.text
        },
        suggestion.id
      ))
    }
  );
};

// src/components/organisms/CategorySuggestions.tsx
import { jsx as jsx16, jsxs as jsxs8 } from "react/jsx-runtime";
var ArrowIcon = () => /* @__PURE__ */ jsx16("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx16("path", { d: "M9 18L15 12L9 6", stroke: "#4F46E5", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
var CategorySuggestions = ({
  categories,
  onCategorySelect,
  onCategoryClick,
  className = "",
  style = {},
  children,
  isExpanded = false
}) => {
  const defaultCategories = [
    { id: "1", title: "About us" },
    { id: "2", title: "Products" },
    { id: "3", title: "Orders" }
  ];
  const displayCategories = categories || defaultCategories;
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "30px",
        width: "100%",
        ...style
      },
      className,
      children: [
        displayCategories.map((category) => /* @__PURE__ */ jsxs8(
          "button",
          {
            onClick: () => {
              onCategorySelect?.(category);
              onCategoryClick?.(category.title);
            },
            style: {
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
              textAlign: "left",
              width: isExpanded ? "100%" : "390px",
              height: "120px"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.border = "1px solid #4B5563";
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.border = "1px solid #E5E7EB";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            },
            onFocus: (e) => {
              e.currentTarget.style.border = "1px solid #4B5563";
              e.currentTarget.style.backgroundColor = "#F9FAFB";
            },
            onBlur: (e) => {
              e.currentTarget.style.border = "1px solid #E5E7EB";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            },
            children: [
              /* @__PURE__ */ jsx16(
                "div",
                {
                  style: {
                    width: "90px",
                    height: "90px",
                    backgroundColor: "#D1D5DB",
                    borderRadius: "6px",
                    flexShrink: 0
                  },
                  children: category.imageUrl && /* @__PURE__ */ jsx16(
                    "img",
                    {
                      src: category.imageUrl,
                      alt: category.title,
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "6px"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs8("div", { style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                maxWidth: isExpanded ? "none" : "270px"
              }, children: [
                /* @__PURE__ */ jsx16(
                  "span",
                  {
                    style: {
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#111827",
                      lineHeight: "1.4",
                      maxWidth: "270px"
                    },
                    children: category.title
                  }
                ),
                /* @__PURE__ */ jsx16("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsxs8(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "#EEF2FF",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      color: "#5B5FED",
                      fontSize: "13px",
                      fontWeight: 500
                    },
                    children: [
                      /* @__PURE__ */ jsx16("span", { children: "Explore Category" }),
                      /* @__PURE__ */ jsx16(ArrowIcon, {})
                    ]
                  }
                ) })
              ] })
            ]
          },
          category.id
        )),
        children
      ]
    }
  );
};

// src/components/organisms/ChatbotButton.tsx
import { jsx as jsx17, jsxs as jsxs9 } from "react/jsx-runtime";
var MessageSvg2 = () => /* @__PURE__ */ jsx17("svg", { width: "35", height: "35", viewBox: "0 0 65 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx17("path", { d: "M0.400146 20.1202C0.400146 9.07448 9.35445 0.120178 20.4001 0.120178H44.2058C55.2515 0.120178 64.2058 9.07448 64.2058 20.1202V43.9258C64.2058 54.9715 55.2515 63.9258 44.2058 63.9258H0.400146V20.1202Z", fill: "white" }) });
var ChatbotButton = ({
  onClick,
  title = "Chat assistant",
  tagline = "Tagline",
  className = "",
  style = {},
  children
}) => {
  return /* @__PURE__ */ jsxs9(
    "button",
    {
      onClick,
      className: `
        w-[336px] h-[108px] 
        rounded-[24px] 
        flex items-center
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg
        cursor-pointer
        relative
        ${className}
      `,
      style: {
        padding: "8px",
        gap: "10px",
        background: "linear-gradient(180deg, #151515 0%, #FFFFFF 727.93%)",
        opacity: 1,
        borderRadius: "24px",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx17(
          "div",
          {
            className: "flex-shrink-0 flex items-center justify-center",
            style: {
              width: "45px",
              height: "45px",
              borderRadius: "12px"
            },
            children: /* @__PURE__ */ jsx17(MessageSvg2, {})
          }
        ),
        /* @__PURE__ */ jsxs9("div", { className: "flex flex-col items-start text-left flex-1", children: [
          /* @__PURE__ */ jsx17("h3", { className: "text-base font-semibold leading-tight mb-1", style: { color: "#FFFFFF" }, children: title }),
          /* @__PURE__ */ jsx17("p", { className: "text-xs", style: { color: "rgba(255, 255, 255, 0.7)" }, children: tagline })
        ] }),
        children
      ]
    }
  );
};

// src/components/SelectOptions.tsx
import { useState } from "react";
import { jsx as jsx18, jsxs as jsxs10 } from "react/jsx-runtime";
var SelectOptions = ({
  options,
  onOptionSelect,
  instructionText,
  additionalText,
  className = ""
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);
  return /* @__PURE__ */ jsxs10("div", { className, style: { marginTop: "16px", width: "100%" }, children: [
    instructionText && /* @__PURE__ */ jsx18("p", { style: {
      fontSize: "14px",
      color: "#111827",
      marginBottom: "12px",
      lineHeight: "1.4",
      whiteSpace: "normal",
      width: "100%"
    }, children: instructionText }),
    /* @__PURE__ */ jsx18("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }, children: options.map((option) => /* @__PURE__ */ jsx18(
      "button",
      {
        onClick: () => onOptionSelect(option),
        onMouseEnter: () => setHoveredOption(option.id),
        onMouseLeave: () => setHoveredOption(null),
        style: {
          backgroundColor: hoveredOption === option.id ? "#F0F0FB" : "#F4F4F4",
          border: hoveredOption === option.id ? "1px solid #4B5563" : "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontSize: "14px",
          fontWeight: 400,
          color: "#111827",
          textAlign: "center",
          outline: "none",
          width: "390px"
        },
        children: option.label
      },
      option.id
    )) }),
    additionalText && /* @__PURE__ */ jsx18("p", { style: {
      fontSize: "14px",
      color: "#111827",
      marginTop: "14px",
      lineHeight: "1.4"
    }, children: additionalText })
  ] });
};

// src/components/organisms/ChatMessage.tsx
import { Fragment, jsx as jsx19, jsxs as jsxs11 } from "react/jsx-runtime";
var ChatMessage = ({
  message,
  isUser,
  timestamp,
  isLoading = false,
  suggestions,
  categories,
  products,
  selectOptions,
  orders,
  onSuggestionClick,
  onCategoryClick,
  onProductClick,
  onViewAllProducts,
  onOptionSelect,
  onOrderClick,
  onViewAllOrders,
  isExpanded = false,
  className = "",
  style = {},
  children,
  ...props
}) => {
  return /* @__PURE__ */ jsx19(
    "div",
    {
      className: `chatbot-message ${className}`,
      style: {
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        ...style
      },
      ...props,
      children: /* @__PURE__ */ jsx19(
        "div",
        {
          style: {
            maxWidth: "70%",
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: isUser ? "#f4f4f4" : "transparent",
            color: "#000000",
            fontSize: "14px",
            lineHeight: "1.4",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto"
          },
          children: isLoading ? /* @__PURE__ */ jsx19("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs11("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx19(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "0ms" }
              }
            ),
            /* @__PURE__ */ jsx19(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "150ms" }
              }
            ),
            /* @__PURE__ */ jsx19(
              "div",
              {
                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                style: { animationDelay: "300ms" }
              }
            )
          ] }) }) : /* @__PURE__ */ jsxs11(Fragment, { children: [
            /* @__PURE__ */ jsx19("span", { children: message }),
            suggestions && onSuggestionClick && /* @__PURE__ */ jsx19(
              SuggestionBubbles,
              {
                suggestions,
                onSuggestionClick
              }
            ),
            categories && onCategoryClick && /* @__PURE__ */ jsx19(
              CategorySuggestions,
              {
                selectedCategory: "",
                onCategorySelect: onCategoryClick,
                isExpanded
              }
            ),
            products && /* @__PURE__ */ jsx19(
              ProductCards,
              {
                products,
                onProductClick,
                isExpanded
              }
            ),
            orders && /* @__PURE__ */ jsx19(
              OrderCards,
              {
                orders,
                onOrderClick,
                isExpanded
              }
            ),
            selectOptions && onOptionSelect && /* @__PURE__ */ jsx19(
              SelectOptions,
              {
                options: selectOptions.options,
                headerText: selectOptions.headerText,
                instructionText: selectOptions.instructionText,
                additionalText: selectOptions.additionalText,
                onOptionSelect
              }
            ),
            children
          ] })
        }
      )
    }
  );
};

// src/components/organisms/HeaderSection.tsx
import { X } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx20, jsxs as jsxs12 } from "react/jsx-runtime";
var HeaderSection = ({
  title = "Chat Assistant",
  tagline = "AI-Powered Helper",
  onClose,
  showCloseButton = true,
  logo,
  children
}) => {
  return /* @__PURE__ */ jsxs12(Fragment2, { children: [
    /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx20(
        "div",
        {
          className: "flex-shrink-0 flex items-center justify-center",
          style: {
            width: "54px",
            height: "54px",
            borderRadius: "20px 20px 20px 0px",
            backgroundColor: "white"
          },
          children: logo || /* @__PURE__ */ jsx20("svg", { width: "24", height: "24", viewBox: "0 0 65 64", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx20(
            "path",
            {
              d: "M0.400146 20.1202C0.400146 9.07448 9.35445 0.120178 20.4001 0.120178H44.2058C55.2515 0.120178 64.2058 9.07448 64.2058 20.1202V43.9258C64.2058 54.9715 55.2515 63.9258 44.2058 63.9258H0.400146V20.1202Z",
              fill: "white"
            }
          ) })
        }
      ),
      /* @__PURE__ */ jsxs12("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx20("h2", { style: {
          color: "#FFFFFF",
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "100%",
          marginTop: "1px"
        }, children: title }),
        /* @__PURE__ */ jsx20("p", { style: {
          color: "#FFFFFF",
          fontSize: "10px",
          fontWeight: 500,
          lineHeight: "120%",
          marginTop: "10px",
          marginLeft: "2px"
        }, children: tagline })
      ] })
    ] }),
    showCloseButton && onClose && /* @__PURE__ */ jsx20("div", { className: "flex items-start", style: { marginTop: "-12px" }, children: /* @__PURE__ */ jsx20(
      "button",
      {
        onClick: onClose,
        className: "text-white hover:text-white/80 transition-colors",
        style: { padding: "4px" },
        children: /* @__PURE__ */ jsx20(X, { size: 18, color: "white" })
      }
    ) }),
    children
  ] });
};

// src/components/organisms/MainHeader.tsx
import { X as X2 } from "lucide-react";
import { jsx as jsx21, jsxs as jsxs13 } from "react/jsx-runtime";
var MainHeader = ({
  title = "Chat Assistant",
  tagline = "AI-Powered Helper",
  onClose,
  onResize,
  showResizeIcons = true,
  children
}) => {
  return /* @__PURE__ */ jsxs13(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsx21("div", { className: "flex items-start gap-2", style: { paddingTop: "8px" }, children: showResizeIcons && /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx21(
            "div",
            {
              style: {
                transform: "scale(0.75)",
                cursor: "nwse-resize"
              },
              onMouseDown: onResize,
              children: /* @__PURE__ */ jsx21(ResizeIcon, {})
            }
          ),
          /* @__PURE__ */ jsx21("div", { style: { transform: "scale(0.75)" }, children: /* @__PURE__ */ jsx21(MaximizeIcon, {}) })
        ] }) }),
        /* @__PURE__ */ jsx21("div", { className: "flex items-center gap-2 flex-1 justify-center", style: { marginLeft: "-50px" }, children: /* @__PURE__ */ jsxs13("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx21(SparkleIcon, {}),
            /* @__PURE__ */ jsx21("h2", { style: {
              color: "#FFFFFF",
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "100%",
              marginTop: "1px"
            }, children: title })
          ] }),
          /* @__PURE__ */ jsx21("p", { style: {
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: 500,
            lineHeight: "120%",
            marginTop: "10px",
            marginLeft: "16px",
            textAlign: "center"
          }, children: tagline })
        ] }) }),
        /* @__PURE__ */ jsx21("div", { className: "flex items-start", style: { paddingTop: "8px" }, children: /* @__PURE__ */ jsx21(
          "button",
          {
            onClick: onClose,
            className: "text-white hover:text-white/80 transition-colors",
            style: { padding: "4px" },
            children: /* @__PURE__ */ jsx21(X2, { size: 18, color: "white" })
          }
        ) }),
        children
      ]
    }
  );
};

// src/components/organisms/MainInterface.tsx
import { Fragment as Fragment3, jsx as jsx22, jsxs as jsxs14 } from "react/jsx-runtime";
var MainInterface = ({
  questionText = "What can I help you with today?",
  suggestions = [
    { id: "1", text: "Top relevant suggestions" },
    { id: "2", text: "Top Some other suggestion relevant suggestions" },
    { id: "3", text: "Third suggestion" }
  ],
  onSuggestionClick,
  className = "",
  style = {},
  children
}) => {
  return /* @__PURE__ */ jsxs14(Fragment3, { children: [
    /* @__PURE__ */ jsx22("div", { style: { padding: "20px", width: "100%", boxSizing: "border-box" }, children: /* @__PURE__ */ jsx22(
      "div",
      {
        style: {
          backgroundColor: "#F4F4F4",
          borderRadius: "12px",
          padding: "12px 24px 24px 24px",
          width: "100%",
          boxSizing: "border-box"
        },
        children: /* @__PURE__ */ jsxs14("div", { style: { textAlign: "left", marginTop: "20px" }, children: [
          /* @__PURE__ */ jsx22(
            "p",
            {
              style: {
                color: "#000000",
                fontSize: "15px",
                fontWeight: 600,
                margin: 0,
                marginBottom: "12px"
              },
              children: "Hi There,"
            }
          ),
          /* @__PURE__ */ jsx22(
            "p",
            {
              style: {
                color: "#000000",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                margin: 0
              },
              children: "I am Chat assistant. I am here to help you with whatever you need"
            }
          )
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxs14("div", { style: {
      position: "absolute",
      bottom: "70px",
      left: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      alignItems: "flex-start"
    }, children: [
      /* @__PURE__ */ jsx22(
        "p",
        {
          style: {
            color: "#000000",
            fontSize: "14px",
            fontWeight: 400,
            margin: 0
          },
          children: questionText
        }
      ),
      suggestions && suggestions.length > 0 && onSuggestionClick && /* @__PURE__ */ jsx22(
        SuggestionBubbles,
        {
          suggestions,
          onSuggestionClick
        }
      )
    ] }),
    children
  ] });
};

// src/components/organisms/MessageList.tsx
import React5 from "react";

// src/components/organisms/ProductCards.tsx
import { useState as useState2, useRef as useRef2 } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jsx as jsx23, jsxs as jsxs15 } from "react/jsx-runtime";
var ArrowIcon2 = () => /* @__PURE__ */ jsx23("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx23("path", { d: "M7 17L17 7M17 7H7M17 7V17", stroke: "#6B7280", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
var ViewAllArrow = () => /* @__PURE__ */ jsx23("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx23("path", { d: "M9 18L15 12L9 6", stroke: "#4F46E5", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
var ProductCards = ({
  products = [
    { id: "1", productNumber: "DEMO-001", name: "Premium Package", title: "Premium Package", description: "Best value for teams", price: "$99/mo" },
    { id: "2", productNumber: "DEMO-002", name: "Starter Package", title: "Starter Package", description: "Perfect for individuals", price: "$29/mo" }
  ],
  onProductClick,
  onViewAll,
  className = "",
  style = {},
  children,
  isExpanded = false
}) => {
  const [hoveredCard, setHoveredCard] = useState2(null);
  const [showAll, setShowAll] = useState2(false);
  const scrollContainerRef = useRef2(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxs15("div", { className: `${className}`, style: { marginTop: "16px", width: "100%", ...style }, children: [
    /* @__PURE__ */ jsx23("div", { style: { width: "100%" }, children: /* @__PURE__ */ jsxs15(
      "div",
      {
        ref: scrollContainerRef,
        style: {
          display: "flex",
          flexDirection: isExpanded || showAll ? "column" : "row",
          gap: "12px",
          overflowX: isExpanded || showAll ? "visible" : "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "4px",
          width: "100%",
          transition: showAll ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
        },
        className: "hide-scrollbar",
        children: [
          /* @__PURE__ */ jsx23("style", { children: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .card-animate {
              animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
          ` }),
          products.map((product) => /* @__PURE__ */ jsxs15(
            "div",
            {
              onClick: () => onProductClick?.(product),
              onMouseEnter: () => setHoveredCard(product.id),
              onMouseLeave: () => setHoveredCard(null),
              className: showAll && !isExpanded ? "card-animate" : "",
              style: {
                flexShrink: 0,
                width: isExpanded || showAll ? "100%" : "180px",
                backgroundColor: hoveredCard === product.id ? "#F0F0FB" : "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: isExpanded || showAll ? "flex" : "block",
                flexDirection: isExpanded || showAll ? "row" : void 0,
                gap: isExpanded || showAll ? "12px" : void 0,
                padding: isExpanded || showAll ? "12px" : "0",
                animationDelay: showAll && !isExpanded ? `${products.indexOf(product) * 0.1}s` : void 0
              },
              children: [
                /* @__PURE__ */ jsxs15(
                  "div",
                  {
                    style: {
                      position: "relative",
                      width: isExpanded || showAll ? "100px" : "100%",
                      height: isExpanded || showAll ? "100px" : "180px",
                      backgroundColor: "#F3F4F6",
                      flexShrink: 0
                    },
                    children: [
                      product.imageUrl || product.image ? /* @__PURE__ */ jsx23(
                        "img",
                        {
                          src: product.imageUrl || product.image,
                          alt: product.title || product.name || "",
                          style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }
                        }
                      ) : /* @__PURE__ */ jsx23("div", { style: { width: "100%", height: "100%", backgroundColor: "#E5E7EB" } }),
                      product.productUrl && /* @__PURE__ */ jsx23(
                        "a",
                        {
                          href: product.productUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          onClick: (e) => e.stopPropagation(),
                          style: {
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "4px",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            textDecoration: "none"
                          },
                          onMouseEnter: (e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
                            e.currentTarget.style.transform = "scale(1.1)";
                          },
                          onMouseLeave: (e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                            e.currentTarget.style.transform = "scale(1)";
                          },
                          children: /* @__PURE__ */ jsx23(ArrowIcon2, {})
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs15("div", { style: { padding: "10px" }, children: [
                  /* @__PURE__ */ jsxs15(
                    "p",
                    {
                      style: {
                        fontSize: "11px",
                        color: "#6B7280",
                        marginBottom: "4px"
                      },
                      children: [
                        "Product number:",
                        product.productNumber
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx23(
                    "h3",
                    {
                      style: {
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#111827",
                        marginBottom: "6px",
                        lineHeight: "1.3",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      },
                      children: product.title || product.name
                    }
                  ),
                  /* @__PURE__ */ jsx23(
                    "p",
                    {
                      style: {
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#111827"
                      },
                      children: product.price
                    }
                  )
                ] })
              ]
            },
            product.id
          ))
        ]
      }
    ) }),
    !isExpanded && !showAll && /* @__PURE__ */ jsxs15("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "12px"
    }, children: [
      /* @__PURE__ */ jsxs15(
        "button",
        {
          onClick: () => {
            setShowAll(true);
            onViewAll?.();
          },
          style: {
            backgroundColor: "#F0F0FB",
            border: "none",
            borderRadius: "6px",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#4F46E5",
            transition: "all 0.2s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = "#E0E7FF";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "#F0F0FB";
          },
          children: [
            /* @__PURE__ */ jsx23("span", { children: "View all" }),
            /* @__PURE__ */ jsx23(ViewAllArrow, {})
          ]
        }
      ),
      products.length > 2 && /* @__PURE__ */ jsxs15("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsx23(
          "button",
          {
            onClick: scrollLeft,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              transition: "color 0.2s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#000000";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#9CA3AF";
            },
            children: /* @__PURE__ */ jsx23(ChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx23(
          "button",
          {
            onClick: scrollRight,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              transition: "color 0.2s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#000000";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#9CA3AF";
            },
            children: /* @__PURE__ */ jsx23(ChevronRight, { size: 20 })
          }
        )
      ] })
    ] }),
    !isExpanded && showAll && /* @__PURE__ */ jsx23("div", { style: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: "12px"
    }, children: /* @__PURE__ */ jsxs15(
      "button",
      {
        onClick: () => setShowAll(false),
        style: {
          backgroundColor: "#F0F0FB",
          border: "none",
          borderRadius: "6px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "#4F46E5",
          transition: "all 0.2s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "#E0E7FF";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "#F0F0FB";
        },
        children: [
          /* @__PURE__ */ jsx23("span", { children: "View less" }),
          /* @__PURE__ */ jsx23(ViewAllArrow, {})
        ]
      }
    ) }),
    children
  ] });
};

// src/components/organisms/OrderCards.tsx
import { useState as useState3, useRef as useRef3 } from "react";
import { ChevronLeft as ChevronLeft2, ChevronRight as ChevronRight2 } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";
var ViewAllArrow2 = () => /* @__PURE__ */ jsx24("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx24("path", { d: "M9 18L15 12L9 6", stroke: "#4F46E5", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
var OrderCards = ({
  orders = [
    { id: "1", orderId: "#12345", orderNumber: "#12345", status: "Delivered", orderDate: "2024-01-15", date: "2024-01-15", total: "$150.00", quantity: 2 },
    { id: "2", orderId: "#12346", orderNumber: "#12346", status: "Processing", orderDate: "2024-01-20", date: "2024-01-20", total: "$75.00", quantity: 1 }
  ],
  onOrderClick,
  onViewAll,
  className = "",
  style = {},
  children,
  isExpanded = false
}) => {
  const [hoveredCard, setHoveredCard] = useState3(null);
  const [showAll, setShowAll] = useState3(false);
  const scrollContainerRef = useRef3(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxs16("div", { className: `${className}`, style: { marginTop: "16px", width: "100%", ...style }, children: [
    /* @__PURE__ */ jsx24("div", { style: { width: "100%" }, children: /* @__PURE__ */ jsxs16(
      "div",
      {
        ref: scrollContainerRef,
        style: {
          display: "flex",
          flexDirection: isExpanded || showAll ? "column" : "row",
          gap: "16px",
          overflowX: isExpanded || showAll ? "visible" : "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "4px",
          width: "100%",
          transition: showAll ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
        },
        className: "hide-scrollbar",
        children: [
          /* @__PURE__ */ jsx24("style", { children: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .order-card-animate {
              animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
          ` }),
          orders.map((order) => /* @__PURE__ */ jsxs16(
            "div",
            {
              className: showAll && !isExpanded ? "order-card-animate" : "",
              onClick: () => onOrderClick?.(order),
              onMouseEnter: () => setHoveredCard(order.id),
              onMouseLeave: () => setHoveredCard(null),
              style: {
                flexShrink: 0,
                width: isExpanded || showAll ? "100%" : "390px",
                backgroundColor: "#FFFFFF",
                border: hoveredCard === order.id ? "1px solid #4B5563" : "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "16px 16px 16px 32px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                gap: "20px",
                alignItems: "center",
                animationDelay: showAll && !isExpanded ? `${orders.indexOf(order) * 0.1}s` : void 0
              },
              children: [
                /* @__PURE__ */ jsxs16("div", { style: { position: "relative", flexShrink: 0 }, children: [
                  /* @__PURE__ */ jsx24("div", { style: { position: "relative", width: "120px", height: "80px" }, children: order.productImages && order.productImages.length > 0 ? /* @__PURE__ */ jsxs16(Fragment4, { children: [
                    order.productImages.slice(1, 4).map((imageUrl, index) => /* @__PURE__ */ jsx24(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: `-${(index + 1) * 6}px`,
                          top: "0px",
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          overflow: "hidden",
                          zIndex: 9 - index,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                        },
                        children: /* @__PURE__ */ jsx24(
                          "img",
                          {
                            src: imageUrl,
                            alt: `Product ${index + 1}`,
                            style: {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }
                          }
                        )
                      },
                      `bg-${index}`
                    )),
                    /* @__PURE__ */ jsx24(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: "0px",
                          top: "0px",
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "2px solid #E5E7EB",
                          zIndex: 10
                        },
                        children: /* @__PURE__ */ jsx24(
                          "img",
                          {
                            src: order.productImages[0],
                            alt: "Product",
                            style: {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }
                          }
                        )
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx24(
                    "div",
                    {
                      style: {
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#E5E7EB",
                        borderRadius: "6px"
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsxs16(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        bottom: "-8px",
                        right: "-8px",
                        backgroundColor: "white",
                        color: "#000000",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "11px",
                        fontWeight: 400,
                        border: "2px solid #10B981",
                        zIndex: 15,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      },
                      children: [
                        "Qty - ",
                        order.quantity
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs16("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxs16(
                    "p",
                    {
                      style: {
                        fontSize: "13px",
                        color: "#111827",
                        marginBottom: "4px"
                      },
                      children: [
                        "Order placed on - ",
                        order.orderDate || order.date
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs16(
                    "p",
                    {
                      style: {
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#111827"
                      },
                      children: [
                        "Order ID - ",
                        order.orderId || order.orderNumber
                      ]
                    }
                  )
                ] })
              ]
            },
            order.id
          ))
        ]
      }
    ) }),
    !isExpanded && !showAll && /* @__PURE__ */ jsxs16("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "16px"
    }, children: [
      /* @__PURE__ */ jsxs16(
        "button",
        {
          onClick: () => {
            setShowAll(true);
            onViewAll?.();
          },
          style: {
            backgroundColor: "#F0F0FB",
            border: "none",
            borderRadius: "6px",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#4F46E5",
            transition: "all 0.2s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = "#E0E7FF";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "#F0F0FB";
          },
          children: [
            /* @__PURE__ */ jsx24("span", { children: "View all" }),
            /* @__PURE__ */ jsx24(ViewAllArrow2, {})
          ]
        }
      ),
      orders.length > 1 && /* @__PURE__ */ jsxs16("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: scrollLeft,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              transition: "color 0.2s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#000000";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#9CA3AF";
            },
            children: /* @__PURE__ */ jsx24(ChevronLeft2, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: scrollRight,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              transition: "color 0.2s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#000000";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#9CA3AF";
            },
            children: /* @__PURE__ */ jsx24(ChevronRight2, { size: 20 })
          }
        )
      ] })
    ] }),
    !isExpanded && showAll && /* @__PURE__ */ jsx24("div", { style: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: "16px"
    }, children: /* @__PURE__ */ jsxs16(
      "button",
      {
        onClick: () => setShowAll(false),
        style: {
          backgroundColor: "#F0F0FB",
          border: "none",
          borderRadius: "6px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "#4F46E5",
          transition: "all 0.2s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "#E0E7FF";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "#F0F0FB";
        },
        children: [
          /* @__PURE__ */ jsx24("span", { children: "View less" }),
          /* @__PURE__ */ jsx24(ViewAllArrow2, {})
        ]
      }
    ) }),
    children
  ] });
};

// src/components/organisms/MessageList.tsx
import { jsx as jsx25, jsxs as jsxs17 } from "react/jsx-runtime";
var MessageList = ({
  messages,
  isLoading = false,
  className = "",
  style = {},
  children,
  onCategoryClick,
  onProductClick,
  onOrderClick,
  onViewAllProducts,
  onViewAllOrders,
  isExpanded = false
}) => {
  const [selectedCategory, setSelectedCategory] = React5.useState("");
  const messagesEndRef = React5.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  React5.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  return /* @__PURE__ */ jsxs17(
    "div",
    {
      className: `flex-1 overflow-y-auto scrollbar-thin ${className}`,
      style: {
        padding: "20px 0",
        ...style
      },
      children: [
        messages.map((message) => /* @__PURE__ */ jsxs17(React5.Fragment, { children: [
          (message.text || message.content) && /* @__PURE__ */ jsx25(
            MessageBubble,
            {
              message: message.text || message.content || "",
              isUser: message.isUser,
              timestamp: message.timestamp
            }
          ),
          message.categories && message.categories.length > 0 && !message.isUser && /* @__PURE__ */ jsx25("div", { style: { padding: "12px 16px" }, children: /* @__PURE__ */ jsx25(
            CategorySuggestions,
            {
              categories: message.categories,
              onCategorySelect: (category) => {
                setSelectedCategory(category.title);
                onCategoryClick?.(category.title);
              },
              isExpanded
            }
          ) }),
          message.products && message.products.length > 0 && !message.isUser && /* @__PURE__ */ jsx25("div", { style: { paddingLeft: "16px", paddingRight: "16px", marginTop: "-8px", marginBottom: "8px" }, children: /* @__PURE__ */ jsx25(
            ProductCards,
            {
              products: message.products,
              onProductClick,
              onViewAll: onViewAllProducts,
              isExpanded
            }
          ) }),
          message.orders && message.orders.length > 0 && !message.isUser && /* @__PURE__ */ jsx25("div", { style: { paddingLeft: "16px", paddingRight: "16px", marginTop: "-8px", marginBottom: "8px" }, children: /* @__PURE__ */ jsx25(
            OrderCards,
            {
              orders: message.orders,
              onOrderClick,
              onViewAll: onViewAllOrders,
              isExpanded
            }
          ) })
        ] }, message.id)),
        isLoading && /* @__PURE__ */ jsx25(
          MessageBubble,
          {
            message: "",
            isUser: false,
            isLoading: true
          }
        ),
        /* @__PURE__ */ jsx25("div", { ref: messagesEndRef }),
        children
      ]
    }
  );
};

// src/components/organisms/MinimizedWindow.tsx
import { jsx as jsx26, jsxs as jsxs18 } from "react/jsx-runtime";
var getPositionStyles = (position) => {
  switch (position) {
    case "bottom-right":
      return {
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999
      };
    case "bottom-left":
      return {
        position: "fixed",
        bottom: "1rem",
        left: "1rem",
        zIndex: 9999
      };
    case "top-right":
      return {
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999
      };
    case "top-left":
      return {
        position: "fixed",
        top: "1rem",
        left: "1rem",
        zIndex: 9999
      };
    default:
      return {
        position: "relative",
        zIndex: 9999
      };
  }
};
var MinimizedWindow = ({
  title = "Chat Assistant",
  tagline = "AI-Powered Helper",
  onClick,
  children,
  position = "bottom-right",
  className = "",
  style = {}
}) => {
  const positionStyles = getPositionStyles(position);
  return /* @__PURE__ */ jsxs18(
    "div",
    {
      className: `pointer-events-auto ${className}`,
      style: { ...positionStyles, ...style },
      children: [
        /* @__PURE__ */ jsx26(
          ChatbotButton,
          {
            onClick,
            title,
            tagline
          }
        ),
        children
      ]
    }
  );
};

// src/components/organisms/WelcomeScreen.tsx
import { Fragment as Fragment5, jsx as jsx27, jsxs as jsxs19 } from "react/jsx-runtime";
var WelcomeScreen = ({
  showAnimation = false,
  className = "",
  style = {},
  children
}) => {
  return /* @__PURE__ */ jsxs19(Fragment5, { children: [
    /* @__PURE__ */ jsx27(
      "div",
      {
        className,
        style: {
          width: "440px",
          height: "380px",
          marginTop: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          ...style
        },
        children: /* @__PURE__ */ jsx27(
          "div",
          {
            style: {
              animation: showAnimation ? "float 2s ease-in-out infinite, zoomPop 0.5s ease-out" : "float 2s ease-in-out infinite"
            },
            children: /* @__PURE__ */ jsx27(PurpleHueSmiley, {})
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs19(
      "div",
      {
        style: {
          textAlign: "center",
          padding: "0 40px",
          marginTop: "-120px",
          zIndex: 2,
          position: "relative"
        },
        children: [
          /* @__PURE__ */ jsx27(
            "h3",
            {
              style: {
                color: "#000000",
                fontSize: "20px",
                fontWeight: 400,
                marginBottom: "12px"
              },
              children: "Hi There,"
            }
          ),
          /* @__PURE__ */ jsx27(
            "p",
            {
              style: {
                color: "#000000",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: "24px"
              },
              children: "I am Chat assistant. I am here to help you with whatever you need"
            }
          )
        ]
      }
    ),
    children,
    /* @__PURE__ */ jsx27("style", { children: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes zoomPop {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          40% {
            transform: scale(1.25);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      ` })
  ] });
};
export {
  ActionButton,
  AttachmentIcon,
  CategorySuggestions,
  ChatBubble,
  ChatMessage,
  ChatbotAvatarButton,
  ChatbotButton,
  HeaderSection,
  LoadingSpinner,
  MainHeader,
  MainInterface,
  MaximizeIcon,
  MessageBubble,
  MessageList,
  MinimizedWindow,
  OrderCards,
  ProductCards,
  PurpleHueSmiley,
  PurpleHueSvg,
  ResizeIcon,
  SearchBar,
  SelectOptions,
  SendIcon,
  SparkleIcon,
  SuggestionBubbles,
  WelcomeScreen,
  ZanoohLogoSvg
};
//# sourceMappingURL=index.mjs.map