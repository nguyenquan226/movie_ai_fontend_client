export interface FilmDetailRes {
    filmId: string
    title: string
    originalTitle?: string
    description?: string
    posterUrl?: string
    filmImages?: Array<{
        url: string
        type: "poster" | "horizontal" | "backdrop"
    }>
    year?: string
    age?: {
        keyMap: string
        valueEn: string
        valueVi: string
        description: string
    }
    language?: {
        keyMap: string
        valueEn: string
        valueVi: string
        description: string
    }
    genres?: Array<{
        keyMap: string
        valueEn: string
        valueVi: string
        description: string
    }>
    duration?: number
    slug?: string
    view?: number
}
