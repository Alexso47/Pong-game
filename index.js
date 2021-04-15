let player1Wins = 0
let player2Wins = 0
let player1Name = playerLeftName.textContent
let player2Name = playerRightName.textContent
let gameMode = modeNum.textContent

const TIME_BY_MODE = {
    'difficulty 1': 100,

    'difficulty 2': 75,

    'difficulty 3': 40,

    'difficulty 4': 30,

    'difficulty 5': 20
}

window.onload = () => {
    modeNum.textContent = 'difficulty ' + mode.value
}

mode.addEventListener('change', (event) => {
    modeNum.textContent = 'difficulty ' + event.target.value
})

const showInput = (opt) => {
    const input = opt === 0 ? leftInput : rightInput
    input.classList.toggle('hideInput')
}

const changeName = (event, opt) => {
    event.preventDefault()
    const input = opt === 0 ? leftInput : rightInput
    const name = opt === 0 ? playerLeftName : playerRightName
    name.textContent = input.value !== '' ? input.value : name.textContent
    showInput(opt)
}

const handleStart = () => {
    menu.classList.toggle("hideMenu")
    setTimeout(() => {
        player1Name = playerLeftName.textContent
        player2Name = playerRightName.textContent
        bar1.textContent = playerLeftName.textContent
        bar2.textContent = playerRightName.textContent
        gameMode = modeNum.textContent
        menu.style.display = 'none'
        pong.style.display = 'block'
        game()
    }, 1800)
}

const game = function () {
    let time = TIME_BY_MODE[gameMode]
    let movement = 20;
    let movementBar = 20;
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
        ball.style.left = 0
        ball.state = 1
        ball.direction = 1 // right 1, left 2

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
        roundWinner.textContent = winner == 0 ? player1Name + ' wins' : player2Name + ' wins'
        console.log(roundWinner)
        roundResult.style.display = 'flex'

        setTimeout(() => {
            if (winner === 0) {
                player1Wins++
            }
            else {
                player2Wins++
            }
            playerLeftScore.textContent = player1Wins
            playerRightScore.textContent = player2Wins

            document.body.style.background = 'black'
            roundResult.style.display = 'none'
            menu.classList.toggle("hideMenu")
            menu.style.display = 'flex'
            pong.style.display = 'none'

        }, 5000)
    }

    const play = () => {
        moveBall()
        moveBar()
        checkIfLost()
    }

    const checkIfLost = () => {
        if (ball.offsetLeft >= width) {
            winner = 0
            stop()
        }
        if (ball.offsetLeft <= 0) {
            winner = 1
            stop()
        }
    }

    // Ball stuff
    const moveBall = () => {
        checkStateBall()
        switch (ball.state) {
            case 1: // right down
                ball.style.left = (ball.offsetLeft + movement) + 'px'
                ball.style.top = (ball.offsetTop + movement) + 'px'
                break
            case 2: // right up
                ball.style.left = (ball.offsetLeft + movement) + 'px'
                ball.style.top = (ball.offsetTop - movement) + 'px'
                break
            case 3: // left down
                ball.style.left = (ball.offsetLeft - movement) + 'px'
                ball.style.top = (ball.offsetTop + movement) + 'px'
                break
            case 4: // left up
                ball.style.left = (ball.offsetLeft - movement) + 'px'
                ball.style.top = (ball.offsetTop - movement) + 'px'
                break
        }
    }

    const checkStateBall = () => {
        if (collidePlayer2()) {
            ball.direction = 2
            if (ball.state === 1) {
                ball.state = 3
            }
            if (ball.state === 2) {
                ball.state = 4
            }
        }
        else if (collidePlayer1()) {
            ball.direction = 1
            if (ball.state === 3) {
                ball.state = 1
            }
            if (ball.state === 4) {
                ball.state = 2
            }
        }
        ballMechanics()
    }

    const ballMechanics = () => {
        if (ball.direction === 1) {
            if (ball.offsetTop >= height) {
                ball.state = 2
            }
            else if (ball.offsetTop <= 0) {
                ball.state = 1
            }
        } else {
            if (ball.offsetTop >= height) {
                ball.state = 4
            }
            if (ball.offsetTop <= 0) {
                ball.state = 3
            }
        }
    }

    // game logic
    const collidePlayer1 = () => {
        if (ball.offsetLeft <= (bar1.clientWidth) &&
            ball.offsetTop >= bar1.offsetTop &&
            ball.offsetTop <= (bar1.offsetTop + bar1.clientHeight)) {
            return true;
        }
        return false
    }

    const collidePlayer2 = () => {
        if (ball.offsetLeft >= (width - bar2.clientWidth) &&
            ball.offsetTop >= bar2.offsetTop &&
            ball.offsetTop <= (bar2.offsetTop + bar2.clientHeight)) {
            return true;
        }
        return false
    }

    // Movement and key detection
    const moveBar = () => {
        if (player1.keyPress) {
            if (player1.key == 'KeyQ' && bar1.offsetTop >= 0)
                bar1.style.top = (bar1.offsetTop - movementBar) + "px";
            if (player1.key == 'KeyA' && (bar1.offsetTop + bar1.clientHeight) <= height)
                bar1.style.top = (bar1.offsetTop + movementBar) + "px";

        }
        if (player2.keyPress) {
            if (player2.key == 'KeyO' && bar2.offsetTop >= 0)
                bar2.style.top = (bar2.offsetTop - movementBar) + "px";
            if (player2.key == 'KeyL' && (bar2.offsetTop + bar2.clientHeight) <= height)
                bar2.style.top = (bar2.offsetTop + movementBar) + "px";
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