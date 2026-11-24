import { ToastDemo } from "@/app/toast/toast_demo";
import { NotifDemo } from "./notif_demo";
import { useNotification } from "@/hooks/use-notification";

export default function SonnerPage() {
    return(
    <main>
        <ToastDemo/>
        <NotifDemo/>
    </main>
    )
}