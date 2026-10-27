import { Input } from "@/components/ui/input";
import { SearchMessage } from "@/constants/messages/search.message";
import { useFilmRouter } from "@/hooks/filmRouter";
import { searchService } from "@/services/searchService";
import {
  IActorSearch,
  IDirectorSearch,
  IFilmSearch,
  IProducerSearch,
} from "@/types/search.type";
import { Loader, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SearchDropdown({
  isScrolled,
}: {
  isScrolled: boolean;
}) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { goDirectorDetail, goActorDetail, goProducerDetail, goFilmDetail } =
    useFilmRouter();

  const [results, setResults] = useState({
    films: [] as IFilmSearch[],
    actors: [] as IActorSearch[],
    directors: [] as IDirectorSearch[],
    producers: [] as IProducerSearch[],
  });

  const resetResults = () =>
    setResults({
      films: [],
      actors: [],
      directors: [],
      producers: [],
    });

  const hasAnyResult =
    results.films.length ||
    results.actors.length ||
    results.directors.length ||
    results.producers.length;

  // debounce
  useEffect(() => {
    if (!keyword.trim()) {
      setShowDropdown(false);
      resetResults();
      return;
    }

    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    if (!debouncedKeyword.trim()) return;
    fetchAllSearch();
  }, [debouncedKeyword]);

  const fetchAllSearch = async () => {
    setIsSearching(true);
    setShowDropdown(true);

    try {
      const [filmRes, actorRes, directorRes, producerRes] = await Promise.all([
        searchService.callSearchFilm(debouncedKeyword),
        searchService.searchActor(debouncedKeyword),
        searchService.searchDirector(debouncedKeyword),
        searchService.searchProducer(debouncedKeyword),
      ]);

      await new Promise((r) => setTimeout(r, 500));

      setResults({
        films:
          filmRes?.EC === 1 && filmRes.data?.films?.length
            ? filmRes.data.films
            : [],
        actors:
          actorRes?.EC === 1 && actorRes.data?.actors?.length
            ? actorRes.data.actors
            : [],
        directors:
          directorRes?.EC === 1 && directorRes.data?.directors?.length
            ? directorRes.data.directors
            : [],
        producers:
          producerRes?.EC === 1 && producerRes.data?.producers?.length
            ? producerRes.data.producers
            : [],
      });
    } catch (e) {
      toast.error(SearchMessage.error);
      resetResults();
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    resetResults();
  };

  // click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex-1 max-w-md" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
        <Input
          id="site-search"
          aria-label="Tìm kiếm phim, diễn viên, đạo diễn hoặc nhà sản xuất"
          value={keyword}
          onChange={handleChange}
          type="text"
          placeholder="Tìm kiếm phim"
          className={`pl-10 border-2 text-foreground placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow] duration-300
            focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
            ${
              isScrolled
                ? "bg-secondary border-border focus-visible:border-border focus-visible:ring-2 focus-visible:ring-primary/30"
                : "bg-card/80 border-none focus-visible:border-border border-border"
            }
          `}
        />

        {keyword.trim() !== "" && showDropdown && (
          <div className="absolute mt-2 left-0 w-full bg-secondary border border-border rounded-xl shadow-xl p-2 md:p-3 z-50 max-w-[calc(100vw-2rem)] md:max-w-full">
            {isSearching && (
              <div className="flex items-center justify-center py-6 text-muted-foreground" role="status" aria-live="polite">
                <Loader className="animate-spin" size={20} />{" "}
                <span className="ml-1.5">Đang tìm kiếm</span>
              </div>
            )}

            {!isSearching && !hasAnyResult && (
              <div className="text-center text-muted-foreground py-4" role="status" aria-live="polite">
                Không tìm thấy kết quả nào
              </div>
            )}

            {!isSearching && hasAnyResult && (
              <>
                <div className="space-y-2 md:space-y-3 max-h-80 overflow-y-auto pr-1">
                  {results.films.length > 0 && (
                    <>
                      <p className="text-muted-foreground text-xs md:text-sm mb-1">
                        Danh sách phim
                      </p>

                      {results.films.map((film) => (
                        <div
                          key={film.filmId}
                          onClick={() => {
                            goFilmDetail(film.slug);
                            setKeyword("");
                            setDebouncedKeyword("");
                            setShowDropdown(false);
                            resetResults();
                          }}
                          className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 md:p-2 hover:bg-accent rounded-lg transition"
                        >
                          <img
                            src={film.thumbUrl}
                            className="w-8 h-11 md:w-12 md:h-16 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-foreground font-semibold text-xs md:text-sm truncate">
                              {film.title}
                            </div>
                            <div className="text-muted-foreground text-[10px] md:text-xs italic truncate">
                              {film.originalTitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {results.actors.length > 0 && (
                    <>
                      <p className="text-muted-foreground text-xs md:text-sm mb-1">
                        Diễn viên
                      </p>

                      {results.actors.map((actor) => (
                        <div
                          onClick={() => {
                            goActorDetail(actor.slug);
                          }}
                          key={actor.actorId}
                          className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 md:p-2 hover:bg-accent rounded-lg transition"
                        >
                          <img
                            src={actor.avatarUrl}
                            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full flex-shrink-0"
                          />
                          <span className="text-foreground text-xs md:text-sm truncate">
                            {actor.actorName}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {results.directors.length > 0 && (
                    <>
                      <p className="text-muted-foreground text-xs md:text-sm mb-1">
                        Đạo diễn
                      </p>

                      {results.directors.map((dir) => (
                        <div
                          onClick={() => {
                            goDirectorDetail(dir.slug);
                          }}
                          key={dir.directorId}
                          className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 md:p-2 hover:bg-accent rounded-lg transition"
                        >
                          <img
                            src={dir.avatarUrl}
                            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full flex-shrink-0"
                          />
                          <span className="text-foreground text-xs md:text-sm truncate">
                            {dir.directorName}
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {results.producers.length > 0 && (
                    <>
                      <p className="text-muted-foreground text-xs md:text-sm mb-1">
                        Nhà sản xuất
                      </p>

                      {results.producers.map((pro) => (
                        <div
                          onClick={() => {
                            goProducerDetail(pro.producerId);
                          }}
                          key={pro.producerId}
                          className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 md:p-2 hover:bg-accent rounded-lg transition"
                        >
                          <img
                            src={"/images/producer.jpg"}
                            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full flex-shrink-0"
                          />
                          <span className="text-foreground text-xs md:text-sm truncate">
                            {pro.producerName}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button type="button" className="w-full mt-2 md:mt-3 py-1.5 md:py-2 text-xs md:text-sm text-primary bg-accent rounded-md hover:bg-secondary transition-colors">
                  Toàn bộ kết quả
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
