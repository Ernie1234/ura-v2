/**
 * Token Storage Utility
 * Provides secure token storage with localStorage as fallback when httpOnly cookies aren't available
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  /**
   * Save access token
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  /**
   * Get access token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  /**
   * Save refresh token
   */
  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save refresh token:', error);
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },

  /**
   * Remove all tokens
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  /**
   * Check if user has valid token
   */
  hasToken(): boolean {
    return !!this.getToken();
  },
};
