import '../style.css';
import './style.css';
import { DICAS } from './dicas.js';

import { SorteioTurma } from './sorteio.js';
import { posicionarEmbarcacoes } from './embarcacoes.js';

// Tela de fim de jogo
const telaFim = document.getElementById('tela-fim');
const tabuleiroFinal = document.getElementById('tabuleiro-final');

const resultadoNavios = document.getElementById('resultado-navios');
const resultadoTentativas = document.getElementById('resultado-tentativas');
const resultadoAcertos = document.getElementById('resultado-acertos');
const resultadoErros = document.getElementById('resultado-erros');

const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
const btnFimConfig = document.getElementById('btn-fim-config');

// Elementos das telas
// Elementos das dicas geográficas
const dicaCategoria = document.getElementById('dica-categoria');
const dicaProgresso = document.getElementById('dica-progresso');
const dicaTitulo = document.getElementById('dica-titulo');
const dicaDescricao = document.getElementById('dica-descricao');
const dicaOrientacao = document.getElementById('dica-orientacao');
const tabuleiroGeografico = document.getElementById('tabuleiro-geografico');
const coordenadaSelecionada = document.getElementById('coordenada-selecionada');
const formPreparacao = document.getElementById('form-preparacao');
const inputQuantidade = document.getElementById('quantidade-alunos');
const mensagemErro = document.getElementById('mensagem-erro');

const telaPreparacao = document.getElementById('tela-preparacao');
const telaPartida = document.getElementById('tela-partida');

// Elementos do sorteio
const btnAbrirSorteio = document.getElementById('btn-abrir-sorteio');
const btnFecharSorteio = document.getElementById('btn-fechar-sorteio');
const popupSorteio = document.getElementById('popup-sorteio');
const alunoSorteado = document.getElementById('aluno-sorteado');
const mensagemSorteio = document.getElementById('mensagem-sorteio');
const indicadorCiclo = document.getElementById('indicador-ciclo');

const btnSortear = document.getElementById('btn-sortear');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnAusente = document.getElementById('btn-ausente');
const btnVoltarConfig = document.getElementById('btn-voltar-config');

// Elementos do formulário de coordenadas
const btnAbrirCoordenadas = document.getElementById('btn-abrir-coordenadas');
const popupCoordenadas = document.getElementById('popup-coordenadas');
const btnFecharCoordenadas = document.getElementById('btn-fechar-coordenadas');
const btnCancelarCoordenadas = document.getElementById('btn-cancelar-coordenadas');
const formCoordenadas = document.getElementById('form-coordenadas');

const inputLatitude = document.getElementById('valor-latitude');
const hemisferioLatitude = document.getElementById('hemisferio-latitude');
const inputLongitude = document.getElementById('valor-longitude');
const hemisferioLongitude = document.getElementById('hemisferio-longitude');
const mensagemCoordenadas = document.getElementById('mensagem-coordenadas');

// Estatísticas
const totalParticiparam = document.getElementById('total-participaram');
const totalDisponiveis = document.getElementById('total-disponiveis');
const totalAusentes = document.getElementById('total-ausentes');

// Histórico
const totalSorteios = document.getElementById('total-sorteios');
const listaHistorico = document.getElementById('lista-historico');

// Estado da partida
let sorteio = null;
let frota = [];
let casasRespondidas = new Map();
let acertosPorNavio = new Map();
let partidaFinalizada = false;
let indiceDicaAtual = 0;


