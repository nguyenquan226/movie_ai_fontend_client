import { useEffect, useRef } from "react";

import Hls from "hls.js";
import Artplayer from "artplayer";
import artplayerPluginVttThumbnail from "@artplayer/plugin-vtt-thumbnail";

import "@/components/Player/artplayer-custom.css";
import { subDays } from "date-fns";
import filmServices from "@/services/filmService";

Artplayer.AUTO_PLAYBACK_TIMEOUT = 1000;
Artplayer.MOBILE_CLICK_PLAY = true;

interface PlayerControllerProps {
  videoUrl: string;
  posterUrl: string;
  filmId: string;
  episodeId: string;
}

interface ArtplayerWithHls extends Artplayer {
  hls?: Hls;
}

const getStorageKey = (episodeId: string): string => {
  return `video_progress_${episodeId}`;
};


const savePlaybackTime = (episodeId: string, currentTime: number, duration: number): void => {
  if (currentTime >= 5 && currentTime < duration - 10) {
    const key = getStorageKey(episodeId);
    localStorage.setItem(key, JSON.stringify({
      time: currentTime,
      duration: duration,
      timestamp: Date.now(),
    }));
  }
};

const getSavedPlaybackTime = (filmId: string): number | null => {
  const key = getStorageKey(filmId);
  const saved = localStorage.getItem(key);

  if (!saved) return null;

  try {
    const data = JSON.parse(saved);
    const thirtyDaysAgo = subDays(new Date(), 30).getTime();

    if (data.timestamp && data.timestamp < thirtyDaysAgo) {
      localStorage.removeItem(key);
      return null;
    }
    return data.time || null;
  } catch {
    return null;
  }
};

const clearSavedPlaybackTime = (filmId: string): void => {
  const key = getStorageKey(filmId);
  localStorage.removeItem(key);
};

const incrementView = async (filmId: string) => {
  try {
    const res = await filmServices.updateView(filmId);
    if (res.EC !== 0) {
      console.warn(">> ", res.EM);
    }
    console.log("Status: ", res.EM);
  } catch (error) {
    console.log("Error when update view: ", error)
  }
};

