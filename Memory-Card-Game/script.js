document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.querySelector(".game-board");
    const resetButton = document.getElementById("resetGame");
    const startButton = document.getElementById("startGame");
    const pauseButton = document.getElementById("pauseGame");
    const difficultySelect = document.getElementById("difficulty");
    const timeDisplay = document.getElementById("time");

    const flipSound = document.getElementById("flipSound");
    const matchSound = document.getElementById("matchSound");
    const winSound = document.getElementById("winSound");

    let emojis = ["🍕", "🚀", "🎸", "🎮", "🎧", "💎", "🔥", "🦄"];
    let shuffledCards = [];
    let flippedCards = [];
    let matchedCards = [];
    let timer;
    let seconds = 0;
    let isPaused = false;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard(rows, cols) {
        clearInterval(timer);
        seconds = 0;
        timeDisplay.textContent = seconds;
        gameBoard.innerHTML = "";
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

        let totalCards = rows * cols;
        let gameEmojis = shuffle([...emojis, ...emojis]).slice(0, totalCards / 2);
        shuffledCards = shuffle([...gameEmojis, ...gameEmojis]);

        shuffledCards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.innerHTML = emoji;
            gameBoard.appendChild(card);
            card.addEventListener("click", flipCard);
        });

        startTimer();
    }

    function startTimer() {
        clearInterval(timer);
        isPaused = false;
        timer = setInterval(() => {
            if (!isPaused) {
                seconds++;
                timeDisplay.textContent = seconds;
            }
        }, 1000);
    }

    function pauseGame() {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(timer);
            pauseButton.textContent = "▶ Resume";
        } else {
            startTimer();
            pauseButton.textContent = "⏸ Pause";
        }
    }

    function flipCard() {
        if (isPaused || flippedCards.length >= 2 || this.classList.contains("flip")) return;

        flipSound.play();
        this.classList.add("flip");
        this.innerHTML = this.dataset.emoji;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            matchSound.play();
            matchedCards.push(card1, card2);
        } else {
            card1.classList.remove("flip");
            card1.innerHTML = "";
            card2.classList.remove("flip");
            card2.innerHTML = "";
        }
        flippedCards = [];

        if (matchedCards.length === shuffledCards.length) {
            clearInterval(timer);
            setTimeout(() => {
                winSound.play();
                alert(`🎉 You won in ${seconds} seconds!`);
            }, 300);
        }
    }

    startButton.addEventListener("click", () => {
        let level = difficultySelect.value;
        if (level === "easy") createBoard(4, 4);
        else if (level === "medium") createBoard(6, 6);
        else createBoard(8, 8);
    });

    resetButton.addEventListener("click", () => {
        createBoard(4, 4);
    });

    pauseButton.addEventListener("click", pauseGame);

    createBoard(4, 4);
});