// Iniciar uma nova partida
formPreparacao.addEventListener('submit', (event) => {
    event.preventDefault();

    const valor = inputQuantidade.value.trim();
    const quantidade = Number(valor);

    if (
        valor === '' ||
        !Number.isSafeInteger(quantidade) ||
        quantidade < 1
    ) {
        mensagemErro.textContent =
            'Informe uma quantidade inteira maior que zero.';

        inputQuantidade.setAttribute('aria-invalid', 'true');
        inputQuantidade.focus();

        return;
    }

    sorteio = new SorteioTurma(quantidade);

    // Gerar uma nova frota aleatória para a partida.
    frota = posicionarEmbarcacoes();
    
    // Exibir a distribuição da frota no console (modo de teste)
    console.group('🚢 Distribuição das embarcações');

    frota.forEach((navio) => {
        const casas = navio.casas.map((casa) => {
            const latitude = 75 - casa.linha * 30;
            const longitude = -165 + casa.coluna * 30;

            return {
                linha: casa.linha,
                coluna: casa.coluna,
                latitude: formatarLatitude(latitude),
                longitude: formatarLongitude(longitude)
            };
        });

        console.group(
            `${navio.id} | ${navio.tamanho} células | ${navio.orientacao}`
        );

        console.table(casas);

        console.groupEnd();
    });

    console.groupEnd();

    // Reiniciar os registros de tentativas e acertos.
    casasRespondidas.clear();

    acertosPorNavio = new Map(
        frota.map((navio) => [navio.id, new Set()])
    );

    partidaFinalizada = false;
    indiceDicaAtual = 0;
    atualizarDica();

    btnAbrirCoordenadas.disabled = false;
    btnAbrirCoordenadas.textContent = 'Informar coordenadas';

    mensagemErro.textContent = '';
    inputQuantidade.removeAttribute('aria-invalid');

    telaPreparacao.hidden = true;
    telaPartida.hidden = false;

    alunoSorteado.textContent = '—';
    mensagemSorteio.textContent = 'Sorteie um aluno para começar.';

    btnSortear.disabled = false;
    btnSortear.hidden = false;
    btnSortear.textContent = 'Sortear aluno';

    btnConfirmar.disabled = true;
    btnAusente.disabled = true;

    atualizarInterface();
    construirTabuleiro();
});


// Limpar mensagem de erro ao corrigir o campo
inputQuantidade.addEventListener('input', () => {
    mensagemErro.textContent = '';
    inputQuantidade.removeAttribute('aria-invalid');
});


// Abrir gerenciamento da turma
btnAbrirSorteio.addEventListener('click', () => {
    if (!popupSorteio.open) {
        popupSorteio.showModal();
    }

    if (sorteio.alunoAtual === null) {
        realizarSorteio();
    }
});


// Fechar gerenciamento da turma
btnFecharSorteio.addEventListener('click', () => {
    popupSorteio.close();
});


// Sortear aluno
btnSortear.addEventListener('click', realizarSorteio);

function realizarSorteio() {
    if (!sorteio || sorteio.alunoAtual !== null) {
        return;
    }

    const resultado = sorteio.sortearAluno();

    alunoSorteado.textContent =
        String(resultado.numero).padStart(2, '0');

    if (resultado.cicloReiniciado) {
        mensagemSorteio.textContent =
            'Um novo ciclo começou. Os alunos ausentes voltaram a ficar disponíveis.';
    } else {
        mensagemSorteio.textContent =
            'Aluno sorteado! Confirme a presença ou marque a ausência.';
    }

    btnSortear.hidden = true;
    btnConfirmar.disabled = false;
    btnAusente.disabled = false;

    atualizarInterface();
}


// Confirmar presença
btnConfirmar.addEventListener('click', () => {
    if (!sorteio || sorteio.alunoAtual === null) {
        return;
    }

    const numero = sorteio.confirmarPresenca();

    alunoSorteado.textContent =
        String(numero).padStart(2, '0');

    mensagemSorteio.textContent =
        `Aluno ${String(numero).padStart(2, '0')} confirmado. A missão pode começar!`;

    btnConfirmar.disabled = true;
    btnAusente.disabled = true;
    btnSortear.hidden = false;
    btnSortear.disabled = false;
    btnSortear.textContent = 'Sortear próximo aluno';

    atualizarInterface();
});


// Marcar ausência
btnAusente.addEventListener('click', () => {
    if (!sorteio || sorteio.alunoAtual === null) {
        return;
    }

    const numero = sorteio.marcarAusente();

    alunoSorteado.textContent = '—';

    mensagemSorteio.textContent =
        `Aluno ${String(numero).padStart(2, '0')} marcado como ausente. Sorteie o próximo.`;

    btnConfirmar.disabled = true;
    btnAusente.disabled = true;
    btnSortear.hidden = false;
    btnSortear.disabled = false;
    btnSortear.textContent = 'Sortear próximo aluno';

    atualizarInterface();
});


// Atualizar estatísticas e histórico
function atualizarInterface() {
    const resumo = sorteio.obterResumo();

    indicadorCiclo.textContent = `Ciclo ${resumo.ciclo}`;

    totalParticiparam.textContent = resumo.jaJogaram;
    totalDisponiveis.textContent = resumo.disponiveis;
    totalAusentes.textContent = resumo.ausentes;

    totalSorteios.textContent =
        `${sorteio.historico.length} ${
            sorteio.historico.length === 1 ? 'registro' : 'registros'
        }`;

    renderizarHistorico();
}


