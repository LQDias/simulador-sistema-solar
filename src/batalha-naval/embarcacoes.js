const LINHAS = 6;
const COLUNAS = 12;

export const FROTA = [
    { id: 'grande', tamanho: 4 },
    { id: 'medio-1', tamanho: 3 },
    { id: 'medio-2', tamanho: 3 },
    { id: 'pequeno-1', tamanho: 2 },
    { id: 'pequeno-2', tamanho: 2 }
];

function embaralhar(array) {
    const resultado = [...array];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] =
            [resultado[j], resultado[i]];
    }

    return resultado;
}

function obterPosicoesPossiveis(tamanho) {
    const posicoes = [];

    for (const orientacao of ['horizontal', 'vertical']) {
        for (let linha = 0; linha < LINHAS; linha++) {
            for (let coluna = 0; coluna < COLUNAS; coluna++) {
                const casas = [];

                for (let i = 0; i < tamanho; i++) {
                    const casa = orientacao === 'horizontal'
                        ? { linha, coluna: coluna + i }
                        : { linha: linha + i, coluna };

                    if (
                        casa.linha >= LINHAS ||
                        casa.coluna >= COLUNAS
                    ) {
                        break;
                    }

                    casas.push(casa);
                }

                if (casas.length === tamanho) {
                    posicoes.push({ orientacao, casas });
                }
            }
        }
    }

    return embaralhar(posicoes);
}

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

        const valores = navio.orientacao === 'horizontal'
            ? navio.casas.map((casa) => casa.linha)
            : navio.casas.map((casa) => casa.coluna);

        if (!valores.every((valor) => valor === valores[0])) {
            return false;
        }

        const coordenadas = navio.orientacao === 'horizontal'
            ? navio.casas.map((casa) => casa.coluna)
            : navio.casas.map((casa) => casa.linha);

        const ordenadas = [...coordenadas].sort((a, b) => a - b);

        for (let i = 1; i < ordenadas.length; i++) {
            if (ordenadas[i] !== ordenadas[i - 1] + 1) {
                return false;
            }
        }
    }

    return true;
}

export function posicionarEmbarcacoes() {
    // Navios maiores são posicionados primeiro.
    const embarcacoes = FROTA.map((navio) => ({
        ...navio,
        posicoes: obterPosicoesPossiveis(navio.tamanho)
    })).sort((a, b) => b.tamanho - a.tamanho);

    const frota = [];
    const ocupadas = new Set();

    function posicionarProxima(indice) {
        if (indice === embarcacoes.length) {
            return true;
        }

        const navio = embarcacoes[indice];

        for (const posicao of navio.posicoes) {
            const chaves = posicao.casas.map(
                (casa) => `${casa.linha},${casa.coluna}`
            );

            if (chaves.some((chave) => ocupadas.has(chave))) {
                continue;
            }

            chaves.forEach((chave) => ocupadas.add(chave));

            frota.push({
                id: navio.id,
                tamanho: navio.tamanho,
                orientacao: posicao.orientacao,
                casas: posicao.casas.map((casa) => ({ ...casa }))
            });

            if (posicionarProxima(indice + 1)) {
                return true;
            }

            frota.pop();
            chaves.forEach((chave) => ocupadas.delete(chave));
        }

        return false;
    }

    if (!posicionarProxima(0) || !validarFrota(frota)) {
        throw new Error(
            'Não foi possível gerar uma distribuição válida para a frota.'
        );
    }

    // Manter a ordem original da frota, independentemente da ordem
    // utilizada pelo algoritmo para posicionar os navios.
    return FROTA.map((definicao) =>
        frota.find((navio) => navio.id === definicao.id)
    );
}