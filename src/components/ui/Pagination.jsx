import React from 'react';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
    const itemsPerPage = 10;

    return (
        <div className="flex items-center space-x-1">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}
