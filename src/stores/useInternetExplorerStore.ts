import { create } from "zustand";
import { useStoreShallow } from "./helpers";
import { persist } from "zustand/middleware";

// Define types
export interface Favorite {
  title: string;
  url?: string; // Optional for folders
  favicon?: string;
  year?: string;
  children?: Favorite[]; // Add children for nested folders
  isDirectory?: boolean; // New: Flag to indicate if it's a folder
}

export interface HistoryEntry {
  url: string;
  title: string;
  favicon?: string;
  timestamp: number;
}

export const DEFAULT_URL = "https://lite.duckduckgo.com/lite/";

export const DEFAULT_FAVORITES: Favorite[] = [
  {
    title: "Apple",
    url: "https://apple.com",
    favicon: "https://www.google.com/s2/favicons?domain=apple.com&sz=32",
    isDirectory: false,
  },
  {
    title: "OHMXO",
    url: "https://ohmxo.com",
    favicon: "https://www.google.com/s2/favicons?domain=ohmxo.com&sz=32",
    isDirectory: false,
  },
  {
    title: "Docs",
    url: "https://ohmxo.com/docs",
    favicon: "https://www.google.com/s2/favicons?domain=ohmxo.com&sz=32",
    isDirectory: false,
  },
  {
    title: "Friends",
    isDirectory: true,
    children: [
      { title: "ISOCITY", url: "https://iso-city.com", favicon: "https://www.google.com/s2/favicons?domain=iso-city.com&sz=32" },
      { title: "Ian", url: "https://shaoruu.io", favicon: "https://www.google.com/s2/favicons?domain=shaoruu.io&sz=32" },
      { title: "Long", url: "https://os.rocorgi.wang", favicon: "https://www.google.com/s2/favicons?domain=os.rocorgi.wang&sz=32" },
      { title: "Maya", url: "https://mayabakir.com", favicon: "https://www.google.com/s2/favicons?domain=mayabakir.com&sz=32" },
      { title: "Modi", url: "https://www.akm.io", favicon: "https://www.google.com/s2/favicons?domain=www.akm.io&sz=32" },
      { title: "Sam", url: "https://www.samuelcatania.com", favicon: "https://www.google.com/s2/favicons?domain=www.samuelcatania.com&sz=32" },
      { title: "Stephen", url: "https://wustep.me", favicon: "https://www.google.com/s2/favicons?domain=wustep.me&sz=32" },
      { title: "Theo", url: "https://tmb.sh", favicon: "https://www.google.com/s2/favicons?domain=tmb.sh&sz=32" },
      { title: "Tyler", url: "https://tyler.cafe", favicon: "https://www.google.com/s2/favicons?domain=tyler.cafe&sz=32" },
      { title: "Andrew", url: "https://www.andrewl.ee", favicon: "https://www.google.com/s2/favicons?domain=www.andrewl.ee&sz=32" },
      { title: "Ekin", url: "https://www.ekinoflazer.com", favicon: "https://www.google.com/s2/favicons?domain=www.ekinoflazer.com&sz=32" },
      { title: "Lucas", url: "https://www.lucasn.com", favicon: "https://www.google.com/s2/favicons?domain=www.lucasn.com&sz=32" },
    ],
  },
  {
    title: "Work",
    isDirectory: true,
    children: [
      { title: "GitHub", url: "https://github.com/ohmxo", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=32" },
      { title: "Notion", url: "https://notion.com", favicon: "https://www.google.com/s2/favicons?domain=notion.com&sz=32" },
      { title: "Stripe", url: "https://stripe.com", favicon: "https://www.google.com/s2/favicons?domain=stripe.com&sz=32" },
    ],
  },
  {
    title: "Tools",
    isDirectory: true,
    children: [
      { title: "HyperCards", url: "https://hcsimulator.com", favicon: "https://www.google.com/s2/favicons?domain=hcsimulator.com&sz=32" },
    ],
  },
  {
    title: "Sites",
    isDirectory: true,
    children: [
      { title: "Disney", url: "https://disney.com", favicon: "https://www.google.com/s2/favicons?domain=disney.com&sz=32" },
      { title: "GeoCities", url: "https://geocities.restorativland.org", favicon: "https://www.google.com/s2/favicons?domain=geocities.com&sz=32" },
      { title: "Microsoft", url: "https://microsoft.com", favicon: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=32" },
      { title: "Netscape", url: "https://netscape.com", favicon: "https://www.google.com/s2/favicons?domain=netscape.com&sz=32" },
      { title: "NYTimes", url: "https://nytimes.com", favicon: "https://www.google.com/s2/favicons?domain=nytimes.com&sz=32" },
      { title: "Wikipedia", url: "https://en.wikipedia.org/wiki", favicon: "https://www.google.com/s2/favicons?domain=en.wikipedia.org&sz=32" },
      { title: "Google", url: "https://google.com", favicon: "https://www.google.com/s2/favicons?domain=google.com&sz=32" },
      { title: "Space Jam", url: "https://www.spacejam.com/index.cgi", favicon: "https://www.google.com/s2/favicons?domain=spacejam.com&sz=32" },
    ],
  },
];

const CURRENT_IE_STORE_VERSION = 9;

interface InternetExplorerStore {
  // Navigation state
  url: string;
  status: "idle" | "error";

  // Favorites and history
  favorites: Favorite[];
  history: HistoryEntry[];
  historyIndex: number;

  // Dialog states
  isTitleDialogOpen: boolean;
  newFavoriteTitle: string;
  isNavigatingHistory: boolean;
  isClearFavoritesDialogOpen: boolean;
  isClearHistoryDialogOpen: boolean;

  // Title management
  currentPageTitle: string | null;
  errorMessage: string | null;

  // Actions
  setUrl: (url: string) => void;
  navigateToUrl: (url: string) => void;
  addHistoryEntry: (entry: HistoryEntry) => void;

  // Favorites actions
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (index: number) => void;
  clearFavorites: () => void;

  // History actions
  setHistoryIndex: (index: number) => void;
  clearHistory: () => void;

  // Dialog actions
  setTitleDialogOpen: (isOpen: boolean) => void;
  setNewFavoriteTitle: (title: string) => void;
  setNavigatingHistory: (isNavigating: boolean) => void;
  setClearFavoritesDialogOpen: (isOpen: boolean) => void;
  setClearHistoryDialogOpen: (isOpen: boolean) => void;

  // Title management action
  setCurrentPageTitle: (title: string | null) => void;
  setErrorMessage: (msg: string | null) => void;
}

// Helper to normalize URLs for history
const normalizeUrl = (url: string): string => {
  let normalized = url.replace(/^https?:\/\//, "");
  normalized = normalized.replace(/\/$/, "");
  return normalized;
};

const getInitialState = () => ({
  url: DEFAULT_URL,
  status: "idle" as const,
  favorites: DEFAULT_FAVORITES,
  history: [] as HistoryEntry[],
  historyIndex: -1,
  isTitleDialogOpen: false,
  newFavoriteTitle: "",
  isNavigatingHistory: false,
  isClearFavoritesDialogOpen: false,
  isClearHistoryDialogOpen: false,
  currentPageTitle: null as string | null,
  errorMessage: null as string | null,
});

export const useInternetExplorerStore = create<InternetExplorerStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setUrl: (url) => set({ url }),

      navigateToUrl: (url) => {
        const normalized = normalizeUrl(url);
        const hostname = (() => {
          try {
            return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
          } catch {
            return url;
          }
        })();
        const newEntry: HistoryEntry = {
          url: normalized,
          title: hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
          timestamp: Date.now(),
        };

        set((state) => {
          // Discard forward stack (entries before historyIndex)
          const currentIndex = state.historyIndex > 0 ? state.historyIndex : 0;
          const trimmedHistory = state.history.slice(currentIndex);
          const currentEntry = trimmedHistory[0];

          // Check for duplicate
          const isDuplicate =
            currentEntry &&
            normalizeUrl(currentEntry.url) === normalized;

          if (isDuplicate) {
            return {
              url: normalized,
              status: "idle" as const,
              currentPageTitle: hostname,
              history: [newEntry, ...trimmedHistory.slice(1)].slice(0, 100),
              historyIndex: 0,
            };
          }

          return {
            url: normalized,
            status: "idle" as const,
            currentPageTitle: hostname,
            history: [newEntry, ...trimmedHistory].slice(0, 100),
            historyIndex: 0,
          };
        });
      },

      addHistoryEntry: (entry) =>
        set((state) => {
          const currentIndex = state.historyIndex > 0 ? state.historyIndex : 0;
          const trimmedHistory = state.history.slice(currentIndex);
          return {
            history: [entry, ...trimmedHistory].slice(0, 100),
            historyIndex: 0,
          };
        }),

      addFavorite: (favorite) =>
        set((state) => ({
          favorites: [...state.favorites, favorite],
        })),

      removeFavorite: (index) =>
        set((state) => ({
          favorites: state.favorites.filter((_f, i) => i !== index),
        })),

      clearFavorites: () => set({ favorites: [] }),

      setHistoryIndex: (index) => set({ historyIndex: index }),

      clearHistory: () => set({ history: [], historyIndex: -1 }),

      setTitleDialogOpen: (isOpen) => set({ isTitleDialogOpen: isOpen }),
      setNewFavoriteTitle: (title) => set({ newFavoriteTitle: title }),
      setNavigatingHistory: (isNavigating) =>
        set({ isNavigatingHistory: isNavigating }),
      setClearFavoritesDialogOpen: (isOpen) =>
        set({ isClearFavoritesDialogOpen: isOpen }),
      setClearHistoryDialogOpen: (isOpen) =>
        set({ isClearHistoryDialogOpen: isOpen }),

      setCurrentPageTitle: (title) => set({ currentPageTitle: title }),
      setErrorMessage: (msg) => set({ errorMessage: msg }),
    }),
    {
      name: "ryos:internet-explorer",
      version: CURRENT_IE_STORE_VERSION,
      migrate: (persisted, version) => {
        if (version < 9) {
          return { ...getInitialState() };
        }
        return persisted as InternetExplorerStore;
      },
      partialize: (state) => ({
        url: state.url,
        favorites: state.favorites,
        history: state.history.slice(0, 50),
      }),
    }
  )
);

/**
 * Shallow-equality selector hook for this store. Co-located with the store
 * (rather than a central helpers barrel) so importing it doesn't pull other
 * stores into the bundle.
 */
export function useInternetExplorerStoreShallow<T>(
  selector: (state: ReturnType<typeof useInternetExplorerStore.getState>) => T
): T {
  return useStoreShallow(useInternetExplorerStore, selector);
}