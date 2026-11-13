import '../style.css';
import './style.css';
import { SorteioTurma } from './sorteio.js';

// Elementos das telas
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

// Estatísticas
const totalParticiparam = document.getElementById('total-participaram');
const totalDisponiveis = document.getElementById('total-disponiveis');
const totalAusentes = document.getElementById('total-ausentes');

// Histórico
const totalSorteios = document.getElementById('total-sorteios');
const listaHistorico = document.getElementById('lista-historico');

// Estado da partida
let sorteio = null;


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


// Encerrar a partida
btnVoltarConfig.addEventListener('click', () => {
    const desejaEncerrar = window.confirm(
        'Deseja encerrar esta partida? O histórico e o sorteio atual serão perdidos.'
    );

    if (!desejaEncerrar) {
        return;
    }

    sorteio = null;

    if (popupSorteio.open) {
        popupSorteio.close();
    }

    telaPartida.hidden = true;
    telaPreparacao.hidden = false;

    inputQuantidade.focus();
});


// Formatar valores de latitude
function formatarLatitude(valor) {
    if (valor === 0) {
        return '0°';
    }

    const hemisferio = valor > 0 ? 'N' : 'S';

    return `${Math.abs(valor)}°${hemisferio}`;
}


// Formatar valores de longitude
function formatarLongitude(valor) {
    if (valor === 0) {
        return '0°';
    }

    const hemisferio = valor > 0 ? 'L' : 'O';

    return `${Math.abs(valor)}°${hemisferio}`;
}


// Calcular e apresentar as coordenadas de uma casa
function selecionarCelula(celula, indiceColuna, linha) {
    const casas = tabuleiroGeografico.querySelectorAll('.celula-tabuleiro');

    casas.forEach((casa) => {
        casa.classList.remove('selecionada');
        casa.setAttribute('aria-pressed', 'false');
    });

    celula.classList.add('selecionada');
    celula.setAttribute('aria-pressed', 'true');

    // Cada coluna representa uma faixa de 30° de longitude.
    const longitudeInicial = -180 + indiceColuna * 30;
    const longitudeFinal = longitudeInicial + 30;
    const longitudeCentro = (longitudeInicial + longitudeFinal) / 2;

    // Cada linha representa uma faixa de 30° de latitude.
    // A primeira linha começa no Polo Norte.
    const latitudeSuperior = 90 - (linha - 1) * 30;
    const latitudeInferior = latitudeSuperior - 30;
    const latitudeCentro = (latitudeSuperior + latitudeInferior) / 2;

    const coordenada = celula.dataset.coordenada;

    const faixaLatitude = linha <= 3
    ? `${formatarLatitude(latitudeInferior)} a ${formatarLatitude(latitudeSuperior)}`
    : `${formatarLatitude(latitudeSuperior)} a ${formatarLatitude(latitudeInferior)}`;

    coordenadaSelecionada.textContent =
        `${coordenada} — Latitude: ${faixaLatitude}; ` +
        `Longitude: ${formatarLongitude(longitudeInicial)} a ${formatarLongitude(longitudeFinal)}. ` +
        `Centro aproximado: ${formatarLatitude(latitudeCentro)}, ` +
        `${formatarLongitude(longitudeCentro)}.`;
}


// Construir o tabuleiro geográfico
function construirTabuleiro() {
    const colunas = 'ABCDEFGHIJKL';
    const quantidadeLinhas = 6;

    tabuleiroGeografico.replaceChildren();

    coordenadaSelecionada.textContent =
        'Selecione uma casa do tabuleiro para consultar suas coordenadas.';

    // Canto superior esquerdo
    const canto = document.createElement('div');
    canto.className = 'celula-eixo';
    canto.textContent = '°';

    tabuleiroGeografico.appendChild(canto);

    // Cabeçalho das colunas
    for (const coluna of colunas) {
        const cabecalho = document.createElement('div');

        cabecalho.className = 'celula-cabecalho';
        cabecalho.textContent = coluna;

        tabuleiroGeografico.appendChild(cabecalho);
    }

    // Linhas e células
    for (let linha = 1; linha <= quantidadeLinhas; linha++) {
        const numeroLinha = document.createElement('div');

        numeroLinha.className = 'celula-cabecalho';
        numeroLinha.textContent = linha;

        tabuleiroGeografico.appendChild(numeroLinha);

        for (let indiceColuna = 0; indiceColuna < colunas.length; indiceColuna++) {
            const coluna = colunas[indiceColuna];
            const celula = document.createElement('div');

            celula.className = 'celula-tabuleiro';
            celula.dataset.coordenada = `${coluna}${linha}`;
            celula.setAttribute('role', 'button');
            celula.setAttribute('tabindex', '0');
            celula.setAttribute('aria-pressed', 'false');
            celula.setAttribute(
                'aria-label',
                `Posição ${coluna}${linha}`
            );

            celula.addEventListener('click', () => {
                selecionarCelula(celula, indiceColuna, linha);
            });

            celula.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selecionarCelula(celula, indiceColuna, linha);
                }
            });

            tabuleiroGeografico.appendChild(celula);
        }
    }
}