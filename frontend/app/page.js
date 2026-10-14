"use client";

import { useState } from "react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  const handleShorten = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);

    let urlToShorten = originalUrl.trim();
    if (!urlToShorten) {
      setError("Please paste a valid URL to shorten.");
      return;
    }

    if (!/^https?:\/\//i.test(urlToShorten)) {
      urlToShorten = `https://${urlToShorten}`;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: urlToShorten }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL.");
      }

      setShortUrl(data.shortUrl || `${BACKEND_URL}/${data.shortId}`);
    } catch (err) {
      setError(
        err.message ||
          "Could not reach server. Please ensure the backend is running and database is connected."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy URL to clipboard.");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Short<span className="text-indigo-400">Link</span>
            </span>
          </div>

          {/* Right Navigation Placeholders */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sign In Placeholder */}
            <button
              type="button"
              onClick={() => alert("Sign In feature coming soon!")}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </button>

            {/* Sign Up Placeholder */}
            <button
              type="button"
              onClick={() => alert("Sign Up feature coming soon!")}
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition duration-200 shadow-md shadow-indigo-600/20"
            >
              Sign Up
            </button>

            {/* Profile Avatar Placeholder */}
            <div className="relative group ml-1">
              <button
                type="button"
                onClick={() => alert("Profile menu coming soon!")}
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500 flex items-center justify-center transition-all overflow-hidden focus:ring-2 focus:ring-indigo-500"
                title="Profile"
              >
                <svg
                  className="w-5 h-5 text-slate-300 group-hover:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Badge & Headline */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Fast • Reliable • Click Tracking
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Shorten Your Links in <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">Seconds</span>
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Transform cumbersome URLs into clean, high-converting short links.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/60">
            <form onSubmit={handleShorten} className="space-y-4">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste your long link here (e.g. https://yourcompany.com/blog/article)..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Shortening...</span>
                    </>
                  ) : (
                    <>
                      <span>Shorten URL</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Notification */}
            {error && (
              <div className="mt-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm rounded-xl flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success / Result View */}
            {shortUrl && (
              <div className="mt-5 pt-5 border-t border-slate-800/80 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Short Link:
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ready to share
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-2 pl-4">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 font-mono text-sm text-indigo-400 hover:underline truncate py-1.5"
                  >
                    {shortUrl}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      copied
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-800 hover:bg-slate-700 text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feature Micro-Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
              <p className="text-xs font-semibold text-slate-300">Fast Redirects</p>
              <p className="text-[11px] text-slate-500 mt-0.5">&lt; 100ms latency</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
              <p className="text-xs font-semibold text-slate-300">Click Tracking</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Real-time stats</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
              <p className="text-xs font-semibold text-slate-300">Safe & Reliable</p>
              <p className="text-[11px] text-slate-500 mt-0.5">PostgreSQL backed</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} ShortLink. All rights reserved.
      </footer>
    </div>
  );
}