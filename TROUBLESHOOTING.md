# Troubleshooting Guide

## Issue: Extension Stuck on "Clearing..." 

### Symptoms
- Click "Clear This Site" button
- Button shows "Clearing..." with spinner
- Never completes, stays stuck

### Root Causes

#### 1. Background Script Not Running
**Solution:**
1. Open Chrome DevTools for background script:
   - Go to `chrome://extensions/`
   - Find "Site Storage Cleaner"
   - Click "service worker" link (or "Inspect views: service worker")
2. Check console for errors
3. If you see errors, click the refresh icon on the extension to reload it

#### 2. Message Passing Issue
**Solution:**
1. Open the popup
2. Right-click inside the popup → Inspect
3. Look at Console tab for errors
4. Common error: "Could not establish connection"
   - This means background script isn't running
   - Go to chrome://extensions/ and click refresh icon

#### 3. IP Address vs Domain Name
**Issue:** You're on an IP address (172.16.70.131) not a domain name
**Why it matters:** Some clearing operations work differently with IP addresses

**Solution A - Use with IP addresses:**
The extension should still work, but:
- Open DevTools (F12) on the page before clearing
- Check Console for any errors
- Cookies might not clear completely for IP addresses

**Solution B - Add to hosts file (for local development):**
```
# Add to your hosts file:
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

172.16.70.131   myapp.local
```
Then access via `http://myapp.local` instead

### Quick Fix Steps

#### Step 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "Site Storage Cleaner"
3. Click the refresh/reload icon (↻)
4. Try clearing again

#### Step 2: Check Background Script
1. Go to `chrome://extensions/`
2. Click "service worker" next to Site Storage Cleaner
3. Console should show: "Site Storage Cleaner background script loaded"
4. If console is empty or shows errors, refresh extension

#### Step 3: Check Console Logs
1. Open popup
2. Right-click → Inspect
3. Go to Console tab
4. Click "Clear This Site"
5. You should see:
   ```
   Sending clear request for: 172.16.70.131
   Received response: {success: true, ...}
   ```

#### Step 4: Manual Test
1. Open popup DevTools (right-click popup → Inspect)
2. In Console, run:
   ```javascript
   chrome.runtime.sendMessage({
     action: 'clearSite',
     domain: '172.16.70.131',
     settings: {
       clearCookies: true,
       clearLocalStorage: true,
       clearSessionStorage: true,
       clearIndexedDB: true,
       clearCache: true
     }
   }, (response) => {
     console.log('Response:', response);
   });
   ```
3. Check what response you get

### Common Error Messages

#### "Could not establish connection"
**Cause:** Background service worker crashed or isn't running
**Fix:** Reload extension in chrome://extensions/

#### "Receiving end does not exist"
**Cause:** Message listener not set up properly
**Fix:** Reload extension

#### "Extensions cannot access chrome:// URLs"
**Cause:** Trying to clear storage on a Chrome system page
**Fix:** Only use on regular websites (http:// or https://)

### Testing If It's Working

#### Method 1: Test with Cookies
1. Visit a site
2. Open DevTools (F12)
3. Go to Application tab → Cookies
4. See if cookies exist
5. Clear storage with extension
6. Refresh cookies view - should be empty

#### Method 2: Test with localStorage
1. Open DevTools (F12) on your site
2. In Console, type:
   ```javascript
   localStorage.setItem('test', 'value');
   console.log(localStorage.getItem('test')); // Should show 'value'
   ```
3. Clear storage with extension
4. Run again:
   ```javascript
   console.log(localStorage.getItem('test')); // Should show 'null'
   ```

### Alternative: Use Browser Built-in Clearing

If extension continues to have issues, you can manually clear:

1. Open DevTools (F12)
2. Go to Application tab
3. On left side, expand:
   - Cookies → Delete each
   - Local Storage → Right-click → Clear
   - Session Storage → Right-click → Clear
   - IndexedDB → Right-click → Delete database
   - Cache Storage → Right-click → Delete

### IP Address Specific Issues

Since you're using 172.16.70.131 (private IP):

#### Issue: Cookies might not clear
**Why:** Cookies for IP addresses behave differently
**Solution:** Check if any cookies actually exist:
```javascript
// Run in DevTools Console:
document.cookie; // See what cookies exist
```

#### Issue: Same-Origin Policy complications
**Why:** IP addresses have stricter origin rules
**Solution:** Use a domain name (add to hosts file) instead

### Get Detailed Logs

To see exactly what's happening:

1. **Enable verbose logging in background.js:**
   - The current version already has console.log statements
   - Open service worker console (chrome://extensions/ → "service worker")

2. **Watch the logs:**
   ```
   Starting to clear storage for: 172.16.70.131
   Cleared cookies: 0
   Cleared browsing data
   Cleared cache storage
   Storage clearing completed successfully
   ```

### Still Not Working?

#### Option 1: Disable Auto-Clear
Maybe auto-clear is interfering:
1. Open extension popup
2. Go to Settings tab
3. Turn OFF "Auto-clear on page load"

#### Option 2: Try Without Confirmation
1. Open Settings
2. Turn OFF "Confirm before clearing"
3. Try clearing again

#### Option 3: Clear Only Specific Types
1. Go to Settings → Storage Types
2. Turn OFF all except "Cookies"
3. Try clearing
4. If works, add back one type at a time to find the problem

#### Option 4: Check Permissions
1. Go to chrome://extensions/
2. Click "Details" on Site Storage Cleaner
3. Scroll to "Site access"
4. Make sure it's set to "On all sites"

### Known Limitations

The extension CANNOT clear:
- ❌ HttpOnly cookies (server-side only)
- ❌ Secure cookies on HTTP pages
- ❌ Browser's HTTP cache (not accessible)
- ❌ Storage from other domains
- ❌ Chrome system pages (chrome://*)

### Debug Mode

Want to see everything that's happening?

1. Open background script console (chrome://extensions/ → "service worker")
2. Open popup console (right-click popup → Inspect)
3. Open page console (F12 on the actual website)
4. Try clearing - watch all three consoles

You should see messages flowing between them.

### Contact Information

If you've tried everything and it still doesn't work:

1. Export your logs:
   - From background console: Right-click → Save as...
   - From popup console: Right-click → Save as...

2. Note:
   - Chrome version
   - Operating system
   - Exact error messages
   - Whether you're using IP address or domain

3. Check if background script shows:
   - "Site Storage Cleaner background script loaded" ✓
   - Any error messages ✗

### Quick Reference

**Stuck on "Clearing..."?**
→ Reload extension in chrome://extensions/

**Nothing happens?**
→ Check background service worker console for errors

**Works for some sites but not others?**
→ Check if it's a chrome:// page (not supported)

**IP addresses causing issues?**
→ Use domain name instead (add to hosts file)

---

**Most Common Fix:** Reload the extension in chrome://extensions/ by clicking the refresh icon!
