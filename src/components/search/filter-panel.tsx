"use client"

import { useState, useEffect } from "react"
import { ChevronUp, Funnel } from "lucide-react"
import { allCodeServie } from "@/services/allCodeService"
import { useRouter, useSearchParams } from "next/navigation"

interface FilterState {
    country?: string[]
    type?: string
    age_code?: string[]
    genre?: string[]
    version?: string[]
    year?: string[]
    sort?: string
}

interface FilterOptions {
    countries: any[]
    types: any[]
    ratings: any[]
    genres: any[]
    versions: any[]
    years: any[]
    sorts: any[]
}

interface FilterPanelProps {
    onFiltersChange?: (filters: FilterState) => void
    showResults?: boolean
}

export default function FilterPanel({ onFiltersChange, showResults = true }: FilterPanelProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isExpanded, setIsExpanded] = useState(false)
    const [filters, setFilters] = useState<FilterState>({})
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        countries: [],
        types: [],
        ratings: [],
        genres: [],
        versions: [],
        years: [],
        sorts: [],
    })
    const [yearSearch, setYearSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initialFilters: FilterState = {
            country: searchParams.get("country") ? searchParams.get("country")!.split(",") : undefined,
            type: searchParams.get("type") || undefined,
            age_code: searchParams.get("age_code") ? searchParams.get("age_code")!.split(",") : undefined,
            genre: searchParams.get("genre") ? searchParams.get("genre")!.split(",") : undefined,
            version: searchParams.get("version") ? searchParams.get("version")!.split(",") : undefined,
            year: searchParams.get("year") ? searchParams.get("year")!.split(",") : undefined,
            sort: searchParams.get("sort") || undefined,
        }
        setFilters(initialFilters)
    }, [searchParams])

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                setLoading(true)
                const [countriesRes, typesRes, ratingsRes, genresRes, versionsRes, yearsRes, sortsRes] =
                    await allCodeServie.getFilterOptions()

                setFilterOptions({
                    countries: countriesRes.data?.COUNTRY || [],
                    types: typesRes.data?.FILM_TYPE || [],
                    ratings: ratingsRes.data?.RANK || [],
                    genres: genresRes.data?.GENRE || [],
                    versions: versionsRes.data?.VERSION || [],
                    years: yearsRes.data?.YEAR || [],
                    sorts: sortsRes.data?.SORT || [],
                })
            } catch (error) {
                console.error("Error loading filter options:", error)
            } finally {
                setLoading(false)
            }
        }

        loadFilterOptions()
    }, [])

    const handleMultiSelectChange = (filterType: "country" | "age_code" | "genre" | "version" | "year", value: string) => {
        if (value === "All") {
            const currentValues = filters[filterType] || []
            if (currentValues.includes("All")) {
                // If "All" is already selected, deselect it
                const newValues = currentValues.filter((v) => v !== "All")
                const newFilters = {
                    ...filters,
                    [filterType]: newValues.length === 0 ? undefined : newValues,
                }
                setFilters(newFilters)
                if (onFiltersChange) {
                    onFiltersChange(newFilters)
                }
            } else {
                // Select only "All" and clear other selections
                const newFilters = {
                    ...filters,
                    [filterType]: ["All"],
                }
                setFilters(newFilters)
                if (onFiltersChange) {
                    onFiltersChange(newFilters)
                }
            }
        } else {
            // Regular multi-select logic
            const currentValues = filters[filterType] || []
            // Remove "All" if it was previously selected
            let newValues = currentValues.filter((v) => v !== "All")

            newValues = newValues.includes(value) ? newValues.filter((v) => v !== value) : [...newValues, value]

            const newFilters = {
                ...filters,
                [filterType]: newValues.length === 0 ? undefined : newValues,
            }
            setFilters(newFilters)
            if (onFiltersChange) {
                onFiltersChange(newFilters)
            }
        }

    }

    // Keep single-select for type and sort
    const handleSingleSelectChange = (filterType: "type" | "sort", value: string) => {
        const newFilters = { ...filters, [filterType]: filters[filterType] === value ? undefined : value }
        setFilters(newFilters)
        if (onFiltersChange) {
            onFiltersChange(newFilters)
        }
    }

    const buildQueryString = () => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    params.append(key, value.join(","))
                } else {
                    params.append(key, value)
                }
            }
        })
        return params.toString()
    }

    const applyFilters = () => {
        if (showResults) {
            const queryString = buildQueryString()
            const url = queryString ? `/search?${queryString}` : "/search"
            router.push(url)
        } else if (onFiltersChange) {
            onFiltersChange(filters)
        }
    }

    const clearAllFilters = () => {
        setFilters({})
        setYearSearch("")
        if (onFiltersChange) {
            onFiltersChange({})
        }
        if (showResults) {
            router.push("/search")
        }
    }

    const filteredYears = filterOptions.years.filter(
        (year) => year.valueVi?.includes(yearSearch) || year.valueEn?.includes(yearSearch),
    )

    return (
        <div className="w-full bg-background rounded-lg p-6 border border-slate-800 ">
            {/* Header with collapse button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-3 ">
                    <div className="w-8 h-8 rounded flex items-center justify-center">
                        <Funnel className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-foreground">Bộ lọc</h2>
                </div>
                <ChevronUp
                    className={`w-5 h-5 text-foreground transition-transform duration-300 ${isExpanded ? "rotate-0" : "rotate-180"}`}
                />
            </button>

            {isExpanded && (
                <div className="space-y-5">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD875]"></div>
                            </div>
                            <p className="text-muted-foreground mt-2 text-sm">Đang tải tùy chọn lọc...</p>
                        </div>
                    ) : (
                        <>
                            {/* Country Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Quốc gia:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.countries.map((country) => (
                                        <button
                                            key={country.keyMap}
                                            onClick={() => handleMultiSelectChange("country", country.valueEn)}
                                            className={`cursor-pointer px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.country?.includes(country.valueEn)
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:text-primary "
                                                }`}
                                        >
                                            {country.valueVi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Loại phim:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.types.map((type) => (
                                        <button
                                            key={type.keyMap}
                                            onClick={() => handleSingleSelectChange("type", type.valueEn)}
                                            className={`cursor-pointer  px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.type === type.valueEn
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:text-primary"
                                                }`}
                                        >
                                            {type.valueVi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Xếp hạng:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.ratings.map((rating) => (
                                        <button
                                            key={rating.keyMap}
                                            // send the value (e.g. "T18") rather than the full keyMap ("R_T18")
                                            onClick={() => handleMultiSelectChange("age_code", rating.valueEn)}
                                            className={`cursor-pointer px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.age_code?.includes(rating.valueEn)
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:btext-primary"
                                                }`}
                                        >
                                            {rating.valueVi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Genre Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Thể loại:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.genres.map((genre) => (
                                        <button
                                            key={genre.keyMap}
                                            onClick={() => handleMultiSelectChange("genre", genre.valueEn)}
                                            className={`cursor-pointer px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.genre?.includes(genre.valueEn)
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:text-primary"
                                                }`}
                                        >
                                            {genre.valueVi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Version Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Phiên bản:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.versions.map((version) => (
                                        <button
                                            key={version.keyMap}
                                            onClick={() => handleMultiSelectChange("version", version.valueEn)}
                                            className={`cursor-pointer px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.version?.includes(version.valueEn)
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:text-primary"
                                                }`}
                                        >
                                            {version.valueVi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Filter */}
                            <div className="pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Năm sản xuất:</span>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {filteredYears.slice(0, 8).map((year) => (
                                        <button
                                            key={year.keyMap}
                                            onClick={() => handleMultiSelectChange("year", year.valueEn)}
                                            className={`cursor-pointer px-3 py-1.5 rounded text-sm font-sm transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.year?.includes(year.valueEn)
                                                ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                : "bg-background text-foreground hover:text-primary"
                                                }`}
                                        >
                                            {year.valueVi}
                                        </button>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Nhập năm"
                                        value={yearSearch}
                                        onChange={(e) => setYearSearch(e.target.value)}
                                        className="px-3 py-1.5 rounded bg-background text-foreground text-sm placeholder-slate-500 border border-border focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="pb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-foreground font-semibold text-sm">Sắp xếp:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.sorts.length === 0 ? (
                                        <span className="text-muted-foreground text-sm">Không có tùy chọn</span>
                                    ) : (
                                        filterOptions.sorts.map((sort) => (
                                            <button
                                                key={sort.keyMap}
                                                onClick={() => handleSingleSelectChange("sort", sort.valueEn)}
                                                className={`cursor-pointer px-3 py-1.5 rounded text-sm font-medium transition-[color,background-color,border-color,opacity,transform,box-shadow] opacity-80 border border-transparent ${filters.sort === sort.valueEn
                                                    ? "!border-[#FFD875] text-primary opacity-100 !border"
                                                    : "bg-background text-foreground hover:text-primary"
                                                    }`}
                                            >
                                                {sort.valueVi}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
                                <button
                                    onClick={applyFilters}
                                    className="cursor-pointer px-8 py-2.5 rounded-full bg-[#FFD875] text-slate-950 font-bold hover:opacity-90 transition-colors flex items-center gap-2"
                                >
                                    Lọc kết quả →
                                </button>
                                <button
                                    onClick={clearAllFilters}
                                    className="cursor-pointer px-8 py-2.5 rounded-full border-2 border-border text-foreground font-semibold hover:bg-secondary transition-colors"
                                >
                                    Xóa tất cả
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
