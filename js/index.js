const suits = ['hearts','spades','diamonds','clubs'];
const cardsWrapper = document.querySelector('.cards-wrapper');
const buttonsWrapper = document.querySelector('.btn-wrapper');
let buttons;
let showBoolean = true; // to know if the cards are shown or hidden
let domCards = []; // querySelector for the dom cards
let deck; // the deck that will be displayed each shuffle or reorder
function orderedDeck() {
  const cards = [];
  // Create deck of 52 cards ordered by suit and value
  for(let j=0; j<suits.length;j++){
    const suit = suits[j];
    for (let i = 1; i <= 13; i += 1) {
      const cardObject = {
        value: i,
        suit,
        className: suit + '-' + i
      };
      cards.push(cardObject);
    }
  }
  return cards;
}

function shuffleDeck(){
    // Create a deck of 52 cards randomly ordered
  const deck = orderedDeck();
  let max = 52;
  const shuffledDeck = [];
  for(let a=0;a<52;a++){
    const random = Math.floor(Math.random() * max);
    shuffledDeck.push(deck[random]);
    deck.splice(random,1);
    max--;
  }
  return shuffledDeck;
}


function createDomCards(){
  // create the dom elements cards
  for(let a=0; a<52; a++){
    const positionFromLeft = a * 28;
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.style.left = `${positionFromLeft}px`;
    cardsWrapper.append(cardElement);
  }
  domCards = document.querySelectorAll('.card');
}

function assignCards(){
  // assigns to the domcards elements the relative card from the deck of cards
  for(let a=0; a<domCards.length; a++){
    if(domCards[a].classList.length===1){
      domCards[a].classList.add(deck[a].className)
    } else {
      domCards[a].classList.remove(domCards[a].classList[1]);
      domCards[a].classList.add(deck[a].className);
    }
  }
}
// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  // removes the 'start-game' button and creates 3 more buttons
  const buttonsText = ['Shuffle', 'Hide cards', 'Magic'];
  for(let a=0; a<3;a++){
    const button = document.createElement('button');
    button.innerText = buttonsText[a];
    button.classList.add('btn', 'btn-lg', 'btn-secondary', 'mr-2');
    buttonsWrapper.appendChild(button);
  }
  document.getElementById('start-game').remove();
  buttons = buttonsWrapper.children;
}

function showHide(target){
  // option to click and show or hide the cards
  target.addEventListener('click', function(){
    if(showBoolean){
      showBoolean = !showBoolean;
      cardsWrapper.classList.add('hidden');
      target.innerText = 'Show cards';
    } else {
      showBoolean = !showBoolean;
      cardsWrapper.classList.remove('hidden');
      target.innerText = 'Hide cards';
    }
  })
}

function shuffle(target){
  // option to click to display randomly the deck
  target.addEventListener('click', function(){
    deck = shuffleDeck();
    assignCards();
  })
}

function magic(target){
  // option to click to reorder the cards
  target.addEventListener('click', function(){
    deck = orderedDeck();
    assignCards();
  })
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  deck = orderedDeck();
  createButtons();
  createDomCards();
  assignCards();
  showHide(buttons[1]);
  shuffle(buttons[0]);
  magic(buttons[2]);
}

document.getElementById('start-game').addEventListener('click', startGame);
