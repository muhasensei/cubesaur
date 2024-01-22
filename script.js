const player = document.getElementById('player');
const game = document.getElementById('game');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const resultText = document.getElementById('resultText');
const attemptsText = document.getElementById('attempts');

const MAX_GAME_DURATION = 300000; // 5 mins
const SPAWNING_INTERVAL = 3000;

let attempts = 0;

const startGame = () => {
    attempts++;
    const startTime = new Date().getTime();
    attemptsText.textContent = `Attempt: ${attempts}`;
    startBtn.style.visibility = 'hidden';
    document.querySelectorAll('.block').forEach((block) => block.remove());
    resultText.style.visibility = 'hidden';
    resultText.textContent = '';

    const stopGame = () => {
        console.log('CALLED')
        startBtn.style.visibility = 'visible';
        startBtn.textContent = 'Restart Game';

        const allBlocks = document.querySelectorAll('.block');
        allBlocks.forEach((block) => {
            block.style.animationPlayState = 'paused';
        })

        const duration = new Date().getTime() - startTime;

        resultText.style.visibility = 'visible';
        resultText.className = 'title-red';

        if (duration > 100000) {
            resultText.className = 'title-success';
            resultText.textContent = `Great game! You managed to last ${new Date().getTime() - startTime} ms`;
        } else if (duration > 30000) {
            resultText.textContent = `Nice try. You lasted ${new Date().getTime() - startTime} ms`;
        } else {
            resultText.textContent = `You lost. You lasted ${new Date().getTime() - startTime} ms`;
        }
    }

    window.addEventListener('keyup', (event) => {
        if (
            event.key === 'ArrowUp' ||
            event.code === 'ArrowUp' ||
            event.code === 'Space' ||
            event.key === '(blank space)'
        ) {
            player.classList.add('jump');
            player.addEventListener('animationend', () => {
                player.classList.remove('jump');
            })
        }
    })

    const spawning = setInterval(() => {
        const block = document.createElement('div');
        block.className = 'block block-sm';
        game.appendChild(block);

        const checkIfBlockIsTouched = setInterval(() => {
            const playerPosition = player.getBoundingClientRect();
            const blockPosition = block.getBoundingClientRect();

            if (
                blockPosition.left !== 0 &&
                blockPosition.top !== 0 &&
                playerPosition.right > blockPosition.left &&
                playerPosition.bottom > blockPosition.top
            ) {
                clearInterval(checkIfBlockIsTouched);
                clearInterval(spawning);
                block.remove();
                stopGame();
            } else {
                block.addEventListener('animationend', () => {
                    if (game.contains(block)) {
                        game.removeChild(block);
                    }
                    clearInterval(checkIfBlockIsTouched);
                })
            }
        }, 100);

    }, SPAWNING_INTERVAL);

    setTimeout(() => clearInterval(spawning), MAX_GAME_DURATION);
}



startBtn.addEventListener('click', () => startGame())

