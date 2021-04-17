let player1Wins = 0
let player2Wins = 0
let player1Name = document.getElementById('playerLeftName').textContent
let player2Name = document.getElementById('playerRightName').textContent
let gameMode = document.getElementById('modeNum').textContent

const TIME_BY_MODE = {
    'difficulty 1': 15,

    'difficulty 2': 12,

    'difficulty 3': 10,

    'difficulty 4': 8,

    'difficulty 5': 6
}

window.onload = () => {
    document.getElementById('modeNum').textContent = 'difficulty ' + document.getElementById('mode').value
}

document.getElementById('mode').addEventListener('change', (event) => {
    document.getElementById('modeNum').textContent = 'difficulty ' + event.target.value
})

const showInput = (opt) => {
    const input = opt === 0 ? document.getElementById('leftInput') : document.getElementById('rightInput')
    input.classList.toggle('hideInput')
}

const changeName = (event, opt) => {
    event.preventDefault()
    const input = opt === 0 ? document.getElementById('leftInput') : document.getElementById('rightInput')
    const name = opt === 0 ? document.getElementById('playerLeftName') : document.getElementById('playerRightName')
    name.textContent = input.value !== '' ? input.value : name.textContent
    showInput(opt)
}

const handleStart = () => {
    document.getElementById('menu').classList.toggle("hideMenu")
    setTimeout(() => {
        player1Name = document.getElementById('playerLeftName').textContent
        player2Name = document.getElementById('playerRightName').textContent
        document.getElementById('bar1').textContent = document.getElementById('playerLeftName').textContent
        document.getElementById('bar2').textContent = document.getElementById('playerRightName').textContent
        gameMode = document.getElementById('modeNum').textContent
        document.getElementById('menu').style.display = 'none'
        document.getElementById('pong').style.display = 'block'
        game()
    }, 1800)
}