const PlayerController = ({ videoUrl, posterUrl, filmId, episodeId }: PlayerControllerProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const artInstanceRef = useRef<Artplayer | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const viewIncrementedRef = useRef<boolean>(false);
  const totalWatchedRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const BACKWARD_RESET_THRESHOLD = 300;

  useEffect(() => {
    if (artRef.current) {
      artRef.current.setAttribute("tabindex", "0");
      artRef.current.focus();

      const headerHeight = 88;
      const y = artRef.current.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const playM3u8 = (video: HTMLVideoElement, url: string, art: Artplayer, savedTime: number | null) => {
    const artWithHls = art as ArtplayerWithHls;

    if (Hls.isSupported()) {
      if (artWithHls.hls) artWithHls.hls.destroy();

      const hls = new Hls({
        lowLatencyMode: true,
        maxBufferLength: 8,
        maxMaxBufferLength: 15,
        maxBufferHole: 0.1,
        liveSyncDuration: 2,
        startLevel: -1,
        testBandwidth: true,
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      artWithHls.hls = hls;

      const restoreTime = () => {
        if (savedTime !== null && savedTime > 0) {
          if (video.readyState >= 2) {
            video.currentTime = savedTime;
            art.seek = savedTime;
            art.notice.show = `Đã tiếp tục từ ${Math.floor(savedTime / 60)}:${Math.floor(savedTime % 60).toString().padStart(2, '0')}`;
          } else {
            video.addEventListener('loadedmetadata', () => {
              video.currentTime = savedTime;
              art.seek = savedTime;
              art.notice.show = `Đã tiếp tục từ ${Math.floor(savedTime / 60)}:${Math.floor(savedTime % 60).toString().padStart(2, '0')}`;
            }, { once: true });
          }
        }
      };

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const defaultQuality = data.levels[data.levels.length - 1].height;

        const qualities = data.levels.map((level, index) => {
          return {
            default: level.height === defaultQuality,
            html: `${level.height}`,
            url: url,
            level: index,
          };
        });

        qualities.unshift({
          default: false,
          html: `Auto`,
          url: url,
          level: -1,
        });

        art.setting.update({
          name: "quality",
          tooltip: "Quality",
          html: "Quality",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"><path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/></svg>',
          selector: qualities.reverse(),
          onSelect: function (item) {
            const qualityItem = item as { html: string; level: number };
            console.log("Select quality: ", qualityItem.html);

            if (qualityItem.level === -1) {
              hls.currentLevel = -1;
            } else {
              hls.currentLevel = qualityItem.level;
            }

            return qualityItem.html;
          },
        });

        if (savedTime !== null && savedTime > 0) {
          setTimeout(() => {
            restoreTime();
          }, 500);
        }
      });

      if (savedTime !== null && savedTime > 0) {
        hls.on(Hls.Events.LEVEL_LOADED, () => {
          setTimeout(() => {
            if (video.readyState >= 2 && Math.abs(video.currentTime - savedTime) > 1) {
              video.currentTime = savedTime;
              art.seek = savedTime;
            }
          }, 300);
        });
      }

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Switched to ${level.height}p`);
        art.notice.show = `Quality: ${level.height}P`;
      });

      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      if (savedTime !== null && savedTime > 0) {
        video.addEventListener('loadedmetadata', () => {
          video.currentTime = savedTime;
          art.seek = savedTime;
          art.notice.show = `Đã tiếp tục từ ${Math.floor(savedTime / 60)}:${Math.floor(savedTime % 60).toString().padStart(2, '0')}`;
        }, { once: true });
      }
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  };

  useEffect(() => {
    if (!artRef.current || !videoUrl) return;

    const savedTime = getSavedPlaybackTime(filmId);

    if (savedTime !== null) {
      console.log(`Found saved playback time: ${savedTime} seconds`);
    }

    const playM3u8WithSavedTime = (video: HTMLVideoElement, url: string, art: Artplayer) => {
      playM3u8(video, url, art, savedTime);
    };

    const art = new Artplayer({
      container: artRef.current,
      url: videoUrl,
      type: "m3u8",
      customType: {
        m3u8: playM3u8WithSavedTime,
      },

      poster: posterUrl,

      // config common
      theme: "#00B2FF", // #B20710
      // autoSize: true,
      // autoMini: true,
      playbackRate: true,
      setting: true,
      hotkey: true,
      pip: true,
      fullscreen: true,
      aspectRatio: true,
      fullscreenWeb: true,
      autoPlayback: true,

      // config mobile
      gesture: true,
      fastForward: true,
      autoOrientation: true,
      lock: true,

      // config play back *****
      // id: "your-url-id",
      // autoPlayback: true,
      // config play back

      moreVideoAttr: {
        playsInline: true,
      } as Partial<HTMLVideoElement>,

      // custom style
      icons: {
        // loading: '<img src="/assets/img/ploading.gif">', // loading icon
        state: '<img src="/media/play.png">', // nút play/pause
      },
    });

    artInstanceRef.current = art;

    art.on("ready", () => {
      const bottom = art.template.$bottom;
      if (bottom) bottom.style.background = "none";

      const info = art.template.$info;
      if (info) {
        info.style.top = "50%";
        info.style.left = "50%";
        info.style.right = "auto";
        info.style.transform = "translate(-50%, -50%)";
      }

      console.info((art as ArtplayerWithHls).hls);
    });

    art.on("video:play", () => {
      isPlayingRef.current = true;
      lastVideoTimeRef.current = art.currentTime;
    });

    art.on("video:pause", () => {
      if (isPlayingRef.current && lastVideoTimeRef.current !== null) {
        const delta = art.currentTime - lastVideoTimeRef.current;
        if (delta > 0) {
          totalWatchedRef.current += delta;
        }
      }
      isPlayingRef.current = false;
      lastVideoTimeRef.current = art.currentTime;
    });

    art.on("video:seeked", () => {
      const newTime = art.currentTime;
      if (
        lastVideoTimeRef.current !== null &&
        newTime < lastVideoTimeRef.current - BACKWARD_RESET_THRESHOLD
      ) {
        totalWatchedRef.current = 0;
        viewIncrementedRef.current = false;
      }
      lastVideoTimeRef.current = newTime;
    });


    art.on("video:timeupdate", () => {
      const currentTime = art.currentTime;
      const duration = art.duration;

      if (duration > 0) {
        if (isPlayingRef.current) {
          if (lastVideoTimeRef.current !== null) {
            const delta = currentTime - lastVideoTimeRef.current;
            if (delta > 0) {
              totalWatchedRef.current += delta;
            }
          }
          lastVideoTimeRef.current = currentTime;
        }

        const currentSecond = Math.floor(currentTime);
        if (currentSecond % 5 === 0 && currentSecond !== lastSavedTimeRef.current) {
          savePlaybackTime(episodeId, currentTime, duration);
          lastSavedTimeRef.current = currentSecond;
        }

        const watchPercentage = (totalWatchedRef.current / duration) * 100;
        if (watchPercentage >= 20 && !viewIncrementedRef.current) {
          incrementView(filmId);
          viewIncrementedRef.current = true;
        }
      }
    });

    art.on("video:ended", () => {
      clearSavedPlaybackTime(filmId);
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      if (viewIncrementedRef.current) {
        viewIncrementedRef.current = false;
      }
    });

    const handleBeforeUnload = () => {
      if (art && art.currentTime && art.duration) {
        savePlaybackTime(episodeId, art.currentTime, art.duration);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && art && art.currentTime && art.duration) {
        savePlaybackTime(episodeId, art.currentTime, art.duration);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    saveIntervalRef.current = setInterval(() => {
      if (art && art.currentTime && art.duration) {
        savePlaybackTime(episodeId, art.currentTime, art.duration);
        lastSavedTimeRef.current = Math.floor(art.currentTime);
      }
    }, 10000);

    return () => {
      if (art && art.currentTime && art.duration) {
        savePlaybackTime(episodeId, art.currentTime, art.duration);
      }

      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }

      if (art && art.destroy) {
        art.destroy(false);
      }

      artInstanceRef.current = null;
      viewIncrementedRef.current = false;
    };
  }, [videoUrl, posterUrl, filmId]);

  return (
    <div
      ref={artRef}
      className="artplayer-app hide-scrollbar lg:h-[90vh] md:h-[80vh] h-[25vh] aspect-auto"
    ></div>
  );
};

export default PlayerController;
