const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
const width = 15;
let currentShooterIndex = 202;
let direction = 1;
let invaderIntervalId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;


for (var i = 0; i < 225; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function drawInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}


function removeInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex--;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex++;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveAlienInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    removeInvaders();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            goingRight = false;
        }
        direction = -1;
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            goingRight = true;
        }
        direction = 1;
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;

    }

    drawInvaders();

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = "Game Over!!!";
        clearInterval(invaderIntervalId);
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length) {
            resultsDisplay.innerHTML = "Game Over!!!";
            clearInterval(invaderIntervalId);
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = "You Won!!! 👋";
        clearInterval(invaderIntervalId);
    }
}


function shoot(e) {
    let laserIntervalId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        if (currentLaserIndex <= 0) {
            clearInterval(laserIntervalId);
        }
        else {
            squares[currentLaserIndex].classList.add("laser");

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove("laser");
                squares[currentLaserIndex].classList.remove("invader");
                squares[currentLaserIndex].classList.add("boom");

                setTimeout(() => {
                    squares[currentLaserIndex].classList.remove("boom");
                }, 300);

                clearInterval(laserIntervalId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved);
                results++;
                resultsDisplay.innerHTML = 'Number of UFOs destroyed: ' + results + "/" + alienInvaders.length;
            }
        }
    }

    switch (e.key) {
        case ' ':
            laserIntervalId = setInterval(moveLaser, 100)
    }
}

drawInvaders();
invaderIntervalId = setInterval(moveAlienInvaders, 700);
document.addEventListener('keydown', shoot);