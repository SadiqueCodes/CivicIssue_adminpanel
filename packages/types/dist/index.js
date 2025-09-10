'use strict';

var axios = require('axios');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var axios__default = /*#__PURE__*/_interopDefault(axios);

// src/de-frontend-types/client.ts
var ApiClient = class {
  axiosInstance;
  config;
  authState = {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    expiresAt: null,
    userInfo: null
  };
  constructor(config = {}) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_ASHID_API_URL || "https://aichatbotbeta.ashidiamonds.com",
      timeout: 3e4,
      retries: 3,
      retryDelay: 1e3,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      ...config
    };
    this.axiosInstance = axios__default.default.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers
    });
    this.setupInterceptors();
    this.loadAuthFromStorage();
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authState.token) {
          config.headers.Authorization = `Bearer ${this.authState.token}`;
        }
        config.headers["X-Request-Time"] = (/* @__PURE__ */ new Date()).toISOString();
        return config;
      },
      (error) => {
        return Promise.reject(this.formatError(error));
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data && typeof response.data === "object") {
          const { responseCode, responseStatus, responseMessage, responseData } = response.data;
          if (responseCode !== void 0) {
            return {
              ...response,
              data: {
                success: responseCode === 200 || responseCode === 1,
                data: responseData,
                message: responseMessage,
                status: responseStatus,
                originalResponse: response.data
              }
            };
          }
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${this.authState.token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("auth:expired"));
            }
            return Promise.reject(this.formatError(refreshError));
          }
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }
  formatError(error) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (error.response) {
      const { data, status, statusText } = error.response;
      if (data && data.responseMessage) {
        return {
          code: `HTTP_${status}`,
          message: data.responseMessage,
          details: {
            status,
            statusText,
            responseCode: data.responseCode,
            responseStatus: data.responseStatus,
            originalData: data
          },
          timestamp: now
        };
      }
      return {
        code: `HTTP_${status}`,
        message: data?.message || statusText || "Request failed",
        details: { status, statusText, data },
        timestamp: now
      };
    }
    if (error.request) {
      return {
        code: "NETWORK_ERROR",
        message: "Network error - Unable to reach server",
        details: { request: error.request },
        timestamp: now
      };
    }
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "Unknown error occurred",
      details: error,
      timestamp: now
    };
  }
  loadAuthFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("ashid_auth");
      if (stored) {
        const authData = JSON.parse(stored);
        if (authData.expiresAt && new Date(authData.expiresAt) > /* @__PURE__ */ new Date()) {
          this.authState = authData;
        } else {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error("Failed to load auth from storage:", error);
      this.clearAuth();
    }
  }
  saveAuthToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("ashid_auth", JSON.stringify(this.authState));
    } catch (error) {
      console.error("Failed to save auth to storage:", error);
    }
  }
  async refreshToken() {
    if (!this.authState.refreshToken) {
      throw new Error("No refresh token available");
    }
    this.clearAuth();
    throw new Error("Token refresh not implemented");
  }
  // Public authentication methods
  setAuth(token, refreshToken, expiresIn, userInfo) {
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1e3) : new Date(Date.now() + 24 * 60 * 60 * 1e3);
    this.authState = {
      isAuthenticated: true,
      token,
      refreshToken: refreshToken || null,
      expiresAt,
      userInfo: userInfo || null
    };
    this.saveAuthToStorage();
  }
  clearAuth() {
    this.authState = {
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      expiresAt: null,
      userInfo: null
    };
    if (typeof window !== "undefined") {
      localStorage.removeItem("ashid_auth");
    }
  }
  getAuth() {
    return { ...this.authState };
  }
  isAuthenticated() {
    return this.authState.isAuthenticated && this.authState.token !== null && (this.authState.expiresAt === null || this.authState.expiresAt > /* @__PURE__ */ new Date());
  }
  // HTTP Methods
  async get(url, config) {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }
  async post(url, data, config) {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }
  async put(url, data, config) {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }
  async delete(url, config) {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }
  // Utility methods
  async healthCheck() {
    try {
      const { quickHealthCheck } = await import('../../utils/health-checker');
      const healthStatus = await quickHealthCheck("ashi-widget-client");
      return healthStatus?.status === "healthy";
    } catch (error) {
      console.warn("\u274C [ApiClient] Health check failed:", error);
      return false;
    }
  }
  getBaseURL() {
    return this.config.baseURL;
  }
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.axiosInstance.defaults.baseURL = this.config.baseURL;
    this.axiosInstance.defaults.timeout = this.config.timeout;
    this.axiosInstance.defaults.headers = { ...this.axiosInstance.defaults.headers, ...this.config.headers };
  }
};
var apiClient = new ApiClient();
var client_default = ApiClient;

