const MAPA_CELULAS = [
    // 75° N
    [
        'arctico', 'arctico', 'arctico', 'america-norte',
        'america-norte', 'atlantico-norte', 'europa',
        'asia-norte', 'asia-norte', 'asia-norte',
        'asia-norte', 'arctico'
    ],

    // 45° N
    [
        'pacifico-norte', 'pacifico-norte', 'america-norte',
        'america-norte', 'atlantico-norte', 'atlantico-norte',
        'europa', 'asia-central', 'asia-central',
        'asia-oriental', 'asia-oriental', 'pacifico-norte'
    ],

    // 15° N
    [
        'pacifico-norte', 'pacifico-norte', 'pacifico-norte',
        'america-central', 'atlantico-norte', 'africa',
        'africa', 'asia-ocidental', 'asia-sul',
        'asia-sul', 'asia-oriental', 'pacifico-norte'
    ],

    // 15° S
    [
        'pacifico-sul', 'pacifico-sul', 'pacifico-sul',
        'america-sul', 'america-sul', 'atlantico-sul',
        'africa', 'indico-norte', 'indico-norte',
        'indico-norte', 'oceania', 'pacifico-sul'
    ],

    // 45° S
    [
        'pacifico-sul', 'pacifico-sul', 'pacifico-sul',
        'pacifico-sul', 'atlantico-sul', 'atlantico-sul',
        'atlantico-sul', 'indico-sul', 'indico-sul',
        'indico-sul', 'indico-sul', 'pacifico-sul'
    ],

    // 75° S
    [
        'antartida', 'antartida', 'antartida', 'antartida',
        'antartida', 'antartida', 'antartida', 'antartida',
        'antartida', 'antartida', 'antartida', 'antartida'
    ]
];

