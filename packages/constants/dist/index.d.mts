import { IChatConfiguration } from '@de/utils';

declare const CHAT_SCREEN_STYLES: {
    readonly CONTAINER_BASE: "flex flex-col shadow-[0px_2px_60px_0px_rgba(0,0,0,0.4)]";
    readonly CONTAINER_EXPANDED: "resize overflow-auto w-[700px] h-[750px] max-w-[min(90vw,800px)] max-h-[min(85vh,750px)] min-w-[500px] min-h-[600px]";
    readonly CONTAINER_COMPACT: "w-full max-w-[min(90vw,500px)] sm:max-w-[min(85vw,500px)] md:max-w-[min(80vw,500px)] lg:max-w-[min(75vw,500px)] xl:max-w-[min(70vw,500px)] 2xl:max-w-[500px] h-[min(90vh,600px)] sm:h-[min(85vh,750px)] md:h-[min(80vh,750px)] lg:h-[750px] max-h-[750px] min-w-[500px] min-h-[600px]";
    readonly CONTAINER_PADDING: "p-1 sm:p-1.5 md:p-2 rounded-xl sm:rounded-2xl md:rounded-[20px]";
    readonly DRAGGABLE_WINDOW_CONTAINER: "fixed border border-gray-300 shadow-2xl rounded-lg overflow-hidden bg-white z-[9999]";
    readonly DRAGGABLE_HEADER: "flex items-center justify-between bg-gray-100 p-2 cursor-move select-none border-b border-gray-200";
    readonly DRAGGABLE_TITLE: "flex items-center gap-2 text-sm font-medium text-gray-700";
    readonly DRAGGABLE_CONTROLS: "flex items-center gap-1";
    readonly DRAGGABLE_CONTENT: "flex flex-col h-full bg-white";
    readonly CHAT_AREA: "flex-1 flex flex-col min-h-0";
    readonly CHAT_WINDOW: "flex-1 flex flex-col min-h-0 rounded-xl sm:rounded-xl md:rounded-[15px] ";
    readonly MESSAGES_CONTAINER: "flex-1 flex flex-col min-h-0 relative";
    readonly MESSAGES_SCROLLABLE: "flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100";
    readonly WELCOME_MESSAGE_CONTAINER: "absolute top-0 left-0 right-0 z-10 p-1 sm:p-2 transition-all duration-500 ease-out";
    readonly WELCOME_MESSAGE_VISIBLE: "opacity-100 transform translate-y-0";
    readonly WELCOME_MESSAGE_FADING: "opacity-0 transform translate-y-[-20px]";
    readonly INPUT_AREA: "flex-shrink-0 p-1 sm:p-2 pb-0";
    readonly FOOTER_AREA: "flex-shrink-0 p-0 m-0";
};
declare const CHAT_WINDOW_SIZES: {
    readonly COMPACT: {
        readonly width: 500;
        readonly height: 600;
    };
    readonly HORIZONTAL_1: {
        readonly width: 620;
        readonly height: 600;
    };
    readonly VERTICAL_1: {
        readonly width: 620;
        readonly height: 750;
    };
    readonly HORIZONTAL_2: {
        readonly width: 680;
        readonly height: 750;
    };
    readonly VERTICAL_2: {
        readonly width: 680;
        readonly height: 750;
    };
    readonly HORIZONTAL_3: {
        readonly width: 800;
        readonly height: 750;
    };
};
type TChatWindowSize = keyof typeof CHAT_WINDOW_SIZES;
declare const CHAT_TIMING: {
    readonly WELCOME_FADE_DURATION: 500;
    readonly SCROLL_DELAY: 100;
    readonly WELCOME_PADDING_TOP: "110px";
    readonly DEFAULT_PADDING_TOP: "8px";
};
declare const CHAT_SCROLL_BEHAVIOR: {
    readonly BEHAVIOR: "smooth";
    readonly TRANSITION: "padding-top 0.5s ease-out";
};

declare const DEFAULT_CHAT_CONFIG: IChatConfiguration;

declare const CHAT_SUGGESTIONS: readonly [{
    readonly id: "order-status";
    readonly text: "Track my order status";
    readonly category: "orders";
}, {
    readonly id: "payment-billing";
    readonly text: "Help with payment or billing";
    readonly category: "billing";
}, {
    readonly id: "product-info";
    readonly text: "What are the top-selling diamond Rings?";
    readonly category: "products";
}];
declare const DEFAULT_SUGGESTIONS: ({
    readonly id: "order-status";
    readonly text: "Track my order status";
    readonly category: "orders";
} | {
    readonly id: "payment-billing";
    readonly text: "Help with payment or billing";
    readonly category: "billing";
} | {
    readonly id: "product-info";
    readonly text: "What are the top-selling diamond Rings?";
    readonly category: "products";
})[];

declare const CLASSES: {
    readonly CONTAINER: "fixed bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-12 right-4 sm:right-6 md:right-10 lg:right-12";
    readonly INTERFACE: "animate-in slide-in-from-bottom-4 fade-in duration-300 z-50";
    readonly CHAT_BAR_ACTIVE: "transition-transform duration-300 scale-95 opacity-75";
    readonly CHAT_BAR_IDLE: "transition-transform duration-300 scale-100 opacity-100";
};
declare const VIEW_MODES: {
    readonly IDLE: "idle";
    readonly CHAT: "chat";
    readonly CALL: "call";
};

export { CHAT_SCREEN_STYLES, CHAT_SCROLL_BEHAVIOR, CHAT_SUGGESTIONS, CHAT_TIMING, CHAT_WINDOW_SIZES, CLASSES, DEFAULT_CHAT_CONFIG, DEFAULT_SUGGESTIONS, type TChatWindowSize, VIEW_MODES };
