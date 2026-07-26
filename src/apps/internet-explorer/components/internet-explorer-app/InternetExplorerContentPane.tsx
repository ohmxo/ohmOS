import type { RefObject } from "react";
import { OfflineEmptyState } from "@/components/shared/OfflineEmptyState";
import { useOffline } from "@/hooks/useOffline";
import type { Favorite } from "@/stores/useInternetExplorerStore";
import { getTranslatedAppName } from "@/utils/i18n";
import { ErrorPage } from "./ErrorPage";
import { IeStartPage } from "./IeStartPage";

export interface InternetExplorerContentPaneProps {
  errorMessage: string | null;
  finalUrl: string | null;
  status: "idle" | "loading" | "error";
  url: string;
  isForeground: boolean;
  currentTheme: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  t: (key: string, options?: Record<string, unknown>) => string;
  handleGoBack: () => void;
  handleNavigate: (navUrl: string, navYear?: string) => void;
  handleIframeLoad: () => void;
  handleIframeError: () => void;
  bringInstanceToForeground: (instanceId: string) => void;
  instanceId: string;
  favorites: Favorite[];
}

export function InternetExplorerContentPane({
  errorMessage,
  finalUrl,
  status,
  url,
  isForeground,
  currentTheme,
  iframeRef,
  t,
  handleGoBack,
  handleNavigate,
  handleIframeLoad,
  handleIframeError,
  bringInstanceToForeground,
  instanceId,
  favorites,
}: InternetExplorerContentPaneProps) {
  const isOffline = useOffline();

  return (
    <div className="flex-1 relative bg-white">
      {errorMessage ? (
        <ErrorPage
          title={t("apps.internet-explorer.error")}
          primaryMessage={errorMessage}
          suggestions={[
            t("apps.internet-explorer.checkWebAddressAndTryAgain"),
            t("apps.internet-explorer.goBackToPreviousPage"),
            t("apps.internet-explorer.tryRefreshingThePage"),
          ]}
          footerText=""
          t={t}
          onGoBack={handleGoBack}
          onRetry={() => handleNavigate(url)}
        />
      ) : status === "loading" || finalUrl ? (
        <iframe
          ref={iframeRef}
          src={finalUrl || undefined}
          className="border-0 block"
          style={{ width: "calc(100% + 1px)", height: "calc(100% + 1px)" }}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        <IeStartPage
          favorites={favorites}
          t={t}
          currentTheme={currentTheme}
          handleNavigate={handleNavigate}
        />
      )}

      {isOffline && (
        <div className="absolute inset-0 z-[45] bg-white">
          <OfflineEmptyState appName={getTranslatedAppName("internet-explorer")} />
        </div>
      )}

      {!isForeground && (
        <div
          className="absolute inset-0 bg-transparent z-50"
          onClick={() => bringInstanceToForeground(instanceId)}
          onMouseDown={() => bringInstanceToForeground(instanceId)}
          onTouchStart={() => bringInstanceToForeground(instanceId)}
          onWheel={() => bringInstanceToForeground(instanceId)}
          onDragStart={() => bringInstanceToForeground(instanceId)}
          onKeyDown={() => bringInstanceToForeground(instanceId)}
        />
      )}
    </div>
  );
}