"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import filmServices from "@/services/filmService";
import MovieCardVertical from "@/components/homepage/movie-card-vertical";
import FilterPanel from "@/components/search/filter-panel";
import { userFavoriteStore } from "@/stores/favoriteStore";
import { userServices } from "@/services";
import { LayoutPanelLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

interface SearchResult {
  result: any[];
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const getPosterUrl = (film: any): string => {
  if (film.posterUrl) return film.posterUrl;
  if (film.filmImages && Array.isArray(film.filmImages)) {
    const posterImage = film.filmImages.find(
      (img: any) => img.type === "poster"
    );
    if (posterImage) return posterImage.url;
    if (film.filmImages.length > 0) return film.filmImages[0].url;
  }
  return "/placeholder.svg";
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [meta, setMeta] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { favoriteList, fetchFavoriteList } = userFavoriteStore();
  const { isAuthenticated } = useAuthStore();

  const handleToggleFavorite = async (filmId: string) => {
    if (isAuthenticated) {
      await userServices.toggleFavoriteFilm(filmId);
      fetchFavoriteList();
    } else {
      toast.warning("Vui lòng đăng nhập");
    }
  };

  const fetchSearchResults = async (page = 1) => {
    setLoading(true);
    try {
      const filters = {
        country: searchParams.get("country") || undefined,
        type: searchParams.get("type") || undefined,
        age_code: searchParams.get("age_code") || undefined,
        genre: searchParams.get("genre") || undefined,
        version: searchParams.get("version") || undefined,
        year: searchParams.get("year") || undefined,
      };

      const sort = searchParams.get("sort") || undefined;
      const limit = 20;

      const response = await filmServices.searchFilms(
        filters,
        sort,
        page,
        limit
      );
      console.log("Search response:", response);
      if (response.data) {
        setResults(
          (response.data.result || []).map((film: any) => ({
            ...film,
            posterUrl: getPosterUrl(film),
          }))
        );
        setMeta(response.data.meta);
        setTotalItems(response.data.meta?.total || 0);
        setCurrentPage(response.data.meta?.current || 1);
        setTotalPages(response.data.meta?.pages || 0);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(1);
  }, [searchParams]);
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteList();
    }
  }, [isAuthenticated]);
  // const isFavorite = (filmId: string) => {
  //     return favoriteList.some((fav: any) => fav.filmId === filmId)
  // }

  return (
    <div className="w-full bg-background p-6 min-h-screen mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex align-middle">
          <LayoutPanelLeft className="w-8 h-8 font-bold text-foreground mr-4" />
          <h1 className="text-2xl md:text-2xl font-bold text-foreground mb-4">
            Duyệt Tìm
          </h1>
        </div>
        {/* Filter Panel */}
        <FilterPanel showResults={true} />

        {/* Results Section */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-foreground mt-4">Đang tải phim...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              <h3 className="text-lg font-bold text-foreground mb-6">
                Kết quả: <span className="text-primary">{totalItems}</span>{" "}
                phim
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((film) => {
                  let isFavorite = false;
                  const index = favoriteList.findIndex(
                    (f) => f.filmId === film.filmId
                  );
                  if (index !== -1) {
                    isFavorite = true;
                  }

                  return (
                    <div key={film.filmId}>
                      <MovieCardVertical
                        item={film}
                        isFavorite={isFavorite}
                        handleToggleFavorite={handleToggleFavorite}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12 flex-wrap">
                  {currentPage > 1 && (
                    <button
                      onClick={() => fetchSearchResults(currentPage - 1)}
                      className="px-4 py-2 rounded border border-border text-foreground hover:bg-secondary transition-colors"
                    >
                      Trước
                    </button>
                  )}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum =
                      currentPage > 3 ? currentPage - 2 + i : i + 1;
                    return pageNum <= totalPages ? pageNum : null;
                  }).map((page) =>
                    page ? (
                      <button
                        key={page}
                        onClick={() => fetchSearchResults(page)}
                        className={`px-4 py-2 rounded transition-colors font-semibold ${
                          currentPage === page
                            ? "bg-primary text-slate-950"
                            : "border border-border text-foreground hover:bg-secondary"
                        }`}
                      >
                        {page}
                      </button>
                    ) : null
                  )}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => fetchSearchResults(currentPage + 1)}
                      className="px-4 py-2 rounded border border-border text-foreground hover:bg-secondary transition-colors"
                    >
                      Sau
                    </button>
                  )}
                </div>
              )}
            </>
          ) : hasSearched ? (
            <div className="text-center py-12">
              <p className="text-foreground text-lg">Không tìm thấy phim phù hợp</p>
              <p className="text-muted-foreground mt-2">
                Hãy thử đổi điều kiện tìm kiếm
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Chọn bộ lọc và nhấn "Lọc kết quả" để xem phim
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
