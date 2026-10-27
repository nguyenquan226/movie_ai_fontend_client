import { MainSection } from "./_components/mainSection";


interface LiveRoomPageProps {
  params: Promise<{
    roomId: string,
  }>
}

const LiveRoomPage = async ({ params }: LiveRoomPageProps) => {
  const { roomId } = await params;

  return (
    <div className="text-foreground mt-[80px]">
      <MainSection roomId={roomId} />
    </div>
  )
}
export default LiveRoomPage
