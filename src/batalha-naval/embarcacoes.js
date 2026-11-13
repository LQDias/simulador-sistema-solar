const LINHAS = 6;
const COLUNAS = 12;

export const FROTA = [
    { id: 'grande', tamanho: 4 },
    { id: 'medio-1', tamanho: 3 },
    { id: 'medio-2', tamanho: 3 },
    { id: 'pequeno-1', tamanho: 2 },
    { id: 'pequeno-2', tamanho: 2 }
];

// Embaralhar uma lista usando Fisher-Yates
function embaralhar(lista) {
    const resultado = [...lista];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] =
            [resultado[j], resultado[i]];
    }

    return resultado;
}

// Gerar todas as posições possíveis para um navio
function gerarPosicoes(tamanho) {
    const posicoes = [];

    for (let linha = 0; linha < LINHAS; linha++) {
        for (let coluna = 0; coluna < COLUNAS; coluna++) {

            // Orientação horizontal
            if (coluna + tamanho <= COLUNAS) {
                const casas = [];

                for (let i = 0; i < tamanho; i++) {
                    casas.push({
                        linha,
                        coluna: coluna + i
                    });
                }

                posicoes.push({
                    orientacao: 'horizontal',
                    casas
                });
            }

            // Orientação vertical
            if (linha + tamanho <= LINHAS) {
                const casas = [];

                for (let i = 0; i < tamanho; i++) {
                    casas.push({
                        linha: linha + i,
                        coluna
                    });
                }

                posicoes.push({
                    orientacao: 'vertical',
                    casas
                });
            }
        }
    }

    return embaralhar(posicoes);
}

// Verificar se uma posição não ocupa casas já utilizadas
function posicaoDisponivel(posicao, ocupadas) {
    return posicao.casas.every((casa) => {
        const chave = `${casa.linha},${casa.coluna}`;

        return !ocupadas.has(chave);
    });
}

// Posicionar a frota usando tentativa e retrocesso
function distribuir(frota, indice, ocupadas, resultado) {
    if (indice === frota.length) {
        return true;
    }

    const navio = frota[indice];
    const possibilidades = gerarPosicoes(navio.tamanho);

    for (const posicao of possibilidades) {
        if (!posicaoDisponivel(posicao, ocupadas)) {
            continue;
        }

        const chaves = posicao.casas.map(
            (casa) => `${casa.linha},${casa.coluna}`
        );

        chaves.forEach((chave) => ocupadas.add(chave));

        resultado.push({
            id: navio.id,
            tamanho: navio.tamanho,
            orientacao: posicao.orientacao,
            casas: posicao.casas
        });

        if (
            distribuir(
                frota,
                indice + 1,
                ocupadas,
                resultado
            )
        ) {
            return true;
        }

        // Se não foi possível posicionar os próximos navios,
        // desfazemos a posição atual e tentamos outra.
        resultado.pop();

        chaves.forEach((chave) => ocupadas.delete(chave));
    }

    return false;
}

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

// Criar uma distribuição aleatória da frota
export function posicionarEmbarcacoes() {
    const resultado = [];
    const ocupadas = new Set();

    const sucesso = distribuir(
        FROTA,
        0,
        ocupadas,
        resultado
    );

    if (!sucesso || !validarFrota(resultado)) {
        throw new Error(
            'Não foi possível gerar uma distribuição válida da frota.'
        );
    }

    return resultado;
}