"use client"

import type React from "react"
import { useState } from "react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for event"
        className="w-full py-3 px-4 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
      />
    </form>
  )
}
