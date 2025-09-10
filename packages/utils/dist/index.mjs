// constants/chat-interface/default-config.constants.ts
var DEFAULT_CHAT_CONFIG = {
  theme: {
    backgroundGradient: {
      from: "#151515",
      to: "#FFFFFF"
    },
    chatWindowBackground: "#ffffff",
    headerBackgroundColor: "#2563eb",
    chatButtonColor: "#151518"
  },
  branding: {
    companyName: "Hi There,",
    botName: "Chat Assistant",
    tagline: "Here to help you"
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem"
    }
  },
  dimensions: {
    minWidth: 280,
    minHeight: 400,
    maxWidth: 500,
    maxHeight: 700
  },
  content: {
    welcomeMessage: "I am Chat assistant. I am here to help you with whatever you need",
    inputPlaceholder: "Write your query here...",
    defaultMessages: []
  },
  behavior: {
    showCloseButton: true,
    showExpandButton: true,
    showColumnsButton: false,
    enableAttachments: true,
    enableImagePreview: true,
    autoScroll: true
  }
};

// constants/chat-interface/chat-suggestions.constants.ts
var CHAT_SUGGESTIONS = [
  {
    id: "order-status",
    text: "Track my order status",
    category: "orders"
  },
  // {
  //   id: 'return-exchange',
  //   text: 'Return or exchange an item',
  //   category: 'returns',
  // },
  {
    id: "payment-billing",
    text: "Help with payment or billing",
    category: "billing"
  },
  {
    id: "product-info",
    text: "What are the top-selling diamond Rings?",
    category: "products"
  }
  // {
  //   id: 'shipping-delivery',
  //   text: 'Shipping and delivery options',
  //   category: 'shipping',
  // },
  // {
  //   id: 'account-help',
  //   text: 'Account settings and login issues',
  //   category: 'account',
  // },
];
var DEFAULT_SUGGESTIONS = CHAT_SUGGESTIONS.slice(0, 3);

// chat-interface/configMerger.ts
var mergeUrlConfigWithDefaults = (urlConfig) => {
  const config = { ...DEFAULT_CHAT_CONFIG };
  if (urlConfig?.headerBgColor) {
    config.theme.headerBackgroundColor = urlConfig.headerBgColor;
  }
  if (urlConfig?.botName) {
    config.branding.botName = urlConfig.botName;
  }
  if (urlConfig?.tagline) {
    config.branding.tagline = urlConfig.tagline;
  }
  if (urlConfig?.gradientFrom) {
    config.theme.backgroundGradient.from = urlConfig.gradientFrom;
  }
  if (urlConfig?.gradientTo) {
    config.theme.backgroundGradient.to = urlConfig.gradientTo;
  }
  if (urlConfig?.chatButtonColor) {
    config.theme.chatButtonColor = urlConfig.chatButtonColor;
  }
  return config;
};
var getUrlBasedConfig = () => {
  const isEmbedded = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embedded") === "true";
  if (isEmbedded && typeof window !== "undefined" && window.customHeaderConfig) {
    const mergedConfig = mergeUrlConfigWithDefaults(
      window.customHeaderConfig
    );
    return mergedConfig;
  }
  return DEFAULT_CHAT_CONFIG;
};

