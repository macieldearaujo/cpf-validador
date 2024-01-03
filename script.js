const readCPF = document.querySelector('.input-cpf');
const button = document.querySelector('.input-button');
const alertMessage = document.querySelector('.alert-message');

button.addEventListener('click', () => {
    readCPF.focus();
    const cleanCPF = readCPF.value.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return alertMessage.style.display = 'block';
    const cpf = new ValidaCpf(readCPF.value);
    cpf.valida(readCPF.value);
});

document.addEventListener('keydown', (event) => {
    readCPF.focus();
    const cleanCPF = readCPF.value.replace(/\D/g, '');
    alertMessage.style.display = 'none';

    if(event.key === 'Enter') {
    if (cleanCPF.length !== 11) return alertMessage.style.display = 'block';
    const cpf = new ValidaCpf(readCPF.value);
    cpf.valida(readCPF.value);
    }
});

function ValidaCpf(cpfEnviado) {
    Object.defineProperty(this, 'cpfLimpo', {
        enumerable: true,
        get: function() {
            return cpfEnviado.replace(/\D+/g, '');
        }
    })     
}

ValidaCpf.prototype.valida = function() {
    this.removerResultado();

    if(typeof this.cpfLimpo  === 'undefined') return false;
    if(this.cpfLimpo.length !== 11) return false;
    if(this.isSequencia()) return false;
    
    const cpfParcial = this.cpfLimpo.slice(0, -2);
    const primeiroDigitoEnviado = Array.from(this.cpfLimpo[9]);
    const primeiroDigito = this.criaDigito(cpfParcial);
    
    if(Number(primeiroDigitoEnviado) !== primeiroDigito) {
        this.cpfInvalido();
        return false;
    };

    const segundoDigitoEnviado = Array.from(this.cpfLimpo[10]);
    const segundoDigito = this.criaDigito(cpfParcial + primeiroDigitoEnviado);

    if(Number(segundoDigitoEnviado) !== segundoDigito) {
        this.cpfInvalido();
        return false;
    };
    
    const novoCPF = cpfParcial + primeiroDigito + segundoDigito;

    this.cpfValido();
    return this.cpfLimpo === novoCPF;
}

ValidaCpf.prototype.criaDigito = function(cpfParcial) {
    let cpfEnviado = Array.from(cpfParcial);
    let regressivo = cpfEnviado.length + 1;
    const total = cpfEnviado.reduce((acum, item) => {
        acum += (regressivo * Number(item));
        regressivo--;
        return acum;
    }, 0);

    const digito = 11 - (total % 11);
    return digito > 9 ? 0 : digito;
}

ValidaCpf.prototype.isSequencia = function() {
    const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
    return sequencia === this.cpfLimpo;
}

ValidaCpf.prototype.cpfValido = function cpfValido() {
    const criarParagrafo = document.createElement('p');
    criarParagrafo.classList.add('cpf-valid');
    const div = document.querySelector('.result-cpf');
    criarParagrafo.textContent = `O CPF ${this.cpfLimpo} é válido`;
    div.appendChild(criarParagrafo);
}

ValidaCpf.prototype.cpfInvalido = function () {
    const criarParagrafo = document.createElement('p');
    criarParagrafo.classList.add('cpf-invalid');
    const div = document.querySelector('.result-cpf');
    criarParagrafo.textContent = `O CPF ${this.cpfLimpo} é inválido`;
    div.appendChild(criarParagrafo);
}

ValidaCpf.prototype.removerResultado = function() {
    const div = document.querySelector('.result-cpf');
    div.innerHTML = '';
}