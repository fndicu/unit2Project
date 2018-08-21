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

/**Listens for a click event on the card deck and starts the game and clock.
 * once 2 cards are clicked, the function checks for a match, and incriments the moves counter
 * If all 16 cards match the functions triggers the game over function
 */
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

/**This fucntions checks to see if a click is in the valid game play area
 * valid clicks include elements with the card calss and excludes those that are already matched
 */
function isClickValid(clickTarget) {
    return(
        clickTarget.classList.contains('card')&&
        !clickTarget.classList.contains('match')&&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
    );
}

/** This function toggles a cards show class to reveal the hidden symbol */
function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
};

/** This function adds the toggled cards to the card array for evaluation */
function addToggleCard(card) {
    toggledCards.push(card);
}

/** This function evaluates if the cards in the card array are a match
 * if they match, they remain toggled 
 * if they don't match, they are reverted to their original state after half a second
 */
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

/** This function randomizes the position of the cards in the deck */
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards){
        deck.appendChild(card);
    }
}
shuffleDeck();

/** This function incriments the moves counter by one */
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

/** This function checks the current score
 * if the player makes more than 16 moves they receive two stars
 * if they make more than 20 moves, they receive one star
 */
function checkScore() {
    if (moves === 16 || moves === 20){
        hideStar();
    }
}
/** This function hides a star from the score panel */
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList){
        if(star.style.display !== 'none'){
            star.style.display = 'none';
            break;
        }
    } 
}

/** This function starts the clock and increments by one second at a time */
function startClock() {
    time = 0;
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

/**This function converts seconds to readable time */
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

/** This function stops the clock in the score panel
 * The function stops the displayTime function from incrementing
 */
function stopClock() {
    clearInterval(clockId);
}

/** This function randomizes items in an array
 * // Shuffle function from http://stackoverflow.com/a/2450976

 */
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
/** This function toggles the score modal */
function toggleModal() {
    const modal = document.querySelector('.modal');
    modal.classList.toggle('hide')
}

/** This function fetches the stars a player has earned durring the game */
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

/** This function fills the score modal with the players stats
 * It fetches the time, number of moves, and number of stars
 * Then it writes the stats to the modal
 */
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

/** When all 16 cards match, this function stops the game and pauses the clock, as well as toggles the score modal */
function gameOver(){
    if(matchedCards.length === 16){
        console.log('gameOver');
        stopClock();
        writeModalStats();
        toggleModal();
    }
    
}

/** This selector toggles the modal off */
document.querySelector('.modal-cancel').addEventListener('click', () => {
    toggleModal();
});

/** This selector restarts the game by reloading the page */
document.querySelector('.modal-replay').addEventListener('click', () =>{
    function restart() {
        location.reload()
    }
    restart();
})
