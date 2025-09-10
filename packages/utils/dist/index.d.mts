import { HTMLAttributes } from 'react';
import { AxiosRequestConfig } from 'axios';

/**
 * Missing exports from @de/frontends-sdk that need local implementation
 * This file provides fallback implementations for functionality not available in the current SDK
 */
declare class ChatCommandProcessor {
    private addBotMessage;
    private executeAction;
    constructor(addBotMessage: (message: string) => void, executeAction: (action: string, params?: any) => void);
    initialize(): Promise<void>;
    processMessage(message: string): Promise<{
        success: boolean;
    }>;
}
type TMessageType = 'text' | 'file' | 'image' | 'system' | 'typing' | 'user' | 'bot' | 'suggestion' | 'suggestion-outlined' | 'category-cards' | 'user-image' | 'product-suggestions' | 'order-cards';
interface IChatConfig {
    brandName: string;
    brandColor: string;
    brandIcon?: string;
    poweredByText?: string;
    poweredByIcon?: string;
    [key: string]: unknown;
}
declare const convertRelativeToAbsolute: (url: string, baseUrl: string) => string;
declare const navigateToUrl: (url: string) => void;
declare const executeWebsiteAction: (action: string, params?: any) => void;
type TWebsiteActionType = 'CLICK_TEXT' | 'ADD_TO_CART' | 'BUY_NOW' | 'TRY_ON' | 'ADD_TO_WISHLIST' | 'NAVIGATE_BACK' | 'NAVIGATE_FORWARD' | 'REFRESH_PAGE' | 'SCROLL_TO_SECTION';
interface IActionParams {
    [key: string]: any;
}
interface ISdkChatMessage {
    id: string;
    content: string;
    type: TMessageType;
    timestamp: Date;
    sender?: {
        id: string;
        name: string;
        type: 'user' | 'bot' | 'system';
    };
}
declare const processSlashCommand: (params: {
    command: string;
    userMessage: string;
    getAllLinks: () => any[];
    clearLinks: () => void;
    addBotMessage: (message: string) => void;
    pageData: any;
    sessionContext: unknown;
    convertRelativeToAbsolute: (url: string, base: string) => string;
    navigateToUrl: (url: string) => void;
}) => boolean;
declare const processDataCommand: (message: string, addBotMessage: (msg: string) => void) => boolean;
declare const processNavigation: (params: {
    userMessage: string;
    getAllLinks: () => any[];
    addBotMessage: (message: string) => void;
    pageData: any;
    sessionContext: unknown;
    convertRelativeToAbsolute: (url: string, base: string) => string;
    navigateToUrl: (url: string) => void;
}) => boolean;
declare const useChatInputManager: () => {
    setInputValue: (value: string) => void;
    setShowConversationStarters: (show: boolean) => void;
    setIsLoading: (loading: boolean) => void;
};
declare const useSessionManager: () => {
    sessionContext: {};
    pageData: {};
};
declare const useLinks: () => {
    getAllLinks: () => never[];
    clearLinks: () => void;
};
declare const useChatStateManager: () => {
    content: {
        welcomeMessage: string;
    };
    behavior: {
        enableAttachments: boolean;
        enableImagePreview: boolean;
    };
};
declare const useMessageHandlers: (setMessages: (updater: (prev: any[]) => any[]) => void) => {
    addBotMessage: (content: string, options?: any) => void;
    addUserMessage: (content: string) => void;
};

type TChatMessageType = TMessageType | 'suggestion' | 'suggestion-outlined' | 'category-cards' | 'user-image' | 'product-suggestions' | 'order-cards';
type TFeedbackType = 'good' | 'bad';
interface IMessageCard {
    title: string;
    description: string;
    icon?: string;
}
interface IMessageProduct {
    productNumber: string;
    title: string;
    description: string;
    price: string;
    imageUrl?: string;
}
interface IMessageOrderProduct {
    imageUrl?: string;
    quantity: number;
}
interface IMessageOrder {
    orderId: string;
    placedDate: string;
    products: Array<IMessageOrderProduct>;
}
interface IChatMessage {
    id: string;
    type: TChatMessageType;
    sender?: 'user' | 'bot' | 'system';
    content: string;
    imageUrl?: string;
    imageName?: string;
    cards?: Array<IMessageCard>;
    products?: Array<IMessageProduct>;
    orders?: Array<IMessageOrder>;
}
interface IImagePreview {
    url: string;
    name: string;
}

