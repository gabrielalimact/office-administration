import { IFuncionarios } from "@/app/home/funcionarios-relatorios/page";

export const funcionariosMock: IFuncionarios[] = [
  {
    id: 1,
    nome: 'Ana Paula Souza',
    cargo: 'Advogada Sênior',
    relatorios: [
      {
        id: 101,
        tipoProcesso: 'Trabalhista',
        descricao: 'Revisão de contrato de trabalho.',
        feitoEm: '2024-05-10',
        status: 'FINALIZADO',
      },
    ],
  },
  {
    id: 2,
    nome: 'Carlos Henrique Lima',
    cargo: 'Advogado Júnior',
    relatorios: [
      {
        id: 102,
        tipoProcesso: 'Cível',
        descricao: 'Elaboração de petição inicial.',
        feitoEm: '2024-06-01',
        status: 'EM ANDAMENTO',
      },
    ],
  },
  {
    id: 3,
    nome: 'Fernanda Dias',
    cargo: 'Estagiária',
    relatorios: [
      {
        id: 103,
        tipoProcesso: 'Família',
        descricao: 'Pesquisa jurisprudencial.',
        feitoEm: '2024-05-22',
        status: 'ARQUIVADO',
      },
    ],
  },
  {
    id: 4,
    nome: 'João Pedro Martins',
    cargo: 'Advogado Pleno',
    relatorios: [
      {
        id: 104,
        tipoProcesso: 'Tributário',
        descricao: 'Análise de autos de infração.',
        feitoEm: '2024-04-30',
        status: 'CANCELADO',
      },
    ],
  },
  {
    id: 5,
    nome: 'Mariana Alves',
    cargo: 'Assistente Jurídica',
    relatorios: [
      {
        id: 105,
        tipoProcesso: 'Empresarial',
        descricao: 'Abertura de empresa.',
        feitoEm: '2024-06-05',
        status: 'REMARCADO',
      },
    ],
  },
  {
    id: 6,
    nome: 'Ricardo Gomes',
    cargo: 'Advogado Sênior',
    relatorios: [
      {
        id: 106,
        tipoProcesso: 'Penal',
        descricao: 'Defesa em audiência.',
        feitoEm: '2024-05-15',
        status: 'CONCEDIDO',
      },
    ],
  },
  {
    id: 7,
    nome: 'Beatriz Ferreira',
    cargo: 'Advogada Júnior',
    relatorios: [
      {
        id: 107,
        tipoProcesso: 'Consumidor',
        descricao: 'Atendimento ao cliente.',
        feitoEm: '2024-06-03',
        status: 'FAZER EXAMES',
      },
    ],
  },
  {
    id: 8,
    nome: 'Lucas Silva',
    cargo: 'Estagiário',
    relatorios: [
      {
        id: 108,
        tipoProcesso: 'Ambiental',
        descricao: 'Levantamento de documentos.',
        feitoEm: '2024-05-28',
        status: 'FAZER ATESTADO',
      },
    ],
  },
  {
    id: 9,
    nome: 'Patrícia Ramos',
    cargo: 'Advogada Plena',
    relatorios: [
      {
        id: 109,
        tipoProcesso: 'Imobiliário',
        descricao: 'Análise de contrato de locação.',
        feitoEm: '2024-06-07',
        status: 'PEGAR SENHA',
      },
    ],
  },
  {
    id: 10,
    nome: 'Eduardo Castro',
    cargo: 'Assistente Jurídico',
    relatorios: [
      {
        id: 110,
        tipoProcesso: 'Previdenciário',
        descricao: 'Revisão de benefícios.',
        feitoEm: '2024-05-18',
        status: 'FEITO PJE',
      },
    ],
  },
];