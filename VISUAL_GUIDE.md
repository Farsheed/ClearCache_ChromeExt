# Site Storage Cleaner - Visual Guide

## 🎨 What It Looks Like

### Extension Popup Interface

#### Main View (Current Site)
```
╔═══════════════════════════════════════╗
║  🗑️  Storage Cleaner                 ║
║      Manage site storage              ║
╠═══════════════════════════════════════╣
║  🌐  Current Site                     ║
║      example.com                      ║
║      5 cookies stored                 ║
║                                       ║
║  [Clear This Site] [Add to List]      ║
╠═══════════════════════════════════════╣
║  [Managed Sites]    [Settings]        ║
╚═══════════════════════════════════════╝
```

#### Managed Sites Tab
```
╔═══════════════════════════════════════╗
║  [Managed Sites 3]    [Settings]      ║
╠═══════════════════════════════════════╣
║  🔍 Search managed sites...           ║
╠═══════════════════════════════════════╣
║  🌐 Google                            ║
║     google.com              [🗑️] [✕]  ║
║                                       ║
║  🌐 Facebook                          ║
║     facebook.com            [🗑️] [✕]  ║
║                                       ║
║  🌐 Twitter                           ║
║     twitter.com             [🗑️] [✕]  ║
╠═══════════════════════════════════════╣
║  [Clear All]                          ║
╚═══════════════════════════════════════╝
```

#### Settings Tab
```
╔═══════════════════════════════════════╗
║  [Managed Sites]    [Settings ✓]      ║
╠═══════════════════════════════════════╣
║  CLEARING OPTIONS                     ║
║                                       ║
║  Confirm before clearing     [ON] ●—  ║
║  Show confirmation dialog             ║
║                                       ║
║  Auto-clear on page load     [OFF] —● ║
║  Automatically clear storage          ║
║                                       ║
║  Show notifications          [ON] ●—  ║
║  Display notifications                ║
║                                       ║
║  Show button on page         [ON] ●—  ║
║  Display clear button                 ║
╠═══════════════════════════════════════╣
║  STORAGE TYPES                        ║
║                                       ║
║  Cookies                     [ON] ●—  ║
║  localStorage                [ON] ●—  ║
║  sessionStorage              [ON] ●—  ║
║  IndexedDB                   [ON] ●—  ║
║  Cache Storage               [ON] ●—  ║
╠═══════════════════════════════════════╣
║  DATA MANAGEMENT                      ║
║                                       ║
║  [Export Managed Sites]               ║
║  [Import Managed Sites]               ║
║                                       ║
║  [Reset Extension]                    ║
╚═══════════════════════════════════════╝
```

### On-Page Button

When you visit a managed website, a floating button appears:

```
                              ╔════════════════╗
                              ║ 🗑️ Clear       ║
                              ║   Storage      ║
                              ╚════════════════╝
                                    ↑
                              (bottom-right
                                 corner)
```

Button States:
- **Normal**: Purple gradient, "Clear Storage"
- **Clearing**: Spinning icon, "Clearing..."
- **Success**: Green, "✓ Cleared!"

### Context Menu

Right-click on any page:
```
╔═══════════════════════════════╗
║ Back                          ║
║ Forward                       ║
║ Reload                        ║
║ ─────────────────────────     ║
║ Save as...                    ║
║ Print...                      ║
║ ─────────────────────────     ║
║ Inspect                       ║
║ ─────────────────────────     ║
║ 🗑️ Clear storage for this site║ ← Added by extension
╚═══════════════════════════════╝
```

## 🎬 User Flows

### Flow 1: Adding and Clearing a Site

```
1. Visit Website
   ↓
2. Click Extension Icon
   ↓
3. Click "Add to List"
   ↓
   [Site added to managed list]
   ↓
4. Click "Clear This Site"
   ↓
   [Confirmation dialog appears]
   ↓
5. Click "OK"
   ↓
   [Storage is cleared]
   ↓
6. Page Reloads Automatically
```

### Flow 2: Using On-Page Button

```
1. Visit Managed Website
   ↓
   [Button appears automatically]
   ↓
2. Click "Clear Storage" Button
   ↓
   [Confirmation dialog appears]
   ↓
3. Click "OK"
   ↓
   [Button shows "Clearing..."]
   ↓
   [Button turns green: "✓ Cleared!"]
   ↓
4. Page Reloads (after 1.5 seconds)
```

### Flow 3: Bulk Clearing

```
1. Click Extension Icon
   ↓
2. Go to "Managed Sites" Tab
   ↓
3. Click "Clear All" Button
   ↓
   [Confirmation: "Clear 5 sites?"]
   ↓
4. Click "OK"
   ↓
   [Each site cleared in sequence]
   ↓
5. Notification: "Cleared 5 sites successfully"
```

## 🎨 Color Scheme

