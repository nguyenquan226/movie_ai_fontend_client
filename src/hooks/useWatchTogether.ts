"use client";

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SyncEvent } from '@/types/co_watching.type';

export const useWatchTogether = (
  roomId: string,
  onEvent: (e: SyncEvent) => void,
) => {
  const socketRef = useRef<Socket | null>(null);
  const onEventRef = useRef(onEvent);
  const isReadyRef = useRef(false);
  const pendingEventsRef = useRef<SyncEvent[]>([]);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);


  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'http://localhost:8080';

    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', { roomId }, (response?: unknown) => {
        console.log('Joined room:', roomId, response);
        isReadyRef.current = true;

        if (pendingEventsRef.current.length > 0) {
          console.log('Sending pending events:', pendingEventsRef.current.length);
          pendingEventsRef.current.forEach(event => {
            socket.emit('sync_event', { roomId, event });
          });
          pendingEventsRef.current = [];
        }
      });
    });

    socket.on('disconnect', (reason) => {
      console.warn('Disconnected from server:', reason);
      isReadyRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('sync_event', (event: SyncEvent) => {
      console.log('Received sync event:', event);
      onEventRef.current(event);
    });

    return () => {
      isReadyRef.current = false;
      socket.off('sync_event');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
      socketRef.current = null;
    }
  }, [roomId]);

  const emitSync = useCallback((event: SyncEvent) => {
    const socket = socketRef.current;

    if (!socket) {
      console.error('>>> Socket not initialized <<<');
      return;
    };

    if (!socket.connect) {
      console.error('>>> Socket not connected, queueing event:', event);
      pendingEventsRef.current.push(event);
      return;
    };

    if (!isReadyRef.current) {
      console.warn('Room is not ready, queueing event:', event);
      pendingEventsRef.current.push(event);
      return;
    };
    socket.emit('sync_event', { roomId, event })

  }, [roomId])

  const leaveRoom = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit('leave_room', { roomId });
      socket.disconnect();
      socketRef.current = null;
    }
  }, [roomId]);

  return {
    emitSync,
    leaveRoom,
    isConnected: socketRef.current?.connected ?? false,
    isReady: isReadyRef.current,
    socketId: socketRef.current?.id,
  };
}