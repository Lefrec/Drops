import type { Viewer } from "@/hooks/use-presence";
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar";

export function ViewerStack({ viewers }: { viewers: Viewer[] }) {
    return (
        <AvatarGroup className="flex-1">
            {viewers.slice(0, 3).map((viewer) => (
                <Avatar key={viewer.id} aria-label={viewer.displayName}>
                    {viewer.avatarUrl && (
                        <AvatarImage src={viewer.avatarUrl} alt={viewer.displayName} />
                    )}
                    <AvatarFallback>
                        {Array.from(viewer.displayName.trim())[0]?.toLocaleUpperCase() ?? "?"}
                    </AvatarFallback>
                </Avatar>
            ))}
            {viewers.length > 3 && (
                <AvatarGroupCount>+{viewers.length - 3}</AvatarGroupCount>
            )}
        </AvatarGroup>
    );
}