import '../style.css';
import './style.css';
import { SorteioTurma } from './sorteio.js';

// Elementos das telas
const tabuleiroGeografico = document.getElementById('tabuleiro-geografico');
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


// Abrir popup e sortear aluno
btnAbrirSorteio.addEventListener('click', () => {
    popupSorteio.hidden = false;

    // Se já existe um aluno sorteado, apenas reabre o popup.
    if (sorteio.alunoAtual !== null) {
        return;
    }

    realizarSorteio();
});

// Fechar popup
btnFecharSorteio.addEventListener('click', () => {
    popupSorteio.hidden = true;
});

// Realizar o sorteio
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
            'Todos os alunos elegíveis já participaram. ' +
            'Um novo ciclo começou; os alunos ausentes voltaram ao sorteio.';
    } else {
        mensagemSorteio.textContent =
            'Aluno sorteado! Confirme a presença ou indique que está ausente.';
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

    liberarProximoSorteio();
    atualizarInterface();
    popupSorteio.hidden = true;
});


// Marcar ausência e permitir novo sorteio
btnAusente.addEventListener('click', () => {
    if (!sorteio || sorteio.alunoAtual === null) {
        return;
    }

    const numero = sorteio.marcarAusente();

    alunoSorteado.textContent = '—';

    mensagemSorteio.textContent =
        `Aluno ${String(numero).padStart(2, '0')} marcado como ausente.`;

    // Libera o sorteio seguinte sem fechar o popup.
    btnSortear.hidden = false;
    btnConfirmar.disabled = true;
    btnAusente.disabled = true;

    atualizarInterface();
});


// Liberar o botão para o próximo sorteio
function liberarProximoSorteio() {
    btnSortear.disabled = false;
    btnConfirmar.disabled = true;
    btnAusente.disabled = true;
}


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

    telaPartida.hidden = true;
    telaPreparacao.hidden = false;

    inputQuantidade.focus();
});

// Construir o tabuleiro geográfico
function construirTabuleiro() {
    const colunas = 'ABCDEFGHIJKL';
    const quantidadeLinhas = 6;

    tabuleiroGeografico.replaceChildren();

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

        for (const coluna of colunas) {
            const celula = document.createElement('div');

            celula.className = 'celula-tabuleiro';
            celula.dataset.coordenada = `${coluna}${linha}`;
            celula.setAttribute(
                'aria-label',
                `Posição ${coluna}${linha}`
            );

            tabuleiroGeografico.appendChild(celula);
        }
    }
}