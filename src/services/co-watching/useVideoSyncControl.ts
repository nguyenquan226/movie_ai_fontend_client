import { useCallback } from 'react';
import Artplayer from 'artplayer';
import type { LocalControlParams } from '@/types/co_watching.type';
import { shouldSyncEvent } from '@/utils/videoSyncHelper';

export function useVideoSyncControls(params: LocalControlParams) {
  const {
    emitSync,
    syncMode,
    isHandlingRemoteEvent,
    hasInitialSynced,
    artInstanceRef
  } = params;

  const handlePlay = useCallback(() => {
    if (!isHandlingRemoteEvent.current) {
      console.log('Local play');
      if (shouldSyncEvent(syncMode, hasInitialSynced.current)) {
        emitSync({ type: 'play' });
        hasInitialSynced.current = true;
      }
    }
  }, [emitSync, syncMode, isHandlingRemoteEvent, hasInitialSynced]);

  const handlePause = useCallback(() => {
    if (!isHandlingRemoteEvent.current) {
      console.log('Local pause');
      if (shouldSyncEvent(syncMode, hasInitialSynced.current)) {
        emitSync({ type: 'pause' });
      }
    }
  }, [emitSync, syncMode, isHandlingRemoteEvent, hasInitialSynced]);

  const handleSeek = useCallback((currentTime: number) => {
    if (!isHandlingRemoteEvent.current) {
      console.log('Local seek to:', currentTime);
      if (shouldSyncEvent(syncMode, hasInitialSynced.current)) {
        emitSync({ type: 'seek', currentTime });
      }
    }
  }, [emitSync, syncMode, isHandlingRemoteEvent, hasInitialSynced]);

  const handleArtReady = useCallback((art: Artplayer) => {
    artInstanceRef.current = art;
    console.log('ArtPlayer ready');
  }, [artInstanceRef]);

  const handleManualSync = useCallback(() => {
    console.log('Requesting manual sync...');
    emitSync({ type: 'requestSync' });

    const art = artInstanceRef.current;
    if (art?.notice) {
      art.notice.show = 'Đang yêu cầu đồng bộ...';
    }
  }, [emitSync, artInstanceRef]);


  const handleSyncEpisode = useCallback((part: number, episode: number) => {
    if (!isHandlingRemoteEvent.current) {
      emitSync({ type: 'syncEpisode', part: part, episode: episode });
      hasInitialSynced.current = false;
    }
  }, [emitSync])

  const handleEndLive = useCallback(() => {
    if (!isHandlingRemoteEvent.current) {
      emitSync({ type: 'endLive' });
    }
  }, [emitSync])

  return {
    handlePlay,
    handlePause,
    handleSeek,
    handleArtReady,
    handleManualSync,
    handleSyncEpisode,
    handleEndLive,
  };
}