const DEFINICOES_REGIOES = [
    {
        id: 'arctico',
        nome: 'Oceano Ártico',
        categoria: 'OCEANO',
        descricao: 'Localizado ao redor do Polo Norte, é o menor e mais raso dos oceanos.',
        orientacao: 'Procure as águas da região polar norte.'
    },
    {
        id: 'pacifico-norte',
        nome: 'Oceano Pacífico Norte',
        categoria: 'OCEANO',
        descricao: 'Parte do Oceano Pacífico situada ao norte da Linha do Equador.',
        orientacao: 'Procure as águas entre a Ásia, a América do Norte e a região equatorial.'
    },
    {
        id: 'pacifico-sul',
        nome: 'Oceano Pacífico Sul',
        categoria: 'OCEANO',
        descricao: 'Parte do Oceano Pacífico situada ao sul da Linha do Equador.',
        orientacao: 'Procure as águas a oeste da América do Sul e a leste da Oceania.'
    },
    {
        id: 'atlantico-norte',
        nome: 'Oceano Atlântico Norte',
        categoria: 'OCEANO',
        descricao: 'Parte do Atlântico localizada ao norte da Linha do Equador, entre as Américas, a Europa e a África.',
        orientacao: 'Procure as águas entre as Américas, a Europa e o norte da África.'
    },
    {
        id: 'atlantico-sul',
        nome: 'Oceano Atlântico Sul',
        categoria: 'OCEANO',
        descricao: 'Parte do Atlântico localizada ao sul da Linha do Equador, entre a América do Sul e a África.',
        orientacao: 'Procure as águas entre a América do Sul e a África.'
    },
    {
        id: 'america-norte',
        nome: 'América do Norte',
        categoria: 'CONTINENTE',
        descricao: 'Continente que inclui países como Canadá, Estados Unidos e México, além da Groenlândia.',
        orientacao: 'Procure a região continental ao norte da América Central.'
    },
    {
        id: 'america-central',
        nome: 'América Central',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Faixa territorial que conecta a América do Norte à América do Sul.',
        orientacao: 'Procure a estreita faixa de terra entre as duas grandes porções das Américas.'
    },
    {
        id: 'america-sul',
        nome: 'América do Sul',
        categoria: 'CONTINENTE',
        descricao: 'Continente atravessado pela Linha do Equador e pelo Trópico de Capricórnio, onde se encontram a Floresta Amazônica e a Cordilheira dos Andes.',
        orientacao: 'Procure a região continental ao sul da América Central.'
    },
    {
        id: 'europa',
        nome: 'Europa',
        categoria: 'CONTINENTE',
        descricao: 'Continente localizado a oeste da Ásia e ao norte da África.',
        orientacao: 'Procure a região entre o Oceano Atlântico e a Ásia.'
    },
    {
        id: 'africa',
        nome: 'África',
        categoria: 'CONTINENTE',
        descricao: 'Continente atravessado pela Linha do Equador e pelo Meridiano de Greenwich. Abriga o Deserto do Saara.',
        orientacao: 'Procure a região ao sul da Europa e a oeste do Oceano Índico.'
    },
    {
        id: 'asia-norte',
        nome: 'Ásia Setentrional',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Porção norte da Ásia, marcada por grandes extensões territoriais e clima predominantemente frio.',
        orientacao: 'Procure a região asiática próxima ao Oceano Ártico.'
    },
    {
        id: 'asia-central',
        nome: 'Ásia Central',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Região interior da Ásia, conhecida por suas grandes estepes e áreas desérticas.',
        orientacao: 'Procure a região interior do continente asiático.'
    },
    {
        id: 'asia-oriental',
        nome: 'Ásia Oriental',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Região que inclui países como China, Japão, Mongólia e as Coreias.',
        orientacao: 'Procure a porção leste do continente asiático.'
    },
    {
        id: 'asia-ocidental',
        nome: 'Ásia Ocidental',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Região que abrange a Península Arábica e áreas próximas ao Mediterrâneo.',
        orientacao: 'Procure a região asiática próxima ao nordeste da África.'
    },
    {
        id: 'asia-sul',
        nome: 'Ásia Meridional',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Região que inclui a Índia e países vizinhos, próxima ao Oceano Índico.',
        orientacao: 'Procure a região ao norte do Oceano Índico.'
    },
    {
        id: 'indico-norte',
        nome: 'Oceano Índico Norte',
        categoria: 'OCEANO',
        descricao: 'Parte norte do Oceano Índico, situada entre a África, a Ásia e a região equatorial.',
        orientacao: 'Procure as águas ao sul da Ásia.'
    },
    {
        id: 'indico-sul',
        nome: 'Oceano Índico Sul',
        categoria: 'OCEANO',
        descricao: 'Parte sul do Oceano Índico, localizada entre a África, a Ásia e a Austrália.',
        orientacao: 'Procure as águas a oeste da Austrália.'
    },
    {
        id: 'oceania',
        nome: 'Oceania',
        categoria: 'REGIÃO CONTINENTAL',
        descricao: 'Região que inclui a Austrália, a Nova Zelândia e diversas ilhas do Oceano Pacífico.',
        orientacao: 'Procure a região a sudeste da Ásia.'
    },
    {
        id: 'antartida',
        nome: 'Antártida',
        categoria: 'CONTINENTE',
        descricao: 'Continente localizado no Polo Sul, coberto por uma extensa camada de gelo.',
        orientacao: 'Procure a região mais ao sul do planeta.'
    }
];

// Associar automaticamente as células às regiões.
export const REGIOES = DEFINICOES_REGIOES.map((regiao) => ({
    ...regiao,
    celulas: MAPA_CELULAS.flatMap((linha, indiceLinha) =>
        linha.flatMap((idRegiao, indiceColuna) =>
            idRegiao === regiao.id
                ? [{
                    linha: indiceLinha,
                    coluna: indiceColuna
                }]
                : []
        )
    )
}));

// Obter a região correspondente ao centro de uma célula.
export function obterRegiaoDaCelula(linha, coluna) {
    const idRegiao = MAPA_CELULAS[linha]?.[coluna];

    return REGIOES.find((regiao) => regiao.id === idRegiao) ?? null;
}