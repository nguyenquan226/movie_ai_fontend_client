"use client"

import { useRouter } from "next/navigation"

export interface FilterQueryParams {
    country?: string
    type?: string
    age_code?: string
    genre?: string
    version?: string
    year?: string
    sort?: string
    current?: number
    limit?: number
}

/**
 * Hook for building and navigating with filter query strings
 * Provides utilities to construct and navigate to search results with filters
 */
export function useFilterQuery() {
    const router = useRouter()

    /**
     * Build a query string from filter parameters
     */
    const buildQueryString = (params: FilterQueryParams): string => {
        const searchParams = new URLSearchParams()

        if (params.country) searchParams.append("country", params.country)
        if (params.type) searchParams.append("type", params.type)
        if (params.age_code) searchParams.append("age_code", params.age_code)
        if (params.genre) searchParams.append("genre", params.genre)
        if (params.version) searchParams.append("version", params.version)
        if (params.year) searchParams.append("year", params.year)
        if (params.sort) searchParams.append("sort", params.sort)
        if (params.current) searchParams.append("current", params.current.toString())
        if (params.limit) searchParams.append("limit", params.limit.toString())

        return searchParams.toString()
    }

    /**
     * Navigate to search results with filter parameters
     */
    const navigateWithFilters = (params: FilterQueryParams) => {
        const queryString = buildQueryString(params)
        const url = queryString ? `/search?${queryString}` : "/search"
        router.push(url)
    }

    return {
        buildQueryString,
        navigateWithFilters,
    }
}