// Construir o histórico
function renderizarHistorico() {
    listaHistorico.replaceChildren();

    if (sorteio.historico.length === 0) {
        const vazio = document.createElement('li');

        vazio.className = 'historico-vazio';
        vazio.textContent = 'Nenhum aluno sorteado ainda.';

        listaHistorico.appendChild(vazio);
        return;
    }

    sorteio.historico.slice(0, 12).forEach((registro) => {
        const item = document.createElement('li');
        item.className = 'historico-item';

        const identificacao = document.createElement('span');

        identificacao.textContent =
            `Aluno ${String(registro.numero).padStart(2, '0')} · Ciclo ${registro.ciclo}`;

        const status = document.createElement('span');

        status.className =
            `historico-status status-${registro.status}`;

        const textosStatus = {
            aguardando: 'Aguardando',
            participou: 'Participou',
            ausente: 'Ausente'
        };

        status.textContent = textosStatus[registro.status];

        item.append(identificacao, status);
        listaHistorico.appendChild(item);
    });
}


// Abrir formulário de coordenadas
btnAbrirCoordenadas.addEventListener('click', () => {
    if (partidaFinalizada) {
        return;
    }

    mensagemCoordenadas.textContent = '';
    formCoordenadas.reset();

    if (!popupCoordenadas.open) {
        popupCoordenadas.showModal();
    }

    inputLatitude.focus();
});


// Fechar formulário
btnFecharCoordenadas.addEventListener('click', fecharFormularioCoordenadas);
btnCancelarCoordenadas.addEventListener('click', fecharFormularioCoordenadas);

function fecharFormularioCoordenadas() {
    if (popupCoordenadas.open) {
        popupCoordenadas.close();
    }
}


// Impedir fechamento acidental ao clicar dentro do diálogo
popupCoordenadas.addEventListener('click', (event) => {
    if (event.target === popupCoordenadas) {
        fecharFormularioCoordenadas();
    }
});


// Formatar coordenadas para exibição
function formatarLatitude(valor) {
    if (valor === 0) {
        return '0°';
    }

    return `${Math.abs(valor)}°${valor > 0 ? 'N' : 'S'}`;
}

function formatarLongitude(valor) {
    if (valor === 0) {
        return '0°';
    }

    return `${Math.abs(valor)}°${valor > 0 ? 'L' : 'O'}`;
}


// Localizar a célula mais próxima das coordenadas informadas
function localizarCelula(latitude, longitude) {
    const indiceLinha = Math.min(
        5,
        Math.floor((90 - latitude) / 30)
    );

    const indiceColuna = Math.min(
        11,
        Math.floor((longitude + 180) / 30)
    );

    const latitudeCentro = 75 - indiceLinha * 30;
    const longitudeCentro = -165 + indiceColuna * 30;

    const coordenadaExata =
        latitude === latitudeCentro &&
        longitude === longitudeCentro;

    return {
        indiceLinha,
        indiceColuna,
        latitudeCentro,
        longitudeCentro,
        coordenadaExata
    };
}


// Verificar se uma célula pertence a um navio
function encontrarNavio(linha, coluna) {
    return frota.find((navio) =>
        navio.casas.some((casa) =>
            casa.linha === linha &&
            casa.coluna === coluna
        )
    );
}


// Verificar se um navio foi completamente atingido
function navioFoiAfundado(navio) {
    const acertos = acertosPorNavio.get(navio.id);

    return acertos.size === navio.tamanho;
}


// Verificar se toda a frota foi encontrada
function frotaFoiDestruida() {
    return frota.every((navio) => navioFoiAfundado(navio));
}

