const suits = ['hearts','spades','diamonds','clubs'];
const cardsWrapper = document.querySelector('.cards-wrapper');
const buttonsWrapper = document.querySelector('.btn-wrapper');
let buttons; // query selector for the buttons
let showBoolean = true; // to know if the cards are shown or hidden
let cssBoolean = false; // to know if the cards are rendered as images or css
let domCards = {}; // querySelector for the dom cards
let deck; // the deck that will be displayed on the dom elements

// returns a 'div' element with the classes given in an array
function makeDiv(classArray){
  const div = document.createElement('div');
  classArray.forEach(element => div.classList.add(element));
  return div;
}

// useful when needed to append multiple child elements
function injectChildren(target,injections){
  injections.forEach(element => target.appendChild(element));
}


// returns (A||2||3||...||10||J||Q||K), useful for the css redndering
function getLogo(i){
  let logo;
  if(i===1){
    logo = 'A';
  } else if(i===11){
    logo = 'J';
  } else if(i===12){
    logo = 'Q';
  } else if(i===13){
    logo = 'K';
  } else logo = i;
  return logo;
}

// function that returns the first letter of a suit and capitalised suit, useful for the css rendering
function getLetter(i){
  let letter = {};
  if(i==='hearts'){
    letter.small = 'H';
    letter.big = 'Hearts';
  } else if(i==='spades'){
    letter.small = 'S';
    letter.big = 'Spades'
  } else if(i==='diamonds'){
    letter.small = 'D';
    letter.big = 'Diamonds'
  } else {
    letter.small = 'C';
    letter.big = 'Clubs'
  }
  return letter;
}

// Create deck of 52 cards ordered by suit and value
function suitOrderedDeck() {
  const cards = [];
  for(let j=0; j<suits.length;j++){
    const suit = suits[j];
    const letter = getLetter(suit);
    for (let i = 1; i <= 13; i += 1) {
      const logo = getLogo(i);
      const cardObject = {
        value: i,
        suit,
        className: suit + '-' + i,
        logo,
        letter
      };
      cards.push(cardObject);
    }
  }
  return cards;
}

// returns a 52 cards deck ordered by value(AAAA,2222,....,KKKK)
function valueOrderedDeck(){
  const cards = [];
  for(let i=1; i<=13; i++){
    const logo = getLogo(i);
    for(let j=0; j<suits.length; j++){
      const suit = suits[j];
      const letter = getLetter(j);
      const cardObject = {
        value: i,
        suit,
        className: suit + '-' + i,
        logo,
        letter
      };
      cards.push(cardObject);
    }
  }
  return cards;
}

