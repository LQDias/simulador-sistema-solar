import * as THREE from 'three';

export class Cenario3D {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        this.configurarIluminacao();
        this.criarElementosEstaticos();

        window.addEventListener('resize', () => this.resize());
    }

    configurarIluminacao() {
        const sunLight = new THREE.PointLight(0xffffff, 3, 100);
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
    }

    criarElementosEstaticos() {
        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);

        const orbitRadius = 12;
        const orbitPath = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
        const orbit = new THREE.Mesh(orbitPath, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        this.scene.add(orbit);
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}