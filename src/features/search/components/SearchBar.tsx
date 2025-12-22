"use client";

import React, { useRef } from "react";
import { useSearch } from "../hooks/useSearch";
import { ResultList } from "./ResultList";

export const SearchBar: React.FC = () => {
  const { query, setQuery, suggestions, isLoading, onSelectSuggestion } =
    useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar direcciones o inmobiliarias…"
        className="
          w-full bg-transparent text-sm text-urbik-black
          placeholder:text-urbik-muted outline-none
        "
      />
      <ResultList
        suggestions={suggestions}
        isLoading={isLoading}
        onSelect={onSelectSuggestion}
      />
    </div>
  );
};