interface IChatTheme {
    backgroundGradient: {
        from: string;
        to: string;
    };
    chatWindowBackground: string;
    headerBackgroundColor?: string;
    chatButtonColor?: string;
}
interface IChatBranding {
    companyName: string;
    logoUrl?: string;
    botName?: string;
    tagline?: string;
}
interface IChatTypography {
    fontFamily: string;
    fontSize: {
        small: string;
        medium: string;
        large: string;
    };
}
interface IChatDimensions {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
}
interface IChatContent {
    welcomeMessage: string;
    inputPlaceholder: string;
    defaultMessages: Array<string>;
}
interface IChatBehavior {
    showCloseButton: boolean;
    showExpandButton: boolean;
    showColumnsButton: boolean;
    enableAttachments: boolean;
    enableImagePreview: boolean;
    autoScroll: boolean;
}
interface IChatConfiguration {
    theme: IChatTheme;
    branding: IChatBranding;
    typography: IChatTypography;
    dimensions: IChatDimensions;
    content: IChatContent;
    behavior: IChatBehavior;
}

interface IChatScreenHandlers {
    onClose?: () => void;
    onExpand?: () => void;
    onMinimize?: () => void;
    onColumns?: () => void;
    onSend?: (message: string) => void;
    onAttach?: (files: FileList | null) => void;
    onImageSend?: (imageUrl: string, imageName: string, caption?: string) => void;
    onSuggestionClick?: (content: string) => void;
    onCardClick?: (title: string) => void;
    onProductClick?: (productNumber: string) => void;
    onOrderClick?: (orderId: string) => void;
    onFeedback?: (messageId: string, feedback: TFeedbackType) => void;
}
interface IChatScreenProps extends HTMLAttributes<HTMLDivElement>, IChatScreenHandlers {
    welcomeMessage?: string;
    messages?: Array<IChatMessage>;
    config?: Partial<IChatConfiguration>;
    isExpanded?: boolean;
    showWelcomeMessage?: boolean;
    backgroundGradient?: {
        from: string;
        to: string;
    };
    padding?: string;
    children?: React.ReactNode;
}
interface IChatHeaderProps {
    onClose?: () => void;
    tagline?: string;
    logoUrl?: string;
    config?: IChatConfiguration;
    isExpanded?: boolean;
    sizeMode?: string;
}
interface IChatMessagesAreaProps {
    messages: Array<IChatMessage>;
    onSuggestionClick?: (content: string) => void;
    onCardClick?: (title: string) => void;
    onProductClick?: (productNumber: string) => void;
    onOrderClick?: (orderId: string) => void;
    onFeedback?: (messageId: string, feedback: TFeedbackType) => void;
    isCompactMode?: boolean;
    className?: string;
}
interface IChatInputAreaProps extends HTMLAttributes<HTMLDivElement> {
    onSend?: (message: string) => void;
    onAttach?: (files: FileList | null) => void;
    onImageSend?: (imageUrl: string, imageName: string, caption?: string) => void;
    placeholder?: string;
    config: Partial<IChatConfiguration>;
    previewImage?: IImagePreview | null;
    onImageCancel?: () => void;
    disabled?: boolean;
}
interface IWelcomeMessageBannerProps {
    message: string;
    config: IChatConfiguration;
}
interface IWelcomeMessageProps {
    message: string;
    config: IChatConfiguration;
}
interface IPoweredByFooterProps {
    config?: IChatConfiguration;
}

