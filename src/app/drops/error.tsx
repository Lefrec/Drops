"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
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
      <h1>Something went wrong while loading Drop page</h1>
      <Button type="button" onClick={() => retry()}>Try again</Button>
    </main>
  );
}
