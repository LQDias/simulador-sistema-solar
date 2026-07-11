export class Simulador2D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight || 200; 
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    desenhar(dia) {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const raioTerra = 60;

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 2;
        for (let i = -raioTerra; i <= raioTerra; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, cy + i);
            ctx.lineTo(cx - 10, cy + i);
            ctx.stroke();
        }

        // Ângulo da órbita (0 no equinócio de março)
        const anguloOrbita = ((dia - 80) / 365) * Math.PI * 2;
        const inclinacaoMaxima = 23.5 * (Math.PI / 180);
        
        // No solstício de junho (PI/2), inclina o Norte para a esquerda
        const inclinacaoVisualEixo = -Math.sin(anguloOrbita) * inclinacaoMaxima;

        ctx.beginPath();
        ctx.arc(cx, cy, raioTerra, 0, Math.PI * 2);
        ctx.fillStyle = '#111a2e'; 
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, raioTerra, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        ctx.arc(cx, cy, raioTerra, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.fillStyle = '#2b5cb8';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(inclinacaoVisualEixo);

        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, -raioTerra - 8);
        ctx.lineTo(0, raioTerra + 8);
        ctx.stroke();
        ctx.setLineDash([]); 

        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('N', -5, -raioTerra - 20);
        ctx.fillText('S', -5, raioTerra + 28);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-raioTerra - 5, 0);
        ctx.lineTo(raioTerra + 5, 0);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText('Equador', raioTerra + 8, 4);

        ctx.restore();
    }
}