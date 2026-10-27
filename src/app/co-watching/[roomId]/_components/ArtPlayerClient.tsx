'use client';

import { useEffect, useRef } from 'react';
import Artplayer, { type Option as ArtOption } from 'artplayer';
import Hls from 'hls.js';

type Props = {
  src: string;
  poster?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onReady?: (art: Artplayer) => void;
  handleManualSync: () => void;
};

export default function ArtPlayerClient({
  src,
  poster,
  onPlay,
  onPause,
  onSeek,
  onReady,
  handleManualSync,
}: Props) {
  const artRef = useRef<HTMLDivElement | null>(null);
  const artInstance = useRef<Artplayer | null>(null);
  const callbacksRef = useRef({ onPlay, onPause, onSeek });

  useEffect(() => {
    if (artRef.current) {
      artRef.current.setAttribute("tabindex", "0");
      artRef.current.focus();

      const headerHeight = 88;
      const y =
        artRef.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    callbacksRef.current = { onPlay, onPause, onSeek };
  }, [onPlay, onPause, onSeek]);


  const playM3u8 = (video: HTMLVideoElement, url: string, art: Artplayer) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();

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
      art.hls = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("Available levels: ", data.levels);

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
          onSelect: function (item: any) {
            console.log("Select quality: ", item.html);

            if (item.level === -1) {
              hls.currentLevel = -1;
            } else {
              hls.currentLevel = item.level;
            }

            return item.html;
          },
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        console.log(`Switched to ${level.height}p`);
        art.notice.show = `Quality: ${level.height}P`;
      });

      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  };


  useEffect(() => {
    if (!artRef.current) return;

    const option: ArtOption = {
      container: artRef.current,

      url: src,
      type: "m3u8",
      customType: {
        m3u8: playM3u8,
      },

      // poster,
      theme: "#00B2FF",

      playbackRate: true,
      setting: true,
      hotkey: true,
      pip: true,
      fullscreen: true,
      aspectRatio: true,
      fullscreenWeb: true,

      autoplay: false,
      volume: 0.8,
      muted: false,
      mutex: true,

      fastForward: true,
      gesture: false,
      autoOrientation: true,

      icons: {
        state: '<img src="/media/play.png" class="size-10">',
      },
      moreVideoAttr: {
        crossOrigin: 'anonymous',
        playsInline: true,
      },

      controls: [
        {
          position: 'right',
          tooltip: 'Sync time',
          html: `
          <div style="
            padding: 0 10px 0 8px;
            border: 2px solid #ffb900;
            color: #fff;
            background: transparent;
            border-radius: 18px;
            cursor: pointer;
            height: 28px;
            line-height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 13px;
          ">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 22 22" width="18px" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01-.25 1.97-.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          Đồng bộ
          </div>
        `,
          click: handleManualSync,
        },
      ],
    };

    const art = new Artplayer(option);
    artInstance.current = art;

    art.on('play', () => {
      console.log('ArtPlayer: play event');
      callbacksRef.current.onPlay?.();
    });

    art.on('pause', () => {
      console.log('ArtPlayer: pause event');
      callbacksRef.current.onPause?.();
    });

    art.on('video:seeked', () => {
      console.log('ArtPlayer: seeked to', art.currentTime);
      callbacksRef.current.onSeek?.(art.currentTime);
    });

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

      console.info(art.hls);
      onReady?.(art);
    });

    return () => {
      if (artInstance.current) {
        artInstance.current.destroy(false);
        artInstance.current = null;
      }
    };
  }, [src, poster, onReady]);

  return (
    <div
      ref={artRef}
      className="artplayer-app hide-scrollbar lg:h-[90vh] md:h-[70vh] h-[30vh] aspect-auto"
    ></div>
  );
}
