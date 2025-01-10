import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 6;

export function usePagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    startIndex,
    itemsPerPage: ITEMS_PER_PAGE
  };
}