const game = function () {
    let barPlayer1 = document.getElementById('bar1')
    let barPlayer2 = document.getElementById('bar2')
    let gameBall = document.getElementById('ball')

    let time = TIME_BY_MODE[gameMode]
    let movement = 7;
    let movementBar = 10;
    let width = document.documentElement.clientWidth - movement;
    let height = document.documentElement.clientHeight - movement;

    let controlGame;
    let player1;
    let player2;

    let winner = null;

    const start = () => {
        init()
        controlGame = setInterval(play, time)
    }

    const init = () => {
        let widthRandom = Math.random() * 95
        let heightRandom = Math.random() * 100
        gameBall.style.left = widthRandom + '%'
        gameBall.style.top = heightRandom + '%'
        gameBall.state = widthRandom < 50 ? 1 : 3
        gameBall.direction = widthRandom < 50 ? 1 : 2 // right 1, left 2

        player1 = {
            keyPress: false,
            key: null
        }

        player2 = {
            keyPress: false,
            key: null
        }
    }

    const stop = () => {
        clearInterval(controlGame)
        document.body.style.background = 'red'
        document.getElementById('roundWinner').textContent = winner == 0 ? player1Name + ' wins' : player2Name + ' wins'
        document.getElementById('roundResult').style.display = 'flex'

        setTimeout(() => {
            if (winner === 0) {
                player1Wins++
            }
            else {
                player2Wins++
            }
            document.getElementById('playerLeftScore').textContent = player1Wins
            document.getElementById('playerRightScore').textContent = player2Wins

            document.body.style.background = 'black'
            document.getElementById('roundResult').style.display = 'none'
            document.getElementById('menu').classList.toggle("hideMenu")
            document.getElementById('menu').style.display = 'flex'
            document.getElementById('pong').style.display = 'none'

        }, 3000)
    }

    const play = () => {
        moveBall()
        moveBar()
        checkIfLost()
    }

    const checkIfLost = () => {
        if (gameBall.offsetLeft >= width) {
            winner = 0
            stop()
        }
        if (gameBall.offsetLeft <= 0) {
            winner = 1
            stop()
        }
    }

    // Ball stuff
    const moveBall = () => {
        checkStateBall()
        switch (gameBall.state) {
            case 1: // right down
                gameBall.style.left = (gameBall.offsetLeft + movement) + 'px'
                gameBall.style.top = (gameBall.offsetTop + movement) + 'px'
                break
            case 2: // right up
                gameBall.style.left = (gameBall.offsetLeft + movement) + 'px'
                gameBall.style.top = (gameBall.offsetTop - movement) + 'px'
                break
            case 3: // left down
                gameBall.style.left = (gameBall.offsetLeft - movement) + 'px'
                gameBall.style.top = (gameBall.offsetTop + movement) + 'px'
                break
            case 4: // left up
                gameBall.style.left = (gameBall.offsetLeft - movement) + 'px'
                gameBall.style.top = (gameBall.offsetTop - movement) + 'px'
                break
        }
    }

    const checkStateBall = () => {
        if (collidePlayer2()) {
            gameBall.direction = 2
            if (gameBall.state === 1) {
                gameBall.state = 3
            }
            if (gameBall.state === 2) {
                gameBall.state = 4
            }
        }
        else if (collidePlayer1()) {
            gameBall.direction = 1
            if (gameBall.state === 3) {
                gameBall.state = 1
            }
            if (gameBall.state === 4) {
                gameBall.state = 2
            }
        }
        ballMechanics()
    }

    const ballMechanics = () => {
        if (gameBall.direction === 1) {
            if (gameBall.offsetTop >= height) {
                gameBall.state = 2
            }
            else if (gameBall.offsetTop <= 0) {
                gameBall.state = 1
            }
        } else {
            if (gameBall.offsetTop >= height) {
                gameBall.state = 4
            }
            if (gameBall.offsetTop <= 0) {
                gameBall.state = 3
            }
        }
    }

    // game logic
    const collidePlayer1 = () => {
        if (gameBall.offsetLeft <= (barPlayer1.clientWidth) &&
            gameBall.offsetTop >= barPlayer1.offsetTop &&
            gameBall.offsetTop <= (barPlayer1.offsetTop + barPlayer1.clientHeight)) {
            return true;
        }
        return false
    }

    const collidePlayer2 = () => {
        if (gameBall.offsetLeft >= (width - barPlayer2.clientWidth) &&
            gameBall.offsetTop >= barPlayer2.offsetTop &&
            gameBall.offsetTop <= (barPlayer2.offsetTop + barPlayer2.clientHeight)) {
            return true;
        }
        return false
    }

    // Movement and key detection
    const moveBar = () => {
        if (player1.keyPress) {
            if (player1.key == 'KeyQ' && barPlayer1.offsetTop >= 0)
                barPlayer1.style.top = (barPlayer1.offsetTop - movementBar) + "px";
            if (player1.key == 'KeyA' && (barPlayer1.offsetTop + barPlayer1.clientHeight) <= height)
                barPlayer1.style.top = (barPlayer1.offsetTop + movementBar) + "px";

        }
        if (player2.keyPress) {
            if (player2.key == 'KeyO' && barPlayer2.offsetTop >= 0)
                barPlayer2.style.top = (barPlayer2.offsetTop - movementBar) + "px";
            if (player2.key == 'KeyL' && (barPlayer2.offsetTop + barPlayer2.clientHeight) <= height)
                barPlayer2.style.top = (barPlayer2.offsetTop + movementBar) + "px";
        }
    }

    document.onkeydown = (e) => {
        e = e || window.event
        switch (e.code) {
            case 'KeyQ':
            case 'KeyA':
                player1.key = e.code
                player1.keyPress = true
                break;
            case 'KeyO':
            case 'KeyL':
                player2.key = e.code
                player2.keyPress = true
                break;
        }
    }

    document.onkeyup = (e) => {
        if (e.code === 'KeyQ' || e.code === 'KeyA') {
            player1.keyPress = false
        }
        if (e.code === 'KeyO' || e.code === 'KeyL') {
            player2.keyPress = false
        }
    }

    start()
}