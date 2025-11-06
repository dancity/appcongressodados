export enum ReportType {
    Students = 'students',
    Guardians = 'guardians',
    PastoralCare = 'pastoralCare',
    AcademicPerformance = 'academicPerformance',
    StudentEntries = 'studentEntries',
    PedagogicalOccurrences = 'pedagogicalOccurrences',
}

export interface Student {
    Nome: string;
    Turma: string;
    'Responsável Legal': string;
}

export interface Guardian {
    'E-mail do responsável': string;
    Nome: string;
    Telefone: string;
    'Termo LGPD': string;
    'Nome do aluno': string;
    'Responsável legal': string;
}

export interface PastoralCare {
    'Mês': string;
    Estudante: string;
    'Ação': string;
    'Observação': string;
    'Participação em Atividades': string;
    'Sinal de Alerta': string;
}

export interface AcademicPerformance {
    Aluno: string;
    'Mês': string;
    Desempenho: string;
    'Observação': string;
    'Habilidades socioemocionais': string;
}

export interface StudentEntry {
    "Data": string;
    "Dia da semana": string;
    "Entrada": string;
    "Saída": string;
    "Nome do estudante": string;
    "Turma": string;
    "Falta/presença": "presença" | "falta";
}

export interface PedagogicalOccurrence {
    "Data": string;
    "Hora": string;
    "Nome do estudante": string;
    "Descrição da ocorrência": string;
}
