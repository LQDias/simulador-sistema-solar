import './style.css';
import { Simulador2D } from './sim-2d/canvas2d.js';
import * as THREE from 'three';

const container3D = document.getElementById('canvas-3d-container');
const sliderDia = document.getElementById('slider-dia');
const btnPlay = document.getElementById('btn-play');
const txtData = document.getElementById('txt-data');
const txtNorte = document.getElementById('txt-norte');
const txtSul = document.getElementById('txt-sul');
const btnShortcuts = document.querySelectorAll('.btn-shortcut');
const txtExplicao = document.getElementById('txt-explicao');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(60, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container3D.clientWidth, container3D.clientHeight);
container3D.appendChild(renderer.domElement);

// --- OBJETOS ---
// Sol
const sunLight = new THREE.PointLight(0xffffff, 3, 100);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Terra e Eixo
const earthGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2233ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const earthGroup = new THREE.Group();
earthGroup.add(earth);
const axialTilt = 23.5 * (Math.PI / 180);
earthGroup.rotation.z = axialTilt;
scene.add(earthGroup);

// Órbita
const orbitRadius = 12;
const orbitPath = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitPath, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit);

// --- ESTADO DA SIMULAÇÃO ---
let diaAtual = parseInt(sliderDia.value); 
let estaAnimando = false;
let rotationSpeed = 0.02;

// --- SIMULADOR 2D ---
const simulador2D = new Simulador2D('canvas-2d-container');

// --- FUNÇÕES DE ATUALIZAÇÃO ---

function atualizarPosicaoTerra(dia) {
    const anguloOrbita = ((dia - 80) / 365) * Math.PI * 2; 

    earthGroup.position.x = Math.cos(anguloOrbita) * orbitRadius;
    earthGroup.position.z = Math.sin(anguloOrbita) * orbitRadius;
    
    // Atualiza o texto da interface
    atualizarTextosInterface(dia);
    simulador2D.desenhar(dia);
}

// Função para converter dia do ano em data e estação
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

// --- CONFIGURAÇÃO DOS EVENTOS ---

// Resposta do Slider
sliderDia.addEventListener('input', (event) => {
    estaAnimando = false;
    btnPlay.innerText = "Reproduzir";
    diaAtual = parseInt(event.target.value);
    atualizarPosicaoTerra(diaAtual);
});

// Resposta do Botão Play/Pause
btnPlay.addEventListener('click', () => {
    estaAnimando = !estaAnimando;
    btnPlay.innerText = estaAnimando ? "Pausar" : "Reproduzir";
});

// Resposta dos Botões de Atalho
btnShortcuts.forEach(button => {
    button.addEventListener('click', () => {
        estaAnimando = false;
        btnPlay.innerText = "Reproduzir";
        diaAtual = parseInt(button.getAttribute('data-day'));
        sliderDia.value = diaAtual;
        atualizarPosicaoTerra(diaAtual);
    });
});

// Ajuste de Tela
window.addEventListener('resize', () => {
    const width = container3D.clientWidth;
    const height = container3D.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// --- LOOP DE ANIMAÇÃO ---
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += rotationSpeed;

    if (estaAnimando) {
        diaAtual = (diaAtual + 0.1) % 365;
        sliderDia.value = diaAtual;
        atualizarPosicaoTerra(Math.floor(diaAtual));
    }

    renderer.render(scene, camera);
}

atualizarPosicaoTerra(diaAtual);
animate();