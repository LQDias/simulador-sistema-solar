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

    let explicacao;

    // Estações do Hemisfério Norte e suas correspondentes no Sul.
    if (
        diaInteiro >= EVENTOS.equinocioMarco &&
        diaInteiro < EVENTOS.solsticioJunho
    ) {
        txtNorte.innerText = 'Primavera';
        txtSul.innerText = 'Outono';

        explicacao =
            'Após o equinócio de março, o Hemisfério Norte passa a se inclinar progressivamente em direção ao Sol, enquanto o Hemisfério Sul se inclina para o lado oposto.';
    } else if (
        diaInteiro >= EVENTOS.solsticioJunho &&
        diaInteiro < EVENTOS.equinocioSetembro
    ) {
        txtNorte.innerText = 'Verão';
        txtSul.innerText = 'Inverno';

        explicacao =
            'O Hemisfério Norte permanece inclinado em direção ao Sol, recebendo maior duração de luz durante o dia. Próximo ao solstício, pode ocorrer o Sol da Meia-Noite nas regiões ao norte do Círculo Polar Ártico.';
    } else if (
        diaInteiro >= EVENTOS.equinocioSetembro &&
        diaInteiro < EVENTOS.solsticioDezembro
    ) {
        txtNorte.innerText = 'Outono';
        txtSul.innerText = 'Primavera';

        explicacao =
            'Após o equinócio de setembro, o Hemisfério Norte passa a se inclinar progressivamente para longe do Sol, enquanto o Hemisfério Sul se inclina em sua direção.';
    } else {
        txtNorte.innerText = 'Inverno';
        txtSul.innerText = 'Verão';

        explicacao =
            'O Hemisfério Sul permanece inclinado em direção ao Sol, enquanto o Hemisfério Norte fica inclinado para longe dele. Nas regiões ao sul do Círculo Polar Antártico pode ocorrer o Sol da Meia-Noite próximo ao solstício.';
    }

    // Destaque dos quatro eventos astronômicos.
    const eventosDoDia = {
        [EVENTOS.equinocioMarco]:
            'Equinócio de março: o Sol cruza o equador celeste em direção ao norte. Marca o início da primavera astronômica no Hemisfério Norte e do outono no Sul.',

        [EVENTOS.solsticioJunho]:
            'Solstício de junho: o Hemisfério Norte apresenta sua maior inclinação em direção ao Sol, enquanto o Hemisfério Sul apresenta sua maior inclinação para longe dele.',

        [EVENTOS.equinocioSetembro]:
            'Equinócio de setembro: o Sol cruza o equador celeste em direção ao sul. Marca o início do outono astronômico no Hemisfério Norte e da primavera no Sul.',

        [EVENTOS.solsticioDezembro]:
            'Solstício de dezembro: o Hemisfério Sul apresenta sua maior inclinação em direção ao Sol, enquanto o Hemisfério Norte apresenta sua maior inclinação para longe dele.'
    };

    txtExplicao.innerText =
        eventosDoDia[diaInteiro] || explicacao;
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