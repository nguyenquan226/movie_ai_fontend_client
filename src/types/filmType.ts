export type FilmCode = string | {
    keyMap?: string
    valueEn?: string
    valueVi?: string
    description?: string
}

export interface FilmDetailRes {
    filmId: string
    title: string
    originalTitle?: string
    isVip?: boolean
    description?: string
    thumbUrl?: string
    posterUrl?: string
    filmImages?: Array<{
        url: string
        type: "poster" | "horizontal" | "backdrop"
    }>
    year?: string
    releaseDate?: string
    age?: FilmCode
    language?: FilmCode
    genres?: FilmCode[]
    duration?: number
    slug: string
    view?: number
    type?: FilmCode
    country?: FilmCode
    ratingData?: { averageRating?: number; totalRatings?: number }
    partData?: Array<{ id: string }>
    badges?: Array<{ text: string; color?: string }>
    episodes?: string
}

export interface FilmListData {
    result: FilmDetailRes[]
    meta?: {
        current?: number
        pageSize?: number
        pages?: number
        total?: number
        page?: number
        limit?: number
        totalPages?: number
    }
}
