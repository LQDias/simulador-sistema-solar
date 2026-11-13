const LINHAS = 6;
const COLUNAS = 12;

export const FROTA = [
    { id: 'grande', tamanho: 4 },
    { id: 'medio-1', tamanho: 3 },
    { id: 'medio-2', tamanho: 3 },
    { id: 'pequeno-1', tamanho: 2 },
    { id: 'pequeno-2', tamanho: 2 }
];

// Posições geográficas associadas às dicas.
// Cada célula representa uma área de 30° × 30°.
const POSICOES_INICIAIS = [
    {
        id: 'grande',
        orientacao: 'vertical',
        casas: [
            { linha: 1, coluna: 0 },
            { linha: 2, coluna: 0 },
            { linha: 3, coluna: 0 },
            { linha: 4, coluna: 0 }
        ]
    },
    {
        id: 'medio-1',
        orientacao: 'horizontal',
        casas: [
            { linha: 2, coluna: 3 },
            { linha: 2, coluna: 4 },
            { linha: 2, coluna: 5 }
        ]
    },
    {
        id: 'medio-2',
        orientacao: 'horizontal',
        casas: [
            { linha: 3, coluna: 7 },
            { linha: 3, coluna: 8 },
            { linha: 3, coluna: 9 }
        ]
    },
    {
        id: 'pequeno-1',
        orientacao: 'horizontal',
        casas: [
            { linha: 2, coluna: 6 },
            { linha: 2, coluna: 7 }
        ]
    },
    {
        id: 'pequeno-2',
        orientacao: 'horizontal',
        casas: [
            { linha: 2, coluna: 10 },
            { linha: 2, coluna: 11 }
        ]
    }
];

// Validar a distribuição completa
export function validarFrota(frota) {
    const ocupadas = new Set();

    for (const navio of frota) {
        if (navio.casas.length !== navio.tamanho) {
            return false;
        }

        if (
            navio.orientacao !== 'horizontal' &&
            navio.orientacao !== 'vertical'
        ) {
            return false;
        }

        for (const casa of navio.casas) {
            if (
                casa.linha < 0 ||
                casa.linha >= LINHAS ||
                casa.coluna < 0 ||
                casa.coluna >= COLUNAS
            ) {
                return false;
            }

            const chave = `${casa.linha},${casa.coluna}`;

            if (ocupadas.has(chave)) {
                return false;
            }

            ocupadas.add(chave);
        }

        const linhas = navio.casas.map((casa) => casa.linha);
        const colunas = navio.casas.map((casa) => casa.coluna);

        if (navio.orientacao === 'horizontal') {
            if (!linhas.every((linha) => linha === linhas[0])) {
                return false;
            }

            const ordenadas = [...colunas].sort((a, b) => a - b);

            for (let i = 1; i < ordenadas.length; i++) {
                if (ordenadas[i] !== ordenadas[i - 1] + 1) {
                    return false;
                }
            }
        }

        if (navio.orientacao === 'vertical') {
            if (!colunas.every((coluna) => coluna === colunas[0])) {
                return false;
            }

            const ordenadas = [...linhas].sort((a, b) => a - b);

            for (let i = 1; i < ordenadas.length; i++) {
                if (ordenadas[i] !== ordenadas[i - 1] + 1) {
                    return false;
                }
            }
        }
    }

    return true;
}

// Criar a distribuição da frota
export function posicionarEmbarcacoes() {
    const frota = POSICOES_INICIAIS.map((posicao) => {
        const definicao = FROTA.find(
            (navio) => navio.id === posicao.id
        );

        return {
            id: definicao.id,
            tamanho: definicao.tamanho,
            orientacao: posicao.orientacao,
            casas: posicao.casas.map((casa) => ({ ...casa }))
        };
    });

    if (!validarFrota(frota)) {
        throw new Error(
            'A distribuição das embarcações é inválida.'
        );
    }

    return frota;
}