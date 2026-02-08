/**
 * Background Service Worker
 * Handles storage clearing operations and extension lifecycle events
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      confirmBeforeClear: true,
      autoClear: false,
      showNotifications: true,
      showButton: true,
      clearCookies: true,
      clearLocalStorage: true,
      clearSessionStorage: true,
      clearIndexedDB: true,
      clearCache: true
    });
    
    console.log('Site Storage Cleaner installed successfully');
  }
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'clear-site-storage',
    title: 'Clear storage for this site',
    contexts: ['page']
  });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clearSite') {
    handleClearSite(request)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(null, (settings) => {
      sendResponse({ settings });
    });
    return true;
  }
});

/**
 * Handle clearing storage for a specific site
 */
async function handleClearSite(request) {
  const { domain, url, settings } = request;
  
  console.log('Starting to clear storage for:', domain);
  
  try {
    const results = {
      cookies: 0,
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      cache: false
    };
    
    // Clear cookies
    if (settings.clearCookies) {
      try {
        results.cookies = await clearCookies(domain);
        console.log('Cleared cookies:', results.cookies);
      } catch (error) {
        console.error('Cookie clearing error:', error);
      }
    }
    
    // Clear localStorage, sessionStorage, IndexedDB via browsingData API
    if (settings.clearLocalStorage || settings.clearSessionStorage || settings.clearIndexedDB) {
      try {
        await clearBrowsingData(domain, settings);
        results.localStorage = settings.clearLocalStorage;
        results.sessionStorage = settings.clearSessionStorage;
        results.indexedDB = settings.clearIndexedDB;
        console.log('Cleared browsing data');
      } catch (error) {
        console.error('Browsing data clearing error:', error);
      }
    }
    
    // Clear cache storage
    if (settings.clearCache) {
      try {
        results.cache = await clearCacheStorage(domain);
        console.log('Cleared cache storage');
      } catch (error) {
        console.error('Cache clearing error:', error);
      }
    }
    
    // Show notification if enabled
    if (settings.showNotifications) {
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Storage Cleared',
          message: 'Cleared storage for ' + domain
        });
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
    
    console.log('Storage clearing completed successfully');
    return { success: true, results };
    
  } catch (error) {
    console.error('Error clearing storage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear cookies for a domain
 */
async function clearCookies(domain) {
  try {
    // Get all cookies for the domain
    const cookies = await chrome.cookies.getAll({ domain: domain });
    
    // Also get cookies for subdomains
    const cookiesWithDot = await chrome.cookies.getAll({ domain: '.' + domain });
    
    const allCookies = [...cookies, ...cookiesWithDot];
    
    // Remove each cookie
    let count = 0;
    for (const cookie of allCookies) {
      try {
        const protocol = cookie.secure ? 'https:' : 'http:';
        const url = protocol + '//' + cookie.domain + cookie.path;
        
        await chrome.cookies.remove({
          url: url,
          name: cookie.name,
          storeId: cookie.storeId
        });
        
        count++;
      } catch (error) {
        console.error('Failed to remove cookie ' + cookie.name + ':', error);
      }
    }
    
    return count;
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return 0;
  }
}

/**
 * Clear browsing data (localStorage, sessionStorage, IndexedDB)
 */
async function clearBrowsingData(domain, settings) {
  try {
    // Create origins array for the domain
    const origins = [
      'https://' + domain,
      'http://' + domain
    ];
    
    const dataToRemove = {};
    
    if (settings.clearLocalStorage || settings.clearSessionStorage) {
      dataToRemove.localStorage = true;
    }
    
    if (settings.clearIndexedDB) {
      dataToRemove.indexedDB = true;
    }
    
    // Clear data for specific origins
    await chrome.browsingData.remove(
      {
        origins: origins
      },
      dataToRemove
    );
    
    return true;
  } catch (error) {
    console.error('Error clearing browsing data:', error);
    return false;
  }
}

/**
 * Clear cache storage
 */
async function clearCacheStorage(domain) {
  try {
    // Find all tabs with the domain
    const tabs = await chrome.tabs.query({ url: '*://' + domain + '/*' });
    
    // Clear cache in each tab
    for (const tab of tabs) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: async () => {
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to clear cache in tab ' + tab.id + ':', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cache storage:', error);
    return false;
  }
}

/**
 * Check if a domain is managed and auto-clear if enabled
 */
async function checkAutoClear(domain) {
  try {
    // Get settings and managed sites
    const settings = await chrome.storage.sync.get(null);
    const { managedSites = [] } = await chrome.storage.local.get({ managedSites: [] });
    
    // Check if auto-clear is enabled
    if (!settings.autoClear) return;
    
    // Check if domain is managed
    const isManaged = managedSites.some(site => site.domain === domain);
    
    if (isManaged) {
      console.log('Auto-clearing storage for managed site: ' + domain);
      await handleClearSite({ domain: domain, settings: settings });
    }
  } catch (error) {
    console.error('Error in auto-clear:', error);
  }
}

/**
 * Listen for tab updates to check for auto-clear
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      // Don't auto-clear chrome:// or extension pages
      if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') {
        return;
      }
      
      checkAutoClear(domain);
    } catch (error) {
      console.error('Error processing tab update:', error);
    }
  }
});

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'clear-site-storage' && tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      // Get settings
      const settings = await chrome.storage.sync.get(null);
      
      // Clear storage
      const result = await handleClearSite({ domain: domain, url: tab.url, settings: settings });
      
      if (result.success) {
        // Reload the tab
        chrome.tabs.reload(tab.id);
      }
    } catch (error) {
      console.error('Error clearing from context menu:', error);
    }
  }
});

console.log('Site Storage Cleaner background script loaded');
