# Branding Cleanup Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace remaining user-facing "ohmOS", "Ryo Lu", "ryo.lu", "os.ryo.lu", and "Cursor" (brand) references in locales, settings screens, error/boot screens, default contacts, and bookmarks with OHMXO/Jacob equivalents.

**Architecture:** Content-only string replacements in i18n JSON files and React components. No theme, color, layout, or app structural changes. No CSS, no internal keys, no repo attribution, no database names.

**Tech Stack:** React 19, i18next, TypeScript, Zustand

**Scope boundary:** Do NOT touch internal `ryos:*` localStorage keys, `[ohmOS]` console prefixes, `ryos-*` CSS classes, `data-ryos-*` DOM attributes, `github: "ryokun6/ryos"` attribution, `DB_NAME = "ohmOS"`, or `window.ryosDesktop` references.

---

### Task 1: i18n Shell JSON — Replace "ohmOS" References

**Files:**
- Modify: `src/lib/locales/en/shell.json` — ~20 keys
- (Note: Other locale files follow same pattern — update once en is approved)

**Changes to make:**

| Key | Old value | New value |
|-----|-----------|-----------|
| `system.updatingToRyOS` | `"Updating to ohmOS {{version}}…"` | `"Updating OHMXO to {{version}}…"` |
| `system.updatingToRyOSWithBuild` | `"Updating to ohmOS {{version}} ({{buildNumber}})…"` | `"Updating OHMXO to {{version}} ({{buildNumber}})…"` |
| `system.resetAllSettingsDesc` | `"...ohmOS will restart after reset."` | `"...OHMXO will restart after reset."` |
| `system.formatFileSystemDesc` | `"...ohmOS will restart after format."` | `"...OHMXO will restart after format."` |
| `errorBoundaries.desktopDescription` | `"Reload ohmOS to restore the Dock, Desktop, and menu bar."` | `"Reload to restore the Dock, Desktop, and menu bar."` |
| `startMenu.ryosProfessional` | `"Professional"` | `"Professional"` (key name kept, value unchanged — displayed as "OHMXO Professional" via StartMenu.tsx) |
| `startMenu.ryos98` | `"98"` | `"98"` (same — displayed as "OHMXO 98") |
| `assistant.greetings.help` | `"It looks like you're using ohmOS! Need a hand..."` | `"Need a hand with anything? I'm {{name}}, happy to help. 📎"` |
| `aboutThisMac.description` | `"Information about ohmOS on this computer"` | `"Information about this computer"` |
| `toast.updateReady` | `"Update ready for ohmOS {{version}} ({{buildNumber}})"` | `"Update ready for OHMXO {{version}} ({{buildNumber}})"` |
| `toast.alreadyLatestVersionDetail` | `"ohmOS {{version}} ({{buildNumber}})"` | `"OHMXO {{version}} ({{buildNumber}})"` |
| `toast.desktopAvailable` | `"ohmOS {{version}} for {{platform}} is available"` | `"OHMXO {{version}} for {{platform}} is available"` |
| `toast.desktopAppOffer` | `"ohmOS is available as a {{platform}} app"` | `"OHMXO is available as a {{platform}} app"` |
| `login.dialogTitle` | `"Sign In to ohmOS"` | `"Sign In"` |
| `codePreview.title` | `"ohmOS Code Preview"` | `"Code Preview"` |
| `codePreview.titleFullscreen` | `"ohmOS Code Preview Fullscreen"` | `"Code Preview Fullscreen"` |
| `spotlight.placeholder` | `"Search ohmOS"` | `"Search"` |
| `language.languageExplanation` | `"Select your preferred language for ohmOS interface"` | `"Select your preferred language"` |

Also replace:
- `"Send logs to Cursor agent"` → `"Send logs to debug agent"` (key `debug.sendLogs`)
- `"Cursor Cloud agent"` / `"Open agent in Cursor"` references → `"Cloud agent"` / `"Open agent"` (keys `cursorCloud.*`)

