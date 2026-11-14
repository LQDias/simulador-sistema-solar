import './style.css';
import { Cenario3D } from './sim-3d/scene.js';
import { Terra3D } from './sim-3d/earth.js';
import { Simulador2D } from './sim-2d/canvas2d.js';
import {ANO_REFERENCIA, DIAS_NO_ANO, EVENTOS} from './utils/astronomy.js';

const container3D = document.getElementById('canvas-3d-container');
const sliderDia = document.getElementById('slider-dia');
const btnPlay = document.getElementById('btn-play');
const txtData = document.getElementById('txt-data');
const txtNorte = document.getElementById('txt-norte');
const txtSul = document.getElementById('txt-sul');
const txtExplicao = document.getElementById('txt-explicao');
const btnShortcuts = document.querySelectorAll('.btn-shortcut');

const cenario = new Cenario3D(container3D);
const terra = new Terra3D(cenario.scene, 12);
const simulador2D = new Simulador2D('canvas-2d-container');

let diaAtual = parseInt(sliderDia.value); 
let estaAnimando = false;
const rotationSpeed = 0.02;

function atualizarSimulacao(dia) {
    terra.atualizar(dia, rotationSpeed);
    simulador2D.desenhar(dia);
    atualizarTextosInterface(dia);
}

function atualizarTextosInterface(dia) {
    const diaInteiro = Math.floor(dia);
    const data = new Date(ANO_REFERENCIA, 0, diaInteiro + 1);

    txtData.innerText = data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long'
    });

    let estacaoNorte;
    let estacaoSul;
    let explicacao;

    // Estações do ano
    if (diaInteiro < EVENTOS.equinocioMarco) {
        estacaoNorte = 'Inverno';
        estacaoSul = 'Verão';
        explicacao = 'O Hemisfério Sul está inclinado em direção ao Sol, enquanto o Hemisfério Norte está inclinado para longe dele.';
    } else if (diaInteiro < EVENTOS.solsticioJunho) {
        estacaoNorte = 'Primavera';
        estacaoSul = 'Outono';
        explicacao = 'Após o equinócio de março, o Hemisfério Norte passa a se inclinar progressivamente em direção ao Sol.';
    } else if (diaInteiro < EVENTOS.equinocioSetembro) {
        estacaoNorte = 'Verão';
        estacaoSul = 'Inverno';
        explicacao = 'O Hemisfério Norte permanece inclinado em direção ao Sol, recebendo maior duração de luz durante o dia.';
    } else if (diaInteiro < EVENTOS.solsticioDezembro) {
        estacaoNorte = 'Outono';
        estacaoSul = 'Primavera';
        explicacao = 'Após o equinócio de setembro, o Hemisfério Norte passa a se inclinar progressivamente para longe do Sol.';
    } else {
        estacaoNorte = 'Inverno';
        estacaoSul = 'Verão';
        explicacao = 'O Hemisfério Sul permanece inclinado em direção ao Sol, enquanto o Hemisfério Norte fica inclinado para longe dele.';
    }

    // Períodos de destaque dos eventos astronômicos
    const periodosEventos = [
        {
            inicio: 68,  // 10 de março
            fim: 88,     // 30 de março
            texto: 'Estamos próximos ao equinócio de março. O Sol cruza o equador celeste em direção ao norte, marcando o início da primavera astronômica no Hemisfério Norte e do outono no Sul.'
        },
        {
            inicio: 161, // 11 de junho
            fim: 181,    // 1º de julho
            texto: 'Estamos próximos ao solstício de junho. O Hemisfério Norte apresenta sua maior inclinação em direção ao Sol, recebendo os dias mais longos do ano, enquanto o Hemisfério Sul apresenta os mais curtos.'
        },
        {
            inicio: 255, // 13 de setembro
            fim: 275,    // 3 de outubro
            texto: 'Estamos próximos ao equinócio de setembro. O Sol cruza o equador celeste em direção ao sul, marcando o início do outono astronômico no Hemisfério Norte e da primavera no Sul.'
        },
        {
            inicio: 345, // 12 de dezembro
            fim: 364,    // 31 de dezembro
            texto: 'Estamos próximos ao solstício de dezembro. O Hemisfério Sul apresenta sua maior inclinação em direção ao Sol, recebendo os dias mais longos do ano, enquanto o Hemisfério Norte apresenta os mais curtos.'
        }
    ];

    const eventoAtual = periodosEventos.find(evento =>
        diaInteiro >= evento.inicio &&
        diaInteiro <= evento.fim
    );

    txtNorte.innerText = estacaoNorte;
    txtSul.innerText = estacaoSul;
    txtExplicao.innerText = eventoAtual?.texto ?? explicacao;
}

sliderDia.addEventListener('input', (event) => {
    estaAnimando = false;
    btnPlay.innerText = "Reproduzir";
    diaAtual = parseInt(event.target.value);
    atualizarSimulacao(diaAtual);
});

btnPlay.addEventListener('click', () => {
    estaAnimando = !estaAnimando;
    btnPlay.innerText = estaAnimando ? "Pausar" : "Reproduzir";
});

btnShortcuts.forEach(button => {
    button.addEventListener('click', () => {
        estaAnimando = false;
        btnPlay.innerText = "Reproduzir";
        diaAtual = parseInt(button.getAttribute('data-day'));
        sliderDia.value = diaAtual;
        atualizarSimulacao(diaAtual);
    });
});

function animate() {
    requestAnimationFrame(animate);

    if (estaAnimando) {
        diaAtual = (diaAtual + 0.1) % DIAS_NO_ANO;
        sliderDia.value = diaAtual;
        atualizarSimulacao(Math.floor(diaAtual));
    } else {
        terra.atualizar(diaAtual, rotationSpeed);
    }

    cenario.render();
}

atualizarSimulacao(diaAtual);
animate();