import { AppProps, InternetExplorerInitialData } from "@/apps/base/types";
import { AppWindowShell } from "@/components/shared/AppWindowShell";
import { InternetExplorerMenuBar } from "../InternetExplorerMenuBar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShareItemDialog } from "@/components/dialogs/ShareItemDialog";
import { useInternetExplorerLogic } from "../../hooks/useInternetExplorerLogic";
import { InternetExplorerToolbar } from "./InternetExplorerToolbar";
import { InternetExplorerContentPane } from "./InternetExplorerContentPane";
import { InternetExplorerAppDialogs } from "./InternetExplorerAppDialogs";

export function InternetExplorerAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
  skipInitialSound,
  helpItems,
  initialData,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps<InternetExplorerInitialData>) {
  const logic = useInternetExplorerLogic({
    isWindowOpen,
    isForeground,
    initialData,
    instanceId,
    helpItems,
  });

  const {
    url,
    finalUrl,
    status,
    favorites,
    history,
    historyIndex,
    isTitleDialogOpen,
    newFavoriteTitle,
    isHelpDialogOpen,
    isAboutDialogOpen,
    isClearFavoritesDialogOpen,
    isClearHistoryDialogOpen,
    currentPageTitle,
    errorMessage,
    hasMoreToScroll,
    isUrlDropdownOpen,
    setIsUrlDropdownOpen,
    filteredSuggestions,
    localUrl,
    setLocalUrl,
    isSelectingText,
    setIsSelectingText,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    dropdownStyle,
    displayTitle,
    isShareDialogOpen,
    setIsShareDialogOpen,
    urlInputRef,
    iframeRef,
    favoritesContainerRef,
    currentTheme,
    isWindowsTheme,
    isOffline,
    handleNavigate,
    handleNavigateWithHistory,
    handleFilterSuggestions,
    handleGoBack,
    handleGoForward,
    handleAddFavorite,
    handleTitleSubmit,
    handleClearFavorites,
    handleRefresh,
    handleStop,
    handleGoToUrl,
    handleHome,
    handleSharePage,
    handleIframeLoad,
    handleIframeError,
    stripProtocol,
    isValidUrl,
    normalizeUrlInline,
    normalizeUrlForHistory,
    ieGenerateShareUrl,
    setTitleDialogOpen,
    setNewFavoriteTitle,
    setHelpDialogOpen,
    setAboutDialogOpen,
    setClearFavoritesDialogOpen,
    setClearHistoryDialogOpen,
    clearHistory,
    translatedHelpItems,
    setUrl,
    bringInstanceToForeground,
    t,
  } = logic;

  const menuBar = (
    <InternetExplorerMenuBar
      isWindowOpen={isWindowOpen}
      isForeground={isForeground}
      onRefresh={handleRefresh}
      onStop={handleStop}
      onFocusUrlInput={handleGoToUrl}
      onHome={handleHome}
      onShowHelp={() => setHelpDialogOpen(true)}
      onShowAbout={() => setAboutDialogOpen(true)}
      isLoading={false}
      favorites={favorites}
      history={history}
      onAddFavorite={handleAddFavorite}
      onClearFavorites={() => setClearFavoritesDialogOpen(true)}
      onNavigateToFavorite={(favUrl) =>
        handleNavigateWithHistory(favUrl)
      }
      onNavigateToHistory={handleNavigateWithHistory}
      onGoBack={handleGoBack}
      onGoForward={handleGoForward}
      canGoBack={historyIndex < history.length - 1}
      canGoForward={historyIndex > 0}
      onClearHistory={() => setClearHistoryDialogOpen(true)}
      onClose={onClose}
      onSharePage={handleSharePage}
      skipInitialSound={skipInitialSound}
      instanceId={instanceId}
      onNavigateNext={onNavigateNext}
      onNavigatePrevious={onNavigatePrevious}
    />
  );

  return (
    <AppWindowShell
      isWindowOpen={isWindowOpen}
      isWindowsTheme={isWindowsTheme}
      isForeground={isForeground}
      menuBar={menuBar}
      windowFrameProps={{
        title: displayTitle,
        onClose,
        isForeground,
        appId: "internet-explorer",
        skipInitialSound,
        instanceId,
        onNavigateNext,
        onNavigatePrevious,
      }}
      trailing={
        <ShareItemDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          itemType={t("apps.internet-explorer.page")}
          itemTypeKey="page"
          itemIdentifier={url}
          title={currentPageTitle || url}
          generateShareUrl={ieGenerateShareUrl}
        />
      }
    >
      <TooltipProvider>
        <div className="flex flex-col size-full relative">
            <InternetExplorerToolbar
              isWindowsTheme={isWindowsTheme}
              currentTheme={currentTheme}
              isOffline={isOffline}
              historyIndex={historyIndex}
              historyLength={history.length}
              url={url}
              favorites={favorites}
              hasMoreToScroll={hasMoreToScroll}
              urlInputRef={urlInputRef}
              favoritesContainerRef={favoritesContainerRef}
              localUrl={localUrl}
              isUrlDropdownOpen={isUrlDropdownOpen}
              filteredSuggestions={filteredSuggestions}
              selectedSuggestionIndex={selectedSuggestionIndex}
              dropdownStyle={dropdownStyle}
              isSelectingText={isSelectingText}
              t={t}
              setLocalUrl={setLocalUrl}
              setUrl={setUrl}
              setIsUrlDropdownOpen={setIsUrlDropdownOpen}
              setIsSelectingText={setIsSelectingText}
              setSelectedSuggestionIndex={setSelectedSuggestionIndex}
              stripProtocol={stripProtocol}
              isValidUrl={isValidUrl}
              normalizeUrlInline={normalizeUrlInline}
              normalizeUrlForHistory={normalizeUrlForHistory}
              handleFilterSuggestions={handleFilterSuggestions}
              handleNavigate={handleNavigate}
              handleNavigateWithHistory={handleNavigateWithHistory}
              handleGoBack={handleGoBack}
              handleGoForward={handleGoForward}
              handleSharePage={handleSharePage}
            />

            <InternetExplorerContentPane
              errorMessage={errorMessage}
              finalUrl={finalUrl}
              status={status}
              url={url}
              isForeground={!!isForeground}
              currentTheme={currentTheme}
              iframeRef={iframeRef}
              t={t}
              handleGoBack={handleGoBack}
              handleNavigate={handleNavigate}
              handleIframeLoad={handleIframeLoad}
              handleIframeError={handleIframeError}
              bringInstanceToForeground={bringInstanceToForeground}
              instanceId={instanceId}
              favorites={favorites}
            />
          </div>

          <InternetExplorerAppDialogs
            isTitleDialogOpen={isTitleDialogOpen}
            newFavoriteTitle={newFavoriteTitle}
            isHelpDialogOpen={isHelpDialogOpen}
            isAboutDialogOpen={isAboutDialogOpen}
            isClearFavoritesDialogOpen={isClearFavoritesDialogOpen}
            isClearHistoryDialogOpen={isClearHistoryDialogOpen}
            translatedHelpItems={translatedHelpItems}
            url={url}
            setTitleDialogOpen={setTitleDialogOpen}
            setNewFavoriteTitle={setNewFavoriteTitle}
            setHelpDialogOpen={setHelpDialogOpen}
            setAboutDialogOpen={setAboutDialogOpen}
            setClearFavoritesDialogOpen={setClearFavoritesDialogOpen}
            setClearHistoryDialogOpen={setClearHistoryDialogOpen}
            handleTitleSubmit={handleTitleSubmit}
            handleClearFavorites={handleClearFavorites}
            clearHistory={clearHistory}
            handleNavigate={handleNavigate}
          />
      </TooltipProvider>
    </AppWindowShell>
  );
}