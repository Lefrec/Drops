import { Suspense } from "react";

export default function StatusPage() {
    return (
        <main>
            <h1>Statut de l'API</h1>
            <Suspense fallback={<p>Vérification ...</p>}>
                <Health />
            </Suspense>
        </main>
    )
}

async function Health() {
    let online = false
    try {
        const res = await fetch(`${process.env.API_URL}/health`, { cache: 'no-store' })
        online = res.ok
    } catch (error) {
        if (!(error instanceof TypeError)) throw error
    }

    return <p role="status">{online ? 'API en ligne' : 'API hors ligne'}</p>
}