interface IURLHeaderConfig {
    headerBgColor?: string | null;
    botName?: string | null;
    tagline?: string | null;
    gradientFrom?: string | null;
    gradientTo?: string | null;
    chatButtonColor?: string | null;
}
/**
 * Merges URL parameters with default chat configuration
 */
declare const mergeUrlConfigWithDefaults: (urlConfig?: IURLHeaderConfig) => IChatConfiguration;
/**
 * Gets configuration from window.customHeaderConfig if available
 * Only applies custom config when in embedded mode
 */
declare const getUrlBasedConfig: () => IChatConfiguration;

/**
 * Enhanced API Client with Bearer Token Authentication
 * Handles all API communications with automatic token management
 */

interface IApiError {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
}
interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: IApiError;
    message?: string;
    timestamp: string;
}
interface IAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    tokenType?: 'Bearer';
}
declare class ApiClient {
    private axiosInstance;
    private baseURL;
    private tokens;
    private refreshPromise;
    constructor(baseURL?: string);
    private setupInterceptors;
    private generateRequestId;
    private formatError;
    private loadTokensFromStorage;
    private saveTokensToStorage;
    private refreshAccessToken;
    private performTokenRefresh;
    setTokens(tokens: IAuthTokens): void;
    getTokens(): IAuthTokens | null;
    clearTokens(): void;
    isAuthenticated(): boolean;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IApiResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IApiResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>>;
    stream(url: string, data?: any, onChunk?: (chunk: string) => void): Promise<void>;
    uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<IApiResponse<T>>;
    healthCheck(): Promise<boolean>;
}
declare const apiClient: ApiClient;

/**
 * Conversation Storage System
 * Handles persistent storage of conversations using localStorage with fallback
 */

interface IConversation {
    id: string;
    sessionId: string;
    userId?: string;
    title: string;
    messages: IChatMessage[];
    createdAt: string;
    updatedAt: string;
    metadata: {
        messageCount: number;
        lastMessageType: string;
        tags: string[];
    };
}
interface IConversationSummary {
    id: string;
    title: string;
    lastMessage: string;
    messageCount: number;
    updatedAt: string;
    tags: string[];
}
declare class ConversationStorage {
    private readonly STORAGE_KEY;
    private readonly SESSION_STORAGE_KEY;
    private readonly MAX_CONVERSATIONS;
    private readonly MAX_MESSAGES_PER_CONVERSATION;
    constructor();
    private initializeStorage;
    private isStorageAvailable;
    private getStoredConversations;
    private saveConversations;
    /**
     * Create a new conversation
     */
    createConversation(sessionId: string, userId?: string, title?: string): IConversation;
    /**
     * Get a conversation by ID
     */
    getConversation(conversationId: string): IConversation | null;
    /**
     * Get all conversations for a session
     */
    getConversationsBySession(sessionId: string): IConversation[];
    /**
     * Get conversation summaries for listing
     */
    getConversationSummaries(sessionId?: string): IConversationSummary[];
    /**
     * Add a message to a conversation
     */
    addMessage(conversationId: string, message: IChatMessage): boolean;
    /**
     * Update conversation metadata
     */
    updateConversation(conversationId: string, updates: Partial<IConversation>): boolean;
    /**
     * Delete a conversation
     */
    deleteConversation(conversationId: string): boolean;
    /**
     * Search messages across conversations
     */
    searchMessages(query: string, sessionId?: string): Array<{
        conversationId: string;
        conversationTitle: string;
        message: IChatMessage;
        matchScore: number;
    }>;
    /**
     * Export conversation data
     */
    exportConversation(conversationId: string): string | null;
    /**
     * Import conversation data
     */
    importConversation(conversationData: string): boolean;
    /**
     * Clear all conversations for a session
     */
    clearSession(sessionId: string): boolean;
    /**
     * Get storage stats
     */
    getStorageStats(): {
        totalConversations: number;
        totalMessages: number;
        storageSize: number;
        isStorageAvailable: boolean;
    };
}
declare const conversationStorage: ConversationStorage;

/**
 * Session Management System
 * Handles user sessions, authentication, and session persistence
 */
