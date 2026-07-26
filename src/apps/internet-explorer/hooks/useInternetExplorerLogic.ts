import {
  useEffect,
  useRef,
  useReducer,
  useState,
  useCallback,
  CSSProperties,
} from "react";
import type { InternetExplorerInitialData } from "../../base/types";
import { DEFAULT_FAVORITES } from "@/stores/useInternetExplorerStore";
import type { Favorite } from "@/stores/useInternetExplorerStore";
import { useAppStore } from "@/stores/useAppStore";
import { useThemeFlags } from "@/hooks/useThemeFlags";
import { useOffline } from "@/hooks/useOffline";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useTranslatedHelpItems } from "@/hooks/useTranslatedHelpItems";
import { useAppHelpAboutDialogs } from "@/hooks/useAppHelpAboutDialogs";
import { useInternetExplorerStoreShallow } from "@/stores/useInternetExplorerStore";
import { onAppUpdate } from "@/utils/appEventBus";
import { formatTitle, decodeData } from "../utils/urlHelpers";
import {
  type SuggestionItem,
  urlBarUiReducer,
  urlBarUiInitialState,
} from "../utils/urlBarUiReducer";

interface UseInternetExplorerLogicProps {
  isWindowOpen: boolean;
  isForeground?: boolean;
  initialData?: InternetExplorerInitialData;
  instanceId: string;
  helpItems?: Array<{ icon: string; title: string; description: string }>;
}

