const senhaAdmin = "1234";
let cartas = [];
let cliques = 0;

function gerarCartas() {
    cartas = new Array(16).fill("🍫");

    let chance = Math.random();

    let qtdTickets = 0;
    if (chance < 0.25) qtdTickets = 3;
    else if (chance < 0.6) qtdTickets = 2;
    else if (chance < 0.9) qtdTickets = 1;
    else qtdTickets = 0;

    let posicoes = [];
    while (posicoes.length < qtdTickets) {
        let rand = Math.floor(Math.random() * 16);
        if (!posicoes.includes(rand)) posicoes.push(rand);
    }

    posicoes.forEach(i => cartas[i] = "🎟️");
}

function render() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    cliques = 0;
    document.getElementById("message").innerText = "";

    cartas.forEach((item) => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerText = "?";

        div.onclick = () => revelar(div, item);

        grid.appendChild(div);
    });
}

function revelar(div, valor) {
    if (div.classList.contains("revealed") || cliques >= 3) return;

    div.innerText = valor;
    div.classList.add("revealed");
    cliques++;

    if (cliques === 3) {
        verificarResultado();
    }
}

function verificarResultado() {
    let revelados = document.querySelectorAll(".revealed");
    let tickets = 0;

    revelados.forEach(el => {
        if (el.innerText === "🎟️") tickets++;
    });

    let msg = "";
    if (tickets === 3) msg = "🏆 Você arrasou! Ganhou um brownie!";
    else if (tickets === 2) msg = "🎉 Quase! Ganhou um presente da fábrica!";
    else if (tickets === 1) msg = "🍬 Você ganhou um mimo da fábrica!";
    else msg = "👀 Os chocolates mudaram de lugar… tente novamente!";

    document.getElementById("message").innerText = msg;
}

function novaRodada() {
    document.getElementById("modalSenha").style.display = "flex";
}

function confirmarSenha() {
    let senha = document.getElementById("inputSenha").value;

    if (senha !== senhaAdmin) {
        alert("Senha incorreta!");
        return;
    }

    document.getElementById("modalSenha").style.display = "none";
    document.getElementById("inputSenha").value = "";

    gerarCartas();
    render();
}

// iniciar
gerarCartas();
render();
