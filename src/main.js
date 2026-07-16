import './style.css';
import { Cenario3D } from './sim-3d/scene.js';
import { Terra3D } from './sim-3d/earth.js';
import { Simulador2D } from './sim-2d/canvas2d.js';

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
    const dataBase = new Date(2023, 0, 1);
    dataBase.setDate(dia + 1);
    const opcoes = { day: 'numeric', month: 'long' };
    txtData.innerText = dataBase.toLocaleDateString('pt-BR', opcoes);

    if (dia >= 80 && dia < 172) {
        txtNorte.innerText = "Primavera"; txtSul.innerText = "Outono";
        txtExplicao.innerText = "O Hemisfério Norte está se inclinando gradualmente em direção ao Sol. Os dias começam a ficar mais longos por lá.";
    } else if (dia >= 172 && dia < 264) {
        txtNorte.innerText = "Verão"; txtSul.innerText = "Inverno";
        txtExplicao.innerText = "Solstício de Junho. O Polo Norte está no seu ápice de inclinação para o Sol. É o dia mais longo do ano no Norte (Sol da Meia-Noite) e a noite mais longa no Sul.";
    } else if (dia >= 264 && dia < 355) {
        txtNorte.innerText = "Outono"; txtSul.innerText = "Primavera";
        txtExplicao.innerText = "O Hemisfério Sul começa a receber mais luz direta. As temperaturas começam a subir abaixo da linha do Equador.";
    } else {
        txtNorte.innerText = "Inverno"; txtSul.innerText = "Verão";
        txtExplicao.innerText = "Solstício de Dezembro. O Polo Sul está totalmente voltado para o Sol. Verão escaldante no Sul com dias longos, e frio com noites longas no Norte.";
    }
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
        diaAtual = (diaAtual + 0.1) % 365;
        sliderDia.value = diaAtual;
        atualizarSimulacao(Math.floor(diaAtual));
    } else {
        terra.atualizar(diaAtual, rotationSpeed);
    }

    cenario.render();
}

atualizarSimulacao(diaAtual);
animate();