- [ ] **Step 1: Edit shell.json** — replace all "ohmOS" strings in user-facing values per the table above
- [ ] **Step 2: Edit shell.json** — replace "Cursor" brand references in debug/agent strings
- [ ] **Step 3: Verify** — `grep '"ohmOS"\|"Cursor"' src/lib/locales/en/shell.json` returns no remaining user-facing hits

---

### Task 2: i18n Translation JSON — Replace "ohmOS" References

**Files:**
- Modify: `src/lib/locales/en/translation.json` — ~15 keys

**Changes:**

| Key | Old value | New value |
|-----|-----------|-----------|
| `internet-explorer.pageLoadTimedOut` | `"...Internet Explorer stopped waiting to keep ohmOS responsive."` | `"...Internet Explorer stopped waiting to keep the system responsive."` |
| `chats.help.chatWithRyo.description` | `"Ask anything — Ryo can write code, summarize docs, or explain ohmOS features."` | `"Ask anything — write code, summarize docs, or explore the system."` |
| `chats.help.loginToRyOS` | `"Sign in to ohmOS"` | `"Sign in"` |
| `chats.help.chatGreeting` | `"Sign in to continue chatting with Ryo."` | `"Sign in to continue chatting."` |
| `videos.description` | `"Paste any YouTube URL and ohmOS fetches the metadata..."` | `"Paste any YouTube URL to fetch metadata into your playlist"` |
| `finder.helpItems.airdrop` | `"...AirDrop it to nearby ohmOS users instantly"` | `"...AirDrop it to nearby users instantly"` |
| `ipod.helpItems.ryosLinks` | `"YouTube songs share ohmOS links..."` | `"YouTube songs share links..."` |
| `calculator.helpItems.ryosAPI` | `"...through the ohmOS API"` | `"...through the API"` |

- [ ] **Step 1: Edit translation.json** — replace all "ohmOS" strings per table
- [ ] **Step 2: Verify** — `grep '"ohmOS"' src/lib/locales/en/translation.json` returns no remaining user-facing hits

---

### Task 3: Bouncing Screensaver — Replace "ohmOS" Text

**Files:**
- Modify: `src/components/screensavers/BouncingLogo.tsx:152-164`

**Change:** The SVG text element renders "ohmOS" as falling text. Replace with "OHMXO".

```diff
- {/* ohmOS logo */}
+ {/* OHMXO logo */}
 <text ...>
-  ohmOS
+  OHMXO
 </text>
```

- [ ] **Step 1: Edit BouncingLogo.tsx** — replace SVG text content
- [ ] **Step 2: Verify** — `grep "ohmOS" src/components/screensavers/BouncingLogo.tsx` returns nothing

---

### Task 4: ScreenSaverPicker Preview — Replace "ohmOS" Text

**Files:**
- Modify: `src/apps/control-panels/components/ScreenSaverPicker.tsx:118`

**Change:** The canvas `fillText("ohmOS", ...)` in the bouncing-logo preview thumbnail.

```diff
- ctx.fillText("ohmOS", x - 15, y + 5);
+ ctx.fillText("OHMXO", x - 20, y + 5);
```

(Note: "OHMXO" is slightly wider, so adjust x offset from -15 to -20 for centering.)

- [ ] **Step 1: Edit ScreenSaverPicker.tsx** — replace canvas fillText
- [ ] **Step 2: Verify** — `grep "ohmOS" src/apps/control-panels/components/ScreenSaverPicker.tsx` returns nothing

---

### Task 5: ErrorBoundaries — Replace "ohmOS" Labels

**Files:**
- Modify: `src/components/errors/ErrorBoundaries.tsx:391,397`

**Changes:**
```diff
- titleBarLabel="ohmOS"
+ titleBarLabel="OHMXO"
```
And the description text (already handled via i18n in Task 1, but has a hardcoded default):
```diff
- "Reload ohmOS to restore the Dock, Desktop, and menu bar."
+ "Reload to restore the Dock, Desktop, and menu bar."
```
This is the `defaultValue` in the `t()` call — the actual localized value comes from shell.json (Task 1).

