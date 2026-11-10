export class SorteioTurma {
    constructor(quantidadeAlunos) {
        if (
            !Number.isSafeInteger(quantidadeAlunos) ||
            quantidadeAlunos < 1
        ) {
            throw new Error(
                'A quantidade de alunos deve ser um inteiro positivo.'
            );
        }

        this.quantidadeAlunos = quantidadeAlunos;

        this.disponiveis = Array.from(
            { length: quantidadeAlunos },
            (_, indice) => indice + 1
        );

        this.jaJogaram = [];
        this.ausentes = [];
        this.historico = [];
        this.alunoAtual = null;
        this.ciclo = 1;
    }

    sortearAluno() {
        if (this.alunoAtual !== null) {
            throw new Error(
                'Confirme a presença ou marque o aluno atual como ausente.'
            );
        }

        let cicloReiniciado = false;

        if (this.disponiveis.length === 0) {
            this.iniciarNovoCiclo();
            cicloReiniciado = true;
        }

        const indice = Math.floor(
            Math.random() * this.disponiveis.length
        );

        this.alunoAtual = this.disponiveis.splice(indice, 1)[0];

        this.historico.unshift({
            numero: this.alunoAtual,
            ciclo: this.ciclo,
            status: 'aguardando'
        });

        return {
            numero: this.alunoAtual,
            ciclo: this.ciclo,
            cicloReiniciado
        };
    }

    confirmarPresenca() {
        if (this.alunoAtual === null) {
            throw new Error('Não há aluno sorteado para confirmar.');
        }

        const numero = this.alunoAtual;

        this.jaJogaram.push(numero);
        this.atualizarStatusHistorico('participou');
        this.alunoAtual = null;

        return numero;
    }

    marcarAusente() {
        if (this.alunoAtual === null) {
            throw new Error('Não há aluno sorteado para marcar como ausente.');
        }

        const numero = this.alunoAtual;

        this.ausentes.push(numero);
        this.atualizarStatusHistorico('ausente');
        this.alunoAtual = null;

        return numero;
    }

    iniciarNovoCiclo() {
        this.ciclo++;

        this.disponiveis = Array.from(
            { length: this.quantidadeAlunos },
            (_, indice) => indice + 1
        );

        this.jaJogaram = [];
        this.ausentes = [];
    }

    atualizarStatusHistorico(status) {
        const registro = this.historico.find(
            (item) =>
                item.ciclo === this.ciclo &&
                item.numero === this.alunoAtual &&
                item.status === 'aguardando'
        );

        if (registro) {
            registro.status = status;
        }
    }

    obterResumo() {
        return {
            total: this.quantidadeAlunos,
            jaJogaram: this.jaJogaram.length,
            disponiveis: this.disponiveis.length,
            ausentes: this.ausentes.length,
            ciclo: this.ciclo,
            alunoAtual: this.alunoAtual
        };
    }
}