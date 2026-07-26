import { InputDialog } from "@/components/dialogs/InputDialog";
import { AppHelpAboutDialogs } from "@/components/shared/AppHelpAboutDialogs";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { appMetadata } from "../..";
import type { AppProps } from "@/apps/base/types";
import { useTranslation } from "react-i18next";

export interface InternetExplorerAppDialogsProps {
  isTitleDialogOpen: boolean;
  newFavoriteTitle: string;
  isHelpDialogOpen: boolean;
  isAboutDialogOpen: boolean;
  isClearFavoritesDialogOpen: boolean;
  isClearHistoryDialogOpen: boolean;
  translatedHelpItems: NonNullable<AppProps["helpItems"]>;
  url: string;
  setTitleDialogOpen: (open: boolean) => void;
  setNewFavoriteTitle: (title: string) => void;
  setHelpDialogOpen: (open: boolean) => void;
  setAboutDialogOpen: (open: boolean) => void;
  setClearFavoritesDialogOpen: (open: boolean) => void;
  setClearHistoryDialogOpen: (open: boolean) => void;
  handleTitleSubmit: () => void;
  handleClearFavorites: () => void;
  clearHistory: () => void;
  handleNavigate: (navUrl: string, navYear?: string) => void;
}

export function InternetExplorerAppDialogs({
  isTitleDialogOpen,
  newFavoriteTitle,
  isHelpDialogOpen,
  isAboutDialogOpen,
  isClearFavoritesDialogOpen,
  isClearHistoryDialogOpen,
  translatedHelpItems,
  setTitleDialogOpen,
  setNewFavoriteTitle,
  setHelpDialogOpen,
  setAboutDialogOpen,
  setClearFavoritesDialogOpen,
  setClearHistoryDialogOpen,
  handleTitleSubmit,
  handleClearFavorites,
  clearHistory,
}: InternetExplorerAppDialogsProps) {
  const { t } = useTranslation();

  return (
    <>
      <InputDialog
        isOpen={isTitleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        onSubmit={handleTitleSubmit}
        title={t("apps.internet-explorer.addFavorite")}
        description={t("apps.internet-explorer.enterTitleForFavorite")}
        value={newFavoriteTitle}
        onChange={setNewFavoriteTitle}
      />
      <AppHelpAboutDialogs
        appId="internet-explorer"
        helpItems={translatedHelpItems}
        metadata={appMetadata}
        isHelpOpen={isHelpDialogOpen}
        onHelpOpenChange={setHelpDialogOpen}
        isAboutOpen={isAboutDialogOpen}
        onAboutOpenChange={setAboutDialogOpen}
      />
      <ConfirmDialog
        isOpen={isClearFavoritesDialogOpen}
        onOpenChange={setClearFavoritesDialogOpen}
        onConfirm={handleClearFavorites}
        title={t("apps.internet-explorer.clearFavorites")}
        description={t("apps.internet-explorer.areYouSureClearFavorites")}
      />
      <ConfirmDialog
        isOpen={isClearHistoryDialogOpen}
        onOpenChange={setClearHistoryDialogOpen}
        onConfirm={() => {
          clearHistory();
          setClearHistoryDialogOpen(false);
        }}
        title={t("apps.internet-explorer.clearHistory")}
        description={t("apps.internet-explorer.areYouSureClearHistory")}
      />
    </>
  );
}