export function useInternetExplorerLogic({
  isWindowOpen,
  initialData,
  instanceId,
  helpItems,
}: UseInternetExplorerLogicProps) {
  const bringInstanceToForeground = useAppStore(
    (state) => state.bringInstanceToForeground
  );
  const clearInstanceInitialData = useAppStore(
    (state) => state.clearInstanceInitialData
  );

  const {
    url,
    favorites,
    history,
    historyIndex,
    isTitleDialogOpen,
    newFavoriteTitle,
    isClearFavoritesDialogOpen,
    isClearHistoryDialogOpen,
    currentPageTitle,
    errorMessage,

    setUrl,
    addFavorite,
    clearFavorites,
    setHistoryIndex,
    clearHistory,
    setTitleDialogOpen,
    setNewFavoriteTitle,
    setNavigatingHistory,
    setClearFavoritesDialogOpen,
    setClearHistoryDialogOpen,
    setCurrentPageTitle,
    setErrorMessage,
    navigateToUrl,
  } = useInternetExplorerStoreShallow((state) => ({
    url: state.url,
    favorites: state.favorites,
    history: state.history,
    historyIndex: state.historyIndex,
    isTitleDialogOpen: state.isTitleDialogOpen,
    newFavoriteTitle: state.newFavoriteTitle,
    isClearFavoritesDialogOpen: state.isClearFavoritesDialogOpen,
    isClearHistoryDialogOpen: state.isClearHistoryDialogOpen,
    currentPageTitle: state.currentPageTitle,
    errorMessage: state.errorMessage,
    isNavigatingHistory: state.isNavigatingHistory,

    setUrl: state.setUrl,
    addFavorite: state.addFavorite,
    clearFavorites: state.clearFavorites,
    setHistoryIndex: state.setHistoryIndex,
    clearHistory: state.clearHistory,
    setTitleDialogOpen: state.setTitleDialogOpen,
    setNewFavoriteTitle: state.setNewFavoriteTitle,
    setNavigatingHistory: state.setNavigatingHistory,
    setClearFavoritesDialogOpen: state.setClearFavoritesDialogOpen,
    setClearHistoryDialogOpen: state.setClearHistoryDialogOpen,
    setCurrentPageTitle: state.setCurrentPageTitle,
    setErrorMessage: state.setErrorMessage,
    navigateToUrl: state.navigateToUrl,
  }));

  const { t } = useTranslation();
  const {
    isHelpDialogOpen,
    setIsHelpDialogOpen: setHelpDialogOpen,
    isAboutDialogOpen,
    setIsAboutDialogOpen: setAboutDialogOpen,
  } = useAppHelpAboutDialogs();
  const translatedHelpItems = useTranslatedHelpItems(
    "internet-explorer",
    helpItems ?? []
  );
  const appName = t("apps.internet-explorer.appName");

  const getSharedPageToastDescription = useCallback(
    (sharedPage: { url: string; year?: string }) =>
      `${sharedPage.url}${
        sharedPage.year && sharedPage.year !== "current"
          ? ` ${t("apps.internet-explorer.from")} ${sharedPage.year}`
          : ""
      }`,
    [t]
  );

  const showInvalidShareLinkToast = useCallback(() => {
    toast.error(t("apps.internet-explorer.invalidShareLink"), {
      description: t("apps.internet-explorer.shareLinkInvalidOrCorrupted"),
      duration: 5000,
    });
  }, [t]);

  const [hasMoreToScroll] = useState(false);
  const [urlBarUiState, dispatchUrlBarUi] = useReducer(
    urlBarUiReducer,
    urlBarUiInitialState,
    (initialState) => ({
      ...initialState,
      localUrl: url.replace(/^(https?:\/\/|ftp:\/\/)/i, ""),
    })
  );
  const {
    isUrlDropdownOpen,
    filteredSuggestions,
    localUrl,
    isSelectingText,
    selectedSuggestionIndex,
    dropdownStyle,
  }: {
    isUrlDropdownOpen: boolean;
    filteredSuggestions: SuggestionItem[];
    localUrl: string;
    isSelectingText: boolean;
    selectedSuggestionIndex: number;
    dropdownStyle: CSSProperties;
  } = urlBarUiState;
  const setIsUrlDropdownOpen = useCallback((value: boolean) => {
    dispatchUrlBarUi({ type: "setIsUrlDropdownOpen", value });
  }, []);
  const setFilteredSuggestions = useCallback((value: SuggestionItem[]) => {
    dispatchUrlBarUi({ type: "setFilteredSuggestions", value });
  }, []);
  const setLocalUrl = useCallback((value: string) => {
    dispatchUrlBarUi({ type: "setLocalUrl", value });
  }, []);
  const setIsSelectingText = useCallback((value: boolean) => {
    dispatchUrlBarUi({ type: "setIsSelectingText", value });
  }, []);
  const setSelectedSuggestionIndex = useCallback((value: number) => {
    dispatchUrlBarUi({ type: "setSelectedSuggestionIndex", value });
  }, []);
  const setDropdownStyle = useCallback(
    (value: CSSProperties | ((prev: CSSProperties) => CSSProperties)) => {
      dispatchUrlBarUi({ type: "setDropdownStyle", value });
    },
    []
  );

  const urlInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const favoritesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { currentTheme, isWindowsTheme } = useThemeFlags();

  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [displayTitle, setDisplayTitle] = useState<string>(appName);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const stripProtocol = useCallback((u: string): string => {
    if (!u) return "";
    return u.replace(/^(https?:\/\/|ftp:\/\/)/i, "");
  }, []);

  const normalizeUrlInline = useCallback((u: string): string => {
    if (!u) return "";
    let n = u.trim().toLowerCase();
    n = n.replace(/^(https?:\/\/|ftp:\/\/)/i, "");
    n = n.replace(/\/$/g, "");
    n = n.replace(/^www\./i, "");
    return n;
  }, []);

  const isValidUrl = useCallback(
    (urlString: string): boolean => {
      if (!urlString || !urlString.trim()) return false;
      const trimmed = stripProtocol(urlString.trim());
      if (trimmed.startsWith("bing:")) return false;
      return (
        /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?/i.test(trimmed) ||
        /^localhost(:[0-9]+)?$/i.test(trimmed) ||
        /^(\d{1,3}\.){3}\d{1,3}(:[0-9]+)?$/i.test(trimmed)
      );
    },
    [stripProtocol]
  );

  const [prevStoreUrl, setPrevStoreUrl] = useState(url);
  if (prevStoreUrl !== url) {
    setPrevStoreUrl(url);
    setLocalUrl(stripProtocol(url));
  }

  useEffect(() => {
    let newTitle = appName;
    if (currentPageTitle) {
      newTitle = formatTitle(currentPageTitle);
    } else if (url) {
      try {
        newTitle = formatTitle(
          new URL(url.startsWith("http") ? url : `https://${url}`).hostname
        );
      } catch {
        newTitle = appName;
      }
    }
    setDisplayTitle(newTitle);
  }, [currentPageTitle, url, appName]);

  // --- Navigation ---
  const handleNavigate = useCallback(
    (targetUrl: string = localUrl || url) => {
      if (!targetUrl.trim()) return;

      setErrorDetails(null);
      if (abortControllerRef.current) abortControllerRef.current.abort();

      const urlToNavigate = targetUrl.trim();
      let normalizedUrl = urlToNavigate;
      if (!urlToNavigate.startsWith("http://") && !urlToNavigate.startsWith("https://")) {
        if (isValidUrl(urlToNavigate) || urlToNavigate.includes(".")) {
          normalizedUrl = `https://${urlToNavigate}`;
        } else {
          normalizedUrl = `https://duckduckgo.com/?q=${encodeURIComponent(urlToNavigate)}`;
        }
      }

      const proxyUrl = `/api/iframe-check?mode=proxy&url=${encodeURIComponent(normalizedUrl)}&theme=${encodeURIComponent(currentTheme)}`;
      setFinalUrl(proxyUrl);
      setStatus("loading");
      setUrl(normalizedUrl);
      navigateToUrl(normalizedUrl);
    },
    [url, localUrl, isValidUrl, currentTheme, navigateToUrl, setUrl]
  );

  const handleNavigateWithHistory = useCallback(
    (targetUrl: string) => {
      setNavigatingHistory(false);
      setIsUrlDropdownOpen(false);
      handleNavigate(targetUrl);
    },
    [handleNavigate, setNavigatingHistory]
  );

  const handleRefresh = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    handleNavigate(url);
  }, [handleNavigate, url]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (iframeRef.current) iframeRef.current.src = "about:blank";
    setStatus("idle");
  }, []);

  const handleHome = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (iframeRef.current) iframeRef.current.src = "about:blank";
    setStatus("idle");
    setCurrentPageTitle(null);
    setErrorMessage(null);
    setFinalUrl(null);
    setErrorDetails(null);
  }, [setCurrentPageTitle, setErrorMessage]);

  const handleGoBack = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setNavigatingHistory(true);
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      handleNavigate(history[nextIndex].url);
    }
  }, [history, historyIndex, setHistoryIndex, handleNavigate, setNavigatingHistory]);

  const handleGoForward = useCallback(() => {
    if (historyIndex > 0) {
      setNavigatingHistory(true);
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      handleNavigate(history[nextIndex].url);
    }
  }, [history, historyIndex, setHistoryIndex, handleNavigate, setNavigatingHistory]);

  const handleGoToUrl = useCallback(() => {
    urlInputRef.current?.focus();
    urlInputRef.current?.select();
    setIsSelectingText(true);
  }, []);

  // --- Favorites ---
  const handleAddFavorite = useCallback(() => {
    const titleSource =
      currentPageTitle ||
      (() => {
        try {
          if (url) return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
        } catch {}
        return t("apps.internet-explorer.page");
      })();
    setNewFavoriteTitle(titleSource);
    setTitleDialogOpen(true);
  }, [currentPageTitle, url, setNewFavoriteTitle, setTitleDialogOpen, t]);

  const handleTitleSubmit = useCallback(() => {
    if (!newFavoriteTitle) return;
    const favHostname = (() => {
      try {
        if (url) return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
      } catch {}
      return "unknown.com";
    })();
    addFavorite({
      title: newFavoriteTitle,
      url,
      favicon: `https://www.google.com/s2/favicons?domain=${favHostname}&sz=32`,
    });
    setTitleDialogOpen(false);
  }, [newFavoriteTitle, addFavorite, url, setTitleDialogOpen]);

  const handleResetFavorites = useCallback(() => {
    clearFavorites();
    DEFAULT_FAVORITES.forEach((fav) => addFavorite(fav));
  }, [clearFavorites, addFavorite]);

  const handleClearFavorites = useCallback(() => {
    clearFavorites();
    setClearFavoritesDialogOpen(false);
  }, [clearFavorites, setClearFavoritesDialogOpen]);

  // --- Suggestions ---
  const handleFilterSuggestions = useCallback(
    (inputValue: string) => {
      if (!inputValue.trim()) {
        const flat: SuggestionItem[] = [];
        favorites.forEach((fav) => {
          if (!fav.children && fav.url) {
            flat.push({ title: fav.title || "", url: fav.url, type: "favorite" as const, year: fav.year, favicon: fav.favicon });
          }
        });
        favorites.forEach((fav) => {
          if (fav.children) {
            fav.children.forEach((child) => {
              if (child.url) {
                flat.push({ title: child.title || "", url: child.url, type: "favorite" as const, year: child.year, favicon: child.favicon });
              }
            });
          }
        });
        setFilteredSuggestions(flat);
        setSelectedSuggestionIndex(flat.length > 0 ? 0 : -1);
        return;
      }
      const ni = inputValue.toLowerCase();
      const match = (fav: Favorite) =>
        fav.title?.toLowerCase().includes(ni) || fav.url?.toLowerCase().includes(ni)
          ? { title: fav.title || "", url: fav.url || "", type: "favorite" as const, year: fav.year, favicon: fav.favicon, normalizedUrl: normalizeUrlInline(fav.url || "") }
          : null;

      const favMatches: Array<SuggestionItem> = [];
      favorites.forEach((fav) => {
        if (fav.children) fav.children.forEach((c) => { const m = match(c); if (m) favMatches.push(m); });
        else if (fav.url) { const m = match(fav); if (m) favMatches.push(m); }
      });
      const histMatches = history
        .filter((e) => !e.url.startsWith("https://www.bing.com/search?q=") && (e.title?.toLowerCase().includes(ni) || e.url.toLowerCase().includes(ni)))
        .slice(0, 5)
        .map((e) => ({ title: e.title || e.url, url: e.url, type: "history" as const, favicon: e.favicon, normalizedUrl: normalizeUrlInline(e.url) }));
      const merged = [...favMatches, ...histMatches];
      const seen = new Set<string>();
      const deduped: SuggestionItem[] = [];
      merged.forEach((s) => {
        if (!s.normalizedUrl || seen.has(s.normalizedUrl)) return;
        seen.add(s.normalizedUrl);
        const { normalizedUrl, ...rest } = s;
        deduped.push(rest);
      });
      if (inputValue.trim() && !isValidUrl(inputValue)) {
        deduped.push({
          title: `${t("apps.internet-explorer.search")} "${inputValue}"`,
          url: `bing:${inputValue}`,
          type: "search" as const,
          favicon: "/icons/bing.png",
        });
      }
      setFilteredSuggestions(deduped);
      setSelectedSuggestionIndex(deduped.length > 0 ? 0 : -1);
    },
    [favorites, history, isValidUrl, normalizeUrlInline, t]
  );

  // --- Share ---
  const handleSharePage = useCallback(() => { setIsShareDialogOpen(true); }, []);
  const ieGenerateShareUrl = useCallback(
    (identifier: string, secondaryIdentifier?: string) => {
      const combined = `${identifier}|${secondaryIdentifier || "current"}`;
      const code = btoa(combined).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `${window.location.origin}/internet-explorer/${code}`;
    },
    []
  );

  // --- Initial nav ---
  const initialNavigationRef = useRef(false);
  const lastProcessedInitialDataRef = useRef<unknown>(null);

  useEffect(() => {
    if (!initialNavigationRef.current && isWindowOpen) {
      initialNavigationRef.current = true;
      const typedData = initialData as InternetExplorerInitialData | undefined;
      if (typedData?.shareCode) {
        const decoded = decodeData(typedData.shareCode);
        if (decoded) {
          toast.info(t("apps.internet-explorer.openingSharedPage"), { description: getSharedPageToastDescription(decoded), duration: 4000 });
          handleNavigate(decoded.url);
          if (instanceId) clearInstanceInitialData(instanceId);
          lastProcessedInitialDataRef.current = initialData;
        } else {
          showInvalidShareLinkToast();
        }
      } else if (typedData?.url) {
        setUrl(typedData.url);
        handleNavigate(typedData.url);
        if (instanceId) clearInstanceInitialData(instanceId);
        lastProcessedInitialDataRef.current = initialData;
      }
    }
  }, [initialData, isWindowOpen, handleNavigate, clearInstanceInitialData, instanceId, setUrl, t, getSharedPageToastDescription, showInvalidShareLinkToast]);

  // --- Re-open initial data ---
  useEffect(() => {
    if (!isWindowOpen || !initialData || lastProcessedInitialDataRef.current === initialData || !initialNavigationRef.current) return;
    const typedData = initialData as InternetExplorerInitialData;
    if (typedData.shareCode) {
      const decoded = decodeData(typedData.shareCode);
      if (decoded) {
        toast.info(t("apps.internet-explorer.openingSharedPage"), { description: getSharedPageToastDescription(decoded), duration: 4000 });
        setTimeout(() => { handleNavigate(decoded.url); if (instanceId) clearInstanceInitialData(instanceId); }, 50);
        lastProcessedInitialDataRef.current = initialData;
      }
    } else if (typedData.url) {
      setTimeout(() => { handleNavigate(typedData.url); if (instanceId) clearInstanceInitialData(instanceId); }, 50);
      lastProcessedInitialDataRef.current = initialData;
    }
  }, [isWindowOpen, initialData, handleNavigate, clearInstanceInitialData, instanceId, t, getSharedPageToastDescription]);

  // --- updateApp events ---
  useEffect(() => {
    const cb = (event: CustomEvent<{ appId: string; instanceId?: string; initialData?: unknown }>) => {
      if (event.detail.appId !== "internet-explorer") return;
      if (event.detail.instanceId && event.detail.instanceId !== instanceId) return;
      const evData = event.detail.initialData as { shareCode?: string; url?: string } | undefined;
      if (!evData || lastProcessedInitialDataRef.current === evData) return;
      if (evData.shareCode) {
        const decoded = decodeData(evData.shareCode);
        if (decoded) {
          toast.info(t("apps.internet-explorer.openingSharedPage"), { description: getSharedPageToastDescription(decoded), duration: 4000 });
          setTimeout(() => handleNavigate(decoded.url), 50);
          lastProcessedInitialDataRef.current = evData;
        }
      } else if (evData.url) {
        setTimeout(() => handleNavigate(evData.url), 50);
        lastProcessedInitialDataRef.current = evData;
      }
    };
    const unsub = onAppUpdate(cb);
    return () => unsub();
  }, [handleNavigate, instanceId, t, getSharedPageToastDescription]);

  // --- Wheel scroll for favorites ---
  useEffect(() => {
    const c = favoritesContainerRef.current;
    if (!c) return;
    const h = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        c.scrollLeft += e.deltaY;
      }
    };
    c.addEventListener("wheel", h, { passive: false });
    return () => c.removeEventListener("wheel", h);
  }, []);

  // --- Dropdown resize ---
  useEffect(() => {
    const update = () => {
      if (isUrlDropdownOpen && urlInputRef.current) {
        const mobile = window.innerWidth < 640;
        if (mobile) {
          const rect = urlInputRef.current.getBoundingClientRect();
          setDropdownStyle({ position: "fixed", top: `${rect.bottom}px`, left: "1rem", right: "1rem", zIndex: 50 });
        } else {
          setDropdownStyle({});
        }
      } else {
        setDropdownStyle({});
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isUrlDropdownOpen, setDropdownStyle]);

const isOffline = useOffline();

  const handleIframeLoad = useCallback(() => {
    setStatus("idle");
  }, []);

  const handleIframeError = useCallback(() => {
    setStatus("error");
    setErrorDetails(t("apps.internet-explorer.pageCouldNotBeLoaded"));
  }, [t]);

  return {
    url, favorites, history, historyIndex, isTitleDialogOpen, newFavoriteTitle,
    isHelpDialogOpen, isAboutDialogOpen, isClearFavoritesDialogOpen, isClearHistoryDialogOpen,
    currentPageTitle, errorMessage, finalUrl, status, errorDetails,

    setUrl, setTitleDialogOpen, setNewFavoriteTitle, setHelpDialogOpen, setAboutDialogOpen,
    setClearFavoritesDialogOpen, setClearHistoryDialogOpen, clearHistory, addFavorite, clearFavorites,

    hasMoreToScroll, isUrlDropdownOpen, setIsUrlDropdownOpen, filteredSuggestions,
    localUrl, setLocalUrl, isSelectingText, setIsSelectingText,
    selectedSuggestionIndex, setSelectedSuggestionIndex, dropdownStyle,
    displayTitle, isShareDialogOpen, setIsShareDialogOpen,

    urlInputRef, iframeRef, favoritesContainerRef,

    currentTheme, isWindowsTheme, isOffline,

    handleNavigate, handleNavigateWithHistory, handleFilterSuggestions,
    handleGoBack, handleGoForward, handleAddFavorite, handleTitleSubmit,
    handleResetFavorites, handleClearFavorites, handleRefresh, handleStop,
    handleGoToUrl, handleHome, handleSharePage, handleIframeLoad, handleIframeError,

    stripProtocol, isValidUrl, normalizeUrlInline, normalizeUrlForHistory: normalizeUrlInline, ieGenerateShareUrl,
    bringInstanceToForeground,
    t, translatedHelpItems,
  };
}