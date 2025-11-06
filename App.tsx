import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ReportTable from './components/ReportTable';
import { ReportType, Student, Guardian, PastoralCare, AcademicPerformance, StudentEntry, PedagogicalOccurrence } from './types';
import * as dataService from './services/dataService';
import { UsersIcon, HeartIcon, AcademicCapIcon, ClipboardListIcon, ExclamationIcon } from './components/icons';

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

type ReportData = Student[] | Guardian[] | PastoralCare[] | AcademicPerformance[] | StudentEntry[] | PedagogicalOccurrence[];

interface CustomFilterConfig {
  type: 'select';
  options: string[];
  label?: string;
}

interface ReportConfigItem {
    title: string;
    fetcher: () => Promise<ReportData>;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    excludeFilters?: string[];
    customFilters?: Record<string, CustomFilterConfig>;
    headerNote?: string;
}

const reportConfig: Record<ReportType, ReportConfigItem> = {
    [ReportType.Students]: {
        title: 'Relatório de Alunos',
        fetcher: dataService.fetchStudents,
        icon: UsersIcon
    },
    [ReportType.Guardians]: {
        title: 'Relatório de Responsáveis',
        fetcher: dataService.fetchGuardians,
        icon: UsersIcon,
        excludeFilters: ['E-mail do responsável', 'Telefone', 'Termo LGPD', 'Responsável legal']
    },
    [ReportType.PastoralCare]: {
        title: 'Relatório de Atendimentos da Pastoral',
        fetcher: dataService.fetchPastoralCare,
        icon: HeartIcon,
        excludeFilters: ['Ação', 'Observação', 'Participação em Atividades'],
        customFilters: {
            'Mês': { type: 'select', options: months }
        }
    },
    [ReportType.AcademicPerformance]: {
        title: 'Relatório de Desempenho Acadêmico',
        fetcher: dataService.fetchAcademicPerformance,
        icon: AcademicCapIcon,
        excludeFilters: ['Desempenho', 'Observação', 'Habilidades socioemocionais'],
        customFilters: {
            'Mês': { type: 'select', options: months }
        }
    },
    [ReportType.StudentEntries]: {
        title: 'Relatório de Entradas e Saídas',
        fetcher: dataService.fetchStudentEntries,
        icon: ClipboardListIcon,
        excludeFilters: ['Entrada', 'Saída', 'Data'],
        customFilters: {
            'Falta/presença': { type: 'select', options: ['presença', 'falta'] }
        },
        headerNote: 'Horário de entrada padrão: 07:00. Horário de saída padrão: 12:00.'
    },
    [ReportType.PedagogicalOccurrences]: {
        title: 'Relatório de Ocorrências Pedagógicas',
        fetcher: dataService.fetchPedagogicalOccurrences,
        icon: ExclamationIcon
    },
};

export default function App() {
    const [selectedReport, setSelectedReport] = useState<ReportType>(ReportType.Students);
    const [data, setData] = useState<ReportData>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadReportData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const currentReport = reportConfig[selectedReport];
            const reportData = await currentReport.fetcher();
            setData(reportData);
        } catch (err) {
            setError('Falha ao carregar os dados do relatório.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedReport]);

    useEffect(() => {
        loadReportData();
    }, [loadReportData]);

    const { title, excludeFilters, customFilters, headerNote } = reportConfig[selectedReport];

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <Sidebar selectedReport={selectedReport} setSelectedReport={setSelectedReport} reportConfig={reportConfig} />
            <main className="p-4 md:p-8">
                {loading ? (
                    <div className="flex justify-center pt-16">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : (
                    <ReportTable 
                        key={selectedReport} 
                        data={data} 
                        title={title}
                        excludeFilters={excludeFilters}
                        customFilters={customFilters}
                        headerNote={headerNote}
                    />
                )}
            </main>
        </div>
    );
}