import { Plus } from "lucide-react"

interface Playlist {
    id: string
    name: string
    movieCount: number
    lastUpdated?: string
}

interface PlaylistMainContentProps {
    playlists?: Playlist[]
    title?: string
    showAddButton?: boolean
    isEmpty?: boolean
    emptyMessage?: string
}

export default function PlaylistMainContent({
    playlists = [],
    title = "Danh sách",
    showAddButton = true,
    isEmpty = true,
    emptyMessage = "Bạn chưa có danh sách nào",
}: PlaylistMainContentProps) {
    return (
        <div className="p-8 flex flex-col flex-1" style={{ backgroundColor: "rgb(26, 29, 36)" }}>
            {/* Header with Title and Add Button */}
            <div className="flex items-center mb-12">
                <h1 className="text-2xl font-bold text-foreground mr-5">{title}</h1>
                {showAddButton && (
                    <button className="flex items-center gap-2 border text-foreground px-2 py-1 rounded-full transition-colors font-small cursor-pointer ">
                        <Plus size={18} />
                        <span>Thêm mới</span>
                    </button>
                )}
            </div>

            {/* Content */}
            {
                isEmpty ? (
                    <div className="flex items-center justify-center flex-1">
                        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="bg-secondary rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer group"
                            >
                                {/* Playlist Cover */}
                                <div className="w-full aspect-video bg-gradient-to-r from-yellow-300 to-yellow-500
                            hover:from-yellow-400 hover:to-yellow-200
                            hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]
                            transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 ease-in-out cursor-pointer mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                                    <span className="text-foreground text-sm font-semibold">{playlist.movieCount} phim</span>
                                </div>

                                {/* Playlist Info */}
                                <h3 className="text-foreground font-semibold mb-2 truncate">{playlist.name}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {playlist.movieCount} phim
                                    {playlist.lastUpdated && ` • ${playlist.lastUpdated}`}
                                </p>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    )
}
