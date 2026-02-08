# Chrome Web Store Listing - Site Storage Cleaner v1.0.1

## 📝 Short Description (Summary)
*Max 132 characters*

Selectively clear cookies, localStorage, and IndexedDB for specific websites. Manage your browser storage with precision and ease.

---

## 📄 Detailed Description
*For the main store listing*

**Site Storage Cleaner** gives you complete control over your browser's storage data. Unlike standard browser tools that often force you to clear everything or nothing, this extension lets you target specific websites for storage cleaning while keeping your sessions active on other sites.

**Key Features:**

✅ **Selective Clearing**: Choose exactly which sites to clean. Keep your login sessions on important sites while scrubbing trackers and clutter from others.

✅ **Comprehensive Cleaning**: Clears all major storage types:
*   **Cookies**: Remove tracking and session cookies.
*   **localStorage**: Clear persistent data saved by websites.
*   **sessionStorage**: Wipe temporary session data.
*   **IndexedDB**: Free up space used by heavy offline data.
*   **Service Worker Cache**: Reset cached application data.

✅ **Managed Sites List**: Build a list of sites you frequently want to clean.

✅ **Multiple Cleaning Methods**:
*   **One-Click**: Clear current site immediately from the popup.
*   **Right-Click Menu**: Context menu integration for quick access.
*   **Floating Button**: Optional on-page button for frequently managed sites.
*   **Auto-Clear**: Optional setting to automatically clear storage every time you visit a managed site (great for testing!).

✅ **Privacy & Performance**:
*   Remove tracking cookies from specific domains.
*   Fix site loading errors by resetting local data.
*   Free up disk space from sites using heavy IndexedDB storage.

**Perfect for:**
*   **Developers**: Quickly reset local state for testing without opening DevTools.
*   **Privacy Conscious Users**: Automatically clear storage for tracking-heavy sites.
*   **General Users**: Fix broken websites by clearing their data without affecting other tabs.

**Permissions:**
*   `storage`: To save your settings and managed sites list.
*   `cookies`, `browsingData`: To perform the cleaning operations.
*   `contextMenus`: To add the right-click option.
*   `tabs`, `scripting`: To detect the current site and inject the helper button (if enabled).

**Privacy Policy:**
Site Storage Cleaner operates entirely offline within your browser. It does not collect, store, or transmit any user data to external servers. Your managed sites list stays local to your machine.

---

## 🆕 What's New in Version 1.0.1

This update focuses on performance and reliability:

🚀 **Faster Performance**:
*   **Smart Caching**: Settings are now cached intelligently, making the extension popup open instantly and reducing disk I/O.
*   **Parallel Processing**: Cookie deletion logic has been rewritten to process multiple cookies simultaneously, significantly speeding up clearing for sites with dozens of cookies.

✨ **Improved Experience**:
*   **Smoother Search**: The managed sites search bar now has a smart debounce feature, preventing UI stuttering when filtering large lists.
*   **Better Error Handling**: Improved reliability when using the context menu and handling edge cases where storage might be inaccessible.

🛡️ **Fixes**:
*   Resolved potential race conditions during rapid updates.
*   Fixed context menu creation errors.
