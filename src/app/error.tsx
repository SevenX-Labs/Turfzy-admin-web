"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center font-sans dark:bg-zinc-950">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Something went wrong!
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-purple-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
