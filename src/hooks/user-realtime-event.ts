'use client'

import { useEffect, useRef } from 'react';
import { retain, subscribe } from '@/lib/realtime';

export function useRealtimeEvent<T>(type: string, handler: (data: T) => void) {
  const latest = useRef(handler);

  useEffect(() => {
    latest.current = handler;
  });

  useEffect(() => {
    const release = retain();
    const unsubscribe = subscribe(type, (data) => latest.current(data));
    return () => {
      unsubscribe();
      release();
    };
  }, [type]);
}