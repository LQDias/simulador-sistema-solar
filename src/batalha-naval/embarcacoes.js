import { REGIOES } from './regioes.js';

const LINHAS = 6;
const COLUNAS = 12;

export const FROTA = [
    { id: 'grande', tamanho: 4 },
    { id: 'medio-1', tamanho: 3 },
    { id: 'medio-2', tamanho: 3 },
    { id: 'pequeno-1', tamanho: 2 },
    { id: 'pequeno-2', tamanho: 2 }
];

// Embaralhar um array utilizando Fisher-Yates.
function embaralhar(array) {
    const resultado = [...array];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] =
            [resultado[j], resultado[i]];
    }

    return resultado;
}

// Gerar todas as posições possíveis de uma embarcação
// dentro das células de uma região.
function obterPosicoesPossiveis(regiao) {
    const celulasRegiao = new Set(
        regiao.celulas.map(
            (casa) => `${casa.linha},${casa.coluna}`
        )
    );

    const posicoes = [];
    const orientacoes = ['horizontal', 'vertical'];

    for (const orientacao of orientacoes) {
        for (let linha = 0; linha < LINHAS; linha++) {
            for (let coluna = 0; coluna < COLUNAS; coluna++) {
                const casas = [];

                for (
                    let i = 0;
                    i < regiao.tamanhoNavio;
                    i++
                ) {
                    const casa = orientacao === 'horizontal'
                        ? { linha, coluna: coluna + i }
                        : { linha: linha + i, coluna };

                    if (
                        casa.linha >= LINHAS ||
                        casa.coluna >= COLUNAS ||
                        !celulasRegiao.has(
                            `${casa.linha},${casa.coluna}`
                        )
                    ) {
                        break;
                    }

                    casas.push(casa);
                }

                if (casas.length === regiao.tamanhoNavio) {
                    posicoes.push({
                        orientacao,
                        casas
                    });
                }
            }
        }
    }

    return embaralhar(posicoes);
}

// Validar a distribuição completa da frota.
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

        // Verificar se todas as células pertencem à região do navio.
        const regiao = REGIOES.find(
            (item) => item.id === navio.regiaoId
        );

        if (!regiao) {
            return false;
        }

        const celulasRegiao = new Set(
            regiao.celulas.map(
                (casa) => `${casa.linha},${casa.coluna}`
            )
        );

        if (
            !navio.casas.every((casa) =>
                celulasRegiao.has(`${casa.linha},${casa.coluna}`)
            )
        ) {
            return false;
        }
    }

    return true;
}

// Posicionar a frota aleatoriamente dentro das regiões.
export function posicionarEmbarcacoes() {
    const regioesEmbarcacoes = REGIOES.map((regiao) => {
        const definicaoNavio = FROTA.find(
            (navio) => navio.id === regiao.navioId
        );

        if (!definicaoNavio) {
            throw new Error(
                `Não existe embarcação cadastrada para a região ${regiao.nome}.`
            );
        }

        if (definicaoNavio.tamanho !== regiao.tamanhoNavio) {
            throw new Error(
                `O tamanho da embarcação não corresponde à região ${regiao.nome}.`
            );
        }

        return {
            regiao,
            definicaoNavio,
            posicoes: obterPosicoesPossiveis(regiao)
        };
    });

    // Priorizar regiões com menos possibilidades de posicionamento.
    regioesEmbarcacoes.sort(
        (a, b) => a.posicoes.length - b.posicoes.length
    );

    if (
        regioesEmbarcacoes.some(
            (item) => item.posicoes.length === 0
        )
    ) {
        throw new Error(
            'Uma ou mais regiões não possuem células suficientes para sua embarcação.'
        );
    }

    const frota = [];
    const ocupadas = new Set();

    // Tentar montar a frota completa, voltando atrás
    // caso alguma combinação não seja válida.
    function posicionarProxima(indice) {
        if (indice === regioesEmbarcacoes.length) {
            return true;
        }

        const item = regioesEmbarcacoes[indice];

        for (const posicao of item.posicoes) {
            const chaves = posicao.casas.map(
                (casa) => `${casa.linha},${casa.coluna}`
            );

            const existeSobreposicao = chaves.some(
                (chave) => ocupadas.has(chave)
            );

            if (existeSobreposicao) {
                continue;
            }

            chaves.forEach((chave) => ocupadas.add(chave));

            frota.push({
                id: item.definicaoNavio.id,
                tamanho: item.definicaoNavio.tamanho,
                orientacao: posicao.orientacao,
                regiaoId: item.regiao.id,
                regiaoNome: item.regiao.nome,
                casas: posicao.casas.map(
                    (casa) => ({ ...casa })
                )
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

    return frota;
}