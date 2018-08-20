/***************Variables*********************/
const cards =  document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
let time = 0;
const minutes = time / 60;
const hour = time % 60;
const modal = document.getElementById('gameOver');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let clockId;
let matchedCards = document.getElementsByClassName('match');
/***************Functions*********************/

deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkMatch(clickTarget);
            addMove();
            checkScore();
        }
        if (matchedCards.length === 16) {
                gameOver()
            }
       
    } 
});

function isClickValid(clickTarget) {
    return(
        clickTarget.classList.contains('card')&&
        !clickTarget.classList.contains('match')&&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
    );
}

function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
};

function addToggleCard(card) {
    toggledCards.push(card);
}

function checkMatch() {
    if(toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className){
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match');
            toggledCards = [];
        } else{
            setTimeout(() => {
                toggleCard(toggledCards[0]);
                toggleCard(toggledCards[1]);
                toggledCards = [];
            }, 500);
        }
}

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards){
        deck.appendChild(card);
    }
}
shuffleDeck();

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    if (moves === 16 || moves === 20){
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList){
        if(star.style.display !== 'none'){
            star.style.display = 'none';
            break;
        }
    } 
}

function startClock() {
    time = 0;
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

function stopClock() {
    clearInterval(clockId);
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/* modal js */ 
function toggleModal() {
    const modal = document.querySelector('.modal');
    modal.classList.toggle('hide')
}
function getStars(){
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if(star.style.display !== 'none') {
            starCount ++;
        }
    }
    return starCount;
}
function writeModalStats() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const moveStat = document.querySelector('.modal-moves');
    const starsStat = document.querySelector('.modal-stars');
    const stars = getStars();

    timeStat.innerHTML =   `Time: ${clockTime}`;
    moveStat.innerHTML =    `Moves: ${moves}`;
    starsStat.innerHTML =   `Stars: ${stars}`;
}

function gameOver(){
    if(matchedCards.length === 16){
        console.log('gameOver');
        stopClock();
        writeModalStats();
        toggleModal();
    }
    
}

document.querySelector('.modal-cancel').addEventListener('click', () => {
    toggleModal();
});

document.querySelector('.modal-replay').addEventListener('click', () =>{
    function restart() {
        location.reload()
    }
    restart();
})
