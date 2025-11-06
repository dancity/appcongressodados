import { Student, Guardian, PastoralCare, AcademicPerformance, StudentEntry, PedagogicalOccurrence } from '../types';

// Simulate network latency
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 250));

const fetchData = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    await simulateLatency();
    return data as T;
};

export const fetchStudents = (): Promise<Student[]> => {
    // fetch requests are relative to the HTML document's location (root)
    return fetchData<Student[]>('./data/alunos.json');
};

export const fetchGuardians = (): Promise<Guardian[]> => {
    return fetchData<Guardian[]>('./data/responsaveis_alunos.json');
};

export const fetchPastoralCare = (): Promise<PastoralCare[]> => {
    return fetchData<PastoralCare[]>('./data/atendimentos_pastoral.json');
};

export const fetchAcademicPerformance = (): Promise<AcademicPerformance[]> => {
    return fetchData<AcademicPerformance[]>('./data/desempenho_academico.json');
};

export const fetchStudentEntries = (): Promise<StudentEntry[]> => {
    return fetchData<StudentEntry[]>('./data/entradas_estudantes.json');
};

export const fetchPedagogicalOccurrences = (): Promise<PedagogicalOccurrence[]> => {
    return fetchData<PedagogicalOccurrence[]>('./data/ocorrencias_pedagogicas.json');
};
