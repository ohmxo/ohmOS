import { useState, useCallback } from "react";
import type { Favorite } from "@/stores/useInternetExplorerStore";

interface IeStartPageProps {
  favorites: Favorite[];
  t: (key: string, opts?: Record<string, unknown>) => string;
  currentTheme: string;
  handleNavigate: (navUrl: string, navYear?: string) => void;
}

export function IeStartPage({
  favorites,
  t,
  currentTheme,
  handleNavigate,
}: IeStartPageProps) {
  const [query, setQuery] = useState("");
  const isDark =
    currentTheme === "macosx" ||
    document.documentElement.classList.contains("dark");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
      handleNavigate(searchUrl, "current");
    },
    [query, handleNavigate]
  );

  const handleFavoriteClick = useCallback(
    (fav: Favorite) => {
      if (fav.isDirectory || !fav.url) return;
      const fullUrl = fav.url.startsWith("http")
        ? fav.url
        : `https://${fav.url}`;
      handleNavigate(fullUrl, fav.year || "current");
    },
    [handleNavigate]
  );

  const renderFavorites = (items: Favorite[]) => {
    return items.map((fav, i) => {
      if (fav.isDirectory && fav.children) {
        return (
          <div key={i} className="mb-3">
            <div
              className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {fav.title}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fav.children.map((child, j) => (
                <button
                  key={j}
                  onClick={() => handleFavoriteClick(child)}
                  className={`text-[11px] px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${
                    isDark
                      ? "text-blue-400 hover:bg-blue-900/30"
                      : "text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {child.title}
                </button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <button
          key={i}
          onClick={() => handleFavoriteClick(fav)}
          className={`text-[11px] px-2 py-0.5 rounded-sm cursor-pointer transition-colors ${
            isDark
              ? "text-blue-400 hover:bg-blue-900/30"
              : "text-blue-700 hover:bg-blue-100"
          }`}
        >
          {fav.title}
        </button>
      );
    });
  };

  return (
    <div
      className={`size-full flex flex-col items-center justify-center ${
        isDark ? "bg-neutral-900 text-white" : "bg-white text-neutral-900"
      }`}
      style={{ fontFamily: "LucidaGrande, system-ui, sans-serif" }}
    >
      {/* Search section */}
      <div className="w-full max-w-[400px] px-4 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("apps.internet-explorer.enterUrlOrSearch")}
            className={`flex-1 text-[13px] px-3 py-1.5 border rounded-sm outline-none ${
              isDark
                ? "bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
                : "bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400"
            }`}
          />
          <button
            type="submit"
            className="text-[12px] px-3 py-1.5 rounded-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {t("apps.internet-explorer.search")}
          </button>
        </form>
        <p className={`text-[10px] mt-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
          {t("apps.internet-explorer.searchOpensInNewTab")}
        </p>
      </div>

      {/* Favorites grid */}
      {favorites.length > 0 && (
        <div className="w-full max-w-[400px] px-4">
          <div
            className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            {t("apps.internet-explorer.favorites")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {renderFavorites(favorites.filter((f) => !f.isDirectory))}
          </div>
          {favorites
            .filter((f) => f.isDirectory)
            .map((dir, i) => (
              <div key={`dir-${i}`} className="mt-3">
                {renderFavorites([dir])}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