The extension uses a modern gradient design:

**Primary Gradient**: Purple to violet (#667eea → #764ba2)
**Success**: Green (#28a745)
**Error/Clear**: Red (#dc3545)
**Neutral**: Gray (#6c757d)
**Background**: Light gray (#f8f9fa)

## 📱 Responsive Design

The popup is designed to be:
- **Width**: 400px (fixed for consistency)
- **Max Height**: 600px (scrollable content)
- **Minimum**: Works at 300px width

All elements scale appropriately and remain usable.

## 🎯 Key Interactive Elements

### Buttons
```
┌─────────────────────┐
│  [Icon] Button Text │  ← Primary action (red)
└─────────────────────┘

┌─────────────────────┐
│  [Icon] Button Text │  ← Secondary action (gray)
└─────────────────────┘

┌─────────────────────┐
│  [Icon] Button Text │  ← Danger action (red outline)
└─────────────────────┘
```

### Toggle Switches
```
OFF: Setting Name     —○
     Description

ON:  Setting Name     ○—
     Description
```

### Site Items
```
┌─────────────────────────────────────┐
│ 🌐  Site Title                      │
│     site-url.com         [🗑️] [✕]   │
└─────────────────────────────────────┘
     ↑                         ↑   ↑
  Icon & Info              Clear Remove
```

## 📊 Visual Feedback

### Status Messages
```
╔═════════════════════════╗
║ ✓ Storage cleared       ║  ← Success (green)
╚═════════════════════════╝

╔═════════════════════════╗
║ ✗ Failed to clear       ║  ← Error (red)
╚═════════════════════════╝

╔═════════════════════════╗
║ Settings saved          ║  ← Info (dark gray)
╚═════════════════════════╝
```

Messages appear at bottom, slide up, and auto-dismiss after 3 seconds.

### Loading States
```
Button States:
1. Normal:    [🗑️ Clear This Site]
2. Loading:   [⟳ Clearing...]         (spinning icon)
3. Success:   [✓ Cleared!]            (green background)
4. Back:      [🗑️ Clear This Site]    (after 2 seconds)
```

## 🖼️ Screenshots Description

**If you were viewing screenshots, you would see:**

1. **Popup Main View**: Clean gradient header, current site info, two action buttons
2. **Managed Sites List**: Scrollable list with search, site icons, and action buttons
3. **Settings Panel**: Organized sections with toggle switches
4. **On-Page Button**: Floating purple button in corner with hover effect
5. **Confirmation Dialog**: Browser native dialog with clear messaging
6. **Success Notification**: Browser notification showing cleared domain

## 🎭 Animation Effects

### Hover Effects
- Buttons: Slight lift (translateY -2px) with enhanced shadow
- Toggle switches: Smooth slide animation (0.3s ease)
- Site items: Background color change on hover

### Click Effects
- Buttons: Brief press effect (translateY 0)
- Toggle: Immediate state change with smooth animation

### Transitions
- Tab switching: Instant (no fade)
- Status messages: Slide up from bottom (0.3s ease)
- Button states: Color/text change (0.2s ease)

## 💻 Technical Display

### Empty States
When no sites are managed:
```
        🛡️
   
   No managed sites yet
   
   Click "Add to List" to
   start managing sites
```

### Search Results (No Match)
```
        🔍
   
   No matching sites
   
   Try a different search term
```

## 🎨 Icon Design

The extension icon (trash can) is designed to be:
- **Recognizable**: Clear trash can symbol
- **Colorful**: Purple gradient background
- **Simple**: Works at all sizes (16px to 128px)
- **Professional**: Clean lines, modern aesthetic

---

## Real-World Example Walkthrough

**Scenario**: You're testing a login form and need fresh storage between tests.

### Step-by-Step Visual Journey:

1. **Visit test site** (example-app.com)
   ```
   [Browser: http://example-app.com/login]
   ```

2. **Click extension icon** (toolbar)
   ```
   Click: [🗑️] icon
   ```

3. **Popup appears** showing:
   ```
   ╔═══════════════════════════════════════╗
   ║  🌐  example-app.com                  ║
   ║      3 cookies, localStorage data     ║
   ║                                       ║
   ║  [Clear This Site] [Add to List]      ║
   ╚═══════════════════════════════════════╝
   ```

4. **Click "Clear This Site"**
   ```
   Confirmation appears:
   "Clear all storage for example-app.com?"
   [Cancel] [OK]
   ```

5. **Click OK**
   ```
   Button shows: [⟳ Clearing...]
   ```

6. **Success!**
   ```
   Toast notification: "✓ Storage cleared"
   Page reloads automatically
   Login form is now fresh with no data
   ```

**Total time**: ~3 seconds from click to cleared

---

This visual guide helps you understand what to expect when using the Site Storage Cleaner extension!
