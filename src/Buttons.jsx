import React from "react";

export default function Buttons({ index, setIndex, pageSize, totalCount }) {
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const currentPage = Math.floor(index / pageSize) + 1;

    const handleNext = () => {
        if (currentPage >= totalPages) return;
        setIndex((prev) => prev + pageSize);
    };

    const handlePrev = () => {
        if (currentPage <= 1) return;
        setIndex((prev) => Math.max(0, prev - pageSize));
    };

    const setPage = (page) => {
        setIndex((page - 1) * pageSize);
    };

    // Generate page numbers to display
    const getPages = () => {
        const pages = [];
        const maxVisible = 5; // total slots for numbers

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show page 1
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range to fit exactly maxVisible if near edges
            if (currentPage <= 3) {
                end = 4;
            }
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            // Add left ellipsis
            if (start > 2) {
                pages.push("ellipsis-left");
            }

            // Add middle numbers
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add right ellipsis
            if (end < totalPages - 1) {
                pages.push("ellipsis-right");
            }

            // Always show last page
            pages.push(totalPages);
        }
        return pages;
    };

    const pageNumbers = getPages();

    return (
        <div className="w-full flex flex-col items-center gap-3 px-4 py-8 select-none">
            {/* Page Info */}
            <div className="text-center text-xs text-zinc-500 font-medium font-mono">
                Showing <span className="text-zinc-300 font-semibold">{Math.min(index + 1, totalCount)}</span> -{" "}
                <span className="text-zinc-300 font-semibold">{Math.min(index + pageSize, totalCount)}</span> of{" "}
                <span className="text-zinc-300 font-semibold">{totalCount}</span> entries
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="
            w-9 h-9 sm:w-10 sm:h-10
            flex items-center justify-center
            rounded-xl
            border border-zinc-850
            bg-zinc-900 text-zinc-300
            shadow-sm hover:bg-zinc-800 hover:text-white
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          "
                >
                    ←
                </button>

                {/* Page Buttons */}
                {pageNumbers.map((page, idx) => {
                    if (page === "ellipsis-left" || page === "ellipsis-right") {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="w-7 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-650 text-sm font-bold"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = currentPage === page;

                    return (
                        <button
                            key={page}
                            onClick={() => setPage(page)}
                            className={`
                w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-xl
                text-xs sm:text-sm font-mono font-black
                transition-all duration-200 cursor-pointer
                ${isActive
                                    ? "bg-linear-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] border border-red-500 hover:scale-105"
                                    : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                                }
                /* Hide secondary items on narrow mobile screen to save space */
                ${page !== 1 && page !== totalPages && Math.abs(currentPage - page) > 1 ? "hidden xs:flex" : "flex"}
              `}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="
            w-9 h-9 sm:w-10 sm:h-10
            flex items-center justify-center
            rounded-xl
            border border-zinc-850
            bg-zinc-900 text-zinc-300
            shadow-sm hover:bg-zinc-800 hover:text-white
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          "
                >
                    →
                </button>
            </div>
        </div>
    );
}