// Atualizar a dica geográfica atual
function atualizarDica() {
    // Avançar somente quando o navio da dica atual
    // estiver completamente afundado.
    while (indiceDicaAtual < DICAS.length) {
        const dica = DICAS[indiceDicaAtual];

        const navio = frota.find(
            (embarcacao) => embarcacao.id === dica.navioId
        );

        if (!navio || !navioFoiAfundado(navio)) {
            break;
        }

        indiceDicaAtual++;
    }

    if (indiceDicaAtual >= DICAS.length) {
        dicaCategoria.textContent = 'CONCLUÍDO';
        dicaProgresso.textContent = '5 de 5 dicas';
        dicaTitulo.textContent = 'Todas as dicas foram concluídas!';
        dicaDescricao.textContent =
            'A turma encontrou todas as embarcações e explorou os setores geográficos propostos.';
        dicaOrientacao.textContent = '';
        document.getElementById('painel-dica')
            .classList.add('dica-concluida');

        return;
    }

    const dica = DICAS[indiceDicaAtual];

    dicaCategoria.textContent = dica.categoria;
    dicaProgresso.textContent =
        `Dica ${indiceDicaAtual + 1} de ${DICAS.length}`;

    dicaTitulo.textContent = dica.titulo;
    dicaDescricao.textContent = dica.descricao;
    dicaOrientacao.textContent = dica.orientacao;

    document.getElementById('painel-dica')
        .classList.remove('dica-concluida');
}


// Processar uma tentativa no tabuleiro
function processarTentativa(resultado) {
    const chaveCelula =
        `${resultado.indiceLinha}-${resultado.indiceColuna}`;

    // Não permitir repetir uma tentativa.
    if (casasRespondidas.has(chaveCelula)) {
        mensagemCoordenadas.textContent =
            'Essa célula já foi explorada. Informe outra coordenada.';
        return false;
    }

    const celulas =
        tabuleiroGeografico.querySelectorAll('.celula-tabuleiro');

    const indiceCelula =
        resultado.indiceLinha * 12 + resultado.indiceColuna;

    const celula = celulas[indiceCelula];

    if (!celula) {
        mensagemCoordenadas.textContent =
            'Não foi possível localizar essa posição.';
        return false;
    }

    const navio = encontrarNavio(
        resultado.indiceLinha,
        resultado.indiceColuna
    );

    const centroLatitude =
        formatarLatitude(resultado.latitudeCentro);

    const centroLongitude =
        formatarLongitude(resultado.longitudeCentro);

    const centroFormatado =
        `${centroLatitude}, ${centroLongitude}`;

    const informacaoAproximada = resultado.coordenadaExata
        ? ''
        : `Coordenada aproximada para o centro da célula (${centroFormatado}). `;

    let mensagemResultado;

    if (navio) {
        // Registrar acerto na embarcação.
        const acertos = acertosPorNavio.get(navio.id);

        acertos.add(chaveCelula);

        celula.classList.add('respondida-correta');

        celula.setAttribute(
            'aria-label',
            `${centroFormatado}. Embarcação atingida.`
        );

        casasRespondidas.set(chaveCelula, 'acerto');

        if (navioFoiAfundado(navio)) {
            mensagemResultado =
                'Embarcação afundada!';

            atualizarDica();
        } else {
            mensagemResultado =
                'Você atingiu uma embarcação!';
        }

    } else {
        // Registrar tentativa na água.
        celula.classList.add('respondida-incorreta');

        celula.setAttribute(
            'aria-label',
            `${centroFormatado}. Água.`
        );

        casasRespondidas.set(chaveCelula, 'agua');

        mensagemResultado = 'Água! Nenhuma embarcação nessa posição.';
    }

    celula.disabled = true;

    // Verificar se toda a frota foi encontrada.
    if (frotaFoiDestruida()) {
        partidaFinalizada = true;

        finalizarPartida();

        mensagemResultado =
            'Toda a frota foi encontrada! Parabéns, missão concluída!';

        btnAbrirCoordenadas.disabled = true;
        btnAbrirCoordenadas.textContent = 'Partida concluída';
    }

    coordenadaSelecionada.textContent =
        informacaoAproximada + mensagemResultado;

    return true;
}


// Registrar uma resposta
formCoordenadas.addEventListener('submit', (event) => {
    event.preventDefault();

    if (partidaFinalizada) {
        return;
    }

    const valorLatitude = inputLatitude.value.trim();
    const valorLongitude = inputLongitude.value.trim();

    const latitudeAbsoluta = Number(valorLatitude);
    const longitudeAbsoluta = Number(valorLongitude);

    // Verificar preenchimento e valores inteiros.
    if (
        valorLatitude === '' ||
        valorLongitude === '' ||
        !Number.isInteger(latitudeAbsoluta) ||
        !Number.isInteger(longitudeAbsoluta)
    ) {
        mensagemCoordenadas.textContent =
            'Informe valores numéricos inteiros para latitude e longitude.';
        return;
    }

    // Verificar limites geográficos.
    if (
        latitudeAbsoluta < 0 ||
        latitudeAbsoluta > 90 ||
        longitudeAbsoluta < 0 ||
        longitudeAbsoluta > 180
    ) {
        mensagemCoordenadas.textContent =
            'Coordenada inválida. Verifique os valores informados.';
        return;
    }

    // Converter para coordenadas com sinal.
    const latitude =
        hemisferioLatitude.value === 'N'
            ? latitudeAbsoluta
            : -latitudeAbsoluta;

    const longitude =
        hemisferioLongitude.value === 'L'
            ? longitudeAbsoluta
            : -longitudeAbsoluta;

    const resultado = localizarCelula(latitude, longitude);

    const sucesso = processarTentativa(resultado);

    // Só fechar o formulário quando a tentativa for registrada.
    if (sucesso) {
        fecharFormularioCoordenadas();
    }
});