interface IUserSession {
    sessionId: string;
    userId?: string;
    userAgent: string;
    ipAddress?: string;
    createdAt: string;
    lastActiveAt: string;
    isActive: boolean;
    metadata: {
        conversationCount: number;
        messageCount: number;
        preferences: Record<string, unknown>;
        tags: string[];
    };
}
interface ISessionPreferences extends Record<string, unknown> {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    autoSave: boolean;
    compactMode: boolean;
    showTimestamps: boolean;
}
declare class SessionManager {
    private readonly SESSION_KEY;
    private readonly SESSION_TIMEOUT;
    private currentSession;
    constructor();
    private generateSessionId;
    private generateUserId;
    private getUserAgent;
    private isStorageAvailable;
    private getStoredSession;
    private saveSession;
    private clearStoredSession;
    private initializeSession;
    private setupSessionCleanup;
    /**
     * Create a new session
     */
    createNewSession(userId?: string): IUserSession;
    /**
     * Get current session
     */
    getCurrentSession(): IUserSession | null;
    /**
     * Get session ID
     */
    getSessionId(): string | null;
    /**
     * Get user ID
     */
    getUserId(): string | null;
    /**
     * Update session activity
     */
    updateActivity(): void;
    /**
     * Update session metadata
     */
    updateMetadata(updates: Partial<IUserSession['metadata']>): boolean;
    /**
     * Increment conversation count
     */
    incrementConversationCount(): void;
    /**
     * Increment message count
     */
    incrementMessageCount(): void;
    /**
     * Get default preferences
     */
    private getDefaultPreferences;
    /**
     * Get user preferences
     */
    getPreferences(): ISessionPreferences;
    /**
     * Update user preferences
     */
    updatePreferences(preferences: Partial<ISessionPreferences>): boolean;
    /**
     * Add session tags
     */
    addTag(tag: string): boolean;
    /**
     * Remove session tag
     */
    removeTag(tag: string): boolean;
    /**
     * End current session
     */
    endSession(): void;
    /**
     * Clear all session data
     */
    clearSession(): void;
    /**
     * Get session duration in milliseconds
     */
    getSessionDuration(): number;
    /**
     * Check if session is active
     */
    isSessionActive(): boolean;
    /**
     * Refresh session (extend timeout)
     */
    refreshSession(): boolean;
    /**
     * Export session data
     */
    exportSession(): string | null;
    /**
     * Get session statistics
     */
    getSessionStats(): {
        sessionId: string | null;
        userId: string | null;
        duration: number;
        conversationCount: number;
        messageCount: number;
        isActive: boolean;
        createdAt: string | null;
        lastActiveAt: string | null;
    };
}
declare const sessionManager: SessionManager;

/**
 * Session HTML Storage Utility
 *
 * @description
 * Client-side utility for accessing HTML data stored in browser sessionStorage.
 * Replaces the previous server-side file-based storage system.
 *
 * @features
 * - Access latest HTML data from any trigger type
 * - Retrieve specific trigger data (initial-load, final-load, agent-request)
 * - List all available HTML data entries
 * - Type-safe data access with error handling
 * - Storage cleanup and management utilities
 */
