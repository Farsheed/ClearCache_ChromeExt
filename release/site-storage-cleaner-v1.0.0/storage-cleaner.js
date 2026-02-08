/**
 * StorageCleaner - A comprehensive client-side storage clearing library
 * 
 * This library provides functionality to clear various types of browser storage:
 * - Cookies (HTTP cookies stored by the browser)
 * - localStorage (persistent key-value storage)
 * - sessionStorage (session-based key-value storage)
 * - IndexedDB (client-side database)
 * - Cache Storage (Service Worker caches)
 * 
 * Note: JavaScript cannot directly clear the browser's HTTP cache due to security
 * restrictions. The Cache API only clears Service Worker caches.
 */

class StorageCleaner {
  constructor(options = {}) {
    // Configuration options with defaults
    this.options = {
      buttonText: options.buttonText || 'Clear All Storage',
      buttonId: options.buttonId || 'storage-cleaner-btn',
      containerId: options.containerId || null,
      confirmBeforeClear: options.confirmBeforeClear !== false, // Default true
      onSuccess: options.onSuccess || null,
      onError: options.onError || null,
      styles: options.styles || this.getDefaultStyles(),
      logResults: options.logResults !== false // Default true
    };

    this.button = null;
    this.results = {
      cookies: { cleared: 0, errors: [] },
      localStorage: { success: false, error: null },
      sessionStorage: { success: false, error: null },
      indexedDB: { cleared: 0, errors: [] },
      cacheStorage: { cleared: 0, errors: [] }
    };
  }