- [ ] **Step 1: Edit ErrorBoundaries.tsx** — replace `titleBarLabel` and `defaultValue` text
- [ ] **Step 2: Verify** — `grep "ohmOS" src/components/errors/ErrorBoundaries.tsx` returns nothing

---

### Task 6: VersionDisplay — Replace "ohmOS" and os.ryo.lu URL

**Files:**
- Modify: `src/apps/control-panels/components/control-panels-app/VersionDisplay.tsx:18,25`

**Changes:**
```diff
- ohmOS {displayVersion}
+ OHMXO {displayVersion}
```
```diff
- launchApp("internet-explorer", { url: "os.ryo.lu/docs/changelog", ... })
+ launchApp("internet-explorer", { url: "ohmxo.com/docs/changelog", ... })
```

- [ ] **Step 1: Edit VersionDisplay.tsx** — replace text and URL
- [ ] **Step 2: Verify** — `grep "ohmOS\|os.ryo.lu"` on this file returns nothing

---

### Task 7: AccountProfileHeader — Replace "ohmOS Account"

**Files:**
- Modify: `src/apps/control-panels/components/control-panels-app/AccountProfileHeader.tsx:104,110`

The `alt` text and heading both use i18n key `apps.control-panels.ohmOSAccount`. Find this key in the locales and change the value.

**Files:**
- Modify: `src/lib/locales/en/shell.json` — find key `apps.control-panels.ohmOSAccount` and change `"ohmOS Account"` → `"Account"`

(Note: also check `src/lib/locales/en/translation.json` for the same key.)

- [ ] **Step 1: Search for `ohmOSAccount` key** — `grep -r "ohmOSAccount" src/lib/locales/` to find all occurrences
- [ ] **Step 2: Edit locale files** — change value from `"ohmOS Account"` to `"Account"` (or `"OHMXO Account"`)
- [ ] **Step 3: Verify** — `grep "ohmOSAccount"` values no longer contain "ohmOS"

---

### Task 8: Default Contacts — Replace Ryo Lu / Cursor / ryo.lu

**Files:**
- Modify: `src/utils/contacts.ts:67-76`

The `DEFAULT_RYO_CONTACT_DRAFT` is a pre-filled contact template shown to new users. Replace with Jacob's info.

```diff
 export const DEFAULT_RYO_CONTACT_DRAFT: ContactDraft = {
-  displayName: "Ryo Lu",
-  firstName: "Ryo",
-  lastName: "Lu",
-  nickname: "ryo",
-  organization: "Cursor",
-  emails: ["me@ryo.lu"],
-  urls: ["https://ryo.lu", "https://x.com/ryolu_", "https://os.ryo.lu"],
+  displayName: "Jacob Adeshiyan",
+  firstName: "Jacob",
+  lastName: "Adeshiyan",
+  nickname: "jacob",
+  organization: "OHMXO",
+  emails: ["jacob@ohmxo.com"],
+  urls: ["https://ohmxo.com", "https://x.com/ohmxo"],
   source: "manual",
 };
```

- [ ] **Step 1: Edit contacts.ts** — replace DEFAULT_RYO_CONTACT_DRAFT
- [ ] **Step 2: Verify** — `grep "Ryo Lu\|ryo.lu\|Cursor"` on this file returns no remaining default-contact hits

---

### Task 9: IE Default Bookmarks — Replace ryo.lu / os.ryo.lu / Cursor

**Files:**
- Modify: `src/stores/useInternetExplorerStore.ts:117-130,233-234`

**Changes:**
```diff
- { title: "Ryo", url: "https://ryo.lu", ... }
+ { title: "OHMXO", url: "https://ohmxo.com", ... }
```
```diff
- { title: "ohmOS Docs", url: "https://os.ryo.lu/docs", ... }
+ { title: "Docs", url: "https://ohmxo.com/docs", ... }
```
```diff
- { title: "Cursor", url: "https://cursor.sh", ... }
+ { title: "GitHub", url: "https://github.com/ohmxo", ... }  (or remove entirely)
```

