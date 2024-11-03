
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Magic Paper",
        type: "Paper",
        img: `${pathImages}paper.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Diamond Stone",
        type: "Stone",
        img: `${pathImages}stone.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Blunt Scissors",
        type: "Scissors",
        img: `${pathImages}scissors.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

const cardImages = [
    "./src/assets/icons/card-1.png",
    "./src/assets/icons/card-2.png",
    "./src/assets/icons/card-3.png",
    "./src/assets/icons/card-4.png",
    "./src/assets/icons/card-5.png"
];

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    const randomImage = cardImages[Math.floor(Math.random() * cardImages.length)];
    cardImage.setAttribute("src", randomImage);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");



    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "./src/assets/icons/avatar.png";
    state.cardSprites.name.innerText = "Jogo de Cartas ";
    state.cardSprites.type.innerText = "JoKenPo";
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(ComputerCardId)) {
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(ComputerCardId)) {
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "./src/assets/icons/avatar.png";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch { }
}


let isMuted = true; 

async function setupBackgroundMusic() {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5; 
    bgm.muted = isMuted;

    const muteButton = document.getElementById("muteButton");
    muteButton.addEventListener("click", toggleMute); 

    await bgm.play(); 
    bgm.muted = isMuted; 
}

function toggleMute() {
    const bgm = document.getElementById("bgm");
    isMuted = !isMuted; 
    bgm.muted = isMuted; 

    const muteButton = document.getElementById("muteButton");
    if (isMuted) {
        muteButton.innerHTML = '<i class="fas fa-volume-mute" style="font-size: 24px; color: #fff; width: 60px;"></i>'; 
    } else {
        muteButton.innerHTML = '<i class="fas fa-volume-up" style="font-size: 24px; color: #31d8618e; width: 60px;"></i>'; 
    }
}

function init() {
    ShowHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    setupBackgroundMusic();
}

init();