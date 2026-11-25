'use client'

import { DropCard } from "@/components/drops/drop_card";
import { DropsMap } from "@/components/map/drops_map";
import { DropPage } from "@/lib/api/types";
import { useState } from "react";

export function UserDrops({drops}: {drops: DropPage}) {

    const [activeId, setActiveId] = useState<number | null>(null)
  
  function selectFromMap(id: number) {
      setActiveId(id)
      document.getElementById(`drop-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:h-[70dvh] md:min-h-96 md:grid-cols-2">
        <div className="col-span-1 min-w-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pr-1">
            <ul className="w-full">
              {drops.items.map((drop) => (
                <li className="w-full min-w-0 p-2" key={drop.id}>
                  <DropCard drop={drop} />
                </li>
              ))}
            </ul>
        </div>
        <div className="col-span-1 h-[55dvh] min-h-80 overflow-hidden border border-border md:sticky md:top-4 md:h-full md:min-h-0">
            <DropsMap drops={drops} activeId={activeId} onSelect={selectFromMap}/>
        </div>
    </div>
  )
          
}