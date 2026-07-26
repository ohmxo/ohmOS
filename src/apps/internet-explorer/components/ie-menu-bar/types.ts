import type { AppProps } from "../../../base/types";
import type {
  Favorite,
  HistoryEntry,
} from "@/stores/useInternetExplorerStore";

/** Props for the Internet Explorer app menubar shell (`ie-menu-bar/`). */
export interface InternetExplorerMenuBarProps
  extends Omit<AppProps, "onClose" | "instanceId"> {
  instanceId?: string;
  onRefresh?: () => void;
  onStop?: () => void;
  onGoToUrl?: () => void;
  onHome?: () => void;
  onShowHelp?: () => void;
  onShowAbout?: () => void;
  isLoading?: boolean;
  favorites?: Favorite[];
  history?: HistoryEntry[];
  onAddFavorite?: () => void;
  onClearFavorites?: () => void;
  onResetFavorites?: () => void;
  onNavigateToFavorite?: (url: string, year?: string) => void;
  onNavigateToHistory?: (url: string, year?: string) => void;
  onFocusUrlInput?: () => void;
  onClose?: () => void;
  onGoBack?: () => void;
  onGoForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onClearHistory?: () => void;
  onSharePage?: () => void;
}