  /**
   * Default button styles
   * These styles create a modern, accessible button
   */
  getDefaultStyles() {
    return {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
  }

  /**
   * Apply styles to the button element
   */
  applyStyles(element, styles) {
    Object.keys(styles).forEach(property => {
      element.style[property] = styles[property];
    });
  }

  /**
   * Create and render the clear storage button
   */
  createButton() {
    // Create button element
    this.button = document.createElement('button');
    this.button.id = this.options.buttonId;
    this.button.textContent = this.options.buttonText;
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('aria-label', 'Clear all browser storage');

    // Apply styles
    this.applyStyles(this.button, this.options.styles);

    // Add hover effect
    this.button.addEventListener('mouseenter', () => {
      this.button.style.backgroundColor = '#c82333';
      this.button.style.transform = 'translateY(-1px)';
      this.button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    });

    this.button.addEventListener('mouseleave', () => {
      this.button.style.backgroundColor = this.options.styles.backgroundColor;
      this.button.style.transform = 'translateY(0)';
      this.button.style.boxShadow = this.options.styles.boxShadow;
    });

    // Add click handler
    this.button.addEventListener('click', () => this.handleClearClick());

    // Append to container or body
    const container = this.options.containerId 
      ? document.getElementById(this.options.containerId)
      : document.body;

    if (container) {
      container.appendChild(this.button);
    } else {
      console.error(`Container with id "${this.options.containerId}" not found`);
    }

    return this.button;
  }

  /**
   * Handle button click event
   */
  async handleClearClick() {
    // Show confirmation dialog if enabled
    if (this.options.confirmBeforeClear) {
      const confirmed = confirm(
        'Are you sure you want to clear all storage?\n\n' +
        'This will remove:\n' +
        '• All cookies\n' +
        '• localStorage data\n' +
        '• sessionStorage data\n' +
        '• IndexedDB databases\n' +
        '• Cache storage\n\n' +
        'This action cannot be undone.'
      );

      if (!confirmed) {
        return;
      }
    }

    // Disable button during clearing
    this.button.disabled = true;
    this.button.textContent = 'Clearing...';
    this.button.style.cursor = 'not-allowed';
    this.button.style.opacity = '0.6';

    try {
      // Clear all storage types
      await this.clearAllStorage();

      // Re-enable button
      this.button.disabled = false;
      this.button.textContent = '✓ Cleared!';
      this.button.style.cursor = 'pointer';
      this.button.style.opacity = '1';
      this.button.style.backgroundColor = '#28a745';

      // Reset button after 2 seconds
      setTimeout(() => {
        this.button.textContent = this.options.buttonText;
        this.button.style.backgroundColor = this.options.styles.backgroundColor;
      }, 2000);

      // Call success callback
      if (this.options.onSuccess) {
        this.options.onSuccess(this.results);
      }

      // Log results if enabled
      if (this.options.logResults) {
        this.logResults();
      }

    } catch (error) {
      // Handle errors
      this.button.disabled = false;
      this.button.textContent = '✗ Error';
      this.button.style.cursor = 'pointer';
      this.button.style.opacity = '1';
      this.button.style.backgroundColor = '#ffc107';

      setTimeout(() => {
        this.button.textContent = this.options.buttonText;
        this.button.style.backgroundColor = this.options.styles.backgroundColor;
      }, 2000);

      if (this.options.onError) {
        this.options.onError(error, this.results);
      }

      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Clear all storage types
   */
  async clearAllStorage() {
    // Reset results
    this.results = {
      cookies: { cleared: 0, errors: [] },
      localStorage: { success: false, error: null },
      sessionStorage: { success: false, error: null },
      indexedDB: { cleared: 0, errors: [] },
      cacheStorage: { cleared: 0, errors: [] }
    };

    // Clear each storage type
    await Promise.all([
      this.clearCookies(),
      this.clearLocalStorage(),
      this.clearSessionStorage(),
      this.clearIndexedDB(),
      this.clearCacheStorage()
    ]);
  }

  /**
   * Clear all cookies
   * Cookies are small pieces of data stored by websites in the user's browser
   * They typically contain session information, preferences, and tracking data
   */
  async clearCookies() {
    try {
      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        if (name) {
          // Delete cookie for current path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          
          // Delete cookie for root domain
          const domain = window.location.hostname;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${domain};path=/`;
          
          // Delete cookie for parent domain (if subdomain)
          const parts = domain.split('.');
          if (parts.length > 2) {
            const parentDomain = parts.slice(-2).join('.');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${parentDomain};path=/`;
          }

          this.results.cookies.cleared++;
        }
      }
    } catch (error) {
      this.results.cookies.errors.push(error.message);
    }
  }

  /**
   * Clear localStorage
   * localStorage provides persistent storage that survives browser restarts
   * It stores data as key-value pairs (strings) with no expiration time
   * Maximum storage: typically 5-10MB depending on browser
   */
  async clearLocalStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
        this.results.localStorage.success = true;
      }
    } catch (error) {
      this.results.localStorage.error = error.message;
    }
  }

  /**
   * Clear sessionStorage
   * sessionStorage is similar to localStorage but data is cleared when the page session ends
   * A page session lasts as long as the browser tab is open (includes page reloads)
   * Maximum storage: typically 5-10MB depending on browser
   */
  async clearSessionStorage() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
        this.results.sessionStorage.success = true;
      }
    } catch (error) {
      this.results.sessionStorage.error = error.message;
    }
  }

  /**
   * Clear IndexedDB databases
   * IndexedDB is a low-level API for client-side storage of significant amounts of structured data
   * It can store much more data than localStorage (typically hundreds of MB to GB)
   * Used for complex data structures, files, and offline applications
   */
  async clearIndexedDB() {
    try {
      if (typeof indexedDB !== 'undefined') {
        const databases = await indexedDB.databases();
        
        for (const db of databases) {
          try {
            await new Promise((resolve, reject) => {
              const request = indexedDB.deleteDatabase(db.name);
              request.onsuccess = () => {
                this.results.indexedDB.cleared++;
                resolve();
              };
              request.onerror = () => reject(request.error);
              request.onblocked = () => {
                console.warn(`IndexedDB "${db.name}" deletion blocked`);
                resolve(); // Still count as attempted
              };
            });
          } catch (error) {
            this.results.indexedDB.errors.push(`${db.name}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.results.indexedDB.errors.push(error.message);
    }
  }

  /**
   * Clear Cache Storage (Service Worker caches)
   * The Cache API provides storage for Request/Response object pairs
   * Used by Service Workers for offline functionality and performance optimization
   * Note: This does NOT clear the browser's HTTP cache (not accessible via JavaScript)
   */
  async clearCacheStorage() {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
          try {
            await caches.delete(cacheName);
            this.results.cacheStorage.cleared++;
          } catch (error) {
            this.results.cacheStorage.errors.push(`${cacheName}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.results.cacheStorage.errors.push(error.message);
    }
  }

  /**
   * Log clearing results to console
   */
  logResults() {
    console.group('🧹 Storage Clearing Results');
    console.log('Cookies:', this.results.cookies);
    console.log('localStorage:', this.results.localStorage);
    console.log('sessionStorage:', this.results.sessionStorage);
    console.log('IndexedDB:', this.results.indexedDB);
    console.log('Cache Storage:', this.results.cacheStorage);
    console.groupEnd();
  }

  /**
   * Programmatically clear storage without button interaction
   */
  async clear() {
    await this.clearAllStorage();
    if (this.options.logResults) {
      this.logResults();
    }
    return this.results;
  }

  /**
   * Initialize the library by creating the button
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createButton());
    } else {
      this.createButton();
    }
    return this;
  }

  /**
   * Remove the button from the DOM
   */
  destroy() {
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button);
      this.button = null;
    }
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageCleaner;
}
if (typeof window !== 'undefined') {
  window.StorageCleaner = StorageCleaner;
}
