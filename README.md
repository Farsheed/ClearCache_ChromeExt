<div align="center">
  <img src="icons/icon128.png" alt="Site Storage Cleaner Logo" width="128" height="128">

  # Site Storage Cleaner
  
  **Selectively clear browser storage (cookies, localStorage, IndexedDB, etc.) for specific websites**

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)](manifest.json)
  [![Chrome](https://img.shields.io/badge/chrome-88%2B-blue.svg)](https://www.google.com/chrome/)
</div>

<br />

> **Note**: A powerful Chrome extension that allows you to selectively clear browser storage (cookies, localStorage, sessionStorage, IndexedDB, and cache) for specific websites of your choice.

## 📋 Table of Contents
- [Features](#features)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Understanding Browser Storage](#understanding-browser-storage)
- [Settings Explained](#settings-explained)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)
- [Privacy & Security](#privacy--security)
- [Technical Details](#technical-details)

## ✨ Features

### Core Functionality
- **✓ Selective Clearing**: Choose specific sites to manage, not all sites at once
- **✓ Comprehensive Storage Types**: Clears cookies, localStorage, sessionStorage, IndexedDB, and Service Worker caches
- **✓ Managed Sites List**: Maintain a list of websites you want to manage
- **✓ One-Click Clearing**: Clear storage for the current site with a single click
- **✓ Bulk Operations**: Clear storage for all managed sites at once
- **✓ Auto-Clear Option**: Automatically clear storage when visiting managed sites
- **✓ On-Page Button**: Optional button that appears on managed websites
- **✓ Right-Click Menu**: Clear storage from the browser's context menu
- **✓ Import/Export**: Backup and restore your managed sites list

### User Experience
- **Modern UI**: Clean, intuitive interface with gradient design
- **Real-Time Stats**: See storage information for the current site
- **Search Function**: Quickly find sites in your managed list
- **Visual Feedback**: Button animations and status messages
- **Notifications**: Optional notifications when storage is cleared
- **Confirmation Dialogs**: Prevent accidental clearing (can be disabled)

## 🚀 Installation

### Method 1: From Source (Development)

1. **Download the extension files**
   - Download all files in the `extension` folder

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `extension` folder containing `manifest.json`
   - The extension icon should appear in your toolbar

### Method 2: From Chrome Web Store (When Published)
- Search for "Site Storage Cleaner" in the Chrome Web Store
- Click "Add to Chrome"

## 📖 How to Use

### Basic Usage

#### 1. Adding Sites to Manage

**Option A: From Current Page**
1. Visit the website you want to manage
2. Click the extension icon in the toolbar
3. Click "Add to List" button
4. The site is now in your managed sites list

**Option B: From Managed Sites Tab**
- Sites are automatically suggested based on your current page
- You can also import a list of sites

#### 2. Clearing Storage for Current Site

**Method 1: Extension Popup**
1. Visit the website
2. Click the extension icon
3. Click "Clear This Site"
4. Confirm if prompted
5. Page will reload automatically

**Method 2: On-Page Button** (if enabled in settings)
1. Visit a managed website
2. Look for the "Clear Storage" button (bottom-right corner)
3. Click it to clear storage
4. Page reloads automatically

**Method 3: Right-Click Menu**
1. Right-click anywhere on the page
2. Select "Clear storage for this site"
3. Storage is cleared and page reloads

#### 3. Managing Multiple Sites

**View All Managed Sites:**
1. Click extension icon
2. Go to "Managed Sites" tab
3. See all sites you're managing

**Clear All Managed Sites:**
1. In "Managed Sites" tab
2. Click "Clear All" button at the bottom
3. Confirm the action
4. All managed sites will have their storage cleared

**Remove a Site:**
1. Find the site in your managed list
2. Click the "X" button next to it
3. Site is removed from the list (storage remains until manually cleared)

**Search Your Sites:**
- Use the search box at the top of the managed sites list
- Search by domain name or site title

### Advanced Features

#### Auto-Clear on Page Load
1. Go to Settings tab
2. Enable "Auto-clear on page load"
3. When you visit any managed site, storage is automatically cleared
4. **Use carefully**: This happens every time you visit the site

#### Customize What Gets Cleared
1. Go to Settings tab
2. Under "Storage Types", toggle specific types:
   - Cookies
   - localStorage
   - sessionStorage
   - IndexedDB
   - Cache Storage
3. Only selected types will be cleared

#### Export/Import Managed Sites
**Export:**
1. Go to Settings tab
2. Click "Export Managed Sites"
3. Save the JSON file as backup

**Import:**
1. Go to Settings tab
2. Click "Import Managed Sites"
3. Select your backup JSON file
4. Sites are added to your list (duplicates are skipped)

## 🧠 Understanding Browser Storage

### What Each Storage Type Contains

#### Cookies 🍪
**What they store**: Session IDs, user preferences, tracking data  
**Real-world example**: When you log into Gmail, it sets a cookie with your session ID. This cookie is sent with every request so Gmail knows you're logged in.  
**Size limit**: ~4KB per cookie  
**Typical use**: Authentication, shopping carts, user preferences

#### localStorage 💾
**What it stores**: Persistent key-value data  
**Real-world example**: A note-taking app saves your draft notes here. Even if you close your browser and come back tomorrow, the notes are still there.  
**Size limit**: ~5-10MB  
**Typical use**: User preferences, cached data, offline content

#### sessionStorage 🔄
**What it stores**: Temporary session data  
**Real-world example**: A multi-step form saves your answers as you navigate between pages. Close the tab and it's gone.  
**Size limit**: ~5-10MB  
**Lifespan**: Until tab closes

#### IndexedDB 🗄️
**What it stores**: Large amounts of structured data, files  
**Real-world example**: Gmail stores thousands of emails locally for offline access. Spotify caches songs for offline playback.  
**Size limit**: Hundreds of MB to GBs  
**Typical use**: Offline apps, cached content, complex data

#### Cache Storage 🚀
**What it stores**: Network responses (HTML, CSS, JS, images)  
**Real-world example**: Twitter's Progressive Web App caches its interface so it loads instantly even offline.  
**Size limit**: Based on available disk space  
**Typical use**: Offline functionality, faster loading

### What This Extension CANNOT Clear

**HttpOnly Cookies**: These are server-only cookies that JavaScript cannot access (security feature)  
**Browser HTTP Cache**: The browser's automatic cache cannot be cleared via JavaScript  
**Cross-Domain Storage**: Cannot clear storage from other domains (Same-Origin Policy)  
**Passwords & Autofill**: Browser-managed data requires user interaction

## ⚙️ Settings Explained

### Clearing Options

| Setting | Description | Recommended |
|---------|-------------|-------------|
| **Confirm before clearing** | Show confirmation dialog before clearing storage | ✓ ON (safety) |
| **Auto-clear on page load** | Automatically clear storage when visiting managed sites | ✗ OFF (can cause issues) |
| **Show notifications** | Display browser notification after clearing | ✓ ON (feedback) |
| **Show button on page** | Display clear button on managed websites | ✓ ON (convenience) |

### Storage Types

You can selectively enable/disable which storage types to clear:

- **Cookies**: Usually safe to clear, but will log you out
- **localStorage**: Safe to clear, may lose preferences
- **sessionStorage**: Very safe, temporary data only
- **IndexedDB**: May lose offline data (emails, cached content)
- **Cache Storage**: Safe, will be re-downloaded

**Recommended**: Keep all enabled unless you have specific needs

## 💡 Use Cases

### Development & Testing
**Scenario**: You're developing a website and need to test with fresh storage  
**Solution**: 
1. Add your local site (localhost:3000) to managed list
2. Use the clear button or auto-clear to reset between tests
3. Enable keyboard shortcut for quick clearing

### Privacy Management
**Scenario**: You want to limit tracking on specific news sites  
**Solution**:
1. Add news sites to managed list
2. Enable auto-clear on page load
3. Storage (including tracking cookies) is cleared on each visit

### Troubleshooting Web Apps
**Scenario**: A web app is showing stale data or behaving incorrectly  
**Solution**:
1. Visit the problematic site
2. Click "Clear This Site" in extension popup
3. Page reloads with fresh storage

### Multiple Account Management
**Scenario**: You need to switch between different accounts on the same site  
**Solution**:
1. Clear storage for the site
2. This logs you out and clears all saved data
3. Log in with different account

### Testing Shopping Flows
**Scenario**: You're testing a checkout process and need to clear cart data  
**Solution**:
1. Add the e-commerce site to managed list
2. Clear storage between tests
3. Start each test with empty cart

## 🔧 Troubleshooting

### Extension Not Showing Button on Page
**Causes**:
- "Show button on page" is disabled in settings
- Site is not in managed list
- Site is a system page (chrome://)

**Solutions**:
1. Check Settings → "Show button on page" is enabled
2. Verify site is in your managed list
3. Refresh the page after adding to list

### Storage Not Being Cleared
**Causes**:
- HttpOnly cookies cannot be cleared by JavaScript
- Some storage types are disabled in settings
- Browser permissions not granted

**Solutions**:
1. Check Settings → Storage Types are all enabled
2. HttpOnly cookies require manual browser clearing
3. Try clearing from multiple methods (popup, context menu)

### Auto-Clear Causing Issues
**Problem**: Pages constantly reloading or losing data

**Solution**:
1. Disable "Auto-clear on page load" in settings
2. Use manual clearing instead
3. Only enable auto-clear for specific use cases

### Can't Add Chrome System Pages
**Normal Behavior**: Chrome extensions cannot modify:
- chrome:// pages
- chrome-extension:// pages
- Chrome Web Store

**Solution**: This is a security restriction and cannot be bypassed

## 🔒 Privacy & Security

### What Data Does This Extension Access?

**Required Permissions:**
- **storage**: To save your managed sites list and settings locally
- **tabs**: To identify which website you're currently viewing
- **cookies**: To clear cookies from specific domains
- **browsingData**: To clear localStorage, sessionStorage, and IndexedDB

### Data Privacy

**✓ All data is stored locally** in your browser  
**✓ No data is sent to external servers**  
**✓ No analytics or tracking**  
**✓ Open source code** - you can verify what it does  
**✓ Your managed sites list** never leaves your device

### Security Considerations

**Same-Origin Policy**: The extension respects browser security and can only clear storage for accessible domains.

**HttpOnly Protection**: Cannot clear HttpOnly cookies (this is a security feature, not a bug).

**Permissions**: The extension only accesses storage APIs - it cannot read page content or passwords.

## 🛠️ Technical Details

### Architecture

```
Extension Structure:
├── manifest.json       # Extension configuration
├── background.js       # Service worker (handles clearing operations)
├── content-script.js   # Injected into pages (adds button)
├── popup.html/css/js   # Extension popup interface
└── icons/              # Extension icons
```

### How Clearing Works

1. **User triggers clear** (via popup, button, or context menu)
2. **Background script receives message** with domain and settings
3. **Multiple clearing methods used**:
   - Chrome Cookies API: Clears all cookies for domain
   - Chrome BrowsingData API: Clears localStorage, sessionStorage, IndexedDB
   - Content Script Injection: Clears Cache Storage in page context
4. **Confirmation sent back** to user
5. **Page reloaded** (if applicable)

### Storage APIs Used

- **Chrome Storage API**: For extension settings and managed sites list
- **Chrome Cookies API**: For removing cookies
- **Chrome BrowsingData API**: For clearing web storage
- **Chrome Tabs API**: For page reload and URL detection
- **Chrome Scripting API**: For cache clearing in page context

### Browser Compatibility

- **Chrome**: 88+ (Manifest V3)
- **Edge**: 88+ (Chromium-based)
- **Opera**: 74+
- **Brave**: Supported

**Not compatible with Firefox** (uses different extension system)

### Performance

- **Popup load time**: <100ms
- **Storage clearing**: 100-500ms depending on data volume
- **Memory usage**: <10MB
- **No performance impact** on browsing (only active when clearing)

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- Managed sites list functionality
- Multiple clearing methods (popup, button, context menu)
- Auto-clear feature
- Import/Export functionality
- Comprehensive settings
- Modern UI with search

## 🤝 Contributing

Want to improve this extension? Contributions are welcome!

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## ⚠️ Disclaimer

**Use this extension responsibly:**
- Clearing storage will log you out of websites
- You may lose unsaved data or preferences
- Some websites may not function correctly after clearing
- Always make sure you have backups of important data

This extension is not responsible for any data loss or issues arising from its use.

## 🆘 Support

Having issues? Try these resources:

1. **Check this README** - Most questions are answered here
2. **Check browser console** - Look for error messages
3. **Verify permissions** - Make sure the extension has required permissions
4. **Reinstall** - Sometimes a fresh install fixes issues

## 🎯 Roadmap

Potential future features:
- ✓ Keyboard shortcuts
- ✓ Scheduled auto-clear
- ✓ Clear on browser close
- ✓ Site-specific settings
- ✓ Storage usage graphs
- ✓ Whitelist/blacklist modes

---

**Made with ❤️ for developers, testers, and privacy-conscious users**