interface IHtmlMetadata {
    title: string;
    description: string;
    url: string;
    extractedAt: string;
}
interface IHtmlContent {
    headings: string[];
    paragraphs: string[];
    text: string;
}
interface IHtmlLinks {
    internal: string[];
    external: string[];
}
interface IHtmlMedia {
    images: string[];
    videos: string[];
}
interface IProcessedHtmlDataStorage {
    id: string;
    sessionId: string;
    tags: string[];
    timestamp: number;
    captureContext: string;
    trigger: string;
    metadata: IHtmlMetadata;
    content: IHtmlContent;
    links: IHtmlLinks;
    media: IHtmlMedia;
}
declare class SessionHtmlStorage {
    private static readonly STORAGE_PREFIX;
    private static readonly LATEST_KEY;
    /**
     * Get the latest HTML data from any trigger type
     */
    static getLatestHtmlData(): IProcessedHtmlDataStorage | null;
    /**
     * Get HTML data for a specific trigger type
     */
    static getHtmlDataByTrigger(trigger: string): IProcessedHtmlDataStorage | null;
    /**
     * Get all available HTML data entries
     */
    static getAllHtmlData(): {
        trigger: string;
        data: IProcessedHtmlDataStorage;
    }[];
    /**
     * Check if HTML data exists for a specific trigger
     */
    static hasHtmlData(trigger: string): boolean;
    /**
     * Get available trigger types
     */
    static getAvailableTriggers(): string[];
    /**
     * Clean up old HTML data entries (useful for memory management)
     */
    static cleanup(): void;
    /**
     * Get storage statistics
     */
    static getStorageStats(): {
        totalEntries: number;
        availableTriggers: string[];
        totalStorageSize: number;
        latestTrigger: string | null;
    };
}
declare const getLatestHtmlData: () => IProcessedHtmlDataStorage | null;
declare const getHtmlDataByTrigger: (trigger: string) => IProcessedHtmlDataStorage | null;
declare const getAllHtmlData: () => {
    trigger: string;
    data: IProcessedHtmlDataStorage;
}[];
declare const hasHtmlData: (trigger: string) => boolean;
declare const getAvailableTriggers: () => string[];
declare const cleanupHtmlData: () => void;
declare const getHtmlStorageStats: () => {
    totalEntries: number;
    availableTriggers: string[];
    totalStorageSize: number;
    latestTrigger: string | null;
};

/**
 * API Functions - Core functionality for authentication, sessions, and chat
 * Moved from @de/types to avoid circular dependencies in production
 */
declare const getCurrentAuthData: () => any | null;
declare const sendSimpleChatMessage: (message: string, sessionId?: string, apiBaseURL?: string) => Promise<any>;
declare const completeAuthenticationFlowWithDetails: (userDetails: any, apiBaseURL?: string) => Promise<any>;
declare const clearAuthenticationData: (jewelerid?: string) => boolean;
declare const createInternalUser: (userData: any, apiBaseURL?: string) => Promise<any>;
declare const createSession: (sessionData: any, authToken?: string, apiBaseURL?: string) => Promise<any>;

export { ChatCommandProcessor, type IActionParams, type IApiError, type IApiResponse, type IAuthTokens, type IChatBehavior, type IChatBranding, type IChatConfig, type IChatConfiguration, type IChatContent, type IChatDimensions, type IChatHeaderProps, type IChatInputAreaProps, type IChatMessage, type IChatMessagesAreaProps, type IChatScreenHandlers, type IChatScreenProps, type IChatTheme, type IChatTypography, type IConversation, type IConversationSummary, type IHtmlContent, type IHtmlLinks, type IHtmlMedia, type IHtmlMetadata, type IImagePreview, type IMessageCard, type IMessageOrder, type IMessageOrderProduct, type IMessageProduct, type IPoweredByFooterProps, type IProcessedHtmlDataStorage, type ISdkChatMessage, type ISessionPreferences, type IUserSession, type IWelcomeMessageBannerProps, type IWelcomeMessageProps, SessionHtmlStorage, type TChatMessageType, type TFeedbackType, type TMessageType, type TWebsiteActionType, apiClient, cleanupHtmlData, clearAuthenticationData, completeAuthenticationFlowWithDetails, conversationStorage, convertRelativeToAbsolute, createInternalUser, createSession, executeWebsiteAction, getAllHtmlData, getAvailableTriggers, getCurrentAuthData, getHtmlDataByTrigger, getHtmlStorageStats, getLatestHtmlData, getUrlBasedConfig, hasHtmlData, mergeUrlConfigWithDefaults, navigateToUrl, processDataCommand, processNavigation, processSlashCommand, sendSimpleChatMessage, sessionManager, useChatInputManager, useChatStateManager, useLinks, useMessageHandlers, useSessionManager };
