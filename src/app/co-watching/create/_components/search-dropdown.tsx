import VIPBadge from "@/components/film/detail/VIPBagde";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchMessage } from "@/constants/messages/search.message";
import { cn } from "@/lib/utils";
import { searchService } from "@/services/searchService";
import { useAuthStore } from "@/stores/authStore";
import { IFilmSearch } from "@/types/search.type";
import { Loader, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SearchDropdownProps {
  className?: string;
  onSelectFilm: (film: IFilmSearch) => void;
}

export default function SearchDropdown({ className, onSelectFilm }: SearchDropdownProps) {
  const { authUser } = useAuthStore();

  const [filmResult, setFilmResult] = useState<IFilmSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyword.trim() === "") {
      setShowDropdown(false);
      setFilmResult([]);
      return;
    }
    const searchHander = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(searchHander);
  }, [keyword]);

  useEffect(() => {
    if (debouncedKeyword.trim() === "") return;
    fetchSearchFilmResult();
  }, [debouncedKeyword]);

  const fetchSearchFilmResult = async () => {
    if (debouncedKeyword.trim() === "") {
      setFilmResult([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    try {
      const res = await searchService.callSearchFilm(debouncedKeyword);
      await new Promise((r) => setTimeout(r, 500));
      if (res && res.EC === 1) {
        if (
          res.data?.films.length !== undefined &&
          res.data?.films.length > 0
        ) {
          setFilmResult(res.data.films);
        } else {
          setFilmResult([]);
        }
      }
    } catch (error) {
      console.log("Error from search film fetch function: ", error);
      toast.error(SearchMessage.error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChangSeachValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(event.target.value);
    setFilmResult([]);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSelectFilmSearch = (film: IFilmSearch) => {
    if (film.isVip && !authUser.isVip) {
      toast.warning("Vui lòng đăng ký VIP để chọn phim này")
      return;
    }
    onSelectFilm(film);
    setKeyword("");
    setDebouncedKeyword("");
    setShowDropdown(false);
    setFilmResult([]);
  }

  return (
    <>
      <div className="flex-1 w-full" ref={wrapperRef}>
        <div className="relative ">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground/70" />
          <Input
            value={keyword}
            onChange={handleChangSeachValue}
            type="text"
            placeholder="Tìm kiếm phim để tạo phòng..."
            className={cn("form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-foreground focus:outline-0 focus:ring-3 focus:ring-primary/50 focus:border-primary/50 h-full placeholder:text-muted-foreground/70 dark:placeholder:text-[#a19cba] px-4 text-base font-normal leading-normal border-y border-gray-300 dark:border-[#3f3b54] bg-gray-100 dark:bg-[#1d1b27] pl-12 lg:py-4 md:py-3 py-2 rounded-3xl", className)}
          />
          {keyword.trim() !== "" && showDropdown && (
            <div className="absolute left-0 mt-4  w-full bg-secondary/30 backdrop-blur-sm  border border-border rounded-xl p-3 z-50 shadow-[0px_0px_10px_0px_#d4d4d8]">
              {/* Loading */}
              {isSearching && (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader
                    className="animate-spin"
                    size={20}
                    style={{ animationDuration: "1.5s" }}
                  />{" "}
                  <span className="ml-1.5">Đang tìm phim</span>
                </div>
              )}

              {/* Không có kết quả */}
              {!isSearching && filmResult.length === 0 && (
                <div className="text-muted-foreground text-center py-4">
                  Không tìm thấy kết quả nào
                </div>
              )}

              {/* Có kết quả */}
              {!isSearching && filmResult.length > 0 && (
                <>
                  <p className="text-muted-foreground text-sm mb-2">Danh sách phim</p>

                  <ScrollArea className="max-h-90 rounded-md overflow-auto">
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {filmResult.map((film) => (
                        <div
                          key={film.filmId}
                          onClick={() => handleSelectFilmSearch(film)}
                          className="flex gap-3 cursor-pointer p-2 hover:bg-accent rounded-lg transition"
                        >
                          <img
                            src={film.thumbUrl}
                            className="w-12 h-16 object-cover rounded-md"
                          />
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-foreground font-semibold text-sm">
                              {film.title}
                              {
                                film.isVip &&
                                <VIPBadge size="sm" className="ml-2" />
                              }
                            </span>
                            <span className="text-muted-foreground text-xs italic">
                              {film.originalTitle}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          )}
        </div>
      </div >
    </>
  );
}
