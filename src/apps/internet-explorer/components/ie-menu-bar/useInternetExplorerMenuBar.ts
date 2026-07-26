import { useTranslation } from "react-i18next";
import { useAppMenuBarChrome } from "@/hooks/useAppMenuBarChrome";
import type { InternetExplorerMenuBarProps } from "./types";

export type InternetExplorerMenuBarViewModel = ReturnType<
  typeof useInternetExplorerMenuBar
>;

export function useInternetExplorerMenuBar(props: InternetExplorerMenuBarProps) {
  const {
    onRefresh,
    onStop,
    onHome,
    onShowHelp,
    onShowAbout,
    isLoading,
    favorites = [],
    history = [],
    onAddFavorite,
    onClearFavorites,
    onResetFavorites,
    onNavigateToFavorite,
    onNavigateToHistory,
    onFocusUrlInput,
    onClose,
    onGoBack,
    onGoForward,
    canGoBack,
    canGoForward,
    onClearHistory,
    onSharePage,
  } = props;

  const { t } = useTranslation();
  const {
    isShareDialogOpen,
    setIsShareDialogOpen,
    isWindowsTheme,
    isMacOSTheme,
    appId,
    appName,
  } = useAppMenuBarChrome("internet-explorer");

  return {
    t,
    isShareDialogOpen,
    setIsShareDialogOpen,
    appId,
    appName,
    isWindowsTheme,
    isMacOSTheme,
    onRefresh,
    onStop,
    onHome,
    onShowHelp,
    onShowAbout,
    isLoading,
    favorites,
    history,
    onAddFavorite,
    onClearFavorites,
    onResetFavorites,
    onNavigateToFavorite,
    onNavigateToHistory,
    onFocusUrlInput,
    onClose,
    onGoBack,
    onGoForward,
    canGoBack,
    canGoForward,
    onClearHistory,
    onSharePage,
  };
}