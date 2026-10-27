import { handleAutoplay, handleSyncResponse, setTemporaryFlag } from '@/utils/videoSyncHelper';
import type { RemoteEventHandlerParams } from '@/types/co_watching.type';
import { toast } from 'sonner';

export function useVideoSyncHandler() {
  const handleRemoteEvent = async (params: RemoteEventHandlerParams) => {
    const {
      event,
      art,
      emitSync,
      leaveRoom,
      syncMode,
      isHandlingRemoteEvent,
      hasInitialSynced,
      handleBackHome,
      handleUpdateEpisode,
    } = params;

    console.log('Handling remote event:', event);

    if (!art) return;

    if (event.type === 'endLive') {
      toast.success("Chủ phòng đã kết thúc phiên xem chung");
      leaveRoom();
      handleBackHome();
      return;
    }

    // Xử lý request sync từ người khác
    if (event.type === 'requestSync') {
      console.log('Sending sync response...');
      emitSync({
        type: 'syncResponse',
        currentTime: art.currentTime,
        isPlaying: !art.pause
      });
      return;
    }

    // Xử lý sync response (khi mình request)
    if (event.type === 'syncResponse') {
      console.log('Received sync response:', event);
      setTemporaryFlag(isHandlingRemoteEvent, true);

      await handleSyncResponse(
        art,
        event.currentTime || 0,
        event.isPlaying || false
      );

      return;
    }


    if (event.type === 'syncEpisode') {
      if (event.part && event.episode) {
        await handleAutoplay(art);
        handleUpdateEpisode(event.part, event.episode);
        hasInitialSynced.current = false;
      }
      return;
    }

    // Chỉ tự động đồng bộ ở lần đầu tiên
    if (syncMode === 'initial' && hasInitialSynced.current) {
      console.log('Skipping auto-sync (not in initial mode)');
      return;
    }

    setTemporaryFlag(isHandlingRemoteEvent, true);

    try {
      if (event.type === 'play') {
        hasInitialSynced.current = true;
        await handleAutoplay(art);
      } else if (event.type === 'pause') {
        art.pause();
      } else if (event.type === 'seek') {
        art.currentTime = event.currentTime || 0;
      }
    } catch (error: unknown) {
      console.error('Error handling sync event:', error);
    }
  };

  return { handleRemoteEvent };
}