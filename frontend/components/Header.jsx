// components/Header.jsx
"use client";

import { UserButton } from "@clerk/nextjs";

export default function Header({ city, setCity, isLoading = false }) {
  return (
    <div className="bg-navy-900 border-b border-navy-700 p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-ink-100 flex items-center gap-2">
        <span className="text-emerald-400">⛈</span> ClimateCast
      </h1>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search city..."
          className="bg-navy-800 border border-navy-700 text-ink-100 placeholder-ink-500 px-3 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:border-emerald-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") setCity(e.target.value);
          }}
        />
        <button
          className="bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-semibold px-4 py-2 rounded-lg whitespace-nowrap disabled:bg-navy-700 disabled:text-ink-500"
          onClick={() => {
            const input = document.querySelector("input");
            if (input) setCity(input.value);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
        <div className="flex items-center ml-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