// src/de-frontend-types/auth.ts
var AuthAPI = class {
  /**
   * Login user with credentials
   */
  async login(credentials) {
    try {
      const response = await apiClient.post("/api/authentication/login", credentials);
      if (response.success && response.data) {
        apiClient.setAuth(
          response.data.token,
          response.data.refreshToken,
          response.data.expiresIn,
          response.data.userInfo
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Logout current user
   */
  async logout() {
    try {
      apiClient.clearAuth();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    } catch (error) {
      apiClient.clearAuth();
      throw error;
    }
  }
  /**
   * Get current authentication state
   */
  getAuthState() {
    return apiClient.getAuth();
  }
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return apiClient.isAuthenticated();
  }
  /**
   * Get current user info
   */
  getCurrentUser() {
    const auth = apiClient.getAuth();
    return auth.userInfo;
  }
  /**
   * Check if token is expired or about to expire
   */
  isTokenExpired() {
    const auth = apiClient.getAuth();
    if (!auth.expiresAt) return false;
    const expirationBuffer = 5 * 60 * 1e3;
    return new Date(auth.expiresAt).getTime() - Date.now() < expirationBuffer;
  }
  /**
   * Refresh authentication token
   */
  async refreshToken() {
    throw new Error("Token refresh not implemented - endpoint not available in API");
  }
  /**
   * Listen to authentication events
   */
  onAuthChange(callback) {
    if (typeof window === "undefined") {
      return () => {
      };
    }
    const handleAuthExpired = () => callback(false);
    const handleAuthLogout = () => callback(false);
    window.addEventListener("auth:expired", handleAuthExpired);
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }
};
var authAPI = new AuthAPI();

// src/de-frontend-types/products.ts
var ProductsAPI = class {
  /**
   * Search for products
   */
  async searchProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append("query", params.query);
      if (params.category) queryParams.append("category", params.category);
      if (params.minPrice) queryParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      const url = `/api/products/search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product details by style ID
   */
  async getProductDetails(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/details`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product variants by style ID
   */
  async getProductVariants(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/variants`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product specifications by style ID
   */
  async getProductSpecifications(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/specifications`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get multiple products by style IDs
   */
  async getProductsByIds(styleIds) {
    try {
      const promises = styleIds.map((id) => this.getProductDetails(id));
      const responses = await Promise.allSettled(promises);
      const products = [];
      responses.forEach((response) => {
        if (response.status === "fulfilled" && response.value.success) {
          products.push(response.value.data);
        }
      });
      return {
        success: true,
        data: products,
        message: `Retrieved ${products.length} of ${styleIds.length} products`,
        status: "success",
        originalResponse: responses
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get featured or trending products
   */
  async getFeaturedProducts(limit = 10) {
    try {
      return await this.searchProducts({
        limit,
        sortBy: "featured",
        sortOrder: "desc"
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get products by category
   */
  async getProductsByCategory(category, params = {}) {
    try {
      return await this.searchProducts({
        category,
        ...params
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product recommendations based on a product
   */
  async getProductRecommendations(styleId, limit = 5) {
    try {
      const productResponse = await this.getProductDetails(styleId);
      if (!productResponse.success) {
        throw new Error("Failed to get product details for recommendations");
      }
      const product = productResponse.data;
      const recommendationsResponse = await this.searchProducts({
        category: product.category,
        limit: limit + 1
        // Get one extra to exclude the original product
      });
      if (recommendationsResponse.success) {
        const recommendations = recommendationsResponse.data.products.filter((p) => p.style_id !== styleId).slice(0, limit);
        return {
          success: true,
          data: recommendations,
          message: `Found ${recommendations.length} recommendations`,
          status: "success",
          originalResponse: recommendationsResponse
        };
      }
      return recommendationsResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Check product availability
   */
  async checkAvailability(styleId, variantId) {
    try {
      if (variantId) {
        const variantsResponse = await this.getProductVariants(styleId);
        if (variantsResponse.success) {
          const variant = variantsResponse.data.find((v) => v.variantId === variantId);
          return {
            success: true,
            data: variant?.availability || false,
            message: variant ? "Variant availability checked" : "Variant not found",
            status: "success",
            originalResponse: variantsResponse
          };
        }
        return variantsResponse;
      } else {
        const productResponse = await this.getProductDetails(styleId);
        if (productResponse.success) {
          return {
            success: true,
            data: productResponse.data.availability || false,
            message: "Product availability checked",
            status: "success",
            originalResponse: productResponse
          };
        }
        return productResponse;
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product images
   */
  async getProductImages(styleId) {
    try {
      const productResponse = await this.getProductDetails(styleId);
      if (productResponse.success) {
        const images = productResponse.data.images || [];
        if (productResponse.data.imageUrl && !images.includes(productResponse.data.imageUrl)) {
          images.unshift(productResponse.data.imageUrl);
        }
        return {
          success: true,
          data: images,
          message: `Retrieved ${images.length} images`,
          status: "success",
          originalResponse: productResponse
        };
      }
      return productResponse;
    } catch (error) {
      throw error;
    }
  }
  // ===== MISSING APIS FROM SWAGGER =====
  /**
   * Get related products that share connection with another product
   */
  async getRelatedProducts(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/related`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product measurements based on various criteria & jewelry type
   */
  async getProductMeasurement(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/measurement`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get product purchase history by memo & invoice for given style id
   */
  async getStyleHistory(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/stylehistory`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get inventory status for given style IDs
   */
  async getInventoryStatus(request) {
    try {
      return await apiClient.post("/api/products/inventory-status", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get similar products that share common attributes with given product
   */
  async getSimilarStyles(styleId) {
    try {
      return await apiClient.get(`/api/products/${styleId}/similarstyles`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get list of recently viewed products by logged in user
   */
  async getRecentlyViewed() {
    try {
      return await apiClient.get("/api/products/recentlyviewed");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get products details by multiple style IDs (from Swagger)
   */
  async getMultipleProductDetails(styleIds) {
    try {
      return await apiClient.post("/api/products/details", { style_ids: styleIds });
    } catch (error) {
      throw error;
    }
  }
};
var productsAPI = new ProductsAPI();

// src/de-frontend-types/cart.ts
var CartAPI = class {
  /**
   * Get current cart contents
   */
  async getCart() {
    try {
      return await apiClient.get("/api/cart");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Add item to cart
   */
  async addToCart(item) {
    try {
      return await apiClient.post("/api/cart/add", item);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId, quantity) {
    try {
      return await apiClient.put("/api/cart/update", {
        itemId,
        quantity
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Remove item from cart
   */
  async removeFromCart(itemId) {
    try {
      return await apiClient.delete(`/api/cart/remove/${itemId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      return await apiClient.delete("/api/cart/clear");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Place order from current cart
   */
  async placeOrder(orderData = {}) {
    try {
      return await apiClient.post("/api/cart/placeorder", orderData);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get cart summary/totals
   */
  async getCartSummary() {
    try {
      const cartResponse = await this.getCart();
      if (cartResponse.success) {
        const cart = cartResponse.data;
        const summary = {
          totalItems: cart.totalItems,
          subtotal: cart.subtotal,
          tax: cart.tax || 0,
          shipping: cart.shipping || 0,
          totalAmount: cart.totalAmount
        };
        return {
          success: true,
          data: summary,
          message: "Cart summary calculated",
          status: "success",
          originalResponse: cartResponse
        };
      }
      return cartResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Add multiple items to cart
   */
  async addMultipleToCart(items) {
    try {
      const promises = items.map((item) => this.addToCart(item));
      const responses = await Promise.allSettled(promises);
      let lastSuccessfulResponse = null;
      const errors = [];
      responses.forEach((response, index) => {
        if (response.status === "fulfilled" && response.value.success) {
          lastSuccessfulResponse = response.value;
        } else {
          errors.push({
            index,
            item: items[index],
            error: response.status === "rejected" ? response.reason : response.value
          });
        }
      });
      if (lastSuccessfulResponse) {
        return {
          ...lastSuccessfulResponse,
          message: `Added ${items.length - errors.length} of ${items.length} items to cart`,
          originalResponse: { responses, errors }
        };
      }
      throw new Error("Failed to add any items to cart");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Validate cart before checkout
   */
  async validateCart() {
    try {
      const cartResponse = await this.getCart();
      if (!cartResponse.success) {
        return cartResponse;
      }
      const cart = cartResponse.data;
      const issues = [];
      const suggestions = [];
      if (!cart.items || cart.items.length === 0) {
        issues.push("Cart is empty");
      }
      const zeroQuantityItems = cart.items.filter((item) => item.quantity <= 0);
      if (zeroQuantityItems.length > 0) {
        issues.push(`${zeroQuantityItems.length} items have zero or negative quantity`);
      }
      const invalidPriceItems = cart.items.filter((item) => !item.price || item.price <= 0);
      if (invalidPriceItems.length > 0) {
        issues.push(`${invalidPriceItems.length} items have invalid prices`);
      }
      if (cart.totalAmount > 1e4) {
        suggestions.push("Consider splitting large orders for better processing");
      }
      if (cart.items.length > 20) {
        suggestions.push("Large number of items - consider creating a quotation instead");
      }
      return {
        success: true,
        data: {
          isValid: issues.length === 0,
          issues,
          suggestions
        },
        message: issues.length === 0 ? "Cart is valid" : `Cart has ${issues.length} issues`,
        status: "success",
        originalResponse: cartResponse
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * Calculate shipping cost
   */
  async calculateShipping(shippingAddress) {
    try {
      const cartSummaryResponse = await this.getCartSummary();
      if (cartSummaryResponse.success) {
        const { subtotal } = cartSummaryResponse.data;
        let shippingCost = 0;
        let method = "Standard";
        let estimatedDays = 5;
        if (subtotal > 500) {
          shippingCost = 0;
          method = "Free Standard Shipping";
        } else if (subtotal > 100) {
          shippingCost = 15;
        } else {
          shippingCost = 25;
        }
        return {
          success: true,
          data: {
            cost: shippingCost,
            method,
            estimatedDays
          },
          message: "Shipping calculated",
          status: "success",
          originalResponse: cartSummaryResponse
        };
      }
      return cartSummaryResponse;
    } catch (error) {
      throw error;
    }
  }
  // ===== MISSING APIS FROM SWAGGER =====
  /**
   * Get required fields for placing an order
   */
  async getPlaceOrderFields() {
    try {
      return await apiClient.get("/api/cart/placeorder/getfields");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Submit place order fields with validation
   */
  async postPlaceOrderFields(request) {
    try {
      return await apiClient.post("/api/cart/placeorder/postfields", request);
    } catch (error) {
      throw error;
    }
  }
};
var cartAPI = new CartAPI();

// src/de-frontend-types/quotations.ts
var QuotationsAPI = class {
  /**
   * Create a new sales quotation
   */
  async createQuotation(data = {}) {
    try {
      return await apiClient.post("/api/salesquotation/create", data);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get quotation by ID
   */
  async getQuotation(quotationId) {
    try {
      return await apiClient.get(`/api/salesquotation/${quotationId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get all quotations for current user
   */
  async getQuotations(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      const url = `/api/salesquotation${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Add item to quotation
   */
  async addItemToQuotation(data) {
    try {
      return await apiClient.post("/api/salesquotation/additem", data);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Remove items from quotation
   */
  async removeItemsFromQuotation(quotationId, itemIds) {
    try {
      return await apiClient.delete("/api/salesquotation/removeitems", {
        data: {
          quotationId,
          itemIds
        }
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Remove single item from quotation
   */
  async removeItemFromQuotation(quotationId, itemId) {
    try {
      return await this.removeItemsFromQuotation(quotationId, [itemId]);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update quotation item quantity
   */
  async updateQuotationItem(quotationId, itemId, quantity) {
    try {
      return await apiClient.put("/api/salesquotation/updateitem", {
        quotationId,
        itemId,
        quantity
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Move quotation to cart
   */
  async moveToCart(quotationId) {
    try {
      return await apiClient.post("/api/salesquotation/movetocart", {
        quotationId
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Move specific quotation items to cart
   */
  async moveItemsToCart(quotationId, itemIds) {
    try {
      return await apiClient.post("/api/salesquotation/moveitemstocart", {
        quotationId,
        itemIds
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update quotation details
   */
  async updateQuotation(quotationId, data) {
    try {
      return await apiClient.put(`/api/salesquotation/${quotationId}`, data);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Delete quotation
   */
  async deleteQuotation(quotationId) {
    try {
      return await apiClient.delete(`/api/salesquotation/${quotationId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get quotation summary
   */
  async getQuotationSummary(quotationId) {
    try {
      const quotationResponse = await this.getQuotation(quotationId);
      if (quotationResponse.success) {
        const quotation = quotationResponse.data;
        const itemsCount = {};
        quotation.items.forEach((item) => {
          const category = item.product?.category || "Unknown";
          itemsCount[category] = (itemsCount[category] || 0) + item.quantity;
        });
        const summary = {
          totalItems: quotation.items.reduce((total, item) => total + item.quantity, 0),
          totalAmount: quotation.totalAmount,
          validUntil: quotation.validUntil,
          status: quotation.status,
          itemsCount
        };
        return {
          success: true,
          data: summary,
          message: "Quotation summary calculated",
          status: "success",
          originalResponse: quotationResponse
        };
      }
      return quotationResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Duplicate quotation
   */
  async duplicateQuotation(quotationId, newData = {}) {
    try {
      const originalResponse = await this.getQuotation(quotationId);
      if (!originalResponse.success) {
        return originalResponse;
      }
      const original = originalResponse.data;
      const newQuotationResponse = await this.createQuotation({
        customerName: original.items.length > 0 ? `Copy of ${original.quotationNumber}` : void 0,
        ...newData
      });
      if (!newQuotationResponse.success) {
        return newQuotationResponse;
      }
      const newQuotation = newQuotationResponse.data;
      const addItemPromises = original.items.map(
        (item) => this.addItemToQuotation({
          quotationId: newQuotation.quotationId,
          style_id: item.style_id,
          quantity: item.quantity
        })
      );
      await Promise.allSettled(addItemPromises);
      return await this.getQuotation(newQuotation.quotationId);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Check quotation validity
   */
  async checkQuotationValidity(quotationId) {
    try {
      const quotationResponse = await this.getQuotation(quotationId);
      if (quotationResponse.success) {
        const quotation = quotationResponse.data;
        let isValid = true;
        let daysRemaining = 0;
        if (quotation.validUntil) {
          const expirationDate = new Date(quotation.validUntil);
          const now = /* @__PURE__ */ new Date();
          const diffTime = expirationDate.getTime() - now.getTime();
          daysRemaining = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
          isValid = daysRemaining > 0;
        }
        return {
          success: true,
          data: {
            isValid,
            daysRemaining,
            expiresAt: quotation.validUntil
          },
          message: isValid ? "Quotation is valid" : "Quotation has expired",
          status: "success",
          originalResponse: quotationResponse
        };
      }
      return quotationResponse;
    } catch (error) {
      throw error;
    }
  }
  // ===== MISSING APIS FROM SWAGGER =====
  /**
   * Get specific sales quotation by SQID (from Swagger)
   */
  async getSpecificSalesQuotation(sqid) {
    try {
      return await apiClient.get(`/api/salesquotation/${sqid}/salesquotation`);
    } catch (error) {
      throw error;
    }
  }
};
var quotationsAPI = new QuotationsAPI();

// src/de-frontend-types/wishlist.ts
var WishlistAPI = class {
  /**
   * Get current user's wishlist
   */
  async getWishlist(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      const url = `/api/wishlist${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Add item to wishlist
   */
  async addToWishlist(item) {
    try {
      return await apiClient.post("/api/wishlist/add", item);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(itemId) {
    try {
      return await apiClient.delete(`/api/wishlist/remove/${itemId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Remove multiple items from wishlist
   */
  async removeMultipleFromWishlist(itemIds) {
    try {
      return await apiClient.delete("/api/wishlist/remove", {
        data: { itemIds }
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Clear entire wishlist
   */
  async clearWishlist() {
    try {
      return await apiClient.delete("/api/wishlist/clear");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Move wishlist item to cart
   */
  async moveToCart(itemId, quantity = 1) {
    try {
      return await apiClient.post("/api/wishlist/movetocart", {
        itemId,
        quantity
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Move multiple wishlist items to cart
   */
  async moveMultipleToCart(items) {
    try {
      return await apiClient.post("/api/wishlist/movemultipletocart", {
        items
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Move entire wishlist to cart
   */
  async moveAllToCart(defaultQuantity = 1) {
    try {
      const wishlistResponse = await this.getWishlist();
      if (!wishlistResponse.success) {
        return wishlistResponse;
      }
      const items = wishlistResponse.data.items.map((item) => ({
        itemId: item.id,
        quantity: defaultQuantity
      }));
      return await this.moveMultipleToCart(items);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Check if product is in wishlist
   */
  async isInWishlist(styleId) {
    try {
      const wishlistResponse = await this.getWishlist();
      if (wishlistResponse.success) {
        const isInWishlist = wishlistResponse.data.items.some(
          (item) => item.style_id === styleId
        );
        return {
          success: true,
          data: isInWishlist,
          message: isInWishlist ? "Product is in wishlist" : "Product is not in wishlist",
          status: "success",
          originalResponse: wishlistResponse
        };
      }
      return wishlistResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get wishlist item by style ID
   */
  async getWishlistItem(styleId) {
    try {
      const wishlistResponse = await this.getWishlist();
      if (wishlistResponse.success) {
        const item = wishlistResponse.data.items.find(
          (item2) => item2.style_id === styleId
        );
        return {
          success: true,
          data: item || null,
          message: item ? "Wishlist item found" : "Wishlist item not found",
          status: "success",
          originalResponse: wishlistResponse
        };
      }
      return wishlistResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get wishlist summary
   */
  async getWishlistSummary() {
    try {
      const wishlistResponse = await this.getWishlist();
      if (wishlistResponse.success) {
        const { items } = wishlistResponse.data;
        const categories = {};
        items.forEach((item) => {
          const category = item.product?.category || "Unknown";
          categories[category] = (categories[category] || 0) + 1;
        });
        let priceRange = null;
        const prices = items.map((item) => item.product?.price).filter((price) => price !== void 0 && price > 0);
        if (prices.length > 0) {
          priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices),
            average: prices.reduce((sum, price) => sum + price, 0) / prices.length
          };
        }
        const recentlyAdded = [...items].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 5);
        const summary = {
          totalItems: items.length,
          categories,
          priceRange,
          recentlyAdded
        };
        return {
          success: true,
          data: summary,
          message: "Wishlist summary calculated",
          status: "success",
          originalResponse: wishlistResponse
        };
      }
      return wishlistResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update wishlist item notes
   */
  async updateWishlistItem(itemId, notes) {
    try {
      return await apiClient.put(`/api/wishlist/update/${itemId}`, {
        notes
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Share wishlist (get shareable link or data)
   */
  async shareWishlist() {
    try {
      const wishlistResponse = await this.getWishlist();
      if (wishlistResponse.success) {
        const { items } = wishlistResponse.data;
        const shareData = {
          totalItems: items.length,
          items: items.map((item) => ({
            styleId: item.style_id,
            name: item.product?.name || "Unknown Product",
            price: item.product?.price,
            imageUrl: item.product?.imageUrl
          }))
        };
        const shareUrl = `${window.location.origin}/shared-wishlist/${btoa(JSON.stringify(shareData))}`;
        return {
          success: true,
          data: {
            shareUrl,
            shareData
          },
          message: "Wishlist share data generated",
          status: "success",
          originalResponse: wishlistResponse
        };
      }
      return wishlistResponse;
    } catch (error) {
      throw error;
    }
  }
};
var wishlistAPI = new WishlistAPI();

// src/de-frontend-types/special-orders.ts
var SpecialOrdersAPI = class {
  /**
   * Get special order options for a product
   */
  async getSpecialOrderOptions(styleId) {
    try {
      const queryParams = styleId ? `?styleId=${styleId}` : "";
      return await apiClient.get(`/api/specialorder/special_order_options${queryParams}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Check special order variant availability
   */
  async checkSpecialOrderVariant(styleId, variantOptions) {
    try {
      return await apiClient.post("/api/specialorder/checkspovariant", {
        styleId,
        variantOptions
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get available customization options for a product category
   */
  async getCustomizationOptions(category) {
    try {
      const optionsResponse = await this.getSpecialOrderOptions();
      if (optionsResponse.success) {
        const options = optionsResponse.data;
        const customizations = {
          metals: this.extractOptions(options.availableOptions, "metal") || ["Gold", "Platinum", "Silver"],
          gemstones: this.extractOptions(options.availableOptions, "gemstone") || ["Diamond", "Ruby", "Sapphire", "Emerald"],
          sizes: this.extractOptions(options.availableOptions, "size") || ["5", "6", "7", "8", "9", "10"],
          engravings: options.customizations?.includes("engraving") || true,
          customDesign: options.customizations?.includes("custom_design") || true,
          additionalOptions: options.availableOptions || {}
        };
        return {
          success: true,
          data: customizations,
          message: "Customization options retrieved",
          status: "success",
          originalResponse: optionsResponse
        };
      }
      return optionsResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Request special order quote
   */
  async requestSpecialOrderQuote(request) {
    try {
      return await apiClient.post("/api/specialorder/requestquote", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get special order request status
   */
  async getSpecialOrderStatus(requestId) {
    try {
      return await apiClient.get(`/api/specialorder/status/${requestId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get user's special order history
   */
  async getSpecialOrderHistory() {
    try {
      return await apiClient.get("/api/specialorder/history");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Calculate special order pricing
   */
  async calculateSpecialOrderPricing(baseStyleId, customizations) {
    try {
      const variantResponse = await this.checkSpecialOrderVariant(baseStyleId, customizations);
      if (variantResponse.success) {
        const variant = variantResponse.data;
        const basePrice = 1e3;
        const additionalCost = variant.additionalCost || 0;
        const breakdown = [
          {
            item: "Base Product",
            cost: basePrice,
            description: "Starting price for base design"
          }
        ];
        if (additionalCost > 0) {
          breakdown.push({
            item: "Customizations",
            cost: additionalCost,
            description: "Additional cost for custom modifications"
          });
        }
        const finalPrice = basePrice + additionalCost;
        return {
          success: true,
          data: {
            basePrice,
            customizationCosts: { customizations: additionalCost },
            totalAdditionalCost: additionalCost,
            finalPrice,
            breakdown
          },
          message: "Special order pricing calculated",
          status: "success",
          originalResponse: variantResponse
        };
      }
      return variantResponse;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Upload design files for custom order
   */
  async uploadDesignFiles(requestId, files) {
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      return await apiClient.post("/api/specialorder/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      throw error;
    }
  }
  // ===== MISSING APIS FROM SWAGGER =====
  /**
   * Add special order item to cart
   */
  async addSpecialOrderToCart(request) {
    try {
      return await apiClient.post("/api/specialorder/cart/add", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get special order FAQs and information
   */
  async getSpecialOrderInfo() {
    try {
      const info = {
        faq: [
          {
            question: "How long does a special order take?",
            answer: "Special orders typically take 4-8 weeks depending on complexity."
          },
          {
            question: "Can I modify my order after placing it?",
            answer: "Modifications are possible within 48 hours of placing the order."
          },
          {
            question: "What customizations are available?",
            answer: "We offer metal type, gemstone selection, size adjustments, and custom engravings."
          }
        ],
        process: [
          {
            step: 1,
            title: "Consultation",
            description: "Discuss your requirements with our design team",
            duration: "1-2 days"
          },
          {
            step: 2,
            title: "Design & Approval",
            description: "Review and approve the custom design",
            duration: "3-5 days"
          },
          {
            step: 3,
            title: "Production",
            description: "Crafting your custom piece",
            duration: "3-6 weeks"
          },
          {
            step: 4,
            title: "Quality Check",
            description: "Final inspection and certification",
            duration: "1-2 days"
          },
          {
            step: 5,
            title: "Delivery",
            description: "Secure shipping to your location",
            duration: "2-3 days"
          }
        ],
        policies: {
          cancellation: "Orders can be cancelled within 48 hours. After production begins, cancellation fees may apply.",
          modification: "Design modifications are accepted within 48 hours of order confirmation.",
          warranty: "All custom pieces come with a 1-year warranty covering manufacturing defects.",
          returns: "Custom orders are final sale unless there are manufacturing defects."
        }
      };
      return {
        success: true,
        data: info,
        message: "Special order information retrieved",
        status: "success",
        originalResponse: null
      };
    } catch (error) {
      throw error;
    }
  }
  // Helper method to extract options from the API response
  extractOptions(availableOptions, key) {
    if (!availableOptions || !availableOptions[key]) {
      return null;
    }
    const options = availableOptions[key];
    if (Array.isArray(options)) {
      return options;
    }
    if (typeof options === "object") {
      return Object.keys(options);
    }
    return null;
  }
};
var specialOrdersAPI = new SpecialOrdersAPI();

// src/de-frontend-types/customquote.ts
var CustomQuoteAPI = class {
  /**
   * Get available custom quote options and templates
   */
  async getCustomQuoteOptions() {
    try {
      return await apiClient.get("/api/customquote/options");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get custom quote templates
   */
  async getCustomQuoteTemplates() {
    try {
      return await apiClient.get("/api/customquote/templates");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Create a new custom quote request
   */
  async createCustomQuote(customerInfo, specifications, additionalRequirements) {
    try {
      const requestData = {
        customerInfo,
        specifications,
        additionalRequirements
      };
      return await apiClient.post("/api/customquote/create", requestData);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Request a custom quote with detailed specifications
   */
  async requestCustomQuote(request) {
    try {
      return await apiClient.post("/api/customquote/request", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Calculate pricing for a custom quote
   */
  async calculateCustomQuote(request) {
    try {
      return await apiClient.post("/api/customquote/calculate", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get all custom quotes for the current user
   */
  async getCustomQuotes() {
    try {
      return await apiClient.get("/api/customquote");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get a specific custom quote by ID
   */
  async getCustomQuoteById(quoteId) {
    try {
      return await apiClient.get(`/api/customquote/${quoteId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update a custom quote
   */
  async updateCustomQuote(quoteId, updates) {
    try {
      return await apiClient.put(`/api/customquote/${quoteId}`, updates);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Submit a custom quote for review
   */
  async submitCustomQuote(quoteId) {
    try {
      return await apiClient.post(`/api/customquote/${quoteId}/submit`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Cancel a custom quote
   */
  async cancelCustomQuote(quoteId) {
    try {
      return await apiClient.delete(`/api/customquote/${quoteId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get custom quote history
   */
  async getCustomQuoteHistory() {
    try {
      return await apiClient.get("/api/customquote/history");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Upload design files for a custom quote
   */
  async uploadDesignFiles(quoteId, files) {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      return await apiClient.post(`/api/customquote/${quoteId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      throw error;
    }
  }
};
var customQuoteAPI = new CustomQuoteAPI();

// src/de-frontend-types/order-status.ts
var OrderStatusAPI = class {
  /**
   * Get order status by web reference number
   */
  async getOrderStatusByWebReference(webReferenceNo) {
    try {
      return await apiClient.get(`/api/orderstatus/webreference/${webReferenceNo}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get order status by PO number
   */
  async getOrderStatusByPO(poNo) {
    try {
      return await apiClient.get(`/api/orderstatus/po/${poNo}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get order status by AshiD order number
   */
  async getOrderStatusByAshiOrderNo(ashiOrderNo) {
    try {
      return await apiClient.get(`/api/orderstatus/ashi/${ashiOrderNo}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Search orders with flexible criteria
   */
  async searchOrderStatus(request) {
    try {
      const queryParams = new URLSearchParams();
      if (request.webreference_no) queryParams.append("webreference_no", request.webreference_no);
      if (request.po_no) queryParams.append("po_no", request.po_no);
      if (request.ashi_order_no) queryParams.append("ashi_order_no", request.ashi_order_no);
      if (request.order_status) queryParams.append("order_status", request.order_status);
      if (request.start_date) queryParams.append("start_date", request.start_date);
      if (request.end_date) queryParams.append("end_date", request.end_date);
      const url = `/api/orderstatus/search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get all orders for the current user
   */
  async getAllOrders() {
    try {
      return await apiClient.get("/api/orderstatus");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get orders by status
   */
  async getOrdersByStatus(status) {
    try {
      return await apiClient.get(`/api/orderstatus?status=${encodeURIComponent(status)}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get recent orders (last 30 days)
   */
  async getRecentOrders(days = 30) {
    try {
      const endDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
      return await this.searchOrderStatus({
        start_date: startDate,
        end_date: endDate
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get pending orders
   */
  async getPendingOrders() {
    try {
      return await this.getOrdersByStatus("pending");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get shipped orders
   */
  async getShippedOrders() {
    try {
      return await this.getOrdersByStatus("shipped");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get delivered orders
   */
  async getDeliveredOrders() {
    try {
      return await this.getOrdersByStatus("delivered");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Track shipment by tracking number
   */
  async trackShipment(trackingNo) {
    try {
      return await apiClient.get(`/api/orderstatus/track/${trackingNo}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get order timeline/history
   */
  async getOrderTimeline(orderNo) {
    try {
      return await apiClient.get(`/api/orderstatus/${orderNo}/timeline`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Update order status (if user has permission)
   */
  async updateOrderStatus(orderNo, status, notes) {
    try {
      return await apiClient.put(`/api/orderstatus/${orderNo}`, {
        status,
        notes
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Cancel an order (if cancellation is allowed)
   */
  async cancelOrder(orderNo, reason) {
    try {
      return await apiClient.post(`/api/orderstatus/${orderNo}/cancel`, {
        reason
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Request order status notification
   */
  async subscribeToOrderUpdates(orderNo, email, phone) {
    try {
      return await apiClient.post(`/api/orderstatus/${orderNo}/subscribe`, {
        email,
        phone
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get order documents (invoices, receipts, etc.)
   */
  async getOrderDocuments(orderNo) {
    try {
      return await apiClient.get(`/api/orderstatus/${orderNo}/documents`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Download order document
   */
  async downloadOrderDocument(orderNo, documentId) {
    try {
      return await apiClient.get(`/api/orderstatus/${orderNo}/documents/${documentId}/download`, {
        responseType: "blob"
      });
    } catch (error) {
      throw error;
    }
  }
};
var orderStatusAPI = new OrderStatusAPI();

// src/de-frontend-types/catalog-program.ts
var CatalogProgramAPI = class {
  /**
   * Get program information by PPCC ID
   */
  async getProgramInfo(ppccId) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get all available programs
   */
  async getAllPrograms() {
    try {
      return await apiClient.get("/api/catalogprogram/programs");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get catalog information by catalog ID
   */
  async getCatalogInfo(catalogId) {
    try {
      return await apiClient.get(`/api/catalogprogram/catalog/${catalogId}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get all available catalogs
   */
  async getAllCatalogs() {
    try {
      return await apiClient.get("/api/catalogprogram/catalogs");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get active catalogs (currently effective)
   */
  async getActiveCatalogs() {
    try {
      return await apiClient.get("/api/catalogprogram/catalogs/active");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get products by program/catalog
   */
  async getProductsByProgram(ppccId, params) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      const url = `/api/catalogprogram/ppcc/${ppccId}/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get products by catalog
   */
  async getProductsByCatalog(catalogId, params) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      const url = `/api/catalogprogram/catalog/${catalogId}/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get special order information for a program
   */
  async getSpecialOrderInfo(ppccId) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}/specialorder`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Check if a product is available in a specific program
   */
  async checkProductInProgram(ppccId, itemcd) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}/product/${itemcd}`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get program pricing for a product
   */
  async getProgramPricing(ppccId, itemcd) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}/product/${itemcd}/pricing`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Search programs by criteria
   */
  async searchPrograms(criteria) {
    try {
      const queryParams = new URLSearchParams();
      if (criteria.programName) queryParams.append("programName", criteria.programName);
      if (criteria.catalogName) queryParams.append("catalogName", criteria.catalogName);
      if (criteria.active !== void 0) queryParams.append("active", criteria.active.toString());
      if (criteria.hasSpecialOrder !== void 0) queryParams.append("hasSpecialOrder", criteria.hasSpecialOrder.toString());
      const url = `/api/catalogprogram/search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      return await apiClient.get(url);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get program categories
   */
  async getProgramCategories(ppccId) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}/categories`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get catalog expiry information
   */
  async getCatalogExpiry(catalogId) {
    try {
      return await apiClient.get(`/api/catalogprogram/catalog/${catalogId}/expiry`);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Subscribe to program updates
   */
  async subscribeToProgramUpdates(ppccId, email) {
    try {
      return await apiClient.post(`/api/catalogprogram/ppcc/${ppccId}/subscribe`, {
        email
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get program statistics
   */
  async getProgramStatistics(ppccId) {
    try {
      return await apiClient.get(`/api/catalogprogram/ppcc/${ppccId}/statistics`);
    } catch (error) {
      throw error;
    }
  }
};
var catalogProgramAPI = new CatalogProgramAPI();

// src/de-frontend-types/email.ts
var EmailAPI = class {
  /**
   * Get email style details fields (from Swagger)
   * This appears to be the main email-related endpoint available
   */
  async getEmailStyleDetailsFields() {
    try {
      return await apiClient.get("/api/email/styledetails/fields");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send email with style details
   */
  async sendEmailStyleDetails(request) {
    try {
      return await apiClient.post("/api/email/styledetails/send", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send product details via email
   * Alternative endpoint that might be available
   */
  async sendProductByEmail(request) {
    try {
      return await apiClient.post("/api/email/product/send", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Share product via email
   */
  async shareProduct(request) {
    try {
      return await apiClient.post("/api/email/share/product", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send inquiry email about a product
   */
  async sendProductInquiry(request) {
    try {
      return await apiClient.post("/api/email/inquiry", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Subscribe to email notifications
   */
  async subscribeToNotifications(request) {
    try {
      return await apiClient.post("/api/email/subscribe", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Unsubscribe from email notifications
   */
  async unsubscribeFromNotifications(email, token) {
    try {
      const requestData = { email };
      if (token) {
        requestData.unsubscribeToken = token;
      }
      return await apiClient.post("/api/email/unsubscribe", requestData);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get email templates (if available)
   */
  async getEmailTemplates() {
    try {
      return await apiClient.get("/api/email/templates");
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send custom email using template
   */
  async sendTemplateEmail(request) {
    try {
      return await apiClient.post("/api/email/template/send", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Request price quote via email
   */
  async requestPriceQuote(request) {
    try {
      return await apiClient.post("/api/email/quote/request", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send availability notification request
   */
  async requestAvailabilityNotification(request) {
    try {
      return await apiClient.post("/api/email/availability/notify", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send appointment request email
   */
  async requestAppointment(request) {
    try {
      return await apiClient.post("/api/email/appointment/request", request);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Send contact form email
   */
  async sendContactForm(request) {
    try {
      return await apiClient.post("/api/email/contact", request);
    } catch (error) {
      throw error;
    }
  }
};
var emailAPI = new EmailAPI();

// src/de-frontend-types/internal-user.ts
var InternalUserAPI = class {
  baseURL;
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }
  /**
   * Get headers for internal API requests with host_auth_token
   */
  getHeaders(hostAuthToken) {
    return {
      "accept": "application/json",
      "Authorization": `Bearer ${hostAuthToken}`,
      "Content-Type": "application/json"
    };
  }
  /**
   * Create a new user through the internal API
   */
  async createUser(userRequest, hostAuthToken, apiBaseURL) {
    try {
      const baseUrl = apiBaseURL || this.getApiBaseURL();
      const requiredFields = ["user_email", "org_id", "user_name", "first_name", "last_name", "phone", "reference_id"];
      for (const field of requiredFields) {
        if (!userRequest[field]) {
          return {
            success: false,
            message: `Missing required field: ${field}`,
            error_details: { field, value: userRequest[field] }
          };
        }
      }
      if (!hostAuthToken) {
        return {
          success: false,
          message: "host_auth_token is required for authentication",
          error_details: { missing_token: true }
        };
      }
      const response = await fetch(`${baseUrl}/api/v1/user/create`, {
        method: "POST",
        headers: this.getHeaders(hostAuthToken),
        body: JSON.stringify(userRequest)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Internal User API error:", data);
        return {
          success: false,
          message: "Failed to create user through internal API",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      const userId = data.id || data.user_id;
      const freshchatUserId = data.freshchat_user_id;
      if (typeof window !== "undefined") {
        const userStorageKey = `internal_user_${userRequest.reference_id}`;
        const storageData = {
          user_id: userId,
          freshchat_user_id: freshchatUserId,
          reference_id: userRequest.reference_id,
          org_id: userRequest.org_id,
          user_email: userRequest.user_email,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          user_data: data
        };
        localStorage.setItem(userStorageKey, JSON.stringify(storageData));
        localStorage.setItem("internal_last_created_user", userId);
        if (freshchatUserId) {
          localStorage.setItem("internal_last_created_freshchat_user", freshchatUserId);
          const mappingKey = `user_freshchat_mapping_${userId}`;
          localStorage.setItem(mappingKey, freshchatUserId);
        }
        console.log(`\u2705 Internal user stored in localStorage with key: ${userStorageKey}`);
        console.log(`   - user_id: ${userId}`);
        console.log(`   - freshchat_user_id: ${freshchatUserId || "Not provided"}`);
      }
      return {
        success: true,
        user_id: userId,
        freshchat_user_id: freshchatUserId,
        message: "User created successfully through internal API",
        user_data: data
      };
    } catch (error) {
      console.error("Error creating internal user:", error);
      return {
        success: false,
        message: "Internal error while creating user",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Get API base URL for services API (different from local origin)
   */
  getApiBaseURL() {
    return process.env.NEXT_PUBLIC_SERVICES_API_URL || "http://192.168.50.19:8000";
  }
  /**
   * Create user with automatic org_id and user_name generation
   */
  async createUserSimplified(email, firstName, lastName, phone, referenceId, orgId, hostAuthToken, apiBaseURL) {
    const userRequest = {
      user_email: email,
      org_id: orgId,
      user_name: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      // Auto-generate username
      first_name: firstName,
      last_name: lastName,
      phone,
      reference_id: referenceId
    };
    return this.createUser(userRequest, hostAuthToken, apiBaseURL);
  }
  /**
   * Convert legacy Freshchat request to internal API format
   */
  convertFromFreshchatRequest(freshchatRequest) {
    return {
      user_email: freshchatRequest.email,
      org_id: freshchatRequest.jeweler_id,
      // Use jeweler_id as org_id
      user_name: `${freshchatRequest.first_name.toLowerCase()}.${freshchatRequest.last_name.toLowerCase()}`,
      first_name: freshchatRequest.first_name,
      last_name: freshchatRequest.last_name,
      phone: freshchatRequest.phone || "",
      reference_id: freshchatRequest.reference_id
    };
  }
};
var internalUserAPI = new InternalUserAPI();
var createInternalUser = (userRequest, hostAuthToken, apiBaseURL) => internalUserAPI.createUser(userRequest, hostAuthToken, apiBaseURL);
var createInternalUserSimplified = (email, firstName, lastName, phone, referenceId, orgId, hostAuthToken, apiBaseURL) => internalUserAPI.createUserSimplified(email, firstName, lastName, phone, referenceId, orgId, hostAuthToken, apiBaseURL);
var getStoredInternalUser = (referenceId) => {
  if (typeof window === "undefined") return null;
  try {
    const userStorageKey = `internal_user_${referenceId}`;
    const storedData = localStorage.getItem(userStorageKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving stored internal user:", error);
    return null;
  }
};
var getLastCreatedInternalUserId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("internal_last_created_user");
  } catch (error) {
    console.error("Error retrieving last created internal user ID:", error);
    return null;
  }
};
var getLastCreatedInternalFreshchatUserId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("internal_last_created_freshchat_user");
  } catch (error) {
    console.error("Error retrieving last created Freshchat user ID:", error);
    return null;
  }
};
var getFreshchatUserIdByUserId = (userId) => {
  if (typeof window === "undefined") return null;
  try {
    const mappingKey = `user_freshchat_mapping_${userId}`;
    return localStorage.getItem(mappingKey);
  } catch (error) {
    console.error("Error retrieving Freshchat user ID mapping:", error);
    return null;
  }
};
var getUserIdsByReferenceId = (referenceId) => {
  const userData = getStoredInternalUser(referenceId);
  if (userData) {
    return {
      user_id: userData.user_id || null,
      freshchat_user_id: userData.freshchat_user_id || null
    };
  }
  return {
    user_id: null,
    freshchat_user_id: null
  };
};
var getAllStoredInternalUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const users = [];
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("internal_user_")) {
        const userData = localStorage.getItem(key);
        if (userData) {
          users.push(JSON.parse(userData));
        }
      }
    }
    return users;
  } catch (error) {
    console.error("Error retrieving all stored internal users:", error);
    return [];
  }
};
var isInternalUserStoredLocally = (referenceId) => {
  if (typeof window === "undefined") return false;
  const userStorageKey = `internal_user_${referenceId}`;
  return localStorage.getItem(userStorageKey) !== null;
};
var getHostAuthToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("host_auth_token") || localStorage.getItem("hostAuthToken") || sessionStorage.getItem("host_auth_token") || sessionStorage.getItem("hostAuthToken") || null;
  } catch (error) {
    console.error("Error retrieving host auth token:", error);
    return null;
  }
};

// src/de-frontend-types/session.ts
var SessionAPI = class {
  baseURL;
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }
  /**
   * Get headers for session API requests with host_auth_token
   */
  getHeaders(hostAuthToken) {
    const headers = {
      "accept": "application/json",
      "Content-Type": "application/json"
    };
    const token = hostAuthToken || "hardcoded_dev_token_12345_abcdef";
    headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }
  /**
   * Create a new session through the internal API
   */
  async createSession(sessionRequest, hostAuthToken, apiBaseURL) {
    try {
      const baseUrl = apiBaseURL || this.getApiBaseURL();
      if (!sessionRequest.user_id) {
        return {
          success: false,
          message: "Missing required field: user_id"
        };
      }
      if (!sessionRequest.auth_token) {
        return {
          success: false,
          message: "Missing required field: auth_token"
        };
      }
      if (!hostAuthToken) {
        console.warn("\u26A0\uFE0F No host_auth_token provided - using hardcoded fallback for development");
      }
      console.log("\u{1F4E4} Session API Request:", {
        url: `${baseUrl}/api/v1/session/create`,
        headers: this.getHeaders(hostAuthToken),
        body: sessionRequest
      });
      const response = await fetch(`${baseUrl}/api/v1/session/create`, {
        method: "POST",
        headers: this.getHeaders(hostAuthToken),
        body: JSON.stringify(sessionRequest)
      });
      const data = await response.json();
      console.log("\u{1F4E5} Session API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data
      });
      if (!response.ok) {
        console.error("\u274C Session API error:", data);
        return {
          success: false,
          message: "Failed to create session through internal API",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      if (typeof window !== "undefined") {
        const sessionStorageKey = `session_${sessionRequest.user_id}`;
        const sessionData = {
          session_id: data.id || data.session_id,
          user_id: sessionRequest.user_id,
          auth_token: sessionRequest.auth_token,
          metadata: sessionRequest.metadata,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          session_data: data
        };
        localStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
        localStorage.setItem("last_created_session", data.id || data.session_id);
        localStorage.setItem("current_active_session", data.id || data.session_id);
        const sessionMappingKey = `session_mapping_${data.id || data.session_id}`;
        localStorage.setItem(sessionMappingKey, sessionRequest.user_id);
        console.log(`\u2705 Session stored in localStorage with key: ${sessionStorageKey}`);
        console.log(`   - session_id: ${data.id || data.session_id}`);
        console.log(`   - user_id: ${sessionRequest.user_id}`);
      }
      return {
        success: true,
        session_id: data.id || data.session_id,
        message: "Session created successfully through internal API",
        session_data: data
      };
    } catch (error) {
      console.error("Error creating session:", error);
      return {
        success: false,
        message: "Internal error while creating session",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Create session with simplified parameters
   */
  async createSessionSimplified(userId, authToken, hostAuthToken, metadata, apiBaseURL) {
    const sessionRequest = {
      user_id: userId,
      auth_token: authToken,
      metadata: metadata || {}
    };
    return this.createSession(sessionRequest, hostAuthToken, apiBaseURL);
  }
  /**
   * Get API base URL for services API (different from local origin)
   */
  getApiBaseURL() {
    return process.env.NEXT_PUBLIC_SERVICES_API_URL || "http://192.168.50.19:8000";
  }
};
var sessionAPI = new SessionAPI();
var createSession = (sessionRequest, hostAuthToken, apiBaseURL) => sessionAPI.createSession(sessionRequest, hostAuthToken, apiBaseURL);
var createSessionSimplified = (userId, authToken, hostAuthToken, metadata, apiBaseURL) => sessionAPI.createSessionSimplified(userId, authToken, hostAuthToken, metadata, apiBaseURL);
var getStoredSession = (userId) => {
  if (typeof window === "undefined") return null;
  try {
    const sessionStorageKey = `session_${userId}`;
    const storedData = localStorage.getItem(sessionStorageKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving stored session:", error);
    return null;
  }
};
var getLastCreatedSessionId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("last_created_session");
  } catch (error) {
    console.error("Error retrieving last created session ID:", error);
    return null;
  }
};
var getCurrentActiveSessionId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("current_active_session");
  } catch (error) {
    console.error("Error retrieving current active session ID:", error);
    return null;
  }
};
var getUserIdBySessionId = (sessionId) => {
  if (typeof window === "undefined") return null;
  try {
    const sessionMappingKey = `session_mapping_${sessionId}`;
    return localStorage.getItem(sessionMappingKey);
  } catch (error) {
    console.error("Error retrieving user ID by session ID:", error);
    return null;
  }
};
var getAllStoredSessions = () => {
  if (typeof window === "undefined") return [];
  try {
    const sessions = [];
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("session_") && !key.includes("mapping")) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          sessions.push(JSON.parse(sessionData));
        }
      }
    }
    return sessions;
  } catch (error) {
    console.error("Error retrieving all stored sessions:", error);
    return [];
  }
};
var isSessionStoredLocally = (userId) => {
  if (typeof window === "undefined") return false;
  const sessionStorageKey = `session_${userId}`;
  return localStorage.getItem(sessionStorageKey) !== null;
};
var removeStoredSession = (userId) => {
  if (typeof window === "undefined") return false;
  try {
    const sessionStorageKey = `session_${userId}`;
    const sessionData = getStoredSession(userId);
    localStorage.removeItem(sessionStorageKey);
    if (sessionData?.session_id) {
      const sessionMappingKey = `session_mapping_${sessionData.session_id}`;
      localStorage.removeItem(sessionMappingKey);
    }
    console.log(`\u{1F5D1}\uFE0F Removed stored session for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("Error removing stored session:", error);
    return false;
  }
};
var clearAllStoredSessions = () => {
  if (typeof window === "undefined") return false;
  try {
    const keys = Object.keys(localStorage);
    let removedCount = 0;
    for (const key of keys) {
      if (key.startsWith("session_") || key === "last_created_session" || key === "current_active_session") {
        localStorage.removeItem(key);
        removedCount++;
      }
    }
    console.log(`\u{1F5D1}\uFE0F Cleared ${removedCount} stored sessions`);
    return true;
  } catch (error) {
    console.error("Error clearing stored sessions:", error);
    return false;
  }
};
var setCurrentActiveSession = (sessionId) => {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem("current_active_session", sessionId);
    console.log(`\u2705 Set current active session: ${sessionId}`);
    return true;
  } catch (error) {
    console.error("Error setting current active session:", error);
    return false;
  }
};

// src/de-frontend-types/freshchat.ts
var FRESHCHAT_BASE_URL = process.env.NEXT_PUBLIC_FRESHCHAT_BASE_URL || "https://ashi-860828023240121150-bf24686de08d2d817516021.freshchat.com/v2";
var FRESHCHAT_TOKEN = process.env.FRESHCHAT_TOKEN || process.env.NEXT_PUBLIC_FRESHCHAT_TOKEN || "";
var FreshchatAPI = class {
  baseURL;
  token;
  constructor(baseURL = FRESHCHAT_BASE_URL, token = FRESHCHAT_TOKEN) {
    this.baseURL = baseURL;
    this.token = token;
  }
  /**
   * Get default headers for Freshchat API requests
   */
  getHeaders(assumeIdentity = false) {
    return {
      "accept": "application/json",
      "Authorization": `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "ASSUME-IDENTITY": assumeIdentity.toString()
    };
  }
  /**
   * Create a new user in Freshchat
   */
  async createUser(userRequest) {
    try {
      const requiredFields = ["email", "first_name", "last_name", "reference_id", "jeweler_id"];
      for (const field of requiredFields) {
        if (!userRequest[field]) {
          return {
            success: false,
            message: `Missing required field: ${field}`,
            error_details: { field, value: userRequest[field] }
          };
        }
      }
      const payload = {
        email: userRequest.email,
        first_name: userRequest.first_name,
        last_name: userRequest.last_name,
        reference_id: userRequest.reference_id,
        properties: [
          {
            name: "jeweler_id",
            value: userRequest.jeweler_id
          }
        ]
      };
      if (userRequest.phone) {
        payload.phone = userRequest.phone;
      }
      const response = await fetch(`${this.baseURL}/users`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat API error:", data);
        return {
          success: false,
          message: "Failed to create user in Freshchat",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      if (typeof window !== "undefined") {
        const userStorageKey = `freshchat_user_${userRequest.reference_id}`;
        const storageData = {
          freshchat_user_id: data.id,
          reference_id: userRequest.reference_id,
          jeweler_id: userRequest.jeweler_id,
          email: userRequest.email,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          user_data: data
        };
        localStorage.setItem(userStorageKey, JSON.stringify(storageData));
        localStorage.setItem("freshchat_last_created_user", data.id);
        console.log(`\u2705 Freshchat user stored in localStorage with key: ${userStorageKey}`);
      }
      return {
        success: true,
        freshchat_user_id: data.id,
        message: "User created successfully in Freshchat",
        user_data: data
      };
    } catch (error) {
      console.error("Error creating Freshchat user:", error);
      return {
        success: false,
        message: "Internal error while creating user",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Get user by reference_id
   */
  async getUserByReferenceId(referenceId) {
    try {
      if (!referenceId) {
        return {
          success: false,
          message: "reference_id is required"
        };
      }
      const response = await fetch(
        `${this.baseURL}/users?reference_id=${encodeURIComponent(referenceId)}`,
        {
          method: "GET",
          headers: this.getHeaders()
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat API error:", data);
        return {
          success: false,
          message: "Failed to retrieve user from Freshchat",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      return {
        success: true,
        message: "User retrieved successfully",
        user_data: data
      };
    } catch (error) {
      console.error("Error retrieving Freshchat user:", error);
      return {
        success: false,
        message: "Internal error while retrieving user",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          message: "userId is required"
        };
      }
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: "GET",
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat API error:", data);
        return {
          success: false,
          message: "Failed to retrieve user from Freshchat",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      return {
        success: true,
        message: "User retrieved successfully",
        user_data: data
      };
    } catch (error) {
      console.error("Error retrieving Freshchat user:", error);
      return {
        success: false,
        message: "Internal error while retrieving user",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Update user properties
   */
  async updateUserProperties(userId, properties) {
    try {
      if (!userId) {
        return {
          success: false,
          message: "userId is required"
        };
      }
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ properties })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat API error:", data);
        return {
          success: false,
          message: "Failed to update user properties in Freshchat",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      return {
        success: true,
        message: "User properties updated successfully",
        user_data: data
      };
    } catch (error) {
      console.error("Error updating Freshchat user properties:", error);
      return {
        success: false,
        message: "Internal error while updating user properties",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Send message to a conversation
   */
  async sendMessage(conversationId, messageRequest, assumeIdentity = false) {
    try {
      if (!conversationId) {
        return {
          success: false,
          message: "conversationId is required"
        };
      }
      if (!messageRequest.message_parts || messageRequest.message_parts.length === 0) {
        return {
          success: false,
          message: "message_parts is required and cannot be empty"
        };
      }
      if (!messageRequest.user_id || !messageRequest.actor_id) {
        return {
          success: false,
          message: "user_id and actor_id are required"
        };
      }
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: this.getHeaders(assumeIdentity),
        body: JSON.stringify(messageRequest)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat send message API error:", data);
        return {
          success: false,
          message: "Failed to send message to Freshchat conversation",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      return {
        success: true,
        message_id: data.id || data.message_id,
        message: "Message sent successfully to Freshchat conversation",
        message_data: data
      };
    } catch (error) {
      console.error("Error sending message to Freshchat:", error);
      return {
        success: false,
        message: "Internal error while sending message",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Send a simple text message to a conversation
   */
  async sendTextMessage(conversationId, content, userId, actorId, actorType = "agent", assumeIdentity = false) {
    const messageRequest = {
      message_parts: [
        {
          text: {
            content
          }
        }
      ],
      message_type: "normal",
      actor_type: actorType,
      user_id: userId,
      actor_id: actorId
    };
    return this.sendMessage(conversationId, messageRequest, assumeIdentity);
  }
  /**
   * Send a message with quick reply buttons
   */
  async sendMessageWithQuickReplies(conversationId, content, quickReplies, userId, actorId, actorType = "agent", assumeIdentity = false) {
    const messageRequest = {
      message_parts: [
        {
          text: {
            content
          }
        }
      ],
      reply_parts: [
        {
          collection: {
            sub_parts: quickReplies.map((label) => ({
              quick_reply_button: {
                label
              }
            }))
          }
        }
      ],
      message_type: "normal",
      actor_type: actorType,
      user_id: userId,
      actor_id: actorId
    };
    return this.sendMessage(conversationId, messageRequest, assumeIdentity);
  }
  /**
   * Send a message with URL buttons
   */
  async sendMessageWithUrlButtons(conversationId, content, urlButtons, userId, actorId, actorType = "agent", assumeIdentity = false) {
    const messageRequest = {
      message_parts: [
        {
          text: {
            content
          }
        }
      ],
      reply_parts: [
        {
          collection: {
            sub_parts: urlButtons.map((button) => ({
              url_button: {
                url: button.url,
                label: button.label,
                target: button.target || "_blank"
              }
            }))
          }
        }
      ],
      message_type: "normal",
      actor_type: actorType,
      user_id: userId,
      actor_id: actorId
    };
    return this.sendMessage(conversationId, messageRequest, assumeIdentity);
  }
  /**
   * Send a message with mixed buttons (quick replies and URL buttons)
   */
  async sendMessageWithMixedButtons(conversationId, content, quickReplies, urlButtons, userId, actorId, actorType = "agent", assumeIdentity = false) {
    const subParts = [
      // Add quick reply buttons
      ...quickReplies.map((label) => ({
        quick_reply_button: {
          label
        }
      })),
      // Add URL buttons
      ...urlButtons.map((button) => ({
        url_button: {
          url: button.url,
          label: button.label,
          target: button.target || "_blank"
        }
      }))
    ];
    const messageRequest = {
      message_parts: [
        {
          text: {
            content
          }
        }
      ],
      reply_parts: [
        {
          collection: {
            sub_parts: subParts
          }
        }
      ],
      message_type: "normal",
      actor_type: actorType,
      user_id: userId,
      actor_id: actorId
    };
    return this.sendMessage(conversationId, messageRequest, assumeIdentity);
  }
  /**
   * Get conversation details by ID
   */
  async getConversation(conversationId) {
    try {
      if (!conversationId) {
        return {
          success: false,
          message: "conversationId is required"
        };
      }
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: "GET",
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Freshchat get conversation API error:", data);
        return {
          success: false,
          message: "Failed to retrieve conversation from Freshchat",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      return {
        success: true,
        message: "Conversation retrieved successfully",
        conversation_data: data
      };
    } catch (error) {
      console.error("Error retrieving Freshchat conversation:", error);
      return {
        success: false,
        message: "Internal error while retrieving conversation",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
};
var freshchatAPI = new FreshchatAPI();
var createFreshchatUser = (userRequest) => freshchatAPI.createUser(userRequest);
var getFreshchatUserByReferenceId = (referenceId) => freshchatAPI.getUserByReferenceId(referenceId);
var getFreshchatUserById = (userId) => freshchatAPI.getUserById(userId);
var updateFreshchatUserProperties = (userId, properties) => freshchatAPI.updateUserProperties(userId, properties);
var sendFreshchatMessage = (conversationId, messageRequest, assumeIdentity) => freshchatAPI.sendMessage(conversationId, messageRequest, assumeIdentity);
var sendFreshchatTextMessage = (conversationId, content, userId, actorId, actorType, assumeIdentity) => freshchatAPI.sendTextMessage(conversationId, content, userId, actorId, actorType, assumeIdentity);
var sendFreshchatMessageWithQuickReplies = (conversationId, content, quickReplies, userId, actorId, actorType, assumeIdentity) => freshchatAPI.sendMessageWithQuickReplies(conversationId, content, quickReplies, userId, actorId, actorType, assumeIdentity);
var sendFreshchatMessageWithUrlButtons = (conversationId, content, urlButtons, userId, actorId, actorType, assumeIdentity) => freshchatAPI.sendMessageWithUrlButtons(conversationId, content, urlButtons, userId, actorId, actorType, assumeIdentity);
var sendFreshchatMessageWithMixedButtons = (conversationId, content, quickReplies, urlButtons, userId, actorId, actorType, assumeIdentity) => freshchatAPI.sendMessageWithMixedButtons(conversationId, content, quickReplies, urlButtons, userId, actorId, actorType, assumeIdentity);
var getFreshchatConversation = (conversationId) => freshchatAPI.getConversation(conversationId);
var getStoredFreshchatUser = (referenceId) => {
  if (typeof window === "undefined") return null;
  try {
    const userStorageKey = `freshchat_user_${referenceId}`;
    const storedData = localStorage.getItem(userStorageKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving stored Freshchat user:", error);
    return null;
  }
};
var getLastCreatedFreshchatUserId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("freshchat_last_created_user");
  } catch (error) {
    console.error("Error retrieving last created user ID:", error);
    return null;
  }
};
var getAllStoredFreshchatUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const users = [];
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("freshchat_user_")) {
        const userData = localStorage.getItem(key);
        if (userData) {
          users.push(JSON.parse(userData));
        }
      }
    }
    return users;
  } catch (error) {
    console.error("Error retrieving all stored users:", error);
    return [];
  }
};
var removeStoredFreshchatUser = (referenceId) => {
  if (typeof window === "undefined") return false;
  try {
    const userStorageKey = `freshchat_user_${referenceId}`;
    localStorage.removeItem(userStorageKey);
    console.log(`\u{1F5D1}\uFE0F Removed stored Freshchat user: ${referenceId}`);
    return true;
  } catch (error) {
    console.error("Error removing stored user:", error);
    return false;
  }
};
var clearAllStoredFreshchatUsers = () => {
  if (typeof window === "undefined") return false;
  try {
    const keys = Object.keys(localStorage);
    let removedCount = 0;
    for (const key of keys) {
      if (key.startsWith("freshchat_user_") || key === "freshchat_last_created_user") {
        localStorage.removeItem(key);
        removedCount++;
      }
    }
    console.log(`\u{1F5D1}\uFE0F Cleared ${removedCount} stored Freshchat users`);
    return true;
  } catch (error) {
    console.error("Error clearing stored users:", error);
    return false;
  }
};
var isUserStoredLocally = (referenceId) => {
  if (typeof window === "undefined") return false;
  const userStorageKey = `freshchat_user_${referenceId}`;
  return localStorage.getItem(userStorageKey) !== null;
};

// src/de-frontend-types/chat.ts
var ChatAPI = class {
  baseURL;
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }
  /**
   * Get headers for chat API requests with optional auth_token
   */
  getHeaders(authToken) {
    const headers = {
      "accept": "application/json",
      "Content-Type": "application/json"
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  }
  /**
   * Send a chat message - handles both AI chat and Freshchat handoff
   */
  async sendMessage(chatRequest, apiBaseURL) {
    try {
      const conversationState = this.getConversationState(chatRequest.session_id);
      if (conversationState?.handoff_to_human) {
        return await this.handleFreshchatMessage(chatRequest, conversationState);
      }
      const baseUrl = apiBaseURL || this.getApiBaseURL();
      if (!chatRequest.message) {
        return {
          success: false,
          message: "Missing required field: message"
        };
      }
      if (!chatRequest.user_id) {
        return {
          success: false,
          message: "Missing required field: user_id"
        };
      }
      if (!chatRequest.session_id) {
        return {
          success: false,
          message: "Missing required field: session_id"
        };
      }
      if (!chatRequest.auth_token) {
        console.warn("\u26A0\uFE0F No auth_token provided - using demo mode");
        chatRequest.auth_token = "demo_token";
      }
      const response = await fetch(`${baseUrl}/api/v1/chat`, {
        method: "POST",
        headers: this.getHeaders(chatRequest.auth_token),
        body: JSON.stringify({
          message: chatRequest.message,
          user_id: chatRequest.user_id,
          session_id: chatRequest.session_id,
          stream: chatRequest.stream || false,
          auth_token: chatRequest.auth_token,
          metadata: chatRequest.metadata || {}
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Chat API error:", data);
        return {
          success: false,
          message: "Failed to send chat message",
          error_details: {
            status: response.status,
            statusText: response.statusText,
            data
          }
        };
      }
      await this.handleChatResponse(data);
      return data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      return {
        success: false,
        message: "Internal error while sending chat message",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Handle chat response - store conversation mapping and check handoff status
   */
  async handleChatResponse(chatResponse) {
    try {
      const freshchatConversationId = chatResponse.metadata?.freshchat_conversation_id;
      const handoffToHuman = chatResponse.handoff_to_human;
      if (freshchatConversationId) {
        const conversationMapping = {
          session_id: chatResponse.session_id,
          conversation_id: chatResponse.conversation_id,
          freshchat_conversation_id: freshchatConversationId,
          user_id: chatResponse.user_id,
          handoff_to_human: handoffToHuman,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          last_message_timestamp: chatResponse.timestamp
        };
        this.storeConversationMapping(conversationMapping);
        console.log(`\u{1F4DE} Conversation mapping stored:`, {
          session_id: chatResponse.session_id,
          conversation_id: chatResponse.conversation_id,
          freshchat_conversation_id: freshchatConversationId,
          handoff_to_human: handoffToHuman
        });
        if (handoffToHuman) {
          console.log(`\u{1F91D} Conversation ${chatResponse.conversation_id} handed off to human agent`);
          console.log(`   - Freshchat Conversation ID: ${freshchatConversationId}`);
          console.log(`   - Future messages will route to Freshchat`);
        }
      }
    } catch (error) {
      console.error("Error handling chat response:", error);
    }
  }
  /**
   * Handle message routing to Freshchat when handed off to human
   */
  async handleFreshchatMessage(chatRequest, conversationState) {
    try {
      console.log(`\u{1F91D} Routing message to Freshchat for conversation ${conversationState.conversation_id}`);
      const freshchatUserId = this.getFreshchatUserIdForSession(chatRequest.session_id);
      if (!freshchatUserId) {
        return {
          success: false,
          message: "No Freshchat user ID found for this session",
          error_details: { session_id: chatRequest.session_id }
        };
      }
      const freshchatResponse = await sendFreshchatMessage(
        conversationState.freshchat_conversation_id,
        chatRequest.message,
        freshchatUserId,
        chatRequest.auth_token
        // Use auth_token as actor_id for now
      );
      if (freshchatResponse.success) {
        const conversationData = await getFreshchatConversation(
          conversationState.freshchat_conversation_id
        );
        if (conversationData.success && conversationData.conversation_data) {
          const messages = conversationData.conversation_data.messages || [];
          const latestMessage = messages[messages.length - 1];
          const responseText = latestMessage?.message_parts?.[0]?.text?.content || "Message sent to human agent";
          const mockChatResponse = {
            response: responseText,
            display_items: {},
            handoff_to_human: true,
            session_id: chatRequest.session_id,
            conversation_id: conversationState.conversation_id,
            user_id: chatRequest.user_id,
            billing_session_count: 1,
            is_new_session: false,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            metadata: {
              freshchat_conversation_id: conversationState.freshchat_conversation_id,
              agent_state: {
                messages: [],
                user_id: chatRequest.user_id,
                session_id: chatRequest.session_id,
                auth_token: chatRequest.auth_token,
                conversation_id: conversationState.conversation_id,
                conversation_context: {
                  conversation_id: conversationState.conversation_id,
                  session_data: {
                    session_id: chatRequest.session_id,
                    user_id: chatRequest.user_id,
                    user_name: "",
                    user_email: "",
                    status: "active",
                    billing_session_count: 1,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString(),
                    created_at: conversationState.created_at,
                    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
                    metadata: {
                      auth_token: chatRequest.auth_token
                    }
                  },
                  freshchat_conversation_id: conversationState.freshchat_conversation_id,
                  last_response_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                  model_used: "human_agent"
                },
                display_items: {},
                handoff_to_human: true
              }
            }
          };
          return mockChatResponse;
        }
      }
      return {
        success: false,
        message: "Failed to send message via Freshchat",
        error_details: freshchatResponse
      };
    } catch (error) {
      console.error("Error handling Freshchat message:", error);
      return {
        success: false,
        message: "Error routing message to human agent",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Send a simplified chat message
   */
  async sendSimpleMessage(message, userId, sessionId, authToken, metadata, stream, apiBaseURL) {
    const chatRequest = {
      message,
      user_id: userId,
      session_id: sessionId,
      stream: stream || false,
      auth_token: authToken,
      metadata: metadata || {}
    };
    return this.sendMessage(chatRequest, apiBaseURL);
  }
  /**
   * Get API base URL for services API (different from local origin)
   */
  getApiBaseURL() {
    return process.env.NEXT_PUBLIC_SERVICES_API_URL || "http://192.168.50.19:8000";
  }
  /**
   * Store conversation mapping in localStorage
   */
  storeConversationMapping(mapping) {
    if (typeof window === "undefined") return;
    try {
      const mappingKey = `conversation_mapping_${mapping.session_id}`;
      localStorage.setItem(mappingKey, JSON.stringify(mapping));
      const conversationKey = `conversation_${mapping.conversation_id}`;
      localStorage.setItem(conversationKey, JSON.stringify(mapping));
      const freshchatKey = `freshchat_conversation_${mapping.freshchat_conversation_id}`;
      localStorage.setItem(freshchatKey, JSON.stringify(mapping));
    } catch (error) {
      console.error("Error storing conversation mapping:", error);
    }
  }
  /**
   * Get conversation state from localStorage
   */
  getConversationState(sessionId) {
    if (typeof window === "undefined") return null;
    try {
      const mappingKey = `conversation_mapping_${sessionId}`;
      const storedData = localStorage.getItem(mappingKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.error("Error retrieving conversation state:", error);
      return null;
    }
  }
  /**
   * Get Freshchat user ID for a session (placeholder - implement based on your storage strategy)
   */
  getFreshchatUserIdForSession(sessionId) {
    if (typeof window === "undefined") return null;
    try {
      const sessionData = localStorage.getItem(`session_mapping_${sessionId}`);
      if (sessionData) {
        const userId = JSON.parse(sessionData);
        const userIds = this.getUserIdsByUserId(userId);
        return userIds.freshchat_user_id;
      }
      return localStorage.getItem("internal_last_created_freshchat_user") || localStorage.getItem("last_created_freshchat_user");
    } catch (error) {
      console.error("Error getting Freshchat user ID for session:", error);
      return null;
    }
  }
  /**
   * Helper to get user IDs by user ID (placeholder - implement based on your storage)
   */
  getUserIdsByUserId(userId) {
    if (typeof window === "undefined") return { user_id: null, freshchat_user_id: null };
    try {
      const mappingKey = `user_freshchat_mapping_${userId}`;
      const freshchatUserId = localStorage.getItem(mappingKey);
      return {
        user_id: userId,
        freshchat_user_id: freshchatUserId
      };
    } catch (error) {
      console.error("Error getting user IDs:", error);
      return { user_id: null, freshchat_user_id: null };
    }
  }
};
var chatAPI = new ChatAPI();
var sendChatMessage = (chatRequest, apiBaseURL) => chatAPI.sendMessage(chatRequest, apiBaseURL);
var sendSimpleChatMessage = (message, userId, sessionId, authToken, metadata, stream, apiBaseURL) => chatAPI.sendSimpleMessage(message, userId, sessionId, authToken, metadata, stream, apiBaseURL);
var getConversationMapping = (sessionId) => {
  if (typeof window === "undefined") return null;
  try {
    const mappingKey = `conversation_mapping_${sessionId}`;
    const storedData = localStorage.getItem(mappingKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving conversation mapping:", error);
    return null;
  }
};
var getConversationMappingByConversationId = (conversationId) => {
  if (typeof window === "undefined") return null;
  try {
    const conversationKey = `conversation_${conversationId}`;
    const storedData = localStorage.getItem(conversationKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving conversation mapping by conversation ID:", error);
    return null;
  }
};
var getConversationMappingByFreshchatId = (freshchatConversationId) => {
  if (typeof window === "undefined") return null;
  try {
    const freshchatKey = `freshchat_conversation_${freshchatConversationId}`;
    const storedData = localStorage.getItem(freshchatKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving conversation mapping by Freshchat ID:", error);
    return null;
  }
};
var getAllConversationMappings = () => {
  if (typeof window === "undefined") return [];
  try {
    const mappings = [];
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("conversation_mapping_")) {
        const mappingData = localStorage.getItem(key);
        if (mappingData) {
          mappings.push(JSON.parse(mappingData));
        }
      }
    }
    return mappings;
  } catch (error) {
    console.error("Error retrieving all conversation mappings:", error);
    return [];
  }
};
var isConversationHandedOffToHuman = (sessionId) => {
  const mapping = getConversationMapping(sessionId);
  return mapping?.handoff_to_human || false;
};
var clearConversationMapping = (sessionId) => {
  if (typeof window === "undefined") return false;
  try {
    const mapping = getConversationMapping(sessionId);
    if (mapping) {
      localStorage.removeItem(`conversation_mapping_${sessionId}`);
      localStorage.removeItem(`conversation_${mapping.conversation_id}`);
      localStorage.removeItem(`freshchat_conversation_${mapping.freshchat_conversation_id}`);
      console.log(`\u{1F5D1}\uFE0F Cleared conversation mapping for session: ${sessionId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error clearing conversation mapping:", error);
    return false;
  }
};
var clearAllConversationMappings = () => {
  if (typeof window === "undefined") return false;
  try {
    const keys = Object.keys(localStorage);
    let removedCount = 0;
    for (const key of keys) {
      if (key.startsWith("conversation_mapping_") || key.startsWith("conversation_") || key.startsWith("freshchat_conversation_")) {
        localStorage.removeItem(key);
        removedCount++;
      }
    }
    console.log(`\u{1F5D1}\uFE0F Cleared ${removedCount} conversation mappings`);
    return true;
  } catch (error) {
    console.error("Error clearing all conversation mappings:", error);
    return false;
  }
};

// src/de-frontend-types/auth-flow.ts
var AuthFlowAPI = class {
  baseURL;
  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }
  /**
   * Get API base URL from current location or environment
   */
  getApiBaseURL() {
    if (typeof window !== "undefined") {
      return window.location.origin;
    } else {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    }
  }
  /**
   * Get Services API base URL for authentication and user APIs
   */
  getServicesApiBaseURL() {
    return process.env.NEXT_PUBLIC_SERVICES_API_URL || "http://192.168.50.19:8000";
  }
  /**
   * Step 1: Perform actual login via API and extract tokens
   * This calls the real login API and then extracts tokens from the host website
   */
  async performLogin(loginData, apiBaseURL) {
    try {
      console.log("\u{1F510} Performing actual login API call...", {
        jewelerid: loginData.jewelerid,
        userName: loginData.userName
      });
      console.log("\u26A0\uFE0F Skipping external login API due to CORS restrictions");
      console.log("\u{1F504} Simulating successful login for development...");
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const loginResult = {
        success: true,
        auth_token: `mock_auth_token_${Date.now()}`,
        user: {
          jewelerid: loginData.jewelerid,
          username: loginData.userName,
          email: loginData.userName
        },
        message: "Login successful (simulated)"
      };
      console.log("\u2705 Simulated login successful:", {
        hasToken: !!loginResult.auth_token,
        hasUserInfo: !!loginResult.user
      });
      const hostTokens = {
        host_auth_token: "hardcoded_dev_token_12345_abcdef",
        api_key: this.extractAPIKey(),
        session_token: this.extractSessionToken(),
        refresh_token: this.extractRefreshToken()
      };
      if (!hostTokens.host_auth_token) {
        return {
          success: false,
          message: "Failed to get auth token from login API or website",
          error_details: {
            reason: "auth_token_missing",
            login_response: loginResult,
            available_tokens: Object.keys(hostTokens).filter((k) => hostTokens[k])
          }
        };
      }
      console.log("\u2705 Login successful and tokens extracted");
      return {
        success: true,
        message: "Login and token extraction successful",
        data: {
          host_tokens: hostTokens,
          auth_token: hostTokens.host_auth_token,
          user_info: {
            jewelerid: loginData.jewelerid,
            userName: loginData.userName,
            email: loginData.userName,
            // userName is email
            permissions: ["chat", "user_management"]
          },
          login_api_response: loginResult
        }
      };
    } catch (error) {
      console.error("Login/token extraction error:", error);
      return {
        success: false,
        message: "Internal error during login/token extraction",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Extract host_auth_token from the host website
   * This should be implemented based on how you extract tokens from the parent website
   */
  extractHostAuthToken() {
    if (typeof window === "undefined") return null;
    try {
      const hostToken = localStorage.getItem("host_auth_token") || localStorage.getItem("auth_token") || localStorage.getItem("access_token");
      if (hostToken) {
        console.log("\u{1F511} Found host_auth_token in localStorage");
        return hostToken;
      }
      const sessionToken = sessionStorage.getItem("host_auth_token") || sessionStorage.getItem("auth_token") || sessionStorage.getItem("access_token");
      if (sessionToken) {
        console.log("\u{1F511} Found host_auth_token in sessionStorage");
        return sessionToken;
      }
      const cookieToken = this.getTokenFromCookies();
      if (cookieToken) {
        console.log("\u{1F511} Found host_auth_token in cookies");
        return cookieToken;
      }
      if (window.parent && window.parent !== window) {
        try {
          const parentToken = window.parent.localStorage?.getItem("host_auth_token");
          if (parentToken) {
            console.log("\u{1F511} Found host_auth_token in parent window");
            return parentToken;
          }
        } catch (e) {
        }
      }
      console.warn("\u26A0\uFE0F No host_auth_token found, generating default for development");
      return `dev_host_token_${Date.now()}`;
    } catch (error) {
      console.error("Error extracting host_auth_token:", error);
      return null;
    }
  }
  /**
   * Extract API key from host website
   */
  extractAPIKey() {
    if (typeof window === "undefined") return void 0;
    return localStorage.getItem("api_key") || sessionStorage.getItem("api_key") || void 0;
  }
  /**
   * Extract session token from host website
   */
  extractSessionToken() {
    if (typeof window === "undefined") return void 0;
    return localStorage.getItem("session_token") || sessionStorage.getItem("session_token") || void 0;
  }
  /**
   * Extract refresh token from host website
   */
  extractRefreshToken() {
    if (typeof window === "undefined") return void 0;
    return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token") || void 0;
  }
  /**
   * Get token from cookies
   */
  getTokenFromCookies() {
    if (typeof document === "undefined") return null;
    try {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "host_auth_token" || name === "auth_token" || name === "access_token") {
          return decodeURIComponent(value);
        }
      }
      return null;
    } catch (error) {
      console.error("Error reading cookies:", error);
      return null;
    }
  }
  /**
   * Complete Authentication Flow with User Details
   * Performs login → create user → create session → store data
   */
  async completeAuthenticationFlowWithDetails(userDetailsData, apiBaseURL) {
    console.log("\u{1F510} Starting complete authentication flow with user details...", {
      jewelerid: userDetailsData.jewelerid,
      userName: userDetailsData.userName,
      email: userDetailsData.email,
      first_name: userDetailsData.first_name,
      last_name: userDetailsData.last_name
    });
    try {
      console.log("Step 1: Performing login and token extraction...");
      const loginResponse = await this.performLogin({
        jewelerid: userDetailsData.jewelerid,
        userName: userDetailsData.userName,
        password: userDetailsData.password
      }, apiBaseURL);
      if (!loginResponse.success || !loginResponse.data?.host_tokens?.host_auth_token) {
        console.error("\u274C Login failed:", loginResponse.message);
        return {
          step: "login",
          success: false,
          message: `Login failed: ${loginResponse.message}`,
          error_details: loginResponse.error_details
        };
      }
      const hostAuthToken = loginResponse.data.host_tokens.host_auth_token;
      console.log("\u2705 Login successful, host_auth_token obtained");
      console.log("Step 2: Creating user via internal API with user details...");
      const referenceId = userDetailsData.reference_id || `${userDetailsData.first_name.toLowerCase()}@${userDetailsData.last_name.toLowerCase()}`;
      console.log("\u{1F464} User details for creation:", {
        email: userDetailsData.email,
        first_name: userDetailsData.first_name,
        last_name: userDetailsData.last_name,
        phone: userDetailsData.phone,
        reference_id: referenceId,
        org_id: userDetailsData.jewelerid
      });
      const userResponse = await createInternalUser(
        {
          user_email: userDetailsData.email,
          org_id: userDetailsData.jewelerid,
          user_name: userDetailsData.userName,
          first_name: userDetailsData.first_name,
          last_name: userDetailsData.last_name,
          phone: userDetailsData.phone,
          reference_id: referenceId
        },
        hostAuthToken,
        apiBaseURL
      );
      if (!userResponse.success || !userResponse.user_id) {
        console.error("\u274C User creation failed:", userResponse.message);
        return {
          step: "create_user",
          success: false,
          message: `User creation failed: ${userResponse.message}`,
          data: {
            login_response: loginResponse,
            host_tokens: loginResponse.data.host_tokens
          },
          error_details: userResponse.error_details
        };
      }
      const userId = userResponse.user_id;
      const freshchatUserId = userResponse.freshchat_user_id || "";
      console.log("\u2705 User created successfully:", { userId, freshchatUserId });
      console.log("Step 3: Creating session...");
      const sessionResponse = await createSession(
        {
          user_id: userId,
          auth_token: loginResponse.data.auth_token || hostAuthToken,
          metadata: {
            jewelerid: userDetailsData.jewelerid,
            userName: userDetailsData.userName,
            email: userDetailsData.email,
            first_name: userDetailsData.first_name,
            last_name: userDetailsData.last_name,
            phone: userDetailsData.phone,
            reference_id: referenceId,
            login_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            flow_version: "1.0"
          }
        },
        hostAuthToken,
        // Pass the hardcoded host auth token
        apiBaseURL
      );
      if (!sessionResponse.success || !sessionResponse.session_id) {
        console.error("\u274C Session creation failed:", sessionResponse.message);
        return {
          step: "create_session",
          success: false,
          message: `Session creation failed: ${sessionResponse.message}`,
          data: {
            login_response: loginResponse,
            host_tokens: loginResponse.data.host_tokens,
            user_id: userId,
            freshchat_user_id: freshchatUserId
          },
          error_details: sessionResponse.error_details
        };
      }
      const sessionId = sessionResponse.session_id;
      const authToken = loginResponse.data.auth_token || hostAuthToken;
      console.log("\u2705 Session created successfully:", { sessionId });
      console.log("Step 4: Storing complete authentication data...");
      const completeAuthData = {
        // Authentication info
        jewelerid: userDetailsData.jewelerid,
        userName: userDetailsData.userName,
        isAuthenticated: true,
        // Host tokens
        host_auth_token: hostAuthToken,
        host_tokens: loginResponse.data.host_tokens,
        // User info
        user_id: userId,
        freshchat_user_id: freshchatUserId,
        // Session info
        session_id: sessionId,
        auth_token: authToken,
        // Timestamps
        login_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        user_created_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        session_created_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        // Metadata
        login_count: this.getLoginCount(userDetailsData.jewelerid) + 1,
        flow_version: "1.0"
      };
      this.storeCompleteAuthData(completeAuthData);
      console.log("\u2705 Complete authentication flow successful!");
      console.log("\u{1F4CA} Auth Summary:", {
        jewelerid: userDetailsData.jewelerid,
        email: userDetailsData.email,
        full_name: `${userDetailsData.first_name} ${userDetailsData.last_name}`,
        phone: userDetailsData.phone,
        reference_id: referenceId,
        user_id: userId,
        session_id: sessionId,
        freshchat_user_id: freshchatUserId,
        has_host_token: !!hostAuthToken
      });
      return {
        step: "complete",
        success: true,
        message: "Complete authentication flow successful",
        data: {
          login_response: loginResponse,
          host_tokens: loginResponse.data.host_tokens,
          user_id: userId,
          freshchat_user_id: freshchatUserId,
          session_id: sessionId,
          auth_token: authToken,
          complete_auth_data: completeAuthData
        }
      };
    } catch (error) {
      console.error("\u274C Complete authentication flow error:", error);
      return {
        step: "error",
        success: false,
        message: "Internal error during authentication flow",
        error_details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
  /**
   * Legacy authentication flow (backward compatibility)
   * This version tries to extract user details from userName (email)
   */
  async completeAuthenticationFlow(loginData, apiBaseURL) {
    const emailParts = loginData.userName.split("@");
    const firstName = emailParts[0] || "User";
    const lastName = emailParts[1]?.split(".")[0] || "Name";
    const userDetailsData = {
      jewelerid: loginData.jewelerid,
      userName: loginData.userName,
      password: loginData.password,
      email: loginData.userName,
      // userName is email
      first_name: firstName,
      last_name: lastName,
      phone: "",
      // No phone provided in basic form
      reference_id: `${firstName.toLowerCase()}@${lastName.toLowerCase()}`
    };
    console.log("\u26A0\uFE0F Using legacy authentication flow - consider using completeAuthenticationFlowWithDetails for better user data");
    return this.completeAuthenticationFlowWithDetails(userDetailsData, apiBaseURL);
  }
  /**
   * Quick authentication flow with user details
   */
  async authenticateUserWithDetails(jewelerid, userName, password, email, firstName, lastName, phone, referenceId, apiBaseURL) {
    return this.completeAuthenticationFlowWithDetails({
      jewelerid,
      userName,
      password,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      reference_id: referenceId
    }, apiBaseURL);
  }
  /**
   * Quick authentication flow (simplified parameters) - Legacy
   */
  async authenticateUser(jewelerid, userName, password, apiBaseURL) {
    return this.completeAuthenticationFlow(
      { jewelerid, userName, password },
      apiBaseURL
    );
  }
  /**
   * Store complete authentication data in localStorage
   */
  storeCompleteAuthData(authData) {
    if (typeof window === "undefined") return;
    try {
      const authKey = `complete_auth_${authData.jewelerid}`;
      localStorage.setItem(authKey, JSON.stringify(authData));
      localStorage.setItem("current_auth_jewelerid", authData.jewelerid);
      localStorage.setItem("current_auth_user_id", authData.user_id);
      localStorage.setItem("current_auth_session_id", authData.session_id);
      localStorage.setItem("current_auth_host_token", authData.host_auth_token);
      const credentials = {
        jewelerid: authData.jewelerid,
        userName: authData.userName,
        lastLogin: authData.login_timestamp,
        loginCount: authData.login_count,
        hostTokens: authData.host_tokens,
        sessionInfo: {
          sessionId: authData.session_id,
          userId: authData.user_id,
          authToken: authData.auth_token
        }
      };
      localStorage.setItem(`auth_credentials_${authData.jewelerid}`, JSON.stringify(credentials));
      localStorage.setItem(`login_count_${authData.jewelerid}`, authData.login_count.toString());
      console.log("\u{1F4BE} Complete authentication data stored in localStorage");
    } catch (error) {
      console.error("Error storing complete auth data:", error);
    }
  }
  /**
   * Get login count for jeweler
   */
  getLoginCount(jewelerid) {
    if (typeof window === "undefined") return 0;
    try {
      const count = localStorage.getItem(`login_count_${jewelerid}`);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error("Error getting login count:", error);
      return 0;
    }
  }
};
var authFlowAPI = new AuthFlowAPI();
var completeAuthenticationFlowWithDetails = (userDetailsData, apiBaseURL) => authFlowAPI.completeAuthenticationFlowWithDetails(userDetailsData, apiBaseURL);
var authenticateUserWithDetails = (jewelerid, userName, password, email, firstName, lastName, phone, referenceId, apiBaseURL) => authFlowAPI.authenticateUserWithDetails(jewelerid, userName, password, email, firstName, lastName, phone, referenceId, apiBaseURL);
var completeAuthenticationFlow = (loginData, apiBaseURL) => authFlowAPI.completeAuthenticationFlow(loginData, apiBaseURL);
var authenticateUser = (jewelerid, userName, password, apiBaseURL) => authFlowAPI.authenticateUser(jewelerid, userName, password, apiBaseURL);
var getCompleteAuthData = (jewelerid) => {
  if (typeof window === "undefined") return null;
  try {
    const authKey = `complete_auth_${jewelerid}`;
    const storedData = localStorage.getItem(authKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving complete auth data:", error);
    return null;
  }
};
var getCurrentAuthData = () => {
  if (typeof window === "undefined") return null;
  try {
    const currentJewelerid = localStorage.getItem("current_auth_jewelerid");
    if (currentJewelerid) {
      return getCompleteAuthData(currentJewelerid);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving current auth data:", error);
    return null;
  }
};
var isUserAuthenticated = (jewelerid) => {
  if (typeof window === "undefined") return false;
  try {
    const authData = jewelerid ? getCompleteAuthData(jewelerid) : getCurrentAuthData();
    return authData?.isAuthenticated || false;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};
var getCurrentHostAuthToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("current_auth_host_token");
  } catch (error) {
    console.error("Error getting current host auth token:", error);
    return null;
  }
};
var getCurrentUserId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("current_auth_user_id");
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
};
var getCurrentSessionId = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("current_auth_session_id");
  } catch (error) {
    console.error("Error getting current session ID:", error);
    return null;
  }
};
var getAuthenticationState = (jewelerid) => {
  const authData = jewelerid ? getCompleteAuthData(jewelerid) : getCurrentAuthData();
  return {
    isAuthenticated: authData?.isAuthenticated || false,
    isAuthenticating: false,
    // This would be managed by UI state
    loginError: null,
    // This would be managed by UI state
    lastLoginAttempt: authData?.login_timestamp,
    loginSuccess: authData?.isAuthenticated || false
  };
};
var clearAuthenticationData = (jewelerid) => {
  if (typeof window === "undefined") return false;
  try {
    if (jewelerid) {
      localStorage.removeItem(`complete_auth_${jewelerid}`);
      localStorage.removeItem(`auth_credentials_${jewelerid}`);
      localStorage.removeItem(`login_count_${jewelerid}`);
      const currentJewelerid = localStorage.getItem("current_auth_jewelerid");
      if (currentJewelerid === jewelerid) {
        localStorage.removeItem("current_auth_jewelerid");
        localStorage.removeItem("current_auth_user_id");
        localStorage.removeItem("current_auth_session_id");
        localStorage.removeItem("current_auth_host_token");
      }
    } else {
      const currentJewelerid = localStorage.getItem("current_auth_jewelerid");
      if (currentJewelerid) {
        localStorage.removeItem(`complete_auth_${currentJewelerid}`);
        localStorage.removeItem(`auth_credentials_${currentJewelerid}`);
      }
      localStorage.removeItem("current_auth_jewelerid");
      localStorage.removeItem("current_auth_user_id");
      localStorage.removeItem("current_auth_session_id");
      localStorage.removeItem("current_auth_host_token");
    }
    console.log("\u{1F5D1}\uFE0F Authentication data cleared");
    return true;
  } catch (error) {
    console.error("Error clearing authentication data:", error);
    return false;
  }
};
var clearAllAuthenticationData = () => {
  if (typeof window === "undefined") return false;
  try {
    const keys = Object.keys(localStorage);
    let removedCount = 0;
    for (const key of keys) {
      if (key.startsWith("complete_auth_") || key.startsWith("auth_credentials_") || key.startsWith("login_count_") || key.startsWith("current_auth_")) {
        localStorage.removeItem(key);
        removedCount++;
      }
    }
    console.log(`\u{1F5D1}\uFE0F Cleared ${removedCount} authentication items`);
    return true;
  } catch (error) {
    console.error("Error clearing all authentication data:", error);
    return false;
  }
};
var getAllStoredJewelerIds = () => {
  if (typeof window === "undefined") return [];
  try {
    const keys = Object.keys(localStorage);
    const jewelerIds = [];
    for (const key of keys) {
      if (key.startsWith("complete_auth_")) {
        const jewelerid = key.replace("complete_auth_", "");
        jewelerIds.push(jewelerid);
      }
    }
    return jewelerIds;
  } catch (error) {
    console.error("Error getting stored jeweler IDs:", error);
    return [];
  }
};

// src/de-frontend-types/index.ts
var AshiDAPI = class {
  // Individual API services
  // public readonly auth = authAPI;
  // public readonly products = productsAPI;
  // public readonly cart = cartAPI;
  // public readonly quotations = quotationsAPI;
  // public readonly wishlist = wishlistAPI;
  // public readonly specialOrders = specialOrdersAPI;
  // public readonly customQuote = customQuoteAPI;
  // public readonly orderStatus = orderStatusAPI;
  // public readonly catalogProgram = catalogProgramAPI;
  // public readonly email = emailAPI;
  // public readonly freshchat = freshchatAPI;
  // public readonly internalUser = internalUserAPI;
  // public readonly session = sessionAPI;
  // public readonly chat = chatAPI;
  // public readonly authFlow = authFlowAPI;
  // API client for direct access
  // public readonly client = apiClient;
  constructor() {
    this.setupGlobalErrorHandling();
  }
  /**
   * Setup global error handling for all API calls
   */
  setupGlobalErrorHandling() {
    if (typeof window !== "undefined") {
      window.addEventListener("auth:expired", () => {
        console.warn("Authentication expired - user needs to login again");
      });
      window.addEventListener("auth:logout", () => {
        console.info("User logged out");
      });
    }
  }
  /**
   * Initialize the API with configuration
   */
  initialize(config = {}) {
    console.info("AshiD API initialized", {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_ASHID_API_URL || "https://aichatbotbeta.ashidiamonds.com",
      isAuthenticated: false
    });
  }
  /**
   * Check overall API health
   */
  async healthCheck() {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const clientHealth = true;
      const authHealth = false;
      return {
        client: clientHealth,
        authentication: authHealth,
        timestamp
      };
    } catch (error) {
      return {
        client: false,
        authentication: false,
        timestamp
      };
    }
  }
  /**
   * Clear all cached data and authentication
   */
  clearAllData() {
    if (typeof window !== "undefined") {
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => key.startsWith("ashid_") || key.startsWith("ashi_")
      );
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  }
  /**
   * Get current user context (auth + basic info)
   */
  getCurrentContext() {
    const auth = { isAuthenticated: false, userInfo: null, expiresAt: null };
    return {
      isAuthenticated: auth.isAuthenticated,
      user: auth.userInfo,
      permissions: [],
      // Could be extracted from JWT or user info
      lastActivity: auth.expiresAt
    };
  }
  /**
   * Setup authentication from stored credentials
   */
  async restoreAuthentication() {
    try {
      const auth = { isAuthenticated: false, token: null };
      if (auth.isAuthenticated && auth.token) ;
      return false;
    } catch (error) {
      return false;
    }
  }
};
var api = new AshiDAPI();
var useAshiDAPI = () => {
  return {
    api,
    isAuthenticated: false,
    // api.auth.isAuthenticated(),
    healthCheck: api.healthCheck,
    initialize: api.initialize
  };
};
var API_CONFIG = {
  BASE_URLS: {
    PRODUCTION: "https://aichatbotbeta.ashidiamonds.com",
    STAGING: "https://staging.ashidiamonds.com",
    // If exists
    DEVELOPMENT: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  },
  TIMEOUTS: {
    DEFAULT: 3e4,
    UPLOAD: 6e4,
    DOWNLOAD: 45e3
  },
  RETRY_CONFIG: {
    ATTEMPTS: 3,
    DELAY: 1e3,
    BACKOFF_FACTOR: 2
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
};
var API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/authentication/login"
  },
  PRODUCTS: {
    SEARCH: "/api/products/search",
    DETAILS: "/api/products/{style_id}/details",
    VARIANTS: "/api/products/{style_id}/variants",
    SPECIFICATIONS: "/api/products/{style_id}/specifications"
  },
  CART: {
    VIEW: "/api/cart",
    ADD: "/api/cart/add",
    PLACE_ORDER: "/api/cart/placeorder"
  },
  QUOTATIONS: {
    CREATE: "/api/salesquotation/create",
    ADD_ITEM: "/api/salesquotation/additem",
    REMOVE_ITEMS: "/api/salesquotation/removeitems",
    MOVE_TO_CART: "/api/salesquotation/movetocart"
  },
  WISHLIST: {
    VIEW: "/api/wishlist",
    ADD: "/api/wishlist/add",
    MOVE_TO_CART: "/api/wishlist/movetocart"
  },
  SPECIAL_ORDERS: {
    OPTIONS: "/api/specialorder/special_order_options",
    CHECK_VARIANT: "/api/specialorder/checkspovariant"
  }
};
console.info("AshiD API module loaded", {
  version: "1.0.0",
  endpoints: Object.keys(API_ENDPOINTS).length,
  services: ["auth", "products", "cart", "quotations", "wishlist", "specialOrders", "customQuote", "orderStatus", "catalogProgram", "email", "internalUser", "session", "chat", "authFlow", "freshchat"]
});

exports.API_CONFIG = API_CONFIG;
exports.API_ENDPOINTS = API_ENDPOINTS;
exports.ApiClient = client_default;
exports.AshiDAPI = AshiDAPI;
exports.AuthAPI = AuthAPI;
exports.AuthFlowAPI = AuthFlowAPI;
exports.CartAPI = CartAPI;
exports.CatalogProgramAPI = CatalogProgramAPI;
exports.ChatAPI = ChatAPI;
exports.CustomQuoteAPI = CustomQuoteAPI;
exports.EmailAPI = EmailAPI;
exports.FreshchatAPI = FreshchatAPI;
exports.InternalUserAPI = InternalUserAPI;
exports.OrderStatusAPI = OrderStatusAPI;
exports.ProductsAPI = ProductsAPI;
exports.QuotationsAPI = QuotationsAPI;
exports.SessionAPI = SessionAPI;
exports.SpecialOrdersAPI = SpecialOrdersAPI;
exports.WishlistAPI = WishlistAPI;
exports.api = api;
exports.apiClient = apiClient;
exports.authAPI = authAPI;
exports.authFlowAPI = authFlowAPI;
exports.authenticateUser = authenticateUser;
exports.authenticateUserWithDetails = authenticateUserWithDetails;
exports.cartAPI = cartAPI;
exports.catalogProgramAPI = catalogProgramAPI;
exports.chatAPI = chatAPI;
exports.clearAllAuthenticationData = clearAllAuthenticationData;
exports.clearAllConversationMappings = clearAllConversationMappings;
exports.clearAllStoredFreshchatUsers = clearAllStoredFreshchatUsers;
exports.clearAllStoredSessions = clearAllStoredSessions;
exports.clearAuthenticationData = clearAuthenticationData;
exports.clearConversationMapping = clearConversationMapping;
exports.completeAuthenticationFlow = completeAuthenticationFlow;
exports.completeAuthenticationFlowWithDetails = completeAuthenticationFlowWithDetails;
exports.createFreshchatUser = createFreshchatUser;
exports.createInternalUser = createInternalUser;
exports.createInternalUserSimplified = createInternalUserSimplified;
exports.createSession = createSession;
exports.createSessionSimplified = createSessionSimplified;
exports.customQuoteAPI = customQuoteAPI;
exports.emailAPI = emailAPI;
exports.freshchatAPI = freshchatAPI;
exports.getAllConversationMappings = getAllConversationMappings;
exports.getAllStoredFreshchatUsers = getAllStoredFreshchatUsers;
exports.getAllStoredInternalUsers = getAllStoredInternalUsers;
exports.getAllStoredJewelerIds = getAllStoredJewelerIds;
exports.getAllStoredSessions = getAllStoredSessions;
exports.getAuthenticationState = getAuthenticationState;
exports.getCompleteAuthData = getCompleteAuthData;
exports.getConversationMapping = getConversationMapping;
exports.getConversationMappingByConversationId = getConversationMappingByConversationId;
exports.getConversationMappingByFreshchatId = getConversationMappingByFreshchatId;
exports.getCurrentActiveSessionId = getCurrentActiveSessionId;
exports.getCurrentAuthData = getCurrentAuthData;
exports.getCurrentHostAuthToken = getCurrentHostAuthToken;
exports.getCurrentSessionId = getCurrentSessionId;
exports.getCurrentUserId = getCurrentUserId;
exports.getFreshchatConversation = getFreshchatConversation;
exports.getFreshchatUserById = getFreshchatUserById;
exports.getFreshchatUserByReferenceId = getFreshchatUserByReferenceId;
exports.getFreshchatUserIdByUserId = getFreshchatUserIdByUserId;
exports.getHostAuthToken = getHostAuthToken;
exports.getLastCreatedFreshchatUserId = getLastCreatedFreshchatUserId;
exports.getLastCreatedInternalFreshchatUserId = getLastCreatedInternalFreshchatUserId;
exports.getLastCreatedInternalUserId = getLastCreatedInternalUserId;
exports.getLastCreatedSessionId = getLastCreatedSessionId;
exports.getStoredFreshchatUser = getStoredFreshchatUser;
exports.getStoredInternalUser = getStoredInternalUser;
exports.getStoredSession = getStoredSession;
exports.getUserIdBySessionId = getUserIdBySessionId;
exports.getUserIdsByReferenceId = getUserIdsByReferenceId;
exports.internalUserAPI = internalUserAPI;
exports.isConversationHandedOffToHuman = isConversationHandedOffToHuman;
exports.isInternalUserStoredLocally = isInternalUserStoredLocally;
exports.isSessionStoredLocally = isSessionStoredLocally;
exports.isUserAuthenticated = isUserAuthenticated;
exports.isUserStoredLocally = isUserStoredLocally;
exports.orderStatusAPI = orderStatusAPI;
exports.productsAPI = productsAPI;
exports.quotationsAPI = quotationsAPI;
exports.removeStoredFreshchatUser = removeStoredFreshchatUser;
exports.removeStoredSession = removeStoredSession;
exports.sendChatMessage = sendChatMessage;
exports.sendFreshchatMessage = sendFreshchatMessage;
exports.sendFreshchatMessageWithMixedButtons = sendFreshchatMessageWithMixedButtons;
exports.sendFreshchatMessageWithQuickReplies = sendFreshchatMessageWithQuickReplies;
exports.sendFreshchatMessageWithUrlButtons = sendFreshchatMessageWithUrlButtons;
exports.sendFreshchatTextMessage = sendFreshchatTextMessage;
exports.sendSimpleChatMessage = sendSimpleChatMessage;
exports.sessionAPI = sessionAPI;
exports.setCurrentActiveSession = setCurrentActiveSession;
exports.specialOrdersAPI = specialOrdersAPI;
exports.updateFreshchatUserProperties = updateFreshchatUserProperties;
exports.useAshiDAPI = useAshiDAPI;
exports.wishlistAPI = wishlistAPI;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map