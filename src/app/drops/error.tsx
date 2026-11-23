"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main>
      <h1>Impossible de charger cette page</h1>
      <p>Réessayez dans quelques instants.</p>
      <Button type="button" onClick={retry}>Réessayer</Button>
      <p><Link href="/auth/login">Se reconnecter</Link> si votre session a expiré.</p>
    </main>
  );
}
