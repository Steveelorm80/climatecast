// components/Header.jsx
"use client";

import { UserButton } from "@clerk/nextjs";

export default function Header({ city, setCity, isLoading = false }) {
  return (
    <div className="bg-white p-4 shadow flex flex-col md:flex-row md:justify-between md:items-center gap-3 sticky top-0 z-10">
      <h1 className="text-xl font-bold">📊 Climate Dashboard</h1>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="text"
          placeholder="Enter city..."
          className="border px-3 py-2 rounded-lg w-full md:w-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter") setCity(e.target.value);
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg whitespace-nowrap disabled:bg-gray-400"
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