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
    const res = await fetch(`${process.env.API_URL}/health`)
    return <p>{res.ok ? 'API en ligne' : 'API hors ligne'}</p>
}