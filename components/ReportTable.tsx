import React, { useState, useMemo, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

type SortDirection = 'ascending' | 'descending';

interface CustomFilterConfig {
  type: 'select';
  options: string[];
  label?: string;
}

interface ReportTableProps {
    data: Record<string, any>[];
    title: string;
    excludeFilters?: string[];
    customFilters?: Record<string, CustomFilterConfig>;
    headerNote?: string;
}

const ITEMS_PER_PAGE = 50;

const formatDateString = (value: any): string => {
    const stringValue = String(value);
    // Check if the string matches the YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        const [year, month, day] = stringValue.split('-');
        return `${day}/${month}/${year}`;
    }
    return stringValue;
};

const ReportTable = ({ data, title, excludeFilters = [], customFilters = {}, headerNote }: ReportTableProps) => {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const headers = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
    
    const filterableHeaders = useMemo(() => headers.filter(header => !excludeFilters.includes(header)), [headers, excludeFilters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortConfig, data]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    const hasActiveFilters = useMemo(() => 
        Object.values(filters).some(value => value !== ''), 
    [filters]);
    
    const requestSort = (key: string) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedData = useMemo(() => {
        let filteredData = [...data];

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                const customFilter = customFilters[key];
                if (customFilter?.type === 'select') {
                    if (key === 'Data') {
                        const months = customFilter.options;
                        const monthIndex = months.indexOf(value);
                        if (monthIndex > -1) {
                            const monthNumber = (monthIndex + 1).toString().padStart(2, '0');
                            filteredData = filteredData.filter(item => {
                                const itemDate = String(item[key]);
                                if (itemDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                    return itemDate.split('-')[1] === monthNumber;
                                }
                                return false;
                            });
                        }
                    } else {
                        filteredData = filteredData.filter(item => String(item[key]) === value);
                    }
                } else {
                    filteredData = filteredData.filter(item =>
                        String(item[key]).toLowerCase().includes(value.toLowerCase())
                    );
                }
            }
        });

        if (sortConfig !== null) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                const isNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue) && !isNaN(parseFloat(bValue)) && isFinite(bValue);

                if (isNumeric) {
                     if (parseFloat(aValue) < parseFloat(bValue)) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (parseFloat(aValue) > parseFloat(bValue)) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                } else {
                    return String(aValue).localeCompare(String(bValue), undefined, { numeric: true }) * (sortConfig.direction === 'ascending' ? 1 : -1);
                }

            });
        }

        return filteredData;
    }, [data, filters, sortConfig, customFilters]);

    const totalPages = useMemo(() => Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE), [filteredAndSortedData]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedData, currentPage]);
    
    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    if (!data || data.length === 0) {
        return <div className="text-center p-8">Nenhum dado disponível para este relatório.</div>
    }

    return (
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>
            
            {headerNote && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm" role="alert">
                    <p>{headerNote}</p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {filterableHeaders.map(header => {
                    const customFilterConfig = customFilters[header];
                    const filterLabel = customFilterConfig?.label || header;

                    if (customFilterConfig && customFilterConfig.type === 'select') {
                         return (
                            <div key={`filter-${header}`}>
                                <label htmlFor={`filter-select-${header}`} className="block text-sm font-medium text-gray-700 mb-1">{filterLabel}</label>
                                <select
                                    id={`filter-select-${header}`}
                                    value={filters[header] || ''}
                                    onChange={(e) => handleFilterChange(header, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Todos</option>
                                    {customFilterConfig.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    return (
                        <div key={`filter-${header}`}>
                            <label htmlFor={`filter-input-${header}`} className="block text-sm font-medium text-gray-700 mb-1">{header}</label>
                            <input
                                id={`filter-input-${header}`}
                                type="text"
                                placeholder={`Filtrar por ${header}...`}
                                value={filters[header] || ''}
                                onChange={(e) => handleFilterChange(header, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        </div>
                    );
                })}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map(header => (
                                <th
                                    key={header}
                                    scope="col"
                                    onClick={() => requestSort(header)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                >
                                    <div className="flex items-center">
                                        <span>{header}</span>
                                        {sortConfig?.key === header && (
                                            <span className="ml-2">
                                                {sortConfig.direction === 'ascending' ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    {headers.map(header => (
                                        <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatDateString(row[header])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-8 px-6 text-gray-500">
                                    Nenhum resultado encontrado com os filtros aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 1 && (
                 <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-700">
                        Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-l hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-r border-0 border-l border-blue-600 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportTable;