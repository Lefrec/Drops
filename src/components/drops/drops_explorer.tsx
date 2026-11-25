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
        <div className="grid grid-cols-1 gap-4 md:h-[70dvh] md:min-h-96 md:grid-cols-2">
            <div className="col-span-1 min-w-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pr-1">
            <Suspense fallback={<p>Chargement des Drops</p>}>
                <DropList drops={drops} query={query} category={category} setActive={setActiveId}/>
            </Suspense>
            </div>
            <div className="col-span-1 h-[55dvh] min-h-80 overflow-hidden border border-border md:sticky md:top-4 md:h-full md:min-h-0">
            <Suspense fallback={<p>Chargement de la carte</p>}>
                <DropsMap drops={drops} activeId={activeId} onSelect={selectFromMap}/>
            </Suspense>
            </div>
        </div>
    )
}