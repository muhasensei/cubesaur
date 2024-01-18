const player = document.getElementById('player');
const game = document.getElementById('game');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');

const MAX_GAME_DURATION = 300000; // 5 mins
const SPAWNING_INTERVAL = 3000;

const startGame = () => {
    const startTime = new Date().getTime();
    // clear blocks before start
    document.querySelectorAll('.block').forEach((block) => block.remove())


    const stopGame = () => {
        clearInterval(spawning);
        startBtn.style.visibility = 'visible';
        startBtn.textContent = 'Restart Game';

        const allBlocks = document.querySelectorAll('.block');
        allBlocks.forEach((block) => {
            block.style.animationPlayState = 'paused';
        })

        const duration = new Date().getTime() - startTime;

        const loserText = document.createElement('h1');
        loserText.className = 'title-red';

        if (duration > 100000) {
            loserText.className = 'title-success';
            loserText.textContent = `Great game! You managed to last ${new Date().getTime() - startTime} ms`;
        } else if (duration > 30000) {
            loserText.textContent = `Nice try. You lasted ${new Date().getTime() - startTime} ms`;
        } else {
            loserText.textContent = `You lost. You lasted ${new Date().getTime() - startTime} ms`;
        }

        result.appendChild(loserText);
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

            if (playerPosition.right > blockPosition.left && playerPosition.bottom > blockPosition.top) {
                clearInterval(checkIfBlockIsTouched);
                stopGame();
            } else {
                block.addEventListener('animationend', () => {
                    game.removeChild(block);
                    clearInterval(checkIfBlockIsTouched);
                })
            }
        }, 100);

    }, SPAWNING_INTERVAL);


    setTimeout(() => {
        clearInterval(spawning);
        alert('Please do something useful...');
    }, MAX_GAME_DURATION);
}



startBtn.addEventListener('click', () => {
    startBtn.style.visibility = 'hidden';
    startGame();
})
