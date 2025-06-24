"use client";

import SongForm from "@/components/admin/SongForm";
import { useEffect, useState } from "react";
import { useRouter }_from "next/navigation";

const ADMIN_API_KEY_STORAGE_KEY = "admin_api_key";

export default function NewSongPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedKey = localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY);
    if (!storedKey) {
      router.push("/admin/login"); // Should be handled by layout, but good safeguard
    } else {
      setApiKey(storedKey);
    }
  }, [router]);

  if (!apiKey) {
    // This will be briefly shown if layout hasn't redirected yet or if key removed.
    return <div className="text-center p-8">Redirecting to login...</div>;
  }

  return (
    <div>
      <SongForm apiKey={apiKey} isEditMode={false} />
    </div>
  );
}
