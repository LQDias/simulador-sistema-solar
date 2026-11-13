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
let casasRespondidas = new Map();


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
    casasRespondidas.clear();

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


// Localizar a célula correspondente a uma coordenada

function localizarCelula(latitude, longitude) {
    // Identifica a linha e a coluna que contêm o ponto informado.
    // Cada célula representa uma área de 30° × 30°.

    const indiceLinha = Math.min(
        5,
        Math.floor((90 - latitude) / 30)
    );

    const indiceColuna = Math.min(
        11,
        Math.floor((longitude + 180) / 30)
    );

    // Calcula o centro da célula encontrada.
    const latitudeCentro = 75 - indiceLinha * 30;
    const longitudeCentro = -165 + indiceColuna * 30;

    const acertou =
        latitude === latitudeCentro &&
        longitude === longitudeCentro;

    return {
        indiceLinha,
        indiceColuna,
        latitudeCentro,
        longitudeCentro,
        acertou
    };
}


// Registrar uma resposta
formCoordenadas.addEventListener('submit', (event) => {
    event.preventDefault();

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

    const chaveCelula =
        `${resultado.indiceLinha}-${resultado.indiceColuna}`;

    // Impedir que uma célula seja respondida novamente.
    if (casasRespondidas.has(chaveCelula)) {
        mensagemCoordenadas.textContent =
            'Essa célula já foi respondida. Informe outra coordenada.';
        return;
    }

    const celulas = tabuleiroGeografico.querySelectorAll('.celula-tabuleiro');

    const indiceCelula =
        resultado.indiceLinha * 12 + resultado.indiceColuna;

    const celula = celulas[indiceCelula];

    if (!celula) {
        mensagemCoordenadas.textContent =
            'Não foi possível localizar essa posição.';
        return;
    }

    const centroLatitude = formatarLatitude(resultado.latitudeCentro);
    const centroLongitude = formatarLongitude(resultado.longitudeCentro);

    if (resultado.acertou) {
        celula.classList.add('respondida-correta');

        celula.setAttribute(
            'aria-label',
            `Centro ${centroLatitude}, ${centroLongitude}. Coordenada exata.`
        );

        coordenadaSelecionada.textContent =
            `Coordenada exata! Célula localizada: ${centroLatitude}, ${centroLongitude}.`;

        casasRespondidas.set(chaveCelula, 'correta');
    } else {
        celula.classList.add('respondida-aproximada');

        celula.setAttribute(
            'aria-label',
            `Centro ${centroLatitude}, ${centroLongitude}. Coordenada aproximada.`
        );

        coordenadaSelecionada.textContent =
            `A coordenada informada foi aproximada para o centro da célula: ${centroLatitude}, ${centroLongitude}.`;

        casasRespondidas.set(chaveCelula, 'aproximada');
    }

    celula.disabled = true;

    fecharFormularioCoordenadas();
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
    casasRespondidas.clear();

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

    // Criar os rótulos de longitude da borda superior.
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

        rotuloEsquerdo.className = 'celula-eixo coordenada-borda-latitude';
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

        rotuloDireito.className = 'celula-eixo coordenada-borda-latitude';
        rotuloDireito.textContent = latitudeFormatada;

        tabuleiroGeografico.appendChild(rotuloDireito);
    }

    // Criar os rótulos de longitude da borda inferior.
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