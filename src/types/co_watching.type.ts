import Artplayer from 'artplayer';
import { Film } from './film.type';

export interface roomRes {
  roomId: string;
  name: string;
  hostId: number;
  host: {
    fullName: string;
    avatarUrl: string;
  }
  filmId: string;
  partNumber: number;
  episodeNumber: number;
  thumbUrl: string;
  isLive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  duration: number;
}

export interface roomData {
  room: roomRes;
  film: Film;
}

export interface roomPayload {
  name: string;
  isPrivate: boolean;
  thumbUrl: string;
  filmId: string;
  partNumber: number;
  episodeNumber: number;
}

export interface roomPaginate extends roomRes {
  film: {
    originalTitle: string;
    title: string;
    slug: string;
  };

  // host: {
  //   fullName: string;
  // };
}

export interface getAllStreamRes {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  }
  list: roomPaginate[];
}


export type SyncMode = 'initial' | 'manual';

export interface SyncEvent {
  type: 'play' | 'pause' | 'seek' | 'requestSync' | 'syncResponse' | 'syncEpisode' | 'endLive';
  currentTime?: number;
  isPlaying?: boolean;
  part?: number;
  episode?: number;
}

export interface VideoSyncState {
  isHandlingRemoteEvent: boolean;
  hasInitialSynced: boolean;
  userInteracted: boolean;
  showInteractionPrompt: boolean;
  syncMode: SyncMode;
}

export interface VideoSyncCallbacks {
  onUserInteracted: (interacted: boolean) => void;
}

export interface RemoteEventHandlerParams {
  event: SyncEvent;
  art: Artplayer | null;
  emitSync: (event: SyncEvent) => void;
  leaveRoom: () => void;
  handleBackHome: () => void;
  syncMode: SyncMode;
  isHandlingRemoteEvent: React.MutableRefObject<boolean>;
  hasInitialSynced: React.MutableRefObject<boolean>;
  handleUpdateEpisode: (part: number, episode: number) => void;
}

export interface LocalControlParams {
  emitSync: (event: SyncEvent) => void;
  syncMode: SyncMode;
  isHandlingRemoteEvent: React.MutableRefObject<boolean>;
  hasInitialSynced: React.MutableRefObject<boolean>;
  artInstanceRef: React.MutableRefObject<Artplayer | null>;
}