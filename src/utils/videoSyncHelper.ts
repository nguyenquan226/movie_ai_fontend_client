import Artplayer from 'artplayer';

export async function handleAutoplay(art: Artplayer): Promise<void> {
  try {
    await art.play();
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      console.log('Autoplay blocked, trying with muted...');
      art.muted = true;
      await art.play();

      if (art.notice) {
        art.notice.show = 'Video đang phát ở chế độ tắt tiếng. Click để bật âm thanh.';
      }

      // Thêm handler để unmute khi user click
      const unmuteHandler = () => {
        art.muted = false;
        art.video.removeEventListener('click', unmuteHandler);
        if (art.notice) {
          art.notice.show = 'Đã bật âm thanh';
        }
      };
      art.video.addEventListener('click', unmuteHandler);
    } else {
      throw error;
    }
  }
}

export async function handleSyncResponse(
  art: Artplayer,
  currentTime: number,
  isPlaying: boolean
): Promise<void> {
  art.currentTime = currentTime;

  if (isPlaying) {
    try {
      art.muted = true;
      await art.play();

      if (art.notice) {
        art.notice.show = 'Đã đồng bộ! Click video để bật âm thanh.';
      }

      const unmuteHandler = () => {
        art.muted = false;
        art.video.removeEventListener('click', unmuteHandler);
      };
      art.video.addEventListener('click', unmuteHandler);
    } catch (error) {
      console.error('Error playing after sync:', error);
    }
  } else {
    art.pause();
    if (art.notice) {
      art.notice.show = 'Đã đồng bộ thời gian!';
    }
  }
}

export function setTemporaryFlag(
  ref: React.MutableRefObject<boolean>,
  value: boolean,
  duration: number = 100
): void {
  ref.current = value;
  setTimeout(() => {
    ref.current = !value;
  }, duration);
}

export function shouldSyncEvent(
  syncMode: 'initial' | 'manual',
  hasInitialSynced: boolean
): boolean {
  if (syncMode === 'manual') {
    return true;
  }

  return !hasInitialSynced;
}