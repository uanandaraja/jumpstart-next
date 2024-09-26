"use client";

import { useUser } from "@/hooks/useUser";
import { logout } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: user, isLoading, error } = useUser();

  if (isLoading)
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <div className="text-sm font-[family-name:var(--font-geist-mono)]">
            Loading...
          </div>
        </main>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm space-y-2 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li>This is a protected route</li>
          <li>If you aint logged in, you not supposed to see this.</li>
          <li>You are: {user?.name || "Unknown"}</li>
        </ol>
        <Button
          onClick={() => logout()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </Button>
      </main>
    </div>
  );
}
