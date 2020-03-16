const Card = require('./Card');

const NAMES = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A' ];
const SUITS = [ 'H', 'C', 'D', 'S' ];

module.exports = class Deck {
    constructor(min = 1, max = NAMES.length) {
        this.deck = this.createDeck(min - 1, max - 1);
        this.shuffle();
    }

    createDeck(min, max) {
        let cards = [];

        for (let s = 0; s < SUITS.length; s++) {
            for (let n = 0; n < NAMES.length; n++) {
                if (n >= min && n <= max) cards.push(new Card(NAMES[n], n + 2, SUITS[s], 'pile'));
            }
        }

        return cards;
    }

    shuffle() {
        let shuffled = [];

        while (this.deck.length > 0) {
            let randomIndex = Math.floor(Math.random() * this.deck.length);
            shuffled.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1);
        }

        this.deck = shuffled;
    }

    getLastCard() {
        return this.deck[this.deck.length - 1];
    }

    hasNext() {
        return this.deck.length > 0;
    }

    next() {
        return this.deck.pop();
    }
};
