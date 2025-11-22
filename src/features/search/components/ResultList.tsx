import React from 'react';
import { SearchSuggestion } from '../service/searchService';
import { SearchAction } from '../hooks/useSearch';

interface ResultListProps {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  onSelect: SearchAction['onSelectSuggestion'];
}

export const ResultList: React.FC<ResultListProps> = ({ suggestions, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg mt-1 rounded-md max-h-60 overflow-y-auto">
        <div className="p-3 text-sm text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul className="absolute z-10 w-full text-black bg-white border border-gray-200 shadow-lg mt-1 rounded-md max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center text-sm"
          onClick={() => onSelect(suggestion)}
        >
          <span className="mr-3">
            {suggestion.type === 'ADDRESS' ? '📍' : '🏢'}
          </span>
          <span className="flex-grow">
            {suggestion.type === 'ADDRESS'
              ? (suggestion as any).display_name
              : (suggestion as any).name}
          </span>
          <span className="ml-3 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
            {suggestion.type === 'ADDRESS' ? 'Dirección' : 'Inmobiliaria'}
          </span>
        </li>
      ))}
    </ul>
  );
};