// this function returned a 52 cards deck randomly ordered
function shuffleDeck(){
  const deck = suitOrderedDeck();
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


// this function creates the dom element where to render the css option for the cards
function createVisualCard(){
  const visualCard = makeDiv(['visual-card']);

  function makeVisualElement(suitOrValue){
    const visualElement = makeDiv(['visual-item',suitOrValue]);
    return visualElement;
  }

  const visualLeft = makeDiv(['visual-side']);
  const valueLeft = makeVisualElement('visual-value');
  const suitLeft = makeVisualElement('visual-suit');
  injectChildren(visualLeft,[valueLeft,suitLeft]);

  const visualCenter = makeDiv(['visual-center']);
  const valueCenter = makeVisualElement('visual-value');
  const suitCenter = makeVisualElement('visual-suit');
  injectChildren(visualCenter,[valueCenter,suitCenter]);

  const visualRight = makeDiv(['visual-side','rotated']);
  const valueRight = makeVisualElement('visual-value');
  const suitRight = makeVisualElement('visual-suit');
  injectChildren(visualRight,[valueRight,suitRight]);

  injectChildren(visualCard,[visualLeft,visualCenter,visualRight]);

  return visualCard;
}

// function useful to group by 3 a selctorAll, necessary to build the css render
function groupArray(entry,index){
  const result = [];
  let counter=0;
  for(let a=0; a<entry.length/index; a++){
    const group = [];
    for(let b=0; b<index; b++){
      group.push(entry[counter]);
      counter++
    }
    result.push(group);
  }
  return result;
}

function createDomCards(){
  // create the dom elements cards
  for(let a=0; a<52; a++){
    const cardElement = makeDiv(['card']);
    const cssCard = createVisualCard();
    cardElement.appendChild(cssCard);
    cardsWrapper.appendChild(cardElement);
  }

  // applying background to render the images
  domCards.cardImages = document.querySelectorAll('.card');

  // needed to switch between rendered images or rendered css
  domCards.cssCards = document.querySelectorAll('.visual-card');

  // each css rendered card have to show 3 times the value and 3 times the suits
  // so we group the selector by 3, and each group belongs to a single card
  domCards.cssValues =groupArray(document.querySelectorAll('.visual-value'),3);
  domCards.cssSuits =groupArray(document.querySelectorAll('.visual-suit'),3);

}

function expand(element,index){
  // moves to the right the card depending on index
  const position = 28*index;
  element.style.left = position + 'px';
}

function shrink(element){
  // brings again to the left
  element.style.left = 0;
}

function expandCards(){
  domCards.cardImages.forEach((card,a) => expand(card,a));
}

function shrinkCards(){
  domCards.cardImages.forEach((card) => shrink(card));
}

// assigns to the domcards elements the relative card from the deck of cards
function assignCards(){

  for(let a=domCards.cardImages.length-1; a>=0; a--){
    if(domCards.cardImages[a].classList.length===1){
      domCards.cardImages[a].classList.add(deck[a].className)
    } else {
      domCards.cardImages[a].classList.remove(domCards.cardImages[a].classList[1]);
      domCards.cardImages[a].classList.add(deck[a].className);
    }
  }
}

// assings the relative css values to be be diplayed instead of the images
function assignCss(){

  for(let a=0; a<52; a++){
    if(deck[a].suit === 'hearts' || deck[a].suit === 'diamonds'){
      domCards.cssCards[a].classList.add('color-red');
    } else domCards.cssCards[a].classList.remove('color-red');
    for(let b=0; b<3; b++){
      domCards.cssValues[a][b].innerText = deck[a].logo;
      domCards.cssSuits[a][b].innerText = b===1 ? deck[a].letter.big : deck[a].letter.small ;
    }
  }
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  // removes the 'start-game' button and creates other buttons
  const buttonsText = ['Shuffle', 'Hide cards', 'Magic','Switch to CSS', 'Magic 4','Reverse'];
  for(let a=0; a<buttonsText.length; a++){
    const button = document.createElement('button');
    button.innerText = buttonsText[a];
    button.classList.add('btn', 'btn-lg', 'btn-secondary', 'mr-2');
    buttonsWrapper.appendChild(button);
  }
  document.getElementById('start-game').remove();
  buttons = buttonsWrapper.children;
}

// option to click to show or hide the cards
function showHide(target){
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

// option to click to display randomly the deck
function shuffle(target){
  target.addEventListener('click', function(){
    shrinkCards();
    deck = shuffleDeck();
    setTimeout(function(){
      assignCards();
      assignCss();
    },1000);
    setTimeout(expandCards,1100);
  })
}

// option to click to sort the cards by suit
function magic(target){
  target.addEventListener('click', function(){
    shrinkCards();
    deck = suitOrderedDeck();
    setTimeout(function(){
      assignCards();
      assignCss();
    },1000);
    setTimeout(expandCards,1100);
  })
}

// option to click to reorder the cards
function magicFour(target){
  target.addEventListener('click', function(){
    shrinkCards();
    deck = valueOrderedDeck();
    setTimeout(function(){
      assignCards();
      assignCss();
    },1000);
    setTimeout(expandCards,1100);
  })
}

// option to render images or css styled cards
function showCss(target){
  target.addEventListener('click', function(){
    if(cssBoolean){
      target.innerText = 'Switch to CSS';
      cardsWrapper.classList.remove('only-css');
    } else {
      target.innerText = 'Switch to images';
      cardsWrapper.classList.add('only-css');
    }
    cssBoolean = !cssBoolean;
  })
}

// option to display the cards in a reverted order
function revert(target){
  target.addEventListener('click', function(){
    shrinkCards();
    deck = deck.reverse();
    setTimeout(function(){
      assignCards();
      assignCss();
    },1000);
    setTimeout(expandCards,1100);
  })
}

const functionsArray = [shuffle,showHide,magic,showCss,magicFour,revert];
// Function to start the game by clearing the buttons wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  deck = suitOrderedDeck();
  createButtons();
  createDomCards();
  assignCards();
  assignCss();
  setTimeout(expandCards,500);
  functionsArray.forEach(function(event,index){
    event(buttons[index]);
  })
}

document.getElementById('start-game').addEventListener('click', startGame);
