
import React from 'react';
import { ReportType } from '../types';

interface SidebarProps {
    selectedReport: ReportType;
    setSelectedReport: (report: ReportType) => void;
    reportConfig: any;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedReport, setSelectedReport, reportConfig }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <h1 className="text-xl font-bold text-blue-600">
                           <span className="hidden sm:inline">Gestão Escolar</span>
                           <span className="sm:hidden">GE</span>
                         </h1>
                    </div>
                    <nav>
                        <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                            {Object.values(ReportType).map((reportKey) => {
                                const { title, icon: Icon } = reportConfig[reportKey];
                                const isActive = selectedReport === reportKey;
                                const shortTitle = title.replace('Relatório de ', '');
                                return (
                                    <li key={reportKey}>
                                        <button
                                            onClick={() => setSelectedReport(reportKey)}
                                            title={shortTitle}
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Icon className="h-6 w-6 flex-shrink-0" />
                                            <span className="ml-2 font-semibold hidden md:inline">{shortTitle}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Sidebar;