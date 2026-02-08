/**
 * Popup Script - Handles UI interactions and extension functionality
 */

// State management
let currentTab = null;
let managedSites = [];
let settings = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadManagedSites();
  await updateCurrentSiteInfo();
  setupEventListeners();
  setupTabSwitching();
  updateUI();
});

/**
 * Load settings from Chrome storage
 */
async function loadSettings() {
  const result = await chrome.storage.sync.get({
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
  
  settings = result;
  
  // Update UI toggles
  document.getElementById('confirm-before-clear').checked = settings.confirmBeforeClear;
  document.getElementById('auto-clear').checked = settings.autoClear;
  document.getElementById('show-notifications').checked = settings.showNotifications;
  document.getElementById('show-button').checked = settings.showButton;
  document.getElementById('clear-cookies').checked = settings.clearCookies;
  document.getElementById('clear-localstorage').checked = settings.clearLocalStorage;
  document.getElementById('clear-sessionstorage').checked = settings.clearSessionStorage;
  document.getElementById('clear-indexeddb').checked = settings.clearIndexedDB;
  document.getElementById('clear-cache').checked = settings.clearCache;
}

/**
 * Save settings to Chrome storage
 */
async function saveSettings() {
  settings = {
    confirmBeforeClear: document.getElementById('confirm-before-clear').checked,
    autoClear: document.getElementById('auto-clear').checked,
    showNotifications: document.getElementById('show-notifications').checked,
    showButton: document.getElementById('show-button').checked,
    clearCookies: document.getElementById('clear-cookies').checked,
    clearLocalStorage: document.getElementById('clear-localstorage').checked,
    clearSessionStorage: document.getElementById('clear-sessionstorage').checked,
    clearIndexedDB: document.getElementById('clear-indexeddb').checked,
    clearCache: document.getElementById('clear-cache').checked
  };
  
  await chrome.storage.sync.set(settings);
  showStatus('Settings saved', 'success');
}

/**
 * Load managed sites from storage
 */
async function loadManagedSites() {
  const result = await chrome.storage.local.get({ managedSites: [] });
  managedSites = result.managedSites;
}

/**
 * Save managed sites to storage
 */
async function saveManagedSites() {
  await chrome.storage.local.set({ managedSites });
}

/**
 * Get current tab information
 */
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
}

/**
 * Update current site information in the popup
 */
async function updateCurrentSiteInfo() {
  currentTab = await getCurrentTab();
  
  if (!currentTab || !currentTab.url) {
    document.getElementById('current-url').textContent = 'No active tab';
    document.getElementById('storage-stats').textContent = '';
    document.getElementById('clear-current-site').disabled = true;
    return;
  }
  
  const domain = extractDomain(currentTab.url);
  
  if (!domain || currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('chrome-extension://')) {
    document.getElementById('current-url').textContent = 'Cannot manage this page';
    document.getElementById('storage-stats').textContent = 'System pages cannot be managed';
    document.getElementById('clear-current-site').disabled = true;
    document.getElementById('add-to-managed').disabled = true;
    return;
  }
  
  document.getElementById('current-url').textContent = domain;
  document.getElementById('clear-current-site').disabled = false;
  document.getElementById('add-to-managed').disabled = false;
  
  // Check if already managed
  const isManaged = managedSites.some(site => site.domain === domain);
  if (isManaged) {
    document.getElementById('add-to-managed').textContent = '✓ In List';
    document.getElementById('add-to-managed').disabled = true;
  }
  
  // Get storage stats
  try {
    const stats = await getStorageStats(domain);
    document.getElementById('storage-stats').textContent = stats;
  } catch (error) {
    document.getElementById('storage-stats').textContent = 'Storage info unavailable';
  }
}

/**
 * Get storage statistics for a domain
 */
async function getStorageStats(domain) {
  try {
    // Get cookies count
    const cookies = await chrome.cookies.getAll({ domain });
    
    // Estimate other storage (we can't directly query from popup)
    return `${cookies.length} cookies stored`;
  } catch (error) {
    return 'Storage info unavailable';
  }
}

/**
 * Clear storage for current site
 */
async function clearCurrentSite() {
  if (!currentTab || !currentTab.url) {
    showStatus('No active tab', 'error');
    return;
  }
  
  const domain = extractDomain(currentTab.url);
  if (!domain) {
    showStatus('Cannot extract domain', 'error');
    return;
  }
  
  if (settings.confirmBeforeClear) {
    const confirmed = confirm(`Clear all storage for ${domain}?\n\nThis will remove:\n• Cookies\n• localStorage\n• sessionStorage\n• IndexedDB\n• Cache Storage`);
    if (!confirmed) return;
  }
  
  // Show loading state
  const btn = document.getElementById('clear-current-site');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Clearing...';
  btn.disabled = true;
  
  try {
    console.log('Sending clear request for:', domain);
    
    // Send message to background script to clear storage
    const response = await chrome.runtime.sendMessage({
      action: 'clearSite',
      domain: domain,
      url: currentTab.url,
      settings: settings
    });
    
    console.log('Received response:', response);
    
    if (response && response.success) {
      showStatus(`Cleared storage for ${domain}`, 'success');
      
      // Update button state
      btn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Cleared!';
      btn.style.backgroundColor = '#28a745';
      
      // Reset button after delay
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 2000);
      
      // Update stats
      setTimeout(async () => {
        await updateCurrentSiteInfo();
        
        // Reload the tab
        try {
          await chrome.tabs.reload(currentTab.id);
        } catch (error) {
          console.log('Tab reload skipped:', error);
        }
      }, 1500);
    } else {
      btn.innerHTML = originalText;
      btn.disabled = false;
      showStatus(response?.error || 'Failed to clear storage', 'error');
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    btn.innerHTML = originalText;
    btn.disabled = false;
    showStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Add current site to managed list
 */
async function addToManaged() {
  if (!currentTab || !currentTab.url) return;
  
  const domain = extractDomain(currentTab.url);
  if (!domain) return;
  
  // Check if already exists
  if (managedSites.some(site => site.domain === domain)) {
    showStatus('Site already in list', 'error');
    return;
  }
  
  // Add to managed sites
  managedSites.push({
    domain: domain,
    title: currentTab.title || domain,
    dateAdded: Date.now()
  });
  
  await saveManagedSites();
  updateUI();
  
  document.getElementById('add-to-managed').textContent = '✓ In List';
  document.getElementById('add-to-managed').disabled = true;
  
  showStatus('Added to managed sites', 'success');
}

/**
 * Remove site from managed list
 */
async function removeSite(domain) {
  managedSites = managedSites.filter(site => site.domain !== domain);
  await saveManagedSites();
  updateUI();
  
  // Update button if we removed the current site
  if (currentTab && extractDomain(currentTab.url) === domain) {
    document.getElementById('add-to-managed').textContent = 'Add to List';
    document.getElementById('add-to-managed').disabled = false;
  }
  
  showStatus('Removed from managed sites', 'success');
}

/**
 * Clear storage for a specific managed site
 */
async function clearManagedSite(domain) {
  if (settings.confirmBeforeClear) {
    const confirmed = confirm(`Clear all storage for ${domain}?`);
    if (!confirmed) return;
  }
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'clearSite',
      domain: domain,
      settings: settings
    });
    
    if (response.success) {
      showStatus(`Cleared storage for ${domain}`, 'success');
    } else {
      showStatus('Failed to clear storage', 'error');
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    showStatus('Error: ' + error.message, 'error');
  }
}

/**
 * Clear all managed sites
 */
async function clearAllManaged() {
  if (managedSites.length === 0) return;
  
  const confirmed = confirm(`Clear storage for ALL ${managedSites.length} managed sites?\n\nThis action cannot be undone.`);
  if (!confirmed) return;
  
  const btn = document.getElementById('clear-all-managed');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> Clearing...';
  btn.disabled = true;
  
  let successCount = 0;
  let failCount = 0;
  
  for (const site of managedSites) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'clearSite',
        domain: site.domain,
        settings: settings
      });
      
      if (response.success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`Error clearing ${site.domain}:`, error);
      failCount++;
    }
  }
  
  btn.innerHTML = originalText;
  btn.disabled = false;
  
  if (failCount === 0) {
    showStatus(`Cleared ${successCount} sites successfully`, 'success');
  } else {
    showStatus(`Cleared ${successCount} sites, ${failCount} failed`, 'error');
  }
}

/**
 * Render the managed sites list
 */
function renderSitesList() {
  const container = document.getElementById('sites-list');
  const searchTerm = document.getElementById('search-sites').value.toLowerCase();
  
  // Filter sites based on search
  const filteredSites = managedSites.filter(site => 
    site.domain.toLowerCase().includes(searchTerm) ||
    site.title.toLowerCase().includes(searchTerm)
  );
  
  if (filteredSites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z"/>
        </svg>
        <p class="empty-text">${searchTerm ? 'No matching sites' : 'No managed sites yet'}</p>
        <p class="empty-subtext">${searchTerm ? 'Try a different search term' : 'Click "Add to List" to start managing sites'}</p>
      </div>
    `;
    return;
  }
  
  // Sort by date added (newest first)
  filteredSites.sort((a, b) => b.dateAdded - a.dateAdded);
  
  container.innerHTML = filteredSites.map(site => `
    <div class="site-item" data-domain="${site.domain}">
      <div class="site-item-icon">🌐</div>
      <div class="site-item-info">
        <div class="site-item-name">${site.title}</div>
        <div class="site-item-url">${site.domain}</div>
      </div>
      <div class="site-item-actions">
        <button class="icon-btn clear-site" title="Clear storage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
        <button class="icon-btn delete delete-site" title="Remove from list">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to site items
  container.querySelectorAll('.site-item').forEach(item => {
    const domain = item.dataset.domain;
    
    item.querySelector('.clear-site').addEventListener('click', (e) => {
      e.stopPropagation();
      clearManagedSite(domain);
    });
    
    item.querySelector('.delete-site').addEventListener('click', (e) => {
      e.stopPropagation();
      removeSite(domain);
    });
  });
}

/**
 * Update the entire UI
 */
function updateUI() {
  // Update managed sites count
  document.getElementById('managed-count').textContent = managedSites.length;
  
  // Render sites list
  renderSitesList();
  
  // Update clear all button state
  document.getElementById('clear-all-managed').disabled = managedSites.length === 0;
}

/**
 * Show status message
 */
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = message;
  statusEl.className = `status-message show ${type}`;
  
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 3000);
}