- [ ] **Step 1: Edit useInternetExplorerStore.ts** — replace bookmarks
- [ ] **Step 2: Verify** — `grep "ryo.lu\|os.ryo.lu\|cursor.sh"` on this file returns no remaining default-bookmark hits

---

### Task 10: Default TV Video — Replace Cursor Channel reference

**Files:**
- Modify: `src/stores/useVideoStore.ts:130-131`

**Change:** The default video entry titled "Our designer built an OS with Cursor" by artist "Cursor". Replace with a neutral or OHMXO-related default.

```diff
  {
-   id: "TQhv6Wol6Ns",
-   url: "https://www.youtube.com/watch?v=TQhv6Wol6Ns&t=26s",
-   title: "Our designer built an OS with Cursor",
-   artist: "Cursor",
+   id: "dQw4w9WgXcQ",
+   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
+   title: "OHMXO Demo",
+   artist: "OHMXO",
  },
```

(Or remove the entry entirely if it's a fallback/placeholder — check what happens when the video list is empty.)

- [ ] **Step 1: Read full context** — check if this is a fallback default or a seed entry
- [ ] **Step 2: Edit useVideoStore.ts** — replace or remove the Cursor video
- [ ] **Step 3: Verify** — `grep "Cursor" src/stores/useVideoStore.ts` returns nothing

---

### Task 11: Applet-Related "ohmOS" References

**Files:**
- Modify: `src/apps/applet-viewer/components/AppletViewerMenuBar.tsx:251`
- Modify: `src/apps/applet-viewer/hooks/useAppletViewerLogic.ts:1188`
- Modify: `src/utils/appletImportExport.ts:250`
- Modify: `src/components/dialogs/TelegramLinkDialog.tsx:111`

**Changes:**
- `AppletViewerMenuBar.tsx`: i18n key value `"ohmOS App"` → `"Applet"` (find key in locale, change value)
- `useAppletViewerLogic.ts`: `"ohmOS Applet"` → `"OHMXO Applet"`
- `appletImportExport.ts`: `"ohmOS Applet"` → `"OHMXO Applet"`
- `TelegramLinkDialog.tsx`: `alt="ohmOS"` → `alt="OHMXO"`

- [ ] **Step 1: Search for affected i18n keys** — `grep -r "ryosApp\|ohmOSApp" src/lib/locales/`
- [ ] **Step 2: Edit locale files** — change values
- [ ] **Step 3: Edit useAppletViewerLogic.ts** — replace filter string
- [ ] **Step 4: Edit appletImportExport.ts** — replace filter string
- [ ] **Step 5: Edit TelegramLinkDialog.tsx** — replace alt text
- [ ] **Step 6: Verify** — check each file for remaining "ohmOS" text

---

### Task 12: Cleanup Orphaned Cursor Brand Assets

**Files:**
- Delete: `public/brands/cursor-cube-2d-dark.svg`
- Delete: `public/brands/cursor-cube-2d-light.svg`

These are no longer referenced by any code after the CursorBrandMark component was updated.

- [ ] **Step 1: Confirm no references** — `grep -r "cursor-cube-2d" src/` returns nothing
- [ ] **Step 2: Delete orphaned SVG files**
- [ ] **Step 3: Verify** — files no longer exist on disk

---

### Task 13: Final Validation

- [ ] **Step 1: Run `bun run typecheck`** — ensure no TypeScript errors
- [ ] **Step 2: Quick grep sweep** — `grep -rn '"ohmOS"\|"ryos"' src/lib/locales/en/` — only acceptable hits are the `ryosProfessional`/`ryos98`/`ryosApp`/`ohmOSAccount` key names (not values)
- [ ] **Step 3: Quick grep sweep** — `grep -rn '"Ryo Lu"\|"me@ryo.lu"\|"os.ryo.lu"\|"ryo.lu"\|"cursor.sh"\|"cursor-cube-2d"' src/` — should return no user-facing hits
- [ ] **Step 4: Summary** — report what was changed and what was intentionally left untouched