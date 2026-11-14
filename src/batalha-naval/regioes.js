export const REGIOES = [
    {
        id: 'pacifico',
        nome: 'Oceano Pacífico',
        categoria: 'OCEANO',
        navioId: 'grande',
        tamanhoNavio: 4,

        descricao:
            'É o maior e mais profundo oceano da Terra. Estende-se entre as Américas, a Ásia e a Oceania.',

        orientacao:
            'Procure as águas a oeste das Américas.',

        celulas: [
            { linha: 1, coluna: 0 },
            { linha: 2, coluna: 0 },
            { linha: 3, coluna: 0 },
            { linha: 4, coluna: 0 },
            { linha: 1, coluna: 1 },
            { linha: 2, coluna: 1 },
            { linha: 3, coluna: 1 },
            { linha: 4, coluna: 1 }
        ]
    },

    {
        id: 'atlantico',
        nome: 'Oceano Atlântico',
        categoria: 'OCEANO',
        navioId: 'medio-1',
        tamanhoNavio: 3,

        descricao:
            'Separa as Américas da Europa e da África e possui importantes rotas marítimas.',

        orientacao:
            'Procure as águas a oeste da África e a leste das Américas.',

        celulas: [
            { linha: 1, coluna: 5 },
            { linha: 2, coluna: 5 },
            { linha: 3, coluna: 5 },
            { linha: 4, coluna: 5 }
        ]
    },

    {
        id: 'indico',
        nome: 'Oceano Índico',
        categoria: 'OCEANO',
        navioId: 'medio-2',
        tamanhoNavio: 3,

        descricao:
            'Localiza-se entre a África, a Ásia e a Oceania, sendo importante para o comércio marítimo.',

        orientacao:
            'Procure as águas ao sul da Ásia e a oeste da Austrália.',

        celulas: [
            { linha: 4, coluna: 7 },
            { linha: 4, coluna: 8 },
            { linha: 4, coluna: 9 },
            { linha: 4, coluna: 10 }
        ]
    },

    {
        id: 'america-do-sul',
        nome: 'América do Sul',
        categoria: 'CONTINENTE',
        navioId: 'pequeno-1',
        tamanhoNavio: 2,

        descricao:
            'É atravessada pela Linha do Equador e pelo Trópico de Capricórnio. Abriga a Floresta Amazônica e a Cordilheira dos Andes.',

        orientacao:
            'Procure a região entre os oceanos Pacífico e Atlântico, no hemisfério Sul.',

        celulas: [
            { linha: 3, coluna: 4 },
            { linha: 4, coluna: 4 }
        ]
    },

    {
        id: 'africa',
        nome: 'África',
        categoria: 'CONTINENTE',
        navioId: 'pequeno-2',
        tamanhoNavio: 2,

        descricao:
            'É atravessada pela Linha do Equador e pelo Meridiano de Greenwich. Ao norte, encontra-se o Deserto do Saara.',

        orientacao:
            'Procure a região ao sul do Mar Mediterrâneo e a oeste do Oceano Índico.',

        celulas: [
            { linha: 2, coluna: 6 },
            { linha: 3, coluna: 6 }
        ]
    }
];