/**
 * Export managed sites
 */
async function exportData() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    managedSites: managedSites,
    settings: settings
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `storage-cleaner-backup-${Date.now()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showStatus('Data exported successfully', 'success');
}

/**
 * Import managed sites
 */
async function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.managedSites || !Array.isArray(data.managedSites)) {
        throw new Error('Invalid backup file format');
      }
      
      // Merge with existing sites (avoid duplicates)
      const existingDomains = new Set(managedSites.map(s => s.domain));
      const newSites = data.managedSites.filter(s => !existingDomains.has(s.domain));
      
      managedSites = [...managedSites, ...newSites];
      await saveManagedSites();
      
      // Import settings if present
      if (data.settings) {
        settings = { ...settings, ...data.settings };
        await chrome.storage.sync.set(settings);
        await loadSettings(); // Reload to update UI
      }
      
      updateUI();
      showStatus(`Imported ${newSites.length} new sites`, 'success');
    } catch (error) {
      console.error('Import error:', error);
      showStatus('Failed to import data', 'error');
    }
  };
  
  input.click();
}

/**
 * Reset extension
 */
async function resetExtension() {
  const confirmed = confirm('Reset all extension data?\n\nThis will:\n• Remove all managed sites\n• Reset all settings to defaults\n\nThis action cannot be undone.');
  
  if (!confirmed) return;
  
  // Clear all data
  await chrome.storage.local.clear();
  await chrome.storage.sync.clear();
  
  // Reload
  managedSites = [];
  await loadSettings();
  updateUI();
  
  showStatus('Extension reset successfully', 'success');
}

/**
 * Setup tab switching
 */
function setupTabSwitching() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const targetContent = document.getElementById(`${tab.dataset.tab}-content`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Current site actions
  document.getElementById('clear-current-site').addEventListener('click', clearCurrentSite);
  document.getElementById('add-to-managed').addEventListener('click', addToManaged);
  
  // Bulk actions
  document.getElementById('clear-all-managed').addEventListener('click', clearAllManaged);
  
  // Search
  document.getElementById('search-sites').addEventListener('input', updateUI);
  
  // Settings toggles - auto-save when changed
  document.querySelectorAll('.toggle-input').forEach(toggle => {
    toggle.addEventListener('change', saveSettings);
  });
  
  // Data management
  document.getElementById('export-data').addEventListener('click', exportData);
  document.getElementById('import-data').addEventListener('click', importData);
  document.getElementById('reset-extension').addEventListener('click', resetExtension);
}
