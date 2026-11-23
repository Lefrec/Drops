'use client';

import { useEffect, useState } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import type { PublicUser } from "@/lib/api/types";

export function useOnline() {
    const [users, setUsers] = useState<PublicUser[]>([]);
    useEffect(() => {
        const stopHello = subscribe("hello", (data) => {
            setUsers(Array.isArray(data.online) ? data.online : [])
        })

        const stopOnline = subscribe("presence:online", (data) => {
            setUsers(Array.isArray(data.users) ? data.users : [])
        })

        const release = retain()

        return () => {
            stopHello()
            stopOnline()
            release()
        }
}, [])
    
    return users;
}
