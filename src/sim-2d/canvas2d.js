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
        this.height = this.container.clientHeight || 250;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    desenhar(dia) {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const raioTerra = 60;

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.lineWidth = 2;
        for (let i = -raioTerra; i <= raioTerra; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, cy + i);
            ctx.lineTo(cx - 10, cy + i);
            ctx.stroke();
        }

        const anguloOrbita = ((dia - 80) / 365) * Math.PI * 2;
        const inclinacaoEixo = 23.5 * (Math.PI / 180);
        
        const fatorLuz = Math.sin(anguloOrbita) * inclinacaoEixo;

        ctx.beginPath();
        ctx.arc(cx, cy, raioTerra, 0, Math.PI * 2);
        ctx.fillStyle = '#112244';
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, raioTerra, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        // Cria uma máscara para o lado iluminado
        ctx.amberLuz = cx + (Math.sin(anguloOrbita) * raioTerra * Math.sin(inclinacaoEixo));
        
        // Desenha a metade esquerda iluminada ajustando pela inclinação estacional
        ctx.moveTo(cx, cy - raioTerra * 2);
        ctx.bezierCurveTo(
            cx - raioTerra * 2 * fatorLuz, cy - raioTerra,
            cx - raioTerra * 2 * fatorLuz, cy + raioTerra,
            cx, cy + raioTerra * 2
        );
        ctx.lineTo(0, cy + raioTerra * 2);
        ctx.lineTo(0, cy - raioTerra * 2);
        ctx.closePath();
        ctx.fillStyle = '#3366cc';
        ctx.fill();
        ctx.restore();

        // 5. DESENHAR O EIXO DE ROTAÇÃO
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(inclinacaoEixo); // O eixo físico é estático em 23.5°

        // Linha do Eixo
        ctx.strokeStyle = '#ff5555';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, -raioTerra - 20);
        ctx.lineTo(0, raioTerra + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Textos dos Polos
        ctx.fillStyle = '#ff5555';
        ctx.font = '10px sans-serif';
        ctx.fillText('N', -4, -raioTerra - 25);
        ctx.fillText('S', -4, raioTerra + 32);

        // Linha do Equador
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-raioTerra - 5, 0);
        ctx.lineTo(raioTerra + 5, 0);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.fillText('Equador', raioTerra + 10, 4);

        ctx.restore();
    }
}