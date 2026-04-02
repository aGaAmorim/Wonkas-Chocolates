const senhaAdmin = "1234";
let cartas = [];
let cliques = 0;
let rodadasRestantes = 0;

const somVirar = new Audio("flip.mp3");
const somGanhou = new Audio("win.mp3");
const somPerdeu = new Audio("lose.mp3");

function gerarCartas() {
    //cartas = new Array(16).fill("🍫"); /* 16 cards */
    cartas = new Array(12).fill("🍫");
    //cartas = new Array(12).fill("ticket"); teste sucesso

    let chance = Math.random();

    let qtdTickets = 0;
    if (chance < 0.45) qtdTickets = 3;
    else if (chance < 0.85) qtdTickets = 2;
    else qtdTickets = 1;

    let posicoes = [];
    while (posicoes.length < qtdTickets) {
        //let rand = Math.floor(Math.random() * 16); /* 16 cards */
        let rand = Math.floor(Math.random() * 12);
        if (!posicoes.includes(rand)) posicoes.push(rand);
    }

    /*posicoes.forEach(i => cartas[i] = "🎟️");*/
    posicoes.forEach(i => cartas[i] = "ticket");
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
    
    somVirar.currentTime = 0;
    somVirar.play().catch(() => {});

    /*div.innerText = valor;*/
    if (valor === "ticket") {
    div.innerHTML = '<img src="ticket.png" class="img-card">';
    } else {
        div.innerText = "🍫";
    }
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
        /*if (el.innerText === "🎟️") tickets++;*/
        if (el.innerHTML.includes("ticket.png")) tickets++;
    });

    let msg = "";
    /*if (tickets === 3) msg = "🏆 Você arrasou! Ganhou um brownie!";*/
    if (tickets === 3) {
    msg = "🏆 PARABÉNS! Você encontrou o Golden Ticket!";

    somGanhou.play();
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
    else if (tickets === 2) msg = "🎉 Quase! Ganhou um presente da fábrica!";
    else if (tickets === 1) msg = "🍬 Você ganhou um mimo da fábrica!";
    else msg = "👀 Os chocolates mudaram de lugar… tente novamente!";

    document.getElementById("message").innerText = msg;
    setTimeout(() => {
    if (rodadasRestantes > 0) {
        iniciarRodada();
    } else {
        document.getElementById("message").innerText += " | Fim das rodadas!";
    }
}, 2000);
    if (tickets > 0) {
    somGanhou.play();
    } else {
    somPerdeu.play();
    }
}

function novaRodada() {
    document.getElementById("modalSenha").style.display = "flex";
}

function confirmarSenha() {
    let senha = document.getElementById("inputSenha").value;
    let qtd = parseInt(document.getElementById("qtdRodadas").value);

    if (senha !== senhaAdmin) {
        alert("Senha incorreta!");
        return;
    }

    if (!qtd || qtd <= 0) {
        alert("Digite uma quantidade válida!");
        return;
    }

    rodadasRestantes = qtd;

    document.getElementById("modalSenha").style.display = "none";
    document.getElementById("inputSenha").value = "";
    document.getElementById("qtdRodadas").value = "";

    iniciarRodada();
}

function iniciarRodada() {
    if (rodadasRestantes <= 0) {
        alert("Rodadas encerradas!");
        return;
    }

    gerarCartas();
    render();

    rodadasRestantes--;

    document.getElementById("message").innerText =
        "Rodadas restantes: " + rodadasRestantes;
}

window.onload = function() {
    gerarCartas();
    render();

    document.getElementById("inputSenha").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirmarSenha();
        }
    });
};
