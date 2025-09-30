const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultDisplay = document.getElementById('result');
const ctx = wheel.getContext('2d');

// Configure seus prêmios aqui!
const prizes = [
    { text: "15% CERTIFICADO", description: "15% DESCONTO CERTIFICADO ", color: "#fa000d"},
    { text: "MANUTENÇÃO GRÁTIS", description: "MANUTENÇÃO GRÁTIS - LIMPEZA", color: "#fcaf00" },
    { text: "10% CERTIFICADO", description: "DESCONTO DE 10% EM CERTIFICADO DIGITAL", color: "#ff421c" }, 
    { text: "PASSOU A VEZ", description: "NÃO FOI DESSA VEZ", color: "#868686ff" }, 
    { text: "10% MENSALIDADE", description: "DESCONTO 10% NA PRÓXIMA MENSALIDADE", color: "#FA000D" }, 
    { text: "LICENÇA GRÁTIS", description: "1 LICENÇA PERFECT SOLUTIONS", color: "#fcaf00" }, 
    { text: "?SURPRESA?", description: "IMPLANTAÇÃO PERFECT SOLUTIONS GRÁTIS", color: "#ff421c" }, 
    { text: "20% CERTIFICADO", description: "20% DESCONTO CERTIFICADO", color: "#FA000D" },
    { text: "PASSOU A VEZ", description: "NÃO FOI DESSA VEZ", color: "#868686ff" }, 
    { text: "GIRE NOVAMENTE", description: "GIRE NOVAMENTE", color: "#fcaf00" },

    
];

const numSegments = prizes.length;
const segmentAngle = 360 / numSegments;
const wheelRadius = wheel.width / 2;

let currentRotation = 0;
let isSpinning = false;

// Função para desenhar a roleta
function drawWheel() {
    const numSegments = prizes.length;
    const segmentAngle = 360 / numSegments;
    const wheelRadius = wheel.width / 2;

    ctx.clearRect(0, 0, wheel.width, wheel.height); // limpa

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * segmentAngle;
        const endAngle = (i + 1) * segmentAngle;

        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius - 2, // margem interna
                toRadians(startAngle), toRadians(endAngle));
        ctx.closePath();

        ctx.fillStyle = prizes[i].color;
        ctx.fill();

        // Adiciona uma borda branca entre as fatias para melhor visualização
        ctx.strokeStyle = "white"; 
        ctx.lineWidth = 6;
        ctx.stroke();

        // Desenhar o texto do prêmio (Lógica de alinhamento melhorada)
        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(toRadians(startAngle + segmentAngle / 2)); // Gira para a posição da fatia
        ctx.textAlign = "center"; // Centraliza o texto horizontalmente
        ctx.textBaseline = "middle"; // Centraliza o texto verticalmente
        
        ctx.fillStyle = "#000000ff"; // Uma cor escura e consistente para o texto
        ctx.font = "bold 18px Arial"; // Fonte um pouco maior e em negrito

        // Posiciona o texto a 60% do caminho para fora do centro
        ctx.fillText(prizes[i].text, wheelRadius * 0.54, 0); 
        ctx.restore();
    }
}


// Converte graus para radianos
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Função para girar a roleta
spinBtn.addEventListener('click', () => {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = "";

    const numSegments = prizes.length;
    const segmentAngle = 360 / numSegments;

    const randomDegrees = Math.floor(Math.random() * 360) + (360 * 5);
    currentRotation += randomDegrees;

    wheel.style.transition = 'transform 5s cubic-bezier(.08,.69,.19,.98)';
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    wheel.addEventListener('transitionend', () => {
        wheel.style.transition = 'none';

        const actualRotation = currentRotation % 360;
        wheel.style.transform = `rotate(${actualRotation}deg)`;

        // --- CORREÇÃO DEFINITIVA DO CÁLCULO ---
        // A fórmula agora compensa o desalinhamento de 90 graus entre o ponteiro (12h)
        // e o início do desenho (3h). O valor 270 representa essa correção.
        const winnerSegmentIndex = Math.floor(((270 - actualRotation + 360) % 360) / segmentAngle);

        resultDisplay.textContent = `Você ganhou: ${prizes[winnerSegmentIndex].description}!`;
        
        isSpinning = false;
        spinBtn.disabled = false;
    }, { once: true });
});

// Desenha a roleta pela primeira vez
drawWheel();