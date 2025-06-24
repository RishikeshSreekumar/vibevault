"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_API_KEY_STORAGE_KEY = "admin_api_key";
// In a real app, you wouldn't validate the key here.
// This is just for client-side redirect. The server will truly validate.
// const DUMMY_SERVER_SIDE_KEY_CHECK_URL = "/api/auth/check_key"; // Example, not implemented

export default function AdminLoginPage() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in (key exists), redirect to admin dashboard
    if (localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY)) {
      router.push("/admin");
    }
  }, [router]);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!apiKeyInput.trim()) {
      setError("API Key cannot be empty.");
      setIsLoading(false);
      return;
    }

    // Here, you would typically make a call to a backend endpoint
    // to verify the API key. For this example, we'll assume any non-empty
    // key is "valid" enough to store and let the backend reject if it's wrong
    // on actual API calls.
    // This is a simplification. A real app should verify the key against the server.
    // For example:
    // try {
    //   const response = await fetch(DUMMY_SERVER_SIDE_KEY_CHECK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ apiKey: apiKeyInput })
    //   });
    //   if (!response.ok) throw new Error('Invalid API Key');
    //   localStorage.setItem(ADMIN_API_KEY_STORAGE_KEY, apiKeyInput);
    //   router.push("/admin");
    // } catch (e) {
    //   setError((e as Error).message || "Failed to validate API Key.");
    // } finally {
    //   setIsLoading(false);
    // }

    // Simplified: Store the key and redirect. Actual API calls will fail if it's invalid.
    localStorage.setItem(ADMIN_API_KEY_STORAGE_KEY, apiKeyInput);
    router.push("/admin");
    // No need to setIsLoading(false) here due to redirect.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-700 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-sky-700 dark:text-sky-400">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              API Key
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              autoComplete="current-password" // To prevent browser suggestions sometimes
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-600 text-gray-900 dark:text-white"
              placeholder="Enter your admin API key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-800 dark:bg-opacity-30 p-2 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 dark:disabled:bg-sky-800 transition duration-150"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