// lib/api-client.ts
import axios from "axios";
var ApiClient = class {
  axiosInstance;
  baseURL;
  tokens = null;
  refreshPromise = null;
  constructor(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api") {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 3e4,
      // 30 seconds
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    this.setupInterceptors();
    this.loadTokensFromStorage();
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${this.tokens.accessToken}`;
        }
        config.headers["X-Request-ID"] = this.generateRequestId();
        return config;
      },
      (error) => {
        return Promise.reject(this.formatError(error));
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.dispatchEvent(new CustomEvent("auth:token-expired"));
            return Promise.reject(this.formatError(refreshError));
          }
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  formatError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || error.message || "API request failed",
        code: error.response.data?.code || "API_ERROR",
        statusCode: error.response.status,
        details: error.response.data
      };
    }
    if (error.request) {
      return {
        message: "Network error - Unable to reach server",
        code: "NETWORK_ERROR",
        statusCode: 0,
        details: error.request
      };
    }
    return {
      message: error.message || "Unknown error occurred",
      code: "UNKNOWN_ERROR",
      statusCode: 0,
      details: error
    };
  }
  loadTokensFromStorage() {
    try {
      const stored = localStorage.getItem("ashi_widget_tokens");
      if (stored) {
        this.tokens = JSON.parse(stored);
        if (this.tokens?.expiresAt) {
          const expiresAt = new Date(this.tokens.expiresAt);
          if (expiresAt <= /* @__PURE__ */ new Date()) {
            this.clearTokens();
          }
        }
      }
    } catch (error) {
      console.error("Failed to load tokens from storage:", error);
      this.clearTokens();
    }
  }
  saveTokensToStorage() {
    try {
      if (this.tokens) {
        localStorage.setItem("ashi_widget_tokens", JSON.stringify(this.tokens));
      } else {
        localStorage.removeItem("ashi_widget_tokens");
      }
    } catch (error) {
      console.error("Failed to save tokens to storage:", error);
    }
  }
  async refreshAccessToken() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    if (!this.tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }
    this.refreshPromise = this.performTokenRefresh();
    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }
  async performTokenRefresh() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken: this.tokens?.refreshToken
      });
      const { accessToken, refreshToken, expiresAt } = response.data;
      this.tokens = {
        accessToken,
        refreshToken: refreshToken || this.tokens?.refreshToken,
        expiresAt,
        tokenType: "Bearer"
      };
      this.saveTokensToStorage();
      return accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
  // Public methods
  setTokens(tokens) {
    this.tokens = tokens;
    this.saveTokensToStorage();
  }
  getTokens() {
    return this.tokens;
  }
  clearTokens() {
    this.tokens = null;
    this.saveTokensToStorage();
  }
  isAuthenticated() {
    if (!this.tokens?.accessToken) return false;
    if (this.tokens.expiresAt) {
      const expiresAt = new Date(this.tokens.expiresAt);
      return expiresAt > /* @__PURE__ */ new Date();
    }
    return true;
  }
  // HTTP Methods
  async get(url, config) {
    try {
      const response = await this.axiosInstance.get(url, config);
      return {
        success: true,
        data: response.data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  async post(url, data, config) {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return {
        success: true,
        data: response.data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  async put(url, data, config) {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return {
        success: true,
        data: response.data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  async delete(url, config) {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return {
        success: true,
        data: response.data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  // Streaming support for chat
  async stream(url, data, onChunk) {
    try {
      const headers = {
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache"
      };
      if (this.tokens?.accessToken) {
        headers.Authorization = `Bearer ${this.tokens.accessToken}`;
      }
      const response = await fetch(`${this.baseURL}${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data2 = line.substring(6);
            if (data2.trim() && data2 !== "[DONE]") {
              onChunk?.(data2);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      throw this.formatError(error);
    }
  }
  // File upload support
  async uploadFile(url, file, onProgress) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            onProgress?.(progress);
          }
        }
      };
      const response = await this.axiosInstance.post(url, formData, config);
      return {
        success: true,
        data: response.data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
  // Health check
  async healthCheck() {
    try {
      const response = await this.get("/health");
      return response.success;
    } catch {
      return false;
    }
  }
};
var apiClient = new ApiClient();

