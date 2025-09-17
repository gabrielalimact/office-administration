export type TipoAgendamento =
  | 'PERÍCIA'
  | 'AVALIAÇÃO SOCIAL'
  | 'AUDIENCIA'
  | 'PERICIA MEDICA INICIAL';

export type IProcessosTable = {
  id: number;
  cliente: string;
  tipoProcesso:
    | 'LOAS/88'
    | 'LOAS/87'
    | 'PENSÃO DE MORTE URBANA OU RURAL'
    | 'APOSENTADORIAS'
    | 'AUXILIO DOENÇA'
    | string;
  responsavel: string;
  feitoEm: string;
  status:
    | 'ARQUIVADO'
    | 'EM ANDAMENTO'
    | 'FINALIZADO'
    | 'REMARCADO'
    | 'CANCELADO'
    | 'CONCEDIDO'
    | 'FAZER EXAMES'
    | 'FAZER ATESTADO'
    | 'PEGAR SENHA'
    | 'FEITO PJE'
    | 'FEITO SAG';
  tipoAgendamento: TipoAgendamento;
};
export const tiposAgendamento: TipoAgendamento[] = [
  'PERÍCIA',
  'AVALIAÇÃO SOCIAL',
  'AUDIENCIA',
  'PERICIA MEDICA INICIAL',
];

export const processosMock: IProcessosTable[] = [
  {
    id: 1,
    cliente: 'Lucas Andrade',
    tipoProcesso: 'LOAS/88',
    responsavel: 'Marina Lopes',
    feitoEm: '2024-01-05',
    status: 'EM ANDAMENTO',
    tipoAgendamento: 'PERÍCIA',
  },
  {
    id: 2,
    cliente: 'Gabriela Torres',
    tipoProcesso: 'LOAS/87',
    responsavel: 'João Pedro',
    feitoEm: '2024-01-18',
    status: 'FINALIZADO',
    tipoAgendamento: 'AVALIAÇÃO SOCIAL',
  },
  {
    id: 3,
    cliente: 'Eduardo Silva',
    tipoProcesso: 'PENSÃO DE MORTE URBANA OU RURAL',
    responsavel: 'Ana Paula',
    feitoEm: '2024-02-10',
    status: 'CANCELADO',
    tipoAgendamento: 'AUDIENCIA',
  },
  {
    id: 4,
    cliente: 'Renata Souza',
    tipoProcesso: 'APOSENTADORIAS',
    responsavel: 'Carlos Lima',
    feitoEm: '2024-02-25',
    status: 'REMARCADO',
    tipoAgendamento: 'PERICIA MEDICA INICIAL',
  },
  {
    id: 5,
    cliente: 'Thiago Costa',
    tipoProcesso: 'AUXILIO DOENÇA',
    responsavel: 'Fernanda Dias',
    feitoEm: '2024-03-12',
    status: 'CONCEDIDO',
    tipoAgendamento: 'PERÍCIA',
  },
  {
    id: 6,
    cliente: 'Amanda Martins',
    tipoProcesso: 'LOAS/88',
    responsavel: 'Ricardo Alves',
    feitoEm: '2024-03-28',
    status: 'ARQUIVADO',
    tipoAgendamento: 'AVALIAÇÃO SOCIAL',
  },
  {
    id: 7,
    cliente: 'Felipe Rocha',
    tipoProcesso: 'LOAS/87',
    responsavel: 'Juliana Ramos',
    feitoEm: '2024-04-15',
    status: 'EM ANDAMENTO',
    tipoAgendamento: 'AUDIENCIA',
  },
  {
    id: 8,
    cliente: 'Patrícia Fernandes',
    tipoProcesso: 'PENSÃO DE MORTE URBANA OU RURAL',
    responsavel: 'Bruno Cardoso',
    feitoEm: '2024-04-30',
    status: 'FINALIZADO',
    tipoAgendamento: 'PERICIA MEDICA INICIAL',
  },
  {
    id: 9,
    cliente: 'Marcos Oliveira',
    tipoProcesso: 'APOSENTADORIAS',
    responsavel: 'Larissa Souza',
    feitoEm: '2024-05-09',
    status: 'CANCELADO',
    tipoAgendamento: 'PERÍCIA',
  },
  {
    id: 10,
    cliente: 'Beatriz Lima',
    tipoProcesso: 'AUXILIO DOENÇA',
    responsavel: 'Paulo Henrique',
    feitoEm: '2024-05-22',
    status: 'EM ANDAMENTO',
    tipoAgendamento: 'AVALIAÇÃO SOCIAL',
  },
];