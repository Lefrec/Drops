'use client'

import { DropPage } from "@/lib/api/types";
import { Suspense, useState } from "react";
import { DropList } from "./drop_list";
import { DropsMap } from "../map/drops_map";

interface Props {
    drops: DropPage
    query: string
    category?: string 
}

export function DropsExplorer({ drops, query, category }: Props) {
    const [activeId, setActiveId] = useState<number | null>(null)

    function selectFromMap(id: number) {
        setActiveId(id)
        document.getElementById(`drop-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
    }

    return (
        <div className="grid grid-cols-2">
            <Suspense fallback={<p>Chargement des Drops</p>}>
                <DropList drops={drops} query={query} category={category}/>
            </Suspense>
            <Suspense fallback={<p>Chargement de la carte</p>}>
                <DropsMap drops={drops} activeId={activeId} onSelect={selectFromMap}/>
            </Suspense>
        </div>
    )
}