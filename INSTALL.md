# Quick Installation Guide

## Step-by-Step Installation (5 minutes)

### 1. Prepare the Extension Files
Make sure you have all these files in your `extension` folder:
```
extension/
├── manifest.json
├── background.js
├── content-script.js
├── popup.html
├── popup.css
├── popup.js
├── storage-cleaner.js
├── README.md
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### 2. Open Chrome Extensions Page
1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar and press Enter
3. **OR** Click the three-dot menu (⋮) → More Tools → Extensions

### 3. Enable Developer Mode
1. Look for the toggle switch labeled "Developer mode" in the top-right corner
2. Turn it **ON** (it should turn blue)

### 4. Load the Extension
1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. Navigate to your `extension` folder
3. Select the folder and click "Select Folder" or "Open"

### 5. Verify Installation
You should see:
- ✓ A new card for "Site Storage Cleaner" in your extensions list
- ✓ The extension icon (trash can) in your Chrome toolbar
- ✓ Status showing "Enabled"

If you don't see the icon in the toolbar:
- Click the puzzle piece icon (Extensions menu)
- Find "Site Storage Cleaner"
- Click the pin icon to pin it to the toolbar

## 🎉 You're Done!

### Quick Test
1. Visit any website (e.g., google.com)
2. Click the extension icon
3. You should see the popup with the current site information
4. Try clicking "Add to List"
5. Go to the "Managed Sites" tab to see your added site

## First Time Setup

### Recommended Settings
1. Click the extension icon
2. Go to "Settings" tab
3. Enable these for best experience:
   - ✓ Confirm before clearing (recommended for safety)
   - ✓ Show notifications
   - ✓ Show button on page
   - ✗ Auto-clear on page load (disable unless needed)

### Add Your First Site
1. Visit a website you want to manage
2. Click the extension icon
3. Click "Add to List"
4. Go to "Managed Sites" tab to see it listed

### Clear Storage for First Time
1. Stay on the website you added
2. Click "Clear This Site" button
3. Confirm the action
4. The page will reload with cleared storage

## Troubleshooting Installation

### "Load unpacked" button is grayed out
- **Solution**: Enable "Developer mode" toggle first

### Extension shows errors
- **Solution**: Make sure ALL files are present in the folder
- Check that `manifest.json` exists
- Verify all JavaScript files are present

### Icon not showing in toolbar
- **Solution**: Click the puzzle piece → Pin the extension

### Extension doesn't work on some pages
- **Normal**: Chrome extensions cannot run on:
  - chrome:// pages (system pages)
  - chrome-extension:// pages
  - Chrome Web Store pages
  
## Updating the Extension

If you make changes to the code:

1. Go to `chrome://extensions/`
2. Find "Site Storage Cleaner"
3. Click the refresh icon (↻) button
4. The extension will reload with your changes

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Site Storage Cleaner"
3. Click "Remove"
4. Confirm removal

**Note**: Your managed sites list and settings will be deleted.

## Need Help?

- Check the full README.md for detailed documentation
- Look at the browser console (F12) for error messages
- Verify all permissions are granted
- Try reinstalling if issues persist

---

**Happy clearing! 🧹**