// Encerrar a partida
btnVoltarConfig.addEventListener('click', () => {
    const desejaEncerrar = window.confirm(
        'Deseja encerrar esta partida? O histórico e o sorteio atual serão perdidos.'
    );

    if (!desejaEncerrar) {
        return;
    }

    sorteio = null;
    frota = [];
    casasRespondidas.clear();
    acertosPorNavio.clear();
    partidaFinalizada = false;

    if (popupSorteio.open) {
        popupSorteio.close();
    }

    if (popupCoordenadas.open) {
        popupCoordenadas.close();
    }

    telaPartida.hidden = true;
    telaPreparacao.hidden = false;

    inputQuantidade.focus();
});


// Construir o tabuleiro geográfico
function construirTabuleiro() {
    tabuleiroGeografico.replaceChildren();

    coordenadaSelecionada.textContent =
        'Informe as coordenadas para localizar uma célula.';

    const quantidadeLinhas = 6;
    const quantidadeColunas = 12;

    // Rótulos de longitude da borda superior.
    const cantoSuperior = document.createElement('div');
    cantoSuperior.className = 'celula-eixo';
    tabuleiroGeografico.appendChild(cantoSuperior);

    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
        const longitudeCentro = -165 + coluna * 30;
        const rotulo = document.createElement('div');

        rotulo.className = 'celula-cabecalho coordenada-borda-longitude';
        rotulo.textContent = formatarLongitude(longitudeCentro);

        tabuleiroGeografico.appendChild(rotulo);
    }

    const cantoSuperiorDireito = document.createElement('div');
    cantoSuperiorDireito.className = 'celula-eixo';
    tabuleiroGeografico.appendChild(cantoSuperiorDireito);

    // Criar as seis linhas do tabuleiro.
    for (let linha = 0; linha < quantidadeLinhas; linha++) {
        const latitudeCentro = 75 - linha * 30;
        const latitudeFormatada = formatarLatitude(latitudeCentro);

        // Latitude na borda esquerda.
        const rotuloEsquerdo = document.createElement('div');

        rotuloEsquerdo.className =
            'celula-eixo coordenada-borda-latitude';

        rotuloEsquerdo.textContent = latitudeFormatada;

        tabuleiroGeografico.appendChild(rotuloEsquerdo);

        // Células da linha.
        for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
            const longitudeCentro = -165 + coluna * 30;

            const celula = document.createElement('button');

            celula.type = 'button';
            celula.className = 'celula-tabuleiro';
            celula.disabled = false;

            const longitudeFormatada =
                formatarLongitude(longitudeCentro);

            celula.dataset.coordenada =
                `${latitudeFormatada}, ${longitudeFormatada}`;

            celula.setAttribute(
                'aria-label',
                `Célula com centro em ${latitudeFormatada}, ${longitudeFormatada}`
            );

            tabuleiroGeografico.appendChild(celula);
        }

        // Latitude na borda direita.
        const rotuloDireito = document.createElement('div');

        rotuloDireito.className =
            'celula-eixo coordenada-borda-latitude';

        rotuloDireito.textContent = latitudeFormatada;

        tabuleiroGeografico.appendChild(rotuloDireito);
    }

    // Rótulos de longitude da borda inferior.
    const cantoInferior = document.createElement('div');
    cantoInferior.className = 'celula-eixo';
    tabuleiroGeografico.appendChild(cantoInferior);

    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
        const longitudeCentro = -165 + coluna * 30;
        const rotulo = document.createElement('div');

        rotulo.className = 'celula-cabecalho coordenada-borda-longitude';
        rotulo.textContent = formatarLongitude(longitudeCentro);

        tabuleiroGeografico.appendChild(rotulo);
    }

    const cantoInferiorDireito = document.createElement('div');
    cantoInferiorDireito.className = 'celula-eixo';
    tabuleiroGeografico.appendChild(cantoInferiorDireito);
}

