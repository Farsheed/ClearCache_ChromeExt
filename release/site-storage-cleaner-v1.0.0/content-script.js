/**
 * Content Script - Runs on web pages
 * Injects storage cleaner button when enabled
 */

let cleanerButton = null;
let settings = null;

/**
 * Initialize content script
 */
async function init() {
  try {
    // Get settings
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    
    if (!response || !response.settings) {
      console.log('Could not get settings, skipping button injection');
      return;
    }
    
    settings = response.settings;
    
    // Check if we should show button
    if (!settings.showButton) return;
    
    // Check if current domain is managed
    const domain = window.location.hostname;
    const { managedSites = [] } = await chrome.storage.local.get({ managedSites: [] });
    const isManaged = managedSites.some(site => site.domain === domain);
    
    if (isManaged) {
      injectButton();
    }
  } catch (error) {
    console.error('Content script init error:', error);
  }
}

/**
 * Inject the storage cleaner button onto the page
 */
function injectButton() {
  // Don't inject if button already exists
  if (cleanerButton) return;
  
  // Create button container
  cleanerButton = document.createElement('div');
  cleanerButton.id = 'storage-cleaner-ext-button';
  cleanerButton.innerHTML = `
    <button class="storage-cleaner-btn" title="Clear site storage">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
      </svg>
      <span>Clear Storage</span>
    </button>
  `;
  
  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    #storage-cleaner-ext-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .storage-cleaner-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }
    
    .storage-cleaner-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
    
    .storage-cleaner-btn:active {
      transform: translateY(0);
    }
    
    .storage-cleaner-btn svg {
      width: 18px;
      height: 18px;
    }
    
    .storage-cleaner-btn.clearing {
      pointer-events: none;
      opacity: 0.7;
    }
    
    .storage-cleaner-btn.success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .storage-cleaner-btn.clearing svg {
      animation: spin 0.8s linear infinite;
    }
  `;
  
  document.head.appendChild(styles);
  document.body.appendChild(cleanerButton);
  
  // Add click handler
  const btn = cleanerButton.querySelector('.storage-cleaner-btn');
  if (btn) {
    btn.addEventListener('click', handleButtonClick);
  } else {
    console.error('Could not find button element to attach click handler');
  }
}

/**
 * Handle button click
 */
async function handleButtonClick() {
  const button = cleanerButton.querySelector('.storage-cleaner-btn');
  const domain = window.location.hostname;
  
  // Confirm if required
  if (settings.confirmBeforeClear) {
    const confirmed = confirm(
      `Clear all storage for ${domain}?\n\n` +
      `This will remove:\n` +
      `• Cookies\n` +
      `• localStorage\n` +
      `• sessionStorage\n` +
      `• IndexedDB\n` +
      `• Cache Storage\n\n` +
      `The page will reload after clearing.`
    );
    
    if (!confirmed) return;
  }
  
  // Show loading state
  button.classList.add('clearing');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
    <span>Clearing...</span>
  `;
  
  try {
    // Clear storage using our library
    await clearStorageOnPage();
    
    // Show success state
    button.classList.remove('clearing');
    button.classList.add('success');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7"/>
      </svg>
      <span>Cleared!</span>
    `;
    
    // Reload page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error) {
    console.error('Error clearing storage:', error);
    
    // Show error state
    button.classList.remove('clearing');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <span>Error</span>
    `;
    
    // Reset button after delay
    setTimeout(() => {
      button.classList.remove('success');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
        </svg>
        <span>Clear Storage</span>
      `;
    }, 2000);
  }
}

/**
 * Clear storage on the current page
 * This is a client-side implementation that runs in the page context
 */
async function clearStorageOnPage() {
  // Clear cookies (limited to what JavaScript can access)
  if (settings.clearCookies) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${window.location.hostname};path=/`;
      }
    }
  }
  
  // Clear localStorage
  if (settings.clearLocalStorage && typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // Clear sessionStorage
  if (settings.clearSessionStorage && typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Clear IndexedDB
  if (settings.clearIndexedDB && typeof indexedDB !== 'undefined') {
    try {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        indexedDB.deleteDatabase(db.name);
      }
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  }
  
  // Clear Cache Storage
  if (settings.clearCache && 'caches' in window) {
    try {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }
  
  // Also notify background script to clear additional data
  await chrome.runtime.sendMessage({
    action: 'clearSite',
    domain: window.location.hostname,
    url: window.location.href,
    settings: settings
  });
}

/**
 * Remove the button from the page
 */
function removeButton() {
  if (cleanerButton) {
    cleanerButton.remove();
    cleanerButton = null;
  }
}

/**
 * Listen for messages from the extension
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshButton') {
    removeButton();
    init();
    sendResponse({ success: true });
  }
});

/**
 * Listen for storage changes to update button visibility
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.showButton) {
    if (changes.showButton.newValue) {
      init();
    } else {
      removeButton();
    }
  }
  
  if (namespace === 'local' && changes.managedSites) {
    // Re-check if current site should have button
    removeButton();
    init();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
