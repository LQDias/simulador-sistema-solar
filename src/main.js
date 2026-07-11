import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sunLight = new THREE.PointLight(0xffffff, 3, 100);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Basic não precisa de luz externa para brilhar
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const earthGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2233ff, 
    wireframe: false 
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

const earthGroup = new THREE.Group();
earthGroup.add(earth);

// 23.5 graus convertidos para radianos
const axialTilt = 23.5 * (Math.PI / 180);
earthGroup.rotation.z = axialTilt;
scene.add(earthGroup);

const orbitRadius = 12;
const orbitPath = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
const orbit = new THREE.Mesh(orbitPath, orbitMaterial);
orbit.rotation.x = Math.PI / 2;
scene.add(orbit);

let orbitAngle = 0;
const orbitSpeed = 0.005;
const rotationSpeed = 0.02;

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += rotationSpeed;

    orbitAngle += orbitSpeed;
    
    earthGroup.position.x = Math.cos(orbitAngle) * orbitRadius;
    earthGroup.position.z = Math.sin(orbitAngle) * orbitRadius;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();