// lib/conversation-storage.ts
var ConversationStorage = class {
  STORAGE_KEY = "ashi_widget_conversations";
  SESSION_STORAGE_KEY = "ashi_widget_current_conversations";
  MAX_CONVERSATIONS = 50;
  // Limit to prevent localStorage overflow
  MAX_MESSAGES_PER_CONVERSATION = 1e3;
  constructor() {
    if (typeof window !== "undefined") {
      this.initializeStorage();
    }
  }
  initializeStorage() {
    try {
      if (!this.isStorageAvailable()) {
        console.warn("localStorage is not available");
        return;
      }
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
      }
      const sessionStored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (!sessionStored) {
        sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({}));
      }
    } catch (error) {
      console.warn("Failed to initialize conversation storage:", error);
    }
  }
  isStorageAvailable() {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  getStoredConversations() {
    try {
      if (!this.isStorageAvailable()) return {};
      const sessionStored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      if (sessionStored) {
        const sessionConversations = JSON.parse(sessionStored);
        if (Object.keys(sessionConversations).length > 0) {
          return sessionConversations;
        }
      }
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Failed to read conversations from storage:", error);
      return {};
    }
  }
  saveConversations(conversations) {
    try {
      if (!this.isStorageAvailable()) return false;
      const conversationArray = Object.values(conversations);
      if (conversationArray.length > this.MAX_CONVERSATIONS) {
        conversationArray.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        const keepConversations = conversationArray.slice(0, this.MAX_CONVERSATIONS);
        conversations = keepConversations.reduce((acc, conv) => {
          acc[conv.id] = conv;
          return acc;
        }, {});
      }
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(conversations));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
      return true;
    } catch (error) {
      console.error("Failed to save conversations to storage:", error);
      return false;
    }
  }
  /**
   * Create a new conversation
   */
  createConversation(sessionId, userId, title) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      title: title || `Conversation ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
      metadata: {
        messageCount: 0,
        lastMessageType: "",
        tags: []
      }
    };
    const conversations = this.getStoredConversations();
    conversations[conversation.id] = conversation;
    this.saveConversations(conversations);
    return conversation;
  }
  /**
   * Get a conversation by ID
   */
  getConversation(conversationId) {
    const conversations = this.getStoredConversations();
    return conversations[conversationId] || null;
  }
  /**
   * Get all conversations for a session
   */
  getConversationsBySession(sessionId) {
    const conversations = this.getStoredConversations();
    return Object.values(conversations).filter((conv) => conv.sessionId === sessionId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  /**
   * Get conversation summaries for listing
   */
  getConversationSummaries(sessionId) {
    const conversations = this.getStoredConversations();
    let conversationList = Object.values(conversations);
    if (sessionId) {
      conversationList = conversationList.filter((conv) => conv.sessionId === sessionId);
    }
    return conversationList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((conv) => ({
      id: conv.id,
      title: conv.title,
      lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].content.slice(0, 100) + "..." : "No messages yet",
      messageCount: conv.metadata.messageCount,
      updatedAt: conv.updatedAt,
      tags: conv.metadata.tags
    }));
  }
  /**
   * Add a message to a conversation
   */
  addMessage(conversationId, message) {
    const conversations = this.getStoredConversations();
    const conversation = conversations[conversationId];
    if (!conversation) {
      console.error(`Conversation ${conversationId} not found`);
      return false;
    }
    if (conversation.messages.length >= this.MAX_MESSAGES_PER_CONVERSATION) {
      conversation.messages = conversation.messages.slice(-this.MAX_MESSAGES_PER_CONVERSATION + 1);
    }
    conversation.messages.push(message);
    conversation.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    conversation.metadata.messageCount = conversation.messages.length;
    conversation.metadata.lastMessageType = message.type;
    if (conversation.title.startsWith("Conversation ") && conversation.messages.length === 2) {
      const firstUserMessage = conversation.messages.find((m) => m.type === "user");
      if (firstUserMessage) {
        conversation.title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "");
      }
    }
    return this.saveConversations(conversations);
  }
  /**
   * Update conversation metadata
   */
  updateConversation(conversationId, updates) {
    const conversations = this.getStoredConversations();
    const conversation = conversations[conversationId];
    if (!conversation) {
      return false;
    }
    Object.assign(conversation, updates, {
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return this.saveConversations(conversations);
  }
  /**
   * Delete a conversation
   */
  deleteConversation(conversationId) {
    const conversations = this.getStoredConversations();
    if (!conversations[conversationId]) {
      return false;
    }
    delete conversations[conversationId];
    return this.saveConversations(conversations);
  }
  /**
   * Search messages across conversations
   */
  searchMessages(query, sessionId) {
    const conversations = this.getStoredConversations();
    const results = [];
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return results;
    Object.values(conversations).forEach((conversation) => {
      if (sessionId && conversation.sessionId !== sessionId) return;
      conversation.messages.forEach((message) => {
        const content = message.content.toLowerCase();
        if (content.includes(searchTerm)) {
          const exactMatch = content === searchTerm;
          const startsWith = content.startsWith(searchTerm);
          const wordMatch = content.split(" ").includes(searchTerm);
          let matchScore = 1;
          if (exactMatch) matchScore = 10;
          else if (startsWith) matchScore = 7;
          else if (wordMatch) matchScore = 5;
          else matchScore = 2;
          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            message,
            matchScore
          });
        }
      });
    });
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
  /**
   * Export conversation data
   */
  exportConversation(conversationId) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) return null;
    return JSON.stringify(conversation, null, 2);
  }
  /**
   * Import conversation data
   */
  importConversation(conversationData) {
    try {
      const conversation = JSON.parse(conversationData);
      if (!conversation.id || !conversation.sessionId || !Array.isArray(conversation.messages)) {
        throw new Error("Invalid conversation format");
      }
      const conversations = this.getStoredConversations();
      conversations[conversation.id] = conversation;
      return this.saveConversations(conversations);
    } catch (error) {
      console.error("Failed to import conversation:", error);
      return false;
    }
  }
  /**
   * Clear all conversations for a session
   */
  clearSession(sessionId) {
    const conversations = this.getStoredConversations();
    Object.keys(conversations).forEach((id) => {
      if (conversations[id].sessionId === sessionId) {
        delete conversations[id];
      }
    });
    return this.saveConversations(conversations);
  }
  /**
   * Get storage stats
   */
  getStorageStats() {
    const conversations = this.getStoredConversations();
    const totalMessages = Object.values(conversations).reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    );
    let storageSize = 0;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      storageSize = stored ? new Blob([stored]).size : 0;
    } catch {
      storageSize = 0;
    }
    return {
      totalConversations: Object.keys(conversations).length,
      totalMessages,
      storageSize,
      isStorageAvailable: this.isStorageAvailable()
    };
  }
};
var conversationStorage = new ConversationStorage();

// lib/missing-sdk-exports.ts
var ChatCommandProcessor = class {
  constructor(addBotMessage, executeAction) {
    this.addBotMessage = addBotMessage;
    this.executeAction = executeAction;
  }
  async initialize() {
  }
  async processMessage(message) {
    if (message.startsWith("/help")) {
      this.addBotMessage("Available commands: /help, /status, /clear");
      return { success: true };
    }
    if (message.startsWith("/status")) {
      this.addBotMessage("System status: Online");
      return { success: true };
    }
    if (message.startsWith("/clear")) {
      this.addBotMessage("Chat cleared");
      return { success: true };
    }
    return { success: false };
  }
};
var convertRelativeToAbsolute = (url, baseUrl) => {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
};
var navigateToUrl = (url) => {
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
};
var executeWebsiteAction = (action, params) => {
  console.log("Website action:", action, params);
};
var processSlashCommand = (params) => {
  const { command, addBotMessage } = params;
  switch (command) {
    case "help":
      addBotMessage("Available commands: /help, /status, /links, /clear");
      return true;
    case "status":
      addBotMessage("System status: Online and ready");
      return true;
    case "links":
      const links = params.getAllLinks();
      addBotMessage(`Found ${links.length} links on this page`);
      return true;
    case "clear":
      params.clearLinks();
      addBotMessage("Links cleared");
      return true;
    default:
      return false;
  }
};
var processDataCommand = (message, addBotMessage) => {
  if (message.toLowerCase().includes("data")) {
    addBotMessage("Data processing functionality coming soon!");
    return true;
  }
  return false;
};
var processNavigation = (params) => {
  const { userMessage, addBotMessage, navigateToUrl: _navigateToUrl } = params;
  if (userMessage.toLowerCase().includes("go to") || userMessage.toLowerCase().includes("navigate")) {
    addBotMessage("Navigation functionality coming soon!");
    return true;
  }
  return false;
};
var useChatInputManager = () => ({
  setInputValue: (value) => console.log("Set input:", value),
  setShowConversationStarters: (show) => console.log("Show starters:", show),
  setIsLoading: (loading) => console.log("Set loading:", loading)
});
var useSessionManager = () => ({
  sessionContext: {},
  pageData: {}
});
var useLinks = () => ({
  getAllLinks: () => [],
  clearLinks: () => {
  }
});
var useChatStateManager = () => ({
  content: {
    welcomeMessage: "Welcome! How can I help you today?"
  },
  behavior: {
    enableAttachments: true,
    enableImagePreview: true
  }
});
var useMessageHandlers = (setMessages) => ({
  addBotMessage: (content, options) => {
    const message = {
      id: Date.now().toString(),
      content,
      type: "bot",
      timestamp: /* @__PURE__ */ new Date(),
      ...options
    };
    setMessages((prev) => [...prev, message]);
  },
  addUserMessage: (content) => {
    const message = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, message]);
  }
});

// lib/session-manager.ts
var SessionManager = class {
  SESSION_KEY = "ashi_widget_session";
  SESSION_TIMEOUT = 24 * 60 * 60 * 1e3;
  // 24 hours
  currentSession = null;
  constructor() {
    if (typeof window !== "undefined") {
      this.initializeSession();
      this.setupSessionCleanup();
    }
  }
  generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `sess_${timestamp}_${randomPart}`;
  }
  generateUserId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `user_${timestamp}_${randomPart}`;
  }
  getUserAgent() {
    return typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";
  }
  isStorageAvailable() {
    try {
      const testKey = "__session_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  getStoredSession() {
    try {
      if (!this.isStorageAvailable()) return null;
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored);
      const lastActive = new Date(session.lastActiveAt).getTime();
      const now = Date.now();
      if (now - lastActive > this.SESSION_TIMEOUT) {
        this.clearStoredSession();
        return null;
      }
      return session;
    } catch (error) {
      console.error("Failed to load session:", error);
      return null;
    }
  }
  saveSession(session) {
    try {
      if (!this.isStorageAvailable()) return false;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error("Failed to save session:", error);
      return false;
    }
  }
  clearStoredSession() {
    try {
      if (this.isStorageAvailable()) {
        localStorage.removeItem(this.SESSION_KEY);
      }
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  }
  initializeSession() {
    const storedSession = this.getStoredSession();
    if (storedSession) {
      storedSession.lastActiveAt = (/* @__PURE__ */ new Date()).toISOString();
      storedSession.isActive = true;
      this.currentSession = storedSession;
      this.saveSession(storedSession);
    } else {
      this.createNewSession();
    }
  }
  setupSessionCleanup() {
    setInterval(() => {
      if (this.currentSession) {
        this.updateActivity();
      }
    }, 3e4);
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (this.currentSession) {
          this.currentSession.isActive = false;
          this.saveSession(this.currentSession);
        }
      });
      document.addEventListener("visibilitychange", () => {
        if (this.currentSession) {
          if (document.hidden) {
            this.currentSession.isActive = false;
          } else {
            this.currentSession.isActive = true;
            this.updateActivity();
          }
          this.saveSession(this.currentSession);
        }
      });
    }
  }
  /**
   * Create a new session
   */
  createNewSession(userId) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const session = {
      sessionId: this.generateSessionId(),
      userId: userId || this.generateUserId(),
      userAgent: this.getUserAgent(),
      createdAt: now,
      lastActiveAt: now,
      isActive: true,
      metadata: {
        conversationCount: 0,
        messageCount: 0,
        preferences: this.getDefaultPreferences(),
        tags: []
      }
    };
    this.currentSession = session;
    this.saveSession(session);
    return session;
  }
  /**
   * Get current session
   */
  getCurrentSession() {
    return this.currentSession;
  }
  /**
   * Get session ID
   */
  getSessionId() {
    return this.currentSession?.sessionId || null;
  }
  /**
   * Get user ID
   */
  getUserId() {
    return this.currentSession?.userId || null;
  }
  /**
   * Update session activity
   */
  updateActivity() {
    if (this.currentSession) {
      this.currentSession.lastActiveAt = (/* @__PURE__ */ new Date()).toISOString();
      this.currentSession.isActive = true;
      this.saveSession(this.currentSession);
    }
  }
  /**
   * Update session metadata
   */
  updateMetadata(updates) {
    if (!this.currentSession) return false;
    this.currentSession.metadata = {
      ...this.currentSession.metadata,
      ...updates
    };
    this.updateActivity();
    return this.saveSession(this.currentSession);
  }
  /**
   * Increment conversation count
   */
  incrementConversationCount() {
    if (this.currentSession) {
      this.currentSession.metadata.conversationCount++;
      this.saveSession(this.currentSession);
    }
  }
  /**
   * Increment message count
   */
  incrementMessageCount() {
    if (this.currentSession) {
      this.currentSession.metadata.messageCount++;
      this.saveSession(this.currentSession);
    }
  }
  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      theme: "auto",
      language: "en",
      notifications: true,
      autoSave: true,
      compactMode: false,
      showTimestamps: false
    };
  }
  /**
   * Get user preferences
   */
  getPreferences() {
    return this.currentSession?.metadata.preferences || this.getDefaultPreferences();
  }
  /**
   * Update user preferences
   */
  updatePreferences(preferences) {
    if (!this.currentSession) return false;
    this.currentSession.metadata.preferences = {
      ...this.getPreferences(),
      ...preferences
    };
    this.updateActivity();
    return this.saveSession(this.currentSession);
  }
  /**
   * Add session tags
   */
  addTag(tag) {
    if (!this.currentSession) return false;
    if (!this.currentSession.metadata.tags.includes(tag)) {
      this.currentSession.metadata.tags.push(tag);
      this.saveSession(this.currentSession);
    }
    return true;
  }
  /**
   * Remove session tag
   */
  removeTag(tag) {
    if (!this.currentSession) return false;
    const index = this.currentSession.metadata.tags.indexOf(tag);
    if (index > -1) {
      this.currentSession.metadata.tags.splice(index, 1);
      this.saveSession(this.currentSession);
      return true;
    }
    return false;
  }
  /**
   * End current session
   */
  endSession() {
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.saveSession(this.currentSession);
      this.currentSession = null;
    }
  }
  /**
   * Clear all session data
   */
  clearSession() {
    this.currentSession = null;
    this.clearStoredSession();
  }
  /**
   * Get session duration in milliseconds
   */
  getSessionDuration() {
    if (!this.currentSession) return 0;
    const created = new Date(this.currentSession.createdAt).getTime();
    const lastActive = new Date(this.currentSession.lastActiveAt).getTime();
    return lastActive - created;
  }
  /**
   * Check if session is active
   */
  isSessionActive() {
    if (!this.currentSession) return false;
    const lastActive = new Date(this.currentSession.lastActiveAt).getTime();
    const now = Date.now();
    return now - lastActive < this.SESSION_TIMEOUT;
  }
  /**
   * Refresh session (extend timeout)
   */
  refreshSession() {
    if (!this.currentSession) return false;
    this.updateActivity();
    return true;
  }
  /**
   * Export session data
   */
  exportSession() {
    if (!this.currentSession) return null;
    return JSON.stringify(this.currentSession, null, 2);
  }
  /**
   * Get session statistics
   */
  getSessionStats() {
    if (!this.currentSession) {
      return {
        sessionId: null,
        userId: null,
        duration: 0,
        conversationCount: 0,
        messageCount: 0,
        isActive: false,
        createdAt: null,
        lastActiveAt: null
      };
    }
    return {
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.userId || null,
      duration: this.getSessionDuration(),
      conversationCount: this.currentSession.metadata.conversationCount,
      messageCount: this.currentSession.metadata.messageCount,
      isActive: this.currentSession.isActive,
      createdAt: this.currentSession.createdAt,
      lastActiveAt: this.currentSession.lastActiveAt
    };
  }
};
var sessionManager = new SessionManager();

// lib/session-html-storage.ts
var SessionHtmlStorage = class {
  static STORAGE_PREFIX = "ashi_html_data_";
  static LATEST_KEY = "ashi_latest_html_data";
  /**
   * Get the latest HTML data from any trigger type
   */
  static getLatestHtmlData() {
    try {
      const latestKey = sessionStorage.getItem(this.LATEST_KEY);
      if (!latestKey) {
        console.warn("\u26A0\uFE0F [SessionHtmlStorage] No latest HTML data reference found");
        return null;
      }
      const dataStr = sessionStorage.getItem(latestKey);
      if (!dataStr) {
        console.warn(`\u26A0\uFE0F [SessionHtmlStorage] No data found for key: ${latestKey}`);
        return null;
      }
      const data = JSON.parse(dataStr);
      console.log(`\u{1F4D6} [SessionHtmlStorage] Retrieved latest HTML data: ${data.trigger} from ${data.metadata.url}`);
      return data;
    } catch (error) {
      console.error("\u274C [SessionHtmlStorage] Failed to get latest HTML data:", error);
      return null;
    }
  }
  /**
   * Get HTML data for a specific trigger type
   */
  static getHtmlDataByTrigger(trigger) {
    try {
      const key = `${this.STORAGE_PREFIX}${trigger}`;
      const dataStr = sessionStorage.getItem(key);
      if (!dataStr) {
        console.warn(`\u26A0\uFE0F [SessionHtmlStorage] No data found for trigger: ${trigger}`);
        return null;
      }
      const data = JSON.parse(dataStr);
      console.log(`\u{1F4D6} [SessionHtmlStorage] Retrieved HTML data for trigger: ${trigger} from ${data.metadata.url}`);
      return data;
    } catch (error) {
      console.error(`\u274C [SessionHtmlStorage] Failed to get HTML data for trigger ${trigger}:`, error);
      return null;
    }
  }
  /**
   * Get all available HTML data entries
   */
  static getAllHtmlData() {
    try {
      const entries = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX) && key !== this.LATEST_KEY) {
          const dataStr = sessionStorage.getItem(key);
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              const trigger = key.replace(this.STORAGE_PREFIX, "");
              entries.push({ trigger, data });
            } catch (parseError) {
              console.warn(`\u26A0\uFE0F [SessionHtmlStorage] Failed to parse data for key: ${key}`, parseError);
            }
          }
        }
      }
      console.log(`\u{1F4CA} [SessionHtmlStorage] Retrieved ${entries.length} HTML data entries`);
      return entries;
    } catch (error) {
      console.error("\u274C [SessionHtmlStorage] Failed to get all HTML data:", error);
      return [];
    }
  }
  /**
   * Check if HTML data exists for a specific trigger
   */
  static hasHtmlData(trigger) {
    const key = `${this.STORAGE_PREFIX}${trigger}`;
    return sessionStorage.getItem(key) !== null;
  }
  /**
   * Get available trigger types
   */
  static getAvailableTriggers() {
    const triggers = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX) && key !== this.LATEST_KEY) {
        const trigger = key.replace(this.STORAGE_PREFIX, "");
        triggers.push(trigger);
      }
    }
    return triggers;
  }
  /**
   * Clean up old HTML data entries (useful for memory management)
   */
  static cleanup() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        sessionStorage.removeItem(key);
      });
      sessionStorage.removeItem(this.LATEST_KEY);
      console.log(`\u{1F9F9} [SessionHtmlStorage] Cleaned up ${keysToRemove.length} HTML data entries`);
    } catch (error) {
      console.error("\u274C [SessionHtmlStorage] Failed to cleanup HTML data:", error);
    }
  }
  /**
   * Get storage statistics
   */
  static getStorageStats() {
    const triggers = this.getAvailableTriggers();
    let totalSize = 0;
    triggers.forEach((trigger) => {
      const key = `${this.STORAGE_PREFIX}${trigger}`;
      const data = sessionStorage.getItem(key);
      if (data) {
        totalSize += data.length;
      }
    });
    const latestKey = sessionStorage.getItem(this.LATEST_KEY);
    const latestTrigger = latestKey ? latestKey.replace(this.STORAGE_PREFIX, "") : null;
    return {
      totalEntries: triggers.length,
      availableTriggers: triggers,
      totalStorageSize: totalSize,
      latestTrigger
    };
  }
};
var getLatestHtmlData = () => SessionHtmlStorage.getLatestHtmlData();
var getHtmlDataByTrigger = (trigger) => SessionHtmlStorage.getHtmlDataByTrigger(trigger);
var getAllHtmlData = () => SessionHtmlStorage.getAllHtmlData();
var hasHtmlData = (trigger) => SessionHtmlStorage.hasHtmlData(trigger);
var getAvailableTriggers = () => SessionHtmlStorage.getAvailableTriggers();
var cleanupHtmlData = () => SessionHtmlStorage.cleanup();
var getHtmlStorageStats = () => SessionHtmlStorage.getStorageStats();

// api-functions.ts
var getCurrentAuthData = () => {
  if (typeof window === "undefined") return null;
  try {
    const currentJewelerid = localStorage.getItem("current_auth_jewelerid");
    if (currentJewelerid) {
      return {
        jewelerid: currentJewelerid,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error("Error retrieving current auth data:", error);
    return null;
  }
};
var sendSimpleChatMessage = async (message, sessionId, apiBaseURL) => {
  console.log("sendSimpleChatMessage called:", { message, sessionId, apiBaseURL });
  return {
    success: true,
    data: {
      response: "This is a placeholder response",
      messageId: Date.now().toString()
    }
  };
};
var completeAuthenticationFlowWithDetails = async (userDetails, apiBaseURL) => {
  console.log("completeAuthenticationFlowWithDetails called:", { userDetails, apiBaseURL });
  return {
    success: true,
    data: {
      user: userDetails,
      sessionId: Date.now().toString()
    }
  };
};
var clearAuthenticationData = (jewelerid) => {
  if (typeof window === "undefined") return false;
  try {
    if (jewelerid) {
      localStorage.removeItem(`auth_data_${jewelerid}`);
    } else {
      localStorage.removeItem("current_auth_jewelerid");
    }
    return true;
  } catch (error) {
    console.error("Error clearing auth data:", error);
    return false;
  }
};
var createInternalUser = async (userData, apiBaseURL) => {
  console.log("createInternalUser called:", { userData, apiBaseURL });
  return {
    success: true,
    data: {
      userId: Date.now().toString(),
      user: userData
    }
  };
};
var createSession = async (sessionData, authToken, apiBaseURL) => {
  console.log("createSession called:", { sessionData, authToken, apiBaseURL });
  return {
    success: true,
    data: {
      sessionId: Date.now().toString(),
      session: sessionData
    }
  };
};
export {
  ChatCommandProcessor,
  SessionHtmlStorage,
  apiClient,
  cleanupHtmlData,
  clearAuthenticationData,
  completeAuthenticationFlowWithDetails,
  conversationStorage,
  convertRelativeToAbsolute,
  createInternalUser,
  createSession,
  executeWebsiteAction,
  getAllHtmlData,
  getAvailableTriggers,
  getCurrentAuthData,
  getHtmlDataByTrigger,
  getHtmlStorageStats,
  getLatestHtmlData,
  getUrlBasedConfig,
  hasHtmlData,
  mergeUrlConfigWithDefaults,
  navigateToUrl,
  processDataCommand,
  processNavigation,
  processSlashCommand,
  sendSimpleChatMessage,
  sessionManager,
  useChatInputManager,
  useChatStateManager,
  useLinks,
  useMessageHandlers,
  useSessionManager
};
//# sourceMappingURL=index.mjs.map