// Encerrar e apresentar os resultados da partida
function finalizarPartida() {
    const totalNavios = frota.length;
    const totalAcertos = frota.reduce(
        (total, navio) => total + navio.tamanho,
        0
    );

    const totalTentativas = casasRespondidas.size;
    const totalErros = totalTentativas - totalAcertos;

    resultadoNavios.textContent =
        `${totalNavios}/${totalNavios}`;

    resultadoTentativas.textContent = totalTentativas;
    resultadoAcertos.textContent = totalAcertos;
    resultadoErros.textContent = totalErros;

    revelarFrota();

    telaPartida.hidden = true;
    telaFim.hidden = false;
}


// Mostrar a posição de todas as embarcações
function revelarFrota() {
    tabuleiroFinal.replaceChildren();

    // Copiar o tabuleiro atual, preservando as coordenadas das bordas.
    const tabuleiroRevelado = tabuleiroGeografico.cloneNode(true);

    const celulas =
        tabuleiroRevelado.querySelectorAll('.celula-tabuleiro');

    frota.forEach((navio) => {
        navio.casas.forEach((casa) => {
            const indice = casa.linha * 12 + casa.coluna;
            const celula = celulas[indice];

            if (celula) {
                celula.classList.remove(
                    'respondida-correta',
                    'respondida-incorreta'
                );

                celula.classList.add('navio-revelado');
                celula.disabled = true;

                celula.setAttribute(
                    'aria-label',
                    'Embarcação revelada'
                );
            }
        });
    });

    tabuleiroFinal.replaceChildren(...tabuleiroRevelado.children);
}


// Jogar novamente com a mesma quantidade de alunos
btnJogarNovamente.addEventListener('click', () => {
    telaFim.hidden = true;
    telaPreparacao.hidden = false;

    // O formulário inicia uma nova partida e gera outra frota.
    formPreparacao.requestSubmit();
});


// Voltar à configuração
btnFimConfig.addEventListener('click', () => {
    telaFim.hidden = true;
    telaPreparacao.hidden = false;

    sorteio = null;
    frota = [];

    casasRespondidas.clear();
    acertosPorNavio.clear();

    partidaFinalizada = false;

    inputQuantidade.focus();
});

// Função temporária para testar a partida completa pelo Console
window.testarBatalhaNaval = function () {
    // Iniciar uma nova partida com 30 alunos
    inputQuantidade.value = 30;
    formPreparacao.requestSubmit();

    const casasNavios = new Set();

    // Registrar todas as posições ocupadas pelos navios
    frota.forEach((navio) => {
        navio.casas.forEach((casa) => {
            casasNavios.add(`${casa.linha}-${casa.coluna}`);
        });
    });

    // Criar uma lista de todas as casas vazias
    const casasAgua = [];

    for (let linha = 0; linha < 6; linha++) {
        for (let coluna = 0; coluna < 12; coluna++) {
            const chave = `${linha}-${coluna}`;

            if (!casasNavios.has(chave)) {
                casasAgua.push({ linha, coluna });
            }
        }
    }

    // Embaralhar as casas de água
    casasAgua.sort(() => Math.random() - 0.5);

    // Escolher 8 erros artificiais
    const erros = casasAgua.slice(0, 8);

    // Registrar os erros
    erros.forEach((casa) => {
        processarTentativa({
            indiceLinha: casa.linha,
            indiceColuna: casa.coluna,
            latitudeCentro: 75 - casa.linha * 30,
            longitudeCentro: -165 + casa.coluna * 30,
            coordenadaExata: true
        });
    });

    // Registrar os acertos em todas as embarcações
    frota.forEach((navio) => {
        navio.casas.forEach((casa) => {
            processarTentativa({
                indiceLinha: casa.linha,
                indiceColuna: casa.coluna,
                latitudeCentro: 75 - casa.linha * 30,
                longitudeCentro: -165 + casa.coluna * 30,
                coordenadaExata: true
            });
        });
    });

    console.log('Teste concluído!');
    console.log('Erros artificiais:', erros.length);
    console.log('Acertos:', casasNavios.size);
    console.log('Total de tentativas:', erros.length